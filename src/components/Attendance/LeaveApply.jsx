import React, { Component } from 'react';
import {Modal, Form, Button} from "react-bootstrap";
import axios from 'axios';
import DatePicker from "react-datepicker";
import config from '../../config/config';
import { DataFetch } from '../../services/DataFetch';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");

class LeaveApply extends Component {
    constructor(props) {
    super(props);
    //console.log('call constructor');
    this.state = {
        start_date:this.props.start_date,
        end_date:this.props.start_date,
        description:"",
        leave_type:0,
        leave_for:"",
        show:true,
        response:"", 
        start_date_disabled:false,
        end_date_disabled:false,
        datas:[],
        calType:'leaveReq'
        }
    this.leaveList = []
        // if(props.data){
        //     this.state = props.data
        //   } else {
        //     this.state = this.initialState;
        //   }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name=='leave_for')
        {
            if(value=='2')
            {
                this.state.end_date = this.state.start_date;
                this.setState({'end_date_disabled':true})
            }
            else
            {
                this.setState({'start_date_disabled':false,'end_date_disabled':false})
            }
        }
        this.setState({
          [name]: value
        })
    }

    componentDidMount(){
        
//        this.setState({'start_date':this.props.start_date});
       // console.log('componentDidMount',this.state.start_date)
       // console.log('call componentDidMount');
        this.refreshEvent();
        if(typeof this.props.calType != 'undefined'){
            console.log('this.props.calType ===> ', this.props.calType);
            this.setState({
                ...this.state,
                calType: this.props.calType
            })
        }
    }


    refreshEvent(){
        const apiUrl = config.API_URL+'/leave-list';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        DataFetch(apiUrl, bearer).then((result) => {
            let responseJson = result;
            console.log('abcabcabc', responseJson)
            if(responseJson.result){
            this.leaveList  = responseJson.result.leaveArray;
            console.log('aaaaaaaaa', this.leaveList )
            }
          })

    }
    
    onChange = end_date => {
      this.setState({ end_date: end_date})
    }

    onChangeStart = start_date => {
        console.log('start_date',start_date);
         this.setState({ start_date: start_date })
//         if(this.state.leave_for=='2')
//         {
//           this.setState({ end_date: start_date})  
//         }
//         else
//         {             
//           this.setState({ end_date: ''})  
//         }
         this.setState({ end_date: start_date})
         
    } 

    refreshDohunt = () => {
        this.props.refreshEvent();
      }



    handleSubmit = (event) => {
        
        let finalData = {};
        finalData.start_date = this.state.start_date;
        finalData.end_date = this.state.end_date;
        finalData.leave_for = this.state.leave_for; 
        finalData.leave_type = this.state.leave_type;
        finalData.description =  this.state.description;
       // const datas = this.state;
        event.preventDefault();
        const apiUrl = config.API_URL+'/ticket/add/leave';
        var bearer = 'Bearer ' + BEARER_TOKEN;
         console.log('finalData',finalData);
        const headers = {
            Authorization: bearer,
            // "Content-Type": "multipart/form-data"
          };
          axios.post(apiUrl, finalData, { headers: headers }).then((res) => {
            console.log(res);
            console.log(res.data);
            if(res.data.success){
            // const toasts = "Updated Successfully"
                    // toast.success('Updated Successfully');
            this.setState({
                start_date:this.props.start_date,
                end_date:this.props.start_date,
                description:"",
                leave_type:0,
                leave_for:"",
                show:true, 
                response:'success'
            });  
            // window.location.reload();
            toast.success('Updated Successfully');
            setTimeout(function(){
                toast.dismiss()
            },2000)
            // this.setState({show:true, response:'success'});  
            this.props.onHide();
            if(this.state.calType == "leaveReq"){
                this.props.refreshList();
            }
            this.refreshDohunt();
            } else {
                alert(res.data.message);
            }
          });


    }
    componentDidUpdate(prevProps) {
        if(prevProps.start_date !== this.props.start_date) {
          this.setState({start_date: this.props.start_date,end_date:this.props.start_date});
        }
        
    }
    render() {
       //console.log('eferf',this.state.start_date,this.props.start_date);
        if((!this.state.start_date && this.props.start_date))
        {
            this.state.start_date = this.props.start_date;
            this.state.end_date = this.props.start_date;
        }

        console.log('Leaveapply',this.state);
        return (
            <>
             <ToastContainer className="right" position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover />
                <Modal  {...this.props} >
                    <Modal.Header closeButton>
                        <Modal.Title>Apply Leave</Modal.Title>
                        </Modal.Header>
                        <Modal.Body> 
                        <Form onSubmit={this.handleSubmit}>
                            <div className="row mt-4 edit-basicinfo">
                                <div className="col-sm-6 pb-3">
                                    <select className="form-control custom-select" id="leave_type" name="leave_type" onChange={this.handleChange}>
                                    <option value="">Select Leave Type</option>
                                        {/* <option value="0" selected={this.state.leave_type == 6 ? true : false}>LWP</option> */}
                                    {this.leaveList.map(obj =>{
                                        if(obj.balanceLeave > 0){
                                        return (
                                            <option value={obj.leave_id} selected={this.state.leave_type==obj.leave_id?true:false}>{obj.leaveName} {obj.leaveName !== 'LWP' ? '('+obj.balanceLeave+')' : ""}</option>
                                        )}})}
                                       
                                       
                                    </select>
                                </div>
                                <div className="col-sm-6 pb-3">
                                    <select className="form-control custom-select" id="leave_for" name="leave_for" onChange={this.handleChange} value={this.state.leave_for}>
                                        <option value="">Select Leave for</option>
                                        <option value="1" selected={this.state.leave_type==1?true:false}>Full Day</option>
                                        <option value="2" selected={this.state.leave_type==2?true:false}>Half Day</option>
                                    </select>
                                </div>
                                <div className="col-sm-6 pb-3">
                                    <DatePicker showYearDropdown dropdownMode= "scroll" disabled={this.state.start_date_disabled} minDate={moment().startOf('year').toDate()} className="form-control" selected={this.state.start_date}  onChange={this.onChangeStart}   value={this.state.start_date} name="start_date" autoComplete="off" dateFormat={config.DP_INPUT_DATE_FORMAT} />
                                </div>
                                <div className="col-sm-6 pb-3">
                                    <DatePicker showYearDropdown dropdownMode= "scroll" disabled={this.state.end_date_disabled} minDate={moment(this.state.start_date).toDate()} className="form-control" selected={this.state.end_date} onChange={this.onChange} value={this.state.end_date} name="end_date" autoComplete="off" dateFormat={config.DP_INPUT_DATE_FORMAT}/>
                                </div>
                                <div className="col-sm-12 pb-3">
                                    <textarea type="text" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" id="description"> </textarea>
                                </div>
                                <div className="col-sm-12 pb-3">
                                {/* <Form.Group>
                                    <Button variant="success" type="submit">Save</Button>
                                </Form.Group> */}
                                <Button variant="primary" type="submit" onClick={this.handleClose}>
                                    Apply
                                </Button>
                                </div>
                            </div>
                        </Form>
                        </Modal.Body>
                    <Modal.Footer>
                        
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default LeaveApply;