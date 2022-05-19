import requests
import os
import json
from webexteamssdk import WebexTeamsAPI
import pymongo

body_bot = """Hi User,

This is a reminder message.

You are receiving this message because you had initiated an audit on CNA tool which is now awaiting recommendation. We would like to request you to use our newly developed audit analysis tool for audit recommendations.

URL : auditanalysis.cisco.com
Sharepoint link : https://cisco.sharepoint.com/sites/AuditAnalysis/

For any further queries please reach out to <<bgl-cx-bcs-audit@cisco.com>>

Thank you,
Audit Analysis Team"""


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
			api = WebexTeamsAPI(access_token='YzY4ZjFjY2EtOWY4Ny00NmRmLWE5MTUtZWFlYzJiM2MwMWJlYTgyMzVlODEtNWI0_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f')
			api.messages.create(toPersonEmail= str(row["cells"][4]["displayValue"]), text = body_bot)
			row["cells"][12]["displayValue"] = "Sent"
			row["cells"][12]["value"] = "Sent"

			for k in range(0, len(row["cells"])):
				if("value" not in row["cells"][k].keys()):
					row["cells"][k]["displayValue"] = ""
					row["cells"][k]["value"] = ""

			toUpdate = {"id" : row["id"] , "cells" : row["cells"]}

			response = requests.request("PUT", "https://api.smartsheet.com/2.0/sheets/"+str(3916152901527428)+"/rows", headers=headers , data = json.dumps(toUpdate))


		else:
			print("Audit already uploaded on NAA")

			row["cells"][12]["displayValue"] = "Audit on NAA"
			row["cells"][12]["value"] = "Audit on NAA"

			row["cells"][13]["displayValue"] = "Yes"
			row["cells"][13]["value"] = "Yes"

			for k in range(0, len(row["cells"])):
				if("value" not in row["cells"][k].keys()):
					row["cells"][k]["displayValue"] = ""
					row["cells"][k]["value"] = ""

			toUpdate = {"id" : row["id"] , "cells" : row["cells"]}

			response = requests.request("PUT", "https://api.smartsheet.com/2.0/sheets/"+str(3916152901527428)+"/rows", headers=headers , data = json.dumps(toUpdate))



