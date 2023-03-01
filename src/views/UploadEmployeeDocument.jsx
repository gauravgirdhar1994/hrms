import React, { Component } from 'react';
import { Row, Col, Card, Table, Button } from 'reactstrap';
import config from '../config/config';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, ProgressBar } from "react-bootstrap"
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from "react-router-dom";
import Moment from 'moment';
import UploadDocument from '../components/Documents/UploadDocument';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'


class UploadEmployeeDocument extends Component {
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
            uploadedDocuments : [],
            value: '',
            documentsNeeded: [],
            AllDocuments: [],
            selectedFile: '',
            document: '',
            percentage: 0,
            invalidLink: true,
            files: [],
            uploadMsg: '',
            documentImages: [],
            photoIndex: 0,
            isOpen: false
        }
        this.refreshData = this.refreshData.bind(this);
        this.openLightBox = this.openLightBox.bind(this);

        this.onDrop = (files) => {
            console.log(files);
            this.setState({ selectedFile: files }, () => {
                this.onChangeHandler();
            })
        };
    }

    componentDidMount = () => {
        this.refreshData();
    }

    checkMimeType = (event) => {
        //getting file object
        let files = this.state.selectedFile;
        //define message container
        let err = []
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
        // loop access array
        let pdfCount = 0;
        for (var x = 0; x < files.length; x++) {
            console.log('Files', x);
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err[x] = files[x].type + ' is not a supported format\n';
            }
            if (files[x].type === 'application/pdf') {
                pdfCount++;
                if (pdfCount > 1) {
                    err[x] = 'Muliple PDFs cannot be uploaded';
                }
            }
        };
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

    maxSelectFile = (event) => {
        let files = this.state.selectedFile;
        if (files.length > 3) {
            const msg = 'Only 3 images can be uploaded at a time'
            // event.target.value = null
            toast.warn(msg)
            return false;
        }
        return true;
    }

    handleClose = () => {
        console.log('close button')
        this.setState({ show: false })
    };

    checkFileSize = (event) => {
        let files = this.state.selectedFile;
        let size = 2000000
        let err = [];
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err[x] = files[x].type + 'is too large, please pick a smaller file\n';
            }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            toast.error(err[z])
            // event.target.value = null
        }
        return true;
    }

    onChangeHandler = event => {
        let files = this.state.selectedFile;
        // console.log('File Upload',this.checkMimeType(event));
        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
            // if return true allow to setState
            this.setState({
                selectedFile: files,
                loaded: 0
            }, () => {
                this.onClickHandler();
            })
        }
    }

    filterArrayElementByEdit(array, value) {
        return array.filter((element) => {
            return element.id === value;
        })
    }

    openLightBox = (id) => {
        let documentImages = this.filterArrayElementByEdit(this.state.data.Documents, id)[0].documentPath;
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

    onClickHandler = () => {
        console.log('Document TYpe', this.refs.document.value);
        const data = new FormData()
        for (var x = 0; x < this.state.selectedFile.length; x++) {
            console.log(this.state.selectedFile[x])
            data.append('file', this.state.selectedFile[x])
            console.log(data);
        }
        data.append('orgId', this.state.data.orgId)
        data.append('hrmUpload', false);
        if (this.state.data.empId) {
            data.append('employeeId', this.state.data.empId)
        }
        else {
            data.append('employeeId', localStorage.getItem("employeeId"))
        }

        data.append('documentType', this.refs.document.value)
        this.setState({
            uploadedDocuments :[...this.state.uploadedDocuments, this.refs.document.value]
        });

        const apiUrl = config.API_URL + '/employee/document/add';

        const options = {
            onUploadProgress: (ProgressEvent) => {
                const { loaded, total } = ProgressEvent;
                let percent = Math.floor(loaded * 100 / total);
                this.state.uploadMsg = `${loaded} kb of ${total}kb | ${percent}% `;
                console.log(`${loaded} kb of ${total}kb | ${percent}% `);

                if (percent < 100) {
                    this.setState({ percentage: percent })
                }
            }
        }

        axios.post(apiUrl, data, options)
            .then(res => {
                this.setState({ percentage: 100 }, () => {
                    setTimeout(() => {
                        // this.refreshData();
                        this.setState({ show: false, selectedFile: null, percentage: 0, uploadMsg: '', currentEmployeeId: res.data.employeeId });
                        if (this.state.currentEmployeeId) {
                            this.refreshData();
                        }
                    }, 1000)
                })

                toast.success(res.data.message);
                setTimeout(function () {
                    toast.dismiss()
                }, 2000)
            })
    }

    handleChange = (event) => {
        // console.log('Input event',this.props.item);   
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            document: value
        })
    }

    refreshData() {
        var bearer = 'Bearer ' + this.state.token;
        let apiUrl = '';
        let urlToken = this.props.match.params.token;
        apiUrl = config.API_URL + '/employee/onboarding/uploaderDocuments/' + urlToken;
        if (this.state.currentEmployeeId) {
            apiUrl = config.API_URL + '/employee/onboarding/uploaderDocuments/' + urlToken + '?empId=' + this.state.currentEmployeeId;
        }

        axios.get(apiUrl)
            .then(r => {
                if (r.data.success) {
                    this.setState({ data: r.data.onboardingData, invalidLink: false, Documents: r.data.onboardingData.Documents, requiredDocuments: r.data.onboardingData.requiredDocuments})
                }
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
        console.log('State Data', this.state.data);
        if (this.state.data) {

            const documentsUrl = config.API_URL + '/employee/documents/view/' + this.state.data.empId;
            axios.get(documentsUrl)
                .then(r => {
                    this.setState({ AllDocuments: r.data.Documents, selectedDocument: id, show: true })
                })
                .catch((error) => {
                    console.log("API ERR: ", error);
                    console.error(error);
                    // res.json({ error: error });
                });
        }
    }

    checkBox = (event) => {
        console.log('Checkbox clicked', event.target.value);
        this.setState({
            documentsNeeded: [...this.state.documentsNeeded, event.target.value]
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
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    this.setState({ redirect: true })
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

    checkDocumentType = (row, type) => {
        console.log('Document Type', row.documentPath.length)
        if (row.documentType === type) {
            // console.log('Document Row', row)
        return <tr><td>{row.documentName}{this.state.requiredDocuments.includes(row.id) ? <span className="requiredDocument">*</span> : ''}</td><td className={row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={() => this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : ''}</span><span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span></td></tr>;
        }
        else {
            return '';
        }
    }

    addDefaultSrc(ev) {
        ev.target.src = config.DEFAULT_ORG_IMG_URL
    }
    addDefaultUserSrc(ev) {
        ev.target.src = config.DEFAULT_USER_IMG_URL
    }


    render() {
        let otherRows = {};
        let mandatoryRows = {};
        if (this.state.Documents) {
            mandatoryRows = this.state.Documents.map(row => this.checkDocumentType(row, 1));
            otherRows = this.state.Documents.map(row => this.checkDocumentType(row, 2));
        }
        let files = [];
        if (this.state.selectedFile) {
            files = this.state.selectedFile.map(file => (
                <li key={file.name}>
                    {file.name} - {file.size} bytes
                </li>
            ));
        }
        const uploadPercent = this.state.percentage;
        const { photoIndex, isOpen } = this.state;
        const images = this.state.documentImages;

        return (
            <>
                <div className="container text-center">
                    <img src={this.state.data ? config.BASE_URL + this.state.data.orgImage : ''} onError={this.addDefaultSrc} className="img-fluid" width="120" styles={{ padding: '30px' }}></img>
                </div>
                {JSON.stringify(this.state.requiredDocuments) === JSON.stringify(this.state.uploadedDocuments) ? (
                           <>
                           <div className="container-fluid py-4 text-center bg-blue mb-3">
                                 <h4 className="font-weight-bold mb-0 font-22 pl-3"><strong>On Boarding Document Uploader</strong></h4>
                            </div>
                            <div className="card container topFilter d-block pl-4 pr-4 pt-3 pb-3 py-4 br-3 mb-4 mt-4 text-center shadow-sm">

                                <h3 className="font-16">Thank you for submitting all the required documents.</h3>

                            </div>
                            </>
                            
                ) : (
                    !this.state.invalidLink ? (
                        <>
                        <div className="container-fluid py-4 text-center bg-blue mb-3">
                                 <h4 className="font-weight-bold mb-0 font-22 pl-3"><strong>On Boarding Document Uploader</strong></h4>
                        </div>
                        <Card>
                            <div className="container py-4">
                              
                                <div className="col-md-12 mx-auto py-2">
                                    <div className="d-block h-100">
                                        <p className="font-16">Hi {this.state.data ? this.state.data.firstname : ''}, </p>
                                        <p className="font-16">Congratulations and Welcome to {this.state.data.orgName ? this.state.data.orgName : '' } family! We are excited to have you onboard! In order to start the onboarding process, we need a few documents from your end. Kindly use the link below to upload the requisite documents.</p>
                                        
                                    </div>
    
                                    <h3 className="py-4 font-18">Upload documents</h3>
                                    {this.state.data && this.state.Documents ? (
    
                                        <table className="table table-striped table-bordered">
                                            <thead style={{ background: "#f0f8ff" }}>
                                                <tr>
                                                    {/* <td></td> */}
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
                                    ) : ''}
                                </div>
                            </div>
                            
                            <div className="container py-4">
                                <p>Please feel free to reach out to me in case you have any queries.</p>    
                                <h3 className="font-18"><strong>Cheers,</strong></h3>
                                {/* <img src={this.state.data && this.state.data.hrImage ? config.BASE_URL+this.state.data.hrImage : config.DEFAULT_USER_IMG_URL} onError={this.addDefaultUserSrc} width="120" style={{ float: 'left', border: '1px solid #e5e5e5', marginRight: '15px' }}></img> */}
                                <p>{this.state.data ? this.state.data.hrName : ''}</p>
                                <p>{this.state.data ? this.state.data.hrEmail : ''}</p>
                            </div>
                        </Card>
                        </>
                        
                    ) : (
                        <>
                        <div className="container-fluid py-4 text-center bg-blue mb-3">
                              <h4 className="font-weight-bold mb-0 font-22 pl-3"><strong>On Boarding Document Uploader</strong></h4>
                         </div>
                         <div className="card container topFilter d-block pl-4 pr-4 pt-3 pb-3 py-4 br-3 mb-4 mt-4 text-center shadow-sm">

                             <h3 className="font-22">The link has expired or is invalid.</h3>

                         </div>
                         </>
                        )
                )}
                


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Document</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label htmlFor="Location" className="mb-0">Select Document Type *</label>
                        <div className="row mb-1">
                            <div className="col-lg-12">
                                <select className="form-control custom-select" id="documentId" ref="document" defaultValue={this.props.selectedDocument} disabled={this.state.selectedDocument ? 'disabled' : ''} onChange={this.handleChange}>
                                    <option selected disabled>Select Document</option>
                                    {this.state.AllDocuments.map(datas => (
                                        <option key={datas.id} value={datas.id} selected={this.state.selectedDocument === datas.id ? 'selected' : ''}>{datas.documentName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <label htmlFor="Location" className="mb-2">Upload *</label>
                        <div style={{ height: "100px", border: "1px solid #ed0f7e" }}>

                            <Dropzone onDrop={this.onDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <section className="text-center h-100">
                                        <div {...getRootProps({ className: 'dropzone h-100' })}>
                                            <input {...getInputProps()} />
                                            <p><a href="javascript:void(0)" className="btn btn-xs btn-upload">Upload</a> Or drag the files here</p>
                                        </div>
                                        <aside>
                                            {/* <h4>Files</h4> */}
                                            {this.state.uploadMsg}
                                            {/* <ul>{}</ul> */}
                                        </aside>
                                    </section>
                                )}
                            </Dropzone>

                            <div className="form-group">
                                <ToastContainer />
                                {uploadPercent > 0 && <ProgressBar now={uploadPercent} active label={`${uploadPercent}%`}></ProgressBar>}
                            </div>

                            {/* <button type="button" className="btn btn-primary btn-block" onClick={this.onClickHandler}>Upload</button> */}
                        </div>
                        <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - JPG, PNG, PDF and Max size 5 MB only</label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
            </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
            </Button>
                    </Modal.Footer>
                </Modal>

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

            </>
        );
    }
}

export default UploadEmployeeDocument;