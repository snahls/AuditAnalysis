import React from 'react';
import '../../assets/css/fcap.table.css';


export default class STable extends React.Component{
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
            sel_l: "",
            sel_r: ""
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
        console.log(this.state.sev_data)
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
        let left_table =
        <div>
                <table className="table table--lined table--bordered table--wrapped">
                    <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                        <tr>
                            <th class="sortable">Exception Name</th>
                            <th>NMS Area</th>
                            <th>Devices Affected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterL.map((a)=>{
                            return(
                                <tr>
                                    <td style={{backgroundColor:this.state.color}}>{a.name}</td>
                                    <td>{a.area}</td>
                                    <td>
                                        {a.devices.map((d)=>{
                                            return(
                                                <p>{d}</p>
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
                            <th>NMS Area</th>
                            <th>Devices Affected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterR.map((a)=>{
                            return(
                                <tr>
                                    <td style={{backgroundColor:this.state.color}}>{a.name}</td>
                                    <td>{a.area}</td>
                                    <td>
                                        {a.devices.map((d)=>{
                                            return(
                                                <p>{d}</p>
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
                            <div>
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
                            <div >
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