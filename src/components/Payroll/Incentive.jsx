import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Row, Col, Card, Table } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button, ProgressBar } from "react-bootstrap"
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import config from '../../config/config';
import { DataFetch } from '../../services/DataFetch'
import { accepts } from 'react-dropzone-uploader';
const BEARER_TOKEN = localStorage.getItem("userData");
var months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
var year = new Date().getFullYear();
class IncentiveComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      document: '',
      percentage: 0,
      show: '',
      uploadMsg: '',
      orgId: localStorage.getItem("orgId"),
      files: [],
      incentiveData: [],
      uploadText: 'Upload',
      month: 0
    }

    this.onDrop = (files) => {
      console.log(files);
      this.setState({ selectedFile: files }, () => {
        this.onChangeHandler();
      })
    };
  }

  componentDidMount() {
    this.refreshEvent()

  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  }
  refreshEvent() {
    var url = config.API_URL + "/payroll/upload-incentive-list";
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
      if (res.incentiveList && res.incentiveList.length > 0) {
        this.setState({ incentiveData: res.incentiveList });
      }
      console.log(this.state.incentiveData)
    })
      .catch(error => { console.log(error) });
  }

  checkMimeType = (event) => {
    //getting file object
    let files = this.state.selectedFile;
    //define message container
    let err = []
    // list allow mime type
    const types = ['text/csv', 'application/vnd.ms-excel', 'text/x-csv', 'text/plain']
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
    if (files.length > 1) {
      const msg = 'Only 1 images can be uploaded at a time'
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

    const data = new FormData()
    data.append('month', this.state.month)
    data.append('incentivesheet', this.state.selectedFile[0])
    const apiUrl = config.API_URL + '/payroll/upload-bulk-incentive';
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
            this.setState({ selectedFile: null, percentage: 0, uploadMsg: '' });
          }, 1000)
        })
        this.refreshEvent();
        this.setState({ uploadText: 'Reupload File', month: 0 });
        console.log('POST response', res);
        toast.success(res.data.message);
        setTimeout(function () {
          toast.dismiss()
        }, 2000)
      })
  }


  render() {
    const { data } = this.state;
    let files = [];
    if (this.state.selectedFile !== null) {
      files = this.state.selectedFile.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
    }


    const uploadPercent = this.state.percentage;
    console.log('Upload Percentage', uploadPercent)
    return (

      <>
        <h4 className="font-16  mb-2"> Add Incentive</h4>
        <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">

          <ToastContainer className="right" position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover />

          <div className="container" style={{ padding: "50px", border: "1px solid #ed0f7e" }}>
            <div className="row">

              <div className="offset-md-3 col-md-6">


                <div className="form-group files">
                  {/* <label>Upload Your File </label>
                    <input type="file" className="form-control" name="attachments" multiple onChange={this.onChangeHandler} /> */}
                  <Dropzone onDrop={this.onDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <section className="text-center h-100">
                        <select className="form-control custom-select mb-4" name="month" value={this.state.month} onChange={this.handleChange}>
                          <option value="">Select Month</option>
                          {months.map(function (key, obj) {
                            return (
                              <option value={obj + 1}>{key + ' ' + year} </option>
                            )
                          })};
                        </select>
                        <div {...getRootProps({ className: 'dropzone h-100' })}>
                          <input {...getInputProps()} />
                          <p><a href="javascript:void(0)" className="btn btn-xs btn-upload">{this.state.uploadText}</a> Or drag the files here</p>
                          <br /><br />
                          <span className="downloadHere">If you don’t have the format <a href={config.BASE_URL + '' + '/uploads/sample/incentiveUploder.csv'} download>download here</a></span>
                        </div>
                        <aside>
                          {/* <h4>Files</h4> */}
                          {this.state.uploadMsg}
                          {/* <ul>{}</ul> */}
                        </aside>
                      </section>
                    )}
                  </Dropzone>
                </div>
                <div className="form-group">
                  <ToastContainer />
                  {uploadPercent > 0 && <ProgressBar now={uploadPercent} active label={`${uploadPercent}%`}></ProgressBar>}
                </div>

                {/* <button type="button" className="btn btn-primary btn-block" onClick={this.onClickHandler}>Upload</button> */}

              </div>
            </div>
          </div>
          <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - CSV and Max size 5 MB only</label>
        </Card>
        <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">
          <Table className="leaveTable">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Uploaded Month</th>
                <th>Status</th>
                <th>Uploaded On</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              {this.state.incentiveData.map(obj => {


                return (
                  <tr>
                    <td>{obj.fileName}</td>

                    <td><span className="blueText">{obj.month}</span></td>
                    <td>{(obj.status) ? 'Uploaded' : 'Processing'}</td>
                    <td>{moment(obj.createdOn).format(config.DATE_FORMAT)}</td>
                    <td><a class="btn btn-sm btn-danger ml-2 " href={config.BASE_URL + '/' + obj.uploadedFile} download>Download</a></td>

                  </tr>
                )
              })}

            </tbody>
          </Table>
        </Card>
      </>
    );
  }
}

export default IncentiveComp;