from flask import Flask, request, make_response
from flask_cors import CORS
import pymongo
import pprint
import math
import threading


from coreutils.fccapsBreakdown import fccaps_data
from coreutils.SeverityBreakdown import get_sev_data
from coreutils.Devices import get_json_dev, get_json_dev_info
from coreutils.Details import getinfo_json
from coreutils.AllExceptions import get_allexceptions_json
from coreutils.AETable import get_json_table_allexceptions
from coreutils.exception import get_json_exe, get_json_exe_info



app = Flask(__name__)
CORS(app)



def db_connect():
    """
    :return: returns the connection to the user
    """
    dbname = "CNA_Visualizer"
    dbclient = pymongo.MongoClient("mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb", 27017)
    db = dbclient[dbname]
    return db


@app.route("/api/audit/get/graph/allexceptions", methods=["GET"])
def get_audit_all_exceptions():

    cpykey = request.args.get("cpykey")
    audit_1id = request.args.get("audit_1_id")
    audit_2id = request.args.get("audit_2_id")

    db = db_connect()
    r = db.get_collection(cpykey)
    if r is None:
        return {"error": "CpyKey is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

    if count is None:
        return {"error": "Audit-1 is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

    if count is None:
        return {"error": "Audit-2 is needed"}, 400

    result = get_allexceptions_json(cpykey, audit_1id, audit_2id)

    response = make_response({"main": result})
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response, 200


@app.route("/api/audit/info", methods=["GET"])
def getinfo():
    cpykey = request.args.get("cpykey")
    audit_1id = request.args.get("audit_1_id")
    audit_2id = request.args.get("audit_2_id")
    print(cpykey)
    print(audit_1id)
    print(audit_2id)

    db = db_connect()
    r = db.get_collection(cpykey)
    if r is None:
        return {"error": "CpyKey is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

    if count is None:
        return {"error": "Audit-1 is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

    if count is None:
        return {"error": "Audit-2 is needed"}, 400

    result = getinfo_json(cpykey, audit_1id, audit_2id)

    response = make_response({"result": result})
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response, 200


def find_percent(num1, num2):
    if num1 == 0 and num2 == 0:
        return 0
    p = int(((num1-num2)/(num1))*100)
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


@app.route("/api/upload", methods=['POST'])
def upload():
    """
    this function is used to upload the audits from the user
    :return: it returns the status code for the frontend
    """
    db = db_connect()
    if request.method == 'POST':
        # init the data for storing the input from the starting page
        # two audits with name audit 1 and audit 2
        data = {}
        error = False
        message = ""
        if "cec_id" in request.form and "audit1_id" in request.form and "audit2_id" in request.form and "cpy_key" in request.form:
            # complete the if statement
            # these are the files
            cec_id = str(request.form['cec_id'])
            top_id = str(request.form['top_id'])
            cpy_key = str(request.form['cpy_key'])
            cname = str(request.form['cname'])
            audit1_id = str(request.form['audit1_id'])
            audit2_id = str(request.form['audit2_id'])

            if cec_id and cpy_key and audit1_id and audit2_id:
                data['cec_id'] = cec_id
                data['top_id'] = top_id
                data['cpy_key'] = cpy_key
                data['cname'] = cname
                data['audit1_id'] = audit1_id
                data['audit2_id'] = audit2_id
                
                
                r= db.get_collection(cpy_key)
                if r is None:
                    error = True
                    message += "CPYKEY is wrong, please enter the Valid CPYKEY\n"

                count = db.get_collection(cpy_key).find_one({"Audit_ID": audit1_id})
                
                if count is None:
                    error = True
                    message += "{} is not a valid audit id-1\n".format(audit1_id)

                count = db.get_collection(cpy_key).find_one({"Audit_ID": audit2_id})

                if count is None:
                    error = True
                    message += "{} is not a valid audit id-2\n".format(audit2_id)
                
                if error:
                    response = make_response({"message": message,"status":"false"})
                    response.headers['Access-Control-Allow-Origin'] = '*'
                    return response, 200
                response = make_response({"message": "Success!","status":"true"})
                response.headers['Access-Control-Allow-Origin'] = '*'
                return response, 200
            else:
                return {"error": "Error Format in request"}, 400
        else:
            return {"error": "Error format in request header"}, 400

@app.route("/api/audit/get/table/allexceptions")
def get_t_a():
    cpykey = request.args.get("cpykey")
    audit_1id = request.args.get("audit_1_id")
    audit_2id = request.args.get("audit_2_id")

    db = db_connect()
    r = db.get_collection(cpykey)
    if r is None:
        return {"error": "CpyKey is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

    if count is None:
        return {"error": "Audit-1 is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

    if count is None:
        return {"error": "Audit-2 is needed"}, 400

    result = get_json_table_allexceptions(cpykey, audit_1id, audit_2id)

    response = make_response({"main": result})
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response, 200

@app.route("/api/audit/get/data/fccaps")
def get_data_fccaps():
    cpykey = request.args.get("cpykey")
    audit_1id = request.args.get("audit_1_id")
    audit_2id = request.args.get("audit_2_id")

    db = db_connect()
    r = db.get_collection(cpykey)
    if r is None:
        return {"error": "CpyKey is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

    if count is None:
        return {"error": "Audit-1 is needed"}, 400

    count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

    if count is None:
        return {"error": "Audit-2 is needed"}, 400

    result = fccaps_data(cpykey, audit_1id, audit_2id)

    response = make_response({"main": result})
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response, 200


@app.route("/api/audit/get/data/sev", methods=["GET"])
def get_sev_c():
    if request.method == "GET":
        cpykey = request.args.get("cpykey")
        audit_1id = request.args.get("audit_1_id")
        audit_2id = request.args.get("audit_2_id")

        db = db_connect()
        r = db.get_collection(cpykey)
        if r is None:
            return {"error": "CpyKey is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

        if count is None:
            return {"error": "Audit-1 is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

        if count is None:
            return {"error": "Audit-2 is needed"}, 400

        result = get_sev_data(cpykey, audit_1id, audit_2id)

        response = make_response({"main": result})
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response, 200

# module-2 starts here

@app.route("/api/audit/get/devices", methods=["GET"])
def get_devices():
    if request.method == "GET":
        cpykey = request.args.get("cpykey")
        audit_1id = request.args.get("audit_1_id")
        audit_2id = request.args.get("audit_2_id")

        db = db_connect()
        r = db.get_collection(cpykey)
        if r is None:
            return {"error": "CpyKey is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

        if count is None:
            return {"error": "Audit-1 is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

        if count is None:
            return {"error": "Audit-2 is needed"}, 400

        result = get_json_dev(cpykey, audit_1id, audit_2id)
        response = make_response({"result": result})
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response, 200


@app.route("/api/audit/get/device/info",methods=["GET"])
def get_device():
    if request.method == "GET":
        cpykey = request.args.get("cpykey")
        audit_1id = request.args.get("audit_1_id")
        audit_2id = request.args.get("audit_2_id")
        dev_id = request.args.get("dev_id")
        print(dev_id)

        db = db_connect()
        r = db.get_collection(cpykey)
        if r is None:
            return {"error": "CpyKey is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

        if count is None:
            return {"error": "Audit-1 is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

        if count is None:
            return {"error": "Audit-2 is needed"}, 400

        result = get_json_dev_info(cpykey, audit_1id, audit_2id,dev_id)
        response = make_response({"result": result})
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response, 200
        

@app.route("/api/audit/get/exception", methods=["GET"])
def get_exception():
    if request.method == "GET":
        cpykey = request.args.get("cpykey")
        audit_1id = request.args.get("audit_1_id")
        audit_2id = request.args.get("audit_2_id")

        db = db_connect()
        r = db.get_collection(cpykey)
        if r is None:
            return {"error": "CpyKey is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

        if count is None:
            return {"error": "Audit-1 is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

        if count is None:
            return {"error": "Audit-2 is needed"}, 400

        result = get_json_exe(cpykey, audit_1id, audit_2id)
        response = make_response({"result": result})
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response, 200


@app.route("/api/audit/get/exe/info",methods=["GET"])
def get_exe():
    if request.method == "GET":
        cpykey = request.args.get("cpykey")
        audit_1id = request.args.get("audit_1_id")
        audit_2id = request.args.get("audit_2_id")
        el = request.args.get("el")

        db = db_connect()
        r = db.get_collection(cpykey)
        if r is None:
            return {"error": "CpyKey is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

        if count is None:
            return {"error": "Audit-1 is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

        if count is None:
            return {"error": "Audit-2 is needed"}, 400

        result = get_json_exe_info(cpykey, audit_1id, audit_2id,el)
        response = make_response({"result": result})
        response.headers['Access-Control-Allow-Origin'] = '*'

        return response, 200


#Union table
def get_json_union_exceptions_list(cpykey, audit_1id, audit_2id):
    db = db_connect()
    list1= db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_1id})
    list2= db.get_collection(cpykey).distinct("Exception Name", {"jsonFor": "allExceptions", "Audit_ID": audit_2id})
    list1 = set(list1)
    list2 = set(list2)
    c = list1.intersection((list2))
    e_set = [i for i in c]
    return {"main": {"exe": e_set, "l": len(e_set)}}


@app.route("/api/audit/get/union", methods=["GET"])
def get_union():
    if request.method == "GET":
        cpykey = request.args.get("cpykey")
        audit_1id = request.args.get("audit_1_id")
        audit_2id = request.args.get("audit_2_id")

        db = db_connect()
        r = db.get_collection(cpykey)
        if r is None:
            return {"error": "CpyKey is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_1id})

        if count is None:
            return {"error": "Audit-1 is needed"}, 400

        count = db.get_collection(cpykey).find_one({"Audit_ID": audit_2id})

        if count is None:
            return {"error": "Audit-2 is needed"}, 400

        result = get_json_union_exceptions_list(cpykey, audit_1id, audit_2id)
        return {"result":result} , 200

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8020,debug=True)
