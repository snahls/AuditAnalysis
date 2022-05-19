import React from 'react';
import '../../assets/css/loader.css';

export default class Loader extends React.Component{
    render(){
        return(
            <div class="loading">
                    <div className="loader" aria-label="Loading, please wait...">
                        <div className="wrapper">
                            <div className="wheel"></div>  
                        </div>
                    </div>
                    <p>Loading</p>
            </div>
        )
    }
}