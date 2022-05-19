import * as React from 'react';
import {Box,Typography,TextField,Button,MenuItem} from '@mui/material';
import { Container } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import $ from 'jquery';
import {ThreeDots} from 'react-loader-spinner';
import { Link } from 'react-router-dom';
// import {Button,ButtonColor} from '@cisco/react-cui';


export default function NewCNAAudit() {
  const [spinner, setSpinner] = React.useState(false); 
  const [cookies] = useCookies();
  const [cPid, setCPid]=React.useState('');
  const [topID, setTopID] = React.useState('');
  const [cKey, setCKey] = React.useState('');  
  const [cName, setCName] = React.useState('');
  const [group, setGroup] = React.useState(1);
  const [groupOptions,setGroupOptions]=React.useState([]);  
  const [auditID, setAuditID] = React.useState('');
  const [grp,setGrp] = React.useState('[]');
  const [fName, setFName] = React.useState('');
  const [cecID]=React.useState(cookies.naa_email);

  
  localStorage.setItem("token", cookies.naa_auth);

  const handleTopIDChange=(event)=>{
    setTopID(event.target.value);
  }

  const handleCPidChange=(event)=>{
    setCPid(event.target.value);
  }

  const handleCKeyChange=(event)=>{
    setCKey(event.target.value);
  }

  const handleCNameChange=(event)=>{
    setCName(event.target.value);
  }

  const handleUpload=(event)=>{
    setFName(event.target.files[0]);
  }

  const handleGroupChange=(event)=>{
    setGrp('')
    setGroup(event.target.value);
    fetch('https://mimir-prod.cisco.com/api/mimir/np/device_details?'+ new URLSearchParams({
      cpyKey : cKey,
      groupId: event.target.value
  }),{
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization": "Bearer "+localStorage.getItem('token')
        },
      
      })
     .then(res => {
       if (!res.ok) {
         throw new Error('Network response was not OK');
       }
       return res.json();
     }) 
    .then(
        (result)=>{
          console.log((result['data']))
          setGrp(JSON.stringify(result['data']))
           }
    )
    .catch((error)=>{
    console.log(error)
    })
  }

  const handleAuditIDChange=(event)=>{
    setAuditID(event.target.value);
  }

  const openModal=(id)=>{
    $('#modal-backdrop').removeClass('hide');
    $('#' + id).before('<div id="' + id + '-placeholder"></div>').detach().appendTo('body').removeClass('hide');
}
const closeModal=(id)=>{
    $('#' + id).detach().prependTo(('#' + id + '-placeholder')).addClass('hide');
    $('#modal-backdrop').addClass('hide');
}

  const authenticateUser=(e)=>{
  const userID = encodeURIComponent($("#cec_id").val())
	const pwd = encodeURIComponent($("#pwd").val())
	$("#cec_id").val("")
	$("#pwd").val("")
  closeModal('modal-small')

  fetch('https://mimir-prod.cisco.com/api/mimir/auth/login?userid='+userID+'&password='+pwd,{
      method:'POST',
      headers : {
        'Content-Type': 'application/json'
        },      
      })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not OK');
      }
      return res.json();
    })
    .then(
        (result)=>{
          localStorage.setItem('token' , result["data"][0]["access_token"])
      		alert("User Authenticated. Please try clicking on the link again")
          console.log(result)
           }
    )
    .catch((error)=>{
      console.log(error)
      alert("Error authenticating, please try again")
      openModal('modal-small')
    })
  
  }
  const getgroupname=(e)=>{
    e.preventDefault();
    e.preventDefault();
    fetch('https://mimir-prod.cisco.com/api/mimir/np/groups?'+ new URLSearchParams({
      cpyKey : cKey,
  }),{
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization": "Bearer "+localStorage.getItem('token')
        },
      
      })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not OK');
      }
      return res.json();
    }) 
    .then(
        (result)=>{
          console.log(result)
          setCName(result["meta"]["attributes"]["attributes"]["cpyName"])
          setGroupOptions(result['data'])
           }
    )
    .catch((error)=>{
    setCName('')
    setGroupOptions([])
    openModal('modal-small')
    })
  }

  const new_cna_audit_upload=(e)=>{
    e.preventDefault();
    e.preventDefault();
    setSpinner(true);
    var data = new FormData();
    var filedata = document.querySelector('input[type="file"]').files[0];
    data.append("zipfile", filedata,filedata.name);
    data.append("emp_cec_id", cecID);
    data.append('top_id',topID)
    data.append("customer_name", cName);
    data.append("customer_key", cKey);
    data.append("audit_id", auditID);    
    data.append("audit_type_dropdown_name", 'Other');
    data.append("group_id", group);    
    data.append("customer_PID", cPid);
    data.append('group_info',grp);  
    
    fetch('http://auditanalysis.cisco.com:8001/upload', {
      method: 'POST',
      body: data,
      
    })
    // alert('You will receive a mail after uploading is done')
      .then(
        (result)=>{
          window.location.href = result['url']
          setSpinner(false);
        })
      .catch((error)=>{
          alert('Something went wrong.. Try again later')
          setSpinner(false);
          })
  }


  return (
    <Box >
      {spinner && <ThreeDots color='#000'/>}
      <Typography variant="h4" component="h1" sx={{ml:'20px',mt:2}} style={{marginTop:60}}>
          Upload New Audit
          <hr />
        </Typography>
        <div className="modal modal--small hide" id="modal-small">
    <div className="modal__dialog">
        <div className="modal__content">
            <Link to='#' className="modal__close" onClick={()=>closeModal('modal-small')}><span className="icon-close"></span></Link>
            <div className="modal__header">
                <div className="modal__title">Login details for NP</div>
            </div>
          
            <div className="modal__body">
               <p className="subtitle">Enter CEC Credentials</p>
               CEC ID : &nbsp;&nbsp;&nbsp;&nbsp; <input type="text" size="25" id="cec_id"></input>
           <br/>
           <br/>
           <br/>
               Password : &nbsp;&nbsp; <input type="password" size="25" id="pwd"></input>
            </div>
            <div className="modal__footer">
                <button className="btn" onClick={(e) => {authenticateUser(e)}}>Submit</button>
            </div>
        </div>
    </div>
</div>
        
        <Container xs={12} style={{marginLeft:'6%','marginTop':'2%'}}>
          <fieldset>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25%'},
              }}
              noValidate
              autoComplete="off"
            >
              <div className='row'>
                <TextField
                required
                  InputProps={{
            readOnly: true,
          }}
                  id="outlined-multiline-flexible"
                  label="CEC ID"
                  multiline
                  maxRows={4}
                  value={cecID}
                />
                <TextField
                required
                  id="outlined-multiline-flexible"
                  label="TOP ID"
                  multiline
                  type='number'
                  maxRows={4}
                  value={topID}
                  onChange={handleTopIDChange}
                />
                <div className='col'>
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Company Key"
                  multiline
                  type='number'
                  maxRows={4}
                  value={cKey}
                  onChange={handleCKeyChange}
                />
                <br/>
                <button onClick={(e) => { getgroupname(e) }} style={{background:'none', border:'none', margin:0, padding:0, color:'#0175a2', cursor: 'pointer'}}>
                 Get Customer Details
                </button></div>
              </div>
              <div className='row'>
              <TextField
              required
                  id="outlined-multiline-flexible"
                  label="Customer PID"
                  multiline
                  maxRows={4}
                  value={cPid}
                  onChange={handleCPidChange}
                />
                <TextField
                required
                  InputProps={{
            readOnly: true,
          }}
                  id="outlined-multiline-flexible"
                  label="Customer Name"
                  multiline
                  maxRows={4}
                  value={cName}
                  onChange={handleCNameChange}
                />
                <TextField
                  id="outlined-multiline-flexible"
                  label="Select Group"
                  select
                  maxRows={4}
                  value={group}
                  onChange={handleGroupChange}
                >
                    {groupOptions.map((option) => (
                    <MenuItem key={option.groupId} value={option.groupId}>{option.groupName}</MenuItem>
                  ))}
                </TextField>
                
              </div>
              <div className='row'>
              <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Audit ID"
                  multiline
                  type='number'
                  maxRows={4}
                  value={auditID}
                  onChange={handleAuditIDChange}
                />
                <TextField
                required
                  InputProps={{
            readOnly: true,
          }}
                  id="outlined-multiline-flexible"
                  label="Audit Type"
                  multiline
                  maxRows={4}
                  value='Other'
                />
                <input
                  required
                  style={{ display: 'hidden',marginTop:'20px', marginLeft:'10px' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  accept=".zip"
                  onChange={handleUpload}
                />
                
              </div>
              <hr />
              <div className='row'>
              {/* <Button color={ButtonColor.Secondary} sx={{ml:'10px'}}> */}
              <Button onClick={(e) => { new_cna_audit_upload(e) }} className='UploadButton' variant="contained" disabled={topID.length < 1 ||auditID.length < 1 ||cPid.length < 1 ||cKey.length < 1 ||grp.length < 1 || cName.length < 1 || fName.length < 1 || cecID.length < 1}>
                Upload
              </Button>
              </div>
              
            </Box>
          </fieldset>
        </Container>
    </Box>
  );
}

