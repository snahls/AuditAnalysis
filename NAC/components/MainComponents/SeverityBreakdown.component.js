import React from 'react';
import '../../assets/css/fccaps.css';
import {BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, Label} from 'recharts';
import CFLoading from '../PercentageComponents/CFLoading.component';
import STable from '../DependentComponents/STable.component';


export default class SB extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.state.cpykey,
            audit_1_id: this.props.state.audit_1_id,
            audit_2_id: this.props.state.audit_2_id,
            sev_data: this.props.state.sev_data,
            all_ae_data: this.props.state.all_ae_data,
            rightrender:"c", 
            isLoading: true,
            ae_data: [],
            isActive:"c",
            Cpercent:this.props.state.all_ae_data[1]["result"][0].percent["p"],
            Cdiff:this.props.state.all_ae_data[1]["result"][0].percent["diff"]
        }
        this.topref = React.createRef();
        this.topHandler = this.topHandler.bind(this);
    }
    topHandler(e){
        this.topref.current.scrollIntoView({behavior:"smooth"})
      }
    clickHandler(e){
        // c : critical
        // h : high
        // m : medium
        // l : low
        // i : informational
        var cp 
        var cd 
        if(e === "c"){
            cp = this.state.ae_data[0].percent["p"]
            cd = this.state.ae_data[0].percent["diff"]
        }else if(e == "h"){
            cp = this.state.ae_data[1].percent["p"]
            cd = this.state.ae_data[1].percent["diff"]
        }else if(e == "m"){
            cp = this.state.ae_data[2].percent["p"]
            cd = this.state.ae_data[2].percent["diff"]
        }else if(e == "l"){
            cp = this.state.ae_data[3].percent["p"]
            cd = this.state.ae_data[3].percent["diff"]
        }else if(e == "i"){
            cp = this.state.ae_data[4].percent["p"]
            cd = this.state.ae_data[4].percent["diff"]
        }
        console.log(cp)
        console.log(cd)
        this.setState({
            isActive:e,
            rightrender:e,
            Cpercent: cp,
            Cdiff: cd
        })
}
    componentDidMount(){
        console.log(this.state.all_ae_data)
        this.setState({
            ae_data:  this.state.all_ae_data[1]["result"].map(e => e),
        })
    }
    render(){
        var r_render;
        console.log(this.state.sev_data)
        if(this.state.rightrender === "c"){
            r_render = <div className="fp-graph">
            <div style={{display:"flex"}}>
            <div className="graph-fccaps-div">
                        <p className="graph-fccaps-p" style={{marginTop:"-20%"}}>Number of Exceptions</p>
                    </div> 
                <BarChart
                    width={500}
                    height={300}
                    data = {[this.state.ae_data[0]]}
                    barCategoryGap={180}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip content={this.CustomtoolTip}/>
                    <Legend wrapperStyle={{bottom:"none"}}/>
                    <Bar dataKey={this.state.audit_1_id} fill="#004c6d" maxBarSize={35}/>
                    <Bar dataKey={this.state.audit_2_id} fill="#6996b3" maxBarSize={35}/>
                </BarChart>
                <CFLoading key={this.state.rightrender} percent={this.state.Cpercent} diff={this.state.Cdiff}/>
            </div>
            <div>
                <STable key={this.state.rightrender} data={{
                    "cpykey":this.state.cpykey,
                    "a1":this.state.audit_1_id,
                    "a2":this.state.audit_2_id,
                    "severity":"critical",
                    "color":"rgb(0,188,235,0.8)",
                    "sev_data": this.state.sev_data.c
                    }} />
            </div>
            
        </div>
        }else if(this.state.rightrender === "h"){
            r_render =   <div className="fp-graph">
            <div style={{display:"flex"}}>
            <div className="graph-fccaps-div">
                        <p className="graph-fccaps-p" style={{marginTop:"-20%"}}>Number of Exceptions</p>
                    </div> 
                <BarChart
                    width={500}
                    height={300}
                    data = {[this.state.ae_data[1]]}
                    barCategoryGap={180}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip content={this.CustomtoolTip}/>
                    <Legend wrapperStyle={{bottom:"none"}}/>
                    <Bar dataKey={this.state.audit_1_id} fill="#004c6d" maxBarSize={35}/>
                    <Bar dataKey={this.state.audit_2_id} fill="#6996b3" maxBarSize={35}/>
                </BarChart>
                <CFLoading key={this.state.rightrender} percent={this.state.Cpercent} diff={this.state.Cdiff}/>
            </div>
            <div>
                <STable key={this.state.rightrender} data={{
                    "cpykey":this.state.cpykey,"a1":this.state.audit_1_id,
                    "a2":this.state.audit_2_id,"severity":"high",
                    "color":"rgb(226,35,26,0.8)",
                    "sev_data": this.state.sev_data.h
                    }} />
            </div>
            
        </div>
        }else if(this.state.rightrender === "m"){
            r_render =   <div className="fp-graph">
            <div style={{display:"flex"}}>
            <div className="graph-fccaps-div">
                        <p className="graph-fccaps-p" style={{marginTop:"-20%"}}>Number of Exceptions</p>
                    </div> 
                <BarChart
                    width={500}
                    height={300}
                    data = {[this.state.ae_data[2]]}
                    barCategoryGap={180}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip content={this.CustomtoolTip}/>
                    <Legend wrapperStyle={{bottom:"none"}}/>
                    <Bar dataKey={this.state.audit_1_id} fill="#004c6d" maxBarSize={35}/>
                    <Bar dataKey={this.state.audit_2_id} fill="#6996b3" maxBarSize={35}/>
                </BarChart>
                <CFLoading key={this.state.rightrender} percent={this.state.Cpercent} diff={this.state.Cdiff}/>
                
            </div>
            <div>
                <STable key={this.state.rightrender} data={{
                    "cpykey":this.state.cpykey,"a1":this.state.audit_1_id,
                    "a2":this.state.audit_2_id,"severity":"medium",
                    "color":"rgb(251,171,24,0.8)",
                    "sev_data": this.state.sev_data.m
                    }} />
            </div>
        </div>
        }else if(this.state.rightrender === "l"){
            r_render =  <div className="fp-graph">
            <div style={{display:"flex"}}>
            <div className="graph-fccaps-div">
                        <p className="graph-fccaps-p" style={{marginTop:"-20%"}}>Number of Exceptions</p>
                    </div> 
                <BarChart
                    width={500}
                    height={300}
                    data = {[this.state.ae_data[3]]}
                    barCategoryGap={180}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip content={this.CustomtoolTip}/>
                    <Legend wrapperStyle={{bottom:"none"}}/>
                    <Bar dataKey={this.state.audit_1_id} fill="#004c6d" maxBarSize={35}/>
                    <Bar dataKey={this.state.audit_2_id} fill="#6996b3" maxBarSize={35}/>
                </BarChart>
                <CFLoading key={this.state.rightrender} percent={this.state.Cpercent} diff={this.state.Cdiff}/>
                
            </div>
            <div>
                <STable key={this.state.rightrender} data={{
                    "cpykey":this.state.cpykey,
                    "a1":this.state.audit_1_id,
                    "a2":this.state.audit_2_id,
                    "severity":"low",
                    "color":"rgb(238,210,2,0.8)",
                    "sev_data": this.state.sev_data.l
                    }} />
            </div>
            
        </div>
        }else if(this.state.rightrender === "i"){
            r_render =   <div className="fp-graph">
            <div style={{display:"flex"}}>
                <div className="graph-fccaps-div">
                    <p className="graph-fccaps-p" style={{marginTop:"-20%"}}>Number of Exceptions</p>
                </div> 
                <BarChart
                    width={500}
                    height={300}
                    data = {[this.state.ae_data[4]]}
                    barCategoryGap={180}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip content={this.CustomtoolTip}/>
                    <Legend wrapperStyle={{bottom:"none"}}/>
                    <Bar dataKey={this.state.audit_1_id} fill="#004c6d" maxBarSize={35}/>
                    <Bar dataKey={this.state.audit_2_id} fill="#6996b3" maxBarSize={35}/>
                </BarChart>
                <CFLoading key={this.state.rightrender} percent={this.state.Cpercent} diff={this.state.Cdiff}/>
                
            </div>
            <div>
                <STable key={this.state.rightrender} data={{
                    "cpykey":this.state.cpykey,"a1":this.state.audit_1_id,
                    "a2":this.state.audit_2_id,"severity":"informational",
                    "color":"rgb(106,191,75,0.8)",
                    "sev_data": this.state.sev_data.i
                    }} />
            </div>
            
        </div>
        }
        return(
            <div className="fp-container">
                <div ref={this.topref} id="top"></div>
                <div className="fp-content">
                    <div className="fp-left">
                        <div className="fp-left-contents">
                            <div className = {`fp-entries ${this.state.isActive==="c"?"fp-active":""}`} onClick={()=>{this.clickHandler("c")}}>
                                <p>Critical</p>
                            </div>
                            <div className={`fp-entries ${this.state.isActive==="h"?"fp-active":""}`} onClick={()=>{this.clickHandler("h")}}>
                                <p>High</p>
                            </div>
                            <div className={`fp-entries ${this.state.isActive==="m"?"fp-active":""}`} onClick={()=>{this.clickHandler("m")}}>
                                <p>Medium</p>
                            </div>
                            <div className={`fp-entries ${this.state.isActive==="l"?"fp-active":""}`} onClick={()=>{this.clickHandler("l")}}>
                                <p>Low</p>
                            </div>
                            <div className={`fp-entries ${this.state.isActive==="i"?"fp-active":""}`} onClick={()=>{this.clickHandler("i")}}>
                                <p>Informational</p>
                            </div>
                        </div>
                    </div>
                    <div className="fp-right">
                        
                        {r_render}
                    </div>
                </div>
                <div className="d-topbutton" onClick={this.topHandler}>
                    <span class="icon-arrow-up-tail icon-size-24"></span>
                </div>
            </div> 
        )
    }
}