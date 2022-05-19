import os

from flask import Flask, jsonify
from flask_pingfederate import OAuth2Client

app = Flask(__name__, template_folder='templates')
app.secret_key = os.getenv('SECRET_KEY')

# This is a demo so debug mode is enabled for maximal output
# DON'T DO THIS IN PRODUCTION
app.env = 'development'

# Initialize the extension
oa2c = OAuth2Client(
    app=app,  # or use auth.init_app() later
    base_url="https://cloudsso.cisco.com/",  # The base url of your SSO
    client_id=os.getenv('PF_CLIENT_ID'),
    client_secret=os.getenv('PF_CLIENT_SECRET'),
)


@app.route('/api/secret', methods=['GET'])
@oa2c.valid_access_token_required
def api_secret():
    return jsonify({"Secret": "It was Earth all along!"})


if __name__ == '__main__':
    app.run(host='localhost', debug=True, port=8000)

