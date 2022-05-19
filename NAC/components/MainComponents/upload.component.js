import React from 'react';
import '../../assets/css/upload.css';
import {Redirect} from 'react-router-dom';
import Axios from 'axios';
const {REACT_APP_API_URL} = process.env;

export default class Upload extends React.Component{
    constructor(){
        super();
        this.state={
            cec_id:"",
            top_id:"",
            cpy_key:0,
            cname:"",
            audit1_id:0,
            audit2_id:0,
            issubmit: false,
            isSuccess: false,
            isFail: false,
            SMessage :"",
            Fmessage :""
        }
        this.inputHandler = this.inputHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.check_data = this.check_data.bind(this);
    }
    inputHandler(e){
        const {name, value} = e.target;
        this.setState({
            [name]:value
        })
    }
    check_data(){
        if(this.state.cec_id!=="" && this.state.cpy_key!==0 && this.state.audit1_id!==0 && this.state.audit2_id!==0){
            return true;
        }
        return false;
    }
    onSubmitHandler(e){
        e.preventDefault();
        console.log(this.state)
        const url = `${REACT_APP_API_URL}/api/upload`
        console.log(url)
        var vdata = new FormData();
        vdata.append("cec_id",this.state.cec_id)
        vdata.append("top_id",this.state.top_id)
        vdata.append("cpy_key",this.state.cpy_key)
        vdata.append("cname",this.state.cname)
        vdata.append("audit1_id",this.state.audit1_id)
        vdata.append("audit2_id",this.state.audit2_id)
        if (this.check_data()){
            Axios.post(url, vdata)
                .then((data)=>{
                    console.log(data)
                    var status = data.data.status;
                    var mes = data.data.message;
                    console.log(status)
                    console.log(mes)
                    if(status == "true"){
                        this.setState({
                            isSuccess:true,
                            SMessage:mes
                        })
                    }else{
                        this.setState({
                            isFail:true,
                            FMessage:mes
                        })
                    }
                })
                .catch((error)=>{
                    console.log(error)
                })
        }
    }
    render(){
        // here we have to provide the interface, left side with NAA name and logo, right side with 
        // form to compare
        //var accept_types = "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
        if (this.state.isSuccess){
            return <Redirect push
                to = {{
                    pathname:"/load/data",
                    state:{"cpykey": this.state.cpy_key, "audit_1_id": this.state.audit1_id, "audit_2_id": this.state.audit2_id,"cname": this.state.cname}
                }}
            />
        }
        var failMessage = ""
        if(this.state.isFail){
            console.log(this.state.Fmessage)
            failMessage = 
            <div class="toast toast-mbody">
            <div class="toast__icon text-danger icon-error-outline"></div>
            <div class="toast__body">
                <div class="toast__title">Failed</div>
                <div class="toast__message">Error in Cpykey/Audit-1 or Audit-2 ID</div>
            </div>
         </div>
        }
        return(
            <div className="row upload-container">
                <div className="left-side col-4">
                    <div className="company-name">
                        <h1>NAC Tool</h1>
                        <h2>Network Audit Comparator</h2>
                    </div>
                    <p>Audit-Team @cisco2021</p>
                </div>
                <div className="right-side col-8">
                    <div className="cards-container">
                        <form onSubmit={this.onSubmitHandler}>
                            <label>Upload audit ID's for Comparison</label>

                            <div className="row card-entries">
                                <div className="col-md-6">
                                    <div className="form-group base-margin-bottom">
                                        <div className="cec-id form-group__text">
                                            <input id="cec-id" type="text" name="cec_id" onChange={this.inputHandler} value={this.state.cec_id} />
                                            <label for="cec-id">CEC ID</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                <div className="form-group base-margin-bottom">
                                    <div className="top-id form-group__text">
                                        <input id="top-id" type="number" name="top_id" value={this.state.top_id} onChange={this.inputHandler}/>
                                        <label for="top-id">TOP ID</label>
                                    </div>
                                </div>
                                </div>
                            </div>
                            
                            <div className="row card-entries">
                                <div className="col-md-6">
                                    <div className="form-group base-margin-bottom">
                                        <div className="cpy-key form-group__text">
                                            <input id="cpy-key" type="number" name="cpy_key" value={this.state.cpy_key} onChange={this.inputHandler} />
                                            <label for="cpy-key">CPY KEY</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group base-margin-bottom">
                                        <div className="c-name form-group__text">
                                            <input id="c-name" type="text" name="cname" value={this.state.cname} onChange={this.inputHandler}/>
                                            <label for="c-name">Customer Name</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row card-entries">
                                <div className="col-md-6">
                                    <div className="form-group base-margin-bottom">
                                        <div className="audit-key form-group__text">
                                            <input id="audit-key" type="number" name="audit1_id" value={this.state.audit1_id} onChange={this.inputHandler}/>
                                            <label for="audit-key">Audit-1 ID</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group base-margin-bottom">
                                        <div className="audit-key form-group__text">
                                            <input id="audit-key" type="number" name="audit2_id" value={this.state.audit2_id} onChange={this.inputHandler} />
                                            <label for="audit-key">Audit-2 ID</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="btn-parent-p">
                                <button className="btn btn--large">Submit</button>
                            </div>  
                        </form>

                    </div>
                    {failMessage}
                </div>
            </div>
        )
    }
}