
import React, { Component } from 'react'
import { Row, Col, Card, Table, Button,ProgressBar } from "react-bootstrap"
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import DataLoading from '../Loaders/DataLoading';
import Moment from 'moment';
import UploadDocument from '../Documents/UploadDocument';
import 'react-image-lightbox/style.css'
import config from '../../config/config';
import 'react-image-lightbox/style.css'


class HealthCheckUp extends Component {
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
            validateFields: {},
            value: '',
            documentsNeeded: '',
            documentImages: [],
            showDocuments: false,
            photoIndex: 0,
            selectedFile: [],
            uploadDocumentShow: false,
            bloodGroup: [],
            arrBloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
            typingDocs: [4, 19],
            reportDocs: [20, 21],
            percentage: 0,
            files: [],
            uploadMsg: '',
            fileId: [],
            isOpen: false,
            signedMOL: [],
            askEmployee: true,
            dropdowns: ['fitToWork', 'status', 'bloodGroup']
        }

        this.refreshData = this.refreshData.bind(this);
        this.openLightBox = this.openLightBox.bind(this);

    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        var bearer = 'Bearer ' + this.state.token;
        let apiUrl = '';
        if (this.props.id) {
            apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId + "?id=" + this.props.id + "&tab=5";
        }

        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                var arrBloodGroups = [];
                this.state.arrBloodGroup.map((obj_index, arr_index) => {
                    console.log('blood group', obj_index, arr_index)
                    arrBloodGroups.push(<option key={arr_index} selected={this.state.data && this.state.data.bloodGroup ? 'selected' : ''} value={obj_index}> {obj_index} </option>);
                })

                this.setState({ data: r.data.onboardingData.rows[0], signedMOL: r.data.onboardingData.signedMOL, dataCount: r.data.onboardingData.count, Documents: r.data.onboardingData.Documents })
                this.setState({
                    documentsNeeded: r.data.onboardingData.rows[0].documentsNeeded
                });
                if (this.state.data && this.state.data.documentLink) {
                    this.setState({
                        askEmployee: false
                    })
                }
                this.setState({
                    bloodGroup: arrBloodGroups
                })
                console.log('Api result', this.state.dataCount);
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
            })
        }
    }

    onClickHandler = () => {
        const data = new FormData()
        for (var x = 0; x < this.state.selectedFile.files.length; x++) {
            console.log(this.state.selectedFile.files[x])
            data.append('file', this.state.selectedFile.files[x])
            // console.log(data);
        }
        data.append('orgId', this.state.orgId)
        data.append('employeeId', localStorage.getItem("employeeId"))
        const apiUrl = config.API_URL + '/upload/healthDocs/' + this.props.id;
        var bearer = 'Bearer ' + this.state.token;

        const headers = {
            "Authorization": bearer
        }

        const options = {
            onUploadProgress: (ProgressEvent) => {
                const { loaded, total } = ProgressEvent;
                let percent = Math.floor(loaded * 100 / total);
                this.state.uploadMsg = `${loaded} kb of ${total}kb | ${percent}% `;
                // console.log(`${loaded} kb of ${total}kb | ${percent}% `);

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
                        this.setState({ selectedFile: null, percentage: 0, uploadMsg: '' });
                    }, 1000)
                })
                console.log('POST response', res);
                toast.success(res.data.message);
                // this.setState({ redirect: true });
                this.refreshData();
                setTimeout(function () {
                    toast.dismiss()
                }, 2000)
            })
    }

    uploadFiles = () => {
        this.onClickHandler();
    }

    handleChange = (event) => {
        console.log('Input event', event.target.value);
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            data: {
                ...this.state.data, [name]: value
            }
        })
    }

    handleSubmit = () => {

        let datas = this.state.data;
        datas.orgId = this.state.orgId;
        if(this.state.dropdowns){
            this.state.dropdowns.map((item,key)=>{
              console.log('Dropdown Item', item);
              if(this.refs[item]){
                datas[item] = this.refs[item].value;
              }  
            })
        }
        if(datas.fitToWork == 0){
            datas.status = 14;
        }
        
        // console.log('Form Data',datas);
        const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=5";
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
            "Content-Type": "application/json"
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, { headers: headers })
            .then(res => {
                if (res.status == 200) {
                    toast.success(res.data.message);
                      this.refreshData();
                    setTimeout(function () {
                        toast.dismiss()
                    }, 2000)
                    if(this.state.data.status == 14){
                        this.setState({redirect: true});
                        
                    }
                    if(this.state.data.status == 13){
                        if(this.state.data.uaeResident == 1){
                            this.props.setActiveTab(5);
                        }
                        else{
                            this.props.setActiveTab(6);
                        }
                        
                    }
                    
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

    gotoList = () => {
        this.setState({ redirect: true });
    }

    uploadAgain = (id) => {
        console.log('Upload Again id', id)
        this.setState({ selectedDocument: id, show: true });
    }

    deleteSelectedFile = (index) => {
        let state = { ...this.state.selectedFile.files };
        console.log('Delete selected file', index, state);
        delete state[index];
        // this.setState({selectedFile : state});
        this.setState({
            selectedFile: {
                ...this.state.selectedFile, ['files']: state
            }
        })
        console.log('Delete selected file', this.state.selectedFile);
    }

    sendMOL = (empId) => {
        const apiUrl = config.API_URL + '/employee/onBoarding/sendMOL/' + empId;
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

    filterArrayElementByEdit(array, value) {
        return array.filter((element) => {
          return element.id === value;
        })
      }

    openLightBox = (id) => {
    
        if(this.state.Documents){
          console.log('Document Images', this.state.Documents);
          let documentImages = this.filterArrayElementByEdit(this.state.Documents, id)[0].documentPath;
          let lightboxImages = [];
          for(var key in documentImages){
            let imageData = {};
            lightboxImages.push(config.BASE_URL + documentImages[key]);
            console.log('lightboxImages', lightboxImages);
            if(key == documentImages.length -1){
              this.setState({
                documentImages: lightboxImages,
                isOpen: true
              })
            }
          }
        }
        
        // console.log('lightBox images', documentImages);
    }

    checkBox = (event) => {
        console.log('Checkbox clicked', event.target.value, this.state.documentsNeeded);
        this.setState({
          documentsNeeded:[...this.state.documentsNeeded, Number(event.target.value)]
        });
    }

    checkDocumentType = (row, type) => {
        // console.log('Document Type', row)
        if (type.includes(row.id)) {
          // console.log('Document Row', row)
          return <tr><td>{((this.state.data && (this.state.data.documentsNeeded === null || this.state.data.documentsNeeded === '')) || (this.state.data.documentsNeeded && !this.state.data.documentsNeeded.includes(row.id))) && this.state.askEmployee && row.status !== 'Uploaded' ? (<><label className="hrms_control inline-block hrms_checkbox"><input type="checkbox" name="documentsNeeded[]" value={row.id} onChange={this.checkBox} /> <i className="hrms_control__indicator"></i> </label></>) : <label></label>} {row.documentName} <span className="requiredDocument">*</span></td><td className={row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{(this.state.data.documentsNeeded && this.state.data.documentsNeeded.includes(row.id)) && row.status !== 'Uploaded' ? 'Asked from Employee' : row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={() => this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : ''}</span><span>{row.status === 'Uploaded' ? <span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span> : ''}</span><span>{row.status === 'Uploaded' ? '' :  (<button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>Upload</button>)}</span></td></tr>;
        }
        else {
          return '';
        }
      }

    

    showDocTable = () => {
        console.log('Show table');
        this.setState({
            showDocuments: !this.state.showDocuments
        })
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

    updateDocumentsNeeded  = () => {
        const datas = {};
        datas.documentsNeeded = this.state.documentsNeeded;
    
        const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=5";
        
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

    render() {

        let files = [];
        console.log('Selected File', this.state.signedMOL);
        if (this.state.selectedFile !== null) {
            console.log('Selected File', this.state.signedMOL);
            files = this.state.selectedFile.map(file => (
                <li key={file.name}>
                    {file.name} - {file.size} bytes
                </li>
            ));
        }

        const uploadPercent = this.state.percentage;
        console.log('Upload Percentage', uploadPercent)

        if (this.state.redirect) {
            this.setState({ redirect: false });
            return <Redirect to={{
                pathname: "/employee/on-boarding/list",
                // state:{ticketMessage: "Your ticket has been submitted succeefully!"},
            }} />
        }

        let typingRows = {};
        let checkupRows = {};
        if (this.state.Documents && this.state.documentsNeeded) {
            typingRows = this.state.Documents.map(row =>
                this.checkDocumentType(row, this.state.typingDocs)
            );
            if (typingRows) {
                this.state.Documents.map(row =>
                    this.checkDocStatus(row)
                );
            }
        }
        else {
            typingRows = [];
        }
        if (this.state.Documents && this.state.documentsNeeded) {
            checkupRows = this.state.Documents.map(row =>
                this.checkDocumentType(row, this.state.reportDocs)
            );
            if (checkupRows) {
                this.state.Documents.map(row =>
                    this.checkDocStatus(row)
                );
            }
        }
        else {
            checkupRows = [];
        }

        const { photoIndex, isOpen } = this.state;
        const images = this.state.documentImages;

        console.log('Fit to work', this.state.data.fitToWork);


        return (
            <>
                <ToastContainer />
                <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">

                    <Row>
                        <div className="col-md-6">
                            <h4>Health Checkup</h4>
                        </div>
                        <div className="col-md-6">
                            <h4 className="mb-4 font-16 float-right status-block">Status <span>{config.ONBOARDING_STATUS[this.state.data.status]}</span></h4>
                        </div>
                    </Row>
                    <div className="col-sm-12 text-center">
                        <p className="font-14 pt-4">Health Check and Emirates Id</p>
                        {this.state.data && this.state.Documents ? (
                            <Row>

                                {/* {this.state.askEmployee ? (<div className="col-md-6 offset-md-6 pull-right"><button type="button" onClick={this.updateDocumentsNeeded} className="btn btn-md btn-primary pull-right mb-3 mr-15">Ask employee</button></div>) : ''} */}

                                <table className="table table-striped table-bordered text-left">
                                    <thead style={{ background: "#f0f8ff" }}>
                                        <tr>
                                            <td>Document Type</td>
                                            <td>Status</td>
                                            <td>Uploaded On</td>
                                            <td>Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {typingRows ? typingRows : ''}
                                        {/* {otherRows} */}
                                    </tbody>
                                </table>

                            </Row>
                        ) : ''}
                    </div>


                    <hr></hr>
                    <div className="text-center">
                        {this.state.data && this.state.data.MOLUploaded === false ? (
                            <a href="javascript:void(0)" class="btn btn-primary mx-auto" onClick={() => this.uploadAgain(18)}>Upload MOL Contract</a>
                        ) : this.state.data.molSigned === false ? '' : <a href={this.state.signedMOL ? config.BASE_URL+this.state.signedMOL.documentPath : ''} class="btn btn-primary mx-auto" download target="_blank">Download Signed MOL</a> }
                    </div>
                    <hr></hr>

                    {this.state.data && this.state.Documents && this.state.data.molSigned === true && this.state.data.healthDocs === true ? (
                        <div className="col-sm-12">
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
                                        {checkupRows ? checkupRows : ''}
                                        {/* {otherRows} */}
                                    </tbody>
                                </table>

                            </Row>
                        </div>
                    ) : ''}

                    <hr></hr>

                    <div>
                        {this.state.data && this.state.data.reportsUploaded === true ? (
                        <div className="col-sm-12 pb-3">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="priority">Is employee fit to work?</label>
                            </div>
                            <div className="col-sm-3">
                                <select ref="fitToWork" value={this.state.data.fitToWork} className="form-control custom-select" name="fitToWork" onChange={this.handleChange}>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                            
                            <div className="col-sm-2">
                                <label for="priority">Status</label>
                            </div>
                            <div className="col-sm-3">
                                <select ref="status" className="form-control custom-select" value={this.state.data && this.state.data.fitToWork ? '13' : '14'} name="status" onChange={this.handleChange}>
                                    <option value="13">Awaiting Visa Stamping</option>
                                    <option value="14">Rejected</option>
                                </select>
                            </div>
                        
                        </div></div>) : ''}
                        </div>
                        
                    <hr></hr>

                    <div className="col-sm-12 pb-3">
                        <div className="row">
                            <div className="col-sm-4">
                                <label for="priority">Enter Blood Group</label>
                            </div>
                            <div className="col-sm-4">
                                <select ref="bloodGroup" className="form-control custom-select" value={this.state.data && this.state.data.bloodGroup ? this.state.data.bloodGroup : ''} name="bloodGroup" onChange={this.handleChange}>{this.state.bloodGroup}</select>
                            </div>
                        </div>
                    </div>

                </Card>

                <div className="form-group row pt-5 edit-basicinfo">
                    <div className="col-lg-12 text-center">
                        <input
                            type="reset"
                            className="btn btn-outline-primary mr-2"
                            value="Cancel" onClick={this.gotoList}
                        />
                        <Button type="submit" variant="primary" disabled={this.state.data.reportsUploaded === true ? '' : 'disabled'} onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </div>
                </div>

                <UploadDocument show={this.state.show} onRefresh={this.refreshData} selectedDocument={this.state.selectedDocument} onHide={this.handleClose} empId={this.state.data.empId} uploadedBy={localStorage.getItem("employeeId")} />

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

export default HealthCheckUp;