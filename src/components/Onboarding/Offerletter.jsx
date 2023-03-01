
import React, { Component } from 'react'
// import { Row, Col, Card, Table, Button } from 'reactstrap';
import { Modal, Button, Card, Table, Form, Row, ProgressBar } from "react-bootstrap";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
import Moment from 'moment';
import { Redirect } from "react-router-dom";
import UploadDocument from '../Documents/UploadDocument';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'

class Offerletter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: localStorage.getItem("orgId"),
            token: localStorage.getItem("userData"),
            letterUploaded: false,
            data: [],
            dataCount: '',
            Documents: [],
            requiredDocuments: [],
            show: false,
            showDocuments: true,
            redirect: false,
            value: '',
            documentsNeeded: [],
            selectedFile: [],
            documentImages: [],
            photoIndex: 0,
            isOpen: false,
            askEmployee: true,
            visaSponsored : '',
            medicalSponsored: '',
            submitOfferLetter : {'visaSponsored' : '', 'medicalSponsored' : ''}
        }
        this.refreshData = this.refreshData.bind(this);
        this.openLightBox = this.openLightBox.bind(this);
        this.changeRadiobutton = this.changeRadiobutton.bind(this);

    }

    componentDidMount() {
        this.refreshData();
    }

    checkMimeType = (event) => {

        //getting file object
        let files = event.target.files[0];
        console.log('Check file type', files);
        //define message container
        let err = []
        // list allow mime type
        const types = ['application/pdf']
        // loop access array
        let pdfCount = 0;
        let x = 0;
        if (types.every(type => files.type !== type)) {
            // create error message and assign to container   
            err[x] = files.type + ' is not a supported format\n';
        }
        console.log('Error', err);
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            console.log('File error', err[z]);
            toast.error(err[z])
            // event.target.value = null
        }
        if (err.length >= 1) {
            return false;
        }
        return true;
    }

    refreshData() {
        var bearer = 'Bearer ' + this.state.token;
        let apiUrl = '';
        if (this.props.id) {
            apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId + "?id=" + this.props.id + "&tab=3&reqDocs=${reqDocs.join(',')}";
        }

        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({ data: r.data.onboardingData.rows[0], dataCount: r.data.onboardingData.count, Documents: r.data.onboardingData.Documents, requiredDocuments: r.data.onboardingData.requiredDocuments })
                if (r.data.onboardingData.rows[0].filePath) {
                    this.setState({
                        letterUploaded: true
                    })
                }
                this.setState({
                    documentsNeeded: r.data.onboardingData.rows[0].documentsNeeded ? r.data.onboardingData.rows[0].documentsNeeded : ''
                });
                if (this.state.data && this.state.data.documentLink) {
                    this.setState({
                        askEmployee: false
                    })
                }

                console.log('Api result', this.state.dataCount);
            })
            .catch((error) => {
                console.log("API ERR: ", error);
                console.error(error);
                // res.json({ error: error });
            });
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

        const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=1";

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

    uploadFile = (event) => {
        var bearer = 'Bearer ' + this.state.token;

        const headers = {
            "Authorization": bearer
        };

        let isFormValid = true;
        this.state.selectedFile = event.target.files[0];
        // Details of the uploaded file 
        console.log('Selected file', this.state.selectedFile);

        if (this.checkMimeType(event)) {
            const formData = new FormData();

            // Update the formData object 
            formData.append(
                'file',
                this.state.selectedFile
            );
                let submitOfferLetter = [];
            if(!this.state.data.visaSponsored){
                
                submitOfferLetter['visaSponsored'] = 'Please select one option';
                    isFormValid = false;
            }
            if(!this.state.data.medicalSponsored){
                submitOfferLetter['medicalSponsored'] = 'Please select one option';
                isFormValid = false
            }

            this.setState({
                    submitOfferLetter
            })

            if(isFormValid){
                formData.append('visaSponsored', this.state.data.visaSponsored);
                formData.append('medicalSponsored', this.state.data.medicalSponsored);

            const apiUrl = config.API_URL + '/upload/offerLetter/' + this.props.id;

            // Request made to the backend api 
            // Send formData object 
            axios.post(apiUrl, formData, { headers: headers }).then(res => {
                toast.success(res.data.message);
                this.refreshData();
                setTimeout(function () {
                    toast.dismiss()
                }, 2000)
                // this.props.setActiveTab(4);
            });
            }
            
        }


    }

    handleShow = () => {
        this.setState({ show: true })
    };

    handleClose = () => {

        this.setState({ show: false })
    };


    showDocTable = () => {
        this.setState({
            showDocuments: !this.state.showDocuments
        })
    }

    hideTable = () => {
        this.setState({
            showDocuments: false
        })
    }

    sendOfferLetter = (empId) => {
        const apiUrl = config.API_URL + '/employee/onBoarding/sendOfferLetter/' + empId;
        var bearer = 'Bearer ' + this.state.token;

        const headers = {
            "Authorization": bearer
        };
        // Request made to the backend api 
        // Send formData object 
        axios.post(apiUrl, '', { headers: headers }).then(res => {
            toast.success(res.data.message);
            this.refreshData();
            setTimeout(function () {
                toast.dismiss()
            }, 2000)
            // this.props.setActiveTab(4);
            // this.setState({ redirect: true });
        });
    }

    gotoList = () => {
        this.setState({ redirect: true });
    }

    gotoNext = () => {
        this.props.setActiveTab(4);
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


    changeRadiobutton = (event, name) => {
        
            console.log('change Radio button', event.target.value, name);
            if(name === 'visaSponsored'){
                this.setState({
                        visaSponsored : event.target.value,
                        data :{
                                ...this.state.data, ['visaSponsored'] : event.target.value
                        }
                })
            }
            if(name === 'medicalSponsored'){
                this.setState({
                        medicalSponsored : event.target.value,
                        data :{
                                ...this.state.data, ['medicalSponsored'] : event.target.value
                        }
                })
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
        console.log('Show Document', this.state.medicalSponsored, this.state.visaSponsored,this.state.data.medicalSponsored, this.state.data.visaSponsored);
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

        return (
            <>
                <ToastContainer />
                <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">

                    <Row>
                        <div className="col-md-6">
                            <h4>Offer Letter</h4>
                        </div>
                        <div className="col-md-6">
                            <h4 className="mb-4 font-16 float-right status-block">Status <span>{config.ONBOARDING_STATUS[this.state.data.status]}</span></h4>
                        </div>
                    </Row>

                    


                    {this.state.data && this.state.data.filePath ? (
                        <div className="col-sm-12 text-center">
                            {this.state.data.offerLetterStatus === 'yes' ? (<h3 className="pt-4">{this.state.data.firstname} {this.state.data.lastname} {this.state.data.status < 4 ? 'Offer Letter Uploaded' : this.state.data.offerLetterStatus && this.state.data.offerLetterStatus === 'yes' ? 'Offer Letter Accepted' : ''}</h3>) : (<h3 className="pt-4">{this.state.data.firstname} {this.state.data.lastname} {this.state.data.offerLetterStatus && this.state.data.offerLetterStatus === 'no' ? 'Offer Letter Rejected' : this.state.data.status < 4 ? 'Offer Letter Uploaded' : 'Offer Letter Sent'}</h3>)}


                            <div className="form-group row pt-3 mb-3 edit-basicinfo">
                                <div className="col-lg-12 text-center">

                                    {this.state.data.status < 4 ? (
                                        <>
                                            <label>Send an email to the candidate requesting to scan/sign the offer letter and upload</label>
                                            <p>{this.state.data.personalEmail}</p>
                                            <div className="form-group row pt-2 edit-basicinfo">
                                                <div className="col-lg-12 text-center">
                                                    <input
                                                        type="reset"
                                                        className="btn btn-outline-primary mr-2"
                                                        value="Cancel" onClick={this.gotoList}
                                                    />

                                                    <Button type="submit" variant="primary" onClick={() => this.sendOfferLetter(this.state.data.empId)}>
                                                        Send Offer Letter
                                             </Button>
                                                </div>
                                            </div>
                                        </>
                                    ) : ''}

                                    {this.state.data.offerLetterStatus === 'no' ?
                                        <p className="font-16 mt-3 mb-3"><strong>{this.state.data.reason ? 'Reason: ' + this.state.data.reason : ''}</strong></p>
                                        : this.state.data.offerLetterStatus === 'yes' && this.state.data.signedfilePath ? <a className="btn btn-primary mb-3 btn-md text-white font-16 font-weight-bold" href={config.BASE_URL + this.state.data.signedfilePath} download target="_blank">Download Signed Offer Letter</a> : ''}

                                    {this.state.data && this.state.data.uaeResident && this.state.data.statusChangeUploaded === false && this.state.data.offerLetterStatus === 'yes' ? (
                                        <p className="mt-2"><a href="javascript:void(0)" class="btn btn-primary mx-auto mb-3" onClick={() => this.uploadAgain(17)}>Upload Status Change Page from Passport </a></p>
                                    ) : ''}


                                    {/* {!this.state.showDocuments ? (<p class="font-16">Do you want to ask for more documents from the employee? <a href="javascript:void" onClick={this.showDocTable}>Click Here</a></p>) : ''} */}

                                </div>
                            </div>
                        </div>


                    ) : (
                            <>
                        <Row>
                        <div class="col-md-6">
                                <p>Is the dependent Visa Sponsored by the Company ?</p>
                                <select name="visaSponsored" className="form-control cutom-select" onChange={(e) => this.changeRadiobutton(e, 'visaSponsored')} value={this.state.data.visaSponsored ? this.state.data.visaSponsored : this.state.visaSponsored}>
                                        <option selected>Select</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                </select>
                    <div className="errMsg">{this.state.submitOfferLetter['visaSponsored'] ? this.state.submitOfferLetter['visaSponsored'] : "" }</div>
                        </div>
         
                        <div class="col-md-6">
                                <p>Is Medical Insurance Sponsored by the Company ?</p>
                                <select name="medicalSponsored" onChange={(e) => this.changeRadiobutton(e, 'medicalSponsored')} className="form-control cutom-select" value={this.state.data.medicalSponsored ? this.state.data.medicalSponsored : this.state.medicalSponsored}>
                                        <option selected>Select</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                </select>
                                <div className="errMsg">{this.state.submitOfferLetter['medicalSponsored'] ? this.state.submitOfferLetter['medicalSponsored'] : "" }</div>
                        </div>
                </Row>
                

                <hr></hr>

                            <div className="col-sm-12 text-center">
                                <p className="font-14 pt-4">Upload and send and Offer letter to the candidate</p>

                                <div className="form-group row pt-3 mb-5 edit-basicinfo">
                                    <div className="col-lg-12 te
                                    xt-center">
                                        {/* <label>Upload Offer Letter </label> */}
                                        <span>
                                            <label for="uploadId" className="squireUpload">
                                                <small>Upload Offer Letter</small>
                                                <input type="file" name="logo" id="uploadId" onChange={this.uploadFile} />
                                            </label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                        )}

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
                    {this.state.show ? ( <UploadDocument show={this.state.show} onRefresh={this.refreshData} selectedDocument={this.state.selectedDocument} onHide={this.handleClose} empId={this.state.data.empId} />) : ''}
                   

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
               

                    {this.state.data && this.state.data.uaeResident && this.state.data.statusChangeUploaded === false && this.state.data.offerLetterStatus === 'yes' ? (
                        ''
                    ) : (

                        this.state.data.offerLetterStatus === 'yes' && this.state.data.signedfilePath ? (<div className="form-group row pt-5 edit-basicinfo">
                        <div className="col-lg-12 text-center">
                            <input
                                type="reset"
                                className="btn btn-outline-primary mr-2"
                                value="Cancel" onClick={this.gotoList}
                            />

                            <Button type="button" variant="primary" onClick={this.gotoNext}>
                                Next
                            </Button>
                        </div>
                    </div>) : ''
                            
                        )}

                
                </Card>
            </>
        );
    }
}

export default Offerletter;