import React from 'react';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';



import ToolLoading from '../Loaders/ToolLoading.component';
import '../../assets/css/pld.css';


const {REACT_APP_API_URL} = process.env;
console.log(REACT_APP_API_URL)

const queryParams = new URLSearchParams(window.location.search);
const ck = queryParams.get('cpykey');
const i1 = queryParams.get('a1');
const i2 = queryParams.get('a2');
const cn = queryParams.get('cname');

export default class PLD extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey : ck,
            a1: i1,
            a2: i2,
            cname: cn,

            details_info: [],
            details_info_percent: 0,
            details_info_isc: false,

            all_except_data: [],
            all_except_percent: 0,
            all_except_isc: false,

            all_ex_table_data: [],
            all_ex_table_percent: 0,
            all_ex_table_isc: false,

            fcaps_data : {},
            fcaps_percent : 0,
            fcaps_isc: false,

            sev_data: {},
            sev_percent: 0,
            sev_isc: false,

            dev_data: {},
            dev_percent: 0,
            dev_isc: false,

            exp_data: {},
            exp_percent: 0,
            exp_isc: false,


            isButton: false,
            isRedirect: false,
        }
        this.compRedirect = this.compRedirect.bind(this)
    }
    compRedirect(e){
        if(!this.state.isRedirect)
            if(this.state.details_info_isc && this.state.all_except_isc && this.state.all_except_isc
                && this.state.fcaps_isc && this.state.sev_isc && this.state.dev_isc
                && this.state.exp_isc){
                    console.log("all completed, waiting for 5 seconds to redirect")
                    setTimeout(()=>{
                        this.setState({
                            isRedirect: true
                        })
                    },5000)
            }
    }
    componentDidMount(){
        //gathering the details component data 
        console.log(this.state.cpykey)
        if(this.state.details_info_isc === false){
            const details_info_url = `${REACT_APP_API_URL}/api/audit/info`
            Axios.get(details_info_url,{
                params:{
                    "cpykey":this.state.cpykey,
                    "audit_1_id":this.state.a1,
                    "audit_2_id":this.state.a2
                },
                onDownloadProgress:(event)=>{
                    let d_pl = Math.round((event.loaded * 100) / event.total);
                    if(d_pl === 100){
                        this.setState({details_info_percent:d_pl,details_info_isc:true})
                    }else{
                        this.setState({details_info_percent:d_pl})
                    }
                }
            }).then((data)=>{
                this.setState({
                    details_info: data.data.result
                })
                console.log(this.state.details_info)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        //details module completed

        //All Exceptions Module
        if(this.state.all_except_isc === false){
            const all_except_url = `${REACT_APP_API_URL}/api/audit/get/graph/allexceptions`
            Axios.get(all_except_url,{
                params:{
                    "cpykey":this.state.cpykey,
                    "audit_1_id":this.state.a1,
                    "audit_2_id":this.state.a2
                },
                onDownloadProgress:(event)=>{
                    let all_pl = Math.round((event.loaded * 100) / event.total);
                    if(all_pl === 100){
                        this.setState({all_except_percent:all_pl,all_except_isc:true})
                    }else{
                        this.setState({all_except_percent:all_pl})
                    }
                }
            }).then((data)=>{
                this.setState({
                    all_except_data: data.data.main.map(f => f)
                })
                console.log(this.state.all_except_data)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        

        //Tables in ALL Exception Module
        if(this.state.all_ex_table_isc === false){
            const all_ex_table_url = `${REACT_APP_API_URL}/api/audit/get/table/allexceptions`

            Axios.get(all_ex_table_url,{
                params:{
                    "cpykey":this.state.cpykey,
                    "audit_1_id":this.state.a1,
                    "audit_2_id":this.state.a2
                },
                onDownloadProgress:(event)=>{
                    let all_t_pl = Math.round((event.loaded * 100) / event.total);
                    if(all_t_pl === 100){
                        this.setState({all_ex_table_percent:all_t_pl,all_ex_table_isc:true})
                    }else{
                        this.setState({all_ex_table_percent:all_t_pl})
                    }
                }
            }).then((data)=>{
                this.setState({
                    all_ex_table_data: data.data.main.map(f => f)
                })
                console.log(this.state.all_ex_table_data)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        //All Exceptions Module Completed

        //FCCAPS module starts
        if(this.state.fcaps_isc === false){
            const fcaps_url = `${REACT_APP_API_URL}/api/audit/get/data/fccaps`
            Axios.get(fcaps_url,{
                params:{
                    "cpykey":this.state.cpykey,
                    "audit_1_id":this.state.a1,
                    "audit_2_id":this.state.a2
                },
                onDownloadProgress:(event)=>{
                    let fcaps_t_pl = Math.round((event.loaded * 100) / event.total);
                    if(fcaps_t_pl === 100){
                        this.setState({fcaps_percent:fcaps_t_pl,fcaps_isc:true})
                    }else{
                        this.setState({fcaps_percent:fcaps_t_pl})
                    }
                }
            }).then((data)=>{
                console.log(data)
                console.log(data.data.main)
                this.setState({
                    fcaps_data: data.data.main
                },()=>{
                    console.log(this.state.fcaps_data)
                })
                console.log(this.state.fcaps_data)
            })
            .catch((error)=>{
                console.log(error)
            })
            setTimeout(()=>{
                if(this.state.fcaps_percent !== 100){
                    this.setState({
                        fcaps_percent:50
                    })
                }
                
            },120000)
        }
        //FCCAPS module ending

        //Severity Module Starts
        const sev_url = `${REACT_APP_API_URL}/api/audit/get/data/sev`
        Axios.get(sev_url,{
            params:{
                "cpykey":this.state.cpykey,
                "audit_1_id":this.state.a1,
                "audit_2_id":this.state.a2
            },
            onDownloadProgress:(event)=>{
                let sev_t_pl = Math.round((event.loaded * 100) / event.total);
                if(sev_t_pl === 100){
                    this.setState({sev_percent:sev_t_pl,sev_isc:true})
                }else{
                    this.setState({sev_percent:sev_t_pl})
                }
            }
        }).then((data)=>{
            this.setState({
                sev_data: data.data.main
            })
            console.log(this.state.sev_data)
        })
        .catch((error)=>{
            console.log(error)
        })
        setTimeout(()=>{
            if(this.state.sev_percent !== 100){
                this.setState({
                    sev_percent:50
                })
            }
           
        },120000)
        //Severity Module Ends

        //all Devices Module starts
        if(this.state.dev_isc === false){
            const dev_url = `${REACT_APP_API_URL}/api/audit/get/devices`
            Axios.get(dev_url,{
                params:{
                    "cpykey":this.state.cpykey,
                    "audit_1_id":this.state.a1,
                    "audit_2_id":this.state.a2
                },
                onDownloadProgress:(event)=>{
                    let dev_t_pl = Math.round((event.loaded * 100) / event.total);
                    if(dev_t_pl === 100){
                        this.setState({dev_percent:dev_t_pl,dev_isc:true})
                    }else{
                        this.setState({dev_percent:dev_t_pl})
                    }
                }
            })
            .then((data)=>{
                this.setState({
                    dev_data: data.data.result
                })
                console.log(this.state.dev_data)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        //all Devices Module Ends

        //all exceptions module start
        if(this.state.exp_isc === false){
            const exp_url = `${REACT_APP_API_URL}/api/audit/get/exception`
            Axios.get(exp_url,{
                params:{
                    "cpykey":this.state.cpykey,
                    "audit_1_id":this.state.a1,
                    "audit_2_id":this.state.a2
                },
                onDownloadProgress:(event)=>{
                    let exp_t_pl = Math.round((event.loaded * 100) / event.total);
                    if(exp_t_pl === 100){
                        this.setState({exp_percent:exp_t_pl,exp_isc:true})
                    }else{
                        this.setState({exp_percent:exp_t_pl})
                    }
                }
            }).then((data)=>{
                this.setState({
                    exp_data: data.data.result
                })
                console.log(this.state.exp_data)
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        //all exceptions module ends
        
    }
    render(){
        this.compRedirect();
        if(this.state.isRedirect === true){
            return <Redirect push
                        to = {{
                            pathname:"/dashboard",
                            state:{
                                "cpykey": this.state.cpykey, 
                                "audit_1_id": this.state.a1, 
                                "audit_2_id": this.state.a2, 
                                "cname": this.state.cname,
                                "details_info": this.state.details_info,
                                "all_except_data": this.state.all_except_data,
                                "all_ex_table_data": this.state.all_ex_table_data,
                                "fcaps_data": this.state.fcaps_data,
                                "sev_data": this.state.sev_data,
                                "dev_data": this.state.dev_data,
                                "exp_data": this.state.exp_data
                            }
                        }}
                    />
        }
        const details_info_v = this.state.details_info_isc ? <span className="icon-check"></span> : 1;
        const details_info_style = this.state.details_info_isc ?  "visited" : "active";

        const all_except_v = this.state.all_except_isc ? <span className="icon-check"></span> : 2;
        const all_except_style = this.state.all_except_isc ?  "visited" : "active";

        const all_ex_table_v = this.state.all_ex_table_isc ? <span className="icon-check"></span> : 3;
        const all_ex_table_style = this.state.all_ex_table_isc ?  "visited" : "active";

        const fcaps_v = this.state.fcaps_isc ? <span className="icon-check"></span> : 4;
        const fcaps_style = this.state.fcaps_isc ?  "visited" : "active";

        const sev_v = this.state.sev_isc ? <span className="icon-check"></span> : 5;
        const sev_style = this.state.sev_isc ?  "visited" : "active";

        const dev_v = this.state.dev_isc ? <span className="icon-check"></span> : 6;
        const dev_style = this.state.dev_isc ?  "visited" : "active";

        const exp_v = this.state.exp_isc ? <span className="icon-check"></span> : 7;
        const exp_style = this.state.exp_isc ?  "visited" : "active";
        return(
            <div className="pld-main-cont">
                <div className="pld-left">
                    <ToolLoading />
                </div>
                <div className="pld-right">
                    <div className="pld-d-head">
                        <h4>Gathering the Resources</h4>
                    </div>
                    <div className="pld-d-main">
                        <div className="steps steps--vertical">
                            <div className={`step ${details_info_style}`}>
                                <div className="step__icon">{details_info_v}</div>
                                <div className="step__label">
                                    <div class="subheader">Audit Details</div>
                                    <div class="progressbar" data-percentage={this.state.details_info_percent}>
                                        <div class="progressbar__fill"></div>
                                        <div class="progressbar__label">{this.state.details_info_percent}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`step ${all_except_style}`}>
                                <div className="step__icon">{all_except_v}</div>
                                <div className="step__label">
                                    <div class="subheader">Graph Data and Unique Exceptions</div>
                                    <div class="progressbar" data-percentage={this.state.all_except_percent}>
                                        <div class="progressbar__fill"></div>
                                        <div class="progressbar__label">{this.state.all_except_percent}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`step ${all_ex_table_style}`}>
                                <div className="step__icon">{all_ex_table_v}</div>
                                <div className="step__label">
                                    <div class="subheader">All Exception Tables Data</div>
                                    <div class="progressbar" data-percentage={this.state.all_ex_table_percent}>
                                        <div class="progressbar__fill"></div>
                                        <div class="progressbar__label">{this.state.all_ex_table_percent}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`step ${fcaps_style}`}>
                                <div className="step__icon">{fcaps_v}</div>
                                <div className="step__label">
                                    <div class="subheader">FCCAPS Graph and Table Data</div>
                                    <div class="progressbar" data-percentage={this.state.fcaps_percent}>
                                        <div class="progressbar__fill"></div>
                                        <div class="progressbar__label">{this.state.fcaps_percent}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`step ${sev_style}`}>
                                <div className="step__icon">{sev_v}</div>
                                <div className="step__label">
                                    <div class="subheader">Severity Graph and Table Data</div>
                                    <div class="progressbar" data-percentage={this.state.sev_percent}>
                                        <div class="progressbar__fill"></div>
                                        <div class="progressbar__label">{this.state.sev_percent}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`step ${dev_style}`}>
                                <div className="step__icon">{dev_v}</div>
                                <div className="step__label">
                                    <div class="subheader">Devices Data</div>
                                    <div class="progressbar" data-percentage={this.state.dev_percent}>
                                        <div class="progressbar__fill"></div>
                                        <div class="progressbar__label">{this.state.dev_percent}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`step ${exp_style}`}>
                                <div className="step__icon">{exp_v}</div>
                                <div className="step__label">
                                    <div class="subheader">Exceptions Data</div>
                                    <div class="progressbar" data-percentage={this.state.exp_percent}>
                                        <div class="progressbar__fill"></div>
                                        <div class="progressbar__label">{this.state.exp_percent}%</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="pld-footer"><h6>It might take few minutes..</h6></div>
                    </div>
                </div>
            </div>
        )
    }
   
}