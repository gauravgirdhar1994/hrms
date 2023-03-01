
import React, { Component } from 'react'
// import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button, Card, Table, Form, Row, ProgressBar } from "react-bootstrap";
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Progress } from 'reactstrap';
import config from '../../config/config';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from "react-router-dom";
import Moment from 'moment';
import UploadDocument from '../Documents/UploadDocument';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'
import DatePicker from "react-datepicker";
import moment from 'moment';
// import UploadDocument from '../Documents/UploadDocument';

class OnboardingLast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            form: [],
            data: [],
            orgId: localStorage.getItem("orgId"),
            token: localStorage.getItem("userData"),
            redirect: false,
            Documents: [],
            requiredDocuments: [],
            fields: [{ "email": "Official Email", "empCode": "Employee Code", "grade": "Grade" }],
            validateFields: {},
            value: '',
            documentsNeeded: '',
            documentImages: [],
            showDocuments: false,
            photoIndex: 0,
            selectedFile: [],
            uploadDocumentShow: false,
            percentage: 0,
            files: [],
            uploadMsg: '',
            fileId: [],
            isOpen: false,
            askEmployee: true, 
            gradesList: []
        }
        this.refreshData = this.refreshData.bind(this)
        this.openLightBox = this.openLightBox.bind(this);
    }

    handleShow = () => {

        this.setState({ show: true })
    };

    handleClose = () => {

        this.setState({ show: false })
    };


    handleChange = (event) => {
        console.log('Input event', event.target.value);
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            form: {
                ...this.state.form, [name]: value
            },
            data: {
                ...this.state.data, [name]: value
            },
            validateFields: {
                ...this.state.validateFields, [name]: ''
            }
        })
    }

    gotoList = () => {
        this.setState({ redirect: true });
    }

    componentDidMount = () => {
        if (this.props.id) {
            this.refreshData();
        }
    }

    refreshData() {
        var bearer = 'Bearer ' + this.state.token;
        let apiUrl = '';
        if (this.props.id) {
            apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId + "?id=" + this.props.id + "&tab=6";
        }
        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                var arrTen = [];
                for (var k = 0; k < r.data.onboardingData.gradesList.length; k++) {
                    arrTen.push(<option key={r.data.onboardingData.gradesList[k].grade} value={r.data.onboardingData.gradesList[k].grade}> {r.data.onboardingData.gradesList[k].displayName} </option>);
                }
                this.setState({ data: r.data.onboardingData.rows[0], dataCount: r.data.onboardingData.count, Documents: r.data.onboardingData.Documents, requiredDocuments: r.data.onboardingData.requiredDocuments, gradesList: arrTen })
                this.setState({
                    documentsNeeded: r.data.onboardingData.rows[0].documentsNeeded
                });
                if (this.state.data && this.state.data.documentLink) {
                    this.setState({
                        askEmployee: false
                    })
                }
                console.log('Api result', this.state.data);
            })
            .catch((error) => {
                console.log("API ERR: ", error);
                console.error(error);
                // res.json({ error: error });
            });
    }

    onChangeDate = estimatedJoiningDate => this.setState({
        form: {
            ...this.state.form, ['estimatedJoiningDate']: estimatedJoiningDate
        },
        data: {
            ...this.state.data, ['estimatedJoiningDate']: estimatedJoiningDate
        },
        validateFields: {
            ...this.state.validateFields, ['estimatedJoiningDate']: ''
        }
    })

    handleSubmit = () => {

        let datas = this.state.form;
        datas.orgId = this.state.orgId;
        // console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=6";
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        if (this.validateForm()) {
            axios.post(apiUrl, datas, { headers: headers })
                .then(res => {
                    console.log('POST response', res);
                    if (res.data.success === true) {
                        toast.success(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 2000)
                        this.setState({ redirect: true })
                    }
                    else {
                        toast.error(res.data.message);
                        setTimeout(function () {
                            toast.dismiss()
                        }, 50000)
                    }

                })
        }
    }

    validateForm() {
        let fields = this.state.fields[0];
        let validations = {};
        let isFormValid = true;
        if (fields) {
            console.log('Payroll Fields', fields);
            for (var key in fields) {
                if (
                    this.refs[key].value == "" ||
                    typeof this.refs[key].value == "undefined" ||
                    this.refs[key].value == null
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

    viewDocument = (cell, row) => {
        return (
            <button type="button" className="btn btn-sm btn-outline-danger ml-2">View Document</button>
        )
    }
    download = (cell, row) => {
        return (
            <button type="button" className="btn btn-sm btn-outline-danger ml-2">Download</button>
        )
    }
    uploadAgain = (id) => {
        console.log('Upload Again id', id)
        this.setState({ selectedDocument: id, show: true });
    }

    checkBox = (event) => {
        console.log('Checkbox clicked', event.target.value, this.state.documentsNeeded);
        this.setState({
            documentsNeeded: [...this.state.documentsNeeded, Number(event.target.value)]
        });
    }

    updateDocumentsNeeded = () => {
        const datas = {};
        datas.documentsNeeded = this.state.documentsNeeded;

        const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=6";

        var bearer = 'Bearer ' + this.state.token;

        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                if (res.status == 200) {
                    toast.success(res.data.message);
                    this.refreshData();
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                }
                else {
                    toast.error(res.data.message);
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                }
                // console.log('POST response',res);
            })
    }

    filterArrayElementByEdit(array, value) {
        return array.filter((element) => {
            return element.id === value;
        })
    }

    openLightBox = (id) => {
        let documentImages = this.filterArrayElementByEdit(this.state.Documents, id)[0].documentPath;
        let lightboxImages = [];
        for (var key in documentImages) {
            let imageData = {};
            lightboxImages.push(config.BASE_URL + documentImages[key]);
            console.log('lightboxImages', lightboxImages);
            if (key == documentImages.length - 1) {
                this.setState({
                    documentImages: lightboxImages,
                    isOpen: true
                })
            }
        }
        console.log('lightBox images', documentImages);
    }

    checkDocumentType = (row, type) => {
        // console.log('Document Type', row)
        if (row.documentType === type) {
            // console.log('Document Row', row)
            return <tr><td>{((this.state.data && (this.state.data.documentsNeeded === null || this.state.data.documentsNeeded === '')) || (this.state.data.documentsNeeded && !this.state.data.documentsNeeded.includes(row.id))) && this.state.askEmployee && row.status !== 'Uploaded' ? (<><label className="hrms_control inline-block hrms_checkbox"><input type="checkbox" name="documentsNeeded[]" value={row.id} onChange={this.checkBox} /> <i className="hrms_control__indicator"></i> </label></>) : <label></label>} {row.documentName}{this.state.requiredDocuments.includes(row.id) ? <span className="requiredDocument">*</span> : ''}</td><td className={row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{(this.state.data.documentsNeeded && this.state.data.documentsNeeded.includes(row.id)) && row.status !== 'Uploaded' ? 'Asked from Employee' : row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={() => this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : ''}</span><span>{row.status === 'Uploaded' ? <span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span> : ''}</span><span>{row.status === 'Uploaded' ? '' : (<button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>Upload</button>)}</span></td></tr>;
        }
        else {
            return '';
        }
    }

    gotoList = () => {
        this.setState({ redirect: true });
    }

    checkDocStatus = (row) => {
        if (!this.state.showDocuments && this.state.Documents) {
            if (row.status === 'Uploaded') {
                this.setState({
                    showDocuments: true
                })
            }
        }
    }

    render() {

        if (this.state.redirect) {
            this.setState({ redirect: false });
            return <Redirect to={{
                pathname: "/employee/on-boarding/list",
                // state:{ticketMessage: "Your ticket has been submitted succeefully!"},
            }} />
        }

        if (this.state.data.length == 0) {
            return null;
        }

        console.log('Form Data', this.state.data);
        let otherRows = {};
        let mandatoryRows = {};
        if (this.state.Documents) {
            mandatoryRows = this.state.Documents.map(row => this.checkDocumentType(row, 1));
            otherRows = this.state.Documents.map(row => this.checkDocumentType(row, 2));
            if (mandatoryRows) {
                this.state.Documents.map(row =>
                    this.checkDocStatus(row)
                );
            }
        }
        const { photoIndex, isOpen } = this.state;
        const images = this.state.documentImages;
        console.log('Get field Value', this.state.form.email, this.state.data.email);
        return (
            <>
                <ToastContainer />
                <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">

                    <Row>
                        <div className="col-md-6">
                            <h4 className="mb-4">Joining Details</h4>
                        </div>
                        <div className="col-md-6">
                            <h4 className="mb-4 font-16 float-right status-block">Status <span>{config.ONBOARDING_STATUS[this.state.data.status]}</span></h4>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-4">
                                    <label for="ticket_type">Official Email</label>
                                </div>
                                <div className="col-sm-8">
                                    <input type="text" ref="email" className="form-control" value={this.state.form && (this.state.form.email !== "0" && this.state.form.email !== undefined) ? this.state.form.email : this.state.data && this.state.data.email ? this.state.data.email : ''} name="email" onChange={this.handleChange} />
                                    <div class="errMsg">{this.state.validateFields['email']}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-4">
                                    <label for="priority">Employee Code</label>
                                </div>
                                <div className="col-sm-8">
                                    <input type="text" ref="empCode" className="form-control" value={this.state.form && this.state.form.empCode !== undefined ? this.state.form.empCode : this.state.data && this.state.data.empCode ? this.state.data.empCode : ''} name="empCode" onChange={this.handleChange} />
                                    <div class="errMsg">{this.state.validateFields['empCode']}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-4">
                                    <label for="priority">Grade/Band</label>
                                </div>
                                <div className="col-sm-8">
                                <select ref="grade" name="grade" className="form-control" value={this.state.form && this.state.form.grade !== undefined ? this.state.form.grade : this.state.data && this.state.data.grade ? this.state.data.grade : ''} onChange={this.handleChange}>
                                        <option>Select grade</option>
                                        {this.state.gradesList}
                                </select>
                                    {/* <input type="text" ref="grade" className="form-control" value={this.state.form && this.state.form.grade !== undefined ? this.state.form.grade : this.state.data && this.state.data.grade ? this.state.data.grade : ''} name="grade" onChange={this.handleChange} /> */}
                                    <div class="errMsg">{this.state.validateFields['grade']}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-4">
                                    <label for="priority">Joining Date</label>
                                </div>
                                <div className="col-sm-8">
                                    <DatePicker showYearDropdown dropdownMode="scroll"
                                        minDate={moment().toDate()}
                                        className="form-control"
                                        selected={this.state.data && this.state.data.estimatedJoiningDate ? moment(this.state.data.estimatedJoiningDate).toDate() : ''}
                                        value={this.state.data && this.state.data.estimatedJoiningDate ? moment(this.state.data.estimatedJoiningDate).toDate() : ''}
                                        name="estimatedJoiningDate"
                                        ref="estimatedJoiningDate"
                                        dateFormat={config.DP_INPUT_DATE_FORMAT}
                                        onChange={this.onChangeDate}
                                    />
                                    <div class="errMsg">{this.state.validateFields['estimatedJoiningDate']}</div>
                                </div>
                            </div>
                        </div>
                    </Row>

                    {!this.state.showDocuments ? (<p>Do you want to ask for more documents from the employee? <a href="javascript:void" onClick={this.showDocTable}>click here</a></p>) : ''}

                    {this.state.data && this.state.Documents && this.state.showDocuments ? (
                        <Row>
                            {this.state.askEmployee ? (<div className="col-md-6 offset-md-6 pull-right"><button type="button" onClick={this.updateDocumentsNeeded} className="btn btn-md btn-primary pull-right mb-3 mr-15">Ask employee</button></div>) : ''}
                            <table className="table table-striped table-bordered">
                                <thead style={{ background: "#f0f8ff" }}>
                                    <tr>
                                        <td>Document Type</td>
                                        <td>Status</td>
                                        <td>Uploaded On</td>
                                        <td>Actions</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mandatoryRows}
                                    {otherRows}
                                </tbody>
                            </table>

                        </Row>
                    ) : ''}

                    <UploadDocument show={this.state.show} onRefresh={this.refreshData} selectedDocument={this.state.selectedDocument} onHide={this.handleClose} empId={this.state.data.empId} />

                    {isOpen && (
                        <Lightbox
                            mainSrc={images[photoIndex]}
                            nextSrc={images[(photoIndex + 1) % images.length]}
                            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                            onMovePrevRequest={() =>
                                this.setState({
                                    photoIndex: (photoIndex + images.length - 1) % images.length,
                                })
                            }
                            onMoveNextRequest={() =>
                                this.setState({
                                    photoIndex: (photoIndex + 1) % images.length,
                                })
                            }
                        />
                    )}

                </Card>
                <div className="form-group row pt-5 edit-basicinfo">
                    <div className="col-lg-12 text-center">
                        <input
                            type="reset"
                            className="btn btn-outline-primary mr-2"
                            value="Cancel"
                            onClick={this.gotoList}
                        />
                        <Button type="submit" variant="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}

export default OnboardingLast;