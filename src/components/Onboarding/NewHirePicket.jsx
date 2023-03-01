
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
import { data } from 'jquery';
class NewHirePicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      form: [],
      data: {"uaeResident" : 0},
      orgId: localStorage.getItem("orgId"),
      token: localStorage.getItem("userData"),
      redirect: false,
      Documents: [],
      requiredDocuments: [],
      fields: [{"firstname" : "First Name", "lastname" : "Last Name", "personalEmail" : "Email"}],
      validateFields: {},
      value: '',
      documentsNeeded: '',
      documentImages: [],
      showDocuments: true,
      photoIndex: 0,
      selectedFile: [],
      uploadDocumentShow: false,
      percentage: 0,
      files: [],
      uploadMsg: '',
      fileId: [],
      saveDisabled: false,
      isOpen: false,
      askEmployee: true,
      askPassport: false,
      askResume: false,
      fileUploaded: {
        'Passport': false,
        'Resume': false
      },
      askEmployeeDocs : []
    }
    this.refreshData = this.refreshData.bind(this);
    this.openLightBox = this.openLightBox.bind(this);
    this.onDrop = (files) => {
      console.log(files);
      for (var key in files) {
        files[key]['documentId'] = this.state.selectedDocument;
        if (this.state.selectedDocument === 1) {
          this.setState({
            fileUploaded: {
              ...this.state.fileUploaded, ['Passport']: true
            }
          })
        }
        if (this.state.selectedDocument === 15) {
          this.setState({
            fileUploaded: {
              ...this.state.fileUploaded, ['Resume']: true
            }
          })
        }
        this.setState({ selectedFile: [...this.state.selectedFile, files[key]], fileId: [...this.state.fileId, this.state.selectedDocument] }, () => {
          this.onChangeHandler();
        })
      }

    };
  }

  handleShow = () => {
    this.setState({ show: true })
  };

  handleClose = () => {

    this.setState({ show: false })
  };

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
    if (this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0,
        uploadDocumentShow: false
      }, () => {
        // this.onClickHandler();
      })
    }
  }

  handleChange = (event) => {
    console.log('Input event', event.target.value);
    const name = event.target.name;
    const value = event.target.value;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({
      data: {
        ...this.state.data, [name]: value
      },
      validateFields: {
        ...this.state.validateFields, [name]: ''
      }
    })
    if (name === 'email' || name === 'personalEmail') {

      if (reg.test(value) === false) {
        // console.log('Email check', name, reg.test(value));
        this.setState({
          validateFields: {
            ...this.state.validateFields, [name]: 'Please enter a valid email'
          }
        })
      }
      else {
        this.setState({
          validateFields: {
            ...this.state.validateFields, [name]: ''
          }
        })
      }
    }
  }


  componentDidMount = () => {
    if (this.props.id) {
      this.refreshData();
    }
  }

  uploadDocumentShow = (id) => {
    console.log('Before selecting file', this.state.fileId);
    this.setState({
      selectedDocument: id,
      uploadDocumentShow: true
    });
  }

  hideUploadDocument = () => {
    this.setState({
      uploadDocumentShow: false
    });
  }

  refreshData() {
    var bearer = 'Bearer ' + this.state.token;
    let apiUrl = '';
    if (this.props.id) {
      apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId + "?id=" + this.props.id + "&tab=1&reqDocs=${reqDocs.join(',')}";
    }

    axios.get(apiUrl, { headers: { Authorization: bearer } })
      .then(r => {
        this.setState({ data: r.data.onboardingData.rows[0], dataCount: r.data.onboardingData.count, Documents: r.data.onboardingData.Documents, requiredDocuments: r.data.onboardingData.requiredDocuments })
        this.setState({
          documentsNeeded: r.data.onboardingData.rows[0].documentsNeeded
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

  handleSubmit = () => {
    
    let datas = this.state.data;
    datas.uaeResident = this.refs.uaeResident.value;
    datas.documentsNeeded = this.state.documentsNeeded;
    let formData = new FormData();
    console.log('Files Id', this.state.fileId);
    datas.orgId = this.state.orgId;
    datas.fileId = this.state.fileId;

    for (var key in datas) {
      formData.append(key, datas[key]);
    }
    console.log('FormData', formData);
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      console.log(this.state.selectedFile[x])
      formData.append('file', this.state.selectedFile[x])
      // console.log(data);
    }
    // console.log('Form Data',datas);
    let apiUrl = config.API_URL + '/employee/onboarding/add';
    let postData = {};
    postData = formData;
    if (this.props.id) {
      apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=1";
      postData = datas;
    }
    var bearer = 'Bearer ' + this.state.token;
    const headers = {
      "Authorization": bearer,
      // "Content-Type": "application/json"
    }



    console.log('headers => ', this.state.documentsNeeded);
    if (!this.props.id) {
      if (this.validateForm()){
        
        if(this.state.askEmployee){
          this.setState({
            saveDisabled : true
          });
        // postData.documentsNeeded = this.state.documentsNeeded;
        axios.post(apiUrl, postData, { headers: headers })
          .then(res => {
            if (res.status == 200) {
              toast.success(res.data.message);
              setTimeout(function () {
                toast.dismiss()
              }, 2000)
              if (this.props.id) {
                this.props.setActiveTab(2);
              }
              else {
                this.setState({ redirect: true })
              }

              this.setState({
                saveDisabled : false
              });

            }
            else {
              toast.error(res.data.message);
              setTimeout(function () {
                toast.dismiss()
              }, 2000)
              this.setState({
                saveDisabled : false
              });
            }
            // console.log('POST response',res);
          })
      }
      else {
        toast.error('Please upload both the documents.');
        setTimeout(function () {
          toast.dismiss()
        }, 6000)
      }
    }
    }
    else {
      axios.post(apiUrl, postData, { headers: headers })
        .then(res => {
          if (res.status == 200) {
            toast.success(res.data.message);
            setTimeout(function () {
              toast.dismiss()
            }, 2000)
            if (this.props.id) {
              this.props.setActiveTab(2);
            }
            else {
              this.setState({ redirect: true })
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
  }

  validateForm() {
    let fields = this.state.fields[0];
    let validations = {};
    let isFormValid = true;
    if(fields){
      console.log('Payroll Fields', fields);
      for(var key in fields){
        if (
            this.state.data[key] == "" ||
            typeof this.state.data[key] == "undefined"
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

  asktoEmployee = (id) => {
    
    this.setState({
      documentsNeeded: [...this.state.documentsNeeded, id],
      askEmployee : true
    })
    if(id == 1){
      this.setState({
        askPassport : true
      })
    }
    if(id == 15){
      this.setState({
        askResume : true
      })
    }
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

    if (this.state.Documents) {
      console.log('Document Images', this.state.Documents);
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
    }

    // console.log('lightBox images', documentImages);
  }

  contains = (arr, element) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === element) {
        return true;
      }
    }
    return false;
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

  render() {
    let files = [];
    if (this.state.selectedFile !== null) {
      console.log('Selected File', this.state.selectedFile);
      files = this.state.selectedFile.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
    }

    const uploadPercent = this.state.percentage;
    console.log('Upload Percentage', uploadPercent)

    console.log('File Uploaded', this.state.fileUploaded.Passport);
    if (this.state.redirect) {
      this.setState({ redirect: false });
      return <Redirect to={{
        pathname: "/employee/on-boarding/list",
        // state:{ticketMessage: "Your ticket has been submitted succeefully!"},
      }} />
    }

    let otherRows = {};
    let mandatoryRows = {};
    if (this.state.Documents && this.state.documentsNeeded) {
      mandatoryRows = this.state.Documents.map(row =>
        this.checkDocumentType(row, 1)
      );
      if (mandatoryRows) {
        this.state.Documents.map(row =>
          this.checkDocStatus(row)
        );
      }
    }
    else {
      mandatoryRows = [];
    }

    const { photoIndex, isOpen } = this.state;
    const images = this.state.documentImages;
    console.log('save disabled', this.state.saveDisabled);
    return (
      <>
        <ToastContainer />
        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">

          <Row>
            <div className="col-md-6">
              <h4 className="mb-4">New Hire Packet</h4>
            </div>
            <div className="col-md-6">
              <h4 className="mb-4 font-16 float-right status-block">Status <span>{this.state.data.status ? config.ONBOARDING_STATUS[this.state.data.status] : 'N/A'}</span></h4>
            </div>
          </Row>
          <Row>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="firstname">First Name</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" value={this.state.data ? this.state.data.firstname : ''} className="form-control" onChange={this.handleChange} name="firstname" />
                  <div class="errMsg">{this.state.validateFields['firstname']}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="lastname">Last Name</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" className="form-control" onChange={this.handleChange} value={this.state.data ? this.state.data.lastname : ''} name="lastname" />
                  <div class="errMsg">{this.state.validateFields['lastname']}</div>
                </div>
              </div>
            </div>
          </Row>

          <Row>

            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="priority">Personal Email Address</label>
                </div>
                <div className="col-sm-8">
                  <input type="text" name="personalEmail" value={this.state.data ? this.state.data.personalEmail : ''} onChange={this.handleChange} className="form-control" />
                  <div class="errMsg">{this.state.validateFields['personalEmail']}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-5 pb-3">
              <div className="row">
                <div className="col-sm-4">
    <label htmlFor="ticket_type">Currently Working in UAE</label>
                </div>
                <div className="col-sm-8">
                  <select className="form-control custom-select" value={this.state.data.uaeResident} ref="uaeResident" onChange={this.handleChange} name="uaeResident">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
            </div>
          </Row>



          {!this.props.id ? (
            <table className="table table-striped table-bordered">
              <thead style={{ background: "#f0f8ff" }}>
                <tr>
                  <td>Document Type</td>

                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Passport</td>
                  {!this.state.fileUploaded.Passport && !this.state.askPassport ? (<td><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadDocumentShow(1)}>Upload</button> <button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.asktoEmployee(1)}>Ask Employee</button></td>) : this.state.askPassport ? (<label className="text-success ml-2">Asked From Employee</label>) : (<label className="text-success ml-2">Uploaded</label>)}

                </tr>
                <tr>
                  <td>Resume</td>
                  {!this.state.fileUploaded.Resume === true && !this.state.askResume  ? (<td><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadDocumentShow(15)}>Upload</button> <button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.asktoEmployee(15)}>Ask Employee</button></td>) : this.state.askResume ? (<label className="text-success ml-2">Asked From Employee</label>) : (<label className="text-success ml-2">Uploaded</label>)}
                </tr>
              </tbody>
            </table>
          ) : !this.state.showDocuments ? (<p>Do you want to upload the document now? <a href="javascript:void(0)" onClick={this.showDocTable}>click here</a></p>) : ''}
          {this.props.id && this.state.data && this.state.Documents && this.state.showDocuments ? (
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
                  {mandatoryRows ? mandatoryRows : ''}
                  {/* {otherRows} */}
                </tbody>
              </table>

            </Row>
          ) : ''}


        </Card>
        <div className="form-group row pt-5 edit-basicinfo">
          <div className="col-lg-12 text-center">
            <input
              type="reset"
              className="btn btn-outline-primary mr-2"
              value="Cancel" onClick={this.gotoList}
            />

            <Button type="submit" disabled={this.state.saveDisabled} variant="primary" onClick={this.handleSubmit}>
              Save
            </Button>
          </div>
        </div>

        <UploadDocument show={this.state.show} onRefresh={this.refreshData} selectedDocument={this.state.selectedDocument} onHide={this.handleClose} empId={this.state.data.empId} />


        <Modal show={this.state.uploadDocumentShow} onHide={this.hideUploadDocument}>
          <Modal.Header closeButton>
            <Modal.Title>Add Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="Location" className="mb-0">Select Document Type *</label>
            <div className="row mb-1">
              <div className="col-lg-12">
                <select className="form-control custom-select" id="documentId" ref="document">
                  <option selected disabled>{this.state.selectedDocument ? this.state.selectedDocument === 1 ? 'Passport' : 'Resume' : ''}</option>
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
            <Button variant="secondary" onClick={this.hideUploadDocument}>
              Close
            </Button>
            <Button variant="primary" onClick={this.hideUploadDocument}>
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

export default NewHirePicket;