import React, { Component } from "react";
// import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Modal, Button, Form, Card, Table } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { FaEdit, FaEye, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import config from '../../src/config/config';


const BEARER_TOKEN = localStorage.getItem("userData");

class Organizations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizations: {},
            show: '',
            data: [],
            form: [],
            orgId: '',
            addShow: '',
            companyLogo: '',
            selectedFile: '',
            imgSrc: '',
            showToast: true,
            showPopUp: false,
            fields: [{ 'orgName': 'Organization Name', 'domain': 'Domain', 'contactPerson': 'Contact Person', 'contactNumber': 'Contact Number', 'companyAddress': 'Company Address', "email" : "Email" }],
            validateFields: {}
        };
        this.handleClose = this.handleClose.bind(this);
    }

    handleShow = () => {
        console.log('close button')
        this.setState({ show: true })
    };

    handleAddShow = () => {
        console.log('close button')
        this.setState({ addShow: true })
    };

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };

    handleAddClose = () => {
        console.log('close button')
        this.setState({ addShow: false })
    };

    handlePhoneChange = (value, country, e, formattedValue, name) => {

        let phonevalue = formattedValue;
        this.setState({
            form: {
                ...this.state.form, [name]: phonevalue
            },
            validateFields: {
                ...this.state.validateFields, ['contactNumber']: ""
            }
        })
        let event = {
            target: {
                name: name,
                value: formattedValue
            }
        };
        this.handleChange(event)
        // console.log('Input event', this.state.form);
    }

    handleChange = (event) => {
        console.log('Input event',event.target.name, event.target.value);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            data: {
                ...this.state.data, [name]: value
            },
            validateFields: {
                ...this.state.validateFields, [name]: ""
            }
        })
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organizations/list', { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    organizations: r.data.organizations.rows,
                    organizationsCount: r.data.organizations.count
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
            })
    }

    showEditPopup = (id, value) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organizations/list?orgId=' + id, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({
                    form: r.data.organizations.rows[0],
                    data: r.data.organizations.rows[0],
                })
                if (this.state.data != '') {
                    this.setState({
                        show: true,
                        orgId: id,
                        companyLogo: this.state.data.logo,
                        imgSrc:config.BASE_URL+''+this.state.data.logo,
                    })
                }
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
            })
    }

    handleAddChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;
        // console.log('Input event',name, value);  
        // console.log('Input event',this.state.form);  
        this.setState({
            form: {
                ...this.state.form, [name]: value
            },
            validateFields: {
                ...this.state.validateFields, [name]: ""
            }
        })

    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.data);
        let datas = this.state.data;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/organization/edit/' + this.state.orgId;
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const headers = {
            "Authorization": bearer,
        }
        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );

        for (var key in datas) {
            formData.append(key, datas[key]);
        }
        if (this.validateForm()) {
            // console.log('headers => ', headers);
            axios.post(apiUrl, formData, { headers: headers })
                .then(res => {
                    this.refreshData();
                    console.log('POST response', res);
                })

            const toasts = "Updated Successfully"
            toast.success('Updated Successfully');
            setTimeout(function () {
                toast.dismiss()
            }, 2000)
            this.setState({ show: false })
        }
    }

    showToastMessage(toastMessage) {
        toast(toastMessage, { autoClose: 3000 })
    }

    handleAddSubmit = (event) => {
        //console.log('Form Data', this.state.form);
        let datas = this.state.form;
        //  console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/organization/add';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const headers = {
            "Authorization": bearer,
        }

        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );

        for (var key in datas) {
            formData.append(key, datas[key]);
        }

        console.log('headers => ', headers);
        if (this.validateForm()) {
        axios.post(apiUrl, formData, { headers: headers })
            .then(res => {
                console.log('POST response', res);
                if (res.data.success === true) {
                    // const toasts = "Updated Successfully"
                    toast.success(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.refreshData();
                    this.setState({ addShow: false })
                }
                else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => {
                console.log('Error API', error);
            })
        }
    }

    uploadLogo = (event) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;

        const headers = {
            "Authorization": bearer
        };

        this.state.selectedFile = event.target.files[0];
        // Details of the uploaded file 
        console.log('Selected file', this.state.selectedFile);

        let reader = new FileReader();

        reader.onloadend = () => {
            console.log('Load end', reader.result);
            this.setState({
                imgSrc: reader.result
            });
            console.log('Image src state', this.state.imgSrc);
        }

        reader.readAsDataURL(event.target.files[0])

        // Request made to the backend api 
        // Send formData object 
        // axios.post(config.API_URL + "/upload/CompanyLogo", formData, { headers: headers }).then(res => {
        //     console.log('POST response', res);
        //     this.setState({ companyLogo: res.data.companyLogo })
        //     toast.success(res.data.message);
        // });

    }

    validateForm() {
        let fields = this.state.fields[0];
        let validations = {};
        let isFormValid = true;
        if (fields) {
            // console.log('this.state.form', this.state.form, fields);
            for (var key in fields) {
                if (
                    this.state.form[key] == "" ||
                    typeof this.state.form[key] == "undefined"
                ) {
                    validations[key] = "Please enter " + fields[key];
                    isFormValid = false;
                }
            }
            // console.log('validations ============> ', validations);
            this.setState({ validateFields: validations });
            return isFormValid;
        }
    }

    render() {
        console.log('Organizations', this.state.data)
        return (
            <>
                <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">
                    <ToastContainer className="right" position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover />
                    <Card className="card d-block p-1 mb-4 shadow-sm">
                        <div className="d-flex justify-content-between  mb-2 ">
                            <h4 className="font-16 pl-3 mt-2">Organizations</h4>

                        </div>

                        <Table className="leaveTable listview">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Organization Name</th>
                                    <th>Contact Person</th>
                                    <th>Contact Number</th>
                                    {/* <th>Website</th> */}
                                    <th>Employee Count</th>
                                    <th>Status</th>
                                    <th>Created On</th>
                                    <th>Updated On</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.organizationsCount > 0 ? (
                                    this.state.organizations.map((data, key) => {
                                        if (data !== null) {
                                            return (
                                                <tr key={key}>
                                                    <td>{data.id}</td>
                                                    <td>{data.orgName}</td>
                                                    <td>{data.contactPerson}</td>
                                                    <td>{data.contactNumber}</td>
                                                    {/* <td>{data.website}</td> */}
                                                    <td>{data.empCount}</td>
                                                    <td>{data.status ? 'Active' : 'Inactive'}</td>
                                                    <td>{data.createdOn ? moment(data.createdOn).format(config.INPUT_DATE_FORMAT) : ''}</td>
                                                    <td>{data.updatedOn ? moment(data.updatedOn).format(config.INPUT_DATE_FORMAT) : ''}</td>
                                                
                                                    <td><a href="javascript:void(0)" onClick={this.showEditPopup.bind(this, data.id)}>Edit</a></td>
                                                </tr>
                                            )
                                        }
                                    })
                                ) : ''}

                            </tbody>
                        </Table>
                    </Card>

                    <div className="form-group row pt-2 ">
                        <div className="col-lg-12 text-left">
                            <span className="addNewButton" onClick={this.handleAddShow}> <i className="icon-plus icons"></i> Add New</span>
                        </div>
                    </div>

                </div>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Account Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="orgName" className="mb-0">Organization Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="orgName" name="orgName" placeholder="Ex: Service Internataional pvt ltd" className="form-control" onChange={this.handleChange} value={this.state.data.orgName} required="" />
                                        <div class="errMsg">{this.state.validateFields['orgName']}</div>
                                    </div>
                                </div>
                                <label htmlFor="website" className="mb-0">Access URL</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12 input-group">
                                        <input type="text" id="domain" name="domain" placeholder="Ex: service.yyy.com" className="form-control" onChange={this.handleChange} required="" value={this.state.data.domain} /><div class="input-group-append"><span class="input-group-text">.{config.DEFAULT_DOMAIN}.vowfirst.com</span>
                                        <div class="errMsg">{this.state.validateFields['domain']}</div></div>
                                    </div>
                                </div>
                                <label htmlFor="contactPerson" className="mb-0">Account Owners</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="contactPerson" name="contactPerson" placeholder="Ex: Lukus Adoms" className="form-control" onChange={this.handleChange} required="" value={this.state.data.contactPerson} />
                                        <div class="errMsg">{this.state.validateFields['contactPerson']}</div>
                                    </div>
                                </div>

                                <label htmlFor="contactNumber" className="mb-0">Contact Number</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <PhoneInput country={'ae'} id="contactNumber" name="contactNumber" placeholder="Ex: 9898988989" className="form-control" onChange={this.handleChange} required="" value={this.state.data.contactNumber} onChange={(value, data, event, formattedValue) => this.handlePhoneChange(value, data, event, formattedValue, 'contactNumber')} />
                                        <div class="errMsg">{this.state.validateFields['contactNumber']}</div>
                                        {/* <input type="text" id="contactNumber" name="contactNumber" placeholder="Ex: 9898988989" className="form-control" onChange={this.handleChange} required="" value={this.state.data.contactNumber} /> */}
                                    </div>
                                </div>

                                <label htmlFor="companyAddress" className="mb-0">Official Address</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="companyAddress" name="companyAddress" placeholder="Ex: 10th floor, control Tower, Moter City, Duvai" onChange={this.handleChange} className="form-control" required="" value={this.state.data.companyAddress} />
                                        <div class="errMsg">{this.state.validateFields['companyAddress']}</div>
                                    </div>
                                </div>
                                <label htmlFor="email" className="mb-0">Email</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="email" name="email" onChange={this.handleAddChange} disabled="disabled" className="form-control" required="" value={this.state.data.email} />
                                        <div class="errMsg">{this.state.validateFields['email']}</div>
                                    </div>
                                </div>
                                <label htmlFor="email" className="mb-0">Status</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <select id="status" name="status" onChange={this.handleChange} className="form-control custom-select">
                                            <option value="1" selected={this.state.data.status ? 'selected' : ''} >Active</option>
                                            <option value="0" selected={!this.state.data.status ? 'selected' : ''} >Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <label htmlFor="companyAddress" className="mb-0">Company Logo</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <ul className="myinfoListing">
                                            <li>
                                                <label>Upload Your Logo </label>
                                                <span>
                                                    {this.state.companyLogo === '' ? (
                                                        <>


                                                            <label for="uploadId" className="squireUpload">
                                                                {this.state.imgSrc === '' ? (
                                                                    <small>Your Company Logo</small>
                                                                ) : (
                                                                        <img src={this.state.imgSrc} width="150"></img>
                                                                    )}
                                                                <input type="file" ref="file" name="logo" id="uploadId" onChange={this.uploadLogo} />
                                                            </label>

                                                        </>
                                                    ) : (
                                                            <>
                                                                {this.state.imgSrc === '' ? (
                                                                    <img src={config.BASE_URL + this.state.companyLogo} class="img-fluid"></img>
                                                                ) : (
                                                                        <img src={this.state.imgSrc} width="150"></img>
                                                                    )}

                                                                <label for="uploadId">
                                                                    <small>Change</small>
                                                                    <input type="file" name="logo" id="uploadId" onChange={this.uploadLogo} />
                                                                </label>
                                                            </>
                                                        )
                                                    }
                                                </span>
                                            </li>
                                        </ul>
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
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.addShow} onHide={this.handleAddClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Organization</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleAddSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="orgName" className="mb-0">Organization Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" ref="orgName" id="orgName" name="orgName" placeholder="Ex: Service Internataional pvt ltd" className="form-control" onChange={this.handleAddChange} required="" />
                                        <div class="errMsg">{this.state.validateFields['orgName']}</div>
                                    </div>
                                </div>
                                <label htmlFor="website" className="mb-0">Your Domain URL</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12 input-group">
                                        <input type="text" ref="domain" id="domain" name="domain" placeholder="Ex: service.yyy.com" className="form-control" onChange={this.handleAddChange} required="" /><div class="input-group-append"><span class="input-group-text">.{config.DEFAULT_DOMAIN}.vowfirst.com</span></div>
                                        
                                    </div>
                                    <div class="errMsg ml-3">{this.state.validateFields['domain']}</div>
                                </div>
                                <label htmlFor="contactPerson" className="mb-0">Account Owner</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" ref="contactPerson" id="contactPerson" name="contactPerson" placeholder="Ex: Lukus Adoms" className="form-control" onChange={this.handleAddChange} required="" />
                                        <div class="errMsg">{this.state.validateFields['contactPerson']}</div>
                                    </div>
                                </div>

                                <label htmlFor="contactNumber" className="mb-0">Contact Number</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <PhoneInput country={'ae'} ref="contactNumber" id="contactNumber" name="contactNumber" placeholder="Ex: 9898988989" className="form-control" onChange={this.handleChange} required="" onChange={(value, data, event, formattedValue) => this.handlePhoneChange(value, data, event, formattedValue, 'contactNumber')} />
                                        <div class="errMsg">{this.state.validateFields['contactNumber']}</div>
                                    </div>
                                </div>

                                <label htmlFor="companyAddress" className="mb-0">Official Address</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" ref="companyAddress" id="companyAddress" name="companyAddress" placeholder="Ex: 10th floor, control Tower, Moter City, Duvai" onChange={this.handleAddChange} className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['companyAddress']}</div>
                                    </div>
                                </div>
                                <label htmlFor="email" className="mb-0">Email</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" ref="email" id="email" name="email" onChange={this.handleAddChange} className="form-control" required="" />
                                        <div class="errMsg">{this.state.validateFields['email']}</div>
                                    </div>
                                </div>

                                <label htmlFor="companyAddress" className="mb-0">Company Logo</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <ul className="myinfoListing">
                                            <li>
                                                <label>Upload Your Logo </label>
                                                <span>


                                                    <label for="uploadId" className="squireUpload">
                                                        {this.state.imgSrc === '' ? (
                                                            <small>Your Company Logo</small>
                                                        ) : (
                                                                <img src={this.state.imgSrc} width="150"></img>
                                                            )}
                                                        <input type="file" name="logo" id="uploadId" onChange={this.uploadLogo} />
                                                    </label>


                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleAddClose}>
                                Close
                            </Button>
                            <Button type="submit" variant="primary">
                                Save
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>


            </>
        );
    }
}

export default Organizations;
