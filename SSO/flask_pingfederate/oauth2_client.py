from functools import wraps, lru_cache
from hashlib import blake2b
from datetime import datetime

import requests
from jose import jwt
from jose.exceptions import JWTError

from flask import abort, request, Blueprint, g
from werkzeug.contrib.cache import SimpleCache, BaseCache

from flask_pingfederate.openid_config import OpenIDConfig
from Crypto.Protocol.KDF import scrypt


__all__ = ('OAuth2Client', )


class OAuth2Client(object):

    def __init__(self, app=None,
                 *,
                 base_url=None,
                 client_id=None, client_secret=None,
                 cache=None):

        self.app = app
        self.user_agent = f"flask-pingfederate/1.3.6 python-requests/{requests.__version__}"

        self.base_url = base_url
        self.client_id = client_id
        self.client_secret = client_secret

        # User actions
        self._after_login_handler = None
        self._after_logout_handler = None
        self._after_refresh_handler = None

        # Setup backend cache
        if cache is None:
            self.cache = SimpleCache()
        elif isinstance(cache, BaseCache):
            self.cache = cache
        else:
            raise ValueError('your backend cache must implement `werkzeug.contrib.cache.BaseCache`')

        # Utilities
        self.signer = None
        self.hasher = None

        # OpenID Config object
        self.openid_config = OpenIDConfig(self.base_url)

        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        # Config of the extension
        self.base_url = app.config.setdefault('PF_BASE_URL', self.base_url)
        self.client_id = app.config.setdefault('PF_CLIENT_ID', self.client_id)
        self.client_secret = app.config.setdefault('PF_CLIENT_SECRET', self.client_secret)

        if self.client_id is None or self.client_secret is None or self.base_url is None:
            raise ValueError('Missing config variables')

        # Setup some crypto stuff.
        # I am not a cryptographer and might do this wrong. For prod use, tweak appropriately.
        # If you don't know why or what into you should change these values,
        # google for "Key Derivation Function" or ask someone with a Security background
        cache_key_hash_key = scrypt(
            password=app.secret_key, salt=b'flask-pingfederate',
            key_len=16, N=256, r=8, p=1, num_keys=1)

        # Utils
        self.hasher = lru_cache(maxsize=256)(
            lambda value: blake2b(value.encode(), key=cache_key_hash_key, digest_size=32).hexdigest())

        # Routes
        blueprint = Blueprint('flask-pingfederate-api', __name__)
        blueprint.before_app_request(self.get_auth_data)

        app.register_blueprint(blueprint=blueprint)

    def get_auth_data(self):
        # At the beginning of each request, get the tokens from the cache
        # and store them in Flask.g, which exists for the duration of the request.
        # If the user isn't logged in yet, this value will be an empty dict

        g.flask_pingfederate_introspection = {}

    # Three decorators to make it easy for actions to trigger after login, logout, refresh
    def after_login(self, f):
        self._after_login_handler = f
        return f

    def after_logout(self, f):
        self._after_logout_handler = f
        return f

    def after_refresh(self, f):
        self._after_refresh_handler = f
        return f

    def get_verified_claims(self, id_token=None):
        # Converts the jwt id_token into verified claims
        try:
            # We can get the info in the id_token, but it needs to be verified
            u_header, u_claims = jwt.get_unverified_header(id_token), jwt.get_unverified_claims(id_token)

            # Get the key which was used to sign this id_token
            kid, alg = u_header['kid'], u_header['alg']

        except JWTError:
            return {}

        else:
            # Obtain JWT and the keys to validate the signature
            try:
                jwks_response = requests.get(
                    self.openid_config.jwks_uri,
                    headers={
                        'User-Agent': self.user_agent,
                    },
                )
            except requests.HTTPError:
                return {}
            else:
                jwks_data = jwks_response.json()

                for key in jwks_data['keys']:
                    if key['kid'] == kid:
                        payload = jwt.decode(
                            token=id_token, key=key,
                            audience=self.client_id,
                            issuer=self.openid_config.issuer)
                        return payload

        return {}

    def valid_access_token_required(self, f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if self.is_bearer_token_valid:
                return f(*args, **kwargs)
            return abort(401)
        return decorated_function

    @property
    def access_token(self):
        return g.flask_pingfederate_introspection.get('access_token')

    @property
    def token_type(self):
        return g.flask_pingfederate_introspection.get('token_type')

    @property
    def authorization_header(self):
        return f"{self.token_type} {self.access_token}"

    @property
    def uid(self):
        return g.flask_pingfederate_introspection.get('uid')

    # Bunch of useful properties
    @property
    def is_bearer_token_valid(self):
        if 'Authorization' in request.headers:
            token_type, _, access_token = request.headers.get('Authorization').partition(' ')

            if token_type == 'Bearer' and access_token:
                introspection_info = self.introspect(access_token) or {}
                if introspection_info.get('active', False):
                    g.flask_pingfederate_introspection.update({'access_token': access_token})
                    g.flask_pingfederate_introspection.update(introspection_info)
                    return True

        return False

    def introspect(self, access_token):
        """
        run introspection on the access token.
        :return: dict from the returned json
        """

        key = self.hasher(access_token)

        introspection_result = self.cache.get(key) or None
        if introspection_result is None:
            try:
                result = requests.post(
                    self.openid_config.introspection_url,
                    auth=(self.client_id, self.client_secret),
                    data={
                        "token": access_token,
                        "token_type_hint": "access_token",
                    })
                result.raise_for_status()
            except requests.HTTPError:
                return abort(403)
            else:
                introspection_result = result.json()

            if 'error' in introspection_result:
                return abort(403)

            if 'exp' in introspection_result:
                self.cache.set(
                    key,
                    introspection_result,
                    timeout=introspection_result['exp'] - int(datetime.now().timestamp())
                )

        return introspection_result
