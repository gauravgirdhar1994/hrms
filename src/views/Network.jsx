import React, { Component } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap"

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: ''
        }
    }

    handleShow = () => {
        this.setState({ show: true })
    };

    handleClose = () => {
        this.setState({ show: false })
    };

    render() {
        return (

            <>
                <h2 onClick={this.handleShow}>Network</h2>





                <Modal className="customModal" show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Network</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="customTab">
                                    <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                                        <li className="nav-item">
                                            <a href="#hospitals" data-target="#hospitals" data-toggle="tab" className="nav-link active">Hospitals(33)</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#pharmacies" data-target="#pharmacies" data-toggle="tab" className="nav-link">Pharmacies(44)</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#Clinics" data-target="#Clinics" data-toggle="tab" className="nav-link">Clinics(22)</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="tabsJustifiedContent" className="tab-content py-1">
                                    <div className="tab-pane fade active show" id="hospitals">
                                        <div className="list-group">
                                            <input type="text" placeholder="e.g. Al Zohra Hospital" className="searchCustom" />
                                            <ul className="network">
                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pharmacies">
                                        <div className="list-group">
                                            <input type="text" placeholder="e.g. Al Zohra Hospital" className="searchCustom" />
                                            <ul className="network">
                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="Clinics">
                                        <div className="list-group">
                                            <input type="text" placeholder="e.g. Al Zohra Hospital" className="searchCustom" />
                                            <ul className="network">
                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>

                                                <li className="d-flex jcb aic"><div className="list">
                                                    <img src="/assets/location.svg" />
                                                    <h3>Al Zohra Hospital</h3>
                                                    <p>Al Zohra Hospital</p>

                                                </div> <div>2379-795-8080</div></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">

                            </div>
                        </div>

                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Network;