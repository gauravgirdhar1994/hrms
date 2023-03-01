import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'reactstrap';
import { Modal, Button } from "react-bootstrap";
import moment from 'moment';
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { DataFetch } from '../../services/DataFetch';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
const orgId = localStorage.getItem('orgId');
//console.log(orgId);

class InsuranceImport extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      events: [],
      org: [],
      orgId: localStorage.getItem("orgId"),
      selectedFile: null
    };
  }
  componentDidMount() {
    this.refreshEvent()
    const apiUrl = config.API_URL + '/organizations/list';
    var bearer = 'Bearer ' + BEARER_TOKEN;
    axios.get(apiUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        //console.log(r.data.organizations.rows);
        this.setState({ org: r.data.organizations.rows });

      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });

  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['text/csv', 'application/vnd.ms-excel', 'text/x-csv', 'text/plain']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err[x] = files[x].type + ' is not a supported format\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }

  maxSelectFile = (event) => {
    let files = event.target.files
    if (files.length > 1) {
      const msg = 'Only 1 can be uploaded at a time'
      event.target.value = null
      toast.warn(msg)
      return false;
    }
    return true;
  }
  checkFileSize = (event) => {
    let files = event.target.files
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
      event.target.value = null
    }
    return true;
  }

  onChangeHandler = event => {
    var files = event.target.files
    // console.log(files);
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0
      })
    }
  }

  onClickHandler = () => {
    //console.log(this.state.selectedFile);
    const data = new FormData()
    data.append('insuranceSheet', this.state.selectedFile[0])
    data.append('orgId', this.state.orgId)
    //console.log(data);

    var bearer = 'Bearer ' + BEARER_TOKEN;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': bearer
      },
      body: data
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL + "/insurance/import-insurance-data", options).then(res => res.json()).then(res => {
      this.handleClose();

      this.setState({
        orgId: 0,
        selectedFile: null,
        events: []
      })
      this.refreshEvent();
    })
      .catch(error => { console.log(error) })


  }



  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  refreshEvent() {
    var url = config.API_URL + "/insurance/insurance-upload-list?orgId="+this.state.orgId;
    var bearer = 'Bearer ' + BEARER_TOKEN;
    fetch(url, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      'mode': 'cors'
    }).then(res => res.json()).then(res => {
      if (res.result && res.result.length > 0) {
        this.setState({ items: res.result });
        this.setState({
          events: this.state.events.concat(this.state.items.map((str) => {
            return str;
          }))
        })
      }
      //console.log(this.state.events)
    })
      .catch(error => { console.log(error) });
  }

  render() {

    return (
      <>

        <Card className="card d-block pl-3 pt-3 pb-3 br-3 mb-4 shadow-sm card">
          <p className="">Insurance Import is used to import employee  insurance data with their dependents.</p>
          <div className="pb-5 text-center"> <input type="button" onClick={this.handleShow} class="btn btn-primary mr-2" value="Import Insurance" /> <span className="downloadHere">If you don’t have the format <a href={config.BASE_URL + '' + '/uploads/sample/insuranceImport.csv'} download>download here</a></span></div>
          <Table className="leaveTable">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Org Name</th>
                <th>Uploaded on</th>
                <th>Status</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              {this.state.events.map(obj => {
                return (
                  <tr>
                    <td>{obj.fileName}</td>
                    <td>{obj.orgName}</td>
                    <td>{moment(obj.createdOn).format(config.DATE_FORMAT)}</td>
                    <td>{(obj.status) ? 'Uploaded' : 'Pending'}</td>
                    <td><a href={config.BASE_URL + '/' + obj.uploadedFile} class="btn btn-sm btn-outline-danger ml-2" download>Download</a></td>

                  </tr>
                )
              })}


            </tbody>
          </Table>
        </Card>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Insurance Import</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className="row mb-2" style={{ display: (orgId != "" && orgId > 0) ? 'none' : 'flex' }}>
              <div className="col-lg-4">Organization </div>
              <div className="col-lg-8">
                <select className="form-control custom-select" id="orgId" name="orgId" onChange={this.handleChange} value={this.state.orgId}>
                  <option value="">Select Organization</option>
                  {this.state.org.map(obj => {
                    return (
                      <option value={obj.id}>{obj.orgName}</option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div className="row mb-1">
              <div className="col-lg-4"> <label htmlFor="Location" className="mb-2">Upload *</label></div>
              <div className="col-lg-8">
                <div className="container">
                  <div className="row">
                    <div className="offset-md-3 col-md-6">
                      <div className="form-group files">
                        {/* <label>Upload Your File </label> */}
                        <input type="file" className="custom-input-file" name="sheet" accept=".csv,text/csv" onChange={this.onChangeHandler} />
                      </div>
                      <div className="form-group">
                        <ToastContainer />
                        <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded, 2)}%</Progress>

                      </div>

                      <button type="button" className="btn btn-primary btn-block" onClick={this.onClickHandler}>Upload</button>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - CSV and Max size 5 MB only</label>
          </Modal.Body>
        </Modal>
      </>
    );

  }
}

export default InsuranceImport;