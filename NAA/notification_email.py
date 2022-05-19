import smtplib
import requests
import os
import json
import csv
import pymongo

def email_in(userid):
    smtp_server = 'email.cisco.com'
    sender = "NetworkAuditAnalyzer@cisco.com"
    receiver = userid
    cc = ['bgl-cx-bcs-audit@cisco.com', 'divyaja@cisco.com', 'gekathur@cisco.com']
    subject = "Request : Use Auditanalysis tool for CNA Audit"
    body = """Hi User,

        You are receiving this message because you had initiated an audit on CNA tool which is now awaiting recommendation. We would like to request you to use our newly developed audit analysis tool for audit recommendations.

        URL : http://10.127.250.101:8000
        Sharepoint link : https://cisco.sharepoint.com/sites/AuditAnalysis/

        For any further queries please reach out to <<bgl-cx-bcs-audit@cisco.com>>

        Thank you,
        Audit Analysis Team
    """
    message = 'Subject: {}\n\n{}'.format(subject, body)
    receivers = [receiver] + cc
    try:
        sm = smtplib.SMTP(smtp_server)
        sm.sendmail(sender, receivers, message)
        print("Successfully sent email")
    except Exception:
        print("Error: unable to send email")

def getAuditDetails(audit_id):
    db = pymongo.MongoClient("mongodb://localhost:27017/")
    col = db['CNA_Visualizer']
    collection_list = col.list_collection_names()
    db.close()
    if audit_id in collection_list:
        return True
    else:
        return False

Bearer_token = "h72QmXHyTJrhir4ulHfAcrp0DHOy0NJquMfWB"
headers = {
    'Authorization': 'Bearer '+Bearer_token,
    'Content-type': 'application/json'
}
payload = {}
URL_to_send = "https://api.smartsheet.com/2.0/sheets/3916152901527428"
response = requests.request("GET", URL_to_send, headers=headers, data = payload)
result = json.loads(response.text)

for row in result["rows"]:
    if row['cells'][7]['displayValue'] == 'APJC' and row['cells'][5]['displayValue'] == 'recommendations waiting':

        audit = row['cells'][1]['displayValue']

        mail = row['cells'][4]['displayValue']
        if(not getAuditDetails(row["cells"][1]["displayValue"])):
            email_in(row['cells'][4]['displayValue'])

            row["cells"][11]["displayValue"] = "yes"
            row["cells"][11]["value"] = "yes"
            
            for k in range(0, len(row["cells"])):
                if("value" not in row["cells"][k].keys()):
                    row["cells"][k]["displayValue"] = ""
                    row["cells"][k]["value"] = ""

            toUpdate = {"id": row["id"], "cells": row["cells"]}

            response = requests.request("PUT", "https://api.smartsheet.com/2.0/sheets/" + str(3916152901527428) + "/rows",
                                    headers=headers, data=json.dumps(toUpdate))
        
        else:
            row["cells"][11]["displayValue"] = "Audit on NAA"
            row["cells"][11]["value"] = "Audit on NAA"

            row["cells"][12]["displayValue"] = "Audit on NAA"
            row["cells"][12]["value"] = "Audit on NAA"

            for k in range(0, len(row["cells"])):
                if("value" not in row["cells"][k].keys()):
                    row["cells"][k]["displayValue"] = ""
                    row["cells"][k]["value"] = ""

            toUpdate = {"id": row["id"], "cells": row["cells"]}

            response = requests.request("PUT", "https://api.smartsheet.com/2.0/sheets/" + str(3916152901527428) + "/rows",
                                    headers=headers, data=json.dumps(toUpdate))
        
