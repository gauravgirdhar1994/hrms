import React, { Component } from 'react';
import { connect } from "react-redux";
import { editData } from "../../action/editData";
import {Modal, Form, Button} from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DatePicker from "react-datepicker";
import {DataFetch} from '../../services/DataFetch'
import loader from '../../loader.gif';
import config from '../../config/config';
import Moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
const BEARER_TOKEN = localStorage.getItem("userData");
class AddWorkExp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            data : [], 
            form: [],
            response:"",
            createdBy: "",
            date:"",
            form:{
                designation: "",
                employerName:"",
                endDate: "",
                jobDetails:"",
                location: "",
                startDate: "",
                status:""
            }
        }
      }
    
      onChangeDate1 = startDate => {
        this.setState({
        form: {
            ...this.state.form, ['startDate']: Moment(startDate).format(config.INPUT_DATE_FORMAT)
        }
        })
    }
    onChangeDate2 = endDate => {
        this.setState({
        form: {
            ...this.state.form, ['endDate']: Moment(endDate).format(config.INPUT_DATE_FORMAT)
        }
        })
    }
    
    handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
    form: {
        ...this.state.form, [name]: value
    }
    })
    }

    handleSubmit = () => {
        let datas = this.state.form;
        datas.status = 1;
        ///let ids = Math.floor(Math.random() * 100) + 55;
        const apiUrl = config.API_URL+'/employee/info/add/work/'+this.props.empId;
        var bearer = 'Bearer ' + BEARER_TOKEN;
        // this.props.editData(datas, apiUrl, bearer)
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, {headers: headers})
            .then(res => {
                console.log('POST response',res);
                this.props.func(res);
                // console.log(res.data);
        })
            
       // const toasts = "Updated Successfully"
                toast.success('Updated Successfully');
                setTimeout(function(){
            toast.dismiss()
        },2000)
        this.setState({show:true})
    }

    onChange = date => this.setState({ date })

    render() {
        const { data, show, editData, response} = this.state;
        const { designation, empId, employerName, endDate, id, location, startDate} = this.state.form;
        console.log('props data', this.props)
        return (
            <div>
                 <ToastContainer className="right" position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover />
                <Modal show={this.props.showAdd} {...this.props}>
                        <Modal.Header>
                            <Modal.Title><h6>Add Work Experience</h6></Modal.Title>
                        </Modal.Header>
                       
                        <Modal.Body>
                        <Form onSubmit={event => {   event.preventDefault();        this.handleSubmit(this.state)      }}>
                            <fieldset>
                                <label htmlFor="employerName" className="mb-0">Employer Name *</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="employerName" name="employerName" onChange={this.handleChange} placeholder="Ex: Microsoft" className="form-control" defaultValue={this.state.form.employerName} required="" />
                                    </div>
                                </div>
                                <label htmlFor="designation" className="mb-0">Designation *</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="designation" name="designation" onChange={this.handleChange} defaultValue={this.state.form.designation} placeholder="Ex: UX Designer" className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="location" className="mb-0">Location</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="location" name="location" onChange={this.handleChange} defaultValue={this.state.form.location} placeholder="Ex: Delhi NCR" className="form-control" required="" />
                                    </div>
                                </div>
                                {/* <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="status" name="status" onChange={this.handleChange} defaultValue={this.state.form.status} className="form-control" required="" />
                                    </div>
                                </div> */}
                                <div className="row">
                                <div className="col-sm-6">
                                    <label htmlFor="year" className="mb-0">Start Date</label>
                                    <div className="row mb-3">
                                        <div className="col-lg-12">
                                        <DatePicker autoComplete="off" showYearDropdown dropdownMode= "scroll" selected={Moment().toDate()} className="form-control" maxDate={Moment().toDate()} onChange={this.onChangeDate1} value={this.state.form.startDate} name="startDate" id="startDate" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="eyear" className="mb-0">End Date</label>
                                    <div className="row mb-3">
                                        <div className="col-lg-12">
                                        <DatePicker autoComplete="off" showYearDropdown dropdownMode= "scroll" selected={Moment().toDate()} className="form-control" maxDate={Moment().toDate()} onChange={this.onChangeDate2} value={this.state.form.endDate} name="endDate" id="endDate" />
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <label htmlFor="jobDetails" className="mb-0">Job Details</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <textarea type="text" id="jobDetails" name="jobDetails" onChange={this.handleChange} defaultValue={this.state.form.jobDetails}  placeholder="Ex: Bachelor’s" className="form-control" required="" />
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={e => this.props.onHideAdd(e)}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary" onClick={e => this.props.onHideAdd(e)}>
                            Save
                        </Button>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        
                        </Modal.Footer>
                        
                </Modal>
            </div>
        )
    }
    
}

// export default WorkExp;
 
export default connect("", {editData})(AddWorkExp);

