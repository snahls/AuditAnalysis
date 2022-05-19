#!/usr/bin/env python3

#########################################################################################################################
# Date: 27 May 2020
# This is a server file developed using Flask-restful.
#
# ------------------------------------------------------------
#
# Version : 0.1
# Status  : Initial build
# Author  : Pushkaraj Lahankar <plahanka@cisco.com>
#
# ------------------------------------------------------------
#########################################################################################################################


from flask import Flask, render_template, request, redirect, url_for, send_from_directory, session, jsonify, make_response
from werkzeug.utils import secure_filename
import datetime
import os
import pymongo
import json
from bson.objectid import ObjectId
import math
import requests
import urllib3
from flask_cors import CORS
from subprocess import Popen, PIPE, STDOUT, run
from flask_pingfederate import AuthorizationCodeFlow
from werkzeug.contrib.cache import FileSystemCache
import logging
import os.path
import time

email_id = ""
BearerToken = ""
scriptPath = os.path.dirname(os.path.realpath(__file__))

app = Flask(__name__)
CORS(app)

############################################################################################################
app.secret_key = "_j=Y&W2V#7b@sB"
app.env = 'development'
app.config['PF_CLIENT_ID'] = 'NAA'
app.config['PF_CLIENT_SECRET'] = '_j=Y&W2V#7b@sB'

auth = AuthorizationCodeFlow(
app=app, # or use auth.init_app() later
scope='openid '
            'profile '
            'email phone',# Gives you access to the user's info. You probably want this
 # Gives you user's full name, title, company and access level
# extra fields in the user_info
client_id='NAA',

client_secret='_j=Y&W2V#7b@sB',

base_url='https://cloudsso.cisco.com',  # The base url of your SSO
# All your instances need to be able to access this path,
# or use another backend like Redis
cache=FileSystemCache('/tmp/flask_pingfederate_cache')
)

############################################################################################################


@app.route('/')
def index():
     global email_id
     global BearerToken
     if not auth.is_authenticated:
                # redirect to login and return to this page if successful
                BearerToken = auth.access_token
                return auth.login(return_to=request.url)
     else:

            response = make_response(redirect("http://auditanalysis.cisco.com:3000"))
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.set_cookie('naa_auth',auth.access_token,max_age=43200)
            response.set_cookie('naa_User',auth.get_user_info()["given_name"],max_age=43200)
            response.set_cookie('naa_email',auth.get_user_info()["email"],max_age=43200)
            email_id = auth.get_user_info()["email"]
  
            return response





#<--------------------Code for SSO Auth----------------------------->


def ValidateToken(token,SR):
        bearer="Bearer "+token
        header={"Authorization": bearer}
        url="https://scripts.cisco.com/api/v2/attachments/"+SR
        r=requests.get(url,headers=header)
        print(r.json())
        if(r.status_code==401 or r.status_code==403):
                web_secret()
        else:
                return




@app.route('/AuthStatus',methods=['GET'])
def AuthStatus():
        print(auth.is_authenticated)
        if not auth.is_authenticated:
                return {"Authenticated": "false"}
        else:
                return {"Authenticated":"true"}


@auth.after_login
def update_user_info():
        print("******************************************************************************",auth.get_user_info())
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
#@app.route('/secret')
def web_secret():
        print(auth.is_authenticated)
        if not auth.is_authenticated:
                # redirect to login and return to this page if successful
                print(auth.access_token)
                return auth.login(return_to=request.url)
        print(auth.access_token)
        print(auth.authorization_header)
        response = make_response(redirect(location='http://10.127.250.101/',code=302))
        response.set_cookie('naa_auth',auth.access_token,max_age=43200)
        response.set_cookie('naa_User',auth.get_user_info()["given_name"],max_age=43200)
        return response

@app.route('/logout',methods=['GET'])
def logout():
        print("called logout")
        auth.logout(return_to=request.url)
        return {"Logout": "Succesful"}


#<--------------------Code for SSO Auth----------------------------->




if __name__ == '__main__':
     app.run(host='0.0.0.0' , port = 5000)
