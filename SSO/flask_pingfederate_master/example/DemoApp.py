import os

from flask import Flask, jsonify, render_template, request, session
from flask_pingfederate import AuthorizationCodeFlow

from werkzeug.contrib.cache import FileSystemCache

app = Flask(__name__, template_folder='templates')
app.secret_key = os.getenv('SECRET_KEY')

# This is a demo so debug mode is enabled for maximal output
# DON'T DO THIS IN PRODUCTION
app.env = 'development'

# You can add the config to the app or to the ext
app.config['PF_CLIENT_ID'] = os.getenv('PF_CLIENT_ID')
app.config['PF_CLIENT_SECRET'] = os.getenv('PF_CLIENT_SECRET')

# Initialize the extension
auth = AuthorizationCodeFlow(
    app=app,  # or use auth.init_app() later
    scope='openid '       # Gives you access to the user's info. You probably want this
          'profile '      # Gives you user's full name, title, company and access level
          'email phone',  # extra fields in the user_info
    base_url=os.getenv('PF_BASE_URL'),  # The base url of your SSO
    # All your instances need to be able to access this path,
    # or use another backend like Redis
    cache=FileSystemCache('/tmp/flask_pingfederate_cache')
)


# Get the OIDC user info and store it somewhere in the app
# Most likely you want to keep a user object somewhere and update it with this
# For demo purposes, we store it in the user's session.
# This stores the info in a cookie on the browser.
@auth.after_login
def update_user_info():
    session['user_info'] = auth.get_user_info()


# When Flask-PingFederate fails to authenticate the user, it returns a 401 Response
# This function handles that and allows you to show a custom page
@app.errorhandler(401)
def authorization_failure(e):
    # Base url for the app
    return render_template('unauthorized.html', e=e)


# Make the auth object available in the templates
@app.context_processor
def inject_auth():
    return dict(auth=auth)


# Base url for the app
@app.route('/')
def index():
    return render_template('index.html')


# Example Protected resource
@app.route('/user_info')
@auth.login_required
def user_info():
    return jsonify(auth.get_user_info())


# Example Protected resource
@app.route('/claims')
@auth.login_required
def claims():
    return jsonify(auth.get_verified_claims())


# Example Protected resource, with custom logic
@app.route('/secret')
def web_secret():
    if not auth.is_authenticated:
        # redirect to login and return to this page if successful
        return auth.login(return_to=request.url)
    return "Verbal Kint is Keyser S??ze!"


if __name__ == '__main__':
    app.run(debug=True, port=8000, host="localhost")

