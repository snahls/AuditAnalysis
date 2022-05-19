import React from 'react';
import '../../assets/css/table.css';


import Table from './Tb.component';


export default class TC extends React.Component{
    constructor(props){
        super(props);
        this.state = {
                cpykey: this.props.data.cpykey,
                a1: this.props.data.a1,
                a2: this.props.data.a2,
                ae_table_data: this.props.data.ae_table_data,
                isLoading: true,
                table_1_entries: [],
                table_2_entries: [],
                is_1_data: false,
                is_2_data: false,
        }
    }
    componentDidMount(){
        console.log(this.state.ae_table_data)
        const method_1 = this.state.ae_table_data[0].result.a1.method;
        const method_2 = this.state.ae_table_data[0].result.a2.method;
        let t1e = [];
        let t2e = [];
        if(method_1) {t1e = this.state.ae_table_data[0].result.a1.result.map(f => f);}
        if(method_2) {t2e = this.state.ae_table_data[0].result.a2.result.map(f => f);}
        this.setState({
            is_1_data: method_1,
            is_2_data: method_2,
            table_1_entries: t1e.map(f => f),
            table_2_entries: t2e.map(f => f),
        })
    }
    render(){
        var table_1_entries;
        var table_2_entries;
        
           
        if(this.state.is_1_data === true){
            //create the table here
            table_1_entries = <Table data={this.state.table_1_entries} flag={this.state.is_1_data} />
        
        }else{
            table_1_entries = <div className="ae_table_error">
            <h4>No New Exceptions in NewAudit File</h4>
            </div>
        }
        if(this.state.is_2_data === true){
            //create the table here
            table_2_entries = <Table data={this.state.table_2_entries} flag={this.state.is_2_data} />
        }else{
            table_2_entries = <div className="ae_table_error">
                <h4>No New Exceptions in NewAudit File</h4>
                </div>
        }
        return(
            <div className='table-container'>
                <div className="ae_table_content">
                    <div className="atl">
                        <div className="ae_table_head">
                                {this.state.a1}
                        </div>
                        <div className="ae_table_left">
                            {table_1_entries}
                        </div>
                    </div>
                    <div className="atr">
                        <div className="ae_table_head">
                            {this.state.a2}
                        </div>
                        <div className="ae_table_right">
                            {table_2_entries}
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}