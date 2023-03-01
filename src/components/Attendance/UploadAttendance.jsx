import React, { Component } from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
class UploadAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      month:props.month
    }
  }


  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['text/csv','application/vnd.ms-excel','text/x-csv','text/plain']
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
    let size = 5000000
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
    console.log(files);
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0
      })
    }
  }
  onClickHandler = () => {
    let month = localStorage.getItem('attendanceMonth');
    const data = new FormData()
      data.append('sheet', this.state.selectedFile[0])
      data.append('month', month)
    var bearer = 'Bearer ' + BEARER_TOKEN;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': bearer
      },
      body: data
    };
    //   fetch(BaseURL, options)
    fetch(config.API_URL+"/upload-attendance", options).then(res => res.json()).then(res => {
      window.location.reload();
      })
      .catch(error => {console.log(error)})
    
  }
    render() {
      return (
        <React.Fragment>
             {/* <div id="toast">Upload</div>
            <Dropzone
              getUploadParams={this.getUploadParams}
              onChangeStatus={this.handleChangeStatus}
              maxFiles={1}
              multiple={false}
              canCancel={false}
              inputContent={<><span style={{ backgroundColor: '#F8709E', color: '#fff', marginRight:'10px', fontSize: '13px', cursor: 'pointer', padding: '5px 30px', borderRadius: 3 }}>
              {'Upload'}
            </span> 
            <span style={{ fontSize:'12px'}}> {'Or drag the file here'} </span> </>}
              styles={{
                dropzone: { width: 400, height: 200 },
                dropzoneActive: { borderColor: 'green' },
              }}
            /> */}
          <div className="container">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="form-group files">
                  <input type="file" className="custom-input-file" name="sheet" onChange={this.onChangeHandler} />
                </div>
                <div className="form-group">
                  <ToastContainer />
                  <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded, 2)}%</Progress>
                </div>

                <button type="button" className="btn btn-primary btn-block" onClick={this.onClickHandler}>Upload</button>

              </div>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  export default UploadAttendance;



