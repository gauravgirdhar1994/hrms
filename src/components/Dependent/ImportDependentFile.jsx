import React, { Component } from 'react';
// import { Row, Col, Card, Table } from 'reactstrap';
import axios from "axios";
import Moment from "moment";
import { Modal, Button } from "react-bootstrap"
import UploadDependent from '../../components/Dependent/UploadDependent';
import DateRangePicker from 'react-daterange-picker';
import moment from 'moment-range';
import { ExportReactCSV } from '../../views/ExportReactCSV'
import config from '../../config/config'
const BEARER_TOKEN = localStorage.getItem("userData");

class ImportFile extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            data : [],
            exportData : [],
            relationship : {'S' : "Spouse", "P" : "Parent", "C" : "Child"},
            gender : {'M' : 'Male', 'F' : 'Female'},
            fileName : 'dependents',
            Countries : [],
            Nationalities : [],
            countriesArr : [],
            nationalityArr : []
        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
         localStorage.setItem('attendanceMonth',value);
    }
    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    componentDidMount(){
            this.refreshData();
            this.getCountries();
    }

    getCountries() {
        axios.get(config.API_URL + '/common/countries', { headers: { Authorization: 'bearer ' + BEARER_TOKEN } })
            .then(r => {

                if (r.status == 200) {
                    var arrCountry = [];
                    var arrNationality = [];
                    var arrCountry1 = [];

                    for (var k = 0; k < r.data.Countries.length; k++) {
                        arrCountry.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].country} </option>);
                        arrNationality.push(<option key={r.data.Countries[k].id} value={r.data.Countries[k].id}> {r.data.Countries[k].nationality} </option>);
                    }
                    this.setState({ Countries: arrCountry, Nationalities : arrNationality, countriesArr : r.data.countriesArr, nationalityArr : r.data.nationalityArr });
                }
            }).catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    refreshData(){
        var bearer = "Bearer " + BEARER_TOKEN;
        let empId = 0;
        axios
            .get(
                config.API_URL +
                "/employee/DependentInformation/" +
                empId,
                { headers: { Authorization: bearer } }
            )
            .then((r) => {
                console.log("Api result", r);
                let exportData = [];
                this.setState({ data: r.data.bankData.rows },() => {
                        if(Object.keys(this.state.data).length > 0){
                                this.state.data.map((data, key) => {
                                    console.log('Export Data', data);
                                    exportData[key] = {};
                                    exportData[key]['Employee Code'] = data.empCode;
                                    exportData[key]['Dependent Name'] = data.firstname + ' ' + data.lastname;
                                    exportData[key]['Dependent Code'] = data.dependentCode;
                                    exportData[key]['Birth Date'] = data.birthDate ? data.birthDate : '';
                                    exportData[key]['Gender'] = data.gender ? this.state.gender[data.gender.toUpperCase()] : '';
                                    exportData[key]['Relation'] = data.relationship ? this.state.relationship[data.relationship] : '';
                                    exportData[key]['Nationality'] = data.nationality ? this.state.nationalityArr[data.nationality] : '';
                                    exportData[key]['Visa UID'] = data.visaUID ? data.visaUID : '';
                                    exportData[key]['Visa File No'] = data.visa_file_no ? data.visa_file_no : '';
                                    exportData[key]['Visa Type'] = data.visa_type ? data.visa_type : '';
                                    exportData[key]['Sponsor'] = data.sponsor ? data.sponsor : '';
                                    exportData[key]['Visa Issue Date'] = data.visaIssueDate ? Moment(data.visaIssueDate).format(config.DATE_FORMAT) : '';
                                    exportData[key]['Visa Expiry Date'] = data.visaExpiryDate ? Moment(data.visaExpiryDate).format(config.DATE_FORMAT) : '';
                                    exportData[key]['Visa Issuing Emirate'] = data.issuing_emirate ? data.issuing_emirate : '';
                                    exportData[key]['Visa Issuing Country'] = data.visaIssuingCountry ? this.state.countriesArr[data.visaIssuingCountry] : '';
                                    exportData[key]['Passport Number'] = data.passport_number ? data.passport_number : '';
                                    exportData[key]['Passport Issue Date'] = data.passportIssueDate ? Moment(data.passportIssueDate).format(config.DATE_FORMAT) : '';
                                    exportData[key]['Passport Expiry Date'] = data.passportExpiryDate ? Moment(data.passportExpiryDate).format(config.DATE_FORMAT) : '';
                                    exportData[key]['Emirates Id'] = data.eidNo ? data.eidNo : '';
                                    exportData[key]['Emirates Expiry Date'] = data.emirateExpiryDate ? Moment(data.emirateExpiryDate).format(config.DATE_FORMAT) : '';
                                })
                            this.setState({
                                exportData: exportData
                            })
                        }
                });
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }
    render() {
        console.log('Dependent Export Data', this.state.exportData);
        return (
            <>
                {/* <p className="">Attendance Import is used to import employee monthly attendance that helps in calculating working days and loss of pay days while running payrolls.</p> */}
                <div class="row ml-0 mr-0 p-10 float-right">
                <ExportReactCSV csvData={this.state.exportData} title="Export Dependents" fileName={this.state.fileName} />
                <p>(Before you click on this button please import the dependent information in the system) </p>
                </div>
                <div className="pb-5 text-center"> <input type="button" onClick={this.handleShow} class="btn btn-primary mr-2" value="Import Dependent" /> <span className="downloadHere">If you don’t have the format <a href={config.BASE_URL+''+'/uploads/sample/dependent-import-sample.csv'} download>download here</a></span></div>
              
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Dependent Import</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                       
                        <div className="row mb-1">
                            <div className="col-lg-4"> <label htmlFor="Location" className="mb-2">Upload *</label></div>
                            <div className="col-lg-8"> <UploadDependent onReferesh={this.props.onReloadData} /></div>
                        </div>

                        <label htmlFor="Location" className="mb-2 mt-2 text-right">File type - csv size 5 MB only</label>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default ImportFile;
