import pymongo
from coreutils.severityTables import get_sev_tables_data



def db_connect():
    """
    :return: returns the connection to the user
    """
    dbname = "CNA_Visualizer"
    dbclient = pymongo.MongoClient("mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb", 27017)
    db = dbclient[dbname]
    return db


def get_json_table_allexceptions(cpykey, audit_1id, audit_2id):
    db = db_connect()
    all_data = []

    # unique exceptions specific for audit file
    list1 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_1id})
    list2 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_2id})
    result_set_1 = set(list1) - set(list2)
    result_set_2 = set(list2) - set(list1)
    result_list_1 = [i for i in result_set_1]
    result_list_2 = [i for i in result_set_2]
    method_1 = True
    method_2 = True
    if len(result_set_1) == 0:
        method_1 = False
    if len(result_set_2) == 0:
        method_2 = False

    all_data.append({"result":{
            "a1": {"method": method_1, "length": len(result_list_1), "result": result_list_1},
            "a2": {"method": method_2, "length": len(result_list_2), "result": result_list_2}
        }})

    # get the 5 severity tables here
    all_data.append({"result": "none"})

    # get the all unique exception data
    list1 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_1id})
    list2 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_2id})
    all_data.append( {"result":{"audit_1": list1, "audit_2": list2}})

    return all_data