import React, { Component } from 'react';
import { Card, Row, Table, ProgressBar, Button, Modal, Form } from "react-bootstrap"
import axios from "axios";
import { BootstrapTable, TableHeaderColumn, PaginationPostion } from 'react-bootstrap-table';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
import config from '../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");

function onAfterSaveCell(row, cellName, cellValue) {
    var url = config.API_URL + "/insurance/update-hospital-data";
    var bearer = 'Bearer ' + BEARER_TOKEN;
    let finalData = {};
    finalData.colume = cellName;
    finalData.value = cellValue;
    finalData.id = row.id;
    const headers = {
      Authorization: bearer,
      // "Content-Type": "multipart/form-data"
    };
    axios.post(url, finalData, { headers: headers }).then((res) => {
      if(res.status == 200){
        toast.success(res.data.message);
        setTimeout(function () {
          toast.dismiss()
        }, 5000)
      }
    });
}

function onBeforeSaveCell(row, cellName, cellValue) {
    console.log('Cellname', cellName);
    var value = parseFloat(cellValue);
    if(cellName === 'latitude' || cellName === 'longitude'){
        if (!isNaN(value) && value.toString().indexOf('.') != -1 ) {
            return true;
        } else {
            alert(`Please provide float value`);
            return false;
        }
    }
    

}

const cellEditProp = {
    mode: 'click',
    blurToSave: true,
    beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
    afterSaveCell: onAfterSaveCell  // a hook for after saving cell
};




class HospitalPlanView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: '',
            percentage: 0,
            uploadMsg: '',
            hospital: [],
            type: ['Hospital', 'Clinic', 'Pharmacy'],
            emirates: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
            city: '',
            hospType: '',
            name: '',
            islatlong: -1,
        }
    }
    componentDidMount() {
        this.reloadFilterData();
    }
    handleShow = () => {
        this.setState({ show: true })
    };

    reloadFilterData = () => {
        const Searchcity = this.state.city;
        const Searchtype = this.state.hospType;
        const Searchname = this.state.name;
        const SearchLatlong = this.state.islatlong;
        const apiUrl = config.API_URL + '/insurance/hospital-master-list?city=' + Searchcity + '&type=' + Searchtype + '&name=' + Searchname + '&latlong=' + SearchLatlong;
        var bearer = "Bearer " + BEARER_TOKEN;
        axios
            .get(apiUrl, { headers: { Authorization: bearer } })
            .then((r) => {
                if (r.status == 200) {
                    this.setState({ hospital: r.data.hospitalList });

                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    handleSearchClick = () => {
        this.reloadFilterData();
    }



    handleClose = () => {

        this.setState({ show: false })
    };

    render() {
        const uploadPercent = this.state.percentage;
        return (
            <>
                <h4>Master Hospital List</h4>

                <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">



                    <Row>
                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label for="priority">City</label>
                                </div>
                                <div className="col-sm-12">
                                    <select name='city' className="form-control custom-select" onChange={this.handleChange} value={this.state.city} >
                                        <option value="">Select Location</option>
                                        {this.state.emirates.map((obj, index) => {
                                            return (
                                                <option value={index}>{obj}</option>
                                            )
                                        })}

                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label for="priority"> Type</label>
                                </div>
                                <div className="col-sm-12">
                                    <select name='hospType' className="form-control custom-select" onChange={this.handleChange} value={this.state.hospType} >
                                        <option value=""> Type</option>
                                        {this.state.type.map(obj => {
                                            return (
                                                <option value={obj}>{obj}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label for="priority">Name</label>
                                </div>
                                <div className="col-sm-12">
                                    <input type="text" className="form-control" name='name' value={this.state.name} onChange={this.handleChange}>

                                    </input>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label for="priority">Latitude/Longitude</label>
                                </div>
                                <div className="col-sm-12">
                                    <select name='islatlong' className="form-control custom-select" onChange={this.handleChange} value={this.state.islatlong} >
                                        <option value="-1">Select lat/long</option>
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-3 pb-3">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label for="priority">&nbsp;</label>
                                </div>
                                <div className="col-sm-12">
                                    <Button type="button" variant="primary" onClick={this.handleSearchClick}> Search </Button>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Card>


                <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-4 shadow-sm">

                    <h4>Hospital Master List</h4>
                    <h4 style={{textAlign : "right"}}>Total records:{Object.keys(this.state.hospital).length}</h4>
                    <BootstrapTable title="Hospital List" data={this.state.hospital} pagination={true} exportCSV striped hover cellEdit={cellEditProp}>
                        <TableHeaderColumn isKey dataField='id'>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField='name' editable={ false }>Hospital Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='type'>Type</TableHeaderColumn>
                        <TableHeaderColumn dataField='city'>City</TableHeaderColumn>
                        <TableHeaderColumn dataField='area' >Area</TableHeaderColumn>
                        <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                        <TableHeaderColumn dataField='phone'>Phone</TableHeaderColumn>
                        <TableHeaderColumn dataField='category'>Category</TableHeaderColumn>
                        <TableHeaderColumn dataField='country' >Country</TableHeaderColumn>
                        <TableHeaderColumn dataField='latitude'>Latitude</TableHeaderColumn>
                        <TableHeaderColumn dataField='longitude'>Longitude</TableHeaderColumn>
                    </BootstrapTable>
                </Card>



            </>
        );
    }
}

export default HospitalPlanView;