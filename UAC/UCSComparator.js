import * as React from 'react';
import {MenuItem,Box,Typography,TextField,Button} from '@mui/material';
import { Container } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import {ThreeDots} from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';


export default function UCSComparator() {
  const navigate = useNavigate();
  const [spinner, setSpinner] = React.useState(false); 
  const [cookies] = useCookies();
  const [cName, setCName] = React.useState('');
  const [pid, setPID] = React.useState('');
  const [uniqueID, setUNIQUEID] = React.useState('');
  const [uidOptions, setUidOptions] = React.useState([]);
  const [cName2, setCName2] = React.useState('');
  const [pid2, setPID2] = React.useState('');
  const [uniqueID2, setUNIQUEID2] = React.useState('');
  const [uidOptions2, setUidOptions2] = React.useState([]);

  const handleCNameChange=(event)=>{
    setCName(event.target.value);
  }

  const handlePIDChange=(event)=>{
    setPID(event.target.value);
  }

  const handleUniqueIDChange=(event)=>{
    setUNIQUEID(event.target.value);
  }

  const handleCName2Change=(event)=>{
    setCName2(event.target.value);
  }

  const handlePID2Change=(event)=>{
    setPID2(event.target.value);
  }

  const handleUniqueID2Change=(event)=>{
    setUNIQUEID2(event.target.value);
  }

 

  const get_unique_id=(e)=>{
    e.preventDefault();
    e.preventDefault();

    var data = new FormData();
    data.append("name", cName);
    data.append("pid", pid);

    var data2 = new FormData();
    data2.append("name", cName2);
    data2.append("pid", pid2);

    fetch('http://auditanalysis.cisco.com:8012/getUniqueIDs?',{
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
      .then(
        (result)=>{
          console.log(result)
          setUidOptions(result)
          if (result.length === 0) {
            alert("Audit 1 : Invalid credentials entered.")
          }
           }
    )
    .catch((error)=>{
    alert(error)
    })

   
    fetch('http://auditanalysis.cisco.com:8012/getUniqueIDs?',{
      method: 'POST',
      body: data2,
    })
    .then(res => res.json())
      .then(
        (result)=>{
          console.log(result)
          setUidOptions2(result)
          if (result.length === 0) {
            alert("Audit 2 : Invalid credentials entered.")
          }
           }
    )
    .catch((error)=>{
    alert(error)
    })
  }

  const get_ucs_comp=(e)=>{
    e.preventDefault();
    setSpinner(true);
    const edit_name1 = cName.replace(/\s+/g, ""); // to remove the space from db
    const dbName1 =  `UCS_DB_` + edit_name1 + `_` + pid + `_` + uniqueID;
  
    const edit_name2 = cName2.replace(/\s+/g, ""); // to remove the space from dbs
    const dbName2 = `UCS_DB_` + edit_name2 + `_` + pid2 + `_` + uniqueID2;

    var data = new FormData();
    data.append("db1", dbName1);
    data.append("db2", dbName2);
    data.append('user_email',cookies.naa_email)

    fetch('http://auditanalysis.cisco.com:8012/comparedb', {
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
    .then(
        (result)=>{
          console.log(result)
          if(!result){
            alert('Please check the details entered')
          }
          else{
            navigate(`/${dbName1}/${dbName2}`); 
            //  window.location.href = `http://10.127.250.102:3000/Home/${dbName1}/${dbName2}`
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
          UCS Comparator
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
                  label="Audit1 Customer Name"
                  multiline
                  maxRows={4}
                  value={cName}
                  onChange={handleCNameChange}
                />
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Audit2 Customer Name"
                  multiline
                  maxRows={4}
                  value={cName2}
                  onChange={handleCName2Change}
                />
               
                </div>
                <div className='row'> 
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Audit1 Customer PID"
                  multiline
                  maxRows={4}
                  value={pid}
                  onChange={handlePIDChange}
                />              
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Audit2 Customer PID"
                  multiline
                  maxRows={4}
                  value={pid2}
                  onChange={handlePID2Change}
                />
                 </div>
                <div className='row' style={{marginLeft:210+'px'}}>
                <button onClick={(e) => { get_unique_id(e) }} style={{background:'none', border:'none', margin:0, padding:0, color:'#0175a2', cursor: 'pointer'}}>
                  Get UniqueIDs
                </button>
                </div>
              <div className='row'>
              <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Select Audit1 UniqueID"
                  value={uniqueID}
                  select
                  onChange={handleUniqueIDChange}
                >
                    {uidOptions.map((option) => (
                      <MenuItem key={option.uniqueID} value={option.uniqueID}>{option.uniqueID}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  id="outlined-multiline-flexible"
                  label="Select Audit2 UniqueID"
                  value={uniqueID2}
                  select
                  onChange={handleUniqueID2Change}
                >
                    {uidOptions2.map((option) => (
                      <MenuItem key={option.uniqueID} value={option.uniqueID}>{option.uniqueID}</MenuItem>
                  ))}
                </TextField>
  
              </div>
              
              <hr />
              <div className='row'>
                <Button onClick={(e) => { get_ucs_comp(e) }} className='UploadButton' variant="contained" disabled={uniqueID.length < 1 || uniqueID2.length < 1 }>
                  Submit
                </Button>
              </div>
              
            </Box>
          </fieldset>
        </Container>
    </Box>
  );
}



