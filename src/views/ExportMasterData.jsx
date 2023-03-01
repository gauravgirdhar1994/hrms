import React, {Component} from 'react'
import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Workbook from 'react-excel-workbook'
import axios from 'axios';
import DatePicker from "react-datepicker";
import config from '../../src/config/config';

var role_id = localStorage.getItem("role");


const BEARER_TOKEN = localStorage.getItem("userData");
       
class ExportMasterData extends Component {
        constructor(props) {
            super(props);
            this.state = {
                brokerOrg: localStorage.getItem('orgId'),
                orgId: localStorage.getItem('orgId'),
                departments : [],
                positions: [],
                locations: [],
                empType: [], 
                Countries: [],
                accessRoles: [],
                Employees: [], 
                Grades: [],
                marital_status:{0 : {"name" : 'Married'}, 1 : {"name" : 'Single'}, 2: { "name": 'Divorced'}, 3: { "name" : 'Separated'}},
                emirateArr: { 0: { 'value': 'Abu Dhabi' }, 1: { 'value': 'Ajman' }, 2: { 'value': 'Dubai' }, 3: { 'value': 'Fujairah' }, 4: { 'value': 'Ras Al Khaimah' }, 5: { 'value': 'Sharjah' }, 6: { 'value': 'Umm Al Quwain' } },
                visaTypeArr : {0 : {"value" : 'Tourist/Visit Visa'}, 1:{"value" : 'E-Visa for GCC Residents'}, 2:{"value" : 'Student Visa'}, 3:{"value" : 'Employment Visa'}},
            }
        }

        componentDidMount(){
                this.getDepartments();
                this.getPositions();
                this.getLocations();
                this.getEmpType();
                this.getCountries();
                this.getAccessRoles();
                this.getEmployees();
                this.getGrades();
        }

        getDepartments() {
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/common/departments/' + this.state.orgId, { headers: { Authorization: bearer } })
                    .then(r => {
                        console.log('department Response', r);
                        if (r.status == 200) {
                           
                            this.setState({ departments: r.data.Departments });
                        }
                    })
                    .catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
        }

        getPositions() {
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/common/positions/' + this.state.orgId, { headers: { Authorization: bearer } })
                    .then(r => {
                        console.log('Positions Response', r.data);
                        if (r.status == 200) {
                                this.setState({ positions: r.data.Positions });
                        }
                    })
                    .catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
        }
            getLocations() {
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/common/locations/' + this.state.orgId, { headers: { Authorization: bearer } })
                    .then(r => {
                        console.log('Location Response', r.data);
                        if (r.status == 200) {
                                this.setState({ locations: r.data.Locations });
                        }
                    })
                    .catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
            }

            getAccessRoles() {
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/common/accessRoles/' + this.state.orgId, { headers: { Authorization: bearer } })
                .then(r => {
                    console.log('Positions Response', r);
                    if (r.status == 200) {
                       
                        this.setState({ accessRoles: r.data.accessRoles });
                    }
                })
                .catch((error) => {
                    console.log("API ERR: ");
                    console.error(error);
                    // res.json({ error: error });
                });
            }
        
            getEmpType() {
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/common/employmentType/' + this.state.orgId, { headers: { Authorization: bearer } })
                    .then(r => {

                        if (r.status == 200) {
                                console.log('EmpType Response', r.data.EmploymentType);
                                this.setState({ empType: r.data.EmploymentType });
                        }
                    })
                    .catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
            }

            getCountries() {
                axios.get(config.API_URL + '/common/countries', { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
                    .then(r => {
                        if (r.status == 200) {
                            
                            this.setState({ Countries: r.data.Countries });
                        }
                    }).catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
            }
            getEmployees() {
                axios.get(config.API_URL + '/common/employees/'+ this.state.orgId, { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
                    .then(r => {
                        if (r.status == 200) {
                            
                            this.setState({ Employees: r.data.Employees });
                        }
                    }).catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
            }

            getGrades() {
                var bearer = 'Bearer ' + BEARER_TOKEN;
                axios.get(config.API_URL + '/common/grades/' + this.state.orgId, { headers: { Authorization: bearer } })
                    .then(r => {
                        //console.log('EmpType Response', r);
                        if (r.status == 200) {
                            this.setState({ Grades : r.data.Grades  });
                        }
                    })
                    .catch((error) => {
                        console.log("API ERR: ");
                        console.error(error);
                        // res.json({ error: error });
                    });
            }

        render() {
                
                return (

                          <Workbook filename="masterData.xlsx" element={<button className="btn ml-4 btn-danger">Download Master Data</button>}>
                           {Object.keys(this.state.departments).length > 0 ? (
                                  <Workbook.Sheet data={this.state.departments} name="Departments">
                                    <Workbook.Column label="Id" value="id"/>
                                    <Workbook.Column label="Department Name" value="departmentName"/>
                                    <Workbook.Column label="Parent Department" value="parentDepartmentName"/>
                                  </Workbook.Sheet>
                           ) : ''}
                           
                           {Object.keys(this.state.positions).length > 0 ? (
                                    <Workbook.Sheet data={this.state.positions} name="Positions">
                                    <Workbook.Column label="Id" value="id"/>
                                    <Workbook.Column label="Position Name" value="positionName"/>
                                  </Workbook.Sheet>
                           ) : ''}

                          {Object.keys(this.state.locations).length > 0 ? (
                                        <Workbook.Sheet data={this.state.locations} name="Work Locations">
                                        <Workbook.Column label="Id" value="locationId"/>
                                        <Workbook.Column label="Location Name" value="locationName"/>
                                        </Workbook.Sheet>
                                ) : ''}

                          {Object.keys(this.state.empType).length > 0 ? (
                                        <Workbook.Sheet data={this.state.empType} name="Employment Type">
                                        <Workbook.Column label="Id" value="id"/>
                                        <Workbook.Column label="Employment Type" value="empType"/>
                                        </Workbook.Sheet>
                                ) : ''} 
                        
                        {Object.keys(this.state.Countries).length > 0 ? (
                                        <Workbook.Sheet data={this.state.Countries} name="Countries">
                                        <Workbook.Column label="Id" value="id"/>
                                        <Workbook.Column label="Country Name" value="country"/>
                                        </Workbook.Sheet>
                                ) : ''} 
                        {Object.keys(this.state.Countries).length > 0 ? (
                                        <Workbook.Sheet data={this.state.Countries} name="Nationality">
                                        <Workbook.Column label="Id" value="id"/>
                                        <Workbook.Column label="Nationality Name" value="nationality"/>
                                        </Workbook.Sheet>
                                ) : ''} 

                        {Object.keys(this.state.accessRoles).length > 0 ? (
                                        <Workbook.Sheet data={this.state.accessRoles} name="User Roles">
                                        <Workbook.Column label="Id" value="id"/>
                                        <Workbook.Column label="Role Name" value="roleName"/>
                                        </Workbook.Sheet>
                                ) : ''} 

                        {Object.keys(this.state.Employees).length > 0 ? (
                                        <Workbook.Sheet data={this.state.Employees} name="Employees">
                                        <Workbook.Column label="Employee Id" value="id"/>
                                        <Workbook.Column label="Employee Name" value="name"/>
                                        <Workbook.Column label="Designation" value="position"/>
                                        <Workbook.Column label="Department" value="department"/>
                                        </Workbook.Sheet>
                                ) : ''} 
                        {Object.keys(this.state.Grades).length > 0 ? (
                                        <Workbook.Sheet data={this.state.Grades} name="Grades">
                                        <Workbook.Column label="Id" value="id"/>
                                        <Workbook.Column label="Grade" value="grade"/>
                                        <Workbook.Column label="Display Name" value="displayName"/>
                                        </Workbook.Sheet>
                                ) : ''} 
                        {Object.keys(this.state.marital_status).length > 0 ? (
                                        <Workbook.Sheet data={Object.values(this.state.marital_status)} name="Marital Status">
                                        <Workbook.Column label="Marital Status" value="name"/>
                                        </Workbook.Sheet>
                                ) : ''} 
                        {Object.keys(this.state.emirateArr).length > 0 ? (
                                        <Workbook.Sheet data={Object.values(this.state.emirateArr)} name="Issuing Emirates">
                                        {/* <Workbook.Column label="Id" value="id"/> */}
                                        <Workbook.Column label="Emirates Name" value="value"/>
                                        </Workbook.Sheet>
                                ) : ''} 
                        {Object.keys(this.state.visaTypeArr).length > 0 ? (
                                        <Workbook.Sheet data={Object.values(this.state.visaTypeArr)} name="Visa Type">
                                        <Workbook.Column label="Visa Type" value="value"/>
                                        </Workbook.Sheet>
                                ) : ''} 

                          </Workbook>
                       
                      )
        }
}

export default ExportMasterData; 