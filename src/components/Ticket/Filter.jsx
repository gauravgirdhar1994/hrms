import React, { Component } from 'react';
import { Col, Card, Row } from 'reactstrap';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderByFields:'',
            orderBy:''
        };
    }
    componentDidMount() {
        // console.log("setFilters ===> ", this.props.setFilters);
        this.setState(this.props.setFilters);
      }
    applyFilterInTopBar(e){
        let filterBy = {};
        console.log('name ==> ', e.target.name, e.target.value, e.target.checked);
        if(e.target.name=='orderByField'){
            filterBy = {
                orderByField:e.target.value,
                orderBy:this.state.orderBy!=''?this.state.orderBy:1
            };
            this.setState({
                orderByField:e.target.value,
                orderBy:this.state.orderBy!=''?this.state.orderBy:1
            });
        } else if(e.target.name=='orderBy'){
            filterBy = {
                orderByField:this.state.orderByField,
                orderBy:e.target.value
            };
            this.setState({orderBy:e.target.value});
        }
        this.props.applyFilter(filterBy,'leftFilters');
    }
    clearOrderByFilters(){
        if(this.state.orderBy!='' && this.state.orderByField!='')
        {
            let filterBy = {
                orderByField:'',
                orderBy:''
            };
            this.setState(filterBy);
            
            this.props.applyFilter(filterBy,'leftFilters');
        }
    }

    render() {
        // console.log('orderBy============>', this.state.orderBy);
        return (
            <>
               
                    <Card className="card filterList d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
                        <h2><span>Order By</span> <span onClick={e=>this.clearOrderByFilters(e)} style={{cursor:'pointer'}}>CLEAR ALL</span></h2>
                        <ul>
                            <li className="d-flex">
                                <span>Date Created</span>
                                <span>
                                    <label className="hrms_control hrms_checkbox">
                                        <input type="radio" name="orderByField" value="opened_on" onChange={e=>this.applyFilterInTopBar(e)} checked={(this.state.orderByField=='opened_on'?'checked':'')}/>
                                        <span className="hrms_control__indicator"></span>
                                    </label>
                                </span>
                            </li>
                            <li className="d-flex">
                                <span>Due Date</span>
                                <span>
                                    <label className="hrms_control hrms_checkbox">
                                        <input type="radio" name="orderByField" value="due_date" onChange={e=>this.applyFilterInTopBar(e)} checked={(this.state.orderByField=='due_date'?'checked':'')}/>
                                        <span className="hrms_control__indicator"></span>
                                    </label>
                                </span>
                            </li>
                            <li className="d-flex">
                                <span>Last Modified</span>
                                <span>
                                    <label className="hrms_control hrms_checkbox">
                                        <input type="radio" name="orderByField" value="closed_on" onChange={e=>this.applyFilterInTopBar(e)} checked={(this.state.orderByField=='closed_on'?'checked':'')}/>
                                        <span className="hrms_control__indicator"></span>
                                    </label>
                                </span>
                            </li>
                            <li className="d-flex">
                                <span>Priority</span>
                                <span>
                                    <label className="hrms_control hrms_checkbox">
                                        <input type="radio" name="orderByField" value="priority" onChange={e=>this.applyFilterInTopBar(e)} checked={(this.state.orderByField=='priority'?'checked':'')}/>
                                        <span className="hrms_control__indicator"></span>
                                    </label>
                                </span>
                            </li>
                            
                        </ul>
                        <ul>
                            <li className="d-flex">
                                <span>Ascending</span>
                                <span>
                                    <label className="hrms_control hrms_checkbox">
                                        <input type="radio" name="orderBy" value="1" onChange={e=>this.applyFilterInTopBar(e)} checked={(this.state.orderBy==1?'checked':'')}/>
                                        <span className="hrms_control__indicator"></span>
                                    </label>
                                </span>
                            </li>    
                            <li className="d-flex">
                                <span>Descending</span>
                                <span>
                                    <label className="hrms_control hrms_checkbox">
                                        <input type="radio" name="orderBy" value="2" onChange={e=>this.applyFilterInTopBar(e)} checked={(this.state.orderBy==2?'checked':'')}/>
                                        <span className="hrms_control__indicator"></span>
                                    </label>
                                </span>
                            </li>
                        </ul>
                    </Card>
               
            </>
        );
    }
}

export default Filter;