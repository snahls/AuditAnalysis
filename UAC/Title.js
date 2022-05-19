import React from 'react';
// import {Header, DropdownItem, Visibility} from '@cisco/react-cui';
import logo from './assets/img/logo.png';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { useCookies } from "react-cookie";
import { Link } from 'react-router-dom';

function Title (){
  const [cookies] = useCookies();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    return (
      <div className="navfix" style={{position:"fixed",zIndex:100000,width:'100%'}}>
        <header className='header'>
      <div className="container">
        <div className="header-panels">
        <div className="header-panel hidden-sm-down">
        <a className='header__logo' href='http://www.cisco.com' >
      <span className='icon-cisco' />
    </a> &nbsp;&nbsp;&nbsp;
                <img src={logo} alt='AA' width = "40" height = "40" />
                &nbsp;&nbsp;&nbsp;
                <h1 className='header__title'>Audit Analysis</h1>
        </div>
        <div className="header-panel hidden-md-up">
        <Link to="#"  className='pull-left' data-test-id='mobile-sidebar-toggle'>
      <span className="icon-list-menu" /></Link>
      <a className='header__logo' href='http://www.cisco.com' >
      <span className='icon-cisco' />
    </a></div>
    <div className="header-panel--right hidden-sm-down">
    <div className='header-item'>
    <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        onClick={handleClick}
        style={{ color: "black", fontSize:'medium',textTransform: 'capitalize' }}
      >
        Hi {cookies.naa_User}
      </Button>
    <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        
      >
    <MenuItem onClick={handleClose} style={{ color: "black", fontSize:'small' }}> <ListItemIcon><Logout fontSize="medium" /></ListItemIcon>Logout</MenuItem>
    </Menu>
    </div>

    </div>

        </div>
      </div>
    </header>
</div>
        // <Header>
        //     <Header.Panel className={Visibility.HiddenSmDown}>
        //         <Header.Logo />
        //         &nbsp;&nbsp;&nbsp;
        //         <img src={logo} width = "40" height = "40" />
        //         &nbsp;&nbsp;&nbsp;
        //         <Header.Title title="Audit Analysis" />
        //     </Header.Panel>
        //     <Header.Panel className={Visibility.HiddenMdUp}>
        //         <Header.SidebarToggle />
        //     </Header.Panel>
        //     <Header.Panel className={Visibility.HiddenMdUp}>
        //         <Header.Logo />
        //     </Header.Panel>
                
        //     <Header.Panel className={Visibility.HiddenSmDown} right>
        //         <Header.Dropdown
        //         title={'John Smith'}
        //         id="profile"
        //         dropdownItems={[
        //             <DropdownItem key="logout">Logout</DropdownItem>,
        //         ]}
        //         />
        //     </Header.Panel>
        // </Header>
    )
}


export default Title