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
class WPSPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      document: '',
      percentage: 0,
      show: false,
      uploadMsg: '',
      orgId: localStorage.getItem("orgId"),
      files: [],
      incentiveData: [],
      uploadText: 'Upload',
      month:0,
      downloadUrl:''
    }
  }

  componentDidMount() {
   
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]:value});
}
  refreshEvent() {
    this.handleClose();
    var url = config.API_URL + "/payroll/generate-wps-file";
    var bearer = 'Bearer ' + BEARER_TOKEN;
    let finalData = {};
    finalData.month = this.state.month;
    const headers = {
      Authorization: bearer,
      // "Content-Type": "multipart/form-data"
    };
    axios.post(url, finalData, { headers: headers }).then((res) => {
      if(res.status == 200 && res.data.success){
      this.setState({downloadUrl:res.data.filePath});  
      }
      toast.success(res.data.message);
      setTimeout(function () {
        toast.dismiss()
      }, 5000)
      window.location.href = config.BASE_URL+'/'+this.state.downloadUrl;
    });
     
  }

 
  handleShow = () => {
    this.setState({show:true});
  };

  handleClose = () => {
    this.setState({show:false});
  }


  render() {
   
    return (

      <>
       
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

          <div className="container">
            <div className="row">
           
              <div className="offset-md-3 col-md-6">
              
                          
                <div className="form-group files">
                  
                      <section className="container">
                        <select className="form-control custom-select mb-4" name="month" value={this.state.month} onChange={this.handleChange}>
                                    <option value="">Select Month</option>
                                    {months.map(function (key, obj) {
                                        return (
                                            <option value={obj}>{key + ' ' + year} </option>
                                        )
                                    })};
                               </select>
                      
                        <Button className="btn btn-default col-sm-5" onClick={() => this.refreshEvent()}>Download</Button>
                        
                      
                      </section>
                 
                </div>
                

                

              </div>
            </div>
          </div>
          
        </Card>
        
      </>
    );
  }
}

export default WPSPage;