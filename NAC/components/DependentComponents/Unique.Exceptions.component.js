import React from 'react';
import '../../assets/css/severity.css';


export default class UEC extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.data.cpykey,
            a1: this.props.data.a1,
            a2: this.props.data.a2,
            audit1_data: [],
            audit2_data: [],
            ae_table_data: this.props.data.ae_table_data,
            isLoading: true
        }
    }
    componentDidMount(){
        this.setState({
            audit1_data: this.state.ae_table_data[2].result.audit_1.map(f => f),
            audit2_data: this.state.ae_table_data[2].result.audit_2.map(f => f),
            isLoading:false
        })
    }  
    render(){
        
        const left_table = <div>
                <div className="reponsive-table">
                    <table class="table table--lined table--wrapped" aria-label="data">
                        <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}> 
                            <tr>
                                <th>
                                    <label class="checkbox">
                                        <input type="checkbox"/>
                                        <span class="checkbox__input"></span>
                                    </label>
                                </th>
                                <th class="sortable">Exception Name</th>
                    
                                
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.audit1_data.map(f => {
                                return (
                                    <tr>
                                        <td>
                                            <label class="checkbox">
                                                <input type="checkbox"/>
                                                <span class="checkbox__input"></span>
                                            </label>
                                        </td>
                                        <td>
                                            {f}    
                                        </td>
                                        
                                    </tr>
                                )
                            })
                        }    
        
                        </tbody>
                    </table>
                </div>      
            </div>
        const right_table = <div>
        <div className="reponsive-table">
            <table class="table table--lined table--wrapped" aria-label="data">
                <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                    <tr>
                        <th>
                            <label class="checkbox">
                                <input type="checkbox"/>
                                <span class="checkbox__input"></span>
                            </label>
                        </th>
                        <th class="sortable">Exception Name</th>
                        
                    </tr>
                </thead>
                <tbody>
                        {
                            this.state.audit2_data.map(f => {
                                return (
                                    <tr>
                                        <td>
                                            <label class="checkbox">
                                                <input type="checkbox"/>
                                                <span class="checkbox__input"></span>
                                            </label>
                                        </td>
                                        <td>
                                            {f}    
                                        </td>
                                        
                                    </tr>
                                )
                            })
                        }  
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
                        <div className="sev_table_left">
                            
                            {left_table}
                        </div>
                    </div>
                    <div className="str">
                        <div className="sev_table_head">
                                {this.state.a2}
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