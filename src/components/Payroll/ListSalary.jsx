import React, { Component } from 'react';
import { Col, Card, Row, Table, Button } from "reactstrap";
import loader from "../../loader.gif";
import axios from "axios";
import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
import config from '../../config/config';
import moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
var months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
var year = new Date().getFullYear();
var orgId = localStorage.getItem("orgId");
class ListSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salaryList: [],
      month: sessionStorage.getItem('salaryProcessMonth') ? sessionStorage.getItem('salaryProcessMonth') : moment().month() - 1,
      departmentList:[],
      department:0,
      name:''
    }
  }

  componentDidMount() {
    var apiUrl = config.API_URL + '/common/departments/' + orgId;
    var bearer = "Bearer " + BEARER_TOKEN;
    axios
      .get(apiUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          if (r.data.Departments.length > 0) {
            this.setState({ departmentList: r.data.Departments });
          }
          this.salaryListQuey();
        }

      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      }); 
  
    this.salaryListQuey();
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  salaryListQuey = () => {
    const searchMonth = this.state.month;
    console.log('searchMonth', searchMonth);
    const searchDepartment = this.state.department;
    const searchName = this.state.name;
    var apiUrl = config.API_URL + '/payroll/view-org-salary?month=' + searchMonth + '&department=' + searchDepartment + '&name=' + searchName;
    var bearer = "Bearer " + BEARER_TOKEN;
    axios
      .get(apiUrl, { headers: { Authorization: bearer } })
      .then((r) => {
        if (r.status == 200) {
          if (r.data.employeeSalaryDetails.length > 0) {
            this.setState({ salaryList: r.data.employeeSalaryDetails });
            //     this.setState({ month: Moment(this.state.salaryList[0].month).month() });
          } else {
            this.setState({ salaryList: [] });
          }


        }

        // toast.success(r.data.message);
        // setTimeout(function () {
        //   toast.dismiss()
        // }, 3000)

      })
      .catch((error) => {
        console.log("API ERR: ");
        console.error(error);
        // res.json({ error: error });
      });
  }

  clickSearchQuery = () => {
    this.salaryListQuey();
  }



  render() {
          console.log('Selected month', this.state.month);

    return (
      <>

        <div className="card d-block pl-3 pb-3 pt-3 pr-3  shadow-sm mb-5">
          <ToastContainer className="right" position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClic
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover />
          <Row>
            <div class="col-sm-5 pb-3">
              <div class="row">
                <div class="col-sm-3">
                  <label for="ticket_type">Select Month</label>
                </div>
                <div class="col-sm-9">
                  <select className="form-control custom-select" name="month" value={this.state.month} onChange={this.handleChange}>
                    {months.map(function (key, obj) {
                      return (
                        <option value={obj + 1}>{key + ' ' + year} </option>
                      )
                    })};
                  </select>
                </div>
              </div>
            </div>

            <div class="col-sm-5 pb-3">
              <div class="row">
                <div class="col-sm-3">
                  <label for="priority">Department</label>
                </div>
                <div class="col-sm-9">
                  <select className="form-control custom-select" name="department" value={this.state.department} onChange={this.handleChange}>
                    <option value="">Select Department</option>
                    {this.state.departmentList.map(obj => {
                      return (
                        <option value={obj.id}>{obj.displayName} </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            </div>
          </Row>

          <Row>
            <div class="col-sm-5 pb-3">
              <div class="row">
                <div class="col-sm-3">
                  <label for="ticket_type">Search by Name</label>
                </div>

                <div class="col-sm-9">
                  <input type="text" name="name" className="form-control" value={this.state.name} onChange={this.handleChange} />
                </div>

              </div>
            </div>

            <div class="col-sm-5 pb-3">
              <div class="row">
                <div class="col-sm-3">

                </div>
                <div class="col-sm-9">

                </div>
              </div>
            </div>
          </Row>

          <div class="form-group row pt-2 mb-4 edit-basicinfo">
            <div class="col-lg-12 text-center">
              <input type="button" className="btn btn-outline-primary mr-2" onClick={this.clickSearchQuery} value="Search" />
              {/*<input type="button" className="btn btn-outline-danger mr-2" value="Export" />*/}</div></div>
        </div>
{(this.state.salaryList.length > 0)?(
        <Card className="card d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">

          <Table className="onboardingTable">
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Month</th>
                <th>Basic</th>
                <th>Accommodation</th>
                <th>Transpotation</th>
                <th>Telephone</th>
                <th>Other</th>
                <th>Incentive</th>
                <th>Total</th>
                <th>Adv Loan EMI (if any)</th>
                <th>Final Amount</th>
                

              </tr>
            </thead>
            <tbody>
              {this.state.salaryList.map(obj => {

                return (
                  <tr>
                    <td>{obj.empCode}</td>
                    <td>{obj.firstname + ' ' + obj.lastname}</td>
                    <td>{Moment(obj.month).format('MMMM YYYY')}</td>
                    <td>{obj.basic}</td>
                    <td>{obj.accommodation}</td>
                    <td>{obj.transpotation}</td>
                    <td>{obj.telephone}</td>
                    <td>{obj.other}</td>
                    <td>{obj.incentive}</td>
                    <td>{obj.total}</td>
                    <td>{(obj.total)?parseFloat(obj.total) - parseFloat(obj.finalAmount):''}</td>
                    <td>{obj.finalAmount}</td>
                    
                  </tr>
                )

              })}

            </tbody>
          </Table>
          
          </Card>) : <Card><h1 className="text-center">No data found</h1></Card>}

      </>



    );
  }
}

export default ListSalary;