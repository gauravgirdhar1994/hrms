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
import { parseTwoDigitYear } from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var year = new Date().getFullYear();
class GratuityPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      totalMonth:0,
      totalAmount:0,
      employeeData:{},
      totalYear:0,
      pendingMonth:0
    }
  }

  componentDidMount() {
    var url = config.API_URL + "/payroll/calculate-gratuity";
    var bearer = 'Bearer ' + BEARER_TOKEN;
  
    const headers = {
      Authorization: bearer,
      // "Content-Type": "multipart/form-data"
    };
    axios.get(url, { headers: headers }).then((res) => {
      if(res.status == 200){
       
      this.setState({
        totalMonth:res.data.month,
        totalAmount:res.data.calculatedAmount,
        employeeData:res.data.employeeData
      });

      if(res.data.month > 12){
        var year = Math.round(res.data.month / 12);
        var Month = Math.round(res.data.month % 12);
        this.setState({
          totalYear:year,
          pendingMonth:Month
        });
      }
        
         toast.success(res.data.message);
        setTimeout(function () {
          toast.dismiss()
        }, 5000)
      }
    });
  }

  render() {
   
    return (

      <>
       <ToastContainer className="right" position="top-right"
           autoClose={5000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={false}
           pauseOnVisibilityChange
           draggable
           pauseOnHover />
       <div className="clapingText"><span><img src="/assets/claping.png" /></span>

    <span>Congratulations {this.state.employeeData.firstname} ! {(this.state.totalMonth > 12)?'You have successfully completed '+this.state.totalYear+' years with the organization':'We cherish our relationship.lets spend some more time together and graw this.'}</span>
                </div> 

               
<ul class="progress-tracker">
  <li class="progress-step is-complete">
    <div class="progress-marker">
    <i>0</i>
    <span>Joined on {moment(this.state.employeeData.joiningDate).format(config.DATE_FORMAT)}</span>
    </div>
  </li>

  <li class="progress-step is-complete">
     
    <div class="progress-marker">
    <i>{(this.state.totalYear > 0)?this.state.totalYear+' Y':this.state.totalMonth+'M'}</i>
    <span>Today on {moment().format(config.DATE_FORMAT)}</span>
    </div>
  </li>

  <li class="progress-step is-active">
    <div class="progress-marker"></div>
  </li>

  <li class="progress-step">
    <div class="progress-marker"></div>
  </li>

  <li class="progress-step">
    <div class="progress-marker"></div>
  </li>
</ul>

          <div className="container">
            <div className="row">
           
              <div className="offset-md-3 col-md-6">
              
              <Card className="card d-block p-5 text-center shadow-sm">
         
         

<div className="form-group files">
  
  <h4 className="font-16 bold black pl-1">Total Gratuity Amount Accrued</h4>
  <div className="gprice">
  {(this.state.totalAmount > 0)?'AED ' + this.state.totalAmount:'Grow Love'}
  </div>
</div>
            </Card>



                          
              
                

                

              </div>
            </div>
          </div>
          
       
        
      </>
    );
  }
}

export default GratuityPage;