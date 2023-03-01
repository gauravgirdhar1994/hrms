import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import moment from "react-moment";
import momentDurationFormatSetup from "moment-duration-format";
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdVisibility } from 'react-icons/md';
import { TablePagination } from 'react-pagination-table';
const BEARER_TOKEN = localStorage.getItem("userData");

class EmployeeGrades extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: '',
            addShow: '',
            editShow: '',
            data: [],
            form: [],
            grades: [],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            role: localStorage.getItem("roleSlug")
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/employee/grade-list/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    grades: r.data.grades.rows,
                    gradesCount: r.data.grades.count
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
            })
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };

    handleEditGradeShow = () => {
        console.log('close button')
        this.setState({ editShow: true })
    };

    handleEditGradeClose = () => {
        console.log('close button')
        this.setState({ editShow: false })
    };

    handleAddShow = () => {
        console.log('close button')
        this.setState({ addShow: true })
    };

    handleAddClose = () => {
        console.log('close button')
        this.setState({ addShow: false })
    };

    handleChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            form: {
                ...this.state.form, [name]: value
            }
        })
    }


    handleSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/add-employee-grade';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
                if(res.data.success === true){
                    toast.success(res.data.message);
                }
                else{
                    toast.error(res.data.message);
                }
            })
;
        setTimeout(function () {
            toast.dismiss()
        }, 2000)
        this.setState({ show: false })
    }

    editGrade = (id) => {

        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        axios.get(config.API_URL + '/employee/grade-list/' + this.state.orgId + '?gradeId=' + id+'&edit=true', { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    form: r.data.grades.rows[0],
                    editShow: true,
                    editGrade: id
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
            })
    }

    addGrade = (id) => {
        let datas = {
            gradeId: id
        };
        const apiUrl = config.API_URL + '/map-grade-org';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                if(res.data.success === true){
                    toast.success(res.data.message);
                }
                else{
                    toast.error(res.data.message);
                }
                console.log('POST response', res);
            })

      
        setTimeout(function () {
            toast.dismiss()
        }, 2000)
    }
    

    handleEditGradeSubmit = () => {
        let datas = this.state.form;
        const apiUrl = config.API_URL + '/edit-employee-grade/' + this.state.editGrade;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // Update the formData object 
        // console.log('File Edit', formData);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
                if(res.data.success === true){
                    toast.success(res.data.message);
                }
                else{
                    toast.error(res.data.message);
                }
            })

        // const toasts = "Updated Successfully"
        // toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)

    }

    mapGradeOrg = (id) => {
        let datas = {
            brokerGradeId: id,
            orgId: this.state.orgId
        };
        const apiUrl = config.API_URL + '/map-grade-org';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                this.refreshData();
                console.log('POST response', res);
            })

        const toasts = "Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)

    }

    render() {
        const grades = this.state.grades;
        const fieldsCount = this.state.gradesCount;
        console.log('grades', grades);
        if (grades) {
            grades.map((item, key) => {
                    console.log('Item status', item.status);
                let status = item.status ? 'Active' : 'Inactive';
                item.itemStatus = status;
                if (item.isMaster === true && this.state.role != 'broker-admin' && this.state.role != 'broker-primary') {
                    item.action = <a class="btn btn-primary btn-edit" onClick={this.mapGradeOrg.bind(this, item.id)}>Add to Organization</a>
                }
                else {
                    item.action = <a class="cursor-pointer" onClick={this.editGrade.bind(this, item.id)}> <i><FaEdit /></i></a>
                }

            })
        }
        // console.log('length', fieldsCount)
        const Header = ["Grade", "Display Name", "Status", "Action"];

        return (
            <>
                
                <ToastContainer />
                        <Card className="card d-block p-1 mb-4 shadow-sm">
                            <span className="anchor" id="formComplex"></span>
                            <div className="my-4" />

                            
                            <div className=" mt-4  pr-3">
                                <div className="col-lg-12">

                                    {fieldsCount > 0 ? (
                                        <TablePagination
                                            title=""
                                            subTitle=""
                                            headers={Header}
                                            data={grades}
                                            columns="grade.displayName.itemStatus.action"
                                            perPageItemCount={10}
                                            totalCount={fieldsCount}
                                            paginationClassName="pagination-status"
                                            className="react-pagination-table"
                                            arrayOption={[["size", 'all', ' ']]}
                                        />
                                    ) : 'No Data Found'}

                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-12 text-left ">
                                    <span className="addNewButton pl-3" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                                </div>
                            </div>
                        </Card>
                    
                    



                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Grade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="grade" className="mb-0">Grade</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="grade" onChange={this.handleChange} name="grade" className="form-control" required="" />
                                    </div>
                                </div>


                                <label htmlFor="displayName" className="mb-0">Display Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="displayName" name="displayName" onChange={this.handleChange} className="form-control" required="" />
                                    </div>
                                </div>


                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" name="status" onChange={this.handleChange}>
                                            <option selected value=''>Select Status</option> <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary" onClick={this.handleClose}>
                                Save
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.editShow} onHide={this.handleEditGradeClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Grade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditGradeSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="grade" className="mb-0">Grade</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="grade" onChange={this.handleChange} name="grade" className="form-control" value={this.state.form.grade} required="" />
                                    </div>
                                </div>


                                <label htmlFor="displayName" className="mb-0">Display Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="displayName" name="displayName" onChange={this.handleChange} className="form-control" value={this.state.form.displayName} required="" />
                                    </div>
                                </div>


                                <label htmlFor="status" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" name="status" onChange={this.handleChange}>
                                            <option selected value=''>Select Status</option>
                                            <option value="1" selected={this.state.form.status ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={!this.state.form.status ? 'selected' : ''}>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleEditGradeClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary" onClick={this.handleEditGradeClose}>
                                Save
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

            </>
        )
    }
}

export default EmployeeGrades;