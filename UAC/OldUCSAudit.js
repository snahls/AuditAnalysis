import * as React from 'react';
import {MenuItem,Box,Typography,TextField,Button} from '@mui/material';
import { Container } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import {ThreeDots} from 'react-loader-spinner';




export default function OldUCSAudit() {
  const [spinner, setSpinner] = React.useState(false); 
  const [cookies] = useCookies();
  const [cName, setCName] = React.useState('');
  const [pid, setPID] = React.useState('');
  const [uniqueID, setUNIQUEID] = React.useState('');
  const [uidOptions, setUidOptions] = React.useState([]);
  

  const handleCNameChange=(event)=>{
    setCName(event.target.value);
  }

  const handlePIDChange=(event)=>{
    setPID(event.target.value);
  }

  const handleUniqueIDChange=(event)=>{
    setUNIQUEID(event.target.value);
  }

 

  const get_unique_id=(e)=>{
    e.preventDefault();
    e.preventDefault();
    var data = new FormData();
    data.append("name", cName);
    data.append("pid", pid);
    fetch('http://auditanalysis.cisco.com:8012/getUniqueIDs?',{
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
      .then(
        (result)=>{
          console.log(result)
          setUidOptions(result)
           }
    )
    .catch((error)=>{
    alert(error)
    })
  }

  const get_old_ucs_audit=(e)=>{
    e.preventDefault();
    e.preventDefault();
    setSpinner(true);
    var data = new FormData();
    data.append("uniqueIDs", uniqueID);
    data.append("customer_name", cName);
    data.append("customer_pid", pid);
    data.append("source", 'UNIframework');
    data.append("isOldAudit", 'true');
    fetch('http://auditanalysis.cisco.com:8012/overviewpage', {
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
      .then(
        (result)=>{
          console.log(result)
          window.location.href = `http://auditanalysis.cisco.com:8012/overviewpage?db_name=${result[0].db_name}&customer_name=${result[0].customer_name}&pid=${result[0].pid}&uid=${result[0].uid}&token=${cookies.naa_auth}&username=${cookies.naa_User}&useremail=${cookies.naa_email}`
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
          Open Previous Audit
        </Typography>
        <hr />
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
                  required
                  id="outlined-multiline-flexible"
                  label="Customer Name"
                  multiline
                  maxRows={4}
                  value={cName}
                  onChange={handleCNameChange}
                />
                <div className='col'>
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Customer PID"
                  multiline
                  maxRows={4}
                  value={pid}
                  onChange={handlePIDChange}
                /><br/>
                <button onClick={(e) => { get_unique_id(e) }} style={{background:'none', border:'none', margin:0, padding:0, color:'#0175a2', cursor: 'pointer'}}>
                  Get Unique ID
                </button></div>
              </div>
              <div className='row'>
              <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Select Unique ID"
                  value={uniqueID}
                  select
                  onChange={handleUniqueIDChange}
                >
                    {uidOptions.map((option) => (
                      <MenuItem key={option.uniqueID} value={option.uniqueID}>{option.uniqueID}</MenuItem>
                  ))}
                </TextField>
              </div>
              <hr />
              <div className='row'>
                {/* <Button onClick={(e) => { get_old_ucs_audit(e) }} className='UploadButton' color={ButtonColor.Secondary} sx={{ml:'10px'}}> */}
                <Button onClick={(e) => { get_old_ucs_audit(e) }} className='UploadButton' variant="contained" disabled={uniqueID.length < 1}>
                  Submit
                </Button>
              </div>
              
            </Box>
          </fieldset>
        </Container>
    </Box>
  );
}



