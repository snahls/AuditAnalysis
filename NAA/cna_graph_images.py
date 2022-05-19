import os
import json
import openpyxl
import pymongo
from bs4 import BeautifulSoup
import datetime

scriptPath = os.path.dirname(os.path.realpath(__file__))


def insertImage(cpyKey, data):
  dbName = "CNA_Visualizer"
  dbClient = pymongo.MongoClient('localhost', 27017)
  db = dbClient[dbName]
  collection = db[cpyKey]
  ins = collection.insert_one(data)
  del data["_id"]
  dbClient.close()


def retriveImage(cpyKey, auditID, jsonFor):
    jsonData = []
    dbName = "CNA_Visualizer"
    dbClient = pymongo.MongoClient('localhost', 27017)
    db = dbClient[dbName]
    collection = db[cpyKey]
    query = {"jsonFor" : jsonFor, "Audit_ID" : auditID}
    images = collection.find(query)
    jsonData = list(images)
    #for image in images:
    #    # print(type(image))
    #    for k, v in image.items():
    #        if k == '_id' or k == 'jsonFor' or k == 'Customer_Name' or k == 'Audit_ID' or k == 'Audit_Type' :
    #            continue
    #        with open(k+'.png', 'wb') as W:
    #            W.write(v)
    dbClient.close()
    return jsonData

def GraphInsertion(fileName, cpyKey, auditID, customerName, audit_type):
    jsondata = {}
    jsondata["jsonFor"] = "cna_graphs"
    jsondata["Customer_Name"] = customerName
    jsondata["Audit_ID"] = auditID
    jsondata["Audit_Type"] = audit_type
    
    for f in os.listdir(scriptPath+"/"+fileName+"/Full/summary/chart"):
      # print(f)
      with open(scriptPath+"/"+fileName+"/Full/summary/chart/"+f, 'rb') as F:
          key = f.split('.')[0]
          imgdata = F.read()
          jsondata[key] = imgdata
            
    
    insertImage(cpyKey, jsondata)


#GraphInsertion(file_name'63668',cpykey'120086', audit_id'63668', 'customer 1', 'Nexus Audit')

#retriveImage('120086', '63668', 'Images')

