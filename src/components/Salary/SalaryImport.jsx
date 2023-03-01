import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import { Modal, Button } from "react-bootstrap";
import config from "../../config/config";
import { fetchData } from "../../action/fetchData";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import loader from "../../loader.gif";
import axios from "axios";
import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
const BEARER_TOKEN = localStorage.getItem("userData");
var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
var year =  new Date().getFullYear();          

class SalaryImport extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:props.show,
            selectedFile:null,
            month:null,
        }
        
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
          [name]: value
        })
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
        console.log(this.state.selectedFile);
        const data = new FormData()
          data.append('salarysheet', this.state.selectedFile[0])
          data.append('month', parseInt(this.state.month)+1)
          console.log(data);
        
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const options = {
          method: 'POST',
          headers: {
            'Authorization': bearer
          },
          body: data
        };
        //   fetch(BaseURL, options)
        fetch(config.API_URL+"/payroll/upload-bulk-salary", options)
        //this.props.onHide;
        //this.props.onSuccess;
      }
    
    
  render(){
      return(
        <Modal  {...this.props} >
        <Modal.Header closeButton>
            <Modal.Title>Salary Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
            <div className="row mb-1">                            
            <div className="col-lg-4">Pay Period</div>
                <div className="col-lg-8">
                   <select className="form-control custom-select" name="month" value={this.state.month} onChange={this.handleChange}>
                      <option value="">Select Month</option>
                      {months.map(function(key,obj) {
                          return (
                          <option value={obj}>{key+ ' '+ year} </option>
                          )
                      })};
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
                  <input type="file" className="custom-input-file" name="sheet" onChange={this.onChangeHandler} accept="text/csv" />
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
      )
  }

}
export default SalaryImport;