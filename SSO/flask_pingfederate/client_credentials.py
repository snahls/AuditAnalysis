import os
import time
from urllib.parse import urljoin

import requests


class ClientCredentialsSession(requests.Session):
    """
        A special session which authenticates requests using Client Credentials
    """

    def __init__(self, client_id, client_secret, base_url=None, audience=None,
                 token_endpoint=None,  # Setting this manually saves you a http call
                 agent=None, https_proxy=None):

        super(ClientCredentialsSession, self).__init__()
        # Set the user-agent
        self.headers['User-Agent'] = agent or f'flask-pingfederate/1.4.0 python-requests/{requests.__version__}'

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
            params={
                'grant_type': 'client_credentials',
                'client_id': client_id,
                'client_secret': client_secret,
                'audience': audience
            }
        )
        try:
            self.tokens = tokens_result.json()
            if 'error' in self.tokens:
                raise ValueError(f'{self.tokens["error"]}: {self.tokens.get("error_description")}')
        except Exception:
            raise
        else:
            self.headers['Authorization'] = f'{self.tokens["token_type"]} {self.tokens["access_token"]}'
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
        return f'{self.token_type} {self.access_token}'
