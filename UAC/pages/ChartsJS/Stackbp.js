import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/css/Home.css"; //absolute import

var globalVariable={
  bar: 0,
  click: false
};

const Bar_stack = (props)=>{
  
    return(
        <>
        {(props.details.data === null )&& (<span className="label label--info bar_label">Either or Both Audit 1 and Audit2 Not Available</span>)}
              {( props.details.data.length === 0 )&& (<span className="label label--info bar_label">Select a Domain from Dropdown list</span>)}
              {props.details.data.length > 0 && (
              <BarChart width={800} height={500} data={props.details.data}margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                
                <XAxis dataKey="label" className="label-font" />
                <YAxis />
                
                <Tooltip />
                <Bar dataKey={props.details.dataKey} stackId="a" fill="#00bceb" onClick={(d,i)=>{globalVariable.bar = i; globalVariable.click = true; console.log("Stack BP : ", i, globalVariable.bar, globalVariable.click)}}  />
                <Bar dataKey={props.details.dataKey} stackId="a" fill="orange" onClick={(d,i)=>{globalVariable.bar = i; globalVariable.click = true; console.log("Stack BP : ", i, globalVariable.bar, globalVariable.click)}}  />
                <Bar dataKey={props.details.dataKey} stackId="a" fill="#0d274d" onClick={(d,i)=>{globalVariable.bar = i; globalVariable.click = true; console.log("Stack BP : ", i, globalVariable.bar, globalVariable.click)}}  />
               
              </BarChart>
            )}

            
          

        </>
    )

}
export{Bar_stack , globalVariable};