import React, { Component } from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config/config';
import Modal from 'reactstrap/lib/Modal';
import PhoneInput from 'react-phone-input-2';
import DatePicker from "react-datepicker";
import validator from 'validator';
const BEARER_TOKEN = localStorage.getItem("userData");
class UploadDependent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      month: props.month,
      showFileError: false,
      orgId: localStorage.getItem('orgId'),
      csvShow: false,
      emirateIds: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
      visaTypeIds: ['Tourist/Visit Visa', 'E-Visa for GCC Residents', 'Student Visa', 'Employment Visa'],
      genderArr: { 'M': 'Male', 'F': 'Female' },
      dropdowns: { 'deptId': 'departmentIds', 'grade': 'gradeIds', 'positionId': 'positionIds', 'workLocation': 'locationIds', 'accessRole': 'roleIds', 'issuing_emirate': 'emirateIds', 'maritalStatus': 'mStatusIds', 'bloodGroup': 'bloodGroupIds', 'visaType': 'visaTypeIds', 'supervisorId': 'managerIds', 'country': 'countryIds', 'nationality': 'nationalityIds', 'empType': 'empTypeIds', 'issuing_country': 'countryIds', 'gender': 'genderIds' },
      importData: [],

    }
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
        loaded: 0,
        showFileError: false
      })
    }
  }
  onClickHandler = () => {
    //     let month = localStorage.getItem('attendanceMonth');

    //   fetch(BaseURL, options)
    if (this.state.selectedFile) {
      const data = new FormData()
      data.append('file', this.state.selectedFile[0])
      //       data.append('month', month)
      var bearer = 'Bearer ' + BEARER_TOKEN;
      const options = {
        method: 'POST',
        headers: {
          'Authorization': bearer
        },
        body: data
      };
      // fetch(config.API_URL+"/upload-dependents", options).then(res => res.json()).then(res => { 
      fetch(config.API_URL + "/upload-dependentsss", options).then(res => res.json()).then(res => {
        console.log(res);
        console.log(res.success);
        // window.location.reload();
        if (res.success) {
          try {
            // this.setState({ importData: res.importData });
            let value = 0
            console.log('1');
            if (res.errorImportData.length != 0) {
              console.log('2');
              for (var i in res.errorImportData) {
                if (window.confirm(res.errorImportData[i] + '\n Please correct on the CSV File. \n Press CANCEL to reupload file. \n Press OK to contine with this.')) {
                  if (res.errorImportData.length === (parseInt(i) + 1)) {
                    console.log('3');
                    fetch(config.API_URL + "/upload-dependents", options).then(res => {
                      window.location.reload();
                    });
                  }
                } else {
                  window.location.reload();
                }
              }
            } else {
              console.log('4');
              fetch(config.API_URL + "/upload-dependents", options).then(res => {
                window.location.reload();
              });
            }


          } catch (error) {

          }
        }

      })
        .catch(error => { console.log(error) })

    }
    else {
      this.setState({
        showFileError: true
      })
    }

  }
  // handleCSVShow = () => {
  //   this.setState({ csvShow: true, errorFilePath: '' })
  // };
  // handleCSVClose = () => {

  //   this.setState({ csvShow: false })
  // };

  render() {


    return (
      <React.Fragment>

        <div className="container">
          <div className="row">
            <div className="offset-md-3 col-md-6">
              <div className="form-group files">
                <input type="file" className="custom-input-file" name="sheet" onChange={this.onChangeHandler} />
                <div className="errMsg">{this.state.showFileError ? "Please select a file to upload" : ''}</div>
              </div>
              <div className="form-group">
                <ToastContainer />
                {/* <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded, 2)}%</Progress> */}
              </div>

              <button type="button" className="btn btn-primary btn-block" onClick={this.onClickHandler}>Upload</button>

            </div>
          </div>
        </div>


      </React.Fragment>
    )
  }
}

export default UploadDependent;



