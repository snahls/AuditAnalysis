import os
import time
from urllib.parse import urljoin

import requests


class ResourceOwnerSession(requests.Session):
    """
        A special session which authenticates requests using Resource Owner flow
    """

    def __init__(self,
                 client_id, client_secret,
                 username, password,
                 base_url=None, audience=None,
                 token_endpoint=None,  # Setting this manually saves you a http call
                 agent=None, https_proxy=None):

        super(ResourceOwnerSession, self).__init__()

        # Set the user-agent
        if agent is not None:
            self.headers['User-Agent'] = agent

        # Configure proxies
        self.proxies = {'https': https_proxy or os.environ.get('https_proxy')}

        if token_endpoint is None:
            if base_url is not None:
                # Use the well-known address for getting the configuration.
                openid_config = self.get(url=urljoin(base_url, '.well-known/openid-configuration')).json()
                token_endpoint = openid_config['token_endpoint']
            else:
                raise ValueError('token_endpoint and base_url cannot both be None')

        tokens_result = self.post(
            url=token_endpoint,
            data={
                'grant_type': 'password',
                'username': username,
                'password': password,
                'client_id': client_id,
                'client_secret': client_secret
            },
            # allow_redirects=False
        )
        try:
            self.tokens = tokens_result.json()
            if 'error' in self.tokens:
                raise ValueError('{err}: {desc}'.format(
                    err=self.tokens["error"], desc=self.tokens.get("error_description")))

        except Exception:
            raise
        else:
            self.headers['Authorization'] = self.authorization_header
            self.expires_on = time.time() + self.tokens['expires_in']

    @property
    def is_expired(self):
        return time.time() > self.expires_on

    @property
    def access_token(self):
        if not self.is_expired:
            return self.tokens['access_token']

    @property
    def token_type(self):
        if not self.is_expired:
            return self.tokens['token_type']

    @property
    def authorization_header(self):
        # Returns the value that should go in the Authorization header when you want to use the access_token
        # This is a convenience function
        return '{token_type} {access_token}'.format(
            token_type=self.tokens["token_type"], access_token=self.tokens["access_token"])

