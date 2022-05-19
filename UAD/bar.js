let statsdata;
let dat;
$(document).ready(function(){
    Bardata();
})

var i=-1;
function getRandomColor() {  
    var col=['#00bceb','#1e4471', '#6abf4b','#eed202','#495057'];  
    if(i>=5){
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ",0.8)";
  }
  else{
    i=i+1;
    return col[i];
  }
}

function Bardata(){
    $.ajax({
        url: "http://auditanalysis.cisco.com:8012/barchartdata?db_name="+db_name,
        type: "GET",
        success : function(text)
         {
            statsdata= text;
            //alert(statsdata)
            console.log("Stats DATA fetched from server is:"+statsdata)
            dat = JSON.parse(statsdata)[0]

            console.log("Stats DATA after parsing becomes:"+dat)

            let myChart1 = document.getElementById("myChart").getContext('2d');

            // let insightcount=[]
            // let labels1 = ['High','Medium', 'Low','Info-only'];

            // insightcount.push(dat["total"]["High"])
            // insightcount.push(dat["total"]["Medium"])
            // insightcount.push(dat["total"]["Low"])
            // insightcount.push(dat["total"]["Info-only"])

            var labels1 = []
            var insightcount = []
            json1 = {data:[],backgroundColor:[],}
            for(var key in dat['total']){
                json1["data"].push(parseInt(dat['total'][key]))
                json1["backgroundColor"].push(getRandomColor())
                labels1.push(key)
            }  
            i=-1
            insightcount.push(json1)


            // let colors1 = ['#00bceb','#1e4471', '#6abf4b','#eed202','#495057'];

            let chart1 = new Chart(myChart1,{
                type: 'doughnut',
                data:{
                    labels: labels1,
                    datasets: insightcount
                
                },
                options:{
                    title:{
                        /*text: "Do you like Doughnut?",*/
                        display: true
                    },
                    legend:{
                        display: true

                    }
                }
                

            });
            

                        // for Fault Count
            let myChart3 = document.getElementById("myChart3").getContext('2d');

            // let labels3 = ['High','Medium','Low','Info-only'];
            // let faultdata = [];

            // faultdata.push(dat["fault"]["High"])
            // faultdata.push(dat["fault"]["Medium"])
            // faultdata.push(dat["fault"]["Low"])
            // faultdata.push(dat["fault"]["Info-only"])

            //alert(faultdata)
            //let data3 = faultdata;
            //let data3 = [14, 8, 4, 5];

            var labels3 = []
            var faultdata = []
            

            json3 = {data:[],backgroundColor:[],}
            for(var key in dat['fault']){
                json3["data"].push(parseInt(dat['fault'][key]))
                json3["backgroundColor"].push(getRandomColor())
                labels3.push(key)
            }  
            i=-1
            faultdata.push(json3)

            // let colors3 = ['#00bceb','#1e4471', '#6abf4b','#eed202'];

            let chart3 = new Chart(myChart3,{
                type: 'doughnut',
                data:{
                    labels: labels3,
                    datasets:faultdata
                        
                },
                options:{
                    title:{
                        //text: "Fault COUNTS"
                        display: true
                    },
                    legend:{
                        display: true

                    }
                }
                

            });
            // Service Profile DATA

            let myChart4 = document.getElementById("myChart4").getContext('2d');

            // let labels4 = ['Associated', 'Un-Associated'];
            // let spdata = [];

            // spdata.push(dat["SP_counter"]["associated"])
            // spdata.push(dat["SP_counter"]["unassociated"])

            var labels4 = []
            var spdata = []
           
            json4 = {data:[],backgroundColor:[],}
            for(var key in dat['SP_counter']){
                json4["data"].push(parseInt(dat['SP_counter'][key]))
                json4["backgroundColor"].push(getRandomColor())
                labels4.push(key)
            }  
            i=-1
            spdata.push(json4)
            
            // let colors4 = ['#00bceb','#1e4471'];

            let chart4 = new Chart(myChart4,{
                type: 'pie',
                data:{
                    labels: labels4,
                    datasets:spdata                        
                },
                options:{
                    title:{
                        //text: "Fault COUNTS"
                        display: true
                    },
                    legend:{
                        display: true

                    }
                }
                

            });

            // BP Stats DATA
            let myChart5 = document.getElementById("myChart5").getContext('2d');

            var labels5 = []
            var bpdata = []

            json5 = {data:[],backgroundColor:[],}
            for(var key in dat['bp']){
                json5["data"].push(parseInt(dat['bp'][key]))
                json5["backgroundColor"].push(getRandomColor())
                labels5.push(key)
            }  
            i=-1
            bpdata.push(json5)
                

            // let labels5 = ['High','Medium','Low'];

            // let bpdata = [];

            // bpdata.push(dat["bp"]["High"])
            // bpdata.push(dat["bp"]["Medium"])
            // bpdata.push(dat["bp"]["Low"])

            //let data5 = bpdata;

            //let data5 = [6,13,8];
            // let colors5 = ['#00bceb','#1e4471', '#6abf4b'];

            let chart5 = new Chart(myChart5,{
                type: 'doughnut',
                data:{
                    labels: labels5,
                    datasets:bpdata
                },
                options:{
                    title:{
                        //text: "Best Practice"
                        display: true
                    },
                    legend:{
                        display: true

                    }
                }
                

            });

            // BP Stats DATA
            let myChart6 = document.getElementById("myChart6").getContext('2d');

            // let labels6 = ['High','Medium','Low','Info-only'];

            // let bdbdata = [];

            // bdbdata.push(dat["bdb"]["High"])
            // bdbdata.push(dat["bdb"]["Medium"])
            // bdbdata.push(dat["bdb"]["Low"])
            // bdbdata.push(dat["bdb"]["Info-only"])
            var labels6 = []
            var bdbdata = []
            json6 = {data:[],backgroundColor:[],}
            for(var key in dat['bdb']){
                json6["data"].push(parseInt(dat['bdb'][key]))
                json6["backgroundColor"].push(getRandomColor())
                labels6.push(key)
            }  
            i=-1
            bdbdata.push(json6)
            //let data5 = bpdata;

            //let data5 = [6,13,8];
            // let colors6 = ['#00bceb','#1e4471', '#6abf4b','#eed202'];

            let chart6 = new Chart(myChart6,{
                type: 'doughnut',
                data:{
                    labels: labels6,
                    datasets: bdbdata
                },
                options:{
                    title:{
                        //text: "Best Practice"
                        display: true
                    },
                    legend:{
                        display: true

                    }
                }
                

            });

                        // For EOL Chart
            let myChart2 = document.getElementById("myChart2").getContext('2d');

            // let labels2 = ['LDoS Reached','LDoS in 1 Year', 'LDoS in 2 Years','LDoS in 3 Years', 'LDoS in 4 Years'];
            // let eoldata = [];

            // eoldata.push(dat["LDoSStats"]["LDoS Reached"])
            // eoldata.push(dat["LDoSStats"]["LDoS in 1 Year"])
            // eoldata.push(dat["LDoSStats"]["LDoS in 2 Years"])
            // eoldata.push(dat["LDoSStats"]["LDoS in 3 Years"])
            // eoldata.push(dat["LDoSStats"]["LDoS in 4 Years"])
            //alert(eoldata)
            var labels2 = []
            var eoldata = []
            json2 = {data:[],backgroundColor:[],}
            for(var key in dat['LDoSStats']){
                json2["data"].push(parseInt(dat['LDoSStats'][key]))
                json2["backgroundColor"].push(getRandomColor())
                labels2.push(key)
            }  
            i=-1
            eoldata.push(json2)

            // let colors2 = ['#00bceb','#1e4471', '#6abf4b','#eed202','#495057'];

            let chart2 = new Chart(myChart2,{
                type: 'doughnut',
                data:{
                    labels: labels2,
                    datasets:eoldata
                },
                options:{
                    title:{
                        //text: "Fault COUNTS"
                        display: true
                    },
                    legend:{
                        display: true

                    }
                }
                

            });

        },
    })

    $.get("http://auditanalysis.cisco.com:8012/insightsummary?db_name="+db_name, function(data, status){
            in_summary=data;
            console.log("Insight DATA fetched from server is:"+in_summary)
            summary_parsed_data=JSON.parse(in_summary)
            table_heading =  "<th>ID</th>\
                            <th>Domain</th>\
                            <th>Insight</th>\
                            <th>Severity</th>\
                            <th>Class</th>"
                            
            table_start = "<table id='summary_table' class='table table--striped table--loose table--fixed table--wrapped '>"
            table_head_start ="<thead>"
            table_head_end = "</thead>"
            table_body_start = "<tbody>"
            table_body_end = "</tbody>"
            table_end = "</table>"
            
            var keys = Object.keys(summary_parsed_data[0]);

            Html=""
            for(var i=0; i<summary_parsed_data.length;i++){
                Html=Html+"<tr>"
                for(var j=0; j<keys.length;j++){
                    Html = Html+ "<td> "+summary_parsed_data[i][keys[j]]+" </td>"
                }
                Html=Html+"</tr>"
            }
            table_data = table_start+table_head_start+table_heading+table_head_end+Html+table_end
            $("#summary_table_container").empty()
            $("#summary_table_container").append(table_data)
            $("#summary_table").DataTable()

            $("#insight_summary_table").html(table_data)
        });

}















