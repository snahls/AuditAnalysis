import React from 'react';
import '../../assets/css/devices.css';
import Search from '../DependentComponents/Search.component';

export default class Devices extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.state.cpykey,
            audit_1_id: this.props.state.audit_1_id,
            audit_2_id: this.props.state.audit_2_id,
            dev_data: this.props.state.dev_data,
            isLoading: true,
            dev_list: [],
            dev_l:0,
        }
    }
    componentDidMount(){
            console.log(this.state.dev_data.main.dev)
            this.setState({
                dev_list: this.state.dev_data.main.dev.map(e => e),
                dev_l: this.state.dev_data.main.l,
                isLoading: false,
            })
        console.log(this.state.dev_list)
    }
    render(){
        const mainC = this.state.isLoading ? "":
            <Search data={{
                "cpykey":this.state.cpykey,
                "audit_1_id":this.state.audit_1_id,
                "audit_2_id":this.state.audit_2_id,
                "dev_list": this.state.dev_list
            }}/>
        
        return(
            <div className="devices-main-container">
                {mainC}
            </div>
        )
    }
}