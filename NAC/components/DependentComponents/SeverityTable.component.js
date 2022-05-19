import React from 'react';
import '../../assets/css/severity.css';



export default class STC extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.data.cpykey,
            a1: this.props.data.a1,
            a2: this.props.data.a2,
            severity: this.props.data.severity,
            color: this.props.data.color,
            sev_data: this.props.data.sev_data,
            audit1_data: [],
            audit2_data: [],
            isLoading: true,
            sel_l : "",
            sel_r : ""
        }
        this.changeLHandler = this.changeLHandler.bind(this);  
        this.changeRHandler = this.changeRHandler.bind(this); 
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
    componentDidMount(){
        this.setState({
            audit1_data: this.state.sev_data[this.state.a1],
            audit2_data: this.state.sev_data[this.state.a2],
        })
    }  
    render(){
        let left_set = new Set(this.state.audit1_data.map((a)=>{return a.name}))
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
                e.name.indexOf(this.state.sel_l) !== -1 
            )
        })
        let right_set = new Set(this.state.audit2_data.map((a)=>{return a.name}))
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
                e.name.indexOf(this.state.sel_r) !== -1 
            )
        })
        const left_table =  <div>
                <div className="reponsive-table">
                    <table class="table table--lined table--fixed" aria-label="data">
                        <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                            <tr>
                                <th class="sortable">Exception Name</th>
                                <th>Devices Affected</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {filterL.map((e)=>{
                                return (
                                    <tr>
                                        <td style={{backgroundColor:this.state.color}}>
                                            {e.name}
                                        </td>
                                        <td>
                                            {e.devices.map((ad)=>{
                                                return(
                                                    <p>{ad}</p>
                                                )
                                            })}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>      
            </div>
        const right_table = <div>
        <div className="reponsive-table">
            <table class="table table--lined table--fixed" aria-label="data">
                <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                            <tr>
                                <th class="sortable">Exception Name</th>
                                <th>Devices Affected</th>
                                
                            </tr>
                </thead>
                <tbody>
                    {filterR.map((e)=>{
                        return (
                            <tr>
                                
                                <td style={{backgroundColor:this.state.color}}>
                                    {e.name}
                                </td>
                                
                                <td>
                                    {e.devices.map((ad)=>{
                                        return(
                                            <p>{ad}</p>
                                        )
                                    })}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>      
    </div>
        return(
            <div className="sev_table_container">
                <div className="sev_table_content">
                    <div className="stl">
                        <div className="sev_table_head" >
                                {this.state.a1}
                        </div>
                        <div style={{paddingLeft:"1%"}}>
                            <p>Total Number of Exceptions: {filterL.length}</p>
                            <div >
                                {select_left}
                            </div>
                            
                        </div>
                        <div className="sev_table_left">
                            
                            {left_table}
                        </div>
                    </div>
                    <div className="str">
                        <div className="sev_table_head">
                                {this.state.a2}
                        </div>
                        <div style={{paddingLeft:"1%"}}>
                            <p>Total Number of Exceptions: {filterR.length}</p>
                            <div>
                                {select_right}
                            </div>
                            
                        </div>
                        <div className="sev_table_right">
                            {right_table}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}