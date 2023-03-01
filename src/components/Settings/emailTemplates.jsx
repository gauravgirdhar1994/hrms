import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const BEARER_TOKEN = localStorage.getItem("userData");
class EmailTemplates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            editor: ClassicEditor,
            data: [],
            ticketTypeList: [],
            form: [],
            editType: '',
            editData: [],
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
            validateFields: {}
        }
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/email-templates/list', { headers: { Authorization: bearer } })
            .then(r => {
                // console.log('Ticket status', r);
                this.setState({ data: r.data.EmailTemplatesList })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    editPopup = (code, id) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/setting/email-template/view/' + code, { headers: { Authorization: bearer } })
            .then(r => {

                this.setState({ editData: r.data.emailTempDet })
                this.setState({ editShow: true, editType: id })

                console.log('Api result', this.state.editData);
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    handleShow = () => {
        console.log('close button')
        this.setState({ form: [], show: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };
    handleEditClose = () => {
        console.log('close button')
        this.setState({ editShow: false })
    };
    handleEditChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            editData: {
                ...this.state.editData, [name]: value
            }
        })
    }
    handleEditSubmit = (event) => {

        let datas = this.state.editData;
        datas.orgId = this.state.orgId;
        // console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/setting/email-template/update';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }
        
            axios.put(apiUrl, datas, { headers: headers })
                .then(res => {
                    console.log('res ===> ', res);
                    if (res.data.success) {
                        this.refreshData();
                        toast.success(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                        this.setState({ editShow: false })
                    }
                    else {
                        toast.error(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                    }
                })
        
    }
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
        // console.log('Form Data', this.state.form);
        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        // console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/setting/email-template/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
       
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    if (res.data.success) {
                        // const toasts = "Updated Successfully"
                        toast.success(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                        this.setState({ show: false });
                        this.refreshData();
                    } else {
                        toast.error(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                    }
                })
    }
    validateForm() {
        let fields = this.state.fields[0];
        let validations = {};
        let isFormValid = true;
        if (fields) {
            console.log('this.state.form', this.state.form, fields);
            for (var key in fields) {
                if (
                    this.state.form[key] == "" ||
                    typeof this.state.form[key] == "undefined"
                ) {
                    validations[key] = "Please enter " + fields[key];
                    isFormValid = false;
                }
            }
            console.log('validations ============> ', validations);
            this.setState({ validateFields: validations });
            return isFormValid;
        }
    }

    render() {

        // console.log('this.state.default_status =====> ', this.state.form.default_status);
        // console.log('this.state.editData.display_in_list ==> ', this.state.editData.display_in_list, (this.state.editData && this.state.editData.display_in_list === 0))
        return (
            <>

                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <div className="d-flex justify-content-between  mb-4 ">
                        <h4 className="font-16 pl-3">Email Templates</h4>
                    </div>
                    {this.state.data ? (
                        <Table className="leaveTable">
                            <thead>
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th>Name</th>
                                    <th>Subject</th>
                                    <th>Sender</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.data.map((data, key) => {
                                    if (data !== null) {
                                        return (
                                            <tr key={key}>
                                                {/* <td>{data.id}</td> */}
                                                <td>{data.name}</td>
                                                <td>{data.subject}</td>
                                                <td>{data.sender}</td>
                                                <td>{data.status == 1 ? 'Active' : 'Inactive'}</td>
                                                <td>

                                                    <span onClick={this.editPopup.bind(this, data.code, data.id)}>
                                                        <i><FaEdit /></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })
                                }

                            </tbody>
                        </Table>
                    ) : <Table>
                            <tbody>No Data Found</tbody>
                        </Table>}

                </Card>

                {/* <div className="form-group row pt-2 ">
                    <div className="col-lg-12 text-left">
                        <span className="addNewButton" onClick={this.handleShow}> <i className="icon-plus icons"></i> Add New</span>
                    </div>
                </div> */}


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="status_name" className="mb-0">Exit Reason</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="reason" onChange={this.handleChange} name="reason" placeholder="Ex: Exit Reason" className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['reason']}</div>
                                    </div>
                                </div>

                                <label htmlFor="active" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select className="form-control custom-select" onChange={this.handleChange} name="status">
                                            <option selected disabled>Select Status</option> <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                        <div class="errMsg">{this.state.validateFields['status']}</div>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button type="submit" variant="primary">
                                Save
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.editShow} onHide={this.handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Template</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleEditSubmit(this.state) }}>
                            <fieldset>

                                <label htmlFor="status_name" className="mb-0">Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="name" onChange={this.handleEditChange} name="reason" placeholder="Ex: Name" value={this.state.editData.name} className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['name']}</div>
                                    </div>
                                </div>

                                <label htmlFor="status_name" className="mb-0">Code</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="code" onChange={this.handleEditChange} name="reason" placeholder="Ex: Name" value={this.state.editData.code} className="form-control" disabled required="" />
                                        <div class="errMsg">{this.state.validateFields['code']}</div>
                                    </div>
                                </div>

                                <label htmlFor="status_name" className="mb-0">Sender</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="sender" onChange={this.handleEditChange} name="sender" value={this.state.editData.sender} className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['sender']}</div>
                                    </div>
                                </div>
                                <label htmlFor="status_name" className="mb-0">Subject</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="subject" onChange={this.handleEditChange} name="subject" value={this.state.editData.subject} className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['subject']}</div>
                                    </div>
                                </div>
                                <label htmlFor="status_name" className="mb-0">Template</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                    <CKEditor
                                            editor={ this.state.editor }
                                            data={this.state.editData.template}
                                            onInit={ editor => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log( 'Editor is ready to use!', editor );
                                            } }
                                            onChange={ ( event, editor ) => {
                                                const data = editor.getData();
                                                console.log( { event, editor, data } );
                                                this.setState({
                                                    editData: {
                                                        ...this.state.editData, ['template']: data
                                                    }
                                                })
                                            } }
                                            onBlur={ ( event, editor ) => {
                                                console.log( 'Blur.', editor );
                                            } }
                                            onFocus={ ( event, editor ) => {
                                                console.log( 'Focus.', editor );
                                            } }
                                        />
                                    </div>
                                </div>

                                <label htmlFor="grade" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select name="status" className="form-control custom-select" onChange={this.handleEditChange}>
                                            <option value="">Select Status</option> <option value="1" selected={this.state.editData && this.state.editData.status === 1 ? 'selected' : ''}>Active</option>
                                            <option value="0" selected={this.state.editData && this.state.editData.status === 0 ? 'selected' : ''}>Inactive</option>
                                        </select>
                                        <div class="errMsg">{this.state.validateFields['status']}</div>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleEditClose}>
                                Close
                            </Button>
                            <Button type="submit" variant="primary" onClick={this.handleEditClose}>
                                Save
                            </Button>
                        </Form>

                    </Modal.Body>
                </Modal>

            </>


        )
    }

}

export default EmailTemplates;