/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../config/config";
import { fetchData } from "../../action/fetchData";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import loader from "../../loader.gif";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
//import Moment from "moment";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoIosCard, IoIosCloudDownload } from "react-icons/io";
const BEARER_TOKEN = localStorage.getItem("userData");
import AddPlanDetails from './AddPlan/addPlanDetails';
import CoverageDetails from './AddPlan/coverageDetails';
import NetworkDetails from './AddPlan/networkDetails';
import FeaturesDetails from './AddPlan/featuresDetails';
import HighlightsDetails from './AddPlan/highlightsDetails';
import CoversDetails from './AddPlan/coversDetails';

class InsurancePlan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            planId: props.planDetails ? props.planDetails.id : '',
            activeTab: 1,
            planDetails: props.planDetails
        }
        this.changeTabs = this.changeTabs.bind(this)
    }

    changeTabs(tab, planId) {
        console.log('tab, planId', tab, planId);
        this.setState({
            planId: planId != '' ? planId : this.state.planId,
            activeTab: tab
        })
    }
    render() {
        console.log('this.state.planId ====> ', this.state.planId)
        const activeTab = this.state.activeTab;
        console.log('activeTab ====> ', activeTab, activeTab == '5', activeTab == 5);
        return (
            <>
                <Row>
                    <h4>Add New Insurance Plan </h4>
                    <span
                        className="font-16 block pointer margin-bottom-20"
                        onClick={(e) => this.props.goBackToPlans(e)}
                        style={{ right: '0px', position: 'absolute' }}>
                        {" "}
                        <FaArrowLeft /> Go Back{" "}
                    </span>
                </Row>
                <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                    <li className="nav-item">
                        <a href="#Tab1" data-target="#Tab1" data-toggle="tab" className={activeTab == 1 ? "nav-link active" : "nav-link"} onClick={e => this.changeTabs(1, this.state.planId)}>Add Plan Detail</a>
                    </li>
                    <li className="nav-item">
                        <a href="#Tab2" data-target="#Tab2" data-toggle="tab" className={activeTab == 2 ? "nav-link active" : "nav-link"} onClick={e => this.changeTabs(2, this.state.planId)}>Add Coverage & Deductible</a>
                    </li>
                    {/* <li className="nav-item">
                        <a href="#Tab3" data-target="#Tab3" data-toggle="tab" className="nav-link">Hospitals</a>
                    </li> */}
                    {/*  <li className="nav-item">
                        <a href="#Tab4" data-target="#Tab4" data-toggle="tab" className={activeTab==4?"nav-link active":"nav-link"}>Networks</a>
                    </li> */}
                    <li className="nav-item">
                        <a href="#Tab5" data-target="#Tab5" data-toggle="tab" className={activeTab == 5 ? "nav-link active" : "nav-link"} onClick={e => this.changeTabs(5, this.state.planId)}>Features</a>
                    </li>
                    
                    <li className="nav-item">
                        <a href="#Tab7" data-target="#Tab7" data-toggle="tab" className={activeTab == 7 ? "nav-link active" : "nav-link"} onClick={e => this.changeTabs(7, this.state.planId)}>Covers</a>
                    </li>
                    {/* <li className="nav-item">
                        <a href="#Tab6" data-target="#Tab6" data-toggle="tab" className={activeTab == 6 ? "nav-link active" : "nav-link"} onClick={e => this.changeTabs(6, this.state.planId)}>Highlights</a>
                    </li> */}
                </ul>

                <div id="tabsJustifiedContent" className="tab-content py-1">
                    <div className={activeTab == 1 ? "tab-pane show active" : "tab-pane fade"} id="Tab1">
                        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
                            <h4>Add Plan Details</h4>
                            <AddPlanDetails
                                categoryData={this.props.categoryData}
                                isurer={this.props.isurer}
                                changeTabs={this.changeTabs}
                                planDetails={this.state.planDetails}
                                goBackToPlans={this.props.goBackToPlans}
                                planId={this.state.planId} />
                        </Card>
                    </div>

                    {activeTab === 2 && (
                        <div className={activeTab == 2 ? "tab-pane show active" : "tab-pane fade"} id="Tab2">
                            <CoverageDetails
                                categoryData={this.props.categoryData}
                                isurer={this.props.isurer}
                                changeTabs={this.changeTabs}
                                planId={this.state.planId} />
                        </div>
                    )}

                    {/* <div className={activeTab==4?"tab-pane show active":"tab-pane fade"} id="Tab4">
                        <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
                            <h4>Add Networks</h4>
                            <NetworkDetails
                                categoryData={this.props.categoryData}
                                isurer={this.props.isurer}
                                changeTabs={this.changeTabs} />
                        </Card>

                        <div ref={this.props.myRef} onClick={this.props.onShowInsuranceForm} class="form-group row pt-2 mb-5 "><div class="col-lg-12 text-left"><span class="addNewButton"> <i class="icon-plus icons"></i> Add New</span></div></div>
                    </div> */}

                    {activeTab === 5 ? (
                        <div className="tab-pane show active" id="Tab5">
                            <FeaturesDetails
                                categoryData={this.props.categoryData}
                                isurer={this.props.isurer}
                                changeTabs={this.changeTabs}
                                planId={this.state.planId} />
                        </div>
                    ) : ('')}

                    {activeTab === 6 ? (
                        <div className={activeTab == 6 ? "tab-pane show active" : "tab-pane fade"} id="Tab6">
                            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
                                <h4>Add Highlights</h4>
                                <HighlightsDetails
                                    categoryData={this.props.categoryData}
                                    isurer={this.props.isurer}
                                    changeTabs={this.changeTabs}
                                    planId={this.state.planId} />
                            </Card>
                        </div>
                    ) : ('')}
                    {activeTab === 7 ? (
                        <div className={activeTab == 7 ? "tab-pane show active" : "tab-pane fade"} id="Tab7">
                            <Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
                                <h4>Add Covers</h4>
                                <CoversDetails
                                    categoryData={this.props.categoryData}
                                    isurer={this.props.isurer}
                                    changeTabs={this.changeTabs}
                                    planId={this.state.planId}/>
                            </Card>
                        </div>
                    ) : ('')}
                </div>
            </>
        )
    }
}

export default InsurancePlan; 