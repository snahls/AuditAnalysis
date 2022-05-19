user_name = ""
user_email = ""

$(document).ready(function(){

user_name = document.cookie.match(new RegExp('(^| )' + "naa_User" + '=([^;]+)'))[2];
user_email = document.cookie.match(new RegExp('(^| )' + "naa_email" + '=([^;]+)'))[2];
localStorage.setItem("bearer_token" , document.cookie.split(';')[2].split("=")[1])
user_email = user_email.replace(/"/g, "");
$("#emp_cec_id").val(user_email)
$("#emp_cec_id_2").val(user_email)

$("#naa_user_name").text("Hi "+user_name)

audit_types = "<option value='Other' selected readonly>Other</option>"
$("#audit_type_dropdown").html(audit_types)

});

function getBasicInfo(){
  company_key = $("#customer_key_prev").val()
  $.ajax({
      async:false,
      url: 'http://10.123.219.166:8001/getBasicInfo',
      data: {
        cpy_key : company_key,
        audit_id : "blank"
      },
      error: function() {
        console.log("Error occured")
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
        $("#customer_name_prev").val(data['customer_name'])
        $("#customer_PID_2").val(data['customer_PID'])
        append_audit_id = "<option value='' selected disabled hidden>Choose Audit</option>"
        for(var i = 0 ; i < data['audit_ids'].length ; i++){
          append_audit_id = append_audit_id + "<option value='"+data['audit_ids'][i]+"'>"+data['audit_ids'][i]+"</option>"
        }
        $("#audit_selector").html(append_audit_id)
        var pretty = JSON.stringify(data, undefined, 4);
        //console.log("Inside getFromDB")
        console.log(pretty)
        //$('#cmd_json_output').val(pretty)


      },
      type: 'GET',
  });
}

function getgroupname(){
  company_key = $("#customer_key").val()
  console.log(document.cookie.split(';')[0].split("=")[1])
  $.ajax({
      async:false,
      url: 'https://mimir-prod.cisco.com/api/mimir/np/groups?cpyKey='+company_key,
      contentType: 'application/json',
    beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("bearer_token"))
        },
      error: function() {
        console.log("Error occured")
        show_login_modal()
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
        d = data["data"]
        console.log(data["meta"]["attributes"]["attributes"]["cpyName"])
        CompanyName = data["meta"]["attributes"]["attributes"]["cpyName"]
        append_groups = "<option value='1' selected >Choose Group</option>"
        for(var i = 0 ; i < d.length ; i++){
          append_groups = append_groups + "<option value='"+d[i]["groupId"]+"'>"+d[i]["groupName"]+"</option>"

        }
        $("#group_selector").html(append_groups)
        $('#customer_name').val(CompanyName)

        $('#submitBtn').removeAttr("disabled");
      },
      type: 'GET',
  });
}


function getAuditInfo(selected_audit){
  company_key = $("#customer_key_prev").val()
  a_id = selected_audit
  $.ajax({
      async:false,
      url: 'http://10.123.219.166:8001/getBasicInfo',
      data: {
        cpy_key : company_key,
        audit_id : a_id
      },
      error: function() {
        console.log("Error occured")
        alert("Company key not found in database. Please contact bgl-cx-bcs-audit@cisco.com")
        //$('#cmd_json_output').val('An error has occurred');
      },
      success: function(data) {
        $("#audit_type_prev").val(data['audit_type'])
        var pretty = JSON.stringify(data, undefined, 4);
        //console.log("Inside getFromDB")
        console.log(pretty)
        //$('#cmd_json_output').val(pretty)


      },
      type: 'GET',
  });
}
