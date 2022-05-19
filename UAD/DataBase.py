#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jul  4 20:19:12 2020

@author: vikasran
"""

from pymongo import MongoClient
import json
import pandas as pd
from pathlib import Path
import os
import numpy as np
import datetime
from datetime import date




root = os.path.dirname(os.path.realpath(__file__))



class DataBase:
    def __init__(self, host, port):
        self.host = host
        self.port =  port
        print("init part done")
        
    def createDatabase(self, db_name):
        client = MongoClient(self.host, self.port)
        avail_db = client.list_database_names() # listing all available databases
        
        # check if the database already existing with same name #
        if db_name in avail_db:
            return 
    
        else:        
            self.db = client[db_name]
            print(f'database name "{db_name}" created successfully')
        
        client.close()
    
    def createCollection(self,db_name, coll_name, data_to_insert):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_list = db.list_collection_names()

        if coll_name in coll_list:
            print(f'The given collection having name:  "{coll_name}" is already present in this DataBase {db_name}\n\n')
            #self.db[coll_name].drop()  # drop the collection
            
        
        else:
            
            
            coll = db[coll_name]
            
            if ".json" in data_to_insert:
                print(f'It is a json file insertion')
                with open(Path(root)/data_to_insert) as file: 
                    file_data = json.load(file) 
                    
            # if JSON contains data more than one entry, insert_many is used else inser_one is used 
                if isinstance(file_data, list): 
                    coll.insert_many(file_data)   
                else: 
                    coll.insert_one(file_data)
            else:
                #print(f'It is a json data insertion')
                coll.insert(data_to_insert)

        
        client.close()
    
    def edit_old_Collection(self,db_name, coll_name, data_to_insert):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_list = db.list_collection_names()
        coll = db[coll_name]
        if coll_name in coll_list:
            db[coll_name].drop()
            coll.insert(data_to_insert)
        else:
            coll.insert(data_to_insert)



    def  fetchDataFromDB(self, db_name, coll_name,query={}):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        
        col_exist = coll_name in db.list_collection_names()
        
        if col_exist == False:
            return None
        
        collection = db[coll_name]
        if query == {}:
            data = list(collection.find({},{'_id':0}))
        else:
            data = list(collection.find(query,{'_id':0}))

        client.close()
        
        return data
        #return json.dumps(data, indent=2)
    
    def sortWith(self, db, sort_attr):  #sorts database based on sort_attr
        dici = {"NEED TO FILL BY NCE":5, 'INFO-ONLY':4,'LOW':3, 'MEDIUM':2, 'HIGH':1}
        newlist = sorted(db, key=lambda x: dici[x[sort_attr].upper().strip()])
        return newlist

    def fetchAllRecomFromDB(self, coll_name,code):
        client = MongoClient(self.host, self.port)
        avail_db = client.list_database_names()
        data=[]
        if coll_name=='bp_data_table':
            coll_name='BP_Exception'
        for db_name in avail_db:
            li=db_name.split("_")
            pid=li[-1]
            st=''
            for x in li[2:-1]:
                st+=x+"_"
            st=st[:-1]
            #print('PID:'+pid)
            #print("STRING:"+st)
            db = client[db_name]
            collection = db[coll_name]
            if(coll_name=="UCS_FAULT"):
                l=list(collection.find({"Code":{"$in":[code]}}))
                if(l!=[]):
                    dic=l[0]
                    dic['Cust_name'] = st
                    dic['pid'] = pid
                data.extend(l)
            elif(coll_name=="BDB_DATA"):
                lst=[code,' '+code]
                l=list(collection.find({"Heading":{"$in":lst}}))
                if(l!=[]):
                    dic=l[0]
                    dic['Cust_name'] = st
                    dic['pid'] = pid
                data.extend(l)
            elif(coll_name=="BP_Exception"):
                l=list(collection.find({"Observation":{"$in":[code]}}))
                if(l!=[]):
                    dic=l[0]
                    dic['Cust_name'] = st
                    dic['pid'] = pid
                data.extend(l)
        df = pd.DataFrame(data)
        data=df.reindex(df.Recommendation.str.len().sort_values(ascending=False).index).reset_index(drop=True).to_dict('records')        
        client.close()
        return data
    
    def dropDataBase(self, db_name):
        client = MongoClient(self.host, self.port)
        
        if db_name in client.list_database_names():
            client.drop_database(db_name)
            print(f'Database: "{db_name}" got deleted successfully')
        else:
            print(f'There is no such database having name: {db_name}')
        
        client.close()
    
    def listOfDB(self):
        client = MongoClient(self.host, self.port)
        db_list = client.list_database_names()
        
        print(f'Existing Databases in the System is:')
#        for item in db_list:
#            print(item)
        client.close()
        return db_list

    def listOfCollections(self,db_name):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_list = list(db.list_collection_names())
        client.close()
        return coll_list
    
    def addData(self,db_name,coll,data):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_list = db.list_collection_names()
        
        if coll in coll_list:
            coll_data = db[coll]
            if ".json" in data:

                print(f'It is a json file insertion')
                with open(Path(root)/data) as file: 
                    file_data = json.load(file) 
                    
            # if JSON contains data more than one entry, insert_many is used else inser_one is used 
                if isinstance(file_data, list): 
                    coll_data.insert_many(file_data)   
                else: 
                    coll_data.insert_one(file_data)
            else:
                #print(f'It is a json data insertion')
                coll_data.insert(data)
        else:
            print('going to create collections')
            self.createCollection(db_name,coll,data)
            
        client.close()

    def getAllOS(self,db_name,coll):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_data=db[coll]
        OS=list(coll_data.distinct('OSVENDOR'))
        return OS
    
    def getAllFC(self,db_name,coll):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_data=db[coll]
        u=list(coll_data.distinct('UCSM'))
        return u


    def delAllData(self,db_name,coll):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_data=db[coll]
        print('going to del all data for:',coll)
        _id=coll_data.delete_many({})
        client.close()

    def dropCollection(self,db_name,coll):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        coll_data=db[coll]
        coll_data.drop()
        client.close()
    


    def deleteCollection(self, db_name, coll_name,val):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        if coll_name=='BDB_DATA':
            data=val.split('&')
            myquery = { 'ID': int(data[0]), 'Domain':str(data[1]).strip() }    
        else:
            myquery = { 'ID': int(val) }
        print(myquery)
        #coll_list = db.list_collection_names()
        mycol = db[coll_name]
        del_document=mycol.delete_one(myquery)
        client.close()
        
    
    def availCollection(self, db_name):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        
        print(f'Collections present is DB "{db_name}" is:')
        for col in db.list_collection_names():
            print(col)

    def search(self,db_name,coll,query):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        collection_data=db[coll]
        res=list(collection_data.find(query,{"_id":0}))
        
        client.close()
        return res
    
    def checkConnectivity(self, db_name):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        
        try: 
            db.command("serverStatus")
        except Exception as e: 
            print(e)
        else: 
            print("You are connected!")
        client.close()
    
    
    def editrecord(self, db_name, id, col_type, value):
        coll_map = {'bp_id':'BP_Exception', 'bdb_data':'BDB_DATA', 'fault_id':'UCS_FAULT',"eol":"EolDATA",'portcap':"port_capacity"}
        print(f'program came to DataBase file with value: {db_name, id, col_type, value}')
        client = MongoClient(self.host, self.port)
        db = client[db_name]

        record_id = id.split('__')[0]
        coll_name = id.split('__')[1]

        collection = db[coll_map[coll_name]]
        collection.update_one({"ID":int(record_id)},{"$set":{col_type:value}})
        client.close()

    def compData(self, db_name, col_name, query, value):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        collection = db[col_name]
        
        collection.update(query,{"$set":{"time":value}},upsert=True)
        client.close()

    def updatebardata(self, db_name):
        client = MongoClient(self.host, self.port)
        db = client[db_name]
        collection = db['bar_stats_data']
        faultdata = self.fetchDataFromDB(db_name, "UCS_FAULT") # fault data from DB
        
        
        if faultdata != None:
            df = pd.DataFrame(faultdata)
            fault = df['Severity'].value_counts() 
            fault = fault.to_dict()



            # for BP Data
        bpdata = self.fetchDataFromDB(db_name, "BP_Exception") # fault data from DB EolDATA
            
        if bpdata != None:
                
            df = pd.DataFrame(bpdata)
            bp = df['Severity'].value_counts() 
            bp = bp.to_dict()

        bdbdata = self.fetchDataFromDB(db_name, "BDB_DATA")  
        if bdbdata  !=  None:
            df = pd.DataFrame(bdbdata)
            bdb = df['Severity'].value_counts()
            bdb = bdb.to_dict()
        else:
            bdb = {}
            

        if bpdata==None:
            bp={}
        if faultdata==None:
            fault = {}

            #print(f'value of count1:{count1} and count2 is:{count2}')
            # for insight count
        for severity in ['High', 'Medium', 'Low', 'Info-only']:
            if severity not in fault.keys():
                fault[severity] = 0
            if severity not in bp.keys():
                bp[severity] = 0
            if severity not in bdb.keys():
                bdb[severity] = 0


            
            #print(f'Now value of count1:{count1} and count2 is:{count2}')

        high_tot = int(fault['High'] + bp['High'] + bdb['High'])
        med_tot = int(fault['Medium'] + bp['Medium'] + bdb['Medium'])
        low_tot =int(fault['Low'] + bp['Low'] + bdb['Low'])
        info = int(fault['Info-only'] + bp['Info-only'] + bdb['Info-only']) 
            
            
        total_count={}
        total_count['High'] = high_tot
        total_count['Medium'] = med_tot
        total_count['Low'] = low_tot
        total_count['Info-only'] = info

        eol = self.fetchDataFromDB(db_name, "EolDATA")
        if eol != None:
            df1 = pd.DataFrame(eol)
            inventory_count = len(df1)
            df = df1.replace(to_replace='None', value=np.nan).dropna()
            today = pd.to_datetime(date.today())
            df['LDoS_DATE'] = pd.to_datetime(df['LDoS'])
            df = df[['Model','LDoS_DATE']]
            df['Diff'] = (df['LDoS_DATE']- today)
            df['Diff']= df['Diff'].astype('timedelta64[D]').astype(int)
            bins = [- np.inf, 0, 365, 730, 1095, 1460]
            names = ['LDoS Reached', 'LDoS in 1 Year', 'LDoS in 2 Years', 'LDoS in 3 Years', 'LDoS in 4 Years']
            df['Category'] = pd.cut(df['Diff'], bins, labels=names)
            df_c = df.groupby('Category').count()
            df_c = df_c[['Model']]
            el = df_c.to_dict()['Model']
        else:
            el = {'LDoS Reached': 0, 'LDoS in 1 Year': 0, 'LDoS in 2 Years': 0, 'LDoS in 3 Years': 0, 'LDoS in 4 Years': 0}


        collection.update({},{"$set":{'bp':bp}})
        collection.update({},{"$set":{'fault':fault}})
        collection.update({},{"$set":{'bdb':bdb}})
        collection.update({},{"$set":{'total':total_count}})
        collection.update({},{"$set":{'LDoSStats':el}})

        client.close()


    def checkDBexist(self, db_name):
        client = MongoClient(self.host, self.port)
        dbnames = client.list_database_names()
        client.close()
        if db_name in dbnames:
            return True
        else:
            return False


def cleandb():
    d = DataBase("localhost", 27017)
    db_list = d.listOfDB()
    for db in db_list:
        if "UCS_DB_" in db: 
            d.dropDataBase(db)
            print(f'{db} got dropped from DATABASE')   
        else:
            print(f'There is no DB related UCS_DB')



        
#cleandb()      # to clear the clutter

##d.availCollection('UCS_GLOBAL_COLLECTION')
##d.createDatabase('temp_db')
##d.checkConnectivity('temp_db')
#d.dropDataBase('UCS_DB_Telstra_914601')
##d.listOfDB()
#
##f = d.createDatabase('Telstra_DB')
##
##
#d.createCollection('UCS_GLOBAL_COLLECTION',"UCS_BP_LIST","UCS BP ICs.json" )
##dat = d.fetchDataFromDB('temp_db',"overview_stats" )
##print(dat)
#
#d.deleteCollection('temp_db','overview_stats')






