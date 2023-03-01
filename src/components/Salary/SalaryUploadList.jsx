import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
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
import SalaryImport from './SalaryImport';
const BEARER_TOKEN = localStorage.getItem("userData");
var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
var year =  new Date().getFullYear();  

class SalaryUploadList extends Component {
    constructor(props){
    super(props);
    this.state = {
      show: false,
      salaryList:[]
    }
}

componentDidMount(){
  this.refreshEvent();
}

refreshEvent(){
  const apiUrl = config.API_URL+'/payroll/get-upload-sheet-list';
  var bearer = "Bearer " + BEARER_TOKEN;
  axios
  .get(apiUrl, { headers: { Authorization: bearer } })
  .then((r) => {
    if (r.status == 200) {
      this.setState({salaryList:r.data.result});
    }
})
.catch((error) => {
  console.log("API ERR: ");
  console.error(error);
  // res.json({ error: error });
});
}

handleSuccess = () => this.refreshEvent();

handleShow = () => this.setState({ show: true });
handleClose = () => this.setState({ show: false });

render(){
    return(
        <>
         <h4 className="font-16 pl-3">Salary Uploader</h4>
   <p className="">Attendance Import is used to import employee monthly attendance that helps in calculating working days and loss of pay days while running payrolls.</p>
                <div className="pb-5 text-center"> <input type="button" onClick={this.handleShow}  class="btn btn-primary mr-2" value="Import Attendance" /> <span className="downloadHere">If you don’t have the format <a href="">download here</a></span></div>

    
 <Card className="card d-block pl-3 pt-3 pb-3 br-3 mb-4 shadow-sm card">
    <Table className="leaveTable">
      <thead>
        <tr>
          <th>File Name</th>
          <th>Month</th>
          <th>Uploaded on</th>
          <th>Status</th>
          <th>Action</th>
          
        </tr>
      </thead>
      <tbody>
      {this.state.salaryList.map(obj => {
       return (
        <tr>
        <td>{obj.fileName}</td>
       <td>{months[obj.month - 1]} {year}</td>
       <td>{obj.createdOn?Moment(obj.createdOn).format(config.DATE_FORMAT):''}</td>
       <td>{(obj.is_processed)?'Processed':'Pending'}</td>
        <td><button type="button" class="btn btn-sm btn-outline-danger ml-2 ">Download</button></td>
      
      </tr>
       )
       
       })}
       
      </tbody>
    </Table>
    </Card>
    
    <SalaryImport show={this.state.show} onHide={this.handleClose} onSuccess={this.handleSuccess} />
    </>
    );
   
}

}
export default SalaryUploadList;
