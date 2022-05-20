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


def get_json_dev(cpykey, a1, a2):
    db = db_connect()
    dev1 = db.get_collection(cpykey).distinct("Host Name (IP Address)", {
        "jsonFor": "allExceptions",
        "Audit_ID": a1
    })
    dev2 = db.get_collection(cpykey).distinct("Host Name (IP Address)", {
        "jsonFor": "allExceptions",
        "Audit_ID": a2
    })
    dev1 = set(dev1)
    dev2 = set(dev2)
    c = dev1.union((dev2))
    d_set = [i for i in c]
    return {"main": {"dev": d_set, "l": len(d_set)}}


dev_info = {}
lock_dev = threading.Lock()


def get_dev_info(cpykey, a, dev_id, el):
    db = db_connect()
    # find the nms area and severity
    r_l = []
    for e in el:
        n_area = db.get_collection(cpykey).distinct("NMS Area", {
            "jsonFor": "allExceptions",
            "Audit_ID": a,
            "Host Name (IP Address)": dev_id,
            "Exception Name": e
        })[0]
        sev = db.get_collection(cpykey).distinct("Severity", {
            "jsonFor": "allExceptions",
            "Audit_ID": a,
            "Host Name (IP Address)": dev_id,
            "Exception Name": e
        })[0]
        count_d = db.get_collection(cpykey).count({
                    "jsonFor":"allExceptions",
                    "Audit_ID":a,
                    "Host Name (IP Address)":dev_id,
                    "Exception Name":e})
        r_l.append({"name": e, "sev": sev, "area": n_area,"occur":count_d})

    lock_dev.acquire()
    dev_info[a] = r_l
    lock_dev.release()


def get_json_dev_info(cpykey, a1, a2, dev_id):
    db = db_connect()
    ex1 = db.get_collection(cpykey).distinct("Exception Name", {
        "jsonFor": "allExceptions",
        "Audit_ID": a1,
        "Host Name (IP Address)": dev_id
    })
    ex2 = db.get_collection(cpykey).distinct("Exception Name", {
        "jsonFor": "allExceptions",
        "Audit_ID": a2,
        "Host Name (IP Address)": dev_id
    })

    if len(ex1) != 0 and len(ex2) != 0: # device is present in both device
        t1 = threading.Thread(target=get_dev_info, args=(cpykey, a1, dev_id, ex1))
        t2 = threading.Thread(target=get_dev_info, args=(cpykey, a2, dev_id, ex2))

        t1.start()
        t2.start()

        t1.join()
        t2.join()

        return {"isA1": "true", "isA2": "true", "audit1": dev_info[a1], "audit2": dev_info[a2]}

    elif len(ex1) != 0:
        t1 = threading.Thread(target=get_dev_info, args=(cpykey, a1, dev_id, ex1))
        t1.start()
        t1.join()

        return {"isA1": "true", "isA2": "false", "audit1": dev_info[a1], "audit2": []}
    elif len(ex2) != 0:
        t2 = threading.Thread(target=get_dev_info, args=(cpykey, a2, dev_id, ex2))
        t2.start()
        t2.join()

        
        return {"isA1": "false", "isA2": "true", "audit1": [], "audit2": dev_info[a2]}

