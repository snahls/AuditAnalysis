import pymongo



def db_connect():
    """
    :return: returns the connection to the user
    """
    dbname = "CNA_Visualizer"
    dbclient = pymongo.MongoClient("mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb", 27017)
    db = dbclient[dbname]
    return db

def find_percent(num1, num2):
    if num1 == 0 and num2 == 0:
        return 0
    p = int(((num1 - num2) / (num1)) * 100)
    # p > 0 : decrement in exceptions green color
    # p < 0 : increment in exceptions red color
    percent = None
    if p > 0:
        percent = {"p": abs(p), "diff": "decrement"}
    elif p < 0:
        percent = {"p": abs(p), "diff": "increment"}
    else:
        percent = {"p": abs(p), "diff": "constant"}

    return percent


def get_allexceptions_json(cpykey, audit_1id, audit_2id):
    """
            input: it takes the company key and audit list to be compared
            TNE-C: total number of critical exceptions
            TNE-H: total number of high severity exceptions
            TNE-M: medium severity
            TNE-L: low severity
            TNE-I: informational severity

            :return: it returns the json for the audit id
    """
    """
            Here the /oe starts
    """
    db = db_connect()
    all_data = []
    oe_data = []

    id_1 = audit_1id
    id_2 = audit_2id
    # gather total number of exceptions
    a1c = db.get_collection(cpykey).count_documents({"Audit_ID": id_1, "jsonFor": "allExceptions"})
    a2c = db.get_collection(cpykey).count_documents({"Audit_ID": id_2, "jsonFor": "allExceptions"})
    oe_data.append({"name": "TNE", audit_1id: a1c, audit_2id: a2c})
    oe_percent = find_percent(a1c, a2c)
    all_data.append({"result": oe_data, "percent": oe_percent})

    """
        Here the /ae starts
    """
    ae_data = []
    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "Severity": "Critical"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "Severity": "Critical"})
    ae_data.append({"name": "Critical", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents({"Audit_ID": id_1, "jsonFor": "allExceptions", "Severity": "High"})
    a2c = db.get_collection(cpykey).count_documents({"Audit_ID": id_2, "jsonFor": "allExceptions", "Severity": "High"})
    ae_data.append({"name": "High", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "Severity": "Medium"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "Severity": "Medium"})
    ae_data.append({"name": "Medium", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents({"Audit_ID": id_1, "jsonFor": "allExceptions", "Severity": "Low"})
    a2c = db.get_collection(cpykey).count_documents({"Audit_ID": id_2, "jsonFor": "allExceptions", "Severity": "Low"})
    ae_data.append({"name": "Low", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "Severity": "Informational"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "Severity": "Informational"})
    ae_data.append({"name": "Info", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    all_data.append({"result": ae_data, "percent": 0})

    """
        here /ue starts
    """
    ue_data = []
    result1 = db.get_collection(cpykey).distinct("Exception Name", {"Audit_ID": audit_1id, "jsonFor": "allExceptions"})
    result2 = db.get_collection(cpykey).distinct("Exception Name", {"Audit_ID": audit_2id, "jsonFor": "allExceptions"})
    ue_data = [{"name": "Unique Exceptions", audit_1id: len(result1), audit_2id: len(result2)}]

    percent = find_percent(len(result1), len(result2))
    all_data.append({"result": ue_data, "percent": percent})


    list1= db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_1id})
    list2= db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_2id})
    list1 = set(list1)
    list2 = set(list2)
    c = list1.intersection((list2))
    e_set = [i for i in c]
    all_data.append({"main":{"exe": e_set,"l":len(e_set)}})

    return all_data