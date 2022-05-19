import React from 'react';
import '../../assets/css/details.css';
import {
    LineChart,
    XAxis,
    YAxis,
    Label,
    Legend,
    Line,
    Tooltip,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';


export default class Details extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            audit_info: this.props.data.info.d1,
            ae_datas: this.props.data.ae_graph_data[1]["result"].map(e => e),
            fcaps_data: this.props.data.fcaps_data.fgd.map(e=>e),
            graph_data: this.props.data.info.d2[3].graph.map((e => e)),
            comment_data: this.props.data.info.d2
        }
    }
    componentDidMount(){
        console.log(this.state.graph_data)
        console.log(this.state.comment_data)
    }
    render(){
        var fA = this.state.audit_info[0]
        var sA = this.state.audit_info[1]

        
        const date11 =  fA["Collection Start Time"].split(" ")[0]
        const time1 =   fA["Collection Start Time"].split(" ")[1]+" "+fA["Collection Start Time"].split(" ")[2]
        const date1 = date11.split("/")
        const day1 = date1[1]
        const month1 = date1[0]
        const year1 = date1[2]

        const month_names = ["Jan","Feb","Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        const mname1 = month_names[month1-1];

        const date12 =  sA["Collection Start Time"].split(" ")[0]
        const time2 =   fA["Collection Start Time"].split(" ")[1]+" "+fA["Collection Start Time"].split(" ")[2]
        const date2 = date12.split("/")
        const day2 = date2[1]
        const month2 = date2[0]
        const year2 = date2[2]

        const mname2 = month_names[month2-1];

        let c1 = ""
        if(this.state.comment_data[0].type === "increase"){
            c1 = `Increase in Total Number of Exceptions Affected by ${this.state.comment_data[0].value} !!!`
        }else if(this.state.comment_data[0].type === "decrease"){
            c1 = `Decrease in Total Number of Exceptions Affected by ${this.state.comment_data[0].value}.`
        }else{
            c1 = `No change`
        }

        let c2 = ""
        if(this.state.comment_data[1].type === "increase"){
            c2 = `Increase in Total Number of Devices Affected by ${this.state.comment_data[1].value} !!!`
        }else if(this.state.comment_data[1].type === "decrease"){
            c2 = `Decrease in Total Number of Devices Affected by ${this.state.comment_data[1].value}.`
        }else{
            c2 = `No change`
        }



        const commentThings = <div className="det-list">
            <ul>
                <li>{c1}</li>
                <li>{c2}</li>
                <li>There are {this.state.comment_data[2].l} Common Exceptions</li>
            </ul>
        </div>



        return(
            <div className="details--container">
                <div className="details-content">
                    <div className="det-a-head">
                        <h5>Audit Analysis</h5>
                    </div>
                    <hr />
                    <div className="det-a1-g">
                        <div className="det-a-graphs">
                            <BarChart width={300} height={200} data={this.state.graph_data}
                                margin={{right:"25"}}>
                                <XAxis dataKey="name">
                                   
                                </XAxis>
                                <YAxis >
                                    
                                </YAxis>
                                <Tooltip />
                                <Legend verticalAlign="top" />
                                <Bar type="monotone" dataKey="Exceptions" fill="#8884d8" />
                                <Bar type="monotone" dataKey="Devices" fill="#82ca9d" />
                            </BarChart>
                        </div>
                        <div className="det-a-comment">
                            <div >
                                <h2>Note</h2>
                            </div>
                            <hr style={{border:"1px solid #ced4da"}}/>
                            {commentThings}
                        </div>
                    </div>
                    <div className="det-a2-g">
                        <div className="det-a-graph">
                        <AreaChart 
                                width={300}
                                height={200}
                                data = {this.state.ae_datas}
                                margin= {{right:25}}
                            >
                                <XAxis dataKey="name">
                                   
                                </XAxis>
                                <YAxis/>
                                <Tooltip />
                                <Legend verticalAlign="top"/>
                                <Area type="monotone" dataKey={fA["Audit_ID"]} stroke="#8884d8" fill="#8884d8" stackId="1"/>
                                <Area type="monotone" dataKey={sA["Audit_ID"]} stroke="#82ca9d" fill="#82ca9d" stackId="1"/>
                            </AreaChart>
                        </div>
                        <div className="det-a-stats">
                        <AreaChart 
                                width={300}
                                height={200}
                                data = {this.state.fcaps_data}
                                margin= {{right:25}}
                            >
                                <XAxis dataKey="name"tick={false} >
                                <Label value="FCCAPS" offset={10} position="insideBottom" />
                                </XAxis>
                                <YAxis/>
                                <Tooltip />
                                <Legend verticalAlign="top"/>
                                <Area type="monotone" dataKey={fA["Audit_ID"]} stroke="#8884d8" fill="#8884d8" stackId="1"/>
                                <Area type="monotone" dataKey={sA["Audit_ID"]} stroke="#82ca9d" fill="#82ca9d" stackId="1"/>
                            </AreaChart>
                        </div>
                    </div>
                </div>
                <div className="details-timeline">
                    <div className="details-t-head">
                        <h5>Audit Timeline</h5>
                    </div> 
                    <hr />
                    <div className="details-t-element">
                        <div className="d-t-e-nob">
                            <div className="d-t-e-circle">
                                <span className="icon-star-empty"></span>
                            </div>
                        </div>
                        <div className="d-t-e-content">
                            <div className="d-t-e-c-head">
                                <div className="det-aid">
                                    {fA["Audit_ID"]}
                                </div>
                                <div className="det-date">
                                    {day1} {mname1},{year1}
                                </div>
                            </div>
                            <div className="d-t-e-c-ad">
                                <div className="d-t-e-table">
                                    <div className="d-t-e-entry">
                                        <p>Devices Affected</p>
                                        <p style={{marginTop:"0px"}}>{fA["Devices Attempted"]}</p>
                                    </div >
                                    <div className="d-t-e-entry">
                                        <p>Devices Passed</p>
                                        <p style={{marginTop:"0px"}}>{fA["Devices Passed"]}</p>
                                    </div>
                                    <div className="d-t-e-entry">
                                        <p>Devices Failed/Excluded</p>
                                        <p style={{marginTop:"0px"}}>{fA["Devices Failed/Excluded"]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="details-t-element">
                        <div className="d-t-e-nob">
                            <div className="d-t-e-circle">
                            <span className="icon-star-empty"></span>
                            </div>
                        </div>
                        <div className="d-t-e-content">
                            <div className="d-t-e-c-head">
                                <div className="det-aid">
                                    {sA["Audit_ID"]}
                                </div>
                                <div className="det-date">
                                    {day2} {mname2},{year2}
                                </div>
                            </div>
                            <div className="d-t-e-c-ad">
                                <div className="d-t-e-table">
                                    <div className="d-t-e-entry">
                                        <p>Devices Affected</p>
                                        <p style={{marginTop:"0px"}}>{sA["Devices Attempted"]}</p>
                                    </div >
                                    <div className="d-t-e-entry">
                                        <p>Devices Passed</p>
                                        <p style={{marginTop:"0px"}}>{sA["Devices Passed"]}</p>
                                    </div>
                                    <div className="d-t-e-entry">
                                        <p>Devices Failed/Excluded</p>
                                        <p style={{marginTop:"0px"}}>{sA["Devices Failed/Excluded"]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        )
    }
}