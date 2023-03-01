import React, { Component } from 'react';
import { Card, Row, Table, ProgressBar, Button,Modal,Form } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import config from '../config/config';
import moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
class HospitalUpload extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          selectedFile: null,
            show: '',
            percentage: 0,
            uploadMsg: '',
            files: [],
          hospitalUploadData:[],
          uploadText:'Upload'
         }

         this.onDrop = (files) => {
          console.log(files);
          this.setState({ selectedFile: files }, () => {
            this.onChangeHandler();
          })
        };
    }

    componentDidMount(){
      this.refreshEvent();
    }
    refreshEvent(){
      var url = config.API_URL+"/insurance/hospital-master-upload";
      var bearer = 'Bearer ' + BEARER_TOKEN;

      fetch(url, {
              method: 'GET',
              withCredentials: true,
              headers: {
                  'Authorization': bearer,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              },
              'mode':'cors'
          }).then(res => res.json()).then(res => {
              if (res.hospitalUpload && res.hospitalUpload.length > 0) {
                  this.setState({hospitalUploadData: res.hospitalUpload});
                }
              console.log(this.state.hospitalUploadData)
          })
          .catch(error => {console.log(error)});
    }

    checkMimeType = (event) => {
      //getting file object
      let files = this.state.selectedFile;
      //define message container
      let err = []
      // list allow mime type
      const types = ['text/csv','application/vnd.ms-excel','text/x-csv','text/plain']
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
      data.append('hospitalSheet', this.state.selectedFile[0])
      const apiUrl = config.API_URL + '/insurance/hospital-bulk-upload';
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
          this.setState({uploadText:'Reupload File'});
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
                        <h2 className="font-16"> Upload Hospital Master List</h2>
                        <ToastContainer className="right" position="top-right"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClic
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
                                    <section className="container">
                                      <div {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps() } />
                                  <p><a href="javascript:void(0)" className="btn btn-xs btn-upload">{this.state.uploadText}</a> Or drag the files here</p>
                                  </div><br/><br/><br/><br/><br/><br/>
                                        <span className="downloadHere">If you don’t have the format <a href={config.BASE_URL+''+'/uploads/sample/HospitalMasterList.csv'} download>download here</a></span>
                                      
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
            
            

            <div className="card d-block p-3 mb-4 shadow-sm card">
                <Table className="leaveTable">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Status</th>
                      <th>Uploaded On</th>
                      <th>Action</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                   
            {this.state.hospitalUploadData.map(obj => {

           
                   return (
                    <tr>
                      <td>{obj.fileName}</td>
                     
                   
                   <td><span className="blueText">{(obj.status)?'Uploaded':'Processing'}</span></td>
                   <td>{moment(obj.createdOn).format(config.DATE_FORMAT)}</td>
                      <td><a class="btn btn-sm btn-danger ml-2" href={config.BASE_URL+'/'+obj.uploadedFile} download>Download</a></td>
                    
                    </tr>
                   )
                 })}
                   
                  </tbody>
                </Table>
                </div>
              
                    </>
                     );
    }
}
 
export default HospitalUpload;