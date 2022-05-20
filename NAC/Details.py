import pymongo



def db_connect():
    """
    :return: returns the connection to the user
    """
    dbname = "CNA_Visualizer"
    dbclient = pymongo.MongoClient("mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb", 27017)
    db = dbclient[dbname]
    return db

final_data = {}

def getinfo_json(cpykey, audit_1id, audit_2id):
    db = db_connect()
    all_data = []
    result1 = db.get_collection(cpykey).find_one({"jsonFor": "audit_information", "Audit_ID": audit_1id})
    del result1["_id"]
    result1["cpykey"] = cpykey

    all_data.append(result1)

    result2 = db.get_collection(cpykey).find_one({"jsonFor": "audit_information", "Audit_ID": audit_2id})
    del result2["_id"]
    result2["cpykey"] = cpykey
    all_data.append(result2)
     
    # all comments
    all_exceptions=[]
    a_type=""

    #comment 1
    res_a1=db.get_collection(cpykey).count_documents({"jsonFor":"allExceptions", "Audit_ID": audit_1id})

    res_a2=db.get_collection(cpykey).count_documents({"jsonFor":"allExceptions", "Audit_ID": audit_2id})

    if(res_a2>res_a1):
        a_type="increase"
    elif(res_a2<res_a1):
        a_type="decrease"
    else:
        a_type="constant"       
    all_exceptions.append({"type":a_type,"value":abs(res_a2-res_a1)})

    # comment 2
    res1=db.get_collection(cpykey).find_one({"jsonFor":"audit_information", "Audit_ID": audit_1id})

    res2=db.get_collection(cpykey).find_one({"jsonFor":"audit_information", "Audit_ID": audit_2id})
   
    dev1=int(res1["Devices Attempted"])
    dev2=int(res2["Devices Attempted"])

    d_type = ""
    if dev2 > dev1:
        d_type = "increase"
    elif dev2 < dev1:
        d_type = "decrease"
    else:
        d_type = "constant"

    all_exceptions.append({"type":d_type,"value":abs(dev1 - dev2)})

    # comment 3
    list1= db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_1id})
    list2= db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_2id})
    list1 = set(list1)
    list2 = set(list2)
    c = list1.intersection((list2))
    e_set = [i for i in c]
    all_exceptions.append({"l":len(e_set)})


    #graph data
    graph_data = []
    graph_data.append({"name":audit_1id,"Exceptions":res_a1,"Devices":dev1})
    graph_data.append({"name":audit_2id,"Exceptions":res_a2,"Devices":dev2})

    all_exceptions.append({"graph":graph_data})

    final_data["d1"] = all_data
    final_data["d2"] = all_exceptions


    return final_data