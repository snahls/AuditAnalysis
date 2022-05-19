import React, { useState,useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/css/Home.css";
import Home from "./Home";
import BP from "./BP";
import Faults from "./Faults";
import HomeIcon from '@mui/icons-material/Home';
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";


function SideBar() {  
  const [cookies] = useCookies();
  const [content, setContent] = useState("Home");
  let { dbName1, dbName2 } = useParams();

  var dbName1_display = dbName1.substring(7);
  var dbName2_display = dbName2.substring(7);

  useEffect(()=>{
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
            window.location.href = `http://auditanalysis.cisco.com:5000`
          }
        })
    .catch((error) => alert('Something went wrong'))
    
  })

  const project = () => {
    switch (content) {
      case "Home":
        return <Home />;
      case "BP":
        return <BP />;
      case "Faults":
        return <Faults />;

      default:
        return <Home />;
    }
  };

  if(cookies.naa_email){

  return (
    // <div>SideBar_Header</div>
    <>
      {/* code for header UCS Audit Comparator + Logo */}
      <div className="navfix" style={{position:"fixed",zIndex:100000,width:'100%'}}>
      <header className="header">
        <div className="container">
          <div className="header-panels">
            <div className="header-panel">
              <a
                className="header__logo"
                href="http://www.cisco.com">
                <span className='icon-cisco' />
              </a>
              <div className="header__title">UCS Audit Comparator</div>
              </div>
              <div className='header-panel--right'>
              Audit 1  &#8658; {dbName1_display}
              <br/>Audit 2  &#8658; {dbName2_display}
            </div>
          </div>
        </div>
      </header>
      </div>

      <div className="row">
        <div className="col-1">
          {/* Sidebar code starts here */}

          <nav className="sidebar" role="navigation">            

            <ul style={{marginTop:60}}>
              <li className="sidebar__item">
                <Link to='#' tabIndex="0" onClick={() => setContent("Home")}>
                  {/* <IoIosHome /> */}
                  {/* <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                      },
                    }}
                  >
                    <HomeIcon />
                  </Box> */}
                  <HomeIcon></HomeIcon>
                  &nbsp;<span>Home</span>
                </Link>
              </li>
              {/* <li className="sidebar__item" onClick={() => { navigate(`/BestPractice`);}} >  */}
              <li className="sidebar__item">
                <Link to='#' tabIndex="0" onClick={() => setContent("BP")}>
                  {/* <IoMdFolder /> &nbsp; <span><Link to = "/BestPractice">Best Practices</Link></span> */}
                  {/* <IoMdFolder /> */}
                  <CheckCircleIcon></CheckCircleIcon>
                  &nbsp; <span>Best Practices</span>
                </Link>
              </li>
              <li className="sidebar__item">
                <Link to='#' tabIndex="0" onClick={() => setContent("Faults")}>
                  {/* <IoMdFolder /> */}
              <ErrorIcon></ErrorIcon>
                  &nbsp; <span>Faults</span>
                </Link>
              </li>

              {/* <li className="sidebar__item">
                                        <a tabIndex="0">
                                            <IoMdFolder /> &nbsp; <span>EOL</span>
                                        </a>

                                    </li> */}
              {/* <li className="divider"></li> */}
              {/* <li className="sidebar__item">
                <a tabIndex="0">
                  <SettingsIcon></SettingsIcon>
                  &nbsp; <span>Settings</span>
                </a>
              </li>
              <li className="sidebar__item">
                <a tabIndex="0">
                   <HelpIcon></HelpIcon>
                  &nbsp; <span>Help</span>
                </a>
              </li> */}
            </ul>
          </nav>

          {/* Sidebar code ends here */}
        </div>
      </div>
      {project()}
    </>
  );
}
else{
  window.location.href = `http://auditanalysis.cisco.com:5000`
          // alert('not authenticated')
}
}

export default SideBar;
