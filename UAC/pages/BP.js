import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, Legend, Tooltip } from "recharts";
import React, { useEffect } from "react";
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/css/BP.css";
import { globalVariable } from "./ChartsJS/Stackbp";
import TableBP from "./ChartsJS/TableBP";
import $ from 'jquery';
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/node_modules/bootstrap/dist/css";
$(document).on("dblclick", ".editable",function(){
            
  var row = $(this).closest('tr');
  
  var Code=row.find("td:eq(2)").text();

  
  $('.modal_text').val(Code);
  
  $('#editpopup').fadeIn();
});
// $('.close').on('click',function(){
// $('#editpopup').fadeToggle();
// });

function BP() {
  let { dbName1, dbName2 } = useParams();
  // console.log(dbName1, dbName2);
  const [bp_1, setBp_1] = React.useState([]); //for first customer
  const [bp_2, setBp_2] = React.useState([]); // for second customer
  const [unique_domain, setUniqueDomain] = React.useState([]);
  const [selectDomain, setSelectDomain] = React.useState('');
  const [result, setResult] = React.useState([]);
  const [barGraphData, setBarGraphData] = React.useState([]);
  const [selectedBar, setSelectedBar] = React.useState(0);
  const [position, setSeverityPosition] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [tableLabel, setTableLabel] = React.useState([]);

  var Label_list=['High','Low','Medium','Need to fill by NCE'];
  
//   $(document).on("dblclick", ".editable",function(){
            
//     var row = $(this).closest('tr');
    
//     var Code=row.find("td:eq(2)").text();

    
//     $('.modal_text').val(Code);
    
//     $('#editpopup').fadeToggle();
// });
// $('.close').on('click',function(){
//   $('#editpopup').fadeToggle();
// });
const handleClose = () =>{
  $('#editpopup').fadeOut();
}
  var domain_name;
  useEffect(() => {
    //Customer 1 for bar chart data
    fetch("http://auditanalysis.cisco.com:8012/statsdata?db_name=" + dbName1)
      .then((res) => {
        console.log("BP1 --> First Then", res);
        if (!res.ok) {
          console.log("first_user:NOT SUCCESS");
          throw new Error("First Customer: data not fetch");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("first_user_BP", data);
        setBp_1(data);
      })
      .catch((error) => alert(error));

    //for second user bar chart data
    fetch("http://auditanalysis.cisco.com:8012/statsdata?db_name=" + dbName2)
      .then((res) => {
        if (!res.ok) {
          console.log("second_user: NOT SUCCESS");
          throw new Error("Second Customer: data not fetch");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("second_user_BP", data);
        setBp_2(data);
      })
      .catch((error) => alert(error));
  }, [dbName1,dbName2]); //useEffect ends here

  useEffect(() => {
    //To get the unique domains
    if (bp_1 !== null && bp_2 !== null && bp_1.length > 0 && bp_2.length > 0) {
      const uniqueDomain = new Set();
      console.log(bp_1.length);

      //get unique domains from first user
      var domain = [];
      domain = bp_1[0]["domain"]["Name"];
      for (let i = 0; i < domain.length; i++) {
        uniqueDomain.add(domain[i]);
      }

      //get unique domains from second user
      domain = bp_2[0]["domain"]["Name"];
      for (let i = 0; i < domain.length; i++) {
        uniqueDomain.add(domain[i]);
      }

      console.log("Unique Domain", uniqueDomain, uniqueDomain.size);
      //To get the unique domain in dropdox we need it in dictionary form.
      var list = [];
      let i = 0;
      for (let elem of uniqueDomain) {
        var dict = {
          key: i,
          value: elem,
        };
        list.push(dict);
        i = i + 1;
      }
      

      setUniqueDomain(list);
      setSelectDomain(list[0]['value']); //default domain value
      

    }
  }, [bp_1, bp_2]);

  const getDomainName = (e) => {
    domain_name = document.getElementById("domain").value;
    setSelectDomain(domain_name);  //after submitting domain
    //console.log("Domain Name : ", domain_name);
   //fetchData();
  };

  useEffect(() => {

    if(selectDomain !== '')
    {
      console.log("Selected Domain : ", selectDomain);
    fetch(
      "http://auditanalysis.cisco.com:8012/comparebpdata?db_name1=" +
        dbName1 +
        "&db_name2=" +
        dbName2 +
        "&domain=" +
        selectDomain
    )
      .then((res) => {
        if (!res.ok) {
          console.log("Fetch :  NOT SUCCESS");
          throw new Error("Data aint fetch ");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Data Fetch Result", data);
        if(data.length===0){
          alert("No Data Available For Chosen Domain ");
          
        }
        setResult(data);
      })
      .catch((error) => alert(error));

    //collect data for bar graph
    //assemblebarGraphData();
    }
  }, [dbName1,dbName2,selectDomain]);

  useEffect(() => {
  var high_index = 0,
    low_index = 0,
    medium_index = 0,
    nce_index = 0;
  var indexes = [];

  //const assemblebarGraphData = () => {
    //alert("Selected Domain : ", selectDomain);
    if (result.length > 0) {
      var barData = [
        { label: "High", Audit1: 0, Audit2: 0, Common: 0 },
        { label: "Low", Audit1: 0, Audit2: 0, Common: 0 },
        { label: "Medium", Audit1: 0, Audit2: 0, Common: 0 },
        { label: "Need to fill by NCE", Audit1: 0, Audit2: 0, Common: 0 },
      ];

      for (let i = 0; i < result.length; i++) {
        var risk = result[i]["Severity"];
        for (let j = 0; j < barData.length; j++) {
          if (barData[j]["label"].localeCompare(risk) === 0) {
            barData[j][result[i]["Type"]]++;
          }
        }
        if (risk.localeCompare("High") === 0) {
          high_index++;
        } else if (risk.localeCompare("Low") === 0) {
          low_index++;
        } else if (risk.localeCompare("Medium") === 0) {
          medium_index++;
        } else if (risk.localeCompare("Need to fill by NCE") === 0) {
          nce_index++;
        }
      }
      console.log("Bar Data : ", barData);
      console.log("indexes : ", high_index, low_index, medium_index, nce_index);
      setBarGraphData(barData);
      indexes.push(high_index);
      indexes.push(high_index + low_index);
      indexes.push(high_index + low_index + medium_index);
      indexes.push(high_index + low_index + medium_index + nce_index);
      setSeverityPosition(indexes);
    }
  },[result]);

  // useEffect(() => {
  //   if (globalVariable.click) {
  //     console.log(globalVariable.bar);
  //     setSelectedBar(globalVariable.bar);
  //   }
  //  }, []);

  useEffect(() => {
    //Type, Observation, recommendation
    if (position.length === 4) {
      let start = 0,
        end = position[selectedBar];
      let tableBp = [];
      if (selectedBar !== 0) {
        start = position[selectedBar - 1];
      }
      console.log(
        "Inside Get Table data i , start, end",
        globalVariable.bar,
        start,
        end
      );
      for (let i = start; i < end; i++) {
        tableBp.push({
          Type: result[i]["Type"],

          Observation: result[i]["Observation"],
          Recommendation: result[i]["Recommendation"],
        });
      }
      console.log("Table data : ", tableBp);
      setTableData(tableBp);
      setTableLabel(Label_list)
    }
  }, [selectedBar, position]);

  return (
    <>

<div id='editpopup'>
    <textarea cols='45' style = {{height: 300}}  className='input-data modal_text'></textarea>
    <button  onClick={handleClose}>close</button>
</div>
      <div className="full_block">
        {/* <div className="row base-margin-bottom"> */}
        {/* <div className="col-2">for the spacing </div>           */}

        {/* Choosing the domain panel starts here */}
        <div>
          <br /><br/><br/>
          {/* <div className="panel panel--loose panel--secondary dbl-padding">
            <div className="row">
              <div className="col-md-7">
                <h1 className="display-0">
                  <span>
                    Best<span className="text-primary">Practices</span>
                  </span>
                </h1>
              </div>
              <div className="col-md-5">
              </div>
            </div>
          </div> */}
          
          {/*       <div className="col-10">    */}
          <center>
            <div className="panel panel--raised">
            <center>
            <div className="col-md-12 base-margin-bottom">
              <div className="panel panel--info">
                <center>
          
                  <h4>
                    <b>Best Practices</b>
                  </h4>
                </center>
              </div>
            </div>
          </center>
              <div className="box_domain">
                <div className="row base-margin-bottom">
                  <div className="col-4">
                    <h5>
                      <b>Select the Domain:</b>
                    </h5>
                  </div>
                  <div className="col-4">
                    {/* code for the dropdown starts here */}
                    <select name="domain" className="domain" id="domain" onChange={getDomainName}>
                      {/* <option>Select Domain Value</option> */}

                      {unique_domain.map((item) => (
                        <option key={item.key} value={item.value}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                    {/* code for the dropdown ends here */}
                  </div></div>
              </div>
            </div>
            <br /> <br /> 
            {/* panel for graph display */}
            <div className="panel panel--raised  content_blocks">
              {/* <span className="subheader">Graph comes here</span> */}
              {/* <Bar_stack
                details={{
                  title: "Stacked Graph",
                  data: barGraphData,
                }}
                /> */}

              {/* {barGraphData.length == 0 && (
                <span className="label label--info bar_label">
                  Select a Domain from Dropdown list
                </span>
              )} */}

              {barGraphData.length > 0 && (
                <BarChart
                  width={800}
                  height={500}
                  data={barGraphData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="label" className="label-font" />
                  {/* <YAxis /> */}

                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Audit1"
                    stackId="a"
                    fill="#00bceb"
                    onClick={(d, i) => {
                      setSelectedBar(i);
                      console.log("Stack BP : ", i, selectedBar);
                    }}
                  />
                  <Bar
                    dataKey="Common"
                    stackId="a"
                    fill="#246F8E"
                    onClick={(d, i) => {
                      setSelectedBar(i);
                      console.log("Stack BP : ", i, selectedBar);
                    }}
                  />
                  <Bar
                    dataKey="Audit2"
                    stackId="a"
                    fill="#0d274d"
                    onClick={(d, i) => {
                      setSelectedBar(i);
                      console.log("Stack BP : ", i, selectedBar);
                    }}
                  />
                </BarChart>
              )}


              {/* {(globalVariable.click ) && getTableData()} */}
            </div>
            {/* panel for graph display ends here*/}
            <br />
            <br />
            {/* panel for table display starts here */}
            <div className="panel panel--raised " id="table_div">
              {/* <span className="subheader">Table comes here</span> */}
              {tableData.length > 0 && (
                <TableBP
                  details={{
                    page: "bp",
                    bar: selectedBar,
                    data: tableData,
                    list: tableLabel,
                  }}
                />
              )}
            </div>
            {/* panel for table display ends here*/}
          </center>
        </div>
        <br />
        <br />
        {/* Choosing the domain panel ends here */}
        {/* </div> */}
      </div>
    </>
  );
}

export default BP;
