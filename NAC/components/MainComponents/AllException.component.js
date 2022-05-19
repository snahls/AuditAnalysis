import React from 'react';

import {BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, Label} from 'recharts';



import CLoading from '../PercentageComponents/componentLoading.component';
import TC from '../DependentComponents/Table.component';
import STC from '../DependentComponents/SeverityTable.component';
import UEC from '../DependentComponents/Unique.Exceptions.component';
import Common from '../DependentComponents/Common.component';
import '../../assets/css/allexception.css';

export default class AE extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.state.cpykey,
            audit_1_id: this.props.state.audit_1_id,
            audit_2_id: this.props.state.audit_2_id,
            ae_table_data: this.props.state.ae_table_data,
            sev_data:this.props.state.sev_data,

            isLoading: true,
            c_data: this.props.state.ae_graph_data[3],
            ae_datas: this.props.state.ae_graph_data[1]["result"].map(e => e),
            ue_datas: this.props.state.ae_graph_data[2]["result"].map(e => e),
            oe_datas: this.props.state.ae_graph_data[0]["result"].map(e => e),
            ae_percent: 0,
            ue_percent: this.props.state.ae_graph_data[2]["percent"],
            oe_percent: this.props.state.ae_graph_data[0]["percent"]
        }
        this.topref = React.createRef();
        this.criticalRef = React.createRef();
        this.highRef = React.createRef();
        this.midRef = React.createRef();
        this.low = React.createRef();
        this.info = React.createRef();
        this.uExceptions = React.createRef(); 
        this.Handler = this.Handler.bind(this);
        this.topHandler = this.topHandler.bind(this);
    }
    Handler(e){
        if(e.activeLabel === "Critical"){
            this.criticalRef.current.scrollIntoView({behavior:"smooth"})
        }else if(e.activeLabel === "High"){
            this.highRef.current.scrollIntoView({behavior:"smooth"})
        }else if(e.activeLabel === "Medium"){
            this.midRef.current.scrollIntoView({behavior:"smooth"})
        }else if(e.activeLabel === "Low"){
            this.low.current.scrollIntoView({behavior:"smooth"})
        }else if(e.activeLabel === "Info"){
            this.info.current.scrollIntoView({behavior:"smooth"})
        }else if(e.activeLabel === "Unique Exceptions"){
            this.uExceptions.current.scrollIntoView({behavior:"smooth"})
        }
    }
    componentDidMount(){
        console.log(this.state.ae_datas)
        console.log(this.state.ue_datas)
        console.log(this.state.oe_datas)
        console.log(this.state.ae_percent)
        console.log(this.state.ue_percent)
        console.log(this.state.oe_percent)
    }
    topHandler(e){
        this.topref.current.scrollIntoView({behavior:"smooth"})
    }

    CustomtoolTip({payload, label, active}) {
        if(active){
            var icon;
            var color_class="percent";
            if(payload[0].payload.percent.diff === "decrement"){
                    icon =  <span class="icon-arrow-down-tail icon-size-14"></span>;
                    color_class = "p_green"
            }else if(payload[0].payload.percent.diff === "increment"){
                    icon =  <span class="icon-arrow-up-tail icon-size-14"></span>
                    color_class = "p_red"
            }else{
                    icon = <span class="icon-remove icon-size-14"></span>
            }
            return(
                <div style={{width:"150px"}}>
                    <div className="custom-tooltip">
                        <p>All Exceptions</p>
                        <div className="label-1">
                            <p style={{color:payload[0].fill,marginTop:"6%"}}>
                                {payload[0].dataKey}
                            </p>
                            <p>
                                :
                            </p>
                            <p>
                                {payload[0].value}
                            </p>
                            
                        </div>
                        <div className="label-2">
                            <p style={{color:payload[1].fill, marginTop:"6%"}}>{payload[1].dataKey}</p><p>:</p><p>{payload[1].value}</p>
                        </div>
                        <div className={color_class}>
                            <p style={{ marginTop:"6%"}}>Percent</p>
                            <p>:</p>
                            <p>{payload[0].payload.percent.p}</p> 
                            <p>{icon}</p>
                        </div>
                    </div>
                </div>
                
            )
        }
        return null;
    }

    render(){
        const ae_graph = <div className="ae_severity">
                <div className="graph-fccaps-div">
                        <p className="graph-fccaps-p" style={{marginTop:"-20%"}}>Number of Exceptions</p>
                </div> 
                <BarChart
                    width={500}
                    height={300}
                    data = {this.state.ae_datas}
                    onClick={this.Handler}
                >
                    
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip content={this.CustomtoolTip}/>
                    <Legend />
                    
                    <Bar dataKey={this.state.audit_1_id} fill="#004c6d" onClick={this.Handler}/>
                    <Bar dataKey={this.state.audit_2_id} fill="#6996b3" onClick={this.Handler}/>
                    </BarChart>
                    <CLoading data={{"percent":this.state.oe_percent["p"],"type":this.state.oe_percent["diff"]}}/>
                </div>
        const ue_graph = <div className="ae_unique">
            <div className="graph-fccaps-div">
                        <p className="graph-fccaps-p" style={{marginTop:"-20%"}}>Number of Exceptions</p>
                </div> 
            <BarChart
                width={500}
                height={300}
                data = {this.state.ue_datas}
                barCategoryGap={180}
                onClick={this.Handler}  
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Label name="Data"/>
                <Bar dataKey={this.state.audit_1_id} fill="#004c6d" maxBarSize={35}/>
                <Bar dataKey={this.state.audit_2_id} fill="#6996b3" maxBarSize={35}/>
                </BarChart>
                <CLoading data={{"percent":this.state.ue_percent["p"],"type":this.state.ue_percent["diff"]}}/>
        </div>
        const loading = <div class="loading">
                    <div className="loader" aria-label="Loading, please wait...">
                        <div className="wrapper">
                            <div className="wheel"></div>
                            
                        </div>
                    </div>
                    <p>Loading</p>
                </div>
        const ae_graph_Loading = ae_graph
        const ue_graph_Loading = ue_graph
        return(
            <div className="ae">
                <div ref={this.topref} id="top"></div>
                <div className="ae_graph">
                    <h4>All Exceptions with Severity Levels</h4>
                    {ae_graph_Loading}
                </div>
                <div className="ue_graph">
                    <h4>Unique Exceptions</h4>
                    {ue_graph_Loading}
                </div>
                <div className="ae_table">
                    <h4>Unique Exceptions Specific For Audit Files</h4>
                    <TC data={{
                        "cpykey":this.state.cpykey,
                        "a1":this.state.audit_1_id,
                        "a2":this.state.audit_2_id,
                        "ae_table_data": this.state.ae_table_data
                    }}/>
                </div>
                <div ref={this.criticalRef} className="sev_c_table">
                    <h4>Critical Exception Table</h4>
                    <STC data={{
                        "cpykey":this.state.cpykey,
                        "a1":this.state.audit_1_id,
                        "a2":this.state.audit_2_id,
                        "severity":"Critical",
                        "color":"rgb(0,188,235,0.8)",
                        "sev_data": this.state.sev_data.c
                        }} />
                </div>
                <div ref={this.highRef} className="sev_h_table">
                    <h4>High Exception Table</h4>
                    <STC data={{
                        "cpykey":this.state.cpykey, 
                        "a1":this.state.audit_1_id, 
                        "a2":this.state.audit_2_id,
                        "severity":"High",
                        "color":"rgb(226,35,26,0.8)",
                        "sev_data": this.state.sev_data.h
                    }} />
                </div>
                <div ref={this.midRef} className="sev_m_table">
                    <h4>Medium Exception Table</h4>
                    <STC data={{
                        "cpykey":this.state.cpykey, 
                        "a1":this.state.audit_1_id, 
                        "a2":this.state.audit_2_id,
                        "severity":"Medium",
                        "color":"rgb(251,171,24,0.8)",
                        "sev_data": this.state.sev_data.m
                    }} />
                </div>
                <div ref={this.low} className="sev_l_table">
                    <h4>Low Exception Table</h4>
                    <STC data={{
                        "cpykey":this.state.cpykey,
                        "a1":this.state.audit_1_id,
                        "a2":this.state.audit_2_id,
                        "severity":"Low",
                        "color":"rgb(238,210,2,0.8)",
                        "sev_data": this.state.sev_data.l
                    }} />
                </div>
                <div ref={this.info} className="sev_i_table">
                    <h4>Informational Exception Table</h4>
                    <STC data={{
                        "cpykey":this.state.cpykey,
                        "a1":this.state.audit_1_id,
                        "a2":this.state.audit_2_id,
                        "severity":"Informational",
                        "color":"rgb(106,191,75,0.8)",
                        "sev_data": this.state.sev_data.i
                    }} />
                </div>
                <div ref={this.uExceptions} className="ae_table">
                    <h4>All Unique Exceptions</h4>
                    <UEC data={{
                        "cpykey":this.state.cpykey,
                        "a1":this.state.audit_1_id,
                        "a2":this.state.audit_2_id,
                        "ae_table_data": this.state.ae_table_data
                    }}/>
                </div>
                <div className="int_ae_table">
                    <h4>Common Exceptions</h4>
                    <Common data={{
                        "c_data": this.state.c_data
                    }}/>
                </div>
                <div className="d-topbutton" onClick={this.topHandler}>
                    <span class="icon-arrow-up-tail icon-size-24"></span>
                </div>
            </div>
        )
    }
}