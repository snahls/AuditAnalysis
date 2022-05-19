import React from 'react';

export default class Common extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            c_data : this.props.data.c_data,
            data: [],
            l : 0
        }
    }
    componentDidMount(){
        console.log(this.state.c_data)
        this.setState({
            data: this.state.c_data.main.exe.map(e => e),
            l: this.state.c_data.main.l
        })
    }
    render(){
        const t = <div>
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
                            this.state.data.map(f => {
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
        return(
            <div className="sev_table_container">
                <div className="sev_table_content">
                    <div className="stl">
                        <div className="sev_table_head" >
                               <p>Total Length: {this.state.l}</p>
                        </div>
                        <div className="sev_table_left">
                            
                            {t}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
} 