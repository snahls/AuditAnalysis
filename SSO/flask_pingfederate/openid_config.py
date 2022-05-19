from requests import get
from urllib.parse import urljoin
from functools import lru_cache


class OpenIDConfig:

    def __init__(self, base_url):
        self.base_url = base_url
        self.overrides = {}

    def override(self, **kwargs):
        self.overrides.update(**kwargs)

    @property
    @lru_cache()
    def openid_config(self):
        openid_result = get(
            urljoin(self.base_url, '.well-known/openid-configuration')
        )
        openid_result.raise_for_status()

        return openid_result.json()

    @property
    def token_url(self):
        return self.overrides.get('token_endpoint') or self.openid_config['token_endpoint']

    @property
    def userinfo_url(self):
        return self.overrides.get('token_endpoint') or self.openid_config['userinfo_endpoint']

    @property
    def authorization_url(self):
        return self.overrides.get('token_endpoint') or self.openid_config['authorization_endpoint']

    @property
    def introspection_url(self):
        return self.overrides.get('token_endpoint') or self.openid_config['introspection_endpoint']

    @property
    def jwks_uri(self):
        return self.overrides.get('token_endpoint') or self.openid_config['jwks_uri']

    @property
    def issuer(self):
        return self.overrides.get('token_endpoint') or self.openid_config['issuer']
