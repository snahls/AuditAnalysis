from DataBase import DataBase
from pandas import DataFrame
import pandas as pd
import datetime 
import json

import numpy as np
from datetime import date
today = date.today()



def addinsight(df, val):
	df['Class'] = val


def find_col(df):
	for col in df.columns: 
	    print(col)


database = DataBase('localhost', 27017)

 




################# dealing with Fault ##################
#print(type(f), type(eol))
def FAULT(df):
	df = DataFrame(df) 
	#find_col(df)

	df['Insight']=df['Code']
	df['Domain']=df['domain']

	df['Class'] = 'Fault'
	df = df[['Domain', 'Insight','Severity', 'Class']] 

	#print(df.head()) 
	return df



############ dealing wiyj EoL ##############

def EOL(df):
	eoldf1 = DataFrame(df)
	#find_col(eoldf1)
	addinsight(eoldf1, 'EoL')
	eoldf1['Insight']=eoldf1['Model']
	eoldf1['Domain']=eoldf1['domain']

	eoldf2 = eoldf1.replace(to_replace='None', value=np.nan).dropna()


	eoldf2['LDoS_DATE'] = pd.to_datetime(eoldf2['LDoS'])
	today = pd.to_datetime(date.today())

	eoldf2['Diff'] = (eoldf2['LDoS_DATE']- today)

	eoldf2['Diff']= eoldf2['Diff'].astype('timedelta64[D]').astype(int)

	eoldf2['Severity'] = np.where(eoldf2['Diff']<365,'High','Low' )

	eoldf2 = eoldf2[['Domain', 'Insight', 'Severity', 'Class']]
	#print(eoldf2)
	return eoldf2



############ dealing with BP ################

def BP(df):
	df = DataFrame(df)
	find_col(df)
	
	addinsight(df, 'Best Practice')
	df['Severity'] = df['Severity']
	df['Insight'] = df['Observation']
	df = df[['Domain','Insight','Severity', 'Class']]
	#print(df)
	return df



############## dealing with BDB output ############
def BDB(df):
	df = DataFrame(df)
	addinsight(df, 'Show-Tech')
	df['Insight'] = df['Heading']
	df = df[['Domain','Insight','Severity', 'Class']]
	#print(df)
	return df


def insight_summary(db_name):

	f = database.fetchDataFromDB(db_name, "UCS_FAULT")
	eol = database.fetchDataFromDB(db_name, "EolDATA")
	bp= database.fetchDataFromDB(db_name, "BP_Exception")
	bdb = database.fetchDataFromDB(db_name, 'BDB_DATA')



	

	#######   Create DataFrame if the data Exist otherwisw create empty DATA Frame     #########

	if f != None:
		fault_df = FAULT(f)
	else:
		fault_df = pd.DataFrame(columns=['Domain','Insight','Severity','Class'])


	if eol != None:
		eol_df = EOL(eol)
	else:
		eol_df = pd.DataFrame(columns=['Domain','Insight','Severity','Class'])

	
	if bp !=None:
		bp_df = BP(bp)
	else:
		bp_df = pd.DataFrame(columns=['Domain','Insight','Severity','Class'])

	
	if bdb != None:
		bdb_df = BDB(bdb)
	else:
		bdb_df = pd.DataFrame(columns=['Domain','Insight','Severity','Class'])

	
	#print(f'insight_list_contain:{insight_list_contain}')
	final_df = pd.concat([fault_df, eol_df, bp_df, bdb_df], ignore_index=True)

	temp = final_df['Severity'].values == 'High'
	  
	# new dataframe 
	final_df_high= final_df[temp] 

	# final_df_high = final_df_high.sample(frac = 1)

	d = final_df_high[['Domain', 'Insight', 'Severity', 'Class']]

	d_list = d.values.tolist()

	#print(d_list)

	final_list=[]

	ctr=1
	for i in range(len(d_list)):
		temp = {}

		temp['ID'] = ctr
		temp['Domain'] = d_list[i][0]
		temp['Insight'] = d_list[i][1]
		temp['Severity'] = d_list[i][2]
		temp['Class'] = d_list[i][3]

		final_list.append(temp)
		ctr+=1

	#print(json.dumps(final_list, indent=2))

	return final_list



#l = insight_summary(db_name='UCS_DB_SAFARICOM_1234')



