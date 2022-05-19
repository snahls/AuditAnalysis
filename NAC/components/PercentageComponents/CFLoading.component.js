import React from 'react';
import '../../assets/css/guage.css';

export default class CFLoading extends React.Component{
    constructor(props){
        super(props);
        this.state = {
           percent: this.props.percent,
           type: this.props.diff
        }
    }
    render(){
        var gauge = ""
        var message = ""
        if(this.state.percent > 100){
            if(this.state.type==="increment"){
                gauge = <div className="g">
                    <div className="gauge gauge--danger gauge--medium" data-percentage="100">
                        <div className="gauge__circle">
                            <div className="mask full">
                                <div className="fill"></div>
                            </div>
                            <div className="mask half">
                                <div className="fill"></div>
                                <div className="fill fix"></div>
                            </div>
                        </div>
                        <div className="gauge__inset">
                            <div className="gauge__percentage">!</div>
                        </div>
                    </div>
                </div>
    
                message = `${this.state.percent}% Increase in Exceptions`
            }else if(this.state.type==="decrement"){
                gauge = <div className="g">
                    <div className="gauge gauge--success gauge--medium" data-percentage="100">
                        <div className="gauge__circle">
                            <div className="mask full">
                                <div className="fill"></div>
                            </div>
                            <div className="mask half">
                                <div className="fill"></div>
                                <div className="fill fix"></div>
                            </div>
                        </div>
                        <div className="gauge__inset">
                            <div className="gauge__percentage">!</div>
                        </div>
                    </div>
                </div>
                message = `${this.state.percent}% Decrease in Exceptions`
            }else{
                gauge = <div className="g">
                    <div className="gauge gauge--secondary gauge--medium" data-percentage={this.state.percent}>
                        <div className="gauge__circle">
                            <div className="mask full">
                                <div className="fill"></div>
                            </div>
                            <div className="mask half">
                                <div className="fill"></div>
                                <div className="fill fix"></div>
                            </div>
                        </div>
                        <div className="gauge__inset">
                            <div className="gauge__percentage">{this.state.percent}</div>
                        </div>
                    </div>
                </div>
                message = `Constant Change in Exceptions`
            }
        }else{
            if(this.state.type==="increment"){
                gauge = <div className="g">
                    <div className="gauge gauge--danger gauge--medium" data-percentage={this.state.percent}>
                        <div className="gauge__circle">
                            <div className="mask full">
                                <div className="fill"></div>
                            </div>
                            <div className="mask half">
                                <div className="fill"></div>
                                <div className="fill fix"></div>
                            </div>
                        </div>
                        <div className="gauge__inset">
                            <div className="gauge__percentage">{this.state.percent}</div>
                        </div>
                    </div>
                </div>
    
                message = `${this.state.percent}% Increase in Exceptions`
            }else if(this.state.type==="decrement"){
                gauge = <div className="g">
                    <div className="gauge gauge--success gauge--medium" data-percentage={this.state.percent}>
                        <div className="gauge__circle">
                            <div className="mask full">
                                <div className="fill"></div>
                            </div>
                            <div className="mask half">
                                <div className="fill"></div>
                                <div className="fill fix"></div>
                            </div>
                        </div>
                        <div className="gauge__inset">
                            <div className="gauge__percentage">{this.state.percent}</div>
                        </div>
                    </div>
                </div>
                message = `${this.state.percent}% Decrease in Exceptions`
            }else{
                gauge = <div className="g">
                    <div className="gauge gauge--secondary gauge--medium" data-percentage={this.state.percent}>
                        <div className="gauge__circle">
                            <div className="mask full">
                                <div className="fill"></div>
                            </div>
                            <div className="mask half">
                                <div className="fill"></div>
                                <div className="fill fix"></div>
                            </div>
                        </div>
                        <div className="gauge__inset">
                            <div className="gauge__percentage">{this.state.percent}</div>
                        </div>
                    </div>
                </div>
                message = `Constant Change in Exceptions`
            }
        }
        
        return(
            <div className="guage_c">
                <p>Percentage Indicator</p>
                {gauge}
                <p>{message}</p>
            </div>
            
        )
    }
}