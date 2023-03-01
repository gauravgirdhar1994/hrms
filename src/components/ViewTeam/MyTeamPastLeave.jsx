import React, { Component } from 'react';
import { Card, Row, Table, Button } from "react-bootstrap"
import config from '../../config/config';
import moment from 'moment';
import axios from 'axios';
import DatePicker from "react-datepicker";
class MyTeamPastLeave extends Component {
	constructor(props)
    {
        super(props);
        this.state = {locations:this.props.locations,leaveType:this.props.leaveType,
            leaveStatus:this.props.leaveStatus,start_date:'',end_date:'',locationId:'',leave_type_id:'',ticket_status:'',
            pastLeave:this.props.pastLeave,pendingFilter:{},pastLeaveArr:this.props.pastLeaveArr}
        this.dateChange = this.dateChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
     }
    componentDidUpdate(prevProps) {
         if(prevProps.locations !== this.props.locations) {
            this.setState({locations:this.props.locations})
        }
        if(prevProps.leaveType !== this.props.leaveType) {
            this.setState({leaveType:this.props.leaveType})
        }
        if(prevProps.leaveStatus !== this.props.leaveStatus) {
            this.setState({leaveStatus:this.props.leaveStatus})
        }
        if(prevProps.pastLeave !== this.props.pastLeave) {
            this.setState({pastLeave:this.props.pastLeave})
        }
    }
    handleChange=(event)=>
    {
       //console.log(event)
        var name = event.target.name;
        var val = event.target.value;
        var obj = {[name]:val}
          //console.log(obj)
        var filter=this.state.pendingFilter;
        if(val!='')
        {
            filter[name]=val;
        }
        else
        {
            if(filter[name])
            {
                delete filter[name]
            }
        }
       // console.log('filter',filter);
        obj['pendingFilter'] = filter;
        this.setState(obj);
    }
    dateChange = (date, name) => {
        //console.log(moment(new Date(date)))
        var obj = {[name]:date}
        //console.log(obj);
        var filter=this.state.pendingFilter;
        if(date!='' && date!=null)
        {
            filter[name]=moment(new Date(date)).format(config.INPUT_DATE_FORMAT);
        }
        else
        {
            if(filter[name])
            {
                delete filter[name]
            }
        }
        //console.log('filter',filter);
        obj['pendingFilter'] = filter;
        this.setState(obj);
    }
    search()
    {
    	if((this.props.pastLeave.length>0) && Object.keys(this.state.pendingFilter).length>0)
        {
           var result = [];
           
          // console.log('pendingFilter',this.state.pendingFilter)
            for (var i=0;i<this.props.pastLeaveArr.length;i++){
                var condition = false;
                for (var prop in this.state.pendingFilter) {
                   
                    var value = this.props.pastLeaveArr[i][prop]
                   // console.log('val',moment(new Date(value)))
                   //console.log(this.props.pastLeaveArr[i].hasOwnProperty(prop),prop,value,this.state.pendingFilter[prop])
                    if(prop=='start_date' || prop=='end_date')
                    {
                        value = moment(new Date(value)).format(config.INPUT_DATE_FORMAT);

                    }
                    if((prop=='start_date' || prop=='end_date') && this.state.pendingFilter['start_date'] && this.state.pendingFilter['end_date'])
                    {
                        if(value>=this.state.pendingFilter[prop] && value<=this.state.pendingFilter[prop])
                        {
                             condition=true;
                        }
                    }
                    else if (this.props.pastLeaveArr[i].hasOwnProperty(prop) && value == this.state.pendingFilter[prop]) {
                        
                       condition=true;
                    }
                    else
                    {
                         condition=false;
                        break;
                    }
                    
                }
                //console.log(condition);
                if(condition)
                {
                    result.push(this.props.pastLeaveArr[i])
                }
            }
            let tblRow = result.map((obj)=>{
     		return <tr>
                   <td>{obj.openedByUser}</td>
                                <td>{obj.locationName}</td>
                                <td> {(obj.start_date?moment(new Date(obj.start_date)).format(config.DATE_FORMAT):'N/A')}<small>No. of day {obj.number_of_days}</small></td>   
                                <td>{obj.leave_type}</td>                                
                                <td>{obj.ticket_status_text}</td>
                            </tr>
     	})
            //console.log(result);
            this.setState({pastLeave:tblRow});
        }
        else
        {
            this.setState({pastLeave:this.props.pastLeave});
        }
    }
     render()
     {
     	
//console.log('start_date',this.state.start_date);
     	return(
     		<>
     		<Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
                            <h4>Past leave request</h4>
                            <Row>
                                <div className="col-sm-4 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="ticket_type">Start Date</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <DatePicker autoComplete="off" selected={this.state.start_date} dateFormat={config.DP_INPUT_DATE_FORMAT} className="form-control" value={this.state.start_date}  onChange={(date)=>this.dateChange(date,'start_date')} name='start_date' id='start_date' />                                            
                                        </div>
                                    </div>
                                </div>
                               
                                 <div className="col-sm-4 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="ticket_type">End Date</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <DatePicker autoComplete="off" selected={this.state.end_date} dateFormat={config.DP_INPUT_DATE_FORMAT} className="form-control" value={this.state.end_date}  onChange={(date)=>this.dateChange(date,'end_date')} name='end_date' id='end_date' />                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="priority">Location</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <select value={this.state.locationId} className="form-control custom-select" name='locationId' onChange={this.handleChange}>
                                                <option value="">Location</option>
                                                {this.state.locations}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-sm-4 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="priority">Leave Type</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <select value={this.state.leave_type_id} className="form-control custom-select" name='leave_type_id' onChange={this.handleChange}>
                                                <option value="">Leave Type</option>
                                                 {this.state.leaveType}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4 pb-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label for="priority">Leave Status</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <select value={this.state.ticket_status} className="form-control custom-select" name='ticket_status' onChange={this.handleChange}>
                                                <option value="">Leave Status</option>
                                                {this.state.leaveStatus}
                                            </select>
                                        </div>
                                    </div>
                                </div>                                
                            </Row>

                            <div className="form-group row pt-5 edit-basicinfo">
                                <div className="col-lg-12 text-center">
                                    <Button type="submit" variant="primary" onClick={this.search}>
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <Card className="card d-block pl-3 pt-3 pr-3 pb-3 mt-2 shadow-sm">
                    <Table className="leaveTable smallblock">
                        <thead>
                            <tr>
                                
                                <th>Employee</th>
                                <th>Location</th>
                                <th>Leave Date</th>
                                <th>Leave Type</th>
                                <th>Status</th>
                                

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.pastLeave}

                            
                        </tbody>
                    </Table>
                </Card>
                </>
     	)
     }
}
export default MyTeamPastLeave;