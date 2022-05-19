function getRandomColor() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ",0.7)";
}


function chartjs_create_hardware_summary_graph(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas'></canvas>")
    var ctx = document.getElementById('graph_canvas');
    var ctx = document.getElementById('graph_canvas').getContext('2d');
    var ctx = $('#graph_canvas');

    data = JSON.parse(data)
    var data_lables = []
    var datapoint_data = []
    json = {data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < data.length ; i++){
      json["data"].push(parseInt(data[i]["Count"]))
      json["backgroundColor"].push(getRandomColor())
      data_lables.push(data[i]["Chassis_Type"])
    }
    datapoint_data.push(json)
    var chartjs_hardware_summary_donut = new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        rotation: -Math.PI,
        cutoutPercentage: 30,
        circumference: 2*Math.PI,
        legend: {
          display:true,
          position: 'left',
          labels:{
            fontSize:9
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'Hardware Summary Graph'
        }
      }
    })
}


function chartjs_create_software_summary_graph(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas1'></canvas>")
    var ctx = document.getElementById('graph_canvas1');
    var ctx = document.getElementById('graph_canvas1').getContext('2d');
    var ctx = $('#graph_canvas1');

    data = JSON.parse(data)
    var data_lables = []
    var datapoint_data = []
    json = {data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < data.length ; i++){
      json["data"].push(parseInt(data[i]["Count"]))
      json["backgroundColor"].push(getRandomColor())
      data_lables.push(data[i]["Software_Version"])
    }
    datapoint_data.push(json)
    var chartjs_software_summary_bar = new Chart(ctx,{
      type:'bar',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        scales: {
          yAxes: [{
            scaleLabel: {
            display: true,
            labelString: 'Number of Devices'

          },
        // min: 0,
        // max: 2,
        ticks: {
        // forces step size to be 50 units
        stepSize: 1,
        beginAtZero: true,
        // steps: 10,
        // stepValue: 5,
        // max: 100
        }

          }],
          xAxes: [{

          barPercentage: 0.8

          }]
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          }
        },
        legend: {
          display:false,
          position: 'left',
          labels:{
            fontSize:8
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'Software Summary Graph'
        }
      }
    })
}



function chartjs_create_severity_summary_graph(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas2'></canvas>")
    var ctx = document.getElementById('graph_canvas2');
    var ctx = document.getElementById('graph_canvas2').getContext('2d');
    var ctx = $('#graph_canvas2');

    var data_lables = []
    var datapoint_data = []
    json = {data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var key in data){
      json["data"].push(parseInt(data[key]))
      //json["backgroundColor"].push(getRandomColor())
      data_lables.push(key)
    }

    colors = ["rgba(0,188,235, 1)", "rgba(226,35,26, 1)", "rgba(251,171,24, 1)", "rgba(238,210,2,1)", "rgba(106,191,75, 1)"]
    json["backgroundColor"]=colors

    datapoint_data.push(json)
    var chartjs_severity_summary_donut = new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        rotation: -Math.PI,
        cutoutPercentage: 70,
        circumference: 2*Math.PI,
        legend: {
          display:true,
          position: 'left',
          labels:{
            fontSize:10
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'Severity Breakdown Graph'
        }
      }
    })
}




function chartjs_create_fccaps_bar_graph(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas3'></canvas>")
    var ctx = document.getElementById('graph_canvas3');
    var ctx = document.getElementById('graph_canvas3').getContext('2d');
    var ctx = $('#graph_canvas3');

    var data_lables = []
    var datapoint_data = []
    json = {data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var key in data){
      json["data"].push(parseInt(data[key]))
      json["backgroundColor"].push(getRandomColor())
      data_lables.push(key)
    }
    datapoint_data.push(json)
    var chartjs_fccaps_summary_bar = new Chart(ctx,{
      type:'bar',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        scales: {
          yAxes: [{
            barPercentage:0.5,
            scaleLabel: {
            display: true,
            labelString: 'Number of Exceptions'
            }
          }]
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          }
        },
        legend: {
          display:false,
          position: 'left',
          labels:{
            fontSize:10
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'FCCAPS Breakdown Graph'
        }
      }
    })
}



function chartjs_create_cpu_summary_graph(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas4'></canvas>")
    var ctx = document.getElementById('graph_canvas4');
    var ctx = document.getElementById('graph_canvas4').getContext('2d');
    var ctx = $('#graph_canvas4');

    data = JSON.parse(data)
    data.sort(function(a, b) {
    return parseFloat(b['Average CPU %']) - parseFloat(a['Average CPU %']);
    });
    var data_lables = []
    var datapoint_data = []
    json1 = {label:"Average CPU %", data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < 5 ; i++){
      json1["data"].push(parseInt(data[i]["Average CPU %"]))
      json1["backgroundColor"].push('rgba(0, 99, 132, 0.8)')
      data_lables.push(data[i]["Host Name (IP Address)"].split(" ")[0])
    }
    json2 = {label:"Peak 5-min CPU %", data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < 5 ; i++){
      json2["data"].push(parseInt(data[i]["Peak 5-min CPU %"]))
      json2["backgroundColor"].push('rgba(99, 132, 0, 0.8)')
      //data_lables.push(data[i]["Host Name (IP Address)"].split(" ")[0])
    }
    datapoint_data.push(json1)
    datapoint_data.push(json2)
    var chartjs_cpu_summary_bar = new Chart(ctx,{
      type:'bar',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        scales: {
          yAxes: [{
            barPercentage: 0.5,
            scaleLabel: {
              display: true,
              labelString: 'Percentage'
            }
          }]
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          }
        },
        legend: {
          display:true,
          position: 'top',
          labels:{
            fontSize:10
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'CPU Summary Graph - Highest Average CPU%'
        }
      }
    })
}



function chartjs_create_memory_summary_graph(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas5'></canvas>")
    var ctx = document.getElementById('graph_canvas5');
    var ctx = document.getElementById('graph_canvas5').getContext('2d');
    var ctx = $('#graph_canvas5');

    data = JSON.parse(data)
    data.sort(function(a, b) {
    return parseFloat(a['Free Memory(MB)']) - parseFloat(b['Free Memory(MB)']);
    });
    var data_lables = []
    var datapoint_data = []
    json1 = {label:"Free Memory(MB)", data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < 5 ; i++){
      json1["data"].push(parseInt(data[i]["Free Memory(MB)"]))
      json1["backgroundColor"].push('rgba(13,39,77, 0.8)')
      data_lables.push(data[i]["Host Name (IP Address)"].split(" ")[0])
    }
    json2 = {label:"Total Memory (MB)", data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < 5 ; i++){
      json2["data"].push(parseInt(data[i]["Total Memory (MB)"]))
      json2["backgroundColor"].push('rgba(0,188,235, 0.8)')
      //data_lables.push(data[i]["Host Name (IP Address)"].split(" ")[0])
    }
    datapoint_data.push(json1)
    datapoint_data.push(json2)
    var chartjs_memory_summary_bar = new Chart(ctx,{
      type:'bar',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        scales: {
          yAxes: [{
            barPercentage: 0.5,
            scaleLabel: {
              display: true,
              labelString: 'Memory in MB'
            }
          }]
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          }
        },
        legend: {
          display:true,
          position: 'top',
          labels:{
            fontSize:10
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'Memory Summary Graph - Lowest Free Memory'
        }
      }
    })
}




function chartjs_top_ten_devices(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas6' style='height:100%; width:100%'></canvas>")
    var ctx = document.getElementById('graph_canvas6');
    var ctx = document.getElementById('graph_canvas6').getContext('2d');
    var ctx = $('#graph_canvas6');
    var top_devices = {}
    var top_devices_arr = []
    for (var i = 0 ; i < data.length ; i++){
      if(data[i]["Host Name (IP Address)"] in top_devices){
        top_devices[data[i]["Host Name (IP Address)"]] = top_devices[data[i]["Host Name (IP Address)"]] + 1
      }
      else{
        top_devices[data[i]["Host Name (IP Address)"]] = 1
      }
    }
    for (var key in top_devices){
      top_devices_arr.push({"key" : key , "value" : top_devices[key]})
    }
    top_devices_arr.sort(function(a, b) {
      return parseFloat(b['value']) - parseFloat(a['value']);
      });
    var data_lables = []
    var datapoint_data = []
    graph_items = 10
    if(top_devices_arr.length < 10){
      graph_items = top_devices_arr.length
    }
    json1 = {label:"Number of exceptions", data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < graph_items ; i++){
      json1["data"].push(parseInt(top_devices_arr[i]["value"]))
      json1["backgroundColor"].push('rgba(0,188,235, 0.8)')
      data_lables.push(top_devices_arr[i]["key"].split(" ")[0])
    }
    datapoint_data.push(json1)
    var chartjs_memory_summary_bar = new Chart(ctx,{
      type:'bar',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        scales: {
          yAxes: [{
            barPercentage: 0.5,
            scaleLabel: {
              display: true,
              labelString: 'Number of exceptions'
            }
          }]
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          }
        },
        legend: {
          display:true,
          position: 'top',
          labels:{
            fontSize:10
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'Top 10 Devices with maximum exceptions'
        }
      }
    })
}



function chartjs_top_ten_exceptions(divElement, data){
    $("#"+divElement).html("")
    $("#"+divElement).html("<canvas id='graph_canvas7' style='height:100%; width:100%'></canvas>")
    var ctx = document.getElementById('graph_canvas7');
    var ctx = document.getElementById('graph_canvas7').getContext('2d');
    var ctx = $('#graph_canvas7');
    top_exceptions = {}
    top_exceptions_arr = []

    for (var i = 0 ; i < data.length ; i++){
      if(data[i]["Exception Name"] in top_exceptions){
        top_exceptions[data[i]["Exception Name"]] = top_exceptions[data[i]["Exception Name"]] + 1
      }
      else{
        top_exceptions[data[i]["Exception Name"]] = 1
      }
    }
    for (var key in top_exceptions){
      top_exceptions_arr.push({"key" : key , "value" : top_exceptions[key]})
    }
    top_exceptions_arr.sort(function(a, b) {
      return parseFloat(b['value']) - parseFloat(a['value']);
      });

    var data_lables = []
    var datapoint_data = []
    graph_items = 10
    if(top_exceptions_arr.length < 10){
      graph_items = top_exceptions_arr.length
    }
    json1 = {label:"Number of occurances", data:[],backgroundColor:[],borderColor: 'rgba(200, 200, 200, 0.75)',hoverBorderColor: 'rgba(200, 200, 200, 1.5)',}
    for(var i = 0 ; i < graph_items ; i++){
      json1["data"].push(parseInt(top_exceptions_arr[i]["value"]))
      json1["backgroundColor"].push('rgba(106,191,75, 0.8)')
      data_lables.push(top_exceptions_arr[i]["key"])
    }
    datapoint_data.push(json1)
    var chartjs_memory_summary_bar = new Chart(ctx,{
      type:'bar',
      data:{
        labels:data_lables,
        datasets:datapoint_data
      },
      options:{
        scales: {
          yAxes: [{
            barPercentage: 0.5,
            scaleLabel: {
              display: true,
              labelString: 'Number of occurances'
            }
          }]
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          }
        },
        legend: {
          display:true,
          position: 'top',
          labels:{
            fontSize:10
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
        title: {
        display: true,
        text: 'Top 10 exceptions'
        }
      }
    })
}
