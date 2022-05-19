import React from 'react';
import '../../assets/css/loader.css';

export default class Loader2 extends React.Component{
    render(){
        return(
            <div class="loading">
                   <div class="loading-dots" aria-label="Loading, please wait...">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p>Loading</p>
            </div>
        )
    }
}