import React, { Component } from 'react';
import { connect } from "react-redux";
import { editData } from "../../action/editData";
import {Modal, Form, Button} from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import {DataFetch} from '../../services/DataFetch'
import loader from '../../loader.gif';
import config from '../../config/config';
import "react-datepicker/dist/react-datepicker.css";

class AddCertification extends Component {
    constructor(props) {
        super(props);
        console.log('SProps'+46,this.props)
        this.state = {
            show:false,
            data : [], 
            response:"",
            createdBy: "",
            date:"",
            form:{
                instituteName: "",
                degree: "",
                fieldsofstudy:"",
                startYear:"",
                endYear:"",
                grade:"",
                certificationDetails:""
            },
            token: localStorage.getItem("userData")
        }
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
        ///let ids = Math.floor(Math.random() * 100) + 55;
        const apiUrl = config.API_URL+'/employee/info/add/certification/'+this.props.empId;
        var bearer = 'Bearer ' + this.state.token;
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

       // console.log('SProps'+53,this.props)
        this.setState({show:false})
    }

    onChange = date => this.setState({ date })
    
    onHidePopup = () => {
        // console.log(59,'hide popup');
        this.setState({show:false})
        // console.log(61,this.props.show);
    }

    render() {
        const { data, show, editData, response} = this.state;
        const { degree, fieldsofstudy, instituteName, endYear, grade, certificationalDetails, startYear} = this.state.form;
  
       // console.log(69,this.state);
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
                        {/* <Modal.Header closeButton> */}
                        <Modal.Header>
                            <Modal.Title><h6>Add Education</h6></Modal.Title>
                        </Modal.Header>
                       
                        <Modal.Body>
                        <Form onSubmit={event => {   event.preventDefault();        this.handleSubmit(this.state)      }}>
                        <fieldset>
                                <label htmlFor="instituteName" className="mb-0">School/University Name *</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="instituteName" name="instituteName" onChange={this.handleChange} placeholder="Ex: Delhi University" className="form-control" defaultValue={this.state.form.instituteName} required="" />
                                    </div>
                                </div>
                                <label htmlFor="degree" className="mb-0">Degree/Diploma</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="degree" name="degree" onChange={this.handleChange} defaultValue={this.state.form.degree} placeholder="Ex: Bachelor’s" className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="study" className="mb-0">Field(s) of Study</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="fieldsofstudy" name="fieldsofstudy" onChange={this.handleChange} defaultValue={this.state.form.fieldsofstudy} placeholder="Ex: Business" className="form-control" required="" />
                                    </div>
                                </div>
                                <div className="row">
                                <div className="col-sm-6">
                                    <label htmlFor="year" className="mb-0">Start Year</label>
                                    <div className="row mb-3">
                                        <div className="col-lg-12">
                                            <input type="text" id="startYear" name="startYear" onChange={this.handleChange} defaultValue={this.state.form.startYear} className="form-control" required="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="eyear" className="mb-0">End Year</label>
                                    <div className="row mb-3">
                                        <div className="col-lg-12">
                                        <input type="text" id="endYear" name="endYear" onChange={this.handleChange} defaultValue={this.state.form.endYear} className="form-control" required="" />
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <label htmlFor="grade" className="mb-0">Grade</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="grade" id="grade" name="grade" onChange={this.handleChange} defaultValue={this.state.form.grade} placeholder="Ex: Business" className="form-control" required="" />
                                    </div>
                                </div>
                                <label htmlFor="jobDetails" className="mb-0">Add Certification Details</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <textarea type="text" id="certificationalDetails" name="certificationalDetails" onChange={this.handleChange} defaultValue={this.state.form.certificationalDetails}  placeholder="" className="form-control" required="" />
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

const mapStateToProps = state => {
    console.log(256, 'Props Strat',state);
    return { item: state.datas,   
        error: state.datas.error,
        loading:state.datas.loading,
        success:state.datas.success}
}

// export default WorkExp;
 
export default connect(mapStateToProps, {editData})(AddCertification);

