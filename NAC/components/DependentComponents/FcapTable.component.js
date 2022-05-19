import React from 'react';
import Axios from 'axios';
import '../../assets/css/fcap.table.css';



export default class FTC extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.data.cpykey,
            a1: this.props.data.a1,
            a2: this.props.data.a2,
            fcaps: this.props.data.fcaps,
            fcaps_data: this.props.data.fcaps_data,
            audit1_data: [],
            audit2_data: [],
            isLoading: true,
            source :  Axios.CancelToken.source(),
            sel_l : "",
            sel_r : ""
        }
        this.changeLHandler = this.changeLHandler.bind(this);  
        this.changeRHandler = this.changeRHandler.bind(this);  
    }
    componentDidMount(){
        console.log(this.props.data.fcaps_data)
        this.setState({
            audit1_data: this.state.fcaps_data[this.state.a1].list,
            audit2_data: this.state.fcaps_data[this.state.a2].list,
        })
    }
    changeLHandler(e){
        const {value } =  e.target
        console.log(value)
        this.setState({
            sel_l: value
        })
    }
    changeRHandler(e){
        const {value } =  e.target
        console.log(value)
        this.setState({
            sel_r: value
        })
    }
    render(){
        let left_set = new Set(this.state.audit1_data.map((a)=>{return a.exception}))
        let select_left = <select style={{width:"95%",maxWidth:"95%"}} id="select-type-basic" value={this.state.sel_l} onChange={this.changeLHandler}>
            <option value="">All</option>
            {Array.from(left_set).map((a)=>{
                return(
                    <option value={a}>{a}</option>
                )
                
            })}
        </select>
        const filterL = this.state.audit1_data.filter((e)=>{
            return(
                e.exception.indexOf(this.state.sel_l) !== -1 
            )
        })
        let right_set = new Set(this.state.audit2_data.map((a)=>{return a.exception}))
        let select_right = <select style={{width:"95%",maxWidth:"95%"}} id="select-type-basic" value={this.state.sel_r} onChange={this.changeRHandler}>
            <option value="">All</option>
            {Array.from(right_set).map((a)=>{
                return(
                    <option value={a}>{a}</option>
                )
                
            })}
        </select>
        const filterR = this.state.audit2_data.filter((e)=>{
            return(
                e.exception.indexOf(this.state.sel_r) !== -1 
            )
        })





        let left_table = 
        <div>
                <table className="table table--lined table--bordered table--wrapped">
                    <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                        <tr>
                            <th class="sortable">Exception Name</th>
                            <th>Device Count</th>
                            <th>Devices Affected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterL.map((a) => {
                                    
                                    let c = "";
                                    let s = {};
                                    if(a.devices.sev === "critical"){
                                        
                                        c = "rgb(0, 188, 235)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }else if(a.devices.sev === "high"){
                                        
                                        c = "rgb(226, 35, 26)"
                                        s= {
                                            backgroundColor: c,
                                            color:"white"
                                        }
                                    }else if(a.devices.sev === "medium"){
                                        
                                        c = "rgb(251, 171, 24)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }else if(a.devices.sev === "low"){
                                    
                                        c = "rgb(238, 210, 2)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }else if(a.devices.sev === "info"){
                                        c = "rgb(106, 191, 75)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }
                                    return(
                                            <tr>
                                                <td>
                                                    {a.exception}
                                                </td>
                                                <td >
                                                    <div style={{display:"flex",justifyContent:"center"}}>
                                                        <div class={`fp-circle`} style={s}>{a.devices.l}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {a.devices.list.map((ld,i)=>{
                                                        return(
                                                            <p key={i}>{ld}</p>
                                                        )
                                                    })}
                                                </td>
                                        </tr>
                                        )
                            })}
                    </tbody>
                </table>
            
        </div>
        ;
        let right_table = 
        <div>
                <table className="table table--lined table--bordered table--wrapped">
                    <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                        <tr>
                            <th class="sortable">Exception Name</th>
                            <th>Device Count</th>
                            <th>Devices Affected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterR.map((a) => {
                                    let c = "";
                                    let s = {};
                                    if(a.devices.sev === "critical"){
                                        
                                        c = "rgb(0, 188, 235)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }else if(a.devices.sev === "high"){
                                        
                                        c = "rgb(226, 35, 26)"
                                        s= {
                                            backgroundColor: c,
                                            color:"white"
                                        }
                                    }else if(a.devices.sev === "medium"){
                                        
                                        c = "rgb(251, 171, 24)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }else if(a.devices.sev === "low"){
                                    
                                        c = "rgb(238, 210, 2)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }else if(a.devices.sev === "info"){
                                        c = "rgb(106, 191, 75)"
                                        s= {
                                            backgroundColor: c,
                                            color:"black"
                                        }
                                    }
                                    return(
                                            <tr>
                                                <td>
                                                    {a.exception}
                                                </td>
                                                <td >
                                                    <div style={{display:"flex",justifyContent:"center"}}>
                                                        <div class={`fp-circle`} style={s}>{a.devices.l}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {a.devices.list.map((ld,i)=>{
                                                        return(
                                                            <p key={i}>{ld}</p>
                                                        )
                                                    })}
                                                </td>
                                        </tr>
                                        )
                            })}
                    </tbody>
                </table>
        </div>
        ;
        return(
            <div className="fcap-t-container">
                
                <div className="fcap-t-content">
                    <div className="ft-left">
                        <div className="ft-left-head">
                            <p>{this.state.a1}</p>
                        </div>
                        <div>
                            <p>Total Number of Exceptions: {filterL.length}</p>
                            <div >
                                {select_left}
                            </div>
                            
                        </div>
                        <div className="ft-left-table">
                            {left_table}
                        </div>
                    </div>
                    <div className="ft-right">
                        <div className="ft-right-head">
                            <p>{this.state.a2}</p>
                        </div>
                        <div>
                            <p>Total Number of Exceptions: {filterR.length}</p>
                            <div>
                                {select_right}
                            </div>
                            
                        </div>
                        <div className="ft-right-table">
                            {right_table}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}