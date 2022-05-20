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


total_data = {
    "Critical": {},
    "High": {},
    "Medium": {},
    "Low": {},
    "Informational": {}
}
lock = threading.Lock()


def get_data_sev(dev_list, db, cpykey, a, sev):
    a1_r = []

    # to do tasks
    # for each exception we need to find two things
    # distinct devices and NMS area
    for e in dev_list:
        n_area = db.get_collection(cpykey).distinct("NMS Area",
                                                    {"jsonFor": "allExceptions",
                                                     "Audit_ID": a,
                                                     "Severity": sev,
                                                     "Exception Name": e
                                                     })
        dev = db.get_collection(cpykey).distinct("Host Name (IP Address)",
                                                 {"jsonFor": "allExceptions",
                                                  "Audit_ID": a,
                                                  "Severity": sev,
                                                  "Exception Name": e
                                                  })
        dev = [i.split(" ")[0] for i in dev]
        a1_r.append({"name": e, "area": n_area[0], "devices": dev})

    lock.acquire()
    total_data[sev][a] = a1_r
    lock.release()


def get_json_sev_c(cpykey, a1, a2, sev):
    db = db_connect()  # db connect
    a1_list = db.get_collection(cpykey).distinct("Exception Name",
                                                 {"jsonFor": "allExceptions",
                                                  "Audit_ID": a1,
                                                  "Severity": sev})

    a2_list = db.get_collection(cpykey).distinct("Exception Name",
                                                 {"jsonFor": "allExceptions",
                                                  "Audit_ID": a2,
                                                  "Severity": sev})

    t1 = threading.Thread(target=get_data_sev, args=(a1_list, db, cpykey, a1, sev))
    t2 = threading.Thread(target=get_data_sev, args=(a2_list, db, cpykey, a2, sev))

    t1.start()
    t2.start()

    t1.join()
    t2.join()


def get_sev_data(cpykey, a1, a2):
    c_t = threading.Thread(target=get_json_sev_c, args=(cpykey, a1, a2, "Critical"))
    h_t = threading.Thread(target=get_json_sev_c, args=(cpykey, a1, a2, "High"))
    m_t = threading.Thread(target=get_json_sev_c, args=(cpykey, a1, a2, "Medium"))
    l_t = threading.Thread(target=get_json_sev_c, args=(cpykey, a1, a2, "Low"))
    i_t = threading.Thread(target=get_json_sev_c, args=(cpykey, a1, a2, "Informational"))

    c_t.start()
    h_t.start()
    m_t.start()
    l_t.start()
    i_t.start()

    c_t.join()
    h_t.join()
    m_t.join()
    l_t.join()
    i_t.join()

    return {
        "c": total_data["Critical"],
        "h": total_data["High"],
        "m": total_data["Medium"],
        "l": total_data["Low"],
        "i": total_data["Informational"]
    }
