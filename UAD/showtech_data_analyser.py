import json
import re
import pandas as pd
import os
root = os.path.dirname(os.path.realpath(__file__))
from pathlib import Path
from DataBase import DataBase
database = DataBase('localhost', 27017)
from bs4 import BeautifulSoup

def extractSympCondMitAddEvi(information):
	info = {}
	if "SYMPTOMS:" in information:
		a = information.split("SYMPTOMS:")
		b = a[1].split("CONDITIONS:")
		c = b[1].split("MITIGATION:")
		d = c[1].split("ADDITIONAL INFORMATION:")
		e = d[1].split("EVIDENCE:")

		try:
			info["Symptoms"] = b[0]
		except IndexError:
			info["Symptoms"] = ""
		try:
			info["Conditions"] = c[0]
		except IndexError:
			info["Conditions"] = ""
		try:
			info["Mitigation"] = d[0]
		except IndexError:
			info["Mitigation"] = ""
		try:
			info["Additional Information"] = e[0]
		except IndexError:
			info["Additional Information"] = ""
		try:
			info["Evidence"] = e[1]
		except IndexError:
			info["Evidence"] = ""
	else:
		info["Symptoms"] = information
		info["Conditions"] = ""
		info["Mitigation"] = ""
		info["Additional Information"] = ""
		info["Evidence"] = ""

	return info

def bdbjson(bdbdata, db_name, domain):
	temp =  bdbdata
	print(temp)
	ctr=1
	sev_type=set()
	bdb_process_data  = database.fetchDataFromDB(db_name, "BDB_DATA")
	if(bdb_process_data==None):
		bdb_process_data=[]
	for item in temp['data']['variables']['json_output']:
		if item['result_type'] == 'issue':
			#print(f'\n{ctr}')
			title = item['title'].replace('[BTF]', '')
			#print(f'{ctr}. {title}')
			soup = BeautifulSoup(item['text'], features="lxml")
			#print(soup.get_text('\n'))
			rawdata = soup.get_text('\n')
			dat = extractSympCondMitAddEvi(rawdata)
			#print(dat)

			sev_temp= item['severity']
			if sev_temp.lower() in ["error", "warning"]:
				sev = "Medium"
			elif sev_temp.lower() in ["critical", "emergency"]:
				sev = "High"
			elif sev_temp.lower() =="notice":
				sev = "Low"
			elif sev_temp.lower() =="info":
				sev = "Info-only"
			else:
				sev = sev_temp

			sev_type.add(sev)
			
			if 'snippet' in item.keys():
				for term in item['snippet']:
					soup = BeautifulSoup(term, features="lxml")
					snippet_data = soup.get_text('\n')
			else:
				snippet_data = ""

			#print(f'Issue{ctr}:\n{snippet_data}')
				
			

			bdb_process_data.append({"ID": ctr, "Domain":domain,"Severity": sev, "Heading":title,
		             "Description":dat["Symptoms"]+dat["Conditions"],
		             "Recommendation":dat["Mitigation"]+dat["Additional Information"],
		             "Evidence":domain+":"+dat["Evidence"] + snippet_data})
			
			ctr+=1

	bdbdf = pd.DataFrame.from_dict(bdb_process_data)
	bdbdf=bdbdf.groupby(['Severity','Heading','Description','Recommendation']).agg(lambda x : '<br>\n<br>'.join(x)).reset_index()
	bdbdf=bdbdf[['Domain','Severity','Heading','Description','Evidence','Recommendation']]

	bdbdf.to_json(Path(root)/'temp_showtech.json', orient='index')
	with open(Path(Path(root)/'temp_showtech.json'), "r") as f:
		stlist = json.loads(f.read())
	
	bdb_processed_data=[]

	for i in range(len(stlist)):
		# l= database.fetchAllRecomFromDB("BDB_DATA",stlist[str(i)]["Heading"])
		temp={}
		temp["ID"]=i+1
		temp["Domain"]=stlist[str(i)]["Domain"]
		# if(stlist[str(i)]["Severity"]==''):
		# 	if(l[0]['Severity']==''):
		# 		temp['Severity']= "Need to fill by NCE"
		# 	else:
		# 		temp["Severity"]=l[0]['Severity']
		# else:
		temp["Severity"]=stlist[str(i)]["Severity"]
		temp['Heading']=stlist[str(i)]["Heading"]
		# if(stlist[str(i)]['Description']==''):
		# 	if(l[0]['Description']==''):
		# 		temp['Description']= "Need to fill by NCE"
		# 	else:
		# 		temp['Description']=l[0]['Description']
		# else:
		temp['Description']=stlist[str(i)]['Description']
		temp["Evidence"]=stlist[str(i)]["Evidence"]
		# if(stlist[str(i)]["Recommendation"]==''):
		# 	if(l[0]['Recommendation']==''):
		# 		temp['Recommendation']= "Need to fill by NCE"
		# 	else:
		# 		temp["Recommendation"]=l[0]['Recommendation']
		# else:
		temp["Recommendation"]=stlist[str(i)]["Recommendation"]
		bdb_processed_data.append(temp)
		
	print(f'Severity:{sev_type}')
	return bdb_processed_data		


# with open('/Users/vikasran/Documents/UCS_AUDIT_Dashboard/bdb_contents_AR999CFI0300.json', "r") as f:
# 	bdb_raw_data = json.load(f)		

# d  = bdbjson(bdb_raw_data, domain='DUMMY_DOMAIN')
# print(json.dumps(d, indent=2))		


