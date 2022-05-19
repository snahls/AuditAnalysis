
from docxtpl import DocxTemplate,InlineImage
from DataBase import DataBase
import pandas as pd
import docx
from datetime import date
from pathlib import Path
import os
import re
import matplotlib.pyplot as plt
import numpy as np

def func(pct, allvals):
    absolute = int(round(pct/100.*np.sum(allvals)))
    return "{:d}".format(absolute)


#today = date.today()

    #root = os.path.dirname(os.path.realpath(__file__))
#
#d = today.strftime("%B %d, %Y")

database = DataBase('localhost', 27017)
#tpl = DocxTemplate('/Users/vikasran/Documents/UCS_AUDIT_Dashboard/Report_Template_final.docx')

#db_name = 'UCS_DB_SAFARICOM_89450'

def create_legend():
    p = plt.gcf()
    p.set_size_inches(5,0.5)

    colors = ['#00bceb','#1e4471', '#6abf4b','#eed202']
    f = lambda m,c: plt.plot([],[],marker=m, color=c, ls="none")[0]
    handles = [f("s", colors[i]) for i in range(4)]
    labels = ['High','Medium', 'Low', 'Info']
    legend = plt.legend(handles, labels, loc=2, ncol=4)#, framealpha=1, frameon=True)

    plt.gca().set_axis_off()
    #plt.show()
    plt.savefig('temp_pic/legend.png', dpi=900)
    # plt.clf()
    # plt.cla()
    plt.close()

def donaught_create(data, bar_name):

    category, value = list(data.keys()), list(data.values())
    value = [i for i in value if i != 0]
    #print(f'category:{list(category)}\n value:{list(value)}')

    #fig, ax = plt.subplots(figsize=(5, 3), subplot_kw=dict(aspect="equal"))
    colors = ['#00bceb','#1e4471', '#6abf4b','#eed202']

    # my_circle = plt.Circle((0, 0), 0, color='white')
      
    # Give color names
    w,_,autot = plt.pie(value, autopct=lambda pct: func(pct, value), colors=colors)
      
    p = plt.gcf()
    p.set_size_inches(2.7,2.7)
    # p.gca().add_artist(my_circle)
    plt.setp(autot,size=7, weight="bold",color='white')
    plt.legend(loc="upper center", labels=list(category),bbox_to_anchor=(0.5, -0.05))
   # ax.legend(w, fault_type,title="Type", loc="center left",bbox_to_anchor=(1, 0, 0.5, 1))

    #plt.title('FAULT Statistics', fontdict={'weight': 'bold'})
    plt.tight_layout()
    plt.savefig(bar_name, bbox_inches='tight')
    #plt.show()

    plt.clf()
    plt.cla()
    plt.close()
    # Show the graph
    

def donaught_create_call(db_name):
    l = database.fetchDataFromDB(db_name, "bar_stats_data")
    print(l)

    try:
        fault_data = l[0]['fault']
        donaught_create(fault_data, 'temp_pic/fault.png')
    except:
        print('Issue in fault')
        donaught_create({}, 'temp_pic/fault.png')
    try:
        bp_data = l[0]['bp']
        donaught_create(bp_data, 'temp_pic/bp.png')
    except:
        print('Issue in bp')
        donaught_create({}, 'temp_pic/bp.png')
    try:
        fault_tot = l[0]['total']
        donaught_create(fault_tot, 'temp_pic/summary.png')
    except:
        print('Issue in summary')
        donaught_create({}, 'temp_pic/summary.png')
    try:
        ldos_data = l[0]['LDoSStats']
        donaught_create(ldos_data, 'temp_pic/ldos.png')
    except:
        print('Issue in ldos')
        donaught_create({}, 'temp_pic/ldos.png')
    try:
        bdb_data = l[0]['bdb']
        donaught_create(bdb_data, 'temp_pic/bdb.png')
    except:
        print('Issue in bdb')
        donaught_create({}, 'temp_pic/bdb.png')
    try:
        sp_data = l[0]['SP_counter']
        donaught_create(sp_data,'temp_pic/sp.png')
    except:
        print('Issue in sp')
        donaught_create({}, 'temp_pic/sp.png')

    
#donaught_create_call()


def create_report(db_name, name):

    pic = 'UCS_DB_FNB_03'
    
    stat = database.fetchDataFromDB(db_name, "overview_stats")
    dom  = stat[0]['num_domain']
    fi = stat[0]['num_FI']
    chassis = stat[0]['num_chassis']
    blade = stat[0]['num_b_server']

    bpdata = database.fetchDataFromDB(db_name, "BP_Exception") 
    fault = database.fetchDataFromDB(db_name, "UCS_FAULT")
    eol = database.fetchDataFromDB(db_name, "EolDATA")

    stats = database.fetchDataFromDB(db_name, "overview_stats_detail") 
    port_cap = database.fetchDataFromDB(db_name,"port_capacity")
    
    #print(port_cap)
    #print(stats[0]['FI']['Model'])

    context = {'cust_name' : name, 
    'report_type': "UCS Audit Report", 
    'date_of_doc': d, 
    'version':"1.0",

    #'tbl_contents': bdb,
    'tbl_contents1': bpdata,
    'tbl_contents2': fault,
    'tbl_contents3': eol,
    'tbl_contents4': port_cap,
    'D': dom,
    'FI': fi,
    'cha': chassis,
    'bld':blade,
    'legend':InlineImage(tpl,'legend.png'),

    'fault_image':InlineImage(tpl,'fault.png'),
    'bp_image' : InlineImage(tpl,'bp.png'),
    'ldos_img' : InlineImage(tpl,'ldos.png'),
    
    'bdb_img': InlineImage(tpl,'bdb.png'),
    'total_image':  InlineImage(tpl,'summary.png'),
    'top_image': InlineImage(tpl,'R1UCSMSQL01_Topology_Diagram.jpg')#, width=Mm(160), height=Mm(190), )



    }

    tpl.render(context,autoescape=True)
    tpl.save(f'/Users/vikasran/Documents/UCS_AUDIT_Dashboard/REPORT_UCS_{db_name}.docx')

#donaught_create_call()
#create_legend()

#create_report(db_name, name='SAFARICON')

    