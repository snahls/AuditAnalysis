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


final_data_t = {}
lock = threading.Lock()


def get_sev_main_thread(cpykey, audit_1id, audit_2id, sev):
    db = db_connect()
    list1 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_1id,
                                                                  "Severity": sev})
    list2 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_2id,
                                                                  "Severity": sev})

    final_data = []
    final_data2 = []

    for e in list1:
        devices = []
        dev = db.get_collection(cpykey).distinct("Host Name (IP Address)",
                                                 {"jsonFor": "allExceptions", "Audit_ID": audit_1id,
                                                  "Severity": sev, "Exception Name": e})
        for d in dev:
            devices.append(d.split(" ")[0])

        final_data.append({"exception": e, "list": devices, "length": len(devices)})
    for e in list2:
        devices = []
        dev = db.get_collection(cpykey).distinct("Host Name (IP Address)",
                                                 {"jsonFor": "allExceptions", "Audit_ID": audit_2id,
                                                  "Severity": sev, "Exception Name": e})
        for d in dev:
            devices.append(d.split(" ")[0])

        final_data2.append({"exception": e, "list": devices, "length": len(devices)})

    lock.acquire()
    final_data_t[sev] = {"audit_1": final_data, "audit_2": final_data2}
    lock.release()


def get_sev_tables_data(cpykey, audit_1id, audit_2id):
    db = db_connect()

    t1 = threading.Thread(target=get_sev_main_thread, args=(cpykey, audit_1id, audit_2id, "Critical"))
    t2 = threading.Thread(target=get_sev_main_thread, args=(cpykey, audit_1id, audit_2id, "High"))
    t3 = threading.Thread(target=get_sev_main_thread, args=(cpykey, audit_1id, audit_2id, "Medium"))
    t4 = threading.Thread(target=get_sev_main_thread, args=(cpykey, audit_1id, audit_2id, "Low"))
    t5 = threading.Thread(target=get_sev_main_thread, args=(cpykey, audit_1id, audit_2id, "Informational"))

    t1.start()
    t2.start()
    t3.start()
    t4.start()
    t5.start()

    t1.join()
    t2.join()
    t3.join()
    t4.join()
    t5.join()

    return {"c": final_data_t["Critical"], "h": final_data_t["High"],"m": final_data_t["Medium"],
            "l": final_data_t["Low"],"i":final_data_t["Informational"] }
