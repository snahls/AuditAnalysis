import React from 'react';
import '../../assets/css/devices.css';
import ESearch from '../DependentComponents/ExpSearch.component';


export default class Exceptions extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.state.cpykey,
            audit_1_id: this.props.state.audit_1_id,
            audit_2_id: this.props.state.audit_2_id,
            exp_data: this.props.state.exp_data,
            isLoading: true,
            exp_list: [],
            exp_l:0,
        }
    }
    componentDidMount(){
            this.setState({
                exp_list: this.state.exp_data.main.exe.map(e => e),
                exp_l: this.state.exp_data.main.l,
                isLoading: false,
            })
        console.log(this.state.exp_list)
    }
    render(){
        const mainC = this.state.isLoading ? "":
            <ESearch data={{
                "cpykey":this.state.cpykey,
                "audit_1_id":this.state.audit_1_id,
                "audit_2_id":this.state.audit_2_id,
                "exp_list": this.state.exp_list
            }}/>
        
        return(
            <div className="devices-main-container">
                {mainC}
            </div>
        )
    }
}