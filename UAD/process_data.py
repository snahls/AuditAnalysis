#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat May 30 19:42:15 2020

@author: vikasran
"""

import os
import json
from zipfile import ZipFile 
root = os.path.dirname(os.path.realpath(__file__))
from pathlib import Path
import pandas as pd
from DataBase import DataBase
#from componentMappingFaults import *
database = DataBase('localhost', 27017)
from showtech_data_analyser import *
from insightsummary import *
from datetime import date
from datetime import datetime
from dateutil.relativedelta import relativedelta
from bson.objectid import ObjectId
from numpy import nan

JSON_Location = {}


def call_all_fun(scripPath,db_name):
    #database.createCollection('UCS_GLOBAL_COLLECTION',"UCS_BP_LIST","UCS BP ICs.json") # This is a Global Excel for BP, made by the team. 

    try:
        faultData(scripPath,db_name, "UCS_FAULT") # this  function will create the final list of fault data and save in DB
    except:
        print('some issue in faultdata()')


    try:
        check_bp(scripPath,db_name, "BP_Exception") # generate the data for BP, and get the final data
    except:
        print('some issue in check_bp()')

    

    try:
        eoldata(scripPath,db_name,"EolDATA" ) # generate EoL data for all the items and insert into DataBase with the collection nane 'EoLDATA'
    except:
        print('some issue in eoldata()')


    try:
        port_capacity(scripPath,db_name, "port_capacity") # generate port-capacity data for inventory items and insert into DataBase with the collection nane 'port_capacity'
    except:
        print('some issue in port_capacity()')

    

    # try:
    #     bdbdata(db_name)
    # except:
    #     print('some issue in bdbdata()')

    
    try:
        create_graph_data(scripPath,db_name)
    except:
        print('some issue in create_graph_data()')

    
    try:
        summ_insight = insight_summary(db_name)
        if not(summ_insight==[]):
            database.createCollection(db_name, "InsightSummary", summ_insight)
    except:
        print('some issue in insight_summary()')
        
        


def generateJSON(filePath, excel_file,file_sheet, filename):
    
    excel_data_df = pd.read_excel(filePath/excel_file, sheet_name=file_sheet, skiprows=range(0,4))
    json_str = excel_data_df.to_json(orient='records')
    parsed = json.loads(json_str)
    Path(filePath/f"{filename}_JSON_Files").mkdir(exist_ok=True)
    
    with open(filePath/f'{filename}_JSON_Files/{file_sheet}.json', "w") as outfile: 
        outfile.write(json.dumps(parsed, indent=2))
    
    
    JSON_Location[f'{filename}_{file_sheet}']= str(filePath/f'{filename}_JSON_Files/{file_sheet}.json')
    
    return 1
    
    
                  
def mainFunction(scriPath, dcafFileName, db_name):
    
    print('JSON creating ...')    
    rootPath = Path(scriPath)
   
    zip_parent_folder = dcafFileName[:dcafFileName.find('.')]# fetch the name of file, used to be placed unzipped folder here
    #print(f'zip_parent_folder name of this project: {zip_parent_folder}')
   
    archive = ZipFile(rootPath/dcafFileName)
    archive.extractall(rootPath/zip_parent_folder)
    
    # checkin if there any zip file within this folder
    
    for file in os.listdir(rootPath/zip_parent_folder):
        if file.endswith(".zip"):
            archive = ZipFile(rootPath/zip_parent_folder/file)
            fol = file[:file.find('.')] # fetch the name of file, used to be placed unzipped folder here
            archive.extractall(rootPath/zip_parent_folder/fol)
        
		
    filePath  = rootPath/zip_parent_folder
    excel_lookup_required =  ['UCS-DCAF-InventoryExcelReport','UCS-DCAF-FirmwareConsistency', 'UCS-DCAF-AIXReport']
    
    json_data_info =  {}
    
    for lookup in excel_lookup_required:
        
        excel_file=''
        #print('lookup:',lookup)
        for filename in sorted(os.listdir(filePath)):
            #print('filename:',filename)
            
            if filename.startswith(lookup):
                
                #print(f'excel file {lookup} got having complete name: {filename}')
                excel_file = pd.ExcelFile(filePath/filename)
                #print(f'excel file going for conversion is:{excel_file}')
                break
        #print('excel_file:',excel_file)
        sheet_names = excel_file.sheet_names
        
        ctr=0
        
        
        
        for i in range(1, len(sheet_names)):#min(5, len(sheet_names))
            if i < 13 or  i == 50 :
                ctr += generateJSON(filePath, excel_file, sheet_names[i], filename[:filename.find('.')])
            
        #print(f'Total {ctr} no of JSON generated in the {filename} Excel file \n')
        
        #print(filePath/f"{filename[:filename.find('.')]}_JSON_Files")
        
        json_data_info[lookup]  = str(filePath/f"{filename[:filename.find('.')]}_JSON_Files")
   
#    with open("JSON_FILE_Info.json" ,"w") as f:
#        f.write(json.dumps(json_data_info, indent=2))
#        
    
    
    with open(filePath/"entire_JSON_loc.json" ,"w") as f:
        f.write(json.dumps(JSON_Location, indent=2))
    
    #print('JSON created ...')
    #print('Overview_info JSON created !!!')
    
    #print("\n\n\n\nHISTORY of JSON:")
    #print(json.dumps(JSON_Location, indent=2))
    Json_for_Overview(filePath, db_name=db_name)
    

def Json_for_Overview(filePath, db_name):
    jsonData = {}
    jsonDetailData = {}
    jsonDetailDataSegregeted = {}
    
    with open(filePath/'entire_JSON_loc.json' , "r") as f:

        open_info_json = json.loads(f.read())
        cluster_loc = open_info_json["UCS-DCAF-FirmwareConsistencyReport_Clusters"]
        fabric_loc = open_info_json["UCS-DCAF-InventoryExcelReport_Fabric Interconnects"]
        bladechassis_loc  = open_info_json["UCS-DCAF-InventoryExcelReport_Blade Chassis"]
        bserver_loc = open_info_json["UCS-DCAF-InventoryExcelReport_B-Series Servers"]
        serviceprofile_loc =  open_info_json["UCS-DCAF-InventoryExcelReport_Service Profiles"]

    

#        
    
    #  fetching overview  info on Domain data: Domain name, Version
    f = open(Path(cluster_loc))

    temp_domain_detail ={}
    Domain_JSON = {}

    temp_domain_name=[]
    temp_domain_version=[]
    ctr=1

    datal = json.load(f)
    seen = set()
    data = []
    for d in datal:
        t = tuple(d.items())
        if t not in seen:
            seen.add(t)
            data.append(d)
    for item in data:
        Dom=[]
        #print(item["Domain"])
        temp_domain_name.append(item["Domain"])
        temp_domain_version.append(item['Version'])

        # making Data in [ucs, version] format in JSON Form
        Dom.append(item["Domain"])
        Dom.append(item['Version'])
        Domain_JSON[f'Domain_{ctr}']=Dom
        ctr+=1
        #########################

    temp_domain_detail['Name'] = temp_domain_name
    temp_domain_detail['Version']=temp_domain_version

    #print(f'Domain Details: \n  {temp_domain_detail}')
    #print(f'Domain Details in segregated form: \n  {Domain_JSON}')

    jsonData['num_domain']=len(data)
    jsonDetailData['domain'] = temp_domain_detail

    jsonDetailDataSegregeted['domain'] = Domain_JSON  # <<<< this one I have prepared for report purpose

    f.close()
    


     #  fetching overview  info on FIs: 
    f = open(Path(fabric_loc))
    
    temp_FI_detail ={}
    FI_D_JSON={}

    temp_FI_IP=[]
    temp_FI_model=[]
    temp_FI_domain=[]
    temp_FI_name=[]

    
    datal = json.load(f)
    seen = set()
    data = []
    for d in datal:
        t = tuple(d.items())
        if t not in seen:
            seen.add(t)
            data.append(d)
    ctr = 1
    for item in data:
      #print(item)
      FI_D=[]
      temp_FI_domain.append(item['UCS Domain'])
      temp_FI_name.append(item['Device Name'])
      temp_FI_model.append(item['Model'])
      temp_FI_IP.append(item['Ip Address'])


      # making data in [UCS_domaim, FI-Model, IP Address] format in JSON
      FI_D.append(item['UCS Domain'])
      FI_D.append(item['Device Name'])
      FI_D.append(item['Model'])
      FI_D.append(item['Ip Address'])
      FI_D_JSON[f'FI_{ctr}'] = FI_D
      ctr+=1
      ###########################
    
    temp_FI_detail['Domain']=temp_FI_domain
    temp_FI_detail['Model']=temp_FI_model
    temp_FI_detail['IP']=temp_FI_IP
    temp_FI_detail['Device Name']= temp_FI_name
        
    
    #print(f'\n\nFI temp data is: \n{temp_FI_detail}' )
    #print(f'\nFI temp data in other format is\n{FI_D_JSON}' )


    jsonDetailData['FI']=temp_FI_detail
    jsonData['num_FI']=len(data)

    jsonDetailDataSegregeted['FI'] = FI_D_JSON  # <<<< this one I have prepared for report purpose

    f.close()


    
     #  fetching overview  info on Blade-Chassis
    f = open(Path(bladechassis_loc))
    temp_chassis_detail ={}
    chassis_JSON={}

    temp_domain=[]
    temp_name=[]
    temp_model=[]

    ctr = 1
    datal = json.load(f)
    seen = set()
    data = []
    for d in datal:
        t = tuple(d.items())
        if t not in seen:
            seen.add(t)
            data.append(d)
    for item in data:

        chassis = []
        temp_domain.append(item['UCS Domain'])
        temp_name.append(item['Device Name'])
        temp_model.append(item['Model'])

        chassis.append(item['UCS Domain'])
        chassis.append(item['Device Name'])
        chassis.append(item['Model'])

        chassis_JSON[f'chassis_{ctr}']=chassis
        ctr+=1
    
    temp_chassis_detail['UCS Domain']  = temp_domain
    temp_chassis_detail['Device Name'] = temp_name
    temp_chassis_detail['Model'] = temp_model
            
    jsonDetailData['Chassis']=temp_chassis_detail
    jsonData['num_chassis']=len(data)
    jsonDetailDataSegregeted['Chassis']=chassis_JSON

    #print(f'\n\nChasis temp data is: \n{temp_chassis_detail}' )
    #print(f'\nChassis temp data in other format is\n{chassis_JSON}' )

    f.close()
    
    #  #  fetching overview  info on B-Series Server from inventory tab
    f = open(Path(bserver_loc))

    temp_B_server_detail ={}
    B_server_JSON = {}

    temp_domain =[]
    temp_name=[]
    temp_model=[]

    datal = json.load(f)
    seen = set()
    data = []
    for d in datal:
        t = tuple(d.items())
        if t not in seen:
            seen.add(t)
            data.append(d)
    ctr =1

    for item in data:
                
        B_server = []
                
        temp_domain.append(item['UCS Domain'])
        temp_name.append(item['Device Name'])
        temp_model.append(item['Model'])

        B_server.append(item['UCS Domain'])
        B_server.append(item['Device Name'])
        B_server.append(item['Model'])

        B_server_JSON[f'B_server_{ctr}']=B_server
        ctr+=1

    temp_B_server_detail['UCS Domain']=temp_domain    
    temp_B_server_detail['Device Name'] =  temp_name
    temp_B_server_detail['Model'] = temp_model                
                
    jsonDetailData['B_Server']=temp_B_server_detail    
    jsonData['num_b_server']=len(data)
    jsonDetailDataSegregeted['B_Server']=B_server_JSON

    #print(f'\n\nB_Server temp data is: \n{temp_B_server_detail}' )
    #print(f'\nB_Server temp data in other format is\n{B_server_JSON}' )

    f.close()



    
     #  fetching overview  info on Service profile
    f = open(Path(serviceprofile_loc))
    temp_serv_profile ={}
    serv_prof_JSON={}

    temp_domain=[]
    temp_sp=[]
    temp_template=[]
    
    ctr=1

    datal = json.load(f)
    seen = set()
    data = []
    for d in datal:
        t = tuple(d.items())
        if t not in seen:
            seen.add(t)
            data.append(d)
    for item in data:
                
        serv_prof = []

        temp_domain.append(item['UCS Domain'])
        temp_sp.append(item['Service Profile Name'])
        temp_template.append(item['Template Name'])

        serv_prof.append(item['UCS Domain'])
        serv_prof.append(item['Service Profile Name'])
        serv_prof.append(item['Template Name'])

        serv_prof_JSON[f'Service_profile_{ctr}']=serv_prof

        ctr+=1





    temp_serv_profile['UCS Domain']= temp_domain    
    temp_serv_profile['Service Profile Name'] = temp_sp
    temp_serv_profile['Template Name'] = temp_template
            
    jsonDetailData['Service_profile']= temp_serv_profile    
    jsonData['num_serv_profile']=len(data)
    jsonDetailDataSegregeted['Service_profile']=serv_prof_JSON

    #print(f'\n\nService profile temp data is: \n{temp_serv_profile}' )
    #print(f'\nService Profile data in other format is\n{serv_prof_JSON}' )


    f.close()
    
    #print(json.dumps(jsonDetailData, indent=2)) 
    #print(json.dumps(jsonData, indent=2))
    
#    with open("Overview_Page_Info.json" ,"w") as f:
#        f.write(json.dumps(jsonData, indent=2))   
#    
#    with open("Overview_Page_Info_detail.json" ,"w") as f:
#        f.write(json.dumps(jsonDetailData, indent=2)) 
    
    database.createCollection(db_name, "overview_stats", jsonData)   #inserting into databse  with the collection name "overview_stats"
    database.createCollection(db_name, "overview_stats_detail",jsonDetailData) #inserting into databse  with the collection name "overview_stats_detail"
    database.createCollection(db_name, "overview_stats_detail_segregated",jsonDetailDataSegregeted) #   

    print('JSON for OVERVOW is finished\n')
    
        
# function is to genearte JSON for any genearl file apatrt from DCAF sheet like BP_IC    
def generateJSONSingleExcel(filePath, excel_file,file_sheet):
    
    print('going to convert JSON ...  ')
    
    #print(f'filePath: {filePath}, excel_file = {excel_file},file_sheet={file_sheet}')
    excel_data_df = pd.read_excel(filePath/excel_file, sheet_name=file_sheet)#, skiprows=range(0,4))
    json_str = excel_data_df.to_json(orient='records')
    parsed = json.loads(json_str)
    
    #Path(filePath/f"{filename}_JSON_Files").mkdir(exist_ok=True)
    
    with open(filePath/f'{file_sheet}.json', "w") as outfile: 
        outfile.write(json.dumps(parsed, indent=2))  
    
    #print(f'JSON file converted with the name {filePath/file_sheet}.json')
        
        
        
def check_bp(scripPath,db_name, coll_name="UCS_BP_LIST"):

    with open(Path(scripPath)/'entire_JSON_loc.json' , "r") as f:

        open_info_json = json.loads(f.read())
        jsonfile_loc = open_info_json["UCS-DCAF-AIXReport_Recommendations"]
        #print(f'got the folder location: {jsonfile_loc}')

    
    # Open Customer Exception List [AIX-file]
    with open(Path(jsonfile_loc), "r") as f:
        #temp = json.loads(f.read())
        temp = json.load(f)
    if(temp==[]):
        print('Empty BP')
        database.createCollection(db_name, coll_name,[{}] )

    # converting list into Pandas Datframe    
    cust_bp_df = pd.DataFrame(temp)   #System Name, Rule Name, Rule Title, Description, BP Recommendation, Corrective Action
    cust_bp_df=cust_bp_df.groupby('Rule Title').agg(lambda x : ', '.join(set(x))).reset_index()

    if len(cust_bp_df)!=0:

        # open STANDARD Sheet created by Team , it may get updated with time and convet into Pandas Datframe
        #print(f'going to fetch data to database having {db_name} and {coll_name}')
        data = database.fetchDataFromDB("UCS_GLOBAL_COLLECTION", "UCS_BP_LIST")
        #print('came out ')
        d = pd.DataFrame(data)  #ID, Observation, Implication/Description, Recommendation, Component, Risk
                        

        bp_df=pd.DataFrame()

        #print(f'Length of DataFrame= {len(bp_df)}')

        bp_df['ID'] = range(1, len(cust_bp_df))
        bp_df['Domain'] = cust_bp_df['System Name']
        bp_df['Observation'] = cust_bp_df['Rule Title']
        bp_df['Description'] = bp_df['Observation'].map(d.set_index('Observation')['Implication/Description'])
        bp_df['Recommendation'] = bp_df['Observation'].map(d.set_index('Observation')['Recommendation'])
        bp_df['Severity'] = bp_df['Observation'].map(d.set_index('Observation')['Risk'])

        
        bp_df["Severity"].fillna("Need to fill by NCE", inplace = True)
        bp_df["Description"].fillna("Need to fill by NCE", inplace = True)
        bp_df["Recommendation"].fillna("Need to fill by NCE", inplace = True)

        bp_df = bp_df[['ID','Domain','Severity','Observation','Description','Recommendation']]

        #print(bp_df)
        

        # now we have bp_df is ready but we need to make it in list format and save in Database
        bp_df_list = bp_df.values.tolist()
        bp_df_list_final=[]

        for i in range(len(bp_df_list)):
            # temp={}
            # temp["ID"]=bp_df_list[i][0]
            # temp["Domain"]=bp_df_list[i][1]
            # temp["Severity"]=bp_df_list[i][2]
            # temp['Observation']=bp_df_list[i][3]
            # temp["Description"]=bp_df_list[i][4]
            # temp["Recommendation"]=bp_df_list[i][5] 
            # bp_df_list_final.append(temp)
            try:
                l= database.fetchAllRecomFromDB("BP_Exception",bp_df_list[i][3])
                temp={}
                temp["ID"]=bp_df_list[i][0]
                temp["Domain"]=bp_df_list[i][1]
                if(bp_df_list[i][2]=='Need to fill by NCE'):
                    if(pd.isna(l[0]['Severity'])):
                        temp['Severity']=bp_df_list[i][2]
                    else:
                        temp["Severity"]=l[0]['Severity']
                else:
                    temp["Severity"]=bp_df_list[i][2]
                temp['Observation']=bp_df_list[i][3]
                if(bp_df_list[i][4]=='Need to fill by NCE'):
                    if(pd.isna(l[0]['Description'])):
                        temp["Description"]=bp_df_list[i][4]
                    else:
                        temp["Description"]=l[0]['Description']
                else:
                    temp["Description"]=bp_df_list[i][4]
                if(bp_df_list[i][5]=='Need to fill by NCE'):
                    if(pd.isna(l[0]['Recommendation'])):
                        temp["Recommendation"]=bp_df_list[i][5]
                    else:
                        temp["Recommendation"]=l[0]['Recommendation']
                else:
                    temp["Recommendation"]=bp_df_list[i][5] 
            except:
                temp={}
                temp["ID"]=bp_df_list[i][0]
                temp["Domain"]=bp_df_list[i][1]
                temp["Severity"]=bp_df_list[i][2]
                temp['Observation']=bp_df_list[i][3]
                temp["Description"]=bp_df_list[i][4]
                temp["Recommendation"]=bp_df_list[i][5] 

            bp_df_list_final.append(temp)

        database.createCollection(db_name, coll_name, bp_df_list_final) # create a collection for BP exception specific for customer
        print('check_bp() execution done')

    else:
        print('Kindly Check Customer BP Excel')




def faultData(scripPath,db_name, coll_name='UCS_FAULT'):

    try:
        with open(Path(scripPath)/'entire_JSON_loc.json' , "r") as f:
            open_info_json = json.loads(f.read())
            jsonfile_loc = open_info_json["UCS-DCAF-InventoryExcelReport_UCS Alerts"]
            #print(f'got the folder location: {jsonfile_loc}')
            # open UCS FAULT
        #temp_json = {}
        fault_df = pd.read_json(jsonfile_loc)
        fault_df = fault_df[fault_df.Severity != 'cleared']
        fault_df = fault_df.groupby(['Code','UCS Domain','Recommendation', 'Severity','Created Date'])['Description'].apply(', '.join).reset_index()
        fault_df = fault_df.groupby(['Code','Recommendation', 'Severity','Description','Created Date' ])['UCS Domain'].apply(', '.join).reset_index()
        fault_df['Severity'].replace({'critical': 'High', 'major': 'High', 'warning': 'Medium', 'minor': 'Low', 'info':'Info-only'}, inplace=True)
        fault_df = fault_df[['UCS Domain','Code','Severity', 'Description', 'Recommendation','Created Date']]
        fault_df["Created Date"] = fault_df["Created Date"].map(lambda a: datetime.strptime(a, "%Y-%m-%dT%H:%M:%S.%f"))
        six_months = date.today() - relativedelta( months= +6 )
        fault_df = fault_df[fault_df["Created Date"].map(lambda a: a.date() >= six_months)]
        if(fault_df.empty):
            print('Empty Fault')
            database.createCollection(db_name, coll_name,[{}] )
        fault_df=fault_df.reset_index(drop=True)
        fault_df["Created Date"] = fault_df["Created Date"].map(lambda a: a.strftime("%Y-%m-%d<br>&nbsp;&nbsp;&nbsp;&nbsp;%H:%M:%S.%f")[:-3])
        fault_df['Count']=fault_df.groupby(['UCS Domain','Code','Severity', 'Recommendation']).cumcount()+1
        fault_df["Description"] =fault_df['Count'].map(str) + ") "+ fault_df["Description"].map(str)
        fault_df["Created Date"] =fault_df['Count'].map(str) + ") "+ fault_df["Created Date"].map(str)

        fault_df=fault_df.groupby(['UCS Domain','Code','Severity', 'Recommendation']).agg({'Description':lambda x : '<br><br>'.join(list(x.values)),'Created Date':lambda x : '<br><br>'.join(list(x.values)),'Count':'count'}).reset_index()
        # print(fault_df)
        fault_df = fault_df[['UCS Domain','Code','Severity', 'Description', 'Created Date','Count', 'Recommendation']]
        # print(fault_df)

        
        fault_df.to_json(Path(scripPath)/'temp_fault.json', orient='index')

        with open(Path(Path(scripPath)/'temp_fault.json'), "r") as f:
            faultlist = json.loads(f.read())
        # print("faultlistt", faultlist)
        #i =0
        # temp = []
       # print(faultlist['0']["UCS Domain"])
        #print(faultlist['1'])
        # for item in faultlist.values():
        #     temp.append(item)
            #i+=1
        #clearprint(json.dumps(temp, indent=2))
        fault_disp=[]
        for i in range(len(faultlist)):
            # temp={}
            # temp["ID"]=i+1
            # temp["domain"]=faultlist[str(i)]["UCS Domain"]
            # temp["Severity"]=faultlist[str(i)]["Severity"]
            # temp['Code']=faultlist[str(i)]["Code"]
            # temp['Description']=faultlist[str(i)]['Description']
            # temp["Timestamp"]=faultlist[str(i)]["Created Date"]
            # temp['Frequency']=faultlist[str(i)]["Count"]
            # temp["Recommendation"]=faultlist[str(i)]["Recommendation"]
            # print("temp:", temp)
            # fault_disp.append(temp)
            try:
                l= database.fetchAllRecomFromDB("UCS_FAULT",faultlist[i]["Code"])
                temp={}
                temp["ID"]=i+1
                temp["domain"]=faultlist[str(i)]["UCS Domain"]
                if(faultlist[i]["Severity"]==''):
                    if(l[0]['Severity']==''):
                        temp['Severity']= "Need to fill by NCE"
                    else:
                        temp["Severity"]=l[0]['Severity']
                else:
                    temp["Severity"]=faultlist[str(i)]["Severity"]
                temp['Code']=faultlist[str(i)]["Code"]
                temp['Description']=faultlist[str(i)]['Description']
                temp["Timestamp"]=faultlist[str(i)]["Created Date"]
                temp['Frequency']=faultlist[str(i)]["Count"]
                if(faultlist[i]["Recommendation"]==''):
                    if(l[0]['Recommendation']==''):
                        temp['Recommendation']= "Need to fill by NCE"
                    else:
                        temp["Recommendation"]=l[0]['Recommendation']
                else:
                    temp["Recommendation"]=faultlist[str(i)]["Recommendation"]
            except:
                temp={}
                temp["ID"]=i+1
                temp["domain"]=faultlist[str(i)]["UCS Domain"]
                temp["Severity"]=faultlist[str(i)]["Severity"]
                temp['Code']=faultlist[str(i)]["Code"]
                temp['Description']=faultlist[str(i)]['Description']
                temp["Timestamp"]=faultlist[str(i)]["Created Date"]
                temp['Frequency']=faultlist[str(i)]["Count"]
                temp["Recommendation"]=faultlist[str(i)]["Recommendation"]
                            
            # print("temp:", temp)
            fault_disp.append(temp)
        # print("faultdisppp",fault_disp)
        # print('tests',json.dumps(fault_disp, indent=2))
        print('faultData() execution done')
        database.createCollection(db_name, coll_name, fault_disp)
    except:
        print(f'there are some issues in  UCS Fault section. Check faultData() functions')
        
        
        
        
        
        
def eoldata(scripPath,db_name, coll_name='EolDATA'):

    try:
        comp = ['Fabric Interconnects','Blade Chassis','IO Modules','Fabric Extenders','B-Series Servers', 'C-Series Servers - Managed',  'PSU', 'Server Adaptors']
        EOLDATA = {}
        #comp1  = ['Fabric Interconnects']
        output = pd.DataFrame()

        for j in range(len(comp)):
            df = pd.DataFrame()
            prefix = 'UCS-DCAF-InventoryExcelReport_'
            temp = {}
            item = comp[j]
            #print(f'item:{item}')
            
            dom = 'UCS Domain'
            with open(Path(scripPath)/'entire_JSON_loc.json' , "r") as f:
                open_info_json = json.loads(f.read())
                #print(f'{prefix}{item}')
                jsonfile_loc = open_info_json[f'{prefix}{item}']
                #print(f'got the folder location: {jsonfile_loc}')
            
            with open(Path(jsonfile_loc), "r") as f:
                content = json.loads(f.read())
            
            if item == 'PSU' or item == 'Server Adaptors':
                dom = 'UCS Domain/Server Name'

            temp = [dict(Type = item, domain=content[i][dom],Model=content[i]["Model"], EndOfSale=content[i]['Hardware EOL End Of Sale Date'], EndOfRFA=content[i]['Hardware EOL Routine Failure Analysis Date'], LDoS = content[i]['Hardware EOL End Of Last Date Of Support'],EoLExternal=content[i]["Hardware EOL External Announcement Date"]) for i in range(len(content))]
#           temp = [dict(Type = item, domain=content[i][dom],Model=content[i]["Model"], EndOfSale=content[i]['Hardware EOL End Of Sale Date'], EndOfRFA=content[i]['Hardware EOL Routine Failure Analysis Date'], LDoS = content[i]['Hardware EOL End Of Last Date Of Support'],EoLExternal=content[i]["Hardware EOL External Announcement Date"], EOLBulletin=content[i]["Hardware EOL Bulletin Url"]) for i in range(len(content))]

            output = output.append(temp, ignore_index=True)
              


            #print(f'{item} data is fetched')
            EOLDATA[item] = temp
            #clearprint(f'Insetsted in EoLDATA')

        #df = output.drop_duplicates()
        df = output
        df=df.groupby(['Model','EndOfSale','EndOfRFA','LDoS','EoLExternal'], dropna=False).agg(lambda x : ', '.join(set(x))).reset_index()
        df=df[['Type','domain', 'Model','EndOfSale','EndOfRFA','LDoS','EoLExternal']]
#        df=df.groupby(['Model','EndOfSale','EndOfRFA','LDoS','EoLExternal','EOLBulletin'], dropna=False).agg(lambda x : ', '.join(set(x))).reset_index()
#        df=df[['Type','domain', 'Model','EndOfSale','EndOfRFA','LDoS','EoLExternal','EOLBulletin']]
        print(df)
        df.insert(0, 'ID', range(1, 1 + len(df)))
        #print(json.dumps(df.to_dict,indent=2))
        df.to_json(Path(scripPath)/'temp_eol.json', orient='index')
        
        with open(Path(Path(scripPath)/'temp_eol.json'), "r") as f:
            eol = json.loads(f.read())
        
        temp = []
       # print(faultlist['0']["UCS Domain"])
        #print(faultlist['1'])
        for item in eol.values():
            temp.append(item)
        #print(json.dumps(temp,indent=2))
        #print(json.dumps(EOLDATA, indent=2))
        database.createCollection(db_name, coll_name, temp)
        print('eoldata() execution done')

    except:
        print("There is some fault in eol data creation. Check eoldata() function")
        
        

def port_capacity(scripPath,db_name, coll_name):
    try:
        with open(Path(scripPath)/'entire_JSON_loc.json' , "r") as f:
            open_info_json = json.loads(f.read())
            jsonfile_loc = open_info_json["UCS-DCAF-FirmwareConsistencyReport_Fabric InterConnects"]
            print(f'got the folder location: {jsonfile_loc}')
        
        with open(Path(jsonfile_loc), "r") as f:
            faultlist = json.loads(f.read())
            
        #print(type(faultlist))
        port_cap_disp = [dict(ID = i+1, domain=faultlist[i]["Domain"],DN=faultlist[i]["DN"],Fabric=faultlist[i]["Fabric ID"],  
                           Model=faultlist[i]["Model"], Ports_Available=faultlist[i]["Ports Available"]) for i in range(len(faultlist))]
        

        #print(json.dumps(port_cap_disp, indent=2))
        database.createCollection(db_name, coll_name, port_cap_disp)
        print('port_capacity() execution done')
    except:
        print('There is some issue with port_capacity() function.')


def create_graph_data(scripPath,db_name):
    
    try:
        graphdata = {}
        """ This function will create the data for bar chart for the overview page"""
        with open(Path(scripPath)/'entire_JSON_loc.json' , "r") as f:

            open_info_json = json.loads(f.read())
            serviceprofile_loc =  open_info_json["UCS-DCAF-InventoryExcelReport_Service Profiles"]

        f = open(Path(serviceprofile_loc))
        datal = json.load(f)
        seen = set()
        data = []
        for d in datal:
            t = tuple(d.items())
            if t not in seen:
                seen.add(t)
                data.append(d)
        sp_df = pd.DataFrame(data)
        #print(sp_df.head(4))
        sp_df = sp_df [['UCS Domain','Associated Status']]
        #print(sp_df.head(4))

        sp_df1 = sp_df.groupby('Associated Status').count()
        #print(sp_df1)


        #print(sp_df1.to_dict()['UCS Domain'])
        graphdata['SP_counter'] = sp_df1.to_dict()['UCS Domain']


        # for Fault DATA
        faultdata = database.fetchDataFromDB(db_name, "UCS_FAULT") # fault data from DB
        
        
        if faultdata != None:
            df = pd.DataFrame(faultdata)
            count1 = df['Severity'].value_counts() 
            count1 = count1.to_dict()
        else:
            count1 = {}



        # for BP Data
        bp = database.fetchDataFromDB(db_name, "BP_Exception") # fault data from DB EolDATA
        
        if bp != None:
            
            df = pd.DataFrame(bp)
            count2 = df['Severity'].value_counts() 
            
            count2 = count2.to_dict()
        else: 
            count2 = {}

        #print('we are outside bp area')
        
        
        # for ShowTech/BDB Data
        bdb = database.fetchDataFromDB(db_name, "BDB_DATA")  
        if bdb  !=  None:
            df = pd.DataFrame(bdb)
            count3 = df['Severity'].value_counts()
            count3 = count3.to_dict()
        else:
            count3 = {}
        

        #print(f'Values of Count1:{count1} \n Count2 is:{count2} \n Count3 is:{count3}\n')
        # for insight count
        for severity in ['High', 'Medium', 'Low', 'Info-only']:
            if severity not in count1.keys():
                count1[severity] = 0
            if severity not in count2.keys():
                count2[severity] = 0
            if severity not in count3.keys():
                count3[severity] = 0

        graphdata['fault']=count1
        graphdata['bp']=count2
        graphdata['bdb']=count3
        #print(json.dumps(graphdata, indent=2))
        
        #print(f'Now value of count1:{count1} and count2 is:{count2}')

        high_tot = int(count1['High'] + count2['High'] + count3['High'])
        med_tot = int(count1['Medium'] + count2['Medium'] + count3['Medium'])
        low_tot =int(count1['Low'] + count2['Low'] + count3['Low'])
        info = int(count1['Info-only'] + count2['Info-only'] + count3['Info-only'])  # there is n info-only in BP
        
        #print(f'H:{high_tot}, M:{med_tot}, L:{low_tot}, info:{info}')
        
        total_count={}
        total_count['High'] = high_tot
        total_count['Medium'] = med_tot
        total_count['Low'] = low_tot
        total_count['Info-only'] = info

        #print(f'now total count:  {total_count}')
        graphdata['total']=total_count

        #print(graphdata)

        d = EoLStats(db_name)
        #print(f'returned value of d is  {d}')

        graphdata['LDoSStats'] = d
        
        #print(json.dumps(graphdata, indent=2))
        
        database.edit_old_Collection(db_name, "bar_stats_data", graphdata)
        #print('create_graph_data() execution done')

    except Exception as ex:
        print('There is some issue with create_graph_data. Please check create_graph_data() function')
        print('Exception : ',ex)
        
    
def EoLStats(db_name):
    eol = database.fetchDataFromDB(db_name, "EolDATA")
    #print(eol)
    if eol != None:
        df1 = pd.DataFrame(eol)
        #print(df1.head())
        inventory_count = len(df1)
    
        df = df1.replace(to_replace='None', value=np.nan).dropna()
        #print(f' value of df becomes:{df}')

        today = pd.to_datetime(date.today())
        df['LDoS_DATE'] = pd.to_datetime(df['LDoS'])

        df = df[['Model','LDoS_DATE']]

        df['Diff'] = (df['LDoS_DATE']- today)
        df['Diff']= df['Diff'].astype('timedelta64[D]').astype(int)

        bins = [- np.inf, 0, 365, 730, 1095, 1460]
        names = ['LDoS Reached', 'LDoS in 1 Year', 'LDoS in 2 Years', 'LDoS in 3 Years', 'LDoS in 4 Years']


        df['Category'] = pd.cut(df['Diff'], bins, labels=names)
        #print(df)

        #df = df[['Category']]
        #print(f'value of df is {df}')

        df_c = df.groupby('Category').count()
        df_c = df_c[['Model']]

        #print('value of df_c',  df_c)
        df_c_dict = df_c.to_dict()

        #print(f'value of df_c_dict:{df_c_dict}')
        return df_c_dict['Model']

    #database.createCollection(db_name, 'EoLGraphicalStatsData', df_c_dict)
    else:
        return {'LDoS Reached': 0, 'LDoS in 1 Year': 0, 'LDoS in 2 Years': 0, 'LDoS in 3 Years': 0, 'LDoS in 4 Years': 0}


    

#create_graph_data(db_name='UCS_DB_SAFARICOM_1234')
#create_graph_data(db_name='UCS_DB_CIGNA_914601')
    
def bdbdata(showtech_data, domain, db_name):
    d  = bdbjson(showtech_data,db_name, domain)
    if('BDB_DATA' not in database.listOfCollections(db_name)):
        database.createCollection(db_name, "BDB_DATA", d)
    else:
        #print('data to insert in BDB:',d)
        database.delAllData(db_name,'BDB_DATA')
        database.addData(db_name, "BDB_DATA", d)
    #create_graph_data(db_name)