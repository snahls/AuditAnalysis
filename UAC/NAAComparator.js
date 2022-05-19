import * as React from 'react';
import { MenuItem, Button, Box, TextField, Typography } from '@mui/material';
import { Container } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import {ThreeDots} from 'react-loader-spinner';
// import {Button,ButtonColor} from '@cisco/react-cui';

export default function NAAComparator() {
  const [spinner, setSpinner] = React.useState(false); 
  const [cookies] = useCookies();
  const [companyKey, setCompanyKey] = React.useState('');
  const [topId, setTopId]=React.useState('');
  const [CName, setCName]=React.useState('');
  const [Audit1,setAudit1]=React.useState('');
  const [Audit2,setAudit2]=React.useState('');
  const [cecID]=React.useState(cookies.naa_email);
  const [auditOptions,setAuditOptions]=React.useState([]);

  const handleCkeyChange=(event)=>{
    setCompanyKey(event.target.value);
  }

  const handleTopIdChange=(event)=>{
    setTopId(event.target.value);
  }

  const handleCNameChange=(event)=>{
    setCName(event.target.value);
  }

  const handleAudit1Change=(event)=>{
    setAudit1(event.target.value);
  }
  
  const handleAudit2Change=(event)=>{
    setAudit2(event.target.value);
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
           }
    )
    .catch((error)=>{
    alert(error)
    })
  }

  
  const cna_comp_audit=(e)=>{
    e.preventDefault();
    e.preventDefault();
    setSpinner(true);
    var data = new FormData();
    data.append("cec_id", cecID);
    data.append("cpy_key", companyKey);
    data.append("audit1_id", Audit1);
    data.append("cname", CName);
    data.append("audit2_id", Audit2);
    data.append("top_id", topId);    
    
    fetch('http://auditanalysis.cisco.com:8020/api/upload', {
      method: 'POST',
      body: data,
      
    })
    .then((res => res.json()))
      .then(
        (result)=>{
            var status = result.status;
            if(status === "true"){
                console.log(result)
                window.location.href = `http://auditanalysis.cisco.com:4000/load/data?cpykey=${companyKey}&a1=${Audit1}&a2=${Audit2}&cname=${CName}`
            
            }
            else{
                alert('Please check details entered')
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
          NAA Comparator
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
                  id="outlined-multiline-flexible"
                  label="Top ID"
                  multiline
                  maxRows={4}
                  value={topId}
                  onChange={handleTopIdChange}
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
              label="Select Audit-1 ID"
              multiline
              maxRows={4}
              value={Audit1}
              select
              onChange={handleAudit1Change}>
                {auditOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
              </TextField>
            
            <TextField      
            required        
              id="outlined-multiline-flexible"
              label="Select Audit-2 ID"
              multiline
              maxRows={4}             
              value={Audit2}
              select
              onChange={handleAudit2Change}>
                    {auditOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                  </TextField>                     
                
              </div>
              <hr />
              <div className='row'>
                {/* <Button color={ButtonColor.Secondary} sx={{ml:'10px'}}> */}
                <Button onClick={(e) => { cna_comp_audit(e) }} className='UploadButton' variant="contained" disabled={cecID.length < 1 || topId.length < 1 || companyKey.length < 1 || CName.length < 1 || Audit1.length < 1 || Audit2.length < 1 }>
                  Submit
                </Button>
               
              </div>
              
            </Box>
          </fieldset>
        </Container>
    </Box>
  );
}



