import React from "react";
import Axios from "axios";
import "../../assets/css/sdevice.css";
const {REACT_APP_API_URL} = process.env;

export default class SD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpykey: this.props.data.cpykey,
      audit_1_id: this.props.data.a1,
      audit_2_id: this.props.data.a2,
      sLoading: true,
      dev_id: this.props.data.e,
      sel_a1: [],
      sel_a2: []
    };
  }
  componentDidMount() {
    document.title = this.state.dev_id;
    const url = `${REACT_APP_API_URL}/api/audit/get/device/info`;
    const p = {
      cpykey: this.state.cpykey,
      audit_1_id: this.state.audit_1_id,
      audit_2_id: this.state.audit_2_id,
      dev_id: this.state.dev_id,
    };
    Axios.get(url, { params: p })
      .then((data) => {
        this.setState({
          sel_a1: data.data.result.audit1.map((e) => e),
          sel_a2: data.data.result.audit2.map((e) => e),
          sLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const loading = (
      <div class="loading">
        <div className="loader" aria-label="Loading, please wait...">
          <div className="wrapper">
            <div className="wheel"></div>
          </div>
        </div>
        <p>Loading</p>
      </div>
    );
    const left_table = this.state.sel_a1.length !== 0 ? (
        <div>
          <div className="sd-div-head">{this.state.audit_1_id}</div>
          <div className="sd-div-table">
            <table className="table table--lined table--fixed table--wrapped table--bordered">
              <thead
                style={{
                  top: "0px",
                  position: "sticky",
                  backgroundColor: "#F5F5F5",
                  zIndex: "99",
                }}
              >
                <tr>
                  <th>Exception Name</th>
                  <th>NMS Area</th>
                  <th>Severity</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {this.state.sel_a1.map((e) => {
                  return (
                    <tr>
                      <td>{e.name}</td>
                      <td>{e.area}</td>
                      <td>{e.sev}</td>
                      <td>{e.occur}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
             <div className="sd-div-head">{this.state.audit_1_id}</div>
          <div className="sd-div-table">
            
              
                <div className="sd-no-dev">
                    <h6>No Exceptions Found in this Audit</h6>
                </div>
             
           
          </div>
          
        </div>
      );
  
      const right_table = this.state.sel_a2.length !== 0 ? (
        <div>
          <div className="sd-div-head">{this.state.audit_2_id}</div>
          <div className="sd-div-table">
            <table className="table table--lined table--fixed table--wrapped table--bordered">
              <thead
                style={{
                  top: "0px",
                  position: "sticky",
                  backgroundColor: "#F5F5F5",
                  zIndex: "99",
                }}
              >
                <tr>
                  <th>Exception Name</th>
                  <th>NMS Area</th>
                  <th>Severity</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {this.state.sel_a2.map((e) => {
                  return (
                    <tr>
                      <td>{e.name}</td>
                      <td>{e.area}</td>
                      <td>{e.sev}</td>
                      <td>{e.occur}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
            <div className="sd-div-head">{this.state.audit_2_id}</div>
          <div className="sd-div-table">
            
              
                <div className="sd-no-dev">
                    <h6>No Exceptions Found in this Audit</h6>
                </div>
              
            
          </div>
        </div>
      );
    const single_dev = this.state.sLoading ? (
      <div className="sel-div-lo">{loading}</div>
    ) : (
      <div className="sd-div-container">
        <div className="sd-div-left">{left_table}</div>
        <div className="sd-div-right">{right_table}</div>
      </div>
    );
    return (
      <div style={{ padding: "2% 2%" }}>
        <h4>Device: {this.state.dev_id}</h4>
        {single_dev}
      </div>
    );
  }
}
