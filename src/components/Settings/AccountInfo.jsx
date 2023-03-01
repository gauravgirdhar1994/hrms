import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
class AccountInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: '',
            addShow: '',
            data: [],
            form: [],
            companyLogo: '',
            selectedFile: '',
            imgSrc: '',
            token: localStorage.getItem("userData"),
            orgId: localStorage.getItem("orgId"),
        }
    }

    componentDidMount() {
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/organization/' + this.state.orgId, { headers: { Authorization: bearer } })
            .then(r => {
                console.log('Api result', r);
                this.setState({ data: r.data.organizations })
                this.setState({ companyLogo: r.data.organizations.logo })
                console.log(this.state.companyLogo)
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_ORG_IMG_URL
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

    handleChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            data: {
                ...this.state.data, [name]: value
            }
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
            }
        })

    }

    handleSubmit = (event) => {
        console.log('Form Data', this.state.data);
        let datas = this.state.data;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/organization/edit/' + this.state.orgId;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                console.log('POST response', res);
            })

        const toasts = "Updated Successfully"
        toast.success('Updated Successfully');
        setTimeout(function () {
            toast.dismiss()
        }, 2000)
        this.setState({ show: false })
    }

    handleAddSubmit = (event) => {
        console.log('Form Data', this.state.form);
        let datas = this.state.form;
        console.log('Form Data', datas);
        const apiUrl = config.API_URL + '/organization/add';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                console.log('POST response', res);
                if (res.data.success === true) {
                    // const toasts = "Updated Successfully"
                    toast.success(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.setState({ show: false })
                }
                else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => {
                console.log('Error API', error);
            })
    }

    uploadLogo = (event) => {
        var bearer = 'Bearer ' + BEARER_TOKEN;

        const headers = {
            "Authorization": bearer
        };

        this.state.selectedFile = event.target.files[0];
        
        let reader = new FileReader();
        
        reader.onloadend = () => {
            console.log('Load end', reader.result);
            this.setState({
                imgSrc: reader.result
            });
            console.log('Image src state', this.state.imgSrc);
        }
        
        reader.readAsDataURL(event.target.files[0])

        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );
        formData.append('orgId', this.state.orgId);
        formData.append('uploadLogo', true);

        axios.post(config.API_URL + "/upload/CompanyLogo", formData, { headers: headers }).then(res => {
            console.log('POST response', res);
            this.setState({ companyLogo: res.data.companyLogo, data:{
                    ...this.state.data, ['logo']: res.data.companyLogo}
            })
            toast.success(res.data.message);
            setTimeout(function(){
                toast.dismiss()
            },2000)
        });

    }


    render() {
        
        if(!this.state.data){
            return null;
        }

        return (
            <>
                <ToastContainer />
                <Card className="card d-block p-1 mb-4 shadow-sm">
                    <span className="anchor" id="formComplex"></span>
                    <div className="my-4" />
                    <h6 className="pl-3 mt-3">Account Info </h6>

                    <div className=" mt-4  pr-3">
                        <div className="col-lg-12">
                            <ul className="myinfoListing">
                                <li>
                                    <label>Registered Company</label>
                                    <span>{this.state.data.orgName}</span>
                                </li>
                                {/* <li>
                                    <label >Your Domain URL</label>
                                    <span>{this.state.data.website}</span>
                                </li> */}
                                <li>
                                    <label >Account Owners</label>
                                    <span>{this.state.data.contactPerson}</span>
                                </li>
                                <li>
                                    <label >Contact Number</label>
                                    <span>{this.state.data.contactNumber}</span>
                                </li>

                                <li>
                                    <label >Contact Address</label>
                                    <span>{this.state.data.companyAddress}</span>

                                </li>

                            </ul>

                        </div>
                    </div>
                </Card>
                
                <div className="form-group row pt-2 ">
                    <div className="col-lg-12 text-center">
                        <input onClick={this.handleShow} type="button" className="btn btn-primary" value="Edit" />
                    </div>
                </div>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Account Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>
                            <fieldset>
                                <label htmlFor="orgName" className="mb-0">Registered Company Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="orgName" name="orgName" placeholder="Ex: Service Internataional pvt ltd" className="form-control" onChange={this.handleChange} value={this.state.data.orgName} required="" />
                                    </div>
                                </div>
                                <label htmlFor="website" className="mb-0">Your Domain URL</label>
                                <div className="row mb-3">
                                <div className="col-lg-12 input-group">
                                        <input type="text" id="domain" name="domain" placeholder="Ex: service.yyy.com" className="form-control" disabled onChange={this.handleChange} required="" value={this.state.data.domain} /><div class="input-group-append"><span class="input-group-text">.{config.DEFAULT_DOMAIN}.91wheels.com</span>
                                        </div>
                                        
                                    </div>
                                </div>
                                <label htmlFor="contactPerson" className="mb-0">Account Owners</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="contactPerson" name="contactPerson" placeholder="Ex: Lukus Adoms" className="form-control" onChange={this.handleChange} required="" value={this.state.data.contactPerson} />
                                    </div>
                                </div>

                                <label htmlFor="contactNumber" className="mb-0">Contact Number</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="contactNumber" name="contactNumber" placeholder="Ex: 9898988989" className="form-control" onChange={this.handleChange} required="" value={this.state.data.contactNumber} />
                                    </div>
                                </div>

                                <label htmlFor="contactNumber" className="mb-0">Email</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="email" disabled name="email" className="form-control" onChange={this.handleChange} required="" value={this.state.data.email} />
                                    </div>
                                </div>

                                <label htmlFor="companyAddress" className="mb-0">Contact Address</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="companyAddress" name="companyAddress" placeholder="Ex: 10th floor, control Tower, Moter City, Duvai" onChange={this.handleChange} className="form-control" required="" value={this.state.data.companyAddress} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label>Upload Your Logo </label>
                                    <span>
                                        {this.state.companyLogo === '' ? (
                                            <>


                                                <label for="uploadId" className="squireUpload">
                                                    {this.state.imgSrc === '' ? (
                                                        <small>Your Company Logo</small>
                                                    ) : (
                                                            <img src={this.state.imgSrc} onError={this.addDefaultSrc} width="150"></img>
                                                        )}
                                                    <input type="file" ref="file" name="logo" id="uploadId" onChange={this.uploadLogo} />
                                                </label>

                                            </>
                                        ) : (
                                                <>
                                                   

                                                    <label for="uploadId" className="squireUpload">
                                                    {this.state.imgSrc === '' ? (
                                                        <img src={config.BASE_URL + this.state.companyLogo} onError={this.addDefaultSrc} class="img-fluid"></img>
                                                    ) : (
                                                            <img src={this.state.imgSrc} onError={this.addDefaultSrc} width="150"></img>
                                                        )}
                                                        <input type="file" name="logo" id="uploadId" onChange={this.uploadLogo} />
                                                    </label>
                                                </>
                                            )
                                        }
                                    </span>
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
                                <label htmlFor="orgName" className="mb-0">Registered Company Name</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="orgName" name="orgName" placeholder="Ex: Service Internataional pvt ltd" className="form-control" onChange={this.handleAddChange} required="" />
                                    </div>
                                </div>
                                <label htmlFor="website" className="mb-0">Your Domain URL</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="website" name="website" placeholder="Ex: service.yyy.com" className="form-control" onChange={this.handleAddChange} required="" />
                                    </div>
                                </div>
                                <label htmlFor="contactPerson" className="mb-0">Account Owners</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="contactPerson" name="contactPerson" placeholder="Ex: Lukus Adoms" className="form-control" onChange={this.handleAddChange} required="" />
                                    </div>
                                </div>

                                <label htmlFor="contactNumber" className="mb-0">Contact Number</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="contactNumber" name="contactNumber" placeholder="Ex: 9898988989" className="form-control" onChange={this.handleAddChange} required="" />
                                    </div>
                                </div>

                                <label htmlFor="companyAddress" className="mb-0">Contact Address</label>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <input type="text" id="companyAddress" name="companyAddress" placeholder="Ex: 10th floor, control Tower, Moter City, Duvai" onChange={this.handleAddChange} className="form-control" required="" />
                                    </div>
                                </div>

                            </fieldset>
                            <Button variant="outline-primary mr-2" onClick={this.handleAddClose}>
                                Close
                        </Button>
                            <Button type="submit" variant="primary" onClick={this.handleAddClose}>
                                Save
                        </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>


            </>
        )
    }

}

export default AccountInfo;