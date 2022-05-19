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
import jsonCreator
from bson.objectid import ObjectId
import math
import requests
import urllib3
from flask_cors import CORS, cross_origin
from subprocess import Popen, PIPE, STDOUT, run
from flask_pingfederate import AuthorizationCodeFlow
from werkzeug.contrib.cache import FileSystemCache
import cna_graph_images
import mail_utility
from logdecorator import logwrap
import logging
import os.path
import time

email_id = ""
BearerToken = ""
scriptPath = os.path.dirname(os.path.realpath(__file__))

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
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



def Logging_Statistics(email , audit_id, customer_pid, company_key):
     dbName = "CNA_Visualizer"
     dbClient = pymongo.MongoClient('localhost', 27017)
     db = dbClient[dbName]
     collection = db['Logging_Statistics']
     jsonData = {'email_id':email, 'audit_id': audit_id, 'timestamp':datetime.datetime.now(), 'customer_PID' : customer_pid, "company_key" : company_key}

     ins = collection.insert_one(jsonData)
     del jsonData["_id"]
     dbClient.close()

def insertNCEComment(user_name, cpy_key, audit_id, table_name, exception_name, comment, severity_to_update):

     dbName = "CNA_Visualizer"
     dbClient = pymongo.MongoClient('localhost', 27017)
     db = dbClient[dbName]
     collection = db[cpy_key]
     if("," in severity_to_update):
        sev_array = severity_to_update.split(",")
     else:
        sev_array = [severity_to_update]
     print(sev_array)
     if("All" in severity_to_update):
            query = {'Audit_ID':audit_id, 'jsonFor':'allExceptions', 'Table Name':table_name , 'Exception Name' : exception_name}
            for item in db[cpy_key].find(query):
                    res = db[cpy_key].find_one_and_update({'_id': ObjectId(item['_id'])}, {'$set':{'NCE_Comment':comment}}, {'upsert':'False'})
                    res = db[cpy_key].find_one_and_update({'_id': ObjectId(item['_id'])}, {'$push':{'History':{"user" : user_name , "timestamp" : time.time() , "comment" : "Updated NCE Comment"}}}, {'upsert':'False'})
     else:
            for sev in sev_array:
                query = {'Audit_ID':audit_id, 'jsonFor':'allExceptions', 'Table Name':table_name , 'Exception Name' : exception_name , 'Severity' : sev}
                for item in db[cpy_key].find(query):
                    res = db[cpy_key].find_one_and_update({'_id': ObjectId(item['_id'])}, {'$set':{'NCE_Comment':comment}}, {'upsert':'False'})


     dbClient.close()

def change_severity(user_name, cpyKey, audit_id, table_name, exception_name, nms_area, old_sev, new_sev):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        collection = db[cpyKey]
        query = {'Audit_ID':audit_id, 'jsonFor':'allExceptions', 'Table Name':table_name , 'Exception Name' : exception_name}
        res = db[cpyKey].find(query)
        res = list(res)
        total_changed = len(res)
        for item in res:
            res = db[cpyKey].find_one_and_update({'_id': ObjectId(item['_id'])},{'$set':{'Severity':new_sev}}, {'upsert':'False'})
            res = db[cpyKey].find_one_and_update({'_id': ObjectId(item['_id'])}, {'$push':{'History':{"user" : user_name , "timestamp" : time.time() , "comment" : "Changed Severity"}}}, {'upsert':'False'})

        #add query to update severitybreakdown count here
        old_count_query = {'Audit_ID':audit_id, 'jsonFor':'severityBreakdown'}
        res = db[cpyKey].find(old_count_query)
        res = list(res)
        old_sev_count = int(res[0][nms_area][old_sev]) - total_changed
        new_sev_count = int(res[0][nms_area][new_sev]) + total_changed
        res1 = db[cpyKey].find_one_and_update({'_id': ObjectId(res[0]['_id'])},{'$set':{"res.0."+nms_area+"."+old_sev:old_sev_count}}, {'upsert':'False'})

        res1 = db[cpyKey].find_one_and_update({'_id': ObjectId(res[0]['_id'])},{'$set':{"res.0."+nms_area+"."+new_sev:new_sev_count}}, {'upsert':'False'})

        dbClient.close()


def change_DNRFlag(user_name, cpyKey, audit_id, table_name, exception_name, old_flag, new_flag, nms_area, sev):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        collection = db[cpyKey]
        query = {'Audit_ID':audit_id, 'jsonFor':'allExceptions', 'Table Name':table_name , 'Exception Name' : exception_name}
        res = db[cpyKey].find(query)
        res = list(res)
        total_changed = len(res)
        for item in res:
            res = db[cpyKey].find_one_and_update({'_id': ObjectId(item['_id'])},{'$set':{'DNR_Flag':new_flag}}, {'upsert':'False'})
            res = db[cpyKey].find_one_and_update({'_id': ObjectId(item['_id'])}, {'$push':{'History':{"user" : user_name , "timestamp" : time.time() , "comment" : "Do Not Report Flag changed"}}}, {'upsert':'False'})

        #old_count_query = {'Audit_ID':audit_id, 'jsonFor':'severityBreakdown'}
        #res = db[cpyKey].find(old_count_query)
        #res = list(res)
        #toInsert = res[0]
        #del toInsert["_id"]
        #toInsert[nms_area][sev] = toInsert[nms_area][sev] - total_changed
        #toInsert["Total"][sev] = toInsert["Total"][sev] - total_changed
#
#        #res1 = db[cpyKey].remove({'jsonFor': 'severityBreakdown'})
#        #res1 = db[cpyKey].insert_one(toInsert)
        #del toInsert["_id"]
        dbClient.close()

def getTableFromDB(cpy_key, audit_id, file_name, table_name):
   dbName = "CNA_Visualizer"
   dbClient = pymongo.MongoClient('localhost', 27017)
   db = dbClient[dbName]
   collection = db[cpy_key]
   query = {"Audit_ID" : audit_id , "jsonFor" : file_name, "Table Name":table_name}
   result = db[cpy_key].find(query)
   dbClient.close()
   return result

def getCurrentAuditInfo(customer_key, audit_id, audit_type):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        query = {"Audit_Type" : audit_type, "Audit_ID" : audit_id, "jsonFor" : "audit_information"}
        res = db[customer_key].find(query)
        result = list(res)
        print(result)
        dbClient.close()
        return(result)

def get_row_details(cpy_key, audit_id, table_name, row_number):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        query = {"Table Name" : table_name, "Audit_ID" : audit_id, "jsonFor" : "allData" , "Row Number" : int(row_number)}
        res = db[cpy_key].find(query)
        result = list(res)
        dbClient.close()
        return(result)


def check_audit_info(customer_key, audit_id, audit_type):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        query = {"customer_key" : customer_key, "audit_id" : audit_id , "audit_type" : audit_type}
        res = db['upload_information'].find(query)
        result = list(res)
        dbClient.close()
        print("Checking if audit is already available ... ")
        if(len(result) == 0):
            return False
        else:
            return True


def getCompanyPID(company_key, audit_id):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        query = {"customer_key" : company_key, "audit_id" : audit_id}
        res = db['upload_information'].find(query)
        result = list(res)
        dbClient.close()
        return result


def getNetRules(audit_type, table_name, exception_name):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        query = {"audit_type" : audit_type, "table_name" : table_name , "exception_name" : exception_name}
        res = db['NetRule_NetAdvice'].find(query)
        result = list(res)
        dbClient.close()
        return result

def getNetRulesv2(cpyKey, audit_id, audit_type, table_name, exception_name):
        dbName = "CNA_Visualizer"
        dbClient = pymongo.MongoClient('localhost', 27017)
        db = dbClient[dbName]
        if("- " in exception_name):
            exception_name = exception_name[exception_name.rfind("- ")+2:]

        #print(exception_name)

        query = {"Audit_ID" : audit_id, "Audit_Type" : audit_type, "table_name" : table_name , "exception" : exception_name, "jsonFor" : "netRulenetAdvice"}
        print(query)
        res = db[str(cpyKey)].find(query)
        result = list(res)
        if not result:
            query = {"Audit_ID" : audit_id, "Audit_Type" : audit_type, "table_name" : table_name , "exception" : exception_name+" (Exceptions Only)", "jsonFor" : "netRulenetAdvice"}
            print(query)
            res = db[str(cpyKey)].find(query)
            result = list(res)
        dbClient.close()
        return result

def updateNetRules(jsonData):
     dbName = "CNA_Visualizer"
     dbClient = pymongo.MongoClient('localhost', 27017)
     db = dbClient[dbName]
     collection = db['NetRule_NetAdvice']
     ins = collection.insert_one(jsonData)
     del jsonData["_id"]
     dbClient.close()

def insertNpdata(jsonData,cpykey ):
    dbName = "CNA_Visualizer"
    dbClient = pymongo.MongoClient('localhost', 27017)
    db = dbClient[dbName]
    collection = db[cpykey]
    for i in jsonData:
        collection.insert_one(i)


    dbClient.close()

def updateNCEFeedback(user_name, cpy_key, audit_id, company_PID, hours_saved, detailed_feedback):
    dbName = "CNA_Visualizer"
    dbClient = pymongo.MongoClient('localhost', 27017)
    db = dbClient[dbName]
    collection = db["NCE_Feedback"]
    jsonData = {"user_name" : user_name, "cpy_key" : cpy_key, "audit_id" : audit_id, "company_PID" : company_PID, "hours_saved" :hours_saved , "detailed_feedback" : detailed_feedback}
    ins = collection.insert_one(jsonData)
    del jsonData["_id"]
    dbClient.close()


def getTime(format):
    if (format == "timestamp"):
        return (str(datetime.datetime.timestamp(datetime.datetime.now())).split(".")[0])
    elif (format == "date"):
        return (datetime.datetime.now())

def getgroupInventory(cpykey, group,CustomerName, auditId,auditType, group_info):
    #url = "https://mimir-prod.cisco.com/api/mimir/np/device_details?cpyKey={}&groupId={}".format(int(cpykey), int(group))
    #print(url)

    #payload={}
    #headers = {
    #  'Authorization': 'Bearer '+str(BT)
    #}

    #response = requests.request("GET", url, headers=headers, data=payload)
    d = group_info
    #d = data["data"]
    NP_Group_Data = []

    for i in d:
        Jsondata = {"Device_Name" : "" , "Device_IP" : "", "Product_Family" : "", "Product_ID" : "" , "Product_Type" : "" , "Software_Type" : "" , "Software_Version" : "", "NP_URL" : "","jsonFor":"", "Audit_ID":"", "Audit_Type":"", "timeStamp":"", "Customer_Name":"" }
        Jsondata["Device_Name"] = i["deviceName"]
        Jsondata["Device_IP"] = i["deviceIp"]
        Jsondata["Product_Family"] = i["productFamily"]
        Jsondata["Product_ID"] = i["productId"]
        Jsondata["Product_Type"] = i["productType"]
        Jsondata["Software_Type"] = i["swType"]
        Jsondata["Software_Version"] = i["swVersion"]
        Jsondata["NP_URL"] = i["deviceUrl"]
        Jsondata["jsonFor"] = "NPInventory"
        Jsondata["Audit_ID"] = auditId
        Jsondata["Audit_Type"] = auditType
        Jsondata["timeStamp"] = getTime("timestamp")
        Jsondata["Customer_Name"] =CustomerName
        NP_Group_Data.append(Jsondata)

        # print(i["deviceName"])


    #print(NP_Group_Data)
    insertNpdata(NP_Group_Data,cpykey)
    j={}
    k= {}

    for i in NP_Group_Data:

        if i['Product_Family'] not in j:

            j[i['Product_Family']] = 1
        else :
            j[i['Product_Family']] += 1

        if i["Software_Version"] not in k:

            k[i["Software_Version"]] = 1
        else :
            k[i["Software_Version"]] += 1

    hardwareSummaryGraph = []
    Jsondata = {"Chassis_Type":"", "Count":"", "jsonFor":"", "Customer_Name":"", "Audit_ID":"", "Audit_Type":"", "timeStamp":""}

    for key,value in j.items():
        print(key,value)
        Jsondata["Chassis_Type"] = key
        Jsondata["Count"]=value
        Jsondata["jsonFor"] = 'hardwareSummaryGraph'
        Jsondata["Audit_ID"] = auditId
        Jsondata["Audit_Type"] = auditType
        Jsondata["timeStamp"] = getTime("timestamp")
        Jsondata["Customer_Name"] =CustomerName
        hardwareSummaryGraph.append(Jsondata.copy())

    insertNpdata(hardwareSummaryGraph,cpykey)

    softwareSummaryGraph = []
    Jsondata = {"Software_Version":"", "Count":"", "jsonFor":"", "Customer_Name":"", "Audit_ID":"", "Audit_Type":"", "timeStamp":""}

    for key,value in k.items():
        print(key,value)
        Jsondata["Software_Version"] = key
        Jsondata["Count"]=value
        Jsondata["jsonFor"] = 'softwareSummaryGraph'
        Jsondata["Audit_ID"] = auditId
        Jsondata["Audit_Type"] = auditType
        Jsondata["timeStamp"] = getTime("timestamp")
        Jsondata["Customer_Name"] =CustomerName
        softwareSummaryGraph.append(Jsondata.copy())

    insertNpdata(softwareSummaryGraph,cpykey)




def get_customer_name(cpy_key,BearerToken):
    url = "https://mimir-prod.cisco.com/api/mimir/np/companies?cpyKey="+cpy_key
    payload={}
    headers = {
      'Authorization': 'Bearer '+str(BearerToken)
    }

    response = requests.request("GET", url, headers=headers, data=payload)
    group_data = response.json()
    print("printing group data for customer name :::: " + str(group_data))
    return group_data


@app.route('/groupNames' , methods = ['GET', 'POST'])
def groupNames():
   if request.method == 'GET':
      cpy_key = str(request.args.get('cpy_key'))
      result = getgroupname(cpy_key,BearerToken)
      return result

@app.route('/GetcustomerName' , methods = ['GET', 'POST'])
def GetcustomerName():
   if request.method == 'GET':
      cpy_key = str(request.args.get('cpy_key'))
      result = get_customer_name(cpy_key,BearerToken)
      return result

@app.route('/')
def index():
     global email_id
     global BearerToken
     if not auth.is_authenticated:
                # redirect to login and return to this page if successful
                BearerToken = auth.access_token
                return auth.login(return_to=request.url)
     else:

            datatest= auth.access_token

            #response = make_response(render_template('index.html'))
            response = make_response(redirect("http://auditanalysis.cisco.com:3000"))
            # naa_auth={auth.access_token}&naa_User={auth.get_user_info()['given_name']}&naa_email={auth.get_user_info()['email']}"
            #return redirect("http://auditanalysis.cisco.com:3000")
            response.set_cookie('naa_auth',auth.access_token,max_age=43200)
            response.set_cookie('naa_User',auth.get_user_info()["given_name"],max_age=43200)
            response.set_cookie('naa_email',auth.get_user_info()["email"],max_age=43200)
            email_id = auth.get_user_info()["email"]
  
            return response



@app.route('/getTableDataDB' , methods = ['GET', 'POST'])
def getTableDataDB():
   if request.method == 'GET':
      jsonData = []
      audit_id = str(request.args.get('audit_id'))
      file_name = str(request.args.get('file_name'))
      cpy_key = str(request.args.get('cpy_key'))
      table_name = str(request.args.get('table_name'))

      print("Recieved value ::::: "+audit_id+" "+file_name)
      jsonData = list(getTableFromDB(cpy_key, audit_id, file_name, table_name))
      for data in list(jsonData):
         del data["_id"]
         del data["jsonFor"]
         del data["Audit_ID"]
         del data["Audit_Type"]
         del data["timeStamp"]
         del data["Customer_Name"]
      #print(list(jsonData))
      return (json.dumps(list(jsonData)))

@app.route('/addNetRule')
def addNetRule():
        return render_template('addNetRule.html')


@app.route('/commandOutput')
def commandOutput():
        return render_template('commandOutput.html')


@app.route('/getSupportedAuditTypes' , methods = ['GET'])
def getSupportedAuditTypes():
     jsonData = {}
     if request.method == 'GET':
            with open(scriptPath+"/supported_audit_types.json" , "r") as f:
                 jsonData = json.loads(f.read())

            return jsonData


@app.route('/getCNAGraphs' , methods = ['GET'])
def getCNAGraphs():
    jsonData = {}
    if request.method == 'GET':
        company_key = request.args.get('company_key')
        audit_id = request.args.get('audit_id')
        jsonData["image_list"] = cna_graph_images.retriveImage(company_key, audit_id, "cna_graphs")
        del jsonData["image_list"][0]["_id"]
    return json.dumps(jsonData)





@app.route('/result.html')
def result(customer_name = 'blank', cpy_key ='blank', a_id='blank', a_type='blank'):

    if not auth.is_authenticated:
        return auth.login(return_to=request.url)
        #return auth.login(return_to=request.url)

    datatest= auth.access_token

    response = make_response(render_template('result.html', customer_name = customer_name, cpy_key = cpy_key, audit_id = a_id , audit_type = a_type))
    response.set_cookie('naa_auth',auth.access_token,max_age=43200)
    response.set_cookie('naa_User',auth.get_user_info()["given_name"],max_age=43200)
    response.set_cookie('naa_email',auth.get_user_info()["email"],max_age=43200)
    email_id = auth.get_user_info()["email"]
    return response


def getFromDB(cpy_key, audit_id, file_name):
     dbName = "CNA_Visualizer"
     dbClient = pymongo.MongoClient('localhost', 27017)
     db = dbClient[dbName]
     collection = db[cpy_key]
     query = {"Audit_ID" : audit_id , "jsonFor" : file_name}
     result = db[cpy_key].find(query)
     dbClient.close()
     return result


def getNCECommentData(audit_type, table_name, exception_name):
     finalComments = []
     dbName = "CNA_Visualizer"
     dbClient = pymongo.MongoClient('localhost', 27017)
     db = dbClient[dbName]
     collections = db.list_collection_names()
     for collection in list(collections):
            query = {'jsonFor':'allExceptions' , 'Audit_Type' : audit_type , 'Table Name' : table_name , 'Exception Name' : exception_name}
            result = db[collection].find(query)
            for res in list(result):
                 toAppend = {'Customer_Name' : res['Customer_Name'] , 'Severity':res['Severity'], 'NCE_Comment' : res['NCE_Comment']}
                 if(toAppend not in finalComments and toAppend['NCE_Comment'] != ''):
                        finalComments.append(toAppend)
     #print(finalComments)
     dbClient.close()
     return finalComments



@app.route('/updateFeedback' , methods = ['POST'])
def updateFeedback():
    if request.method =="POST":
            user_name = str(request.form['user_name'])
            cpy_key = str(request.form['cpy_key'])
            audit_id = str(request.form['audit_id'])
            hours_saved = str(request.form['hours_saved'])
            detailed_feedback = str(request.form['detailed_feedback'])
            company_PID_list = getCompanyPID(cpy_key, audit_id)
            if("comapny_PID" in company_PID_list[0].keys()):
                company_PID = company_PID_list[0]["company_PID"]
            else: 
                company_PID = "0"
            updateNCEFeedback(user_name, cpy_key, audit_id, company_PID, hours_saved, detailed_feedback)
            result = {"result" : "success"}
            return(result)



@app.route('/getAllNCEComments' , methods = ['GET'])
def getAllNCEComments():
     commentsJson = {}
     if request.method =="GET":
            audit_type = str(request.args.get('audit_type'))
            table_name = str(request.args.get('table_name'))
            table_name = table_name.split(":")[1].strip()
            exception_name = str(request.args.get('exception_name'))
            exception_name = exception_name.split(":")[1].strip()
            commentsJson['result'] = getNCECommentData(audit_type, table_name, exception_name)
            return(commentsJson)

@app.route('/getReport' , methods = ['GET'])
def getReport():
    if request.method =="GET":
            cpy_key = str(request.args.get('cpy_key'))
            audit_id = str(request.args.get('audit_id'))
            audit_type = str(request.args.get('audit_type'))
            customer_name = str(request.args.get('customer_name'))
            email_id = str(request.args.get('email'))
            #email_id = auth.get_user_info()["email"]
            p = Popen(["python3 "+scriptPath+"/createReport.py '"+cpy_key+"' '"+audit_id+"' '"+audit_type+"' '"+customer_name+"' '"+email_id+"'"], stdin=None, stdout=None, stderr=None, shell=True, close_fds=True)

            return json.loads('{}') , 200

@app.route('/getWordReport' , methods = ['GET'])
def getWordReport():
    if request.method =="GET":
            cpy_key = str(request.args.get('cpy_key'))
            audit_id = str(request.args.get('audit_id'))
            audit_type = str(request.args.get('audit_type'))
            customer_name = str(request.args.get('customer_name'))
            email_id = str(request.args.get('email'))
            #email_id = auth.get_user_info()["email"]
            p = Popen(["python3 "+scriptPath+"/createWordReport.py '"+cpy_key+"' '"+audit_id+"' '"+audit_type+"' '"+customer_name+"' '"+email_id+"'"], stdin=None, stdout=None, stderr=None, shell=True, close_fds=True)

            return json.loads('{}'), 200


@app.route('/getRowDetails' , methods = ['GET'])
def getRowDetails():
    if request.method =="GET":
            cpy_key = str(request.args.get('cpy_key'))
            audit_id = str(request.args.get('audit_id'))
            table_name = str(request.args.get('table_name'))
            row_number  = str(request.args.get('row_number'))
            jsonData = {}

            try:
                jsonData = get_row_details(cpy_key, audit_id, table_name, row_number)
                for data in jsonData:
                    del data["_id"]

            except Exception as e:
                print(str(e))
                jsonData = {"error" : str(e)}

            return(json.dumps(jsonData))


@app.route('/uploadComments' , methods = ['POST'])
def uploadComments():
     if request.method == 'POST':
            user_name = str(request.form['user_name'])
            cpy_key = str(request.form['cpy_key'])
            audit_id = str(request.form['audit_id'])
            table_name = str(request.form['table_name'])
            severity_to_update = str(request.form['severity'])
            table_name = table_name.split(":")[1].strip()
            exception_name = str(request.form['exception_name'])
            exception_name = exception_name.split(":")[1].strip()
            comment = str(request.form['comment'])
            try:
                 insertNCEComment(user_name,cpy_key,audit_id,table_name,exception_name,comment, severity_to_update)
                 return("successfully updated")
            except:
                 return("DB insertion failed")


@app.route('/upload' , methods = ['GET', 'POST'])
@cross_origin()
def upload():
     global email_id
     if request.method == 'POST':
            jsonData = {}
            f = request.files['zipfile']

            jsonData['emp_cec_id'] = request.form['emp_cec_id']
            jsonData['top_id'] = request.form['top_id']
            jsonData['customer_name'] = request.form['customer_name']
            jsonData['customer_key']  = request.form['customer_key']
            jsonData['audit_id']  = request.form['audit_id']
            jsonData['audit_type']  = request.form['audit_type_dropdown_name']
            jsonData['group']  = request.form['group_id']
            jsonData['file_name']  = f.filename
            jsonData['time_stamp'] = str(datetime.datetime.now())
            jsonData['customer_PID'] = request.form['customer_PID']
            jsonData["group_info"] = request.form['group_info']
            #BearerToken = request.headers["Authorization"].split(" ")[1]
            #print("Group Info stringify:::: ",jsonData["group_info"])
            os.chdir(scriptPath)
            f.save(secure_filename(f.filename))

            group = jsonData['group']
            cpykey = jsonData['customer_key']
            CustomerName=jsonData['customer_name']
            auditId = jsonData['audit_id']
            auditType = jsonData['audit_type']

            if(check_audit_info(jsonData['customer_key'], jsonData['audit_id'], jsonData['audit_type']) == False):
                if group != 1:
                    getgroupInventory(cpykey, group,CustomerName, auditId,auditType, json.loads(jsonData["group_info"]))

                saved_info_file = "uploadInfo_"+jsonData['customer_key']+"_"+jsonData['audit_id']+".json"
                with open(saved_info_file ,"w") as f:
                    f.write(json.dumps(jsonData))

                jsonCreator.mainFunction(saved_info_file)
                jsonCreator.insertBasicInfo(jsonData)
                email_id = jsonData['emp_cec_id']
                
                auditType= jsonData['audit_type'] .split(' ')
                AuditType= '+'.join(auditType)
                Uploadlink ='http://auditanalysis.cisco.com'
                mail_utility.email_in(email_id, 1, Uploadlink)

            Logging_Statistics(jsonData['emp_cec_id'], auditId, jsonData['customer_PID'] , cpykey)
            #h = {"Access-Control-Allow-Origin":"*"}
            redir =  redirect(url_for('result', customer_name = jsonData['customer_name'], cpy_key = jsonData['customer_key'], a_id = jsonData['audit_id'], a_type = jsonData['audit_type']))
            
            #redir.headers['Access-Control-Allow-Origin'] = '*'
            #print("response header : ", redir.headers)
            return redir

@app.route('/getData' , methods = ['GET', 'POST'])
def getData():
     if request.method == 'GET':
            jsonData = []
            audit_id = str(request.args.get('audit_id'))
            file_name = str(request.args.get('file_name'))
            cpy_key = str(request.args.get('cpy_key'))

            print("Recieved value ::::: "+audit_id+" "+file_name)
            jsonData = list(getFromDB(cpy_key, audit_id, file_name))
            for data in list(jsonData):
                 del data["_id"]
                 del data["jsonFor"]
                 del data["Audit_ID"]
                 del data["Audit_Type"]
                 del data["timeStamp"]
                 del data["Customer_Name"]
                 if("History" in data.keys()):
                    del data["History"]
            #print(list(jsonData))
            return (json.dumps(list(jsonData)))


@app.route('/getBasicInfo' , methods = ['GET', 'POST'])
def getBasicInfo():
     if request.method == 'GET':
            cpy_key = str(request.args.get('cpy_key'))
            audit_id = str(request.args.get('audit_id'))


            result = jsonCreator.getBasicInfoFromDB(cpy_key,audit_id)

            if("customer_PID" not in result.keys()):
                result.update(customer_PID ='0')
            print("getbasicinfo output ::: ")
            print(result)

            return result
            
@app.route('/getPreviousData' , methods = ['GET', 'POST'])
def getPreviousData():
            if request.method == 'POST':
                 user_email = request.form['emp_cec_id_2']
                 cpy_key = request.form['customer_key_prev']
                 audit_id = request.form['audit_name_prev']
                 customer_name = request.form['customer_name_prev']
                 audit_type = request.form['audit_type_prev']
                 customer_PID = request.form['customer_PID_2']

                 Logging_Statistics(user_email , audit_id, customer_PID,cpy_key)
                 return redirect(url_for('result', customer_name = customer_name, cpy_key = cpy_key, a_id = audit_id, a_type = audit_type))


@app.route('/uploadNetRuletoDB' , methods = ['GET', 'POST'])
def uploadNetRuletoDB():
     if request.method == 'POST':
            jsonData = {}
            jsonData['audit_type'] = request.form['audit_type']
            jsonData['table_name'] = request.form['table_name']
            jsonData['exception_name'] = request.form['exception_name']
            jsonData['description'] = request.form['description']
            jsonData['netRule'] = request.form['netRule']
            jsonData['netAdvice'] = request.form['netAdvice']

            print(jsonData['audit_type'] ,jsonData['table_name'], jsonData['exception_name'] , jsonData['description'] , jsonData['netRule'] , jsonData['netAdvice'])
            updateNetRules(jsonData)
            return(redirect(url_for('addNetRule')))

@app.route('/getNetRulefromDB' , methods = ['GET'])
def getNetRulefromDB():
     if request.method == 'GET':
            jsonData = {"net_rule" : "" , "net_advice" : ""}
            audit_type = request.args.get('audit_type')
            table_name = request.args.get('table_name')
            exception_name = request.args.get('exception_name')
            result = getNetRules(audit_type, table_name, exception_name)
            if(len(result) > 0):
                jsonData["net_rule"] = result[0]["netRule"]
                jsonData["net_advice"] = result[0]["netAdvice"]
            return(jsonData)

@app.route('/getNetRulefromDBv2' , methods = ['GET'])
def getNetRulefromDBv2():
     if request.method == 'GET':
            jsonData = {"net_rule" : "" , "net_advice" : ""}
            audit_type = request.args.get('audit_type')
            audit_id = request.args.get('audit_id')
            table_name = request.args.get('table_name')
            cpyKey = request.args.get('company_key')
            exception_name = request.args.get('exception_name')
            print(audit_id)
            result = getNetRulesv2(cpyKey, audit_id, audit_type, table_name, exception_name)
            if(len(result) > 0):
                jsonData["net_rule"] = result[0]["net_rule"]
                jsonData["net_advice"] = result[0]["net_advice"]
            return(jsonData)


@app.route('/changeSev' , methods = ['GET'])
def changeSev():
    if request.method == 'GET':
            user_name = request.args.get('user_name')
            audit_id = request.args.get('audit_id')
            table_name = request.args.get('table_name')
            cpyKey = request.args.get('company_key')
            exception_name = request.args.get('exception_name')
            nms_area = request.args.get('nms_area')
            old_sev = request.args.get('old_sev')
            new_sev = request.args.get('new_sev')
            print(audit_id, table_name, cpyKey,exception_name,  nms_area, old_sev, new_sev)
            try:
                change_severity(user_name, cpyKey, audit_id, table_name, exception_name, nms_area, old_sev, new_sev)
                return("successfully changed Severity")
            except Exception as e:
                print("------")
                print(e)
                print("------")
                return("Failed to update severity")



@app.route('/changeDNRFlag' , methods = ['GET'])
def changeDNRFlag():
    if request.method == 'GET':
            user_name = request.args.get('user_name')
            audit_id = request.args.get('audit_id')
            table_name = request.args.get('table_name')
            cpyKey = request.args.get('company_key')
            exception_name = request.args.get('exception_name')
            old_flag = request.args.get('old_flag')
            new_flag = request.args.get('new_flag')
            nms_area = request.args.get('nms_area')
            sev = request.args.get('sev')
            #print(audit_id, table_name, cpyKey,exception_name,  nms_area, old_sev, new_sev)
            try:
                change_DNRFlag(user_name, cpyKey, audit_id, table_name, exception_name, old_flag, new_flag, nms_area, sev)
                return("successfully changed DNR Flag")
            except Exception as e:
                print("------")
                print(e)
                print("------")
                return("Failed to update DNR Flag")



@app.route('/getAuditInfo' , methods = ['GET'])
def getAuditInfo():
     if request.method == 'GET':
            jsonData = {}
            customer_key = request.args.get('customer_key')
            audit_id = request.args.get('audit_id')
            audit_type = request.args.get('audit_type')
            result = getCurrentAuditInfo(customer_key, audit_id, audit_type)
            jsonData = result[0]
            del jsonData["_id"]
            del jsonData["jsonFor"]
            del jsonData["Audit_ID"]
            del jsonData["Audit_Type"]
            del jsonData["timeStamp"]
            del jsonData["Customer_Name"]
            return(jsonData)



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
     app.run(host='0.0.0.0' , port = 8001, debug=True)
