import axios from 'axios';
import React, { Component } from 'react'
import NewHirePicket from './NewHirePicket'
import DepartmentTagging from './DepartmentTagging'
import Offerletter from './Offerletter'
import VisaApplication from './VisaApplication'
import HealthCheckUp from './HealthCheckUp'
import OnboardingLast from './OnboardingLast'
import config from '../../config/config';




import { Row, Col, Card, Table } from 'reactstrap';

class OnboardingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataCount: '',
            orgId: localStorage.getItem("orgId"),
            token: localStorage.getItem("userData"),
            activeTab: 1,
            disabledTabs: {
                1: true,
                2: true,
                3: false,
                4: false,
                5: false,
                6: false,
            }
        }
    }
    componentDidMount = () => {
        // let urlToken = this.props;
        // console.log('Step', urlToken);
        let editBoardingId = 0;
        if (this.props.editBoarding) {
            editBoardingId = this.props.editBoarding;
        }
        this.refreshData();
        this.checkTabsProgress();
        
    }

    checkTabsProgress(){
        let editBoardingId = 0;
        if (this.props.editBoarding) {
            editBoardingId = this.props.editBoarding;
        }
        const progressUrl = config.API_URL + '/employee/onBoarding/progress/' + editBoardingId;
        var bearer = 'Bearer ' + this.state.token;
        axios.get(progressUrl, { headers: { Authorization: bearer } })
            .then(r => {
                this.setState({ disabledTabs: r.data.disabledTabs, activeTab: r.data.activeTab })
            })
            .catch((error) => {
                console.log("API ERR: ", error);
                console.error(error);
                // res.json({ error: error });
            });
    }

    refreshData() {
        var bearer = 'Bearer ' + this.state.token;
        let apiUrl = '';
        if (this.props.editBoarding) {
            apiUrl = config.API_URL + '/employee/onboarding/list/' + this.state.orgId + "?id=" + this.props.editBoarding;
        }

        axios.get(apiUrl, { headers: { Authorization: bearer } })
            .then(r => {
                if (this.props.editBoarding) {
                    this.setState({ data: r.data.onboardingData.rows[0], dataCount: r.data.onboardingData.count })
                }
            })
            .catch((error) => {
                console.log("API ERR: ", error);
                console.error(error);
                // res.json({ error: error });
            });

    }

    setActiveTab = (id) => {
        // console.log('Set Active Tab', id);
        // let editBoardingId = 0;
        // if (this.props.editBoarding) {
        //     editBoardingId = this.props.editBoarding;
        // }
        // const progressUrl = config.API_URL + '/employee/onBoarding/progress/' + editBoardingId;
        // var bearer = 'Bearer ' + this.state.token;
        // axios.get(progressUrl, { headers: { Authorization: bearer } })
        //     .then(r => {
        //         this.setState({ disabledTabs: r.data.disabledTabs, activeTab: r.data.activeTab })
        //     })
        //     .catch((error) => {
        //         console.log("API ERR: ", error);
        //         console.error(error);
        //         // res.json({ error: error });
        // });
        this.setState({ activeTab: id });
        this.props.setId(this.props.editBoarding);
        // this.setState({
        //     activeTab: id
        // },()=>{
        //     this.checkTabsProgress();
        //     
        // })

    }

    render() {


        if (this.props.editBoarding && this.state.data.length == 0) {
            return null;
        }

        console.log('Active Tab on tab click', this.state.activeTab);

        return (
            <>

                <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm mt-4">
                    <li className={this.state.disabledTabs && !this.state.disabledTabs['1'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding ? () => this.setActiveTab(1) : ''}>
                        <a data-target="#picket" data-toggle="tab" className={this.state.activeTab == 1 ? 'nav-link active' : 'nav-link'}>New Hire packet</a>
                    </li>
                    <li className={this.state.disabledTabs && !this.state.disabledTabs['2'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding && this.state.disabledTabs['2'] ? () => this.setActiveTab(2) : ''}>
                        <a data-target="#Department" data-toggle={this.state.disabledTabs && this.state.disabledTabs['2'] === true ? 'tab' : ''} className={this.state.activeTab == 2 ? 'nav-link active' : 'nav-link'}>Department/Payroll Tagging</a>
                    </li>
                    <li className={this.state.disabledTabs && !this.state.disabledTabs['3'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding && this.state.disabledTabs['3'] ? () => this.setActiveTab(3) : ''}>
                        <a data-target="#letter" data-toggle={this.state.disabledTabs && this.state.disabledTabs['3'] === true ? 'tab' : ''} className={this.state.activeTab == 3 ? 'nav-link active' : 'nav-link'}>Offer letter</a>
                    </li>

                    {!this.state.data.uaeResident ? (
                        <>
                            <li className={this.state.disabledTabs && !this.state.disabledTabs['4'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding && this.state.disabledTabs['4'] ? () => this.setActiveTab(4) : ''}>
                                <a data-target="#Application" data-toggle={this.state.disabledTabs && this.state.disabledTabs['4'] === true ? 'tab' : ''} className={this.state.activeTab == 4 ? 'nav-link active' : 'nav-link'}>Visa Application</a>
                            </li>

                            <li className={this.state.disabledTabs && !this.state.disabledTabs['5'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding && this.state.disabledTabs['5'] ? () => this.setActiveTab(5) : ''}>
                                <a data-target="#Health" data-toggle={this.state.disabledTabs && this.state.disabledTabs['5'] === true ? 'tab' : ''} className={this.state.activeTab == 5 ? 'nav-link active' : 'nav-link'}>Health CheckUp</a>
                            </li>
                        </>) : (
                            <>
                                <li className={this.state.disabledTabs && !this.state.disabledTabs['4'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding && this.state.disabledTabs['4'] ? () => this.setActiveTab(4) : ''}>
                                    <a data-target="#Health" data-toggle={this.state.disabledTabs && this.state.disabledTabs['4'] === true ? 'tab' : ''} className={this.state.activeTab == 4 ? 'nav-link active' : 'nav-link'}>Health CheckUp</a>
                                </li>
                                <li className={this.state.disabledTabs && !this.state.disabledTabs['5'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding && this.state.disabledTabs['5'] ? () => this.setActiveTab(5) : ''}>
                                    <a data-target="#Application" data-toggle={this.state.disabledTabs && this.state.disabledTabs['5'] === true ? 'tab' : ''} className={this.state.activeTab == 5 ? 'nav-link active' : 'nav-link'}>Visa Application</a>
                                </li></>)}

                    <li className={this.state.disabledTabs && !this.state.disabledTabs['6'] === true ? 'nav-item disabled' : 'nav-item'} onClick={this.props.editBoarding && this.state.disabledTabs['6'] ? () => this.setActiveTab(6) : ''}>
                        <a data-target="#onboarding" data-toggle={this.state.disabledTabs && this.state.disabledTabs['6'] === true ? 'tab' : ''} className={this.state.activeTab == 6 ? 'nav-link active' : 'nav-link'}>Complete Onboarding</a>
                    </li>
                </ul>

                <div id="tabsJustifiedContent" className="tab-content py-1">
                    <div className={this.state.activeTab == 1 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="picket">
                        {this.state.activeTab == 1 ? (<NewHirePicket setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}
                    </div>
                    <div className={this.state.activeTab == 2 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="Department">
                        {this.state.activeTab == 2 ? (<DepartmentTagging setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}

                    </div>
                    <div className={this.state.activeTab == 3 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="letter">
                        {this.state.activeTab == 3 ? (<Offerletter setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}

                    </div>
                    {!this.state.data.uaeResident ? (
                        <>
                            <div className={this.state.activeTab == 4 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="Application">
                                {this.state.activeTab == 4 ? (<VisaApplication setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}
                            </div>

                            <div className={this.state.activeTab == 5 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="Health">
                                {this.state.activeTab == 5 ? (<HealthCheckUp setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}
                            </div>
                        </>
                    ) : (
                            <>
                                <div className={this.state.activeTab == 5 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="Application">
                                    {this.state.activeTab == 5 ? (<VisaApplication setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}
                                </div>

                                <div className={this.state.activeTab == 4 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="Health">
                                    {this.state.activeTab == 4 ? (<HealthCheckUp setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}
                                </div>
                            </>
                        )}
                    <div className={this.state.activeTab == 6 ? 'tab-pane fade show active py-1' : 'tab-pane fade py-1'} id="onboarding">
                        {this.state.activeTab == 6 ? (<OnboardingLast setActiveTab={this.setActiveTab} id={this.props.editBoarding} />) : ''}

                    </div>
                </div>


            </>
        );
    }
}

export default OnboardingTab;