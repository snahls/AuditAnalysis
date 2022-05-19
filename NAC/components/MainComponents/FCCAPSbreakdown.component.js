import React from "react";
import "../../assets/css/fccaps.css";
import CFLoading from "../PercentageComponents/CFLoading.component";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import FTC from "../DependentComponents/FcapTable.component";

export default class Fcaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpykey: this.props.state.cpykey,
      audit_1_id: this.props.state.audit_1_id,
      audit_2_id: this.props.state.audit_2_id,
      fcaps_data: this.props.state.fcaps_data,
      rightrender: "f",
      isLoading: true,
      ae_data: [],
      isActive: "f",
      Cpercent: this.props.state.fcaps_data.fgd[0].percent["p"],
      Cdiff: this.props.state.fcaps_data.fgd[0].percent["diff"],
    };
    this.topref = React.createRef();
    this.topHandler = this.topHandler.bind(this);
  }
  clickHandler(e) {
    // c : fault mgmt
    // h : capacity mgmt
    // m : config mgmt
    // l : performance mgmt
    // i : security mgmt
    console.log(this.state.ae_data);
    var cp;
    var cd;

    if (e === "f") {
      cp = this.state.ae_data[0].percent["p"];
      cd = this.state.ae_data[0].percent["diff"];
    } else if (e === "c") {
      cp = this.state.ae_data[1].percent["p"];
      cd = this.state.ae_data[1].percent["diff"];
    } else if (e === "con") {
      cp = this.state.ae_data[2].percent["p"];
      cd = this.state.ae_data[2].percent["diff"];
    } else if (e === "p") {
      cp = this.state.ae_data[3].percent["p"];
      cd = this.state.ae_data[3].percent["diff"];
    } else if (e === "s") {
      cp = this.state.ae_data[4].percent["p"];
      cd = this.state.ae_data[4].percent["diff"];
    }
    console.log(cp);
    console.log(cd);
    this.setState({
      isActive: e,
      rightrender: e,
      Cpercent: cp,
      Cdiff: cd,
    });
  }
  topHandler(e){
    this.topref.current.scrollIntoView({behavior:"smooth"})
  }
  componentDidMount() {
    this.setState({
      ae_data: this.state.fcaps_data.fgd.map((e) => e),
    });
    console.log(this.state.Cpercent);
    console.log(this.state.Cdiff);
  }
  render() {
    console.log(this.state.fcaps_data.f[this.state.audit_1_id].list)
    console.log(this.state.fcaps_data.f)
    var r_render;
    console.log(this.state.Cpercent);
    console.log(this.state.Cdiff);
    if (this.state.rightrender === "f") {
        if(this.state.fcaps_data.f[this.state.audit_1_id].isp === "false" &&
        this.state.fcaps_data.f[this.state.audit_2_id].isp === "false"){
            //here show that there is no data present
            r_render = (
                <div className="fp-error-msg">
                    <h3>No data is present in these Audits</h3>
                </div>
            )
        }else{
            r_render = (
                <div className="fp-graph">
              <div style={{ display: "flex" }}>
                <div className="graph-fccaps-div">
                  <p className="graph-fccaps-p" style={{ marginTop: "-20%" }}>
                    Number of Exceptions
                  </p>
                </div>
                <BarChart
                  width={500}
                  height={300}
                  data={[this.state.ae_data[0]]}
                  barCategoryGap={180}
                >
                  
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={this.CustomtoolTip} />
                  <Legend wrapperStyle={{ bottom: "none" }} />
                  <Bar
                    dataKey={this.state.audit_1_id}
                    fill="#004c6d"
                    maxBarSize={35}
                  />
                  <Bar
                    dataKey={this.state.audit_2_id}
                    fill="#6996b3"
                    maxBarSize={35}
                  />
                </BarChart>
    
                <CFLoading
                  key={this.state.rightrender}
                  percent={this.state.Cpercent}
                  diff={this.state.Cdiff}
                />
              </div>
              <div>
                <FTC
                  key={this.state.rightrender}
                  data={{
                    cpykey: this.state.cpykey,
                    a1: this.state.audit_1_id,
                    a2: this.state.audit_2_id,
                    fcaps: "fault",
                    fcaps_data: this.state.fcaps_data.f,
                  }}
                />
              </div>
            </div>
            );
        }
    } else if (this.state.rightrender === "c") {
        if(this.state.fcaps_data.c[this.state.audit_1_id].isp === "false" &&
        this.state.fcaps_data.c[this.state.audit_2_id].isp === "false"){
            //here show that there is no data present
            r_render = (
                <div className="fp-error-msg">
                    <h3>No data is present in these Audits</h3>
                </div>
            )
        }else{
            r_render = (
                <div className="fp-graph">
                  <div style={{ display: "flex" }}>
                    <div className="graph-fccaps-div">
                      <p className="graph-fccaps-p" style={{ marginTop: "-20%" }}>
                        Number of Exceptions
                      </p>
                    </div>
                    <BarChart
                      width={500}
                      height={300}
                      data={[this.state.ae_data[1]]}
                      barCategoryGap={180}
                    >
                      
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={this.CustomtoolTip} />
                      <Legend wrapperStyle={{ bottom: "none" }} />
                      <Bar
                        dataKey={this.state.audit_1_id}
                        fill="#004c6d"
                        maxBarSize={35}
                      />
                      <Bar
                        dataKey={this.state.audit_2_id}
                        fill="#6996b3"
                        maxBarSize={35}
                      />
                    </BarChart>
                    <CFLoading
                      key={this.state.rightrender}
                      percent={this.state.Cpercent}
                      diff={this.state.Cdiff}
                    />
                  </div>
                  <div>
                    <FTC
                      key={this.state.rightrender}
                      data={{
                        cpykey: this.state.cpykey,
                        a1: this.state.audit_1_id,
                        a2: this.state.audit_2_id,
                        fcaps: "capacity",
                        fcaps_data: this.state.fcaps_data.c,
                      }}
                    />
                  </div>
                </div>
              );
        }
      
    } else if (this.state.rightrender === "con") {
        if(this.state.fcaps_data.con[this.state.audit_1_id].isp === "false" &&
        this.state.fcaps_data.con[this.state.audit_2_id].isp === "false"){
            r_render = (
                <div className="fp-error-msg">
                    <h3>No data is present in these Audits</h3>
                </div>
            )
        }
        else{
            r_render = (
                <div className="fp-graph">
                  <div style={{ display: "flex" }}>
                    <div className="graph-fccaps-div">
                      <p className="graph-fccaps-p" style={{ marginTop: "-20%" }}>
                        Number of Exceptions
                      </p>
                    </div>
                    <BarChart
                      width={500}
                      height={300}
                      data={[this.state.ae_data[2]]}
                      barCategoryGap={180}
                    >
                      
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={this.CustomtoolTip} />
                      <Legend wrapperStyle={{ bottom: "none" }} />
                      <Bar
                        dataKey={this.state.audit_1_id}
                        fill="#004c6d"
                        maxBarSize={35}
                      />
                      <Bar
                        dataKey={this.state.audit_2_id}
                        fill="#6996b3"
                        maxBarSize={35}
                      />
                    </BarChart>
                    <CFLoading
                      key={this.state.rightrender}
                      percent={this.state.Cpercent}
                      diff={this.state.Cdiff}
                    />
                  </div>
                  <div>
                    <FTC
                      key={this.state.rightrender}
                      data={{
                        cpykey: this.state.cpykey,
                        a1: this.state.audit_1_id,
                        a2: this.state.audit_2_id,
                        fcaps: "configuration",
                        fcaps_data: this.state.fcaps_data.con,
                      }}
                    />
                  </div>
                </div>
              );
        }
    } else if (this.state.rightrender === "p") {
        if(this.state.fcaps_data.p[this.state.audit_1_id].isp === "false" &&
        this.state.fcaps_data.p[this.state.audit_2_id].isp === "false"){
            r_render = (
                <div className="fp-error-msg">
                    <h3>No data is present in these Audits</h3>
                </div>
            )
        }else{
            r_render = (
                <div className="fp-graph">
                  <div style={{ display: "flex" }}>
                    <div className="graph-fccaps-div">
                      <p className="graph-fccaps-p" style={{ marginTop: "-20%" }}>
                        Number of Exceptions
                      </p>
                    </div>
                    <BarChart
                      width={500}
                      height={300}
                      data={[this.state.ae_data[3]]}
                      barCategoryGap={180}
                    >
                     
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={this.CustomtoolTip} />
                      <Legend wrapperStyle={{ bottom: "none" }} />
                      <Bar
                        dataKey={this.state.audit_1_id}
                        fill="#004c6d"
                        maxBarSize={35}
                      />
                      <Bar
                        dataKey={this.state.audit_2_id}
                        fill="#6996b3"
                        maxBarSize={35}
                      />
                    </BarChart>
                    <CFLoading
                      key={this.state.rightrender}
                      percent={this.state.Cpercent}
                      diff={this.state.Cdiff}
                    />
                  </div>
                  <div>
                    <FTC
                      key={this.state.rightrender}
                      data={{
                        cpykey: this.state.cpykey,
                        a1: this.state.audit_1_id,
                        a2: this.state.audit_2_id,
                        fcaps: "performance",
                        fcaps_data: this.state.fcaps_data.p,
                      }}
                    />
                  </div>
                </div>
              );
        }
    } else if (this.state.rightrender === "s") {
        if(this.state.fcaps_data.s[this.state.audit_1_id].isp === "false" &&
        this.state.fcaps_data.s[this.state.audit_2_id].isp === "false"){
            r_render = (
                <div className="fp-error-msg">
                    <h3>No data is present in these Audits</h3>
                </div>
            )
        }else{
            r_render = (
                <div className="fp-graph">
                  <div style={{ display: "flex" }}>
                    <div className="graph-fccaps-div">
                      <p className="graph-fccaps-p" style={{ marginTop: "-20%" }}>
                        Number of Exceptions
                      </p>
                    </div>
                    <BarChart
                      width={500}
                      height={300}
                      data={[this.state.ae_data[4]]}
                      barCategoryGap={180}
                    >
                      
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={this.CustomtoolTip} />
                      <Legend wrapperStyle={{ bottom: "none" }} />
                      <Bar
                        dataKey={this.state.audit_1_id}
                        fill="#004c6d"
                        maxBarSize={35}
                      />
                      <Bar
                        dataKey={this.state.audit_2_id}
                        fill="#6996b3"
                        maxBarSize={35}
                      />
                    </BarChart>
                    <CFLoading
                      key={this.state.rightrender}
                      percent={this.state.Cpercent}
                      diff={this.state.Cdiff}
                    />
                  </div>
                  <div>
                    <FTC
                      key={this.state.rightrender}
                      data={{
                        cpykey: this.state.cpykey,
                        a1: this.state.audit_1_id,
                        a2: this.state.audit_2_id,
                        fcaps: "security",
                        fcaps_data: this.state.fcaps_data.s,
                      }}
                    />
                  </div>
                </div>
              );
        }
    }
    return (
      <div className="fp-container">
        <div ref={this.topref} id="top"></div>
        <div className="fp-content">
          <div className="fp-left">
            <div className="fp-left-contents">
              <div
                className={`fp-entries ${
                  this.state.isActive === "f" ? "fp-active" : ""
                }`}
                onClick={() => {
                  this.clickHandler("f");
                }}
              >
                <p>Fault Management</p>
              </div>
              <div
                className={`fp-entries ${
                  this.state.isActive === "c" ? "fp-active" : ""
                }`}
                onClick={() => {
                  this.clickHandler("c");
                }}
              >
                <p>Capacity Management</p>
              </div>
              <div
                className={`fp-entries ${
                  this.state.isActive === "con" ? "fp-active" : ""
                }`}
                onClick={() => {
                  this.clickHandler("con");
                }}
              >
                <p>Configuration Management</p>
              </div>
              <div
                className={`fp-entries ${
                  this.state.isActive === "p" ? "fp-active" : ""
                }`}
                onClick={() => {
                  this.clickHandler("p");
                }}
              >
                <p>Performance Management</p>
              </div>
              <div
                className={`fp-entries ${
                  this.state.isActive === "s" ? "fp-active" : ""
                }`}
                onClick={() => {
                  this.clickHandler("s");
                }}
              >
                <p>Security Management</p>
              </div>
            </div>
          </div>
          <div className="fp-right">{r_render}</div>
        </div>
        <div className="d-topbutton" onClick={this.topHandler}>
                    <span class="icon-arrow-up-tail icon-size-24"></span>
        </div>
      </div>
    );
  }
}
