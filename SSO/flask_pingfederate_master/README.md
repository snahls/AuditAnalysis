# Flask-PingFederate

A Flask extension that easily adds SSO authentication to your flask application.
It's been developed and tested for PingFederate deployments but might work on other OIDC providers.

The only OAuth2 flow implemented in this code is Authorization Code flow.  The reason for this is that for interactive web apps existing of mostly server-side logic, for which Flask is very well suited, this is the 'right' flow to use.  You should use this flow if your app offers an interactive interface that calls backend APIs on behalf of a user.

Flask-PingFederate uses `werkzeug.contrib.cache` to cache the tokens in the backend. No credentials are stored on the client in cookies, only a session cookie.

Flask-PingFederate requires Python3.6+. There is 0% chance I will add python2 support, don't request it.

This module is under active development and will have minor (maybe breaking) changes in the future. 

## Before you start

To get your `CLIENT_ID` and `CLIENT_SECRET`:

  1. Go to https://wampmtui.cloudapps.cisco.com
  2. There, choose on the left `OAuth Clients`, and click the button `Create OAuth Client`
  3. Choose a unique `Client ID`, set `Environment` to `PRD` and enter a `Description`
  4. Select the following from `Authorization Grant Types`: `Authorization Code`, `Client Credentials` and `Access Token Validation`
  5. Click `Generate` to generate a `CLIENT_SECRET`. Copy it _immediately_ after as this is the only time you will have access to it in this interface
  6. Choose the following `Scopes`: `cecauth`, `profile`, `openid`, `email`, `phone`, `address`
  7. Under `Owners`, type your CEC id, hit search, and select yourself 
  8. The `OAuth Redirect URI` will be the hostname where you're hosting the app + the path of the callback.
     For the DemoApp included, it will be `http://localhost:8000/oauth2/callback`
  9. Click `Submit`


Save the CLIENT_ID and CLIENT_SECRET values for use in your test.

## QuickStart Web App

Please also check the example/ directory for a more elaborate working example 

```python
from flask import Flask, request, session
from flask_pingfederate import AuthorizationCodeFlow

app = Flask(__name__)
app.secret_key = 'Really secret key that you must change nonetheless!'

auth = AuthorizationCodeFlow(
    client_id='YOUR CLIENT ID', 
    client_secret='YOUR CLIENT SECRET',
    scope='openid profile email address phone cecauth', 
    base_url='https://cloudsso.cisco.com',
)

auth.init_app(app)

@auth.after_login
def update_user_info():
    session['user_info'] = auth.get_user_info()

@app.errorhandler(401)
def authorization_failure(e):
    return f"Authentication Failed: {e}"

@app.route('/secret')
@auth.login_required
def secret():
    return f"A secret for {session['user_info']['given_name']}"

```

Flask-PingFederate follows the anatomy of your regular flask extension.
All configuration parameters can be provided when instantiating, or via app.config using the keys 

  * PF_CLIENT_ID 
  * PF_CLIENT_SECRET 
  * PF_SCOPE
  * PF_BASE_URL 
  * PF_SESSION_KEY 
  * PF_URL_PREFIX 

Also take note of the url you're hosting your application under. 
When creating your CLIENT_ID and CLIENT_SECRET in the OAuth2 Portal, you also need to set a `redirect uri` which is where the user will be redirected back to in your application after successful auth.  Flask-PingFederate uses a default url `/oauth2/callback/` for this, so if you're running the DemoApp.py in the examples, the redirect_uri you have to enter will be `http://localhost:8000/oauth2/callback`
Once you have the above set up, you can protect resources as follows:


```python
@app.route('/secret')
@auth.login_required
def secret():
    return "Secret"
```

```auth.login_required``` will return 401 if the user is not authenticated. 
It's a pretty good idea to write your own 401 handler, which fortunately is pretty easy in Flask

```python
@app.errorhandler(401)
def authorization_failure(e):
    return f"Authentication Failed: {e}"
``` 

The ```auth.login_required``` decorator is pretty basic, sometimes you will want to implement your own.

```python
@app.route('/another_secret')
def another_secret():
    if not auth.is_authenticated:
        # Try to login, and redirect back here if successful
        return auth.login(return_to=request.url)
    return "Another Secret"
```

To get information about the user that is logged in, you can use ```auth.get_user_info()```.

You probably want to do this only once, right after the user has logged in. This extension makes that very easy by letting you specify handlers for `auth.after_login`, `auth.after_logout` and `auth.after_refresh`

```python
@auth.after_login
def update_user_info():
    session['user_info'] = auth.get_user_info()
```

This makes an HTTP API call in the backend to the OIDC `userinfo_endpoint` so it is blocking.

## Caching

When instantiating the extension, you have an optional parameter `cache=werkzeug.contrib.cache.SimpleCache()`
This default setting allows you to run a single flask instance, but when using flask behind uWSGI or Gunicorn you will probably want to configure the cache with something like ```UWSGICache``` or ```RedisCache```, both are available in ```werkzeug.contrib.cache``` .

The reason for this is that in a production environment, you likely have multiple instances of your app running, but they need to share this authentication token info to allow for requests to come in on any instance. 

It's possible to implement your own, by subclassing `werkzeug.contrib.cache.BaseCache`

```python
from flask import Flask
from flask_pingfederate import AuthorizationCodeFlow

from werkzeug.contrib.cache import RedisCache

app = Flask(__name__, template_folder='./templates')
app.secret_key = 'Really secret key!'

auth = AuthorizationCodeFlow(
    app=app, base_url='https://sso.your.org',
    client_id='YOUR CLIENT ID', client_secret='YOUR CLIENT SECRET',
    # Cache settings
    cache=RedisCache(host='redis.your.org')
)

```

## Running the DemoApp as a docker container

```bash

$ docker build -t flask-pingfederate-demo .

$ docker create --name flask-pingfederate-demo -it \
  -e SECRET_KEY=`python3.6 -c "import secrets; print(secrets.token_urlsafe(32))"` \
  -e PF_CLIENT_ID=YOUR_CLIENT_ID \
  -e PF_CLIENT_SECRET=YOUR_CLIENT_SECRET \
  -e PF_BASE_URL=https://cloudsso.cisco.com \
  -p 8000:8000 \
  flask-pingfederate-demo:latest

$ docker start flask-pingfederate-demo

```