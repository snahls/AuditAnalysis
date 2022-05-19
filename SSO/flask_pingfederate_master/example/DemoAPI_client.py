import os
import requests
from flask_pingfederate import ClientCredentialsSession

# Obtain credentials
client_id = os.getenv('PF_CLIENT_ID')
client_secret = os.getenv('PF_CLIENT_SECRET')

# Setup the client_credentials object
client_credentials = ClientCredentialsSession(
    client_id=client_id, client_secret=client_secret,
    # The base_url allows for magic auto-configuration
    base_url='https://cloudsso.cisco.com/',)

# Make the API call with the right header
result = requests.get(
    url="http://localhost:8000/api/secret",
    headers={
        "Authorization": client_credentials.authorization_header,
        "Accept": "application/json"
    })

# Print the result
print(result.json())
