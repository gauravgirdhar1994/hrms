import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button, ProgressBar } from "react-bootstrap"
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config/config';
import { DataFetch } from '../../services/DataFetch'
const BEARER_TOKEN = localStorage.getItem("userData");
class UploadDependentDoc extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        selectedFile: null,
                        document: '',
                        percentage: 0,
                        show: '',
                        uploadMsg: '',
                        orgId: localStorage.getItem("orgId"),
                        files: []
                }

                this.onDrop = (files) => {
                        console.log(files);
                        this.setState({ selectedFile: files }, () => {
                                this.onChangeHandler();
                        })
                };
                // console.log('Constructor show',this.state.show)
        }

        componentDidMount() {
                const apiUrl = config.API_URL + '/dependent/documents/view/' + this.props.dependentCode;
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(apiUrl, { headers: { Authorization: bearer }})                       
                        .then(r => {
                                // if (r.data.success) {
                                        this.setState({ data : r.data })
                                // }
                        })
                        .catch((error) => {
                                console.log("API ERR: ", error);
                                console.error(error);
                                // res.json({ error: error });
                });
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

        onClickHandler = () => {
                // console.log('Document TYpe', this.refs.document.value);
                const data = new FormData()
                for (var x = 0; x < this.state.selectedFile.length; x++) {
                        console.log(this.state.selectedFile[x])
                        data.append('file', this.state.selectedFile[x])
                        console.log(data);
                }
                data.append('orgId', this.state.orgId)
                if (this.props.dependentCode) {
                        data.append('dependentCode', this.props.dependentCode)
                        data.append('hrmUpload', true);
                }

                data.append('documentType', this.refs.document.value)
                const apiUrl = config.API_URL + '/dependent/document/add';
                var bearer = 'Bearer ' + BEARER_TOKEN;

                const headers = {
                        "Authorization": bearer
                }

                const options = {
                        onUploadProgress: (ProgressEvent) => {
                                const { loaded, total } = ProgressEvent;
                                let percent = Math.floor(loaded * 100 / total);
                                this.state.uploadMsg = `${loaded} kb of ${total}kb | ${percent}% `;
                                console.log(`${loaded} kb of ${total}kb | ${percent}% `);

                                if (percent < 100) {
                                        this.setState({ percentage: percent })
                                }
                        },
                        headers: headers
                }
                axios.post(apiUrl, data, options)
                        .then(res => {
                                this.setState({ percentage: 100 }, () => {
                                        setTimeout(() => {
                                                this.props.onHide();
                                                this.props.onRefresh();
                                                this.setState({ selectedFile: null, percentage: 0, uploadMsg: '' });
                                        }, 1000)
                                })
                                console.log('POST response', res);
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

        render() {
                const { data } = this.state;
                console.log('Document Data', this.state.data);
                let files = [];
                if (this.state.selectedFile !== null) {
                        files = this.state.selectedFile.map(file => (
                                <li key={file.name}>
                                        {file.name} - {file.size} bytes
                                </li>
                        ));
                }

                this.state.show = this.props.show;
                if (!this.state.show) {
                        console.log('Show Modal', this.props.show);
                        return null;
                }
                const uploadPercent = this.state.percentage;
                console.log('Upload Percentage', uploadPercent)
                return (
                        <React.Fragment>
                                <Modal show={this.state.show} onHide={this.props.onHide}>
                                        <Modal.Header closeButton>
                                                <Modal.Title>Add Document</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                                <label htmlFor="Location" className="mb-0">Select Document Type *</label>
                                                <div className="row mb-1">
                                                        <div className="col-lg-12">
                                                                <select className="form-control custom-select" id="documentId" ref="document" defaultValue={this.props.selectedDocument} disabled={this.props.selectedDocument ? 'disabled' : ''} onChange={this.handleChange}>
                                                                        <option selected disabled>Select Document</option>
                                                                        {data ? data.Documents.map(datas => (
                                                                                <option key={datas.id} value={datas.id} selected={this.props.selectedDocument === datas.id ? 'selected' : ''}>{datas.documentName}</option>
                                                                        )) : ''}
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
                                                <Button variant="secondary" onClick={this.props.onHide}>
                                                        Close
            </Button>
                                                <Button variant="primary" onClick={this.props.onHide}>
                                                        Save Changes
            </Button>
                                        </Modal.Footer>
                                </Modal>

                        </React.Fragment>
                )
        }
}

export default UploadDependentDoc;



