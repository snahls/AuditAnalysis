import React, { useEffect } from "react";
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/css/Home.css"; //absolute import
import { useParams } from "react-router-dom";
import { Barbar } from "./ChartsJS/Bar";
import Highcharts from "highcharts/highstock";
import venn from "highcharts/modules/venn";
import HighchartsReact from "highcharts-react-official";

venn(Highcharts);
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/styles.css";

const Home = () => {
  //const navigate = useNavigate();

  let { dbName1, dbName2 } = useParams();

  //useStates for bar chart
  const [audit_1, setAudit_1] = React.useState([]); //for bar first customer
  const [audit_2, setAudit_2] = React.useState([]); // for bar second customer
  const [faultCount_data, setFaultCountData] = React.useState([]); // Fault Count Chart
  const [serviceProfile_data, setServiceProfileData] = React.useState([]); // Service Profile
  const [gears_data, setGearData] = React.useState([]); //  Hardware End of life
  const [total_data, setTotalData] = React.useState([]); // Insight Summary chart
  const [bp_data, setBpData] = React.useState([]); //best practice Summary
  const [log_data, setLogData] = React.useState([]); //Log Analysis
  

  //useStates for overview stats
  const [overviewAudit, setOverviewAudit] = React.useState([]); //for overview
  const [overviewAudit_data, setOverviewAuditData] = React.useState(0); // for overview create
  const [overview_Domain, setOverview_Domain] = React.useState(); // for domain
  const [overviewFI, setOverviewFI] = React.useState(); // for FI
  const [overviewChassis, setOverviewChassis] = React.useState(); // for Chassis
  const [overviewB_Server, setOverviewB_Server] = React.useState(); // for B_server
  const [overviewService_Profile, setOverviewService_Profile] = React.useState(); // for Service_Profile

  
  // TO fetch entire data
  useEffect(() => {
    //Customer 1 for bar chart data
    fetch("http://auditanalysis.cisco.com:8012/barchartdata?db_name=" + dbName1)
      .then((res) => {
       console.log("Bar Chart Data1",res);
        if (!res.ok) {
          console.log("first_user:NOT SUCCESS");
          throw new Error("First Customer: data not fetch");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("first_user_barchart", data);
        //alert("Customer 1 data" + JSON.stringify(data));
        setAudit_1(data);
        // return data;
      })
      .catch((error) => alert(error));

    //for second user bar chart data

    fetch("http://auditanalysis.cisco.com:8012/barchartdata?db_name=" + dbName2)
      .then((res) => {
        if (!res.ok) {
          console.log("second_user:NOT SUCCESS");
          throw new Error("Second Customer: data not fetch");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("second_user_barchart", data);
        //  alert(JSON.stringify(data));
        setAudit_2(data);
        //return data;
      })
      .catch((error) => alert(error));

    fetch(
      "http://auditanalysis.cisco.com:8012/comparestats?db_name1=" +
        dbName1 +
        "&db_name2=" +
        dbName2
    ) //  --> overview_stats_detail)
      .then((res) => {
        if (!res.ok) {
          console.log("Overview_user:NOT SUCCESS");
          throw new Error("Overview_user: data not fetch");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Overview_user", data);
        setOverviewAudit(data);
        //  alert(JSON.stringify(data));
        // console.log(data)
        //setOverviewService_Profile(data);

        //return data;
      })
      .catch((error) => alert(error));
  }, [dbName1,dbName2]); //useEffect ends here

  useEffect(() => {
    if (Object.keys(overviewAudit).length > 0) {
      if((overviewAudit['domain'][0]===overviewAudit['domain'][2])&&(overviewAudit['domain'][1]===overviewAudit['domain'][2])){
        const options1= {
          series: [{
            type: 'venn',
            data: [{
                sets: ['Common'],
                value:  overviewAudit["domain"][2],
                name:   overviewAudit["domain"][2],
                sname:'Common'                 
            }]
        }],
        credits: {
        enabled: false
        },
        colors:['#246F8E'],
         plotOptions: {
            venn: {
            borderColor:'',
        dataLabels: {
                    enabled: true,
                    style: {
                        textOutline: false,
                        fontSize:'15px',
                        color: "#fff"
                    }
                }}},
        tooltip: {
              headerFormat:
                '',  
             pointFormat: '{point.sname} : {point.value}',
             backgroundColor:'#000',
             style:{
             color:'#fff'
             }
        },
        title: {
        useHTML:true,
        margin:0,
        style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
            text: 'Domains'
        }
       
      };
      setOverview_Domain(options1);
      }
      else{
        const options1= {
          series: [{
            type: 'venn',
            data: [{
                sets: ['Audit 1'],
                value: overviewAudit["domain"][0],
                name:  overviewAudit["domain"][0] - overviewAudit["domain"][2],
                sname:'Audit 1'
                
            }, {
                sets: ['Audit 2'],
                value: overviewAudit["domain"][1],
                name:  overviewAudit["domain"][1] - overviewAudit["domain"][2],
                sname:'Audit 2'
                
            }, {
                sets: ['Audit 1', 'Audit 2'],
                value:  overviewAudit["domain"][2],
                name:   overviewAudit["domain"][2],
                sname:'Common'
                
                
            }]
        }],
        credits: {
        enabled: false
        },
        colors:['#00bceb','#0d274d','#246F8E'],
         plotOptions: {
            venn: {
            borderColor:'',
        dataLabels: {
                    enabled: true,
                    style: {
                        textOutline: false,
                        fontSize:'15px',
                        color: "#fff"
                    }
                }}},
        tooltip: {
              headerFormat:
                '',  
             pointFormat: '{point.sname} : {point.value}',
             backgroundColor:'#000',
             style:{
             color:'#fff'
             }
        },
        title: {
        useHTML:true,
        margin:0,
        style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
            text: 'Domains'
        }
       
      };
      setOverview_Domain(options1);
      }    
      
      if((overviewAudit['FI'][0]===overviewAudit['FI'][2])&&(overviewAudit['FI'][1]===overviewAudit['FI'][2])){
        const options2= {
          series: [{
            type: 'venn',
            data: [{
                sets: ['Common'],
                value:  overviewAudit["FI"][2],
                name:   overviewAudit["FI"][2],
                sname:'Common'                 
            }]
        }],
        credits: {
        enabled: false
        },
        colors:['#246F8E'],
         plotOptions: {
            venn: {
            borderColor:'',
        dataLabels: {
                    enabled: true,
                    style: {
                        textOutline: false,
                        fontSize:'15px',
                        color: "#fff"
                    }
                }}},
        tooltip: {
              headerFormat:
                '',  
             pointFormat: '{point.sname} : {point.value}',
             backgroundColor:'#000',
             style:{
             color:'#fff'
             }
        },
        title: {
        useHTML:true,
        margin:0,
        style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
            text: 'Fabric Interconnects'
        }
       
      };
      setOverviewFI(options2);
      }
      else{
      
    
    const options2= {
      series: [{
        type: 'venn',
        data: [{
            sets: ['Audit 1'],
            value:  overviewAudit["FI"][0] ,
            name:  overviewAudit["FI"][0] - overviewAudit["FI"][2] ,
            sname:'Audit 1'
            
        }, {
            sets: ['Audit 2'],
            value:  overviewAudit["FI"][1] ,
            name:  overviewAudit["FI"][1] -  overviewAudit["FI"][2] ,
            sname:'Audit 2'
            
        }, {
            sets: ['Audit 1', 'Audit 2'],
            value: overviewAudit["FI"][2] ,
            name:  overviewAudit["FI"][2] ,
            sname:'Common'
            
            
        }]
    }],
    credits: {
    enabled: false
    },
    colors:['#00bceb','#0d274d','#246F8E'],
     plotOptions: {
        venn: {
        borderColor:'',
    dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    fontSize:'15px',
                    color: "#fff"
                }
            }}},
    tooltip: {
          headerFormat:
            '',  
         pointFormat: '{point.sname} : {point.value}',
         backgroundColor:'#000',
         style:{
         color:'#fff'
         }
    },
    title: {
    useHTML:true,
        margin:0,
    style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
        text: 'Fabric Interconnects'
    }
    
    };
    setOverviewFI(options2);
  }
  if((overviewAudit['Chassis'][0]===overviewAudit['Chassis'][2])&&(overviewAudit['Chassis'][1]===overviewAudit['Chassis'][2])){
    const options3= {
      series: [{
        type: 'venn',
        data: [{
            sets: ['Common'],
            value:  overviewAudit["Chassis"][2],
            name:   overviewAudit["Chassis"][2],
            sname:'Common'                 
        }]
    }],
    credits: {
    enabled: false
    },
    colors:['#246F8E'],
     plotOptions: {
        venn: {
        borderColor:'',
    dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    fontSize:'15px',
                    color: "#fff"
                }
            }}},
    tooltip: {
          headerFormat:
            '',  
         pointFormat: '{point.sname} : {point.value}',
         backgroundColor:'#000',
         style:{
         color:'#fff'
         }
    },
    title: {
    useHTML:true,
        margin:0,
    style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
        text: 'Chassis'
    }
   
  };
  setOverviewChassis(options3);
  }
  else{
  
    const options3= {
      series: [{
        type: 'venn',
        data: [{
            sets: ['Audit 1'],
            value: overviewAudit["Chassis"][0],
            name:  overviewAudit["Chassis"][0] - overviewAudit["Chassis"][2],
            sname:'Audit 1'
            
        }, {
            sets: ['Audit 2'],
            value: overviewAudit["Chassis"][1],
            name:  overviewAudit["Chassis"][1] - overviewAudit["Chassis"][2],
            sname:'Audit 2'
            
        }, {
            sets: ['Audit 1', 'Audit 2'],
            value: overviewAudit["Chassis"][2],
            name: overviewAudit["Chassis"][2],
            sname:'Common'
            
            
        }]
    }],
    credits: {
    enabled: false
    },
    colors:['#00bceb','#0d274d','#246F8E'],
     plotOptions: {
        venn: {
        borderColor:'',
    dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    fontSize:'15px',
                    color: "#fff"
                }
            }}},
    tooltip: {
          headerFormat:
            '',  
         pointFormat: '{point.sname} : {point.value}',
         backgroundColor:'#000',
         style:{
         color:'#fff'
         }
    },
    title: {
    useHTML:true,
        margin:0,
    style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
        text: 'Chassis'
    }
    
    };
    setOverviewChassis(options3);
     
  }
  if((overviewAudit['Service_profile'][0]===overviewAudit['Service_profile'][2])&&(overviewAudit['Service_profile'][1]===overviewAudit['Service_profile'][2])){
    const options4= {
      series: [{
        type: 'venn',
        data: [{
            sets: ['Common'],
            value:  overviewAudit["Service_profile"][2],
            name:   overviewAudit["Service_profile"][2],
            sname:'Common'                 
        }]
    }],
    credits: {
    enabled: false
    },
    colors:['#246F8E'],
     plotOptions: {
        venn: {
        borderColor:'',
    dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    fontSize:'15px',
                    color: "#fff"
                }
            }}},
    tooltip: {
          headerFormat:
            '',  
         pointFormat: '{point.sname} : {point.value}',
         backgroundColor:'#000',
         style:{
         color:'#fff'
         }
    },
    title: {
    useHTML:true,
        margin:0,
    style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
        text: 'Service Profiles'
    }
   
  };
  setOverviewService_Profile(options4);
  }
  else{
  

    const options4= {
      series: [{
        type: 'venn',
        data: [{
            sets: ['Audit 1'],
            value: overviewAudit["Service_profile"][0],
            name:  overviewAudit["Service_profile"][0] - overviewAudit["Service_profile"][2],
            sname:'Audit 1'
            
        }, {
            sets: ['Audit 2'],
            value: overviewAudit["Service_profile"][1],
            name:  overviewAudit["Service_profile"][1] - overviewAudit["Service_profile"][2],
            sname:'Audit 2'
            
        }, {
            sets: ['Audit 1', 'Audit 2'],
            value: overviewAudit["Service_profile"][2],
            name:  overviewAudit["Service_profile"][2],
            sname:'Common'
            
            
        }]
    }],
    credits: {
    enabled: false
    },
    colors:['#00bceb','#0d274d','#246F8E'],
     plotOptions: {
        venn: {
        borderColor:'',
    dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    fontSize:'15px',
                    color: "#fff"
                }
            }}},
    tooltip: {
          headerFormat:
            '',  
         pointFormat: '{point.sname} : {point.value}',
         backgroundColor:'#000',
         style:{
         color:'#fff'
         }
    },
    title: {
    useHTML:true,
        margin:0,
    style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
        text: 'Service Profiles'
    }
    
    };
    setOverviewService_Profile(options4);
   
  }
  if((overviewAudit['B_Server'][0]===overviewAudit['B_Server'][2])&&(overviewAudit['B_Server'][1]===overviewAudit['B_Server'][2])){
    const options5= {
      series: [{
        type: 'venn',
        data: [{
            sets: ['Common'],
            value:  overviewAudit["B_Server"][2],
            name:   overviewAudit["B_Server"][2],
            sname:'Common'                 
        }]
    }],
    credits: {
    enabled: false
    },
    colors:['#246F8E'],
     plotOptions: {
        venn: {
        borderColor:'',
    dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    fontSize:'15px',
                    color: "#fff"
                }
            }}},
    tooltip: {
          headerFormat:
            '',  
         pointFormat: '{point.sname} : {point.value}',
         backgroundColor:'#000',
         style:{
         color:'#fff'
         }
    },
    title: {
    useHTML:true,
        margin:0,
    style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
        text: 'Servers'
    }
   
  };
  setOverviewB_Server(options5);
  }
  else{
  
    const options5= {
      series: [{
        type: 'venn',
        data: [{
            sets: ['Audit 1'],
            value: overviewAudit["B_Server"][0],
            name:  overviewAudit["B_Server"][0] - overviewAudit["B_Server"][2],
            sname:'Audit 1'
            
        }, {
            sets: ['Audit 2'],
            value: overviewAudit["B_Server"][1],
            name:  overviewAudit["B_Server"][1] - overviewAudit["B_Server"][2],
            sname:'Audit 2'
            
        }, {
            sets: ['Audit 1', 'Audit 2'],
            value: overviewAudit["B_Server"][2],
            name:  overviewAudit["B_Server"][2],
            sname:'Common'
            
            
        }]
    }],
    credits: {
    enabled: false
    },
    colors:['#00bceb','#0d274d','#246F8E'],
     plotOptions: {
        venn: {
        borderColor:'',
    dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    fontSize:'15px',
                    color: "#fff"
                }
            }}},
    tooltip: {
          headerFormat:
            '',  
         pointFormat: '{point.sname} : {point.value}',
         backgroundColor:'#000',
         style:{
         color:'#fff'
         }
    },
    title: {
    useHTML:true,
        margin:0,
    style:{ "color": "black", "fontSize": "15px",fontWeight:'bold',backgroundColor:'#eed202',padding:'5px 15px' },
        text: 'Servers'
    }
    };
    setOverviewB_Server(options5);
    
  }  
  if(overviewAudit.domain.length || overviewAudit.Chassis.length || overviewAudit.FI.length || overviewAudit.Service_profile.length || overviewAudit.B_Server.length)
      setOverviewAuditData(1);
    }
  }, [overviewAudit]);

  // To create all chart data
  useEffect(() => {
    console.log("Create Bar chart ", audit_1);

    // Bar Chart only
    if (
      audit_1 !== null &&
      audit_2 !== null &&
      audit_1.length > 0 &&
      audit_2.length > 0
    ) {
     const barKeys1 = Object.keys(audit_1[0]);
     const barKeys2 = Object.keys(audit_2[0]);

      console.log("Bar Keys 1 : ", barKeys1, barKeys1[0]);
      console.log("Bar Keys 2 : ", barKeys2, barKeys2[0]);
      
      setFaultCountData(assembleDataCopy(barKeys1,barKeys2,"fault"));

      setServiceProfileData(assembleDataCopy(barKeys1,barKeys2,"SP_counter"));

      setGearData(assembleDataCopy(barKeys1,barKeys2,"LDoSStats"));

      setTotalData(assembleDataCopy(barKeys1,barKeys2,"total"));

      setBpData(assembleDataCopy(barKeys1,barKeys2,"bp"));

      setLogData(assembleDataCopy(barKeys1,barKeys2,"bdb"));
    } // create barchart data ends here

    function assembleDataCopy(barKeys1,barKeys2,attribute) {
      var audit = [];
      var dict = {};
      if (barKeys1.includes(attribute) && barKeys2.includes(attribute)) {
        var data1 = audit_1[0][attribute];
        var data2 = audit_2[0][attribute];
        var size = Object.keys(data1).length;
        console.log("Assemble data size", size);
        var keys1 = Object.keys(data1);
        var keys2 = Object.keys(data2);
        keys1.sort();
        keys2.sort();
        console.log("Assemble data keys ", keys1, keys2);
        // return assembleData(data1, data2, keys1, keys2, size);
        for (let i = 0; i < size; i++) {
          if (keys1.includes(keys2[i]) && keys2.includes(keys1[i])) {
            dict = {
              label: keys1[i],
              Audit1: data1[keys1[i]],
              Audit2: data2[keys2[i]],
            };
            audit.push(dict);
          }
          if (!keys1.includes(keys2[i])) {
            dict = {
              label: keys2[i],
              Audit1: 0,
              Audit2: data2[keys2[i]],
            };
            audit.push(dict);
          }
          if (!keys2.includes(keys1[i])) {
            dict = {
              label: keys1[i],
              Audit1: data1[keys1[i]],
              Audit2: 0,
            };
            audit.push(dict);
          }
        }
      } else if (!barKeys1.includes(attribute) && barKeys2.includes(attribute)) {
        const data2 = audit_2[0][attribute];
  
        for (let i in data2) {
          dict = {
            label: i,
            Audit1: 0,
            Audit2: data2[i],
          };
          audit.push(dict);
        }
      } else if (barKeys1.includes(attribute) && !barKeys2.includes(attribute)) {
        const data1 = audit_1[0][attribute];
        for (let i in data1) {
          dict = {
            label: i,
            Audit1: data1[i],
            Audit2: 0,
          };
          audit.push(dict);
        }
      }
      return audit;
    }
  

  }, [audit_1, audit_2]);

 

  return (
    <>
          <div className="full_block_home">

      <div className="row base-margin-bottom">
        <div className="col-1">{/* <SideBar_Header/> */}</div>
        {/* the overview stats display starts here */}
        <div id="content-part" className="col-11">
    
          <div className="App">
            <br/><br/><br/>            
            <div className="legend_css">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              
                <div className="row base-margin-bottom">
                  <div className="col-4">
                    <div className="row base-margin-bottom">
                      <div className="col-7">Audit 1</div>
                      <div className="col-5">
                        <div className="rectangle1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="row base-margin-bottom">
                      <div className="col-7">Audit 2</div>
                      <div className="col-5">
                        <div className="rectangle2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row base-margin-bottom">
                      <div className="col-7">Common</div>
                      <div className="col-5">
                        <div className="rectangle3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              
            </div>
            
          </div>
          <div className="row">
            <div className='col-4'>
            <div className='vennd_box'>{( overviewAudit_data === 0 )&& (<span className="label">No Data</span>)}{(overviewAudit_data===1) && <HighchartsReact containerProps={{ style: { height: "300px" } }} highcharts={Highcharts} options={overview_Domain} />}</div>
            </div>
            <div className='col-4'>
            <div className='vennd_box'>{( overviewAudit_data === 0 )&& (<span className="label">No Data</span>)}{(overviewAudit_data===1) && <HighchartsReact containerProps={{ style: { height: "300px" } }} highcharts={Highcharts} options={overviewChassis} />}</div>
            </div>
            <div className='col-4'>
            <div className='vennd_box'>{( overviewAudit_data === 0 )&& (<span className="label">No Data</span>)}{(overviewAudit_data===1) &&<HighchartsReact containerProps={{ style: { height: "300px" } }} highcharts={Highcharts} options={overviewFI} />}</div>
            </div>
          </div><br/><br/>
            <div className='row' style={{marginLeft:'15%',marginRight:'15%'}}>
            <div className='col-6'>
            <div className='vennd_box'>{( overviewAudit_data === 0 )&& (<span className="label">No Data</span>)}{(overviewAudit_data===1) &&<HighchartsReact containerProps={{ style: { height: "300px" } }} highcharts={Highcharts} options={overviewService_Profile} />}</div>
            </div>
            <div className='col-6'>
            <div className='vennd_box'>{( overviewAudit_data === 0 )&& (<span className="label">No Data</span>)}{(overviewAudit_data===1) && <HighchartsReact containerProps={{ style: { height: "300px" } }} highcharts={Highcharts} options={overviewB_Server} />}</div>
            </div></div>
      <br/><br/>

          <div className="row">
            <div className="col-6">
              <div className="venn_box">
              <Barbar
                details={{
                  data: total_data,
                  title: "Insight Summary",
                }}
              ></Barbar>
              </div>
            </div>

            <div className="col-6">
            <div className="venn_box">
              <Barbar
                details={{
                  data: gears_data,
                  title: "Hardware End of life",
                }}
              ></Barbar></div>
            </div>
          </div>

          <br /><br/>

          <div className="row">
            <div className="col-6">
            <div className="venn_box">
              <Barbar
                details={{
                  data: faultCount_data,
                  title: "Fault Count",
                }}
              ></Barbar></div>
            </div>

            <div className="col-6">
            <div className="venn_box">
              <Barbar
                details={{
                  data: serviceProfile_data,
                  title: "Service Profile Association",
                }}
              ></Barbar></div>
            </div>
          </div>

          <br />
          <br />

          <div className="row">
            <div className="col-6">
            <div className="venn_box">
              <Barbar
                details={{
                  data: bp_data,
                  title: "Best Practices",
                }}
              ></Barbar> </div>
            </div>
            <div className="col-6">
            <div className="venn_box">
              <Barbar
                details={{
                  data: log_data,
                  title: "Log Analysis",
                }}
              ></Barbar></div>
            </div>
          </div>
        <br/><br/>
        </div>
      </div>
      </div>
    </>
  );
};

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Home />, rootElement);
export default Home;
