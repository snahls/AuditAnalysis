bearer_token = ""
is_success = 0
device_id = ""
cluster = "us"


function show_login_modal(){
  openModal('modal-small')
}

function authenticateUser(){
	userID = encodeURIComponent($("#cec_id").val())
	pwd = encodeURIComponent($("#pwd").val())
	$("#cec_id").val("")
	$("#pwd").val("")
	closeModal('modal-small')
	$.ajax({
        async:false,
   			url: 'https://mimir-prod.cisco.com/api/mimir/auth/login?userid='+userID+'&password='+pwd,
   			type: 'POST',
   			contentType: 'application/json',
   			success: function (result) {
      			bearer_token = result["data"][0]["access_token"]
            localStorage.setItem("bearer_token" , bearer_token)
      			alert("User Authenticated. Please try clicking on the link again")
   			},
   			error: function (error) {
   				console.log(error)
   				alert("Error authenticating, please try again")
          show_login_modal()
   			}
	});
}

function getDeviceID(device_ip){

      $.ajax({
          async:false,
          url: 'https://mimir-prod.cisco.com/api/mimir/np/device_details',
          type: 'GET',
          contentType: 'application/json',
          beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("bearer_token"))
            },
          data:{
            cpyKey : curr_cpy_key,
            deviceIp : device_ip
          },
          success: function (result) {
            if(result["data"].length !=0){
              device_id = result["data"][0]["deviceId"]
              cluster = result["meta"]["attributes"]["attributes"]["clusterName"]
            }
            else{
              device_id = -1
            }
          },
          error: function (error) {
            alert("Failed to fetch data from NP")
            console.log(error)
            device_id = -1
            
            
          }
      });
}
function getCommandData(name){

  var device_ip = name.split("(")[1].split(")")[0]
  var device_name = name.split("(")[0]
  getDeviceID(device_ip)
  if(device_id != -1){
        URL_to_open = "https://netprofile-us.cisco.com/netprofile/deviceProfile.do?custId=&device="+device_name+"&cpyKey="+curr_cpy_key+"&grpId=0&deviceId="+device_id
        var new_window = window.open(URL_to_open)
	}   

	else{
		alert("Error occured.")
    show_login_modal()

	}
}