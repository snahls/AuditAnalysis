import requests
import os
import json
import pymongo

def getAuditDetails(audit_id):
	db = pymongo.MongoClient("mongodb://localhost:27017/")
	col = db['CNA_Visualizer']
	collection_list = col.list_collection_names()
	db.close()
	if audit_id in collection_list:
		return True
	else:
		return False

Bearer_token = ""

with open("smartsheet_token.txt" , "r") as f:
	Bearer_token = f.readline()


#Bearer_token = "ckmebgr609a7o8u904jwcoq23g"
headers = {
  'Authorization': 'Bearer '+Bearer_token,
  'Content-Type': 'application/json'
}

URL_to_send = "https://api.smartsheet.com/2.0/sheets/3916152901527428"
response = requests.request("GET", URL_to_send, headers=headers)
result = json.loads(response.text)


for row in result["rows"]:

	if(row["cells"][7]["displayValue"] == "APJC" and row["cells"][5]["displayValue"] == "recommendations waiting"):
		if(not getAuditDetails(row["cells"][1]["displayValue"])):

			row["cells"][13]["displayValue"] = "No"
			row["cells"][13]["value"] = "No"

			for k in range(0, len(row["cells"])):
				if("value" not in row["cells"][k].keys()):
					row["cells"][k]["displayValue"] = ""
					row["cells"][k]["value"] = ""

			toUpdate = {"id" : row["id"] , "cells" : row["cells"]}

			response = requests.request("PUT", "https://api.smartsheet.com/2.0/sheets/"+str(3916152901527428)+"/rows", headers=headers , data = json.dumps(toUpdate))


		else:
			print("Audit already uploaded on NAA")

			row["cells"][13]["displayValue"] = "Yes"
			row["cells"][13]["value"] = "Yes"
			
			for k in range(0, len(row["cells"])):
				if("value" not in row["cells"][k].keys()):
					row["cells"][k]["displayValue"] = ""
					row["cells"][k]["value"] = ""

			toUpdate = {"id" : row["id"] , "cells" : row["cells"]}

			response = requests.request("PUT", "https://api.smartsheet.com/2.0/sheets/"+str(3916152901527428)+"/rows", headers=headers , data = json.dumps(toUpdate))