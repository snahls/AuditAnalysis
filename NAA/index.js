all_exceptions = ''//'[{"Host Name (IP Address)": "CN-DCA-3.ZA (196.4.87.84)","Chassis Type": "ciscoASR9010","Table Name": "Router SNMP Configuration Table","Exception Name": "SNMP Community ACL","Exception Value": "disabled","Severity": "Red","NMS Area": "Configuration Management"},{"Host Name (IP Address)": "CN-DCA-3.ZA (196.4.87.84)","Chassis Type": "ciscoASR9010","Table Name": "Router SNMP Configuration Table","Exception Name": "SNMP Community ACL","Exception Value": "enabled","Severity": "Red","NMS Area": "Configuration Management"}]'
all_data = ''//'[{"HostName(IPAddress)":"CN-DCA-3.ZA(196.4.87.84)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"Platform","ColumnValue":"ASR9010","NMSArea":"CapacityManagement"},{"HostName(IPAddress)":"CN-DCA-3.ZA(196.4.87.84)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"TotalSlots","ColumnValue":"8","NMSArea":"CapacityManagement"},{"HostName(IPAddress)":"CN-DCA-3.ZA(196.4.87.84)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"TotalInstalledSlots","ColumnValue":"4","NMSArea":"CapacityManagement"},{"HostName(IPAddress)":"CN-DCA-3.ZA(196.4.87.84)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"TotalEmptySlots","ColumnValue":"4","NMSArea":"CapacityManagement"},{"HostName(IPAddress)":"CN-DCA-4.ZA(196.4.87.85)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"Platform","ColumnValue":"ASR9010","NMSArea":"CapacityManagement"},{"HostName(IPAddress)":"CN-DCA-4.ZA(196.4.87.85)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"TotalSlots","ColumnValue":"8","NMSArea":"CapacityManagement"},{"HostName(IPAddress)":"CN-DCA-4.ZA(196.4.87.85)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"TotalInstalledSlots","ColumnValue":"4","NMSArea":"CapacityManagement"},{"HostName(IPAddress)":"CN-DCA-4.ZA(196.4.87.85)","ChassisType":"ciscoASR9010","TableName":"RouterCapacityTable","ColumnName":"TotalEmptySlots","ColumnValue":"4","NMSArea":"CapacityManagement"}]'
software_table_data = ''//'[{"HostName(IPAddress)":"RB-DCA-3.ZA   (196.4.87.97)","Chassis_Type":"ASR9010","Software_Version":"5.3.3[Default]"},{"HostName(IPAddress)":"CN-DCA-4.ZA   (196.4.87.85)","Chassis_Type":"ASR9010","Software_Version":"5.3.4[Default]"},{"HostName(IPAddress)":"TB-PBR-1.ZA   (196.4.87.212)","Chassis_Type":"ASR9006","Software_Version":"5.3.4[Default]"},{"HostName(IPAddress)":"RB-PBR-1.ZA   (196.4.87.203)","Chassis_Type":"ASR9006","Software_Version":"5.3.4[Default]"}]'
cpu_memory_data =''
curr_customer_name = ''
curr_cpy_key = ''
curr_audit_id = ''
curr_audit_type = ''
curr_audit_information = {}
hardware_summary_data = []
software_summary_data = []
CPU_Memory_Table_data = []
DNR_Array = []
severity_breakdown_data = {}
calcFlag = 0
total_unique_exceptions = 0
configuration_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
fault_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
capacity_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
performance_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
security_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
total_sev_data = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0}


var ssocookie=document.cookie.match('(^|;)\\s*' + "naa_auth" + '\\s*=\\s*([^;]+)');
  if(ssocookie=="")
  {
    window.location.href="http://10.123.219.166:8001/"
  }

$('.dropdown__menu').click(function(e) {
        var el = $(this).find('input');
        if (!el.hasClass('disabled') && !el.attr('disabled') && !el.hasClass('readonly') && !el.attr('readonly')) {
            $(this).toggleClass('active');
        }
});

loader_div = '<div class="col-md-2"><div class="subheader">Loading... Please wait</div><div class="loading-dots" aria-label="Loading, please wait..."><span></span><span></span><span></span></div>'
$(document).ready(function(){

  user_name = document.cookie.match(new RegExp('(^| )' + "naa_User" + '=([^;]+)'))[2];
  user_email = document.cookie.match(new RegExp('(^| )' + "naa_email" + '=([^;]+)'))[2];
  user_email = user_email.replace(/"/g, "");

  $("#naa_user_name").text("Hi "+user_name)


  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  curr_customer_name = vars['customer_name']
  curr_cpy_key = vars['cpy_key']
  curr_audit_id = vars['a_id']
  curr_audit_type = vars['a_type']
  curr_audit_type = curr_audit_type.split("+").join(" ")
  curr_customer_name = curr_customer_name.split("+").join(" ")
  $("#cust_name_header").text(curr_customer_name+" ("+curr_cpy_key+")")
  $("#audit_id_header").text(curr_audit_id)

  //Get Audit information
  $.ajax({
      async:false,
  		url: 'http://10.123.219.166:8001/getAuditInfo',
  		data: {
        customer_key : curr_cpy_key,
        audit_id : curr_audit_id,
        audit_type : curr_audit_type
      },
  		error: function() {
        console.log("Error occured")
    		//$('#cmd_json_output').val('An error has occurred');
  		},
  		success: function(data) {
  			var pretty = JSON.stringify(data, undefined, 4);
        curr_audit_information = data
        //console.log(pretty)
    		//$('#cmd_json_output').val(pretty)
  		},
  		type: 'GET',
	});


  //GEtting HW SUmmary graph data

    $.ajax({
        async:false,
        url: 'http://10.123.219.166:8001/getData',
        data: {
          cpy_key : curr_cpy_key,
          audit_id : curr_audit_id,
          file_name : "hardwareSummaryGraph"
        },
        error: function() {
          console.log("Error occured")
          //$('#cmd_json_output').val('An error has occurred');
        },
        success: function(data) {
          var pretty = JSON.stringify(data, undefined, 4);
          hardware_summary_data = data
          //console.log(pretty)
          //$('#cmd_json_output').val(pretty)
        },
        type: 'GET',
    });


  //Getting sw summary graph data
    $.ajax({
        async:false,
        url: 'http://10.123.219.166:8001/getData',
        data: {
           cpy_key : curr_cpy_key,
          audit_id : curr_audit_id,
          file_name : "softwareSummaryGraph"
        },
        error: function() {
          console.log("Error occured")
          //$('#cmd_json_output').val('An error has occurred');
        },
        success: function(data) {
          var pretty = JSON.stringify(data, undefined, 4);
          software_summary_data = data
          //console.log(pretty)
          //$('#cmd_json_output').val(pretty)
        },
        type: 'GET',
    });

  //Getting CPU and memory table data for Nexus Audit
    if(curr_audit_type !="Other" && curr_audit_type != "IOS XR Audit"){
      $.ajax({
        async:false,
        url: 'http://10.123.219.166:8001/getData',
        data: {
           cpy_key : curr_cpy_key,
          audit_id : curr_audit_id,
          file_name : "CPU_Memory_Table"
        },
        error: function() {
          console.log("Error occured")
          //$('#cmd_json_output').val('An error has occurred');
        },
        success: function(data) {
          var pretty = JSON.stringify(data, undefined, 4);
          CPU_Memory_Table_data = data
          //console.log(pretty)
          //$('#cmd_json_output').val(pretty)
        },
        type: 'GET',
    });
  }

    $.ajax({
        url: 'http://10.123.219.166:8001/getData',
        data: {
          cpy_key : curr_cpy_key,
          audit_id : curr_audit_id,
          file_name : "allData"
        },
        error: function() {
          console.log("Error occured")
          //$('#cmd_json_output').val('An error has occurred');
        },
        success: function(data) {
          var pretty = JSON.stringify(data, undefined, 4);
          all_data = data
          //console.log(pretty)
          //$('#cmd_json_output').val(pretty)
        },
        type: 'GET',
    });

  hrefString = "<div class='col-2'><button class='btn btn--large' style='float:right' id = 'excel' onclick='createReport(this.id)'>Download Excel Report</button></a></div>"
  hrefString1 = "<div class='col-2'><button class='btn btn--large' style='float:right' id = 'word' onclick='createReport(this.id)'>Download Word Report</button></a></div>"
  $("#downloadButtonRow").append(hrefString)
  $("#downloadButtonRow").append(hrefString1)
  createTable('device_exceptions_div','Audit Findings')
});


function createReport(id){
  if(id == "excel"){
    alert("Excel report will be generated and you will recieve a mail. Please allow upto 12 hours before raising issue with bgl-cx-bcs-audit@cisco.com")
    url_to_send = 'http://10.123.219.166:8001/getReport'
  }
  else if(id == "word"){
    alert("Word report will be generated and you will recieve a mail. Please allow upto 12 hours before raising issue with bgl-cx-bcs-audit@cisco.com")
    url_to_send = 'http://10.123.219.166:8001/getWordReport'

  }
    $.ajax({
      async:true,
      url: url_to_send,
      type: "GET",
      data: {
        cpy_key : curr_cpy_key,
        audit_id : curr_audit_id,
        audit_type : curr_audit_type,
        customer_name : curr_customer_name,
        email : user_email
      },

      error: function() {
        console.log("Error occured")
      },
      success: function(data) {
        var pretty = JSON.stringify(data, undefined, 4);
        //console.log("Inside getFromDB")
        toReturn = pretty
      },
  });

    $('#modal-large').show();
}



function populateAuditInfo(id){
  if(id == "audit_inventory_summary_div"){
    total_devices = curr_audit_information["Devices Attempted"]
    devices_passed = curr_audit_information["Devices Passed"]
    devices_failed = curr_audit_information["Devices Failed/Excluded"]
    devices_duplicated = curr_audit_information["Devices Duplicated"]
    total_device_percentage = 100
    pass_device_percentage = (parseInt(devices_passed) / parseInt(total_devices)) * 100
    failed_device_percentage = (parseInt(devices_failed) / parseInt(total_devices)) * 100
    duplicate_device_percentage = (parseInt(devices_duplicated) / parseInt(total_devices)) * 100


    line1 = '<div class = "row" style=" width:100%"> <div class="col-12"> <div class="subheader">Devices Attempted : '+total_devices+'</div><div class="progressbar progressbar--large progressbar--primary" data-percentage="'+total_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

    line2 = '<div class = "row" style="width:100%"> <div class="col-12"> <div class="subheader">Devices Passed : '+devices_passed+'</div><div class="progressbar progressbar--large progressbar--success" data-percentage="'+pass_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

    line3 = '<div class = "row" style="width:100%"> <div class="col-12"> <div class="subheader">Devices Failed : '+devices_failed+'</div><div class="progressbar progressbar--large progressbar--danger" data-percentage="'+failed_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

    line4 = '</br><div class = "row" style="width:100%"> <div class="col-12"> <div class="subheader">Devices Duplicated: '+devices_duplicated+'</div><div class="progressbar progressbar--large progressbar--warning-alt" data-percentage="'+duplicate_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

    divToAdd = line1 + line2 + line3 + line4
    $("#graph_row_1_container").empty()
    $("#graph_row_1_container").append(divToAdd)
    $("#audits_1_container").empty()
    $("#audits_2_container").empty()
    $("#audits_container").hide()

  }
  else if(id == "devices_health_overview_div"){
   line1 =  '<div class="timeline"><div class="timeline__item" style="height : 20%;"><div class="timeline__icon"><button class="btn btn--circle btn--success"><span class="icon-check"></span></button></div><div class="timeline__time">'+curr_audit_information["Collection End Time"]+'</div><div class="timeline__content"><div>Collection Period : '+curr_audit_information["Collection Period (Days)"]+'</div></div></div><div class="timeline__item" style="height : 20%;"><div class="timeline__icon"><button class="btn btn--circle btn--primary "></button></div><div class="timeline__time">'+curr_audit_information["Collection End Time"]+'</div><div class="timeline__content"><div>Collection End Time : '+curr_audit_information["Collection End Time"]+'</div></div></div><div class="timeline__item" style="height : 20%;"><div class="timeline__icon"><button class="btn btn--circle btn--secondary"></span></button></div><div class="timeline__time">'+curr_audit_information["Collection Start Time"]+' </div><div class="timeline__content"><div>Collection Start Time : '+curr_audit_information["Collection Start Time"]+' </div></div></div></div>'
    $("#graph_row_1_container").empty()
    $("#graph_row_1_container").append(line1)
    $("#audits_1_container").empty()
    $("#audits_2_container").empty()
    $("#audits_container").hide()
}

  else if (id == "device_exceptions_div") {

  total_devices = curr_audit_information["Devices Attempted"]
  devices_passed = curr_audit_information["Devices Passed"]
  devices_failed = curr_audit_information["Devices Failed/Excluded"]
  devices_duplicated = curr_audit_information["Devices Duplicated"]
  total_device_percentage = 100
  pass_device_percentage = (parseInt(devices_passed) / parseInt(total_devices)) * 100
  failed_device_percentage = (parseInt(devices_failed) / parseInt(total_devices)) * 100
  duplicate_device_percentage = (parseInt(devices_duplicated) / parseInt(total_devices)) * 100


  line1 = '<div class = "row" style=" width:100%"> <div class="col-12"> <div class="subheader">Devices Attempted : '+total_devices+'</div><div class="progressbar progressbar--large progressbar--primary" data-percentage="'+total_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

  line2 = '<div class = "row" style="width:100%"> <div class="col-12"> <div class="subheader">Devices Passed : '+devices_passed+'</div><div class="progressbar progressbar--large progressbar--success" data-percentage="'+pass_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

  line3 = '<div class = "row" style="width:100%"> <div class="col-12"> <div class="subheader">Devices Failed : '+devices_failed+'</div><div class="progressbar progressbar--large progressbar--danger" data-percentage="'+failed_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

  line4 = '</br><div class = "row" style="width:100%"> <div class="col-12"> <div class="subheader">Devices Duplicated: '+devices_duplicated+'</div><div class="progressbar progressbar--large progressbar--warning-alt" data-percentage="'+duplicate_device_percentage+'"><div class="progressbar__fill"></div></div></div> </div>'

  divToAdd = line1 + line2 + line3 + line4

  line1 =  '<div class="timeline"><div class="timeline__item" style="height : 20%;"><div class="timeline__icon"><button class="btn btn--circle btn--success"><span class="icon-check"></span></button></div><div class="timeline__time">'+curr_audit_information["Collection End Time"]+'</div><div class="timeline__content"><div>Collection Period : '+curr_audit_information["Collection Period (Days)"]+'</div></div></div><div class="timeline__item" style="height : 20%;"><div class="timeline__icon"><button class="btn btn--circle btn--primary "></button></div><div class="timeline__time">'+curr_audit_information["Collection End Time"]+'</div><div class="timeline__content"><div>Collection End Time : '+curr_audit_information["Collection End Time"]+'</div></div></div><div class="timeline__item" style="height : 20%;"><div class="timeline__icon"><button class="btn btn--circle btn--secondary"></span></button></div><div class="timeline__time">'+curr_audit_information["Collection Start Time"]+' </div><div class="timeline__content"><div>Collection Start Time : '+curr_audit_information["Collection Start Time"]+' </div></div></div></div>'
  // $("#audits_container").empty()
  // $("#audits_container").append()
  $("#audits_container").show()
  $("#audits_2_container").empty()
  $("#audits_2_container").append(line1)
  $("#audits_1_container").empty()
  $("#audits_1_container").append(divToAdd)

}
}

function clearNCEComment(){
  $('#NCE_Comment_textarea').val("")
}

function getTableDataDB(audit_id, file_name, table_name){

  var toReturn = ""

  $.ajax({
      async:false,
      url: 'http://10.123.219.166:8001/getTableDataDB',
      type: "GET",
      data: {
        cpy_key : curr_cpy_key,
        audit_id : curr_audit_id,
        file_name : file_name,
        table_name : table_name
      },

      error: function() {
        console.log("Error occured")
      },
      success: function(data) {
        var pretty = JSON.stringify(data, undefined, 4);
        //console.log("Inside getFromDB")
        toReturn = pretty
      },
  });
  return (JSON.parse(toReturn))
}


function getFromDB(audit_id, file_name){

  var toReturn = ""

  $.ajax({
      async:false,
      url: 'http://10.123.219.166:8001/getData',
      type: "GET",
      data: {
        cpy_key : curr_cpy_key,
        audit_id : curr_audit_id,
        file_name : file_name
      },
      beforeSend: function () {
        $("#table_container").empty();
        $("#table_container").append(loader_div);
      },
      complete: function () {
        $("#table_container").empty();
      },
      error: function() {
        console.log("Error occured")
      },
      success: function(data) {
        toReturn = data
        var pretty = JSON.stringify(data, undefined, 4);
        toReturn = pretty
      },
  });
  return (JSON.parse(toReturn))
}



function getTableData(jsonData){
  return_string = ""
  if(typeof(jsonData) !="object"){
    jsonData = JSON.parse(jsonData)
  }
  for(var i = 0; i < jsonData.length; i++){
    if(Object.keys(jsonData[0])[5] == "Exception Name"){
      row_start = '<tr name='+jsonData[i]["Row Number"]+' ondblclick=toggleCommentsDiv(this)>'
    }
    else{
      row_start = "<tr>"
    }

    row_end = "</tr>"
    row_string = ""

    Object.keys(jsonData[i]).forEach(function(key) {
        if(key == "Severity"){
          if(jsonData[i][key] == "Critical"){
            span1 = '<span class="label label--small label--primary">'+jsonData[i][key]+'</span>'
            var value = "<td>"+span1+"</td>"
          }
          else if(jsonData[i][key] == "High"){
            span1 = '<span class="label label--small label--danger">'+jsonData[i][key]+'</span>'
            var value = "<td>"+span1+"</td>"
          }
          else if(jsonData[i][key] == "Medium"){
            span1 = '<span class="label label--small label--warning">'+jsonData[i][key]+'</span>'
            var value = "<td>"+span1+"</td>"
          }
          else if(jsonData[i][key] == "Low"){
            span1 = '<span class="label label--small label--warning-alt">'+jsonData[i][key]+'</span>'
            var value = "<td>"+span1+"</td>"
          }
          else if(jsonData[i][key] == "Informational"){
            span1 = '<span class="label label--small label--success">'+jsonData[i][key]+'</span>'
            var value = "<td>"+span1+"</td>"
          }
        }
        else if(key == "Host Name (IP Address)"){
          var value = "<td><a onclick='getCommandData(this.name)'' name='"+jsonData[i][key]+"'>"+jsonData[i][key]+"</a></td>"
        }
        else if(key == "Table Name"){
          var value = "<td><a  onclick='return getTable(this.name);' name='"+jsonData[i][key]+"'>"+jsonData[i][key]+"</a></td>"
        }
        else if(key == "Device_Name"){
          var value = "<td><a href='"+jsonData[i]["NP_URL"]+"' target='_blank' name='"+jsonData[i][key]+"'>"+jsonData[i][key]+"</a></td>"
        }
        else if(key =="NP_URL"){
          return
        }
        else{
          var value = "<td>"+jsonData[i][key]+"</td>"
        }
      row_string = row_string + (value)

  });
    return_string = return_string+row_start+row_string+row_end
  }
  return(return_string)
}

function getTable(name){

  var html = ""
  var columns = []

  all_data = getTableDataDB(curr_audit_id , "allData", name)
  all_exceptions = getTableDataDB(curr_audit_id , "allExceptions", name)
  all_data= JSON.parse(all_data)
  all_exceptions = JSON.parse(all_exceptions)


  for(var i = 0; i < all_data.length; i++){
    for (var j = 0; j < all_exceptions.length; j++) {
      // console.log();
      if(all_data[i]["Table Name"] == all_exceptions[j]["Table Name"] && all_data[i]["Row Number"] == all_exceptions[j]["Row Number"] && all_data[i]["Column Name"] == all_exceptions[j]["Exception Name"] && all_data[i]["Column Value"] == all_exceptions[j]["Exception Value"]){
        all_data[i]["Severity"] = all_exceptions[j]["Severity"];
        break;

      }
    }

    }
    columns[0] = "Host Name (IP Address)"
    for (var i = 0; all_data[i]['Row Number']<2; i++) {
      // console.log(all_data[i]['Column Name']);
      columns[i+1]=all_data[i]['Column Name']

    }
    tablehead1 = `<table style="border-collapse:collapse;mso-pagination:widow-orphan;font-size:10pt;" width="0" cellspacing="0" cellpadding="4" bordercolor="#000000" border="1">
    <thead>
    <tr bgcolor="#CCCCCC"><td colspan=${columns.length} valign="Middle" align="Center">
    <font size="+2" color="#0000FF">${name}</font>
    </td>
    </tr>
    <tr bgcolor="#CCCCCC"><td rowspan="1" colspan="1" valign="BOTTOM" align="CENTER"><font color="#0000FF">
    <b>Host Name <br>(IP Address)</b></font></td>
    `
    var tableHeadings = ""
    for (var i = 1; i < columns.length; i++) {

      tableHeadings += '<td rowspan="1" colspan="1" valign="BOTTOM" align="CENTER"><font color="#0000FF"><b>'+columns[i]+'</b></font></td>'
    }
    tableHeadings += '</tr></thead>'
    numberofRows = all_data.length/(columns.length-1)


    var tablebody = "<tbody>"


    for (var i = 1; i <= numberofRows; i++) {

      tablebody += '<tr><td rowspan="1" colspan="1" valign="BOTTOM" align="CENTER"><font color="#0000FF"><b>'+all_data[(i-1)*(columns.length-1)]["Host Name (IP Address)"]+'</b></font></td>'

      // console.log(all_data[(i*3)]["Host Name (IP Address)"]);


      for (var j = 0; j < (columns.length-1); j++) {
        colour = ""
        if (all_data[j +(columns.length-1)*(i-1)]["Severity"]){
          if (all_data[j +(columns.length-1)*(i-1)]["Severity"]== "Critical"){
            colour = '#00BCEB'
          }
          if (all_data[j +(columns.length-1)*(i-1)]["Severity"]== "High"){
            colour = '#E2231A'
          }
          if (all_data[j +(columns.length-1)*(i-1)]["Severity"]== "Medium"){
            colour = '#FBAB18'
          }
          if (all_data[j +(columns.length-1)*(i-1)]["Severity"]== "Low"){
            colour = '#EED202'
          }
          if (all_data[j +(columns.length-1)*(i-1)]["Severity"]== "Informational"){
            colour = '#6ABF4B'
          }

        }


        tablebody += '<td style="background-color:'+colour+';"><b>'+all_data[j +(columns.length-1)*(i-1)]["Column Value"]+'</b></td>'
        // console.log(tablebody);
              }
      tablebody += '</tr>'
      // console.log(tablebody);
    }

    tablebody += '</tbody></table>'

    html = tablehead1 + tableHeadings + tablebody;


    var myWindow = window.open("");
    myWindow.document.write(html);



}

function getColumnString(jsonData){
  if(typeof(jsonData) !="object"){
    jsonData = JSON.parse(jsonData)
  }
  row_start = "<tr>"
  row_end = "</tr>"
  return_string = ""
  Object.keys(jsonData[0]).forEach(function(key) {
        if(key == "NP_URL"){
          return
        }else{
          var value = "<th class='sortable'>"+key+"<span class='sort-indicator icon-dropdown'></span></th>"
          return_string = return_string + (value)
        }

  });
  //comment = "NCE Comments"
  //return_string = return_string + "<th class='sortable'>"+key+"<span class='sort-indicator icon-dropdown'></span></th>"
  return(row_start+return_string+row_end)
}

function closeCommentwsDiv(){
  $("#comment_popup_div").toggle();
}


function otherNCECommentClose(){
  if($('#other_NCE_comments_div').is(':visible')){
      $("#other_NCE_comments_div").toggle();
}
}


function getNetRule(t_name, excp_name){

  var toReturn = ""
  $.ajax({
      async:true,
      url: 'http://10.123.219.166:8001/getNetRulefromDBv2',
      data: {
        company_key : curr_cpy_key,
        audit_id: curr_audit_id,
        audit_type : curr_audit_type,
        table_name : t_name,
        exception_name : excp_name
      },
      error: function() {
        console.log("Error occured")
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
        var pretty = JSON.stringify(data, undefined, 4);
        console.log(pretty)
        $("#net_rule_textarea").html(data["net_rule"])
        $("#net_advice_textarea").html(data["net_advice"])

      },
      type: 'GET',
  });
}


function old_getNetRule(t_name, excp_name){

  var toReturn = ""
  $.ajax({
      async:true,
      url: 'http://10.123.219.166:8001/getNetRulefromDB',
      data: {
        audit_type : curr_audit_type,
        table_name : t_name,
        exception_name : excp_name
      },
      error: function() {
        console.log("Error occured")
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
        var pretty = JSON.stringify(data, undefined, 4);
        console.log(pretty)
        $("#net_rule_textarea").html(data["net_rule"])
        $("#net_advice_textarea").html(data["net_advice"])

      },
      type: 'GET',
  });
}


function getRowData(table_name , row_number){
  row_data = {}

    $.ajax({
      async:false,
      type: 'GET',
      url: 'http://10.123.219.166:8001/getRowDetails',
      data: {
        cpy_key : curr_cpy_key,
        audit_id : curr_audit_id,
        table_name : table_name,
        row_number : row_number
      },
      error: function() {
        console.log("Error occured")
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
        all_d = JSON.parse(data);
      },
  });

  for(var j = 0 ; j < all_d.length ; j++){
      row_data[all_d[j]['Column Name']] = all_d[j]['Column Value']
  }

  $("#clicked_row_info_textarea").val('')
  if(Object.keys(row_data).length > 5){
    $("#clicked_row_info_textarea").attr('rows', 5)
  }else{
    $("#clicked_row_info_textarea").attr('rows', Object.keys(row_data).length)
  }
  row_data = JSON.stringify(row_data)
  row_data = row_data.replace(/[{}"]/g , '')
  row_data = row_data.replace(/:/g , '  :  ')
  $("#clicked_row_info_textarea").val(row_data.replace(/,/g , '\n'))
}


function changeDNRFlag(){

  if($("#dnr_button").is(":checked")){
    old_flag = "0"
    new_flag = "1"
  }
  else if(!$("#dnr_button").is(":checked")){
    old_flag = "1"
    new_flag = "0"
  }


  table_name = $('#table_name_container').find("a").attr("name")
  exception_name = $('#exception_name_container').html().split(":")[1].trim()


  $.ajax({
      async:false,
      url: 'http://10.123.219.166:8001/changeDNRFlag',
      data: {
        user_name : user_name,
        audit_id : curr_audit_id,
        company_key : curr_cpy_key,
        table_name : table_name,
        exception_name : exception_name,
        old_flag : old_flag,
        new_flag : new_flag,
        nms_area : $('#clicked_nms_area').html().split(":")[1].trim(),
        sev : $('#curr_sev span').text()
      },
      error: function() {
        alert("Failed changing DNR Flag")
        console.log("Error occured")
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
              $("#comment_popup_div").toggle();
              alert("Changed Do Not Report Flag Successfully for "+$('#exception_name_container').html())
              createTable('device_exceptions_div','Audit Findings')
      },
      type: 'GET',
    });

}

function changeSeverity(){
  table_name = $('#table_name_container').find("a").attr("name")
  exception_name = $('#exception_name_container').html().split(":")[1].trim()
  clicked_nms_area = $('#clicked_nms_area').html().split(":")[1].trim()
  var radioValue = $("input[name='sev_radio']:checked"). attr('id');

  radioValue = radioValue.split("_")[0]

  if($('#curr_sev span').text() != radioValue){
    $.ajax({
      async:false,
      url: 'http://10.123.219.166:8001/changeSev',
      data: {
        user_name : user_name,
        audit_id : curr_audit_id,
        company_key : curr_cpy_key,
        nms_area : clicked_nms_area,
        table_name : table_name,
        exception_name : exception_name,
        old_sev : $('#curr_sev span').text(),
        new_sev : radioValue
      },
      error: function() {
        alert("Failed changing severity")
        console.log("Error occured")
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
              $("#comment_popup_div").toggle();
              alert("Changed Severity Successfully for "+$('#exception_name_container').html())
              createTable('device_exceptions_div','Audit Findings')
      },
      type: 'GET',
    });
  }
  else{
    alert("Severity is unchanged. Please change the severity first")
  }

  //alert("Changing severity for "+$('#exception_name_container').html())
}


function toggleCommentsDiv(clicked_row){
  if($('#ext_view_button').is(":checked")){
      //No code required here. if exnternal view is enabled, no row clicking allowed
  }else{
    $('#table_name_container').empty()
    $('#table_name_container').append('Table Name : '+$(clicked_row).find("td").eq(0).html())
    $('#exception_name_container').empty()
    $('#exception_name_container').append('Exception : '+$(clicked_row).find("td").eq(5).html())
    $('#clicked_nms_area').empty()
    $('#clicked_nms_area').append('NMS Area : '+$(clicked_row).find("td").eq(4).html())
    $('#curr_sev').empty()
    $('#curr_sev').append('Current Severity : '+$(clicked_row).find("td").eq(3).html())
    $('#'+$('#curr_sev span').text()+"_checkbox_change_sev").prop("checked", true);
    if($(clicked_row).find("td").eq(9).html() == 0){
      $("#dnr_button").prop("checked", false)
    }
    else if($(clicked_row).find("td").eq(9).html() == 1){
      $("#dnr_button").prop("checked", true)
    }
    getNetRule($($(clicked_row).find("td").eq(0).html()).attr("name"), $(clicked_row).find("td").eq(5).html())
    getRowData($($(clicked_row).find("td").eq(0).html()).attr("name") , $(clicked_row).attr('name'))
    //getNetRule($(clicked_row).find("td").eq(0).html(), $(clicked_row).find("td").eq(5).html())
    //getRowData($(clicked_row).find("td").eq(0).html() , $(clicked_row).attr('name'))
    $('#NCE_Comment_textarea').val('')
    $('#NCE_Comment_textarea').val($(clicked_row).find("td").eq(8).html())
  $("#comment_popup_div").toggle();
  }
}


function showNCEComments(){
  $('#other_NCE_comments_div').toggle()
  if($('#other_NCE_comments_div').is(':visible')){
    $('#NCE_comments_table_name_container').empty()
    $('#NCE_comments_table_name_container').append($('#table_name_container').html())
    $('#NCE_comments_exception_name_container').empty()
    $('#NCE_comments_exception_name_container').append($('#exception_name_container').html())
    //add code to change the Do not report button to either checked or unchecked by checking backend / all exceptions data


    $('#NCE_comments_table_container').empty()
    table_start = "</br><table id='data_table' class='table table--striped table--loose table--fixed table--wrapped'>"
    table_end = "</table>"
    table_head_start ="<thead>"
    table_head_end = "</thead>"
    table_body_start = "<tbody>"
    table_body_end = "</tbody>"
    table_body = ""
        $.ajax({
      async:true,
      url: 'http://10.123.219.166:8001/getAllNCEComments',
      data: {
        audit_type : curr_audit_type,
        table_name : "t_name : "+$('#table_name_container').find("a").attr("name"),
        exception_name : $('#exception_name_container').html()
      },

      beforeSend : function(){
        $('#NCE_comments_table_container').empty()
        $('#NCE_comments_table_container').append(loader_div)
      },
      error: function() {
        console.log("Error occured")
        //$('#cmd_json_output').val('An error has occurred');
        table_body = "Some error occured. Please try again or contact administrator"
        var table = table_start+table_head_start+'<th>Customer Name</th><th>Severity</th><th>NCE Comment</th>'+table_head_end+table_body_start+table_body+table_body_end+table_end
        $('#NCE_comments_table_container').empty()
        $('#NCE_comments_table_container').append(table)
      },
      success: function(data) {

        for(var i = 0; i < data['result'].length; i++){
          table_body = table_body + '<tr><td>'+data['result'][i]['Customer_Name']+'</td>'+ '<td>'+data['result'][i]['Severity']+'</td>' + '<td>'+data['result'][i]['NCE_Comment']+'</td></tr>'

        }
        var pretty = JSON.stringify(data, undefined, 4);
        var table = table_start+table_head_start+'<th>Customer Name</th><th>Severity</th><th>NCE Comment</th>'+table_head_end+table_body_start+table_body+table_body_end+table_end
        $('#NCE_comments_table_container').empty()
        $('#NCE_comments_table_container').append(table)
        //console.log(pretty)
        //$('#cmd_json_output').val(pretty)
      },
      type: 'GET',
    });

  }
}

function updateFeedback(){
    var hours_saved = $('#hours_saved').val();
    var detailed_feedback = $('#detailed_feedback').val();
  

  $.ajax({
    async:false,
    url: 'http://10.123.219.166:8001/updateFeedback',
    data: {
      'user_name' : user_name,
      'cpy_key':curr_cpy_key,
      'audit_id':curr_audit_id,
      'hours_saved' : hours_saved,
      'detailed_feedback' : detailed_feedback,
      'company_PID' : 0
    },
    error: function(e) {
      alert("Error Occured : "+e)
      console.log("Error occured")
      //$('#cmd_json_output').val('An error has occurred');
    },
    success: function(data) {
      //alert("Comment uploaded successfully")
      closeModal('modal-large')
      //console.log("Successfully updated comment for "+table_name+" and exception "+exception_name)
      alert("Thank you for your valuable Feedback")

    },
    type: 'POST',
  });


}

function updateNCEComment(){
  var sevArr = ''
  if($("#All_checkbox").is(":checked")){
    sevArr = "All"
  }
  else{
    if($("#Critical_checkbox").is(":checked")){
      if(sevArr == ''){
        sevArr = sevArr+"Critical"
      }
      else{
        sevArr = sevArr+",Critical"
      }

    }
    if($("#High_checkbox").is(":checked")){
      if(sevArr == ''){
        sevArr = sevArr+"High"
      }
      else{
        sevArr = sevArr+",High"
      }
    }
    if($("#Medium_checkbox").is(":checked")){
      if(sevArr == ''){
        sevArr = sevArr+"Medium"
      }
      else{
        sevArr = sevArr+",Medium"
      }
    }
    if($("#Low_checkbox").is(":checked")){
      if(sevArr == ''){
        sevArr = sevArr+"Low"
      }
      else{
        sevArr = sevArr+",Low"
      }
    }
    if($("#Info_checkbox").is(":checked")){
      if(sevArr == ''){
        sevArr = sevArr+"Informational"
      }
      else{
        sevArr = sevArr+",Informational"
      }
    }
  }
  var comment = $('#NCE_Comment_textarea').val();
  var table_name = "t_name : "+$('#table_name_container').find("a").attr("name");
  var exception_name = $('#exception_name_container').html();

  //add code later to get severities selected by user

  $.ajax({
    async:false,
    url: 'http://10.123.219.166:8001/uploadComments',
    data: {
      'user_name' : user_name,
      'cpy_key':curr_cpy_key,
      'audit_id':curr_audit_id,
      'table_name': table_name,
      'exception_name' : exception_name,
      'severity' : sevArr,
      'comment' : comment
    },
    error: function(e) {
      alert("Error Occured : "+e)
      console.log("Error occured")
      //$('#cmd_json_output').val('An error has occurred');
    },
    success: function(data) {
      //alert("Comment uploaded successfully")
      $("#comment_popup_div").toggle();
      otherNCECommentClose();
      //console.log("Successfully updated comment for "+table_name+" and exception "+exception_name)
      alert("Successfully updated comment for "+table_name+" and exception "+exception_name)

      //$('#cmd_json_output').val(pretty)
    },
    type: 'POST',
  });

  //re-render the table with update comments
  createTable('device_exceptions_div','Audit Findings')


}


function filterTableFromNMSArea(clickedVal){
  $("#data_table").DataTable().search( '' ).columns().search( '' ).draw();

  if(clickedVal.includes("_")){
    searchstringArr = clickedVal.split("_")
    ss1 = searchstringArr[0]+" Management"
    ss2 = searchstringArr[1]
    $("#data_table").DataTable().columns(4).search( ss1 ).draw();
    $("#data_table").DataTable().columns(3).search( ss2 ).draw();
  }
  else{
    searchString = clickedVal + " Management"
    $("#data_table").DataTable().columns(4).search( searchString ).draw();
  }

}

function filterTableFromDropdown(clikedVal){
    $("#data_table").DataTable().search( '' ).columns().search( '' ).draw();


    if(clikedVal.options[clikedVal.selectedIndex].innerHTML =="All"){
      $("#dropdown_tables").val('0')
      $("#dropdown_exceptions").val('0')
      filterExceptions("All")
    }
    if(clikedVal.id == "dropdown_tables" && clikedVal.options[clikedVal.selectedIndex].innerHTML !="All"){
      $("#data_table").DataTable().column(0).search(clikedVal.options[clikedVal.selectedIndex].innerHTML).draw()
      filterExceptions(clikedVal.options[clikedVal.selectedIndex].innerHTML)
      //$("#dropdown_exceptions").val('0')

    }
    else if((clikedVal.id) == "dropdown_exceptions" && clikedVal.options[clikedVal.selectedIndex].innerHTML !="All"){
      if($("#dropdown_tables").children("option:selected").html() != "All"){
        $("#data_table").DataTable().column(0).search($("#dropdown_tables").children("option:selected").html()).draw()
      }
      $("#data_table").DataTable().column(5).search(clikedVal.options[clikedVal.selectedIndex].innerHTML).draw()
      //$("#dropdown_tables").val('0')

    }
}


function filterExceptions(tName){
  let exceptionList = new Set()
  exception_dropdown_string = ''
  all_E = JSON.parse(all_exceptions)
  for (var k = 0; k < all_E.length ; k++){
    if(all_E[k]["Table Name"] == tName){
      exceptionList.add(all_E[k]["Exception Name"])
    }
    else if(tName == "All"){
      exceptionList.add(all_E[k]["Exception Name"])
    }
  }
  exception_array = Array.from(exceptionList)
  exception_dropdown_string = '<option value ="0" selected>All</option>'
  for (var k = 0 ; k < exception_array.length ; k++){
    tableString = '<option value="'+(k+1)+'">'
    tableStringEnd = '</option>'
    exception_dropdown_string = exception_dropdown_string+tableString+exception_array[k]+tableStringEnd
  }
  $("#dropdown_exceptions").empty()
  $("#dropdown_exceptions").append(exception_dropdown_string)

}

function createTable(id,toDisplay){
  $("#top_exceptions_div").hide()
  $("#NP_data").hide()
  $("#cna_graph_div").hide()
  populateAuditInfo(id)
  $("#fccaps_severity_breakdown_row").hide()
  $("#dropdown_filter_row").hide()
  $("#displayPlaceHolder").empty()
  $("#displayPlaceHolder").append(toDisplay)
  table_start = "<table id='data_table' class='table table--striped table--loose table--fixed table--wrapped '>"
  table_end = "</table>"
  table_head_start ="<thead>"
  table_head_end = "</thead>"
  table_body_start = "<tbody>"
  table_column_name_string = ''
  table_body_end = "</tbody>"
  if(id == "audit_inventory_summary_div"){
    
    
    $("#cna_graph_div").show()

    software_table_data = getFromDB(curr_audit_id , "NPInventory")

    table_column_name_string = getColumnString(software_table_data)
    table_data_string = getTableData(software_table_data)

    chartjs_create_hardware_summary_graph("graph_row_2_container", hardware_summary_data)
    chartjs_create_software_summary_graph("graph_row_3_container", software_summary_data)
    

  }
  else if(id == "devices_health_overview_div"){
    all_exceptions = getFromDB(curr_audit_id , "allExceptions")
    $("#top_exceptions_div").show()
    $("#cna_graph_div").show()

    software_table_data = getFromDB(curr_audit_id , "NPInventory")

    table_column_name_string = getColumnString(software_table_data)
    table_data_string = getTableData(software_table_data)

    chartjs_create_hardware_summary_graph("graph_row_2_container", hardware_summary_data)
    chartjs_create_software_summary_graph("graph_row_3_container", software_summary_data)
    chartjs_top_ten_devices("graph_row_4_container" , all_exceptions)
    chartjs_top_ten_exceptions("graph_row_5_container" , all_exceptions)
  }
  else if(id == "device_exceptions_div"){
    textArea = '<div class="col-md-6"><div class="subheader">Inline</div><div class="form-group form-group--inline"><div class="form-group__text"><textarea id="NCECommentArea" class="textarea" rows="3"></textarea><label for="textarea-label-inline">Enter Comments</label></div></div></div>'
    all_exceptions = getFromDB(curr_audit_id , "allExceptions")
    let exception_set = new Set()
    let all_tables_set = new Set()
    let DNR_set = new Set()
    all_ex = []
    allE = JSON.parse(all_exceptions)

      for(var i = 0 ; i < allE.length ; i++){
        exception_set.add(allE[i]["Exception Name"])
        all_tables_set.add(allE[i]["Table Name"])
      }
      total_unique_exceptions = exception_set.size


    for(var k = 0 ; k < allE.length ; k++){
      if(allE[k]["DNR_Flag"] == "0"){
        all_ex.push(allE[k])
      }
      else{
        DNR_set.add(allE[k]["Exception Name"])
      }
    }
      $("#top_exceptions_div").show()
      chartjs_top_ten_devices("graph_row_4_container" , all_ex)
      chartjs_top_ten_exceptions("graph_row_5_container" , all_ex)


      configuration_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
      fault_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
      capacity_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
      performance_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
      security_management_sev = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0 , "Total" : 0}
      total_sev_data = {"Critical" : 0 , "High" : 0 , "Medium" : 0 , "Low" : 0 , "Informational" : 0}
      let s = new Set()
      for(var j = 0 ; j < all_ex.length ; j++){
      if(typeof (all_ex[j]) == "undefined"){
        console.log("Undefined NMS Area for : " + all_ex[j]);
      }
      else{
       if(s.has((all_ex[j]["Exception Name"]+","+all_ex[j]["Severity"]))){
        continue;
       }
       else{
       s.add(all_ex[j]["Exception Name"]+","+all_ex[j]["Severity"])

       if(all_ex[j]["NMS Area"] == "Fault Management"){
        fault_management_sev[all_ex[j]["Severity"]] = fault_management_sev[all_ex[j]["Severity"]] + 1;
        fault_management_sev["Total"] = fault_management_sev["Total"] + 1

        total_sev_data[all_ex[j]["Severity"]] = total_sev_data[all_ex[j]["Severity"]] + 1
      }
      else if(all_ex[j]["NMS Area"] == "Configuration Management"){
        configuration_management_sev[all_ex[j]["Severity"]] = configuration_management_sev[all_ex[j]["Severity"]] + 1;
        configuration_management_sev["Total"] = configuration_management_sev["Total"] + 1

        total_sev_data[all_ex[j]["Severity"]] = total_sev_data[all_ex[j]["Severity"]] + 1
      }
      else if(all_ex[j]["NMS Area"] == "Performance Management"){
        performance_management_sev[all_ex[j]["Severity"]] = performance_management_sev[all_ex[j]["Severity"]] + 1;
        performance_management_sev["Total"] = performance_management_sev["Total"] + 1

        total_sev_data[all_ex[j]["Severity"]] = total_sev_data[all_ex[j]["Severity"]] + 1
      }
      else if(all_ex[j]["NMS Area"] == "Capacity Management"){
        capacity_management_sev[all_ex[j]["Severity"]] = capacity_management_sev[all_ex[j]["Severity"]] + 1;
        capacity_management_sev["Total"] = capacity_management_sev["Total"] + 1

        total_sev_data[all_ex[j]["Severity"]] = total_sev_data[all_ex[j]["Severity"]] + 1
      }
      else if(all_ex[j]["NMS Area"] == "Security Management"){
        security_management_sev[all_ex[j]["Severity"]] = security_management_sev[all_ex[j]["Severity"]] + 1;
        security_management_sev["Total"] = security_management_sev["Total"] + 1

        total_sev_data[all_ex[j]["Severity"]] = total_sev_data[all_ex[j]["Severity"]] + 1
      }
      }
      }
    }
    //var gauge = '</br><div class="col-12 col-md-3 col-lg-2 text-center base-margin-bottom><div class="gauge gauge--large gauge--danger" data-percentage="100"><div class="gauge__circle"><div class="mask full"><div class="fill"></div></div><div class="mask half"><div class="fill"></div><div class="fill fix"></div></div></div><div class="gauge__inset"><div class="gauge__percentage">79</div></div></div><div class="gauge__label">Total Exceptions</div></div>'
    var gauge = '</br><div class="col-6 text-center base-margin-bottom"><div class="gauge gauge--large gauge--danger" style="margin:10%" data-percentage="100"><div class="gauge__circle"><div class="mask full"><div class="fill"></div></div><div class="mask half"><div class="fill"></div><div class="fill fix"></div></div></div><div class="gauge__inset"><div class="gauge__percentage">'+total_unique_exceptions+'</div></div></div><div class="gauge__label">Total Unique Exceptions</div></div>'
    var gauge1 = '</br></br></br></br><div class="col-6 text-center base-margin-bottom"><div class="gauge gauge--small gauge--success" style="margin:10%" data-percentage="100"><div class="gauge__circle"><div class="mask full"><div class="fill"></div></div><div class="mask half"><div class="fill"></div><div class="fill fix"></div></div></div><div class="gauge__inset"><div class="gauge__percentage">'+DNR_set.size+'</div></div></div><div class="gauge__label">Do Not Report Marked Exceptions</div></div>'


    $("#graph_row_1_container").empty()
    //(all_exceptions).length
    $("#graph_row_1_container").append(gauge)
    $("#graph_row_1_container").append(gauge1)
    table_column_name_string = getColumnString(all_exceptions)
    table_data_string = getTableData(all_exceptions)

    $("#total_fault_exceptions").empty()
    $("#total_fault_exceptions").append(fault_management_sev["Total"])
    $("#total_configuration_exceptions").empty()
    $("#total_configuration_exceptions").append(configuration_management_sev["Total"])
    $("#total_capacity_exceptions").empty()
    $("#total_capacity_exceptions").append(capacity_management_sev["Total"])
    $("#total_performance_exceptions").empty()
    $("#total_performance_exceptions").append(performance_management_sev["Total"])
    $("#total_security_exceptions").empty()
    $("#total_security_exceptions").append(security_management_sev["Total"])

    $("#Fault_Critical").empty()
    $("#Fault_Critical").append(fault_management_sev["Critical"])
    $("#Fault_High").empty()
    $("#Fault_High").append(fault_management_sev["High"])
    $("#Fault_Medium").empty()
    $("#Fault_Medium").append(fault_management_sev["Medium"])
    $("#Fault_Low").empty()
    $("#Fault_Low").append(fault_management_sev["Low"])
    $("#Fault_Info").empty()
    $("#Fault_Info").append(fault_management_sev["Informational"])

    $("#Configuration_Critical").empty()
    $("#Configuration_Critical").append(configuration_management_sev["Critical"])
    $("#Configuration_High").empty()
    $("#Configuration_High").append(configuration_management_sev["High"])
    $("#Configuration_Medium").empty()
    $("#Configuration_Medium").append(configuration_management_sev["Medium"])
    $("#Configuration_Low").empty()
    $("#Configuration_Low").append(configuration_management_sev["Low"])
    $("#Configuration_Info").empty()
    $("#Configuration_Info").append(configuration_management_sev["Informational"])

    $("#Capacity_Critical").empty()
    $("#Capacity_Critical").append(capacity_management_sev["Critical"])
    $("#Capacity_High").empty()
    $("#Capacity_High").append(capacity_management_sev["High"])
    $("#Capacity_Medium").empty()
    $("#Capacity_Medium").append(capacity_management_sev["Medium"])
    $("#Capacity_Low").empty()
    $("#Capacity_Low").append(capacity_management_sev["Low"])
    $("#Capacity_Info").empty()
    $("#Capacity_Info").append(capacity_management_sev["Informational"])

    $("#Performance_Critical").empty()
    $("#Performance_Critical").append(performance_management_sev["Critical"])
    $("#Performance_High").empty()
    $("#Performance_High").append(performance_management_sev["High"])
    $("#Performance_Medium").empty()
    $("#Performance_Medium").append(performance_management_sev["Medium"])
    $("#Performance_Low").empty()
    $("#Performance_Low").append(performance_management_sev["Low"])
    $("#Performance_Info").empty()
    $("#Performance_Info").append(performance_management_sev["Informational"])

    $("#Security_Critical").empty()
    $("#Security_Critical").append(security_management_sev["Critical"])
    $("#Security_High").empty()
    $("#Security_High").append(security_management_sev["High"])
    $("#Security_Medium").empty()
    $("#Security_Medium").append(security_management_sev["Medium"])
    $("#Security_Low").empty()
    $("#Security_Low").append(security_management_sev["Low"])
    $("#Security_Info").empty()
    $("#Security_Info").append(security_management_sev["Informational"])

    $("#fccaps_severity_breakdown_row").show()

    //rendering the dropdowns for table and exception
      all_tables_array = Array.from(all_tables_set).sort()
      exception_array = Array.from(exception_set).sort()
      $("#dropdown_tables").empty();
      table_dropdown_string = ''
      table_dropdown_string = '<option value ="0" selected>All</option>'

      for (var k = 0 ; k < all_tables_array.length ; k++){
        tableString = '<option value="'+(k+1)+'">'
        tableStringEnd = '</option>'
        table_dropdown_string = table_dropdown_string+tableString+all_tables_array[k]+tableStringEnd
      }
      $("#dropdown_tables").append(table_dropdown_string)


      $("#dropdown_exceptions").empty();
      exception_dropdown_string = ''
      exception_dropdown_string = '<option value ="0" selected>All</option>'
      for (var k = 0 ; k < exception_array.length ; k++){
        tableString = '<option value="'+(k+1)+'">'
        tableStringEnd = '</option>'
        exception_dropdown_string = exception_dropdown_string+tableString+exception_array[k]+tableStringEnd
      }
      $("#dropdown_exceptions").append(exception_dropdown_string)
      $("#dropdown_filter_row").show()


  }
  else if(id == "audit_data_div"){

  }
  table_data = table_start+table_head_start+table_column_name_string+table_head_end+table_body_start+table_data_string+table_body_end+table_end
  $("#table_container").empty()
  $("#table_container").append(table_data)
  $("#data_table").DataTable({dom: 'Bfrtip',
      buttons: [
          'excel','print'
      ]});

  if(id == "device_exceptions_div"){
      $("#data_table").DataTable().order(['3','asc']).draw();
      fccapsGraphData = {"Fault Management" : fault_management_sev["Total"], "Configuration Management" : configuration_management_sev["Total"], "Capacity Management" : capacity_management_sev["Total"], "Performance Management" : performance_management_sev["Total"], "Security Management" : security_management_sev["Total"]}
      //create_severity_summary_graph("graph_row_2_container", total_sev_data)
      chartjs_create_severity_summary_graph("graph_row_2_container", total_sev_data)
      chartjs_create_fccaps_bar_graph("graph_row_3_container" , fccapsGraphData)
      //create_fccaps_bar_graph("graph_row_3_container" , fccapsGraphData)
  }

}
