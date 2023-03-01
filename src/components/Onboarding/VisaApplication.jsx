
import React, { Component } from 'react'
import { Modal, Button, Card, Table, Form, Row } from "react-bootstrap";
import axios from 'axios';
import config from '../../config/config';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from "react-router-dom";
import Moment from 'moment';
import UploadDocument from '../Documents/UploadDocument';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'

class VisaApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: '',
      form: [],
      data: [],
      orgId: localStorage.getItem("orgId"),
      token: localStorage.getItem("userData"),
      redirect: false,
      Documents: [],
      show: false,
      showDocuments: true,
      requiredDocuments: [],
      documentsNeeded: [],
      visaDocs: [3,25],
      documentImages: [],
      photoIndex: 0,
      isOpen: false,
      askEmployee: true,
      nextRedirect: false
    }
    this.refreshData = this.refreshData.bind(this);
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
      data: {
        ...this.state.data, [name]: value
      }
    })
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
      apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId + "?id=" + this.props.id + "&tab=4&reqDocs=${reqDocs.join(',')}";
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
        if (this.state.data && !this.state.data.uaeResident) {
          this.setState({
            nextRedirect: true
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
    this.setState({ selectedDocument: id, show: true, nextRedirect: false });
    
    if(id == 2){
      this.handleSubmit();
    }
  }

  checkBox = (event) => {
    console.log('Checkbox clicked', event.target.value);
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

  checkTypingDocumentType = (row, type) => {
    console.log('Document Type', row.id, type, type.includes(row.documentType));
    if (type.includes(row.id)) {

        return <tr><td>{((this.state.data && (this.state.data.documentsNeeded === null || this.state.data.documentsNeeded === '')) || (this.state.data.documentsNeeded && !this.state.data.documentsNeeded.includes(row.id) && row.status !== 'Uploaded')) && this.state.askEmployee ? (<><label className="hrms_control inline-block hrms_checkbox"><input type="checkbox" name="documentsNeeded[]" value={row.id} onChange={this.checkBox} /> <i className="hrms_control__indicator"></i> </label></>) : <label></label>} {row.documentName}{this.state.visaDocs.includes(row.id) ? <span className="requiredDocument">*</span> : ''}</td><td className={row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{(this.state.data.documentsNeeded && this.state.data.documentsNeeded.includes(row.id)) && row.status !== 'Uploaded' ? 'Asked from Employee' : row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={() => this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : ''}</span><span>{row.status === 'Uploaded' ? <span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span> : ''}</span><span>{row.status === 'Uploaded' ? '' : (<button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>Upload</button>)}</span></td></tr>;
    }
}

  checkDocumentType = (row, type) => {
    // console.log('Document Type', row)
    if (row.documentType === type) {
      // console.log('Document Row', row)
      return <tr><td>{((this.state.data && (this.state.data.documentsNeeded === null || this.state.data.documentsNeeded === '')) || (this.state.data.documentsNeeded && !this.state.data.documentsNeeded.includes(row.id))) && this.state.askEmployee && row.status !== 'Uploaded' ? (<><label className="hrms_control inline-block hrms_checkbox"><input type="checkbox" name="documentsNeeded[]" value={row.id} onChange={this.checkBox} /> <i className="hrms_control__indicator"></i> </label></>) : <label></label>} {row.documentName}{this.state.requiredDocuments.includes(row.id) ? <span className="requiredDocument">*</span> : ''}</td><td className={row.status === 'Uploaded' ? 'text-success' : 'text-danger'}>{(this.state.data.documentsNeeded && this.state.data.documentsNeeded.includes(row.id)) && row.status !== 'Uploaded' ? 'Asked from Employee' : row.status}</td><td>{row.uploadedOn !== '-' ? Moment(row.uploadedOn).format(config.DATE_FORMAT) : '-'}</td><td><span>{row.status === 'Uploaded' ? (row.documentPath.length > 1 ? <a onClick={() => this.openLightBox(row.id)} className="btn btn-sm btn-outline-danger mr-15">View Document</a> : <a href={config.BASE_URL + row.documentPath} target="_blank" className="btn btn-sm btn-outline-danger mr-15">View Document</a>) : ''}</span><span>{row.status === 'Uploaded' ? <span><button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>{row.status === 'Uploaded' ? 'Upload Again' : 'Upload'} </button> </span> : ''}</span><span>{row.status === 'Uploaded' ? '' :  (<button type="button" className="btn btn-sm btn-outline-danger mr-15" onClick={() => this.uploadAgain(row.id)}>Upload</button>)}</span></td></tr>;
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

    this.state.selectedFile = event.target.files[0];
    // Details of the uploaded file 
    console.log('Selected file', this.state.selectedFile);

    const formData = new FormData();

    // Update the formData object 
    formData.append(
      'file',
      this.state.selectedFile
    );

    const apiUrl = config.API_URL + '/upload/offerLetter/' + this.props.id;

    // Request made to the backend api 
    // Send formData object 
    axios.post(apiUrl, formData, { headers: headers }).then(res => {
      toast.success(res.data.message);
      // this.refreshData();
    });

  }

  showDocTable = () => {
    console.log('Show table');
    this.setState({
      showDocuments: !this.state.showDocuments
    })
  }

  hideTable = () => {
    this.setState({
      showDocuments: false
    })
  }

  handleSubmit = () => {

    let datas = this.state.data;
    datas.orgId = this.state.orgId;
    if(this.state.data.uaeResident){
      datas.visaStatus = 15;
    }
    // console.log('Form Data',datas);
    const apiUrl = config.API_URL + '/employee/onboarding/edit/' + this.props.id + "?tab=4";
    var bearer = 'Bearer ' + this.state.token;
    const headers = {
      "Authorization": bearer,
      "Content-Type": "application/json"
    }

    // console.log('headers => ', headers);
    axios.post(apiUrl, datas, { headers: headers })
      .then(res => {
        if (res.status == 200) {
        if(this.state.nextRedirect){
          toast.success(res.data.message);
          setTimeout(function () {
            toast.dismiss()
          }, 2000)
        }
        if(this.state.nextRedirect){
          if(this.state.data.uaeResident == 1){
            this.props.setActiveTab(6);
          }
          else{
              this.props.setActiveTab(5);
          }
        }  
        else{
          this.setState({nextRedirect: true})
          // this.refreshData();
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

    let visaRows = {};
        if (this.state.Documents) {
            visaRows = this.state.Documents.map(row =>
                this.checkTypingDocumentType(row, this.state.visaDocs)
            );
            if (visaRows) {
                this.state.Documents.map(row =>
                    this.checkDocStatus(row)
                );
            }
        }
        else {
            visaRows = [];
        }

    const { photoIndex, isOpen } = this.state;
    const images = this.state.documentImages;

    return (
      <>
        <ToastContainer />
        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
          <Row>
            <div className="col-md-6">
              <h4 className="mb-4">Visa Application</h4>
            </div>
            <div className="col-md-6">
              <h4 className="mb-4 font-16 float-right status-block">Status <span>{config.ONBOARDING_STATUS[this.state.data.status]}</span></h4>
            </div>
          </Row>

          <Row>
            {this.state.data && this.state.data.uaeResident !== 1 ? (
              <div className="col-sm-3 pb-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label for="ticket_type">Apply for Visa</label>
                  </div>
                  <div className="col-sm-8">
                    <select name="applyVisa" className="form-control custom-select" onChange={this.handleChange}>
                      <option selected disabled>Select</option>
                      <option value="1" selected={this.state.data && this.state.data.applyVisa ? 'selected' : ''}>Yes</option>
                      <option value="0" selected={this.state.data && !this.state.data.applyVisa ? 'selected' : ''}>No</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : ''}

            {this.state.data && this.state.data.applyVisa == 1 && this.state.data.uaeResident !== 1 ? (
              <>
                <div className="col-sm-3 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label for="priority">Enter Visa PRO Name</label>
                    </div>
                    <div className="col-sm-8">
                      <input type="text" className="form-control" value={this.state.data && this.state.data.agentName ? this.state.data.agentName : ''} name="agentName" onChange={this.handleChange} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-3 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label for="priority">Enter Visa Application No.</label>
                    </div>
                    <div className="col-sm-8">
                      <input type="text" className="form-control" value={this.state.data && this.state.data.visaApplicationNumber ? this.state.data.visaApplicationNumber : ''} name="visaApplicationNumber" onChange={this.handleChange} />
                    </div>
                  </div>
                </div>

                <div className="col-sm-3 pb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label for="ticket_type">Visa Status</label>
                    </div>
                    <div className="col-sm-8">
                      <select name="visaStatus" className="form-control custom-select" onChange={this.handleChange}>
                        <option selected disabled>Select</option>
                        <option value="7" selected={this.state.data && this.state.data.visaStatus === 7 ? 'selected' : ''}>Pending</option>
                        <option value="8" selected={this.state.data && this.state.data.visaStatus === 8 ? 'selected' : ''}>Approved</option>
                        <option value="9" selected={this.state.data && this.state.data.visaStatus === 9 ? 'selected' : ''}>Rejected</option>
                        <option value="12" selected={this.state.data && this.state.data.visaStatus === 12 ? 'selected' : ''}>Visa Status Change</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>) : ''}
          </Row>

          <Row className="text-center">

            {this.state.data && this.state.data.applyVisa == 1 && this.state.data.visaUploaded === false && !this.state.data.uaeResident ? (
              <a href="javascript:void(0)" class="btn btn-primary mx-auto mb-3" onClick={() => this.uploadAgain(2)}>Upload Stamped Visa</a>
            ) : ''}

            {this.state.data && this.state.data.visaUploaded === false &&  this.state.data.uaeResident ? (
              this.state.data && this.state.Documents ? (
                <div className="col-md-12">

               
                <Row>

                    {this.state.askEmployee ? (<div className="col-md-6 offset-md-6 pull-right"><button type="button" onClick={this.updateDocumentsNeeded} className="btn btn-md btn-primary pull-right mb-3 mr-15">Ask employee</button></div>) : ''}

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
                            {visaRows ? visaRows : ''}
                            {/* {otherRows} */}
                        </tbody>
                    </table>

                </Row>
                </div>
            ) : ''
            ) : ''}
            

          </Row>


          {!this.state.showDocuments && this.state.data && this.state.data.applyVisa == 1 && this.state.data.visaUploaded ? (
            <p>Do you want to upload other documents now? <a href="javascript:void(0)" onClick={this.showDocTable}>click here</a></p>
          ) : ''}
          {/* {this.state.data && this.state.Documents && this.state.showDocuments && this.state.data.visaUploaded ? ( */}
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
          {/* ) : ''} */}

        </Card>
        <div className="form-group row pt-5 edit-basicinfo">
          <div className="col-lg-12 text-center">
            <input
              type="reset"
              className="btn btn-outline-primary mr-2"
              value="Cancel" onClick={this.gotoList}
            />
            <Button type="submit" variant="primary" onClick={this.handleSubmit}>
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

export default VisaApplication;