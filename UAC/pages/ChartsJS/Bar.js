import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/css/Home.css"; //absolute import
export const Barbar = (props)=>{
    return(
        <>
        <span className="label label--warning-alt"><b>{props.details.title}</b></span>
              {( props.details.data.length === 0 )&& (<span className="label">No Data</span>)}
              {props.details.data.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
              <BarChart data={props.details.data} margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 5
              }}>
                
                <XAxis dataKey="label" tick={{ fontSize: '14px',fill:'black' }} interval={0} />
                
                <Tooltip />
                {/* <Legend /> */}
              
                <Bar dataKey="Audit1"  fill ="#00bceb" />
                <Bar dataKey="Audit2"  fill="#0d274d" />
              </BarChart>
              </ResponsiveContainer>
            )}
        </>
    )
}