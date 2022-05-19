import React, { useState,useEffect} from "react";
import { styled } from '@mui/material/styles';
import Title from "./Title";
import Content from "./Content";
import NewCNAAudit from "./NewCNAAudit"
import OldCNAAudit from "./OldCNAAudit";
import OldUCSAudit from "./OldUCSAudit";
import NewUCSAudit from "./NewUCSAudit";
// import {Sidebar} from '@cisco/react-cui';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import { Container } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import UCSComparator from "./UCSComparator";
import NAAComparator from "./NAAComparator";
import { Link } from "react-router-dom";

const drawerWidth= 20;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `${drawerWidth}%`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: '8%',
    }),
  }),
);


const App = () => {
  debugger;
  useEffect(()=>{
    // var ssocookie=document.cookie.match('(^|;)\\s*' + "uad_auth" + '\\s*=\\s*([^;]+)');
    // if(ssocookie==null)
    // {
    //   window.location.href="http://10.127.250.102:8010/authenticateUser"
    // }
    // fetch('http://10.127.250.102:8010/authenticateUser')
    // .then(res => res.json())
    //   .then(
    //     (result)=>{
    //       console.log(result)
    //       window.location.href = `http://10.127.250.102:8012/overviewpage?db_name=${result[0].db_name}&cust=${result[0].cust}&token=${result[0].token}`
    //     }
    // )
  },[]);
  
  
  const [cookies] = useCookies();
  const [isMini, setIsMini] = useState(false)
  const [isActive_cna, setIsActive_cna] = useState(false)
  const [isActive_dc, setIsActive_dc] = useState(false)
  const toggleIsMini = () => setIsMini((prev) => !prev)
  const toggleIsActive_cna = () => setIsActive_cna((prev) => !prev)
  const toggleIsActive_dc = () => setIsActive_dc((prev) => !prev)
  const [content, setContent] = useState('home')
  let helpurl='https://eurl.io/#SPt1_l2Vn'
  

  //const changeContent=(screen)=>setContent(screen)
  const project = () => {
    switch(content) {

      case "home":   return <Content />;
      case "NewCNA":   return <NewCNAAudit />;
      case "OldCNA": return <OldCNAAudit />;
      case "CNAComparator":  return <NAAComparator />;
      case "NewUCS":   return <NewUCSAudit />;
      case "OldUCS": return <OldUCSAudit />;
      case "UCSComparator":  return <UCSComparator />;
    

      default:      return <h1>No project match</h1>
    }
  }
  var mini=isMini ? 'sidebar sidebar--mini':'sidebar'
  var miniclass=isMini ? 'icon-toggle-menu': 'icon-list-menu'
  var cnaclass=isActive_cna ? 'sidebar__drawer sidebar__drawer--opened' : 'sidebar__drawer'
  var dcclass=isActive_dc ? 'sidebar__drawer sidebar__drawer--opened' : 'sidebar__drawer'

  if(cookies.naa_email){

  return (
    <>
      <Title/>
      <div className="sidebar-doc">
        <Container>
        <nav className={mini} role='navigation' >
          {/* <Sidebar className="col-md-1 col-lg-3 col-xl-2" mini={isMini}> 
            <Sidebar.Header className="hidden-md-down">
              <Sidebar.Toggle isMini={isMini} onClick={toggleIsMini} />
            </Sidebar.Header>*/}
            <div className="sidebar__header hidden-md-down">
      <div className="sidebar__header-title">
      <Link to='#' onClick={toggleIsMini}><span className={miniclass} /> </Link>

      </div>
    </div>
    <ul>
    <li>
    <Link to='#' tabIndex="0" onClick={()=>setContent('home')}>
                  {/* <Icon name="icon-home" /> */}
                  <HomeIcon fontSize="large"/>&nbsp;&nbsp;
                  <span>Home</span>
                </Link>
    </li>
    <li className={cnaclass}>
      <Link to="#" onClick={toggleIsActive_cna}>
        <span className="icon-devices"/>
        <span>Core Networking Audit</span>&nbsp;&nbsp;&nbsp;
      </Link>
      <ul><li><Link to='#' tabIndex="0" onClick={()=>setContent('NewCNA')}>Upload New Audit</Link>
                    <Link to='#' tabIndex="0" onClick={()=>setContent('OldCNA')}>Open Previous Audit</Link>
                    <Link to='#' tabIndex="0" onClick={()=>setContent('CNAComparator')}>Compare Audit</Link></li></ul>
    </li>
    <li className={dcclass}>
      <Link to='#' onClick={toggleIsActive_dc} >
        <span className="icon-devices"/>
        <span>DC Compute Audit</span>
      </Link>
      <ul><li><Link to='#' tabIndex="0" onClick={()=>setContent('NewUCS')}>Upload New Audit</Link>
                    <Link to='#' tabIndex="0" onClick={()=>setContent('OldUCS')}>Open Previous Audit</Link>
                    <Link to='#' tabIndex="0" onClick={()=>setContent('UCSComparator')}>Compare Audit</Link></li></ul>
    </li>

            {/* <Sidebar.Items>
              <Sidebar.Item>
                <a tabIndex="0" onClick={()=>setContent('home')}>
                   <Icon name="icon-home" /> 
                  <span>Home</span>
                </a>
              </Sidebar.Item>
              <Sidebar.Drawer
                active={isActive_cna}
                onClick={toggleIsActive_cna}
                title="Core Networking Audit"
                iconClass="icon-devices"
              >
                <Sidebar.Items>
                  <Sidebar.Item>
                    <a tabIndex="0" onClick={()=>setContent('NewCNA')}>Upload New Audit</a>
                    <a tabIndex="0" onClick={()=>setContent('OldCNA')}>Open Previous Audit</a>
                    <a tabIndex="0" onClick={()=>setContent('CNAComparator')}>Compare Audit</a>
                  </Sidebar.Item>
                </Sidebar.Items>
              </Sidebar.Drawer>

              <Sidebar.Drawer
                active={isActive_dc}
                onClick={toggleIsActive_dc}
                title="DC Compute Audit"
                iconClass="icon-devices"
              >
                <Sidebar.Items>
                  <Sidebar.Item>
                    <a tabIndex="0" onClick={()=>setContent('NewUCS')}>Upload New Audit</a>
                    <a tabIndex="0" onClick={()=>setContent('OldUCS')}>Open Previous Audit</a>
                    <a tabIndex="0" onClick={()=>setContent('UCSComparator')}>Compare Audit</a>
                  </Sidebar.Item>
                </Sidebar.Items>
              </Sidebar.Drawer> */}


              <li className="divider"></li>
              <li>
                <a tabIndex="0" href={helpurl}>
                  {/* <Icon name="icon-help" /> */}
                  <HelpIcon fontSize="large"/>&nbsp;&nbsp;
                  <span>Help</span>
                </a>
              </li>
            </ul>
          </nav>
        </Container>
      </div>
      <Main open={isMini} >{project()}</Main>
    </>
  )
            }
            else{
              window.location.href = `http://auditanalysis.cisco.com:5000`
                      // alert('not authenticated')
            }
}

export default App;