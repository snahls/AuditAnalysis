import React from 'react'
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/css/Home.css"; 
// import "/home/uad/UAD_Comparator/UAD_Audit_Comparator/src/css/TableBP.css";

 const TableBP = (props) => {

//   $(document).on("dblclick", ".editable",function(){
            
//     var row = $(this).closest('tr');
    
//     var Code=row.find("td:eq(2)").text();

    
//     $('.modal_text').val(Code);
    
//     $('#editpopup').fadeToggle();
// });
// $('.close').on('click',function(){
//   $('#editpopup').fadeToggle();
// });
    // get table column
     const column = Object.keys(props.details.data[0]);
     // get table heading data
     const ThData =()=>{
        
         return column.map((data)=>{
             return <th style={{width: 2+'%' }} key={data}>{data}</th>
         })
     }
    // get table row data
    const tdData =() =>{
           
         return props.details.data.map((data)=>{
           return(
               <tr key={data['Recommendation']+data['Observation']+data['Code']}>
                    {
                       column.map((v)=>{
                           return <td   className = 'editable' style={{maxWidth: '100px'}} key={data[v]}>{data[v]}</td>
                       })
                    }
               </tr>
           )
         })
    }
      return (
        <>
         {( props.details.data.length === 0 )&& (<span className="label label--info">No Data Available</span>)}
        

        {( props.details.bar === 0 )&& (<span className="label label--warning ">{props.details.list[0]}</span>)}                
        {( props.details.bar === 1 )&& (<span className="label label--success ">{props.details.list[1]}</span>)}
        {( props.details.bar === 2 )&& (<span className="label label--tertiary">{props.details.list[2]}</span>)}
        {( props.details.bar === 3 )&& (<span className="label label--warning-alt">{props.details.list[3]}</span>)}

       
        {(props.details.data.length > 0) && (

          
          <table  className="table">
            <thead><tr>
             {ThData()}
            </tr></thead>
            <tbody wrap="hard" className='tbody_part'>
            {tdData()}
            </tbody>
           </table>
        )}
           </>
        
      )
    }
    export default TableBP;