import * as React from 'react';
import { MenuItem, Button, Box, TextField, Typography } from '@mui/material';
import { Container } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import {ThreeDots} from 'react-loader-spinner';
// import {Button,ButtonColor} from '@cisco/react-cui';

export default function OldCNAAudit() {
  const [spinner, setSpinner] = React.useState(false); 
  const [cookies] = useCookies();
  const [companyKey, setCompanyKey] = React.useState('');
  const [cPid, setCPid]=React.useState('');
  const [CName, setCName]=React.useState('');
  const [Audit,setAudit]=React.useState('');
  const [auditOptions,setAuditOptions]=React.useState([]);
  const [auditType, setAuditType]=React.useState('');
  const [cecID]=React.useState(cookies.naa_email);

  const handleCkeyChange=(event)=>{
    setCompanyKey(event.target.value);
  }

  const handleCPidChange=(event)=>{
    setCPid(event.target.value);
  }

  const handleCNameChange=(event)=>{
    setCName(event.target.value);
  }

  const handleAuditChange=(event)=>{
    setAudit(event.target.value);
    fetch('http://auditanalysis.cisco.com:8001/getBasicInfo?'+ new URLSearchParams({
      cpy_key : companyKey,
      audit_id : event.target.value
    }))
    .then(res => res.json())
    .then(
        (result)=>{
          setAuditType(result.audit_type)
          console.log(result.audit_type)
           }
    )
    .catch((error)=>{
      alert(error)
      })
  }
  
  const handleATypeChange=(event)=>{
    setAuditType(event.target.value);
  }

  const getBasicInfo=(e)=>{
    e.preventDefault();
    e.preventDefault();
    fetch('http://auditanalysis.cisco.com:8001/getBasicInfo?'+ new URLSearchParams({
      cpy_key : companyKey,
      audit_id : "blank"
    }))
    .then(res => res.json())
    .then(
        (result)=>{
          setCName(result.customer_name)
          setAuditOptions(result.audit_ids)
          setCPid(result.customer_PID)
           }
    )
    .catch((error)=>{
    alert(error)
    })
  }

  const get_old_cna_audit=(e)=>{
    e.preventDefault();
    e.preventDefault();
    setSpinner(true);
    var data = new FormData();
    data.append("emp_cec_id_2", cecID);
    data.append("customer_key_prev", companyKey);
    data.append("audit_name_prev", Audit);
    data.append("customer_name_prev", CName);
    data.append("audit_type_prev", auditType);
    data.append("customer_PID_2", cPid);    
    
    fetch('http://auditanalysis.cisco.com:8001/getPreviousData', {
      method: 'POST',
      body: data,
      
    })
      .then(
        (result)=>{
          console.log(result['url'])
          window.location.href = result['url']
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
                  InputProps={{
            readOnly: true,
          }}
                  id="outlined-multiline-flexible"
                  label="Customer PID"
                  multiline
                  maxRows={4}
                  value={cPid}
                  onChange={handleCPidChange}
                />
                <div className='col'>
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Company Key"
                  multiline
                  type='number'
                  maxRows={4}
                  value={companyKey}
                  onChange={handleCkeyChange}
                />
                <br/>
                <button onClick={(e) => { getBasicInfo(e) }} style={{background:'none', border:'none', margin:0, padding:0, color:'#0175a2', cursor: 'pointer'}}>
                  Get Audits
                </button></div>                 
              </div>
              <div className='row'>
              <TextField
              required
                  InputProps={{
            readOnly: true,
          }}
                  id="outlined-multiline-flexible"
                  label="Customer Name"
                  multiline
                  maxRows={4}
                  value={CName}
                  onChange={handleCNameChange}
                />
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Select Audit"
                  value={Audit}
                  select
                  onChange={handleAuditChange}
                >
                    {auditOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              
              
                <TextField
                required
                  InputProps={{
            readOnly: true,
          }}
                  id="outlined-multiline-flexible"
                  label="Audit Type"
                  multiline
                  maxRows={4}
                  value={auditType}
                  onChange={handleATypeChange}
                />
                
              </div>
              <hr />
              <div className='row'>
                {/* <Button color={ButtonColor.Secondary} sx={{ml:'10px'}}> */}
                <Button onClick={(e) => { get_old_cna_audit(e) }} className='UploadButton' variant="contained" disabled={cecID.length < 1 ||companyKey.length < 1 ||Audit.length < 1 }>
                  Submit
                </Button>
               
              </div>
              
            </Box>
          </fieldset>
        </Container>
    </Box>
  );
}



