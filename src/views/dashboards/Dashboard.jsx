import React from 'react';
import { Wrapper, DataTable } from '../../components';
import DCalender from '../../components/Dashboard/DCalender'
import 'react-calendar/dist/Calendar.css';
import Info_box from '../../components/main/Info_box';
import User_contract from '../../components/main/User_contract';
import Ticker_raised from '../../components/Dashboard/Ticker_raised'
import UpcomingLeaves from '../../components/Dashboard/UpcomingLeaves'
import { Redirect } from 'react-router-dom';
import UserInfo from '../../components/UserInfo';
import { DMyInfo, DMyTeam } from '../../components/MultiComponents';
import Attendance_stack from '../../components/Dashboard/Attendance_stack';
import Holidays from '../../components/Dashboard/Holidays';
import Employee_exit from '../../components/main/EmployeeExit';
import Employee_Gender from '../../components/main/EmployeeGender';
import Employee_onboarded from '../../components/main/EmployeeOnboarded';
import config from '../../config/config';
import ExpiringDocsReq from '../../components/Dashboard/ExpiringDocsReq'
import BirthdayAnniversary from '../../components/Dashboard/BirthdayAnniversary'
import EmpGender from '../../components/Dashboard/EmpGender'
import { Carousel, Row } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import DashboardBlocksLoader from '../../components/Loaders/DashboardBlocksLoader';
import DataLoading from '../../components/Loaders/DataLoading';
import { Doughnut } from 'react-chartjs-2';
const BEARER_TOKEN = localStorage.getItem("userData");

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        var dashboardCard = {
            my_team: false,
            ticket_raised: false, holidays: false, upcoming_leaves: false, birthday_anniversary: false, emp_gender: false, emp_onboard: false, emp_exit: false
        }
        this.state = {
            redirectToReferrer: false,
            myInfo: [],
            myTeam: [],
            month: moment(new Date).format('M'),
            hideBirthdayComp: false,
            hideHolidayComp: false,
            hideULComp: false,
            dashboardCard: dashboardCard,
            insVisaExpiry: [],
            datas: {},
            userRole: localStorage.getItem('roleSlug')
        }

        this.getMyInfo = this.getMyInfo.bind(this);
        this.getAttendancsStack = this.getAttendancsStack.bind(this);
        this.getMyTeam = this.getMyTeam.bind(this);
        this.hideComp = this.hideComp.bind(this);
        this.ChkExpiredDocCond = this.ChkExpiredDocCond.bind(this);
        this.getDashboardCard = this.getDashboardCard.bind(this);
    }

    componentDidMount() {
        // 
        if (localStorage.getItem("userData")) {
            this.getDashboardCard();
            this.getMyInfo();
            this.getAttendancsStack();
            this.getMyTeam();
            this.getInsVisaExpiry();
        }
        else {
            this.setState({ redirectToReferrer: true });
        }


    }
    getMyInfo() {
        var url = config.API_URL + "/dashboard/myinfo";
        fetch(url, {
            method: 'get',
            withCredentials: true,
            headers: {
                'Authorization': 'bearer ' + BEARER_TOKEN,
            },
            'mode': 'cors',
        }).then(res => res.json()).then(res => {
            this.setState({ myInfo: res });
        })
    }
    getInsVisaExpiry() {
        var url = config.API_URL + "/dashboard/get-ins-visa-expiry-count";
        fetch(url, {
            method: 'get',
            withCredentials: true,
            headers: {
                'Authorization': 'bearer ' + BEARER_TOKEN,
            },
            'mode': 'cors',
        }).then(res => res.json()).then(res => {
            this.setState({ insVisaExpiry: res.data });
        })
    }
    getMyTeam() {
        var employee_id = localStorage.getItem("employeeId");
        var url = config.API_URL + "/dashboard/myteam";
        fetch(url, {
            method: 'get',
            withCredentials: true,
            headers: {
                'Authorization': 'bearer ' + BEARER_TOKEN,
            },
            'mode': 'cors',
        }).then(res => res.json()).then(res => {
            this.setState({ myTeam: res });
        })
    }
    getAttendancsStack() {
        var url = config.API_URL + "/view-attendance";
        //var BEARER_TOKEN= 'eyJhbGciOiJIUzI1NiJ9.W3siaWQiOjEsInVzZXJuYW1lIjoiZ2F1cmF2IiwicGFzc3dvcmQiOiI1ZjRkY2MzYjVhYTc2NWQ2MWQ4MzI3ZGViODgyY2Y5OSIsInJvbGUiOjEsInJlc2V0X3Bhc3N3b3JkX3Rva2VuIjpudWxsLCJyZXNldF9wYXNzd29yZF9leHBpcmVzIjpudWxsLCJvcmdJZCI6MSwiZW1wSWQiOjcsImNyZWF0ZWRCeSI6MCwidXBkYXRlZEJ5IjoxLCJjcmVhdGVkT24iOiIyMDIwLTA0LTMwVDE5OjIwOjU2LjAwMFoiLCJ1cGRhdGVkT24iOiIyMDIwLTA1LTE2VDA4OjM2OjAyLjAwMFoifV0.3Z5b3rTGENi3TxQLPMHKRSGw6PAQx04_dV-jw64waqg'
        fetch(url, {
            method: 'POST',
            withCredentials: true,
            headers: {
                'Authorization': 'Bearer ' + BEARER_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            'mode': 'cors',
            body: JSON.stringify({
                "month": this.state.month
            })
        }).then(res => res.json()).then(res => {
            this.setState({ attendance: res });
        })
    }
    hideComp(field, val) {
        //console.log('eef',field,val);
        var obj = {}
        obj[field] = val
        this.setState(obj)
    }
    ChkExpiredDocCond() {
        if ((this.state.myInfo.expiringDocuments.mol && this.state.myInfo.expiringDocuments.mol.length > 0) ||
            (this.state.myInfo.expiringDocuments.visa && this.state.myInfo.expiringDocuments.visa.length > 0) ||
            (this.state.myInfo.expiringDocuments.passport && this.state.myInfo.expiringDocuments.passport.length > 0)) {
            return true;
        }
        else {
            return false
        }
    }
    getDashboardCard() {
        const bearer = 'bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/field-access-list?menuId=13', { headers: { Authorization: bearer } })
            .then(r => {
                if (r.status == 200 && r.data.success == true) {
                    if (r.data.fieldList.length > 0) {
                        var items = {};
                        r.data.fieldList.map((obj) => {
                            if (obj.view == 1) {
                                items[obj.fieldName] = true
                            }
                            else {
                                items[obj.fieldName] = false
                            }
                        })
                        this.setState({ dashboardCard: items })
                    }

                }
                //console.log('dashboardCard',items)
            })

    }
    render() {

        if(this.state.dashboardCard){
            console.log('Dashboard Card', this.state.dashboardCard);
        }
        if(this.state.attendance){
            console.log('Attendance Stats',this.state.attendance.length);
        }

        if (this.state.redirectToReferrer) {
            return (<Redirect to={'/login'} />)
        }

        if(this.state.userRole === 'broker-admin' || this.state.userRole === 'broker-primary' ){
            return (<Redirect to={'/tickets/my-tickets'} />)
        }

        const data = canvas => {
            const ctx = canvas.getContext("2d");
            return {
                datasets: [
                    {
                        backgroundColor: ["#ec137c", "#cccccc"],
                        data: [10, 20]
                    }
                ]
            };
        };

        return (
            <Wrapper>
                <main className="flex-fill">
                    <UserInfo />
                    {this.state.myInfo ? <DMyInfo insVisaExpiry = {this.state.insVisaExpiry} role={this.state.userRole} myInfo={this.state.myInfo} /> : <DashboardBlocksLoader/>}
                    {this.state.myTeam ? <DMyTeam insVisaExpiry = {this.state.insVisaExpiry} role={this.state.userRole} myTeam={this.state.myTeam} /> : <DashboardBlocksLoader/>}
                    <div className="row mt-3 wow fadeInUp pt-2" data-wow-delay=".3s">
                        {Object.keys(this.state.myInfo).length > 0 ? ((this.state.myInfo.expiringDocuments) && (this.ChkExpiredDocCond())) ? <div className="col-xl col-md-3 col-sm-6 pb-3">
                            <ExpiringDocsReq expiringDocuments={this.state.myInfo.expiringDocuments} />
                        </div> : '' : <DataLoading/> }
                        <div className="col-xl col-md-3 col-sm-6 pb-3">
                            <div className="card d-block p-1 h-100 shadow-sm dash">
                                <div className="row h-100 no-gutters">
                                    <div className="card-body p-xl-3 p-2 d-flex flex-column">
                                        <h4 className="mb-4 font-16 pl-3">Calendar</h4>
                                        <div className="my-auto p-1 py-2">
                                            <DCalender />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* {
                            (this.state.attendance) ? (this.state.attendance.attendanceType) ? <div className="col-md-6 col-sm-6 pb-3">
                                <div className="card d-block p-1 h-100 shadow-sm">
                                    <div className="row h-100 no-gutters">  
                                        <div className="card-body p-xl-3 p-2 d-flex flex-column">
                                            <div className="d-flex justify-content-between">
                                                <h4 className="mb-4 font-16 pl-3">Attendance Stats</h4>
                                                
                                            </div>

                                            <div className="my-auto p-1 py-2">
                                                <Attendance_stack attendanceType={this.state.attendance.attendanceType} />
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div> : '' : <DataLoading></DataLoading>
                        } */}
                    </div>
                    {this.state.dashboardCard.ticket_raised ? <div className="row py-3 ">
                        <div className="col-12 wow fadeInUp">
                            <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                                <Ticker_raised />
                            </div>
                        </div>
                    </div> : ''}
                    <div className="row py-3 ">
                        {( this.state.dashboardCard.holidays) ? 
                            <Holidays hideComp={this.hideComp} />
                            : ''}

                        {(this.state.dashboardCard.upcoming_leaves) ? 
                            <UpcomingLeaves hideComp={this.hideComp} />
                         : ''}

                        {(!this.state.hideBirthdayComp && this.state.dashboardCard.birthday_anniversary) ? <div className="col-xl col-sm pb-3">
                            <BirthdayAnniversary hideComp={this.hideComp} />
                        </div> : (
                            <div className="col-xl col-sm pb-3">
                             <div className="card d-block p-3 h-100 shadow-sm d-none">
                             <div className="d-flex justify-content-between">
                                 <h4 className="mb-4 font-16 pl-3">Birthdays/Anniversaries</h4>
                             </div>
                             <div className="text-center">
                                 <div className="col-md-12">
                                 <p><i className="fa fa-frown-o fa-5x"></i></p>
                                 </div>
                                 <div className="col-md-12">
                                 <h3 className="mb-4 pl-3">Shhh!! There are no celebrations this month.</h3>
                                 </div>
                                    
                                
                             </div>
                             
                             </div>
                             </div>
                        )}

                    </div>
                    <div className="row py-3 ">
                        {this.state.dashboardCard.emp_gender ? <div className="col-xl col-sm-6 pb-3">
                            <div className="card d-block p-1 h-100 shadow-sm">
                                <div className=" h-100 no-gutters">
                                    <h4 className="mt-4 mb-4 font-16 pl-3">Employee Gender</h4>
                                    <EmpGender />
                                </div>

                            </div>
                        </div> : ''}

                        {this.state.dashboardCard.emp_onboard ? <div className="col-xl col-sm-6 pb-3">
                            <div className="card d-block p-1 h-100 shadow-sm">
                                <div className="row no-gutters">
                                    <div>
                                        <h4 className="mt-4 mb-4 font-16 pl-3">Employee OnBoard</h4>
                                    </div>

                                    <Employee_onboarded user_text={<>Proportion of your workforce who Join during a period of time</>} />

                                    <div className="d-flex justify-content-between col-sm-12 pl-3 pr-3 mt-5">
                                        {/*<div className="font-16">Q2 2020 <span className="lnr lnr-chevron-down"></span></div>*/}
                                        <div className="mb-4 font-16 pl-3 green-T">{this.state.myInfo.onBoardingPercentage ? Math.round(this.state.myInfo.onBoardingPercentage * 100) / 100 : 0}% </div>
                                    </div>


                                </div>
                            </div>
                        </div> : ''}
                        {/*<div className="col-xl col-sm-6 pb-3">
                                <div className="card d-block p-1 h-100 shadow-sm">
                                <div className="row no-gutters">
                                  
                                  <h4 className="mt-4 mb-4 font-16 pl-3">Employee Exit</h4>                                       
                             

                                 <Employee_onboarded  user_text={<>Proportion of your workforce who leave during a period of time</>}/>

                                 <div className="d-flex justify-content-between col-sm-12 pl-3 pr-3 mt-5">                                       
                                  <div className="font-16">Q2 2020 <span className="lnr lnr-chevron-down"></span></div>
                                  <div className="mb-4 font-16 pl-3 green-T">85% </div>
                              </div>
                             
                             
                              </div>
                                </div>
                            </div>*/}
                    </div>

                    {/* <div className="row py-3 ">
                        {this.state.insVisaExpiry && this.state.insVisaExpiry.visa && this.state.insVisaExpiry.visa.count.length > 0 ? (
                            <div className="col-xl col-sm-6 pb-3">
                                <div className="card d-block p-1 h-100 shadow-sm">
                                    <h4 class="font-16 pl-3">Visa Document Expiry </h4>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="doughnutcenter">
                                                <div class="pie-chart-container"><span className="bold font-26 black"><i>{this.state.insVisaExpiry.visa.count[0] ? this.state.insVisaExpiry.visa.count[0].visa_count : 0}</i></span><p className="font-14 -sm-6or-grey">No. of employees</p></div>
                                                <Doughnut
                                                    data={[]}
                                                    labels={[]}
                                                    options={{
                                                        cutoutPercentage: this.state.insVisaExpiry.visa.count[0] ? this.state.insVisaExpiry.visa.count[0].visa_perc : 0,
                                                        legend: {
                                                            display: false,
                                                            tooltips: false
                                                        }
                                                    }}
                                                    width={200} height={200}
                                                />
                                            </div>
                                            <p className="text-center mt-2">Expiry Date {this.state.insVisaExpiry.exp_date_cur_month}</p>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="doughnutcenter">
                                                <div class="pie-chart-container"><span className="bold font-26 black"><i>{this.state.insVisaExpiry.visa.count[1] ? this.state.insVisaExpiry.visa.count[1].visa_count : 0}</i></span><p className="font-14 -sm-6or-grey">No. of employees</p></div>
                                                <Doughnut
                                                    data={[]}
                                                    labels={[]}
                                                    options={{
                                                        cutoutPercentage: this.state.insVisaExpiry.visa.count[1] ? this.state.insVisaExpiry.visa.count[1].visa_perc : 0,
                                                        legend: {
                                                            display: false,
                                                            tooltips: false
                                                        }
                                                    }}
                                                    width={200} height={200}
                                                />
                                            </div>
                                            <p className="text-center mt-2">Expiry Date {this.state.insVisaExpiry.exp_date_next_month}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}

                        {this.state.insVisaExpiry && this.state.insVisaExpiry.insurance && this.state.insVisaExpiry.insurance.count.length > 0 ? (
                            <div className="col-xl col-sm-6 pb-3">
                                <div className="card d-block p-1 h-100 shadow-sm">
                                    <h4 class="font-16 pl-3">Insurance Document Expiry </h4>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="doughnutcenter">
                                                <div class="pie-chart-container"><span className="bold font-26 black"><i>{this.state.insVisaExpiry.insurance.count[0] ? this.state.insVisaExpiry.insurance.count[0].ins_count : 0}</i></span><p className="font-14 -sm-6or-grey">No. of employees</p></div>
                                                <Doughnut
                                                    data={data}
                                                    labels={[]}
                                                    options={{
                                                        cutoutPercentage: this.state.insVisaExpiry.insurance.count[0] ? this.state.insVisaExpiry.insurance.count[0].ins_perc : 0,
                                                        legend: {
                                                            display: false,
                                                            tooltips: false
                                                        }
                                                    }}
                                                    width={200} height={200}
                                                />
                                            </div>
                                            <p className="text-center mt-2">Expiry Date {this.state.insVisaExpiry.exp_date_cur_month}</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="doughnutcenter">
                                                <div class="pie-chart-container"><span className="bold font-26 black"><i>{this.state.insVisaExpiry.insurance.count[1] ? this.state.insVisaExpiry.insurance.count[1].ins_count : 0}</i></span><p className="font-14 -sm-6or-grey">No. of employees</p></div>
                                                <Doughnut
                                                    data={data}
                                                    labels={[]}
                                                    options={{
                                                        cutoutPercentage: this.state.insVisaExpiry.insurance.count[1] ? this.state.insVisaExpiry.insurance.count[1].ins_perc : 0,
                                                        legend: {
                                                            display: false,
                                                            tooltips: false
                                                        }
                                                    }}
                                                    width={200} height={200}
                                                />
                                            </div>
                                            <p className="text-center mt-2">Expiry Date {this.state.insVisaExpiry.exp_date_next_month}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ) : ''}
                    </div> */}

                </main>
            </Wrapper>
        );
    }
}

export default Dashboard;
