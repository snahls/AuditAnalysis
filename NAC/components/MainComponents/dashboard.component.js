import React from 'react';
import '../../assets/css/dashboard.css';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';


//import all components here
import AE from './AllException.component';
import Navbar from './Navbar.component';
import Details from './Details.component';
import SB from './SeverityBreakdown.component';
import Help from './Help.component';
import Fcaps from './FCCAPSbreakdown.component';
import Devices from './Devices.component';
import Exceptions from './Exception.component';


export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey : this.props.location.state.cpykey,
            audit_1_id: this.props.location.state.audit_1_id,
            audit_2_id: this.props.location.state.audit_2_id,
            cname: this.props.location.state.cname,
            details_info: this.props.location.state.details_info,
            all_except_data: this.props.location.state.all_except_data,
            all_ex_table_data: this.props.location.state.all_ex_table_data,
            fcaps_data: this.props.location.state.fcaps_data,
            sev_data: this.props.location.state.sev_data,
            dev_data: this.props.location.state.dev_data,
            exp_data: this.props.location.state.exp_data,



            audit_info: this.props.location.state.details_info,
            isDetailLoad: true,
            renderRight:"ov",
            isActive:"ov",
            isTBactive: false,
            isDactive: false
        }
        
        this.clickHandler = this.clickHandler.bind(this);
        this.accordHandler = this.accordHandler.bind(this);
        this.toggleIsActive = this.toggleIsActive.bind(this);
    }
    componentDidMount(){
       
    }
    clickHandler(e){
        this.setState({
            isActive:e,
            renderRight: e
       })
    }
    accordHandler(e){
        console.log(e)
    }
    
    toggleIsActive(e){
        this.setState((prevstate)=>({
            isDactive: !prevstate.isDactive
        }))
    }
    render(){
        var dclass=this.state.isDactive ? 'sidebar__drawer sidebar__drawer--opened' : 'sidebar__drawer'
        var right_render;
        if( this.state.renderRight === "ov"){
            right_render =  <div className="details-c">
                <Details data={{
                    "info":this.state.audit_info,
                    "ae_graph_data": this.state.all_except_data,
                    "fcaps_data":this.state.fcaps_data
            }} />
            </div>
        }else if(this.state.renderRight === "ac"){
            right_render = <AE state={{
                "cpykey":this.state.cpykey, 
                "audit_1_id":this.state.audit_1_id,
                "audit_2_id":this.state.audit_2_id,
                "ae_graph_data": this.state.all_except_data,
                "ae_table_data": this.state.all_ex_table_data,
                "sev_data":this.state.sev_data
            }}/>
        }else if(this.state.renderRight === "sb"){
            right_render = <SB state={{
                "cpykey":this.state.cpykey, 
                "audit_1_id":this.state.audit_1_id,
                "audit_2_id":this.state.audit_2_id,
                "sev_data":this.state.sev_data,
                "all_ae_data": this.state.all_except_data
            }}/>
        }else if(this.state.renderRight === "fb"){
            right_render = <Fcaps state={{
                "cpykey":this.state.cpykey,
                "audit_1_id":this.state.audit_1_id,
                "audit_2_id":this.state.audit_2_id,
                "fcaps_data":this.state.fcaps_data
            }}/>
        }else if(this.state.renderRight === "dw"){
            right_render = <Devices state={{
                "cpykey":this.state.cpykey,
                "audit_1_id":this.state.audit_1_id,
                "audit_2_id":this.state.audit_2_id,
                "dev_data": this.state.dev_data
            }}/>
        }else if(this.state.renderRight === "ew"){
            right_render = <Exceptions state={{
                "cpykey":this.state.cpykey,
                "audit_1_id":this.state.audit_1_id,
                "audit_2_id":this.state.audit_2_id,
                "exp_data": this.state.exp_data
            }}/>
        }else if(this.state.renderRight === "help"){
            right_render = <Help />
        }
        return(
            <div className="dashboard-container">
                <div className="d-navbar">
                    <div>
                        <Navbar data={{"cpykey":this.state.cpykey, "cname": this.state.cname}}/>
                    </div>
                </div>
                <div className="d-content">
                    <div className="d-left-side">
                        <div className="">
                        <div className="sidebar NavB">
                            <ul>
                                <li>
                                    <a tabIndex="0" onClick={()=>this.clickHandler("ov")}>
                                    <HomeIcon fontSize="large"/>&nbsp;&nbsp;
                                        <span>Home</span>
                                    </a>
                                </li>
                                
                                    <li className={dclass}>
                                    <a href="#" onClick={this.toggleIsActive}>
                                        <span className="icon-devices"/>
                                        <span>Audit Compare</span>&nbsp;&nbsp;&nbsp;
                                    </a>
                                    <ul>
                                    <li>
                                        <a tabIndex="0" onClick={()=>this.clickHandler("ac")}>Exceptions</a>
                                    </li>
                                    <li>
                                        <a tabIndex="0" onClick={()=>this.clickHandler("dw")}>Device-Wise Trending</a>
                                    </li>
                                    <li>
                                        <a tabIndex="0" onClick={()=>this.clickHandler("ew")}>Exception-Wise Trending</a>
                                    </li>
                                    <li>
                                        <a tabIndex="0" onClick={()=>this.clickHandler("sb")}>Severity Breakdown</a>
                                    </li>
                                    <li>
                                        <a tabIndex="0" onClick={()=>this.clickHandler("fb")}>FCCAPS Breakdown</a>
                                    </li>
                                </ul>
                                </li>
                                <li className="divider"></li>
                                <li>
                                <a tabIndex="0" onClick={()=>this.clickHandler("help")}>
                                <HelpIcon fontSize="large"/>&nbsp;&nbsp;
                                    <span>Help</span>
                                </a>
                                </li>
                            </ul>
                            </div>  
                        </div>
                    </div>
                    <div className="d-right-side">
                        {right_render}
                    </div>
                </div>
                
            </div>
        )
    }
}