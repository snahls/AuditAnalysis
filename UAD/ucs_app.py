from flask import Flask,jsonify, request, redirect, url_for, render_template,  make_response, send_file
import flask
from flask.wrappers import Response
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import os, json
from werkzeug.utils import secure_filename
from pathlib import Path
import pathlib
import os
root = os.path.dirname(os.path.realpath(__file__))
import base64
from bs4 import BeautifulSoup
import process_data
from DataBase import DataBase
import json
import requests
import webbrowser
from docxtpl import DocxTemplate, InlineImage
import docx
from datetime import date
import pytz
from insightsummary import *
from Report_Gen_Code import *


from flask import Flask, render_template, request, redirect, url_for, send_from_directory,session,jsonify, make_response
from werkzeug.utils import secure_filename
import datetime
import os
import pymongo
import json
import requests
import math
import pandas 
import urllib3
from bson.objectid import ObjectId
from io import BytesIO
from flask_pingfederate import AuthorizationCodeFlow
from werkzeug.contrib.cache import FileSystemCache



scriptPath = os.path.dirname(os.path.realpath(__file__))
database = DataBase('localhost', 27017)
#### for BDB integration  ####

# from selenium import webdriver
# from selenium.webdriver import ActionChains
# from selenium.webdriver.common.keys import Keys

import xlrd
import xlsxwriter
import os
import time
import re
import shutil
PATH = "/Users/vikasran/Documents/PythonCode/chromedriver"


headers = {}

Path(Path(scriptPath)/"Uploaded_DCAF_File").mkdir(exist_ok=True)  # create a folder  where DCAF file will be uploaded

##############################for UCS Audit Related ###################

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

ucshclAPI_url='https://ucshcltool.cloudapps.cisco.com/public/rest/server/loadSearchResults'

@app.route('/overviewpage' , methods = ['GET', 'POST'])
def upload():
    try:
        if request.method == 'POST':
            
           
            
            if 'isOldAudit' in request.form: 
                cust_name = request.form['customer_name']
                pid = request.form['customer_pid']
                uniqueID=request.form['uniqueIDs']
                edit_name = cust_name.replace(" ", "")
                db_name = f'UCS_DB_{edit_name}_{pid}_{uniqueID}'
                if 'source' in request.form:
                    res=[{'db_name':db_name,'customer_name':cust_name,'pid':pid,'uid':uniqueID}]
                    return (json.dumps(res))
                    
            upload.name = request.form['customer_name']
            f1 = request.files['zipfile']
            
            
            pid = request.form['customer_pid']
            uniqueID=request.form['customer_uniqueID']

            edit_name = upload.name.replace(" ", "") # it will remove any space from the entered customer name (by the user)
            
            # creating Database specific to this customer #
            db_name = f'UCS_DB_{edit_name}_{pid}_{uniqueID}'
            if(database.checkDBexist(db_name)):
                if 'source' in request.form:
                    res=[{'db_name':db_name,'customer_name':upload.name,'pid':pid,'uid':uniqueID,'exist':True}]
                    return (json.dumps(res))
            current_date=str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            zipfile = (request.form['customer_uniqueID']+f1.filename[-4:]).replace(" ", "")
            os.chdir(scriptPath)
         
            file_path='Uploaded_DCAF_File/'+request.form['customer_name']+'_'+request.form['customer_pid']+'_'+request.form['customer_uniqueID']
            print('checking file path',file_path)
            pathlib.Path('Uploaded_DCAF_File', request.form['customer_name']+'_'+request.form['customer_pid']+'_'+request.form['customer_uniqueID']).mkdir(exist_ok=True)
            f1.save(os.path.join(file_path, secure_filename(zipfile.replace(" ", ""))))
            upload.DB_NAME = db_name
            database.createDatabase(db_name)
                        
            process_data.mainFunction(scriPath=f'{scriptPath}/Uploaded_DCAF_File/{upload.name}_{pid}_{uniqueID}',dcafFileName=f'{zipfile.replace(" ", "")}', db_name=db_name)
            process_data.call_all_fun(scripPath=f'{scriptPath}/Uploaded_DCAF_File/{upload.name}_{pid}_{uniqueID}/{uniqueID}',db_name=upload.DB_NAME)

            #Writing the data into master DB
            databases=database.listOfDB()
            #print('dbs',databases)
            if 'master' not in databases:
                database.createDatabase('master')
            record_data={}
            record_data['user_email']= request.form['user_email']
            record_data["customer_name"]= request.form['customer_name']
            record_data["pid"]= request.form['customer_pid']
            record_data["uniqueID"]= request.form['customer_uniqueID']
            #record_data["feedback"]= 0
            record_data["time"]= current_date
            
            if 'records' not in database.listOfCollections('master'):
                database.createCollection('master','records',record_data)
            else:
                database.addData('master','records',record_data)
            shutil.rmtree(file_path)

            if 'source' in request.form:
                res=[{'db_name':upload.DB_NAME,'customer_name':upload.name,'pid':pid,'uid':uniqueID}]
                return (json.dumps(res))
                #return redirect(f'http://auditanalysis.cisco.com:8012/overview?db_name={upload.DB_NAME}&cust={upload.name}&token={auth.access_token}',302)
                #return redirect(f'https://www.google.com')
        
        elif request.method == 'GET':
            ulog={}
            db_name=request.args.get('db_name', '')
            ulog['Customer_name']=request.args.get('customer_name', '')
            token=request.args.get('token', '')
            ulog['PID']=request.args.get('pid', '')
            ulog['UniqueID']=request.args.get('uid', '')
            ulog['User_name']=request.args.get('username','')
            ulog['User_email']=request.args.get('useremail','')
            ulog["Time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            if 'user_stats' not in database.listOfCollections('master'):
                database.createCollection('master','user_stats',ulog)
            else:
                database.addData('master','user_stats',ulog)
            return render_template('ucs_overview.html',db_name=db_name, customer_name=ulog['Customer_name'],pid=ulog['PID'],uid=ulog['UniqueID'],token=token,username=ulog['User_name'])
        return render_template('ucs_overview.html',db_name=upload.DB_NAME, customer_name=upload.name ,pid=pid,uid=uniqueID,token=auth.access_token,username=auth.get_user_info()['given_name'])
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= request.form['user_email']
        error_data["Function"]= 'upload()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/redirectdata' , methods = ['GET', 'POST'])
def RedirectData():
    return redirect(f'http://auditanalysis.cisco.com:8012/overview?db_name={upload.DB_NAME}&customer_name={upload.name}&token={auth.access_token}',302)

@app.route('/comparedb', methods = ['GET', 'POST'])
def comparedb():
    try:
        if request.method == 'POST':
            res=1
            db1 = request.form['db1']
            ue = request.form['user_email']
            db2 = request.form['db2']
            if db1 not in database.listOfDB():
                res=0
            if db2 not in database.listOfDB():
                res=0
            database.compData('master', 'UADComparator', {'user':ue,'dbName1':db1,'dbName2':db2}, str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0])
           
            return (json.dumps(res))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db1+db2
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= ue
        error_data["Function"]= 'comparedb()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/getUniqueIDs' , methods = ['GET', 'POST'])
def getUniqueIDs():
    try:
        if request.method == 'POST':
            name = request.form['name']
            pid = request.form['pid']
            res = database.search("master", "records",{'pid':pid,'customer_name':name}) 
            return (json.dumps(res))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'getUniqueIDs()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/getfeedback')
def getfeedback():
    try:
        uname = auth.get_user_info()['fullname']
        cname=request.args.get('cust_name', '')
        pid=request.args.get('pid', '')
        uid=request.args.get('uid', '')
        res = database.search("master", "feedback",{'Customer_name':cname,'PID':pid,'UniqueID':uid,'User_name':uname}) 
        return (json.dumps(res))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'getfeedback()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/bpdata', methods = ['GET', 'POST']) # it will send teh data for bp tab
def bpdata():
    db_name=request.args.get('db_name', '')
    try:
        if request.method == 'GET':
            
            l = database.fetchDataFromDB(db_name, "BP_Exception") # this DB is global with one collection name "UCS_BP_LIST" there having all BP ICs
            if(l is None):
                print("No data in BP Exception")
            else:
                print(f"No of items in BP_List is: {len(l)}")
        
        return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'bpdata()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/comparebpdata', methods = ['GET', 'POST']) # it will send the data for overview stats
def comparebpdata():
    db_name1=request.args.get('db_name1', '')
    db_name2=request.args.get('db_name2', '')
    domain = request.args.get('domain','')
    
    if request.method == 'GET':
        try:
            l1 = database.fetchDataFromDB(db_name1, "BP_Exception")
            l2 = database.fetchDataFromDB(db_name2, "BP_Exception")
        except:
            l1={}
            l2={}

        if(l1==None):
            l1={}
        else:
            for item in l1:
                item.update( {"Type":"Audit1"})
        if(l2==None):
            l2={}
        else:
            for item in l2:
                item.update( {"Type":"Audit2"})

        result = []
        observation_risk = [] 
        result_index = []
        for i in range(len(l1)):
            l1[i]["Domain"] = l1[i]["Domain"].replace(" ", "")
            d = l1[i]["Domain"].split(",")
            if(domain in d):
                result.append(l1[i])
                observation_risk.append(l1[i]["Observation"].replace(" ", "") + "_" + l1[i]["Severity"])
                result_index.append(len(result) - 1)
        
       # print("Observation + risk : ",observation_risk)
        
        for i in range(len(l2)):
            l2[i]["Domain"] = l2[i]["Domain"].replace(" ", "")
            d = l2[i]["Domain"].split(",")
            if(domain in d):
                try :
                    string = l2[i]["Observation"].replace(" ", "") + "_" + l2[i]["Severity"]
                    #print("For second data : ", string)
                    index = observation_risk.index(string)
                    #print("Index : ",index)
                except ValueError :
                    index = -1
                if(index != -1):
                    result[result_index[index]]["Type"] = "Common"
                else:
                    result.append(l2[i])
               
        #print("Observations and risks: \n",observation_risk)
        result = sorted(result, key=lambda d: d['Type']) 
        result = sorted(result, key=lambda d: d['Severity']) 
        return (json.dumps(result))

@app.route('/faultdata', methods = ['GET', 'POST']) # it will send the data to foult tab
def faultdata():
    db_name=request.args.get('db_name', '')
    try:
        if request.method == 'GET':
            l = database.fetchDataFromDB(db_name, "UCS_FAULT") # fault data from DB
            #print(l)
            return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'faultdata()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/comparefaultsdata', methods = ['GET', 'POST']) # it will send the data for overview stats
def comparefaultsdata():
    db_name1=request.args.get('db_name1', '')
    db_name2=request.args.get('db_name2', '')
    domain = request.args.get('domain','')
    
    if request.method == 'GET':
        try:
            l1 = database.fetchDataFromDB(db_name1, "UCS_FAULT")
            l2 = database.fetchDataFromDB(db_name2, "UCS_FAULT")
        except:
            l1={}
            l2={}

        if(l1==None):
            l1={}
        else:
            for item in l1:
                item.update( {"Type":"Audit1"})
        if(l2==None):
            l2={}
        else:
            for item in l2:
                item.update( {"Type":"Audit2"})

        result = []
        faults_risk = [] 
        for i in range(len(l1)):
            l1[i]["domain"] = l1[i]["domain"].replace(" ", "")
            d = l1[i]["domain"].split(",")
            if(domain in d):
                result.append(l1[i])
                faults_risk.append(l1[i]["Code"] + "_" + l1[i]["Severity"])
        
        #print("Code + risk : ",faults_risk)
        
        for i in range(len(l2)):
            l2[i]["domain"] = l2[i]["domain"].replace(" ", "")
            d = l2[i]["domain"].split(",")
            if(domain in d):
                try :
                    string = l2[i]["Code"] + "_" + l2[i]["Severity"]
                    #print("For second data : ", string)
                    index = faults_risk.index(string)
                    #print("Index : ",index)
                except ValueError :
                    index = -1
                if(index != -1):
                    result[index]["Type"] = "Common"
                else:
                    result.append(l2[i])
               
        #print("Observations and risks: \n",observation_risk)
        result = sorted(result, key=lambda d: d['Type']) 
        result = sorted(result, key=lambda d: d['Severity']) 
        return (json.dumps(result))

@app.route('/eoldata', methods = ['GET', 'POST']) # it will send the data to EoL tab
def eoldata():
    db_name=request.args.get('db_name', '')
    try:
        if request.method == 'GET':
            l = database.fetchDataFromDB(db_name, "EolDATA") # Collection name for UCS EoL
            print(l)
            return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'eoldata()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 
    
@app.route('/fcdata', methods = ['GET', 'POST']) # it will send the data to FC tab
def fcdata():
    db_name=request.args.get('db_name', '')
    try:
        if request.method == 'GET':
            l = database.fetchDataFromDB(db_name, "ENICFNICdata") # Collection name for UCS FC
            return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'fcdata()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/statsdata', methods = ['GET', 'POST']) # it will send the data for overview stats
def statsdata():
    db_name=request.args.get('db_name', '')
    try:
        if request.method == 'GET':
            l = database.fetchDataFromDB(db_name, "overview_stats_detail") # this 
            #print(l)
            return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'statsdata()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/portcapacity', methods = ['GET', 'POST']) # it will send the data for inventory tab for port-capacity tab
def portcapacity():
    try:
        if request.method == 'GET':
            db_name=request.args.get('db_name', '')
            l = database.fetchDataFromDB(db_name, "port_capacity") # this 
            #print(l)
        return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'portcapacity()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 



@app.route('/insightsummary', methods = ['GET', 'POST']) # it will send the data for inventory tab for port-capacity tab
def insightsummary():
    try:
        if request.method == 'GET':
            db_name=request.args.get('db_name', '')
            l = database.fetchDataFromDB(db_name, "InsightSummary") # this 
            #print(l)
        return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'insightsummary()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/barchartdata', methods = ['GET', 'POST']) # it will send the data for overview tab for barchart
def barchartdata():
    try:
        if request.method == 'GET':
            db_name=request.args.get('db_name', '')
            l = database.fetchDataFromDB(db_name, "bar_stats_data") # this 
            #print(l)
        return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'barchartdata()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/bdbdata', methods = ['GET', 'POST']) # it will send the data for BDB log analysis
def bdbdata():
    try:
        if request.method == 'GET':
            db_name=request.args.get('db_name', '')
            l = database.fetchDataFromDB(db_name, "BDB_DATA") # this 
            #print(l)
        return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'bdbdata()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/gen_report')
def gen_report():

    try:
        today = date.today()
        current_date = today.strftime("%B %d, %Y")
        tpl = DocxTemplate('Report_Template_fina1.docx')
        db_name=request.args.get('db_name', '')
        cust_name=request.args.get('cust_name', '')
        author=request.args.get('username','')
        donaught_create_call(db_name)
        create_legend()

        stat = database.fetchDataFromDB(db_name, "overview_stats")
        dom  = stat[0]['num_domain']
        fi = stat[0]['num_FI']
        chassis = stat[0]['num_chassis']
        blade = stat[0]['num_b_server']
        SP = stat[0]["num_serv_profile"]
        isdata = database.fetchDataFromDB(db_name, "InsightSummary")
        if(isdata is None):
            isdata = ['None']
        port_cap = database.fetchDataFromDB(db_name,"port_capacity")
        if(port_cap is None):
            port_cap = ['None']
        print('port cap check:',port_cap)
        l = database.fetchDataFromDB(db_name, "BP_Exception") # this DB is global with one collection name "UCS_BP_LIST" there having all BP ICs
        #print(l)
        if(l is None):
            l = ['None']
        elif(l == [{}]):
            l=[{}]
        else:
            l = database.sortWith(l,'Severity')#sort BP data on severity

        bdb = database.fetchDataFromDB(db_name, "BDB_DATA")
        # bdb = database.fetchDataFromDB(db_name, "BDB_DATA")
        if(bdb is None):
            bdb = ['None']
        else:
            bdb=database.sortWith(bdb, 'Severity')
            for i in bdb:
                if '<br>\n<br>' in i['Evidence']:
                    i['Evidence']=i['Evidence'].replace('<br>\n<br>','\n\n')
                if '<br>\n<br>' in i['Domain']:
                    i['Domain']=i['Domain'].replace('<br>\n<br>','\n')


        fault = database.fetchDataFromDB(db_name, "UCS_FAULT") # fault data from DB
        #fault = database.fetchDataFromDB(db_name, "UCS_FAULT")
        if(fault is None):
            fault = ['None']
        elif(fault == [{}]):
            fault=[{}]
        else:
            fault = database.sortWith(fault,'Severity')#sort fault data on severity
            for i in fault:
                if '<br><br>' in i['Description']:
                    i['Description']=i['Description'].replace('<br><br>','\n\n')
                if '<br>' in i['Timestamp']:
                    i['Timestamp']=i['Timestamp'].replace('<br><br>','\n\n').replace('<br>&nbsp;&nbsp;&nbsp;&nbsp;',' ')
    
        EOL = database.fetchDataFromDB(db_name, "EolDATA")
        
        if(EOL is None):
            EOL = ['None']
        
        serverData=database.fetchDataFromDB(db_name, "ENICFNICdata") # FNIC ENIC data from DB
        if(serverData is None):
            serverData = ['None']
            OS=''
            OSV=''
            UCSM=''
        else:
            OS=serverData[0]['OS']
            OSV=serverData[0]['OS_Version']
            UCSM=serverData[0]['UCSM']
            del serverData[0]
            for i in serverData:
                if ',<br><br>' in i['ServerModel']:
                    i['ServerModel']=i['ServerModel'].replace(',<br><br>',',\n\n')
        

        context = {'cust_name' : cust_name, 
            'report_type': "UCS Audit Report", 
            'date_of_doc': current_date, 
            'version':"1.0",
            'author':author,
            'OS':OS,
            'OS_Version':OSV,
            'UCSM':UCSM,
            'tbl_contents': bdb,
            'tbl_contents1': l,
            'tbl_contents2': fault,
            'tbl_contents3': serverData,
            'tbl_contents4': EOL,
            'tbl_contents5': port_cap,
            'tbl_contents6':isdata,
            'D': dom,
            'FI': fi,
            'cha': chassis,
            'bld':blade,
            'SP':SP,
            'legend':InlineImage(tpl,'temp_pic/legend.png'),

            'fault_image':InlineImage(tpl,'temp_pic/fault.png'),
            'bp_image' : InlineImage(tpl,'temp_pic/bp.png'),
            'ldos_img' : InlineImage(tpl,'temp_pic/ldos.png'),
            'sp_image' : InlineImage(tpl, 'temp_pic/sp.png'),
            'bdb_img': InlineImage(tpl,'temp_pic/bdb.png'),
            'total_image':  InlineImage(tpl,'temp_pic/summary.png')
        }
        #print(context)
        tpl.render(context, autoescape=True)
        tpl.save('UCS_AUDIT_Report.docx')

        return send_file('UCS_AUDIT_Report.docx', as_attachment=True, attachment_filename='UCS_AUDIT_REPORT.docx')
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'gen_report()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/records')
def records():
    if not auth.is_authenticated:
        return auth.login(return_to=request.url)
    else:
        try:
            myclient = pymongo.MongoClient("mongodb://localhost:27017")
            db = myclient["master"]
            col= db["records"]
            datadump = BytesIO()
            writer = pandas.ExcelWriter(datadump) 
            docs = pandas.DataFrame(list(col.find()),columns=['customer_name','pid','uniqueID','time','user_email'])
            docs.to_excel(writer, sheet_name='UAD', index=False, na_rep='NA')
            writer.sheets['UAD'].set_column(0, 4, 28)
            writer.save()
            apidata={}
            apidata["Time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            apidata['User_name']= auth.get_user_info()['fullname']
            apidata["Function"]= 'records()'
            database.addData('master','APIUsers',apidata) 
            response = make_response(datadump.getvalue())
            response.mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            response.headers.set('Content-Disposition', 'attachment', filename='records.xlsx')
            return response
        except Exception as e:
            error_data={}
            error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            error_data["error"]= str(e)
            error_data['User_name']= auth.get_user_info()['fullname']
            error_data["Function"]= 'records()'
            database.addData('master','ErrorLogs',error_data)
            return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'}   

@app.route('/ErrorLogs')
def ErrorLogs():
    if not auth.is_authenticated:
        return auth.login(return_to=request.url)
    else:
        try:
            myclient = pymongo.MongoClient("mongodb://localhost:27017")
            db = myclient["master"]
            col= db["ErrorLogs"]
            datadump = BytesIO()
            writer = pandas.ExcelWriter(datadump) 
            docs = pandas.DataFrame(list(col.find()),columns=['dbName','time','error','User_name','Function'])
            docs.to_excel(writer, sheet_name='UAD', index=False, na_rep='NA')
            writer.sheets['UAD'].set_column(0, 4, 28)
            writer.save()
            apidata={}
            apidata["Time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            apidata['User_name']= auth.get_user_info()['fullname']
            apidata["Function"]= 'ErrorLogs()'
            database.addData('master','APIUsers',apidata) 
            response = make_response(datadump.getvalue())
            response.mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            response.headers.set('Content-Disposition', 'attachment', filename='ErrorLogs.xlsx')
            return response
        except Exception as e:
            error_data={}
            error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            error_data["error"]= str(e)
            error_data['User_name']= auth.get_user_info()['fullname']
            error_data["Function"]= 'ErrorLogs()'
            database.addData('master','ErrorLogs',error_data)
            return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'}   

@app.route('/feedback')
def feedback():
    if not auth.is_authenticated:
        return auth.login(return_to=request.url)
    else:
        try:
            myclient = pymongo.MongoClient("mongodb://localhost:27017")
            db = myclient["master"]
            col= db["feedback"]
            datadump = BytesIO()
            writer = pandas.ExcelWriter(datadump)  
            docs = pandas.DataFrame(list(col.find()),columns=['Customer_name','PID','UniqueID','Time','User_name','Hours_saved','Description'])
            docs.to_excel(writer, sheet_name='UAD', index=False, na_rep='NA')
            writer.sheets['UAD'].set_column(0, 6, 28)
            writer.save() 
            apidata={}
            apidata["Time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            apidata['User_name']= auth.get_user_info()['fullname']
            apidata["Function"]= 'feedback()'
            database.addData('master','APIUsers',apidata)
            response = make_response(datadump.getvalue())
            response.mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            response.headers.set('Content-Disposition', 'attachment', filename='feedback.xlsx')
            return response
        except Exception as e:
            error_data={}
            error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            error_data["error"]= str(e)
            error_data['User_name']= auth.get_user_info()['fullname']
            error_data["Function"]= 'feedback()'
            database.addData('master','ErrorLogs',error_data)
            return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'}         
     
    
@app.route('/deleteEol', methods=['POST'])
def deleteRows():
    try:
        print("inside deleteEol")

        if request.method == 'POST':
            db_name=request.args.get('db_name', '')
            value = str(request.form['ID'])
            database.deleteCollection(db_name, "EolDATA",value)
            database.updatebardata(db_name)
        
        return 'delete complete'
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'deleteRows()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/serverData', methods=['POST'])
def GetServerData():
#     try:
#         db_name=request.args.get('db_name', '')
#         if request.method == 'POST':
#             print('entered getserverdata')
#             rgx=re.compile('.*Information Needed to Verify UCS Matrix Interoperability*',re.IGNORECASE)
#             query = {'Heading':rgx}
#             data = database.fetchDataFromDB(db_name, "BDB_DATA",query)
#             print(data)
#             OS = str(request.form['OS'])
#             OS_id=database.fetchDataFromDB("master", "OperatingSystems",{"OSVENDOR":OS})[0]["ID"]
#             OSversion = str(request.form['OSVersion'])
#             OSversion_id = str(request.form['OSVersion_id'])
#             #OSversion_id=database.fetchDataFromDB("master", "OperatingSystemVersions",{"OSVERSION":OSversion})[0]["ID"]
#             UCSMversion=str(request.form['UCSM'])
#             print('UCSMversion:',UCSMversion)
#             if(len(UCSMversion.split('(')[1])==3):
#                 UCSMversion=UCSMversion[:-2]+')'
#             result=[]
#             for a in range (len(data)):
#                 ls=[]
#                 ls=data[a]['Evidence'].split("\n<br>\n<br>")
#                 db_data=[{'OS':OS,'OS_Version':OSversion,'UCSM':UCSMversion}]
#                 for i in ls:
#                     l=i.split('\n')
#                     if(ls[len(ls)-1]==i):
#                         l=l[:len(l)-1]
#                     domain=l[0][:len(l[0])-1]
#                     for k in l[2:len(i)-1]:
#                         temp_ls=[]
#                         temp_ls=k.split('/')
#                         serverModel = temp_ls[1].strip()
#                         serverType=str(temp_ls[0]).strip()[-1]
#                         serverModel = str(temp_ls[1].split('(')[1].strip())[:-1]
#                         cnaVIC = str(temp_ls[3].split('(')[0].strip())
#                         serverModel_data=database.fetchDataFromDB("master", "ServerModels",{"SERVER_MODEL":serverModel})
#                         if serverModel_data==[]:
#                             continue
#                         serverModel_tid=(serverModel_data[0]["T_ID"]).split(',')
#                         serverModel_tid=[int(i) for i in serverModel_tid]
#                         serverModel_id=(serverModel_data[0]["ID"]).split(',')
#                         serverModel_id=[int(i) for i in serverModel_id]
#                         processors=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/server/loadProcessors',data={'treeIdServerModel':serverModel_tid}) 
#                         processorVersion_id=processors.json()[0]['ID']
#                         serverType_id=database.fetchDataFromDB("master", "ServerTypes",{"TYPE":serverType})[0]["ID"]
#                         tool_req_data={'serverType_ID': serverType_id, 'serverModel_ID': serverModel_id,'processor_ID': processorVersion_id,'osVendor_ID': OS_id,'osVersion_ID': OSversion_id,'firmwareVersion_ID': -1,'manageType': 'UCSM'}
#                         tool_data = requests.post(ucshclAPI_url,data=tool_req_data) 
#                         print('tool_req_data:',tool_req_data)
#                         #return json.dumps(#tool_data)
#                         #print(tool_data.json())
#                         output_data=[x for x in tool_data.json() if x['Version'] == UCSMversion]    
#                         if output_data==[]:
#                             print('no data')
#                             continue
#                         output_data=output_data[0]['HardwareTypes']['Adapters']['CNA']
#                         output_data=[x for x in output_data if x['Model'].split(':')[0]  == 'Cisco '+cnaVIC]
#                         driver_list=[output_data[0]['DriverVersion'],output_data[1]['DriverVersion']]
#                         if driver_list[0][-4:]=='enic':
#                             enic=driver_list[0]
#                             fnic=driver_list[1]
#                         else:
#                             enic=driver_list[1]
#                             fnic=driver_list[0]
#                         consolidated_data={'Domain':domain,'ServerModel':serverModel,'vic':cnaVIC,'enic':enic,'fnic':fnic}
#                         result.append(consolidated_data)

#             efdf = pd.DataFrame.from_dict(result)
#             efdf=efdf.groupby(['Domain','vic','enic','fnic']).agg(lambda x : ',<br><br>'.join(set(x))).reset_index()
#             efdf=efdf[['Domain','ServerModel','vic','enic','fnic']]
#             result=[]
#             efdf.to_json(Path(root)/'temp_ef.json', orient='index')
#             with open(Path(Path(root)/'temp_ef.json'), "r") as f:
#                 eflist = json.loads(f.read())
#             for i in range(len(eflist)):
#                 d=(dict(Domain=eflist[str(i)]["Domain"],ServerModel=eflist[str(i)]["ServerModel"],vic=eflist[str(i)]["vic"],  
#                            enic=eflist[str(i)]["enic"],fnic=eflist[str(i)]["fnic"])) 
#                 result.append(d)
#                 db_data.append(d)            
	
#             if result==[]:
#                 print('returning 204')
#                 return json.dumps({'success':True}), 204, {'ContentType':'application/json'} 
#             if('ENICFNICdata' not in database.listOfCollections(db_name)):
#                 database.createCollection(db_name, "ENICFNICdata", db_data) 
#             else:
#                 database.delAllData(db_name,'ENICFNICdata')
#                 database.addData(db_name,'ENICFNICdata',db_data)
#             for i in result:
#                 if '_id' in i:
#                     del i['_id']

#             return (json.dumps(result))
    try:
        db_name=request.args.get('db_name', '')
        if request.method == 'POST':
            print('entered getserverdata')
            OSm = str(request.form['OSm'])
            OSversion = str(request.form['OSVersion'])
            UCSMversion=str(request.form['UCSM'])
            db_data=[{'OS':OSm,'OS_Version':OSversion,'UCSM':UCSMversion}]
            result=database.fetchDataFromDB(db_name,'Firmware',{'OS':OSm,'OSV':OSversion,'UCSM':UCSMversion})
            # print('r',result)
            efdf = pd.DataFrame.from_dict(result)
            efdf=efdf.groupby(['Domain','vic','enic','fnic']).agg(lambda x : ',<br><br>'.join(set(x))).reset_index()
            efdf=efdf[['Domain','ServerModel','vic','enic','fnic']]
            result=[]
            efdf.to_json(Path(root)/'temp_ef.json', orient='index')
            with open(Path(Path(root)/'temp_ef.json'), "r") as f:
                eflist = json.loads(f.read())
            os.remove(f"temp_ef.json")
            for i in range(len(eflist)):
                d=(dict(Domain=eflist[str(i)]["Domain"],ServerModel=eflist[str(i)]["ServerModel"],vic=eflist[str(i)]["vic"],  
                           enic=eflist[str(i)]["enic"],fnic=eflist[str(i)]["fnic"])) 
                result.append(d)
                db_data.append(d)            
	
            if result==[]:
                print('returning 204')
                return json.dumps({'success':True}), 204, {'ContentType':'application/json'} 
            if('ENICFNICdata' not in database.listOfCollections(db_name)):
                database.createCollection(db_name, "ENICFNICdata", db_data) 
            else:
                database.delAllData(db_name,'ENICFNICdata')
                database.addData(db_name,'ENICFNICdata',db_data)
            for i in result:
                if '_id' in i:
                    del i['_id']

            return (json.dumps(result))

    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'GetServerData()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

        
# @app.route('/GetOSList', methods=['GET'])
# def GetOSList():
    # try:
    #     print("inside GetOSList")

    #     if request.method == 'GET':
    #         result=database.getAllOS('master', "OperatingSystems")
        
    #     return (json.dumps(result))
@app.route('/GetOSList', methods=['POST'])
def GetOSList():
    db_name=request.args.get('db_name', '')
    try:
        print("inside GetOSList")
        if request.method == 'POST':
            res=  requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/osvendor/loadOsVendors')
            result=res.json()

        return (json.dumps(result))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'GetOSList()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/GetOSVersionList', methods=['POST'])
def GetOSVersionList():
    print("inside GetOSVersionList")
    db_name=request.args.get('db_name', '')
    # try:
    #     if request.method == 'POST':
    #         OS_id=database.fetchDataFromDB("master", "OperatingSystems",{"OSVENDOR":request.form['OS']})[0]["T_ID"]
    #         data=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/server/loadOsVersions',data={'treeIdVendor': OS_id})
    #         data=data.json()
    #     return (json.dumps(data))
    try:
        if request.method == 'POST':
            data=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/osvendor/loadOsVersions',data={'treeIdVendor': int(request.form['OS'])})
            data=data.json()
        return (json.dumps(data))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'GetOSVersionList()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 
        
@app.route('/GetUCSMVersionList', methods=['POST'])
def GetUCSMVersionList():
    print("inside GetUCSMVersionList")
    # try:
    #     db_name=request.args.get('db_name', '')
    #     if request.method == 'POST':
    #         rgx=re.compile('.*Information Needed to Verify UCS Matrix Interoperability.*',re.IGNORECASE)
    #         query = {'Heading':rgx}
    #         data = database.fetchDataFromDB(db_name, "BDB_DATA",query)
    #         OS_id=database.fetchDataFromDB("master", "OperatingSystems",{"OSVENDOR":request.form['OS']})[0]["ID"]
    #         OSversion_id = str(request.form['OSVersion_id'])
    #         for a in range (len(data)):
    #             ls=[]
    #             ls=data[a]['Evidence'].split("\n<br>\n<br>")
    #             for i in ls:
    #                 l=i.split('\n')
    #                 if(ls[len(ls)-1]==i):
    #                     l=l[:len(l)-1]
    #                 for k in l[2:len(i)-1]:
    #                     temp_ls=[]
    #                     temp_ls=k.split('/')
    #                     serverModel = temp_ls[1].strip()
    #                     serverType=str(temp_ls[0]).strip()[-1]
    #                     serverModel = str(temp_ls[1].split('(')[1].strip())[:-1]
    #                     serverModel_data=database.fetchDataFromDB("master", "ServerModels",{"SERVER_MODEL":serverModel})
    #                     if serverModel_data==[]:
    #                         continue
    #                     serverModel_tid=(serverModel_data[0]["T_ID"]).split(',')
    #                     serverModel_tid=[int(i) for i in serverModel_tid]
    #                     serverModel_id=(serverModel_data[0]["ID"]).split(',')
    #                     serverModel_id=[int(i) for i in serverModel_id]
    #                     processors=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/server/loadProcessors',data={'treeIdServerModel':serverModel_tid}) 
    #                     processorVersion_id=processors.json()[0]['ID']
    #                     serverType_id=database.fetchDataFromDB("master", "ServerTypes",{"TYPE":serverType})[0]["ID"]
    #                     tool_req_data={'serverType_ID': serverType_id, 'serverModel_ID': serverModel_id,'processor_ID': processorVersion_id,'osVendor_ID': OS_id,'osVersion_ID': OSversion_id,'firmwareVersion_ID': -1,'manageType': 'UCSM'}
    #                     data=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/server/loadSearchResults',data=tool_req_data)
    #                     data=data.json()
    #                     if(data==[]):
    #                         continue
    #                     else:
    #                         break
    #     return (json.dumps(data))
    try:
        db_name=request.args.get('db_name', '')
        if request.method == 'POST':
            rgx=re.compile('.*Information Needed to Verify UCS Matrix Interoperability.*',re.IGNORECASE)
            query = {'Heading':rgx}
            data = database.fetchDataFromDB(db_name, "BDB_DATA",query)
            OS_id=str(request.form['OS'])
            OSversion_id = str(request.form['OSVersion_id'])
            OS=str(request.form['OSm'])
            OSV=str(request.form['OSVersion'])
            Stype=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/osvendor/loadServerTypes',data={'treeIdOSVersion': int(request.form['OSV_id'])})
            Stype=Stype.json()
            result=[]
            for a in range (len(data)):
                ls=[]
                ls=data[a]['Evidence'].split("\n<br>\n<br>")
                for i in ls:
                    l=i.split('\n')
                    if(ls[len(ls)-1]==i):
                        l=l[:len(l)-1]
                    domain=l[0][:len(l[0])-1]
                    for k in l[2:len(i)-1]:
                        temp_ls=[]
                        temp_ls=k.split('/')
                        try:
                            for st in Stype:
                                if(st['TYPE']==str(temp_ls[0]).strip()[-1]):
                                    serverTyp_id=st['T_ID']
                                    serverType_id=st['ID']
                                    break
                                else:
                                    serverTyp_id=''
                            SModel=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/osvendor/loadServerModels',data={'treeIdRelease': int(serverTyp_id)})
                            SModel=SModel.json()
                            serverModel=str(temp_ls[1].split('(')[1].strip())[:-1]
                            for sm in SModel:
                                if(sm['SERVER_MODEL']==serverModel):
                                    serverMode_id=sm['T_ID']
                                    serverModel_id=sm['ID']
                                    break
                                else:
                                    serverMode_id=''
                            processors=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/osvendor/loadProcessors',data={'treeIdServerModel':serverMode_id}) 
                            for p in processors.json():                                
                                if((temp_ls[2]).strip()[-3:-1] in p['PROCESSOR']):
                                    # print('ss',str(temp_ls[2]).strip()[-3:-1])
                                    processorVersion_id=p['ID']
                                    if((temp_ls[2]).strip()[-8:-6] in p['PROCESSOR']):
                                        break
                                else:
                                    # print('s')
                                    processorVersion_id=processors.json()[0]['ID']
                            # print('pid',processorVersion_id)
                            cnaVIC = str(temp_ls[3].split('(')[0].strip())
                            tool_req_data={'serverType_ID': serverType_id, 'serverModel_ID': serverModel_id,'processor_ID': processorVersion_id,'osVendor_ID': OS_id,'osVersion_ID': OSversion_id,'firmwareVersion_ID': -1,'manageType': 'UCSM'}
                            data=requests.post('https://ucshcltool.cloudapps.cisco.com/public/rest/server/loadSearchResults',data=tool_req_data)
                            data=data.json()
                            if(data==[]):
                                continue
                            else:
                                for od in data:
                                    ucsv=od['Version']
                                    # print('ucsv',ucsv)
                                    try:
                                        y=[x for x in od['HardwareTypes']['Adapters']['CNA'] if x['Model'].split(':')[0]  == 'Cisco '+cnaVIC]
                                        # print('y',y)
                                        driver_list=[y[0]['DriverVersion'],y[1]['DriverVersion']]
                                        if driver_list[0][-4:]=='enic':
                                            enic=driver_list[0]
                                            fnic=driver_list[1]
                                        else:
                                            enic=driver_list[1]
                                            fnic=driver_list[0]                                        
                                        consolidated_data={'Domain':domain,'OS':OS,'OSV':OSV,'UCSM':ucsv,'ServerModel':serverModel,'vic':cnaVIC,'enic':enic,'fnic':fnic}
                                        result.append(consolidated_data)
                                    except:
                                        print('result')
                        except:
                            continue  
            # print('res',result)
            if('Firmware' not in database.listOfCollections(db_name)):
                database.createCollection(db_name, "Firmware", result) 
            else:
                database.delAllData(db_name,'Firmware')
                database.addData(db_name,'Firmware',result) 
            d=database.getAllFC(db_name, "Firmware")
            # print('d',d)
        return (json.dumps(d))

    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'GetUCSMVersionList()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/deleteBp', methods=['POST'])
def deleteBpRows():
    print("inside deleteBp")
    try:
        if request.method == 'POST':
            db_name=request.args.get('db_name', '')
            value = str(request.form['ID'])
            print(value)
            database.deleteCollection(db_name, "BP_Exception",value)
            database.updatebardata(db_name)
        
        return 'delete complete'
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'deleteBpRows()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

@app.route('/deleteBdb', methods=['POST'])
def deleteBdbRows():
    print("inside deletBdb")
    try:
        if request.method == 'POST':
            value = str(request.form['ID'])
            db_name=request.args.get('db_name', '')
            database.deleteCollection(db_name, "BDB_DATA",value)
            database.updatebardata(db_name)
        return 'delete complete'
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'deleteBdbRows()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/deleteFault', methods=['POST'])
def deleteFaultRows():
    print("inside deleteFault")
    try:
        if request.method == 'POST':
            value = str(request.form['ID'])
            db_name=request.args.get('db_name', '')
            database.deleteCollection(db_name, "UCS_FAULT",value)
            database.updatebardata(db_name)
        
        return 'delete complete'
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'deleteFaultRows()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/getallFaultRecommendation', methods = ['GET', 'POST']) # it will send the data to foult tab
def getallFaultRecommendation():
    try:
        if request.method == 'GET':
            data=str(request.args.get('data', ''))
            data=data.split(",")
            code=data[1]
            tableid=data[0]
            print(tableid)
            if(tableid=='"fault_data_table"'):
                l = database.fetchAllRecomFromDB("UCS_FAULT",code) # fault data from DB
            elif(tableid=='"bdb_data_table"'):
                l= database.fetchAllRecomFromDB("BDB_DATA",code)
            elif(tableid=='"bp_data_table"'):
                l= database.fetchAllRecomFromDB("BP_Exception",code)
        return render_template('reciframe.html', recommendation_data=l )
        # return (json.dumps(l))
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'getallFaultRecommendation()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 



# @app.route('/dataSend' , methods = ['POST'])
# def insigt():
#     print('Recheck')
#     if request.method=='POST':    
#         db_name=request.args.get('db_name', '')
#         summ_insigt = insight_summary(db_name)
#         if('InsightSummary' not in database.listOfCollections(db_name)):
#             if not(summ_insigt==[]):
#                 database.createCollection(db_name, "InsightSummary", summ_insigt)
#             else:
#                 print('data to insert in insight')
#                 database.delAllData(db_name,'InsightSummary')
#                 database.addData(db_name, "InsightSummary", summ_insigt)
#     return 'pass'

@app.route('/dataSendBack' , methods = ['POST'])
def uploadComments():

    print("control within dataSendBack ... \n")
    try:
        if request.method == 'POST':

            #coll_name = str(request.form[''])
            db_name=request.args.get('db_name', '')
            value = str(request.form['value'])
            id = str(request.form['id'])
            col_type = str(request.form['type'])
            database.editrecord(db_name, id, col_type, value)
            # if col_type=='Severity':
            database.updatebardata(db_name)
            print('data to insert in insigt')
            database.edit_old_Collection(db_name, "InsightSummary", insight_summary(db_name))
        
        
        return 'pass'
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'uploadComments()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 

def getstatsarray(l1,l2,key):
    try:
        data1 = l1[key]
        data2 = l2[key]   
        df1 = pd.DataFrame.from_dict(data1)
        df2 = pd.DataFrame.from_dict(data2)
        first_df = df1.shape[0]
        second_df = df2.shape[0]
        comparison_df = df1.merge(df2,indicator=True,how='outer')
        common_df = comparison_df[comparison_df['_merge'] == 'both'].shape[0]
        l=[first_df,second_df,common_df]
        return l
    except:
        return []

@app.route('/comparestats', methods = ['GET', 'POST']) # it will send the data for overview stats
def comparestats():
    db_name1=request.args.get('db_name1', '')
    db_name2=request.args.get('db_name2', '')
    #dic_key=request.args.get('dic_key', '')
    #domain,FI,B_Server,Chassis,Service_profile
    if request.method == 'GET':
        dict={}
        try:
            l1 = database.fetchDataFromDB(db_name1, "overview_stats_detail")[0]
            l2 = database.fetchDataFromDB(db_name2, "overview_stats_detail")[0]
        except:
            l1={}
            l2={}
        # domaindata1 = l1['domain']
        # domaindata2 = l2['domain']
        domainArray = getstatsarray(l1,l2,'domain')
        dict['domain'] = domainArray
        FIArray = getstatsarray(l1,l2,'FI')
        dict['FI'] = FIArray
        B_ServerArray = getstatsarray(l1,l2,'B_Server')
        dict['B_Server'] = B_ServerArray
        ChassisArray = getstatsarray(l1,l2,'Chassis')
        dict['Chassis'] = ChassisArray
        Service_profileArray = getstatsarray(l1,l2,'Service_profile')
        dict['Service_profile'] = Service_profileArray

        return json.dumps(dict)
    
@app.route('/feedbackdata' , methods = ['POST'])
def uploadFeedback():
    try:
        print("Feedback sent... \n")
        if request.method == 'POST':
            fdata={}
            dbname=request.args.get('db_name', '')
            fdata['Customer_name']=request.args.get('cust_name', '')
            fdata['PID']=request.args.get('pid', '')
            fdata['UniqueID']=request.args.get('uid', '')
            fdata["Time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
            fdata['User_name']= auth.get_user_info()['fullname']
            fdata['Hours_saved'] = str(request.form['t'])
            fdata['Description'] = str(request.form['f'])

            if 'feedback' not in database.listOfCollections('master'):
                database.createCollection('master','feedback',fdata)
            else:
                database.addData('master','feedback',fdata)

            
        return 'pass'
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'uploadFeedback()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/')
def base():
    print('base')
    if not auth.is_authenticated:
        print('not')
        print(auth.access_token)
        print(auth)
        print('request url:','http://auditanalysis.cisco.com/')
        return auth.login(return_to='http://auditanalysis.cisco.com/')
    else:
        print('yes')
        print(auth.access_token)
        # return render_template('ucs_index.html')
        return redirect('http://auditanalysis.cisco.com/',code=302)
    #print('/ index called')
    #return render_template('ucs_index.html')

@app.route('/authenticateUser')
def userAuth():
    print('base')
    if not auth.is_authenticated:
        print('not')
        print(auth.access_token)
        print(auth)
        print('request url:','http://auditanalysis.cisco.com/')
        return auth.login(return_to='http://auditanalysis.cisco.com/')
    else:
        print('yes')
        print(auth.access_token)
        return redirect(f'http://localhost:3000?auth={auth.access_token}')
        #return json.dumps(auth)
   

@app.route('/getOverviewData', methods = ['GET', 'POST'])
def getOverviewData():
    print('here within getOverviewData function ')
    try:
        db_name=request.args.get('db_name', '')
        if request.method == 'GET':
            data = database.fetchDataFromDB(db_name, "overview_stats" )
            
        return json.dumps(data)
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'getOverviewData()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/driver' , methods = ['GET', 'POST'])
def driver():
    if request.method=='POST':
      os = request.form['os']
      os_ver = request.form['os_ver']


@app.route('/deleteallbdb', methods=['DELETE'])
def deleteallbdb():
    try:
        print('inisde deletealldbd')
        db_name=request.args.get('db_name', '')
        print(db_name)
        database.dropCollection(db_name,'BDB_DATA')
        print('data deleted')
        database.updatebardata(db_name)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'deleteallbdb()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 



@app.route('/bdb', methods=['GET', 'POST'])
def bdb():
    # return 'pass'
    try:
        db_name=request.args.get('db_name', '')
        cust_name=request.args.get('custname', '')
        token=request.args.get('val', '')
        if request.method == 'POST':
            f=request.files['file']
            file_name=f.filename
            print('file name:',f)
            domain_name = f.filename.split('_')[1]
            print('domain:',domain_name)
                
            f.save(secure_filename(f.filename))

            post_dict = {
                    "input": {"filename": f.filename},
                    "output": "json"
            }
            headers = {"Authorization": f'Bearer {token}'}
            print('headers:',headers)
            headers['accept'] = 'application/json, text/plain, */*'
            headers['origin'] = 'https://scripts.cisco.com'

            files = {'file': open(f.filename, 'rb')}
                
            r = requests.post(
                    'https://scripts.cisco.com/api/v2/files',
                    data={"type": "formData"},
                    files=files,
                    #cookies=cookies,
                    headers=headers
                )
            r = requests.get(
                    'https://scripts.cisco.com/api/v2/files',
                    headers=headers
                )
            headers['Content-type'] = 'application/json;charset=UTF-8'
            headers['referer']='https://scripts.cisco.com/ui/use/BCS_UCS_Audit_Parser?dev=true'

            post_dict = {


                    'clientId':'browser',
                    'dev':True,
                    'devAdditionalTasks':[],
                    'input':{'session':['filename'],'filename':f.filename, 'module': "DCAF"},

                    }

            r = requests.post(
                f'https://scripts.cisco.com/api/v2/jobs/BCS_UCS_Audit_Parser?output=json', 
                data=json.dumps(post_dict), 
                headers=headers
                )
            
            requests.delete(
                f'https://scripts.cisco.com/api/v2/files/',  
                headers=headers
                )
            
            with open(f"bdb_contents_{domain_name}.json" ,"w") as f:
                f.write(json.dumps(r.json()))
            f.close()
        
            with open(f"bdb_contents_{domain_name}.json", "r") as f:
                showtech_data = json.load(f)
            process_data.bdbdata(showtech_data, domain_name, db_name=db_name)
            f.close()
            os.remove(file_name)
            os.remove(f"bdb_contents_{domain_name}.json")
            
        process_data.call_all_fun(db_name)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    except Exception as e:
        error_data={}
        error_data["dbName"]= db_name
        error_data["time"]= str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))).split('.')[0]
        error_data["error"]= str(e)
        error_data['User_name']= auth.get_user_info()['fullname']
        error_data["Function"]= 'bdb()'
        database.addData('master','ErrorLogs',error_data)
        return json.dumps({'success':False, 'message':'Please reach out us at https://eurl.io/#SPt1_l2Vn'}), 400, {'ContentType':'application/json'} 


@app.route('/AuthStatus',methods=['GET'])
def AuthStatus():
    print('inside AuthStatus')
    print(auth.is_authenticated)
    if not auth.is_authenticated:
        return {"Authenticated": "false"}
    else:
        return {"Authenticated":"true"}


@auth.after_login
def update_user_info():
    print('inside after_login')
    print(auth.get_user_info())
    print(auth.get_user_info()['fullname'])
    databases=database.listOfDB()
    #print('dbs',databases)
    current_date=str(datetime.datetime.now())
    if 'master' not in databases:
        database.createDatabase('master')
    record_data={}
    record_data["full_name"]= auth.get_user_info()['fullname']
    record_data["user_name"]= auth.get_user_info()['sub']
    record_data["time"]= current_date
            
    if 'user_logs' not in database.listOfCollections('master'):
        database.createCollection('master','user_logs',record_data)
    else:
        database.addData('master','user_logs',record_data)

    print(auth.access_token)
    print(auth.authorization_header)
    session['user_info'] = auth.get_user_info()


# When Flask-PingFederate fails to authenticate the user, it returns a 401 Response
# This function handles that and allows you to show a custom page
@app.errorhandler(401)
def authorization_failure(e):
    print('authorization_failure')
    # Base url for the app
    return render_template('unauthorized.html', e=e)


# Make the auth object available in the templates
@app.context_processor
def inject_auth():
    print('inject_auth')
    return dict(auth=auth)


# Example Protected resource
@app.route('/user_info')
@auth.login_required
def user_info():
    print('user_info')
    print('inside user_info')
    return jsonify(auth.get_user_info())


# Example Protected resource
@app.route('/claims')
@auth.login_required
def claims():
    print('claims')
    return jsonify(auth.get_verified_claims())


# Example Protected resource, with custom logic
#@app.route('/secret')
def web_secret():
    print('web_secret')
    print(auth.is_authenticated)
    if not auth.is_authenticated:
        # redirect to login and return to this page if successful
        print('inside web_secret')
        print(auth.access_token)
        return auth.login(return_to='http://auditanalysis.cisco.com/')
    print(auth.access_token)
    print(auth.authorization_header)
    cookies = requests.utils.dict_from_cookiejar(auth.cookies)

    print(f'cookies value is: {cookies}')

    response = make_response(redirect(location='http://auditanalysis.cisco.com:8012/',code=302))

    response.set_cookie('uad_auth',auth.access_token,max_age=43200)
    response.set_cookie('uad_User',auth.get_user_info()["given_name"],max_age=43200)
    return response

@app.route('/logout',methods=['GET'])
def logout():
    print("called logout")
    auth.logout(return_to='http://auditanalysis.cisco.com/')
    return {"Logout": "Succesful"}




        

if __name__ == '__main__':
    app.run(host='0.0.0.0' , port = 8012, debug=True)
    #app.run(debug=True)
    
