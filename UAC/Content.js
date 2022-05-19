import React from 'react';
// import {Accordion, AccordionContextProvider,expandedItems,expandedItemsChanged} from '@cisco/react-cui';




function Content (){
 
    return (
      <>

      {/* <Typography variant="h3" component="h2">
        Welcome to Audit Analysis
      </Typography>
    <br/><br/><br/> */}

    
        <div style={{boxShadow:"0 4px 8px 0 rgba(0,0,0,0.2)",padding:"20px",fontSize:"large",marginTop:60}}>
        <strong>Core Networking - CNA Audits</strong>
          <p>Audit Analysis aims to modernize audit delivery for Core & Data Centre Networking products with a differentiated customer experience. We are doing BETA launch of our new tool with following benefits:</p>
              <ul>
                <li>Accelerated Analysis with Reusable NCE comments</li>
                <li>Faster Turn-Around Time with one-click report preparation</li>
                <li>Improved customer experience with graphs and visualizations</li>
                <li>Consistent, efficient & predictable delivery experience and quality</li>
                <li>Enhanced QBR presentation with NAC (Network Audit Comparator) </li>
              </ul>        
              
        </div>
        
      
      <br/><br/>
     
        <div style={{boxShadow:"0 4px 8px 0 rgba(0,0,0,0.2)",padding:"20px",fontSize:"large"}}>
        <strong>DC Compute - DCAF Audits</strong>
          <p>Audit Analysis aims to modernize audit delivery for UCS Managed Servers (DC Compute space) with a differentiated customer experience. We are doing BETA launch of our new tool with following benefits:</p>
              <ul>
                <li>Accelerated Analysis with Reusable NCE comments</li>
                <li>Faster Turn-Around Time with one-click report preparation</li>
                <li>Hardware End of Life and Compatible Fnic/Enic Driver Insights</li>
                <li>Improved customer experience with graphs and visualizations</li>
                <li>Consistent, efficient & predictable delivery experience and quality</li>
              </ul>        
              
        </div>

        <footer style={{borderTop:"0px",fontSize:"medium"}}><p><a href="https://eurl.io/#SPt1_l2Vn">Click here </a> to join the community to ask any question</p></footer>
  
    


    {/* <AccordionContextProvider
            initiallyExpandedItems={expandedItems}
            expandedItemsChanged={expandedItemsChanged}
          >
            <Accordion bordered>
              <Accordion.Item itemName="item1" title="Core Networking - CNA Audits" includeToggle>
              <p>Audit Analysis aims to modernize audit delivery for Core & Data Centre Networking products with a differentiated customer experience. We are doing BETA launch of our new tool with following benefits:
              <ul>
                <li>Accelerated Analysis with Reusable NCE comments</li>
                <li>Faster Turn-Around Time with one-click report preparation</li>
                <li>Improved customer experience with graphs and visualizations</li>
                <li>Consistent, efficient & predictable delivery experience and quality</li>
                <li>Enhanced QBR presentation with NAC (Network Audit Comparator) </li>
              </ul>        
              </p>
              

              </Accordion.Item>
              <br/>
              <br/>
              <Accordion.Item itemName="item2" title="DC Compute - DCAF Audits" includeToggle>
              <p>Audit Analysis aims to modernize audit delivery for UCS products (DC Compute space) with a differentiated customer experience. We are doing BETA launch of our new tool with following benefits:
              <ul>
                <li>Accelerated Analysis with Reusable NCE comments</li>
                <li>Faster Turn-Around Time with one-click report preparation</li>
                <li>Hardware End of Life and Compatible Fnic/Enic Driver Insights</li>
                <li>Improved customer experience with graphs and visualizations</li>
                <li>Consistent, efficient & predictable delivery experience and quality</li>
              </ul>        
              </p>
              </Accordion.Item>
            </Accordion>
          </AccordionContextProvider>     */}
          </>
          )
}


export default Content;