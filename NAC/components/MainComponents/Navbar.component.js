import React from 'react';
import {Link} from 'react-router-dom';
import '../../assets/css/navbar.css';

export default class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cpykey: this.props.data.cpykey,
            cname: this.props.data.cname
        }
    }
    render(){
        return(
            <header className="header" style={{backgroundColor:"black",border:"none"}}>
                <div className="container">
                    <div className="header-panels">
                        <div className="header-panel">
                            <Link className="header__logo" to="/">
                                    <span className="icon-cisco"></span>
                            </Link>
                            <div className="header__title">Network Audit Comparator</div>
                        </div>
                        <div className="h-name">
                            <p style={{marginTop:"6.5%"}}>{this.state.cpykey}</p>
                            <p>/</p>
                            <p>{this.state.cname}</p>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}