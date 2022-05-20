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


def get_json_exe(cpykey, audit_1id, audit_2id):
    db = db_connect()  # db connect
    list1 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_1id,
                                                                  })
    list2 = db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_2id,
                                                                  })
    list1 = set(list1)
    list2 = set(list2)
    c = list1.union((list2))
    e_set = [i for i in c]
    return {"main": {"exe": e_set, "l": len(e_set)}}
    
    
exe_info = {}
lock_exe = threading.Lock()


def get_exe_info(cpykey,a,el):
    db = db_connect()
    # find the nms area and severity
    r_l = []
    for e in el:
        n_area = db.get_collection(cpykey).distinct("NMS Area", {
            "jsonFor": "allExceptions",
            "Audit_ID": a,
            "Exception Name": e
        })[0]
        sev = db.get_collection(cpykey).distinct("Severity", {
            "jsonFor": "allExceptions",
            "Audit_ID": a,
            "Exception Name": e
        })[0]
        r_l.append({"name": e, "sev": sev, "area": n_area})

    lock_exe.acquire()
    exe_info[a] = r_l
    lock_exe.release()


def get_json_exe_info(cpykey, a1, a2, el):
    db = db_connect()
    dev1 = db.get_collection(cpykey).distinct("Host Name (IP Address)",
                                                 {"jsonFor": "allExceptions", 
                                                 "Exception Name":el,
                                                 "Audit_ID":a1})
                                                   
    dev2 = db.get_collection(cpykey).distinct("Host Name (IP Address)",
                                                 {"jsonFor": "allExceptions",
                                                 "Exception Name": el,
                                                  "Audit_ID": a2
                                                 
    })

    

    return {"audit1": dev1, "audit2": dev2}
