import React from 'react';

export default class ESearch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.data.cpykey,
            audit_1_id: this.props.data.audit_1_id,
            audit_2_id: this.props.data.audit_2_id,
            exp_list: this.props.data.exp_list,
            sLoading: true,
            show:"hide",
            sel_div:"",
            sel_a1: [],
            sel_a2: [],
            searchFilter:"",
            search_devices: {}
        }
        this.onClickDev = this.onClickDev.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    onClickDev(e){
       
    }
    handleShow(){
        this.setState({
            show:""
        })
    }
    handleClose(){
        this.setState({
            show:"hide",
            sLoading:true
        })
    }
    handleSearch(e){
        this.setState({searchFilter:e.target.value})
    }
    render(){
        console.log(this.state.search_devices)
        const loading = <div class="loading">
                    <div className="loader" aria-label="Loading, please wait...">
                        <div className="wrapper">
                            <div className="wheel"></div>
                        </div>
                    </div>
                    <p>Loading</p>
        </div>
        const single_dev = this.state.sLoading ? <div className="sel-div-lo">{loading}</div>
        : 
        <div className="sel-div-container">
            <div className="sel-div-left">
                <div className="sel-div-head">
                    {this.state.audit_1_id}
                </div>
                <div className="sel-div-table">
                    <table className="table table--lined table--fixed table--wrapped table--bordered">
                        <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                            <tr>
                                <th>Device Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.sel_a1.map((e)=>{
                                return(
                                    <tr>
                                        <td>{e}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="sel-div-right">
                <div className="sel-div-head">
                    {this.state.audit_2_id}
                </div>
                <div className="sel-div-table">
                    <table className="table table--lined table--fixed table--wrapped table--bordered">
                        <thead style={{top:"0px",position:"sticky",backgroundColor:"#F5F5F5", zIndex:"99"}}>
                            <tr>
                               <th>Device Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.sel_a2.map((e)=>{
                                return(
                                    <tr>
                                        <td>{e}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        const search = this.state.isLoading ? loading: 
        <div className="scroll-heads-search">
            <span className="icon-search icon-size-24" style={{marginTop:"10px"}}></span><input type="text" value={this.state.searchFilter} onChange={this.handleSearch} placeholder="Search Exception ...."/>
        </div>;
        const filter = this.state.exp_list.filter((e)=>{
            let f = e.toLowerCase()
            return f.indexOf(this.state.searchFilter.toLowerCase()) !== -1
        })
        const show_search_dev = 
        <div>
            <div className="devices-scroll-head">
                <p>Exceptions: {filter.length}</p>
            </div>
            <div className="dev-grid">
                {filter.map((e)=>{
                    e = e.replace("\%","\%25")
                    return(
                        <div className="dev-grid-item" onClick={()=>this.onClickDev(e)}>
                                <a target="_blank" rel="noreferrer" 
                                href={`/audit/exception/${this.state.cpykey}/${this.state.audit_1_id}/${this.state.audit_2_id}/${e}`} 
                                style={{marginTop:"10px",textDecoration:"none"}}>{e}</a>
                        </div>
                    )
                })}
            </div>
        </div>
        return(
            <div>
                <div className="devices-all-scroll">
                    <div className="devices-scroll-heads">
                        {search}
                    </div>
                    <div className="devices-scroll-datas">
                        {show_search_dev}
                    </div>
                </div>
            </div>
        )
    }
}