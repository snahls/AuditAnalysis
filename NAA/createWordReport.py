from docxtpl import DocxTemplate
import docx
from datetime import date
from pathlib import Path
import os
import sys
import json
import jsonCreator
import pymongo
import mail_utility


scriptPath = os.path.dirname(os.path.realpath(__file__))

def getAuditDetails():
	cpyKey = sys.argv[1]
	auditID = sys.argv[2]
	audit_type = sys.argv[3]
	Customer_Name = sys.argv[4]
	email_id = sys.argv[5]
	return cpyKey, auditID, audit_type, Customer_Name, email_id


def getNetRules(audit_type, table_name, exception_name):
	dbName = "CNA_Visualizer"
	dbClient = pymongo.MongoClient('localhost', 27017)
	db = dbClient[dbName]
	query = {"audit_type": audit_type, "table_name": table_name, "exception_name": exception_name}
	res = db['NetRule_NetAdvice'].find(query)
	result = list(res)
	dbClient.close()
	return result


def getNetRulesv2(cpyKey, audit_id, audit_type, table_name, exception_name):
	dbName = "CNA_Visualizer"
	dbClient = pymongo.MongoClient('localhost', 27017)
	db = dbClient[dbName]
	if ("- " in exception_name):
		exception_name = exception_name[exception_name.rfind("- ") + 2:]

	query = {"Audit_ID": audit_id, "Audit_Type": audit_type, "table_name": table_name, "exception": exception_name,
			 "jsonFor": "netRulenetAdvice"}
	res = db[cpyKey].find(query)
	result = list(res)
	if not result:
		query = {"Audit_ID": audit_id, "Audit_Type": audit_type, "table_name": table_name,
				 "exception": exception_name + " (Exceptions Only)", "jsonFor": "netRulenetAdvice"}
		res = db[str(cpyKey)].find(query)
		result = list(res)

	dbClient.close()
	return result

def report():
	try:
		today = date.today()
	
		d = today.strftime("%B %d, %Y")
	
		tpl = DocxTemplate(scriptPath+'/Report_Template.docx')
	
	
		cpyKey, auditID, audit_type, Customer_Name, email_id = getAuditDetails()
		all_exceptions = list(jsonCreator.getFromDB(cpyKey, auditID, 'allExceptions'))
		severity_breakdown = list(jsonCreator.getFromDB(cpyKey, auditID, 'severityBreakdown'))
	
		fault_total = int(severity_breakdown[0]["Fault Management"]["Critical"]) + int(severity_breakdown[0]["Fault Management"]["High"]) + int(severity_breakdown[0]["Fault Management"]["Medium"]) + int(severity_breakdown[0]["Fault Management"]["Low"]) + int(severity_breakdown[0]["Fault Management"]["Informational"])
		configuration_total = int(severity_breakdown[0]["Configuration Management"]["Critical"]) + int(severity_breakdown[0]["Configuration Management"]["High"]) + int(severity_breakdown[0]["Configuration Management"]["Medium"]) + int(severity_breakdown[0]["Configuration Management"]["Low"]) + int(severity_breakdown[0]["Configuration Management"]["Informational"])
		capacity_total = int(severity_breakdown[0]["Capacity Management"]["Critical"]) + int(severity_breakdown[0]["Capacity Management"]["High"]) + int(severity_breakdown[0]["Capacity Management"]["Medium"]) + int(severity_breakdown[0]["Capacity Management"]["Low"]) + int(severity_breakdown[0]["Capacity Management"]["Informational"])
		performance_total = int(severity_breakdown[0]["Performance Management"]["Critical"]) + int(severity_breakdown[0]["Performance Management"]["High"]) + int(severity_breakdown[0]["Performance Management"]["Medium"]) + int(severity_breakdown[0]["Performance Management"]["Low"]) + int(severity_breakdown[0]["Performance Management"]["Informational"])
		security_total = int(severity_breakdown[0]["Security Management"]["Critical"]) + int(severity_breakdown[0]["Security Management"]["High"]) + int(severity_breakdown[0]["Security Management"]["Medium"]) + int(severity_breakdown[0]["Security Management"]["Low"]) + int(severity_breakdown[0]["Security Management"]["Informational"])
		
	
		audit_information = list(jsonCreator.getFromDB(cpyKey, auditID, 'audit_information'))
		if not audit_information:
			audit_information = [
				{"Customer_Name": Customer_Name, "Collection Start Time": "NA", "Collection End Time": "NA",
				 "Collection Period (Days)": "NA", "Devices Attempted": "NA", "Devices Passed": "NA",
				 "Devices Failed/Excluded": "NA", "Devices Duplicated": "NA"}]
		exception_list = {"Critical": {}, "High": {}, "Medium": {}, "Low": {}, "Informational": {}}
	
		all_tables = {}
		for exception in all_exceptions:
	
			if (exception["Table Name"] in all_tables.keys()):
				if (exception["Severity"] in all_tables[exception["Table Name"]].keys()):
					all_tables[exception["Table Name"]][exception["Severity"]] = all_tables[exception["Table Name"]][
																					 exception["Severity"]] + 1
				else:
					all_tables[exception["Table Name"]][exception["Severity"]] = 1
			else:
				all_tables[exception["Table Name"]] = {}
				all_tables[exception["Table Name"]][exception["Severity"]] = 1
	
			if (exception["Exception Name"] in exception_list[exception["Severity"]].keys()):
				exception_list[exception["Severity"]][exception["Exception Name"]]["Devices"].append(
					exception["Host Name (IP Address)"].split(" ")[0])
				exception_list[exception["Severity"]][exception["Exception Name"]]["Additional Info"].append(
					exception["Host Name (IP Address)"].split(" ")[0] + " - " + exception["Exception Value"])
	
			else:
				netRule = "No Net Rule available"
				netAdvice = "No Net Advice available"
				NetRule_NetAdvice = getNetRulesv2(cpyKey, auditID, audit_type, exception["Table Name"],
												  exception["Exception Name"])
				if (len(NetRule_NetAdvice) > 0):
					netRule = NetRule_NetAdvice[0]["net_rule"]
					netAdvice = NetRule_NetAdvice[0]["net_advice"]
	
				tempJson = {"Table Name": exception["Table Name"], "NMS Area": exception["NMS Area"],
							"Exception": exception["Exception Name"],
							"Devices": [exception["Host Name (IP Address)"].split(" ")[0]], "Net Rule": netRule,
							"Net Advice": netAdvice, "NCE Comment": exception["NCE_Comment"], "Additional Info": [
						exception["Host Name (IP Address)"].split(" ")[0] + " - " + exception["Exception Value"]]}
				exception_list[exception["Severity"]][exception["Exception Name"]] = tempJson
	
		tbl_content_final = []
		for severity in exception_list.keys():
			for key in exception_list[severity].keys():
				table_name = exception_list[severity][key]["Table Name"];
				device_list = list(set(exception_list[severity][key]["Devices"]));
				nms_area = exception_list[severity][key]["NMS Area"];
				exception_name = exception_list[severity][key]["Exception"];
				severity = severity;
				net_rule = exception_list[severity][key]["Net Rule"];
				net_advice = exception_list[severity][key]["Net Advice"];
				cx_comment = exception_list[severity][key]["NCE Comment"];     
				tbl_cont = {'table_name': table_name,'device_list': ', '.join(device_list),'nms_area': nms_area,'exception_name': exception_name,'severity':severity,'net_rule':net_rule,'net_advice':net_advice,'cx_comment':cx_comment}
				tbl_content_final.append(tbl_cont)
				context = {
					'cust_name' : Customer_Name, 
					'report_type': "Audit and Assessment Report", 
					'date_of_doc': d, 
					'version':"1.0",
					'audit_info': audit_information,
					'fault_total': fault_total,
					'configuration_total': configuration_total,
					'capacity_total': capacity_total,
					'performance_total': performance_total,
					'security_total': security_total,
					'tbl_content_final' : tbl_content_final
				}
		tpl.render(context)
	
				
		filename = cpyKey + "_" + auditID
	
		if not os.path.exists(scriptPath + "/Reports"):
			os.makedirs(scriptPath + "/Reports")
	
		tpl.save(scriptPath + "/Reports/" + filename + ".docx")


		
		body = """Hi, 
					Thank you for using Network Audit Analyser tool. The word report is attached with this mail.
					Please reach out to bgl-cx-bcs-audit@cisco.com if you have any questions
					Thank you,
					BCS Audit team """

		body_bot = """Thank you for using Network Audit Analyser tool. The word report for audit '"""+str(auditID)+"""' is attached. Please reach out to bgl-cx-bcs-audit@cisco.com if you have any questions"""
		
		mail_utility.send_email(email_id, 'Please do not reply to this mail.',body,scriptPath+"/Reports/"+filename+".docx")

		try:
			api = WebexTeamsAPI(access_token='YzY4ZjFjY2EtOWY4Ny00NmRmLWE5MTUtZWFlYzJiM2MwMWJlYTgyMzVlODEtNWI0_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f')
			api.messages.create(toPersonEmail=str(sys.argv[5]) , text = body_bot , files = [scriptPath+"/Reports/"+filename+".docx"])

		except Exception as e:
			print("Error sending file via Webex Bot.\n")
			print(str(e))

	except Exception as e:
		print(str(e))

		body = """Hi, 
					There is some error generating report. Please contact bgl-cx-bcs-audit@cisco.com to resolve the issue.

					Regards,
					BCS Audit team """

		body_bot = """Hi, There is some error generating report for audit id '"""+str(auditID)+"""'. Please contact bgl-cx-bcs-audit@cisco.com to resolve the issue.
		Regards,
		BCS Audit team """

		mail_utility.send_email(email_id, 'Please do not reply to this mail.',body,'')
		try:
			api = WebexTeamsAPI(access_token='YzY4ZjFjY2EtOWY4Ny00NmRmLWE5MTUtZWFlYzJiM2MwMWJlYTgyMzVlODEtNWI0_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f')
			api.messages.create(toPersonEmail=str(sys.argv[5]) , text = body_bot)

		except Exception as e:
			print("Error sending file via Webex Bot.\n")
			print(str(e))


body1 = """Hi, 
			Word report generation initiated for audit ID """+str(sys.argv[2])+""". Please allow upto 12 hours before raising 
			issue with bgl-cx-bcs-audit@cisco.com

			Regards,
			BCS Audit team """
mail_utility.send_email(str(sys.argv[5]), 'Please do not reply to this mail.',body1,'')
report()
