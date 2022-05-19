import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
//import Button from '@mui/material/Button';
import { Container } from 'react-bootstrap';
// import {Button,ButtonColor} from '@cisco/react-cui';
import Button from '@mui/material/Button';
import { useCookies } from "react-cookie";
import {ThreeDots} from 'react-loader-spinner';



export default function NewUCSAudit() {
  const [cookies] = useCookies();
  const [name, setName] = React.useState('');
  const [pid, setPID] = React.useState('');
  const [uniqueID, setUNIQUEID] = React.useState('');
  const [spinner, setSpinner] = React.useState(false);  
  const [fName, setFName] = React.useState(''); 
  const [eror,setEror] = React.useState(false);
  
  const uid=React.useRef('');

  React.useEffect(()=>{
    uid.current=uniqueID;
    var data = new FormData();
    var b=false;
    data.append("name", name);
    data.append("pid", pid);
    fetch('http://auditanalysis.cisco.com:8012/getUniqueIDs?',{
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
      .then(
        (res)=>{
          for (var i=0; i < res.length; i++) {
            if (res[i].uniqueID === uid.current){
              b=true;
              break;
            }
            else{
              b=false;
            }  
        }
        setEror(b);
           }
    )
  },[name,pid,uniqueID])

  const handleNameChange=(event)=>{
    setName(event.target.value);
  }

  const handlePIDChange=(event)=>{
    setPID(event.target.value);
  }

  const handleUniqueIDChange=(event)=>{
    setUNIQUEID(event.target.value);
  }

  const handleUpload=(event)=>{
    setFName(event.target.files[0]);
  }

  const new_uad_audit_upload=(e)=>{
    e.preventDefault();
    setSpinner(true);
    var data = new FormData();
    var filedata = document.querySelector('input[type="file"]').files[0];
    data.append("zipfile", filedata,filedata.name);
    data.append("customer_uniqueID", uniqueID);
    data.append("customer_name", name);
    data.append("customer_pid", pid);
    data.append("source", 'UNIframework');
    data.append('user_email',cookies.naa_email)
    fetch('http://auditanalysis.cisco.com:8012/overviewpage', {
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
      .then(
        (result)=>{
          console.log(result)
          if(result[0].exist){
            alert('Please provide another uniqueID')
          }
          else{
          window.location.href = `http://auditanalysis.cisco.com:8012/overviewpage?db_name=${result[0].db_name}&customer_name=${result[0].customer_name}&pid=${result[0].pid}&uid=${result[0].uid}&token=${cookies.naa_auth}&username=${cookies.naa_User}&useremail=${cookies.naa_email}`
          }
          setSpinner(false);
        }
    )
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
        <Container xs={6} style={{marginLeft:'6%','marginTop':'2%'}}>
          <fieldset>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25%' },
              }}
              noValidate
              autoComplete="off"
            >
              <div className='row'>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Customer Name"
                  multiline
                  maxRows={4}
                  value={name}
                  onChange={handleNameChange}
                />
                <TextField
                  id="outlined-multiline-flexible"
                  label="Customer PID"
                  multiline
                  maxRows={4}
                  value={pid}
                  onChange={handlePIDChange}
                />
              </div>
              <div className='row'>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Unique ID"
                  multiline
                  maxRows={4}
                  value={uniqueID}
                  onChange={handleUniqueIDChange}
                />
                <input
                  style={{ display: 'hidden',marginTop:'20px', marginLeft:'10px' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  accept=".zip"
                  onChange={handleUpload}
                />
                {/* <label htmlFor="raised-button-file">
                  <Button variant="raised" component="span">
                    Upload
                  </Button>
                </label> */}
                
              </div>
              <div className='row'>
              {eror && <div id="error"><label style={{color: 'red'}}>This unique id already exist for this Customer name and PID</label></div>}
              </div>
              <hr />
              <div className='row'>
              {/* <Button onClick={(e) => { new_uad_audit_upload(e) }} className='UploadButton' color={ButtonColor.Secondary} sx={{ml:'10px'}}> */}
              <Button onClick={(e) => { new_uad_audit_upload(e) }} className='UploadButton' variant="contained" disabled={name.length < 1 ||pid.length < 1||uniqueID.length < 1 || fName.length < 1 || eror > 0 }>
                Upload
              </Button>
              {/* <Button variant="contained" endIcon= >
                Upload
              </Button> */}
              </div>
              
            </Box>
          </fieldset>
        </Container>
    </Box>
  );
}



