import React from 'react';


export default class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            table_1_entries: this.props.data,
            is_1_data: this.props.flag,
            current_page: 1,
            entriesPerpage: 10,
            gotoPage:1
        }
        this.inputHandler = this.inputHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }
    inputHandler(e){
        const {name, value} = e.target;
        this.setState({
            [name]:value
        })
    }
    clickHandler(e){
        this.setState({
            current_page: this.state.gotoPage
        })
    }
    arrowHandler(e){
        if(e==="l"){
            if(this.state.current_page!==1){
                this.setState((prevstate)=>({
                    ...prevstate,
                    current_page : prevstate.current_page-1
                }))
            }
        }
        if(e==="r"){
            let max = (Math.ceil(this.state.table_1_entries.length / this.state.entriesPerpage))
            if(this.state.current_page < max){
                this.setState((prevstate)=>({
                    ...prevstate,
                    current_page : prevstate.current_page+1
                }))
            }
        }
    }
    render(){
        let d_length = this.state.table_1_entries.length
        const indexOfLastPost = this.state.current_page * this.state.entriesPerpage;
        const indexOfFirstPost = indexOfLastPost - this.state.entriesPerpage;
        const currentPosts = this.state.table_1_entries.slice(indexOfFirstPost, indexOfLastPost);
        const totalPages = Math.ceil( d_length / this.state.entriesPerpage);
        return(
            <div className="TC_table">
                <div className="reponsive-table tab">
                        <table class="table table--lined table--wrapped table--selectable" aria-label="data">
                            <thead>
                                <tr>
                                    <th>
                                        <label class="checkbox">
                                            <input type="checkbox"/>
                                            <span class="checkbox__input"></span>
                                        </label>
                                    </th>
                                    <th class="sortable">Exception Name</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map((e)=>{
                                    return (
                                        <tr>
                                            <td>
                                                <label class="checkbox">
                                                    <input type="checkbox"/>
                                                    <span class="checkbox__input"></span>
                                                </label>
                                            </td>
                                            <td>
                                                {e}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>      
                <div className="table-pagination">
                    <div className="table-mov">
                        <div className="table-a-entry" onClick={()=>this.arrowHandler("l")}>
                            <span className="icon-chevron-left"></span>
                        </div>
                        <div className="table-a-entry" onClick={()=>this.arrowHandler("r")}>
                            <span className="icon-chevron-right"></span>
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between", marginTop:"8%",width:"50px"}}>
                            <p style={{marginTop:"15%"}}>{this.state.current_page}</p><p>/</p><p>{totalPages}</p>
                        </div>
                    </div>
                    <div className="table-details">
                        <p style={{marginTop:"16%"}}>Total Entries: {d_length}</p>
                    </div>
                    <div className="table-search">
                        <input type="number" name="gotoPage" value={this.state.gotoPage} onChange={this.inputHandler} min="1" max={Math.ceil(d_length / this.state.entriesPerpage)}/>
                        <button className="goto-btn" onClick={this.clickHandler}>Find</button>
                    </div>
                </div>
            </div>
        )
    }
}