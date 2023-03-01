import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';
import LeadsList from '../../components/Leads/Leads';
import ViewLeads from '../../components/Leads/ViewLeads';
import config from '../../config/config';
import axios from 'axios';
const BEARER_TOKEN = localStorage.getItem("userData");

class Leads extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddNew: false,
            leadDetails: {}
        }
        this.goBackToLeadList = this.goBackToLeadList.bind(this)
        this.getLeadDetails = this.getLeadDetails.bind(this)
        this.loadAlertMessage = this.loadAlertMessage.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }
    addNewLead() {
        this.setState({ showAddNew: true, leadDetails: {} })
    }
    goBackToLeadList() {
        this.setState({ showAddNew: false })
    }
    getLeadDetails(leadId) {
        return true;    
        axios.get(config.API_URL + '/leads/details/' + leadId,
            {
                headers: {
                    Authorization: 'Bearer ' + BEARER_TOKEN
                }
            })
            .then(res => {
                console.log(res)
                var leadDetails = res.data.leadDetails;
                this.setState({
                    leadDetails: leadDetails,
                    loading: false,
                    showAddNew: true
                })
                // resData.default = resData.url;
                // resolve(resData);
            }).catch(error => {
                console.log('ALLOW ===> ', error)
                // reject(error)
            });
    }
    loadAlertMessage(showAlertMessage, alertMessage) {
        if (showAlertMessage) {
            this.setState({
                showAddNew: false,
                showAlertMessage,
                alertMessage
            })
        }
    }
    closeAlert() {
        this.setState({
            showAlertMessage: '',
            alertMessage: false
        });
    }
    render() {
        return (
            <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">
                <Row>
                    <div className="col-sm-12" style={{ marginBottom: "10px", marginTop: "10px" }}>
                        <Col style={{ paddingRight: "0px" }}>
                            <h4>
                                Manage Leads
                                {this.state.showAddNew && (
                                    <span
                                        style={{ float: "right", marginRight: "15px" }}
                                        className="font-16 block pointer margin-bottom-20"
                                        onClick={(e) => this.goBackToLeadList(e)}
                                    >
                                        {" "}
                                        <FaArrowLeft /> Go Back{" "}
                                    </span>
                                )}
                            </h4>
                        </Col>
                    </div>
                </Row>
                {this.state.showAlertMessage && (
                    <div className="col-md-12 mx-auto">
                        <div className="withdrowReg text-center">
                            <p>
                                {this.state.alertMessage}
                                <span style={{
                                    float: "right",
                                    marginRight: "18px",
                                    cursor: "pointer"
                                }}
                                    onClick={(e) => this.closeAlert(e)}>X</span>
                            </p>
                        </div>
                    </div>
                )}
                {this.state.showAddNew ?
                    (
                        <ViewLeads goBack={this.goBackToLeadList} leadDetails={this.state.leadDetails} loadAlertMessage={this.loadAlertMessage} />
                    ) : (
                        <LeadsList getLeadDetails={this.getLeadDetails} />
                    )
                }
            </div>
        )
    }

}

export default Leads