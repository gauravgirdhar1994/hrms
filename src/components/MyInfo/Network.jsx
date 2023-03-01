import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import axios from "axios";
import config from "../../config/config";
import Google from './Google';

const BEARER_TOKEN = localStorage.getItem("userData");

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: '',
            hospitalList: [],
            pharmacyList: [],
            clinicList: [],
            hospitalCount: 0,
            pharmacyCount: 0,
            clinicCount: 0,
            markers: [],
            searchCli: '',
        }
    }
    componentDidMount() {
        this.loadNetworkHospital();
    }

    loadNetworkHospital = () => {

        const networkUrl = config.API_URL + "/insurance/hospital-list";
        var bearer = "Bearer " + BEARER_TOKEN;
        axios
            .get(networkUrl, { headers: { Authorization: bearer } })
            .then((r) => {
                if (r.status == 200) {
                    //var arrInsuranceData = [];
                    //var arrDependentData = [];

                    this.setState({
                        hospitalCount: r.data.hospitalList.length,
                        pharmacyCount: r.data.pharmacyList.length,
                        clinicCount: r.data.clinicList.length,
                        hospitalList: r.data.hospitalList,
                        pharmacyList: r.data.pharmacyList,
                        clinicList: r.data.clinicList,
                        markers: r.data.hospitalList
                    });



                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
                // res.json({ error: error });
            });
    }

    handleShow = () => {
        this.setState({ show: true })
    };

    handleClose = () => {
        this.setState({ show: false })
    };

    handleTabClick = (type) => {

        if (type === "hospital") {
            console.log('Handle tab click', type, this.state.hospitalList);
            this.setState({
                markers: this.state.hospitalList,
                hospitalList: []
            })
        } else if (type === "clinic") {

            this.setState({
                markers: this.state.clinicList
            })
        } else {
            this.setState({
                markers: this.state.pharmacyList
            })
        }

    }

    setSearchTerm = (val) => {
        this.setState(
            { searchCli: val.toLowerCase(), }
        );
    }

    render() {
        console.log('Markers', this.state.hospitalList);
        return (

            <>

                <Modal className="customModal" {...this.props}>
                    <Modal.Header closeButton>
                        <Modal.Title>Network</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ 'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto' }}>
                        <div className="row">
                            <div className="col-sm-6" style={{ 'height': '400px', 'overflow-y': 'scroll' }}>
                                <div className="customTab">
                                    <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                                        <li className="nav-item">
                                            <a href="#hospitals" data-target="#hospitals" data-toggle="tab" className="nav-link active" onClick={() => this.handleTabClick('hospital')} >Hospitals({this.state.hospitalCount})</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#pharmacies" data-target="#pharmacies" data-toggle="tab" className="nav-link" onClick={() => this.handleTabClick('pharmacy')}>Pharmacies({this.state.pharmacyCount})</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#Clinics" data-target="#Clinics" data-toggle="tab" className="nav-link" onClick={() => this.handleTabClick('clinic')}>Clinics({this.state.clinicCount})</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="tabsJustifiedContent" className="tab-content py-1">
                                    <div className="tab-pane fade active show" id="hospitals">
                                        <div className="list-group">
                                            {<input type="text" onChange={event => { this.setSearchTerm(event.target.value) }} placeholder="e.g. Hospital Name, Address" className="searchCustom" />}
                                            <ul className="network">
                                                {this.state.hospitalList.filter((val) => {
                                                    if (this.state.searchCli == "") {
                                                        return val;
                                                    } else if (val.name.toLowerCase().includes(this.state.searchCli) || val.address.toLowerCase().includes(this.state.searchCli)) {
                                                        return val;
                                                    }
                                                }).map(hos => {

                                                    return (
                                                        <li className="d-flex jcb aic"><div className="list">
                                                            <img src="/assets/location.svg" />
                                                            <h3>{hos.name}</h3>
                                                            <p>{hos.address}</p>

                                                        </div> <div>{hos.phone}</div></li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pharmacies">
                                        <div className="list-group">
                                            {<input type="text" onChange={event => { this.setSearchTerm(event.target.value) }} placeholder="e.g. Pharmacies Name, Address" className="searchCustom" />}
                                            <ul className="network">
                                                {this.state.pharmacyList.filter((val) => {
                                                    if (this.state.searchCli == "") {
                                                        return val;
                                                    } else if (val.name.toLowerCase().includes(this.state.searchCli) || val.address.toLowerCase().includes(this.state.searchCli)) {
                                                        return val;
                                                    }
                                                }).map(phar => {

                                                    return (
                                                        <li className="d-flex jcb aic"><div className="list">
                                                            <img src="/assets/location.svg" />
                                                            <h3>{phar.name}</h3>
                                                            <p>{phar.address}</p>

                                                        </div> <div>{phar.phone}</div></li>
                                                    )
                                                })}


                                            </ul>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="Clinics">
                                        <div className="list-group">
                                            {<input type="text" onChange={event => { this.setSearchTerm(event.target.value) }} placeholder="e.g. Clinics Name, Address" className="searchCustom" />}
                                            <ul className="network">

                                                {this.state.clinicList.filter((val) => {
                                                    if (this.state.searchCli == "") {
                                                        return val;
                                                    } else if (val.name.toLowerCase().includes(this.state.searchCli) || val.address.toLowerCase().includes(this.state.searchCli)) {
                                                        return val;
                                                    }
                                                }).map(cli => {

                                                    return (
                                                        <li className="d-flex jcb aic"><div className="list">
                                                            <img src="/assets/location.svg" />
                                                            <h3>{cli.name}</h3>
                                                            <p>{cli.address}</p>

                                                        </div> <div>{cli.phone}</div></li>
                                                    )
                                                })}



                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <Google isMarkerShown={true} Markers={this.state.markers} />


                            </div>


                            <p className="mt-2"><sup>*</sup>The list of medical facilities and specialities per facility is not static and can be subject to change, please contact our customer support for any further information</p>
                        </div>

                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Network;