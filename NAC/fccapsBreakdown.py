import pymongo
import threading


def db_connect():
    """
    :return: returns the connection to the user
    """
    dbname = "CNA_Visualizer"
    dbclient = pymongo.MongoClient("mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb", 27017)
    db = dbclient[dbname]
    return db


def find_percent(num1, num2):
    if num1 == 0:
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


graph_data = {}


def fccaps_graph_data(cpykey, audit_1id, audit_2id):
    db = db_connect()
    all_data = []
    id_1 = audit_1id
    id_2 = audit_2id

    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "NMS Area": "Fault Management"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "NMS Area": "Fault Management"})
    all_data.append({"name": "Fault Management", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "NMS Area": "Capacity Management"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "NMS Area": "Capacity Management"})
    all_data.append({"name": "Capacity Management", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "NMS Area": "Configuration Management"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "NMS Area": "Configuration Management"})
    all_data.append({"name": "Configuration Management", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "NMS Area": "Performance Management"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "NMS Area": "Performance Management"})
    all_data.append({"name": "Performance Management", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    a1c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_1, "jsonFor": "allExceptions", "NMS Area": "Security Management"})
    a2c = db.get_collection(cpykey).count_documents(
        {"Audit_ID": id_2, "jsonFor": "allExceptions", "NMS Area": "Security Management"})
    all_data.append({"name": "Security Management", audit_1id: a1c, audit_2id: a2c, "percent": find_percent(a1c, a2c)})

    graph_data[audit_1id+audit_2id] = all_data


total_data = {
    "Fault Management": {},
    "Capacity Management": {},
    "Configuration Management": {},
    "Performance Management": {},
    "Security Management": {}
}
lock_f = threading.Lock()


def get_data_fccaps(dev_list, db, cpykey, a, mgmt):
    a_r = []
    for e in dev_list:  # find the list for each exception
        r = db.get_collection(cpykey).distinct("Host Name (IP Address)", {"jsonFor": "allExceptions",
                                                                          "NMS Area": mgmt,
                                                                          "Audit_ID": a,
                                                                          "Severity": "Critical",
                                                                          "Exception Name": e})
        r = [i.split(" ")[0] for i in r]
        if len(r) != 0:
            a_r.append({"exception": e, "devices": {"sev": "critical", "list": r, "l": len(r)}})

        r = db.get_collection(cpykey).distinct("Host Name (IP Address)", {"jsonFor": "allExceptions",
                                                                          "NMS Area": mgmt,
                                                                          "Audit_ID": a,
                                                                          "Severity": "High",
                                                                          "Exception Name": e})
        r = [i.split(" ")[0] for i in r]
        if len(r) != 0:
            a_r.append({"exception": e, "devices": {"sev": "high", "list": r, "l": len(r)}})

        r = db.get_collection(cpykey).distinct("Host Name (IP Address)", {"jsonFor": "allExceptions",
                                                                          "NMS Area": mgmt,
                                                                          "Audit_ID": a,
                                                                          "Severity": "Medium",
                                                                          "Exception Name": e})
        r = [i.split(" ")[0] for i in r]
        if len(r) != 0:
            a_r.append({"exception": e, "devices": {"sev": "medium", "list": r, "l": len(r)}})

        r = db.get_collection(cpykey).distinct("Host Name (IP Address)", {"jsonFor": "allExceptions",
                                                                          "NMS Area": mgmt,
                                                                          "Audit_ID": a,
                                                                          "Severity": "Low",
                                                                          "Exception Name": e})
        r = [i.split(" ")[0] for i in r]
        if len(r) != 0:
            a_r.append({"exception": e, "devices": {"sev": "low", "list": r, "l": len(r)}})

        r = db.get_collection(cpykey).distinct("Host Name (IP Address)", {"jsonFor": "allExceptions",
                                                                          "NMS Area": mgmt,
                                                                          "Audit_ID": a,
                                                                          "Severity": "Informational",
                                                                          "Exception Name": e})
        r = [i.split(" ")[0] for i in r]
        if len(r) != 0:
            a_r.append({"exception": e, "devices": {"sev": "info", "list": r, "l": len(r)}})

    isp = "true"
    if len(a_r) == 0:
        isp = "false"
    lock_f.acquire()
    total_data[mgmt][a] = {"list":a_r,"isp":isp}
    lock_f.release()


def fccaps_all_tables(cpykey, a1, a2, mgmt, db):
    a1_list = db.get_collection(cpykey).distinct("Exception Name",
                                                 {"jsonFor": "allExceptions", "NMS Area": mgmt,
                                                  "Audit_ID": a1})

    a2_list = db.get_collection(cpykey).distinct("Exception Name",
                                                 {"jsonFor": "allExceptions", "NMS Area": mgmt,
                                                  "Audit_ID": a2})

    t1 = threading.Thread(target=get_data_fccaps, args=(a1_list, db, cpykey, a1, mgmt))
    t2 = threading.Thread(target=get_data_fccaps, args=(a2_list, db, cpykey, a2, mgmt))

    t1.start()
    t2.start()

    t1.join()
    t2.join()


def fccaps_data(cpykey, audit_1id, audit_2id):
    db = db_connect()
    g_thread = threading.Thread(target=fccaps_graph_data,args=(cpykey, audit_1id, audit_2id))
    f_thread = threading.Thread(target=fccaps_all_tables, args=(cpykey, audit_1id, audit_2id, "Fault Management", db))
    c_thread = threading.Thread(target=fccaps_all_tables, args=(cpykey, audit_1id, audit_2id, "Capacity Management", db))
    co_thread = threading.Thread(target=fccaps_all_tables, args=(cpykey, audit_1id, audit_2id,
                                                                 "Configuration Management", db))
    p_thread = threading.Thread(target=fccaps_all_tables, args=(cpykey, audit_1id, audit_2id, "Performance Management", db))
    s_thread = threading.Thread(target=fccaps_all_tables, args=(cpykey, audit_1id, audit_2id, "Security Management", db))

    g_thread.start()
    f_thread.start()
    c_thread.start()
    co_thread.start()
    p_thread.start()
    s_thread.start()

    g_thread.join()
    f_thread.join()
    c_thread.join()
    co_thread.join()
    p_thread.join()
    s_thread.join()

    return {
        "fgd": graph_data[audit_1id+audit_2id], 
        "f": total_data["Fault Management"],
        "c": total_data["Capacity Management"],
        "con": total_data["Configuration Management"],
        "p": total_data["Performance Management"],
        "s": total_data["Security Management"],
    }