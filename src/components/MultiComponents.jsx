/* 
Date:20-05-2020
Author : Manoj Kalra
 */
import React, { Component } from 'react';
import Info_box from './main/Info_box';
import moment from 'moment';
import config from "../config/config";
import DashboardLoader from './Loaders/DashboardBlocksLoader';
export const DMyInfo = (props) => {
    console.log('myInfo user role',props.role);
    if (props.myInfo.success == true) {
        return <div className="row mt-3 wow fadeInUp" data-wow-delay=".3s">
            <div className="col-xl-12 pb-1"><h5 className="font-16">My Info</h5> </div>
            <div className="col-xl col-sm-6 pb-3">
                <a href={config.BASE_URL_FRONTEND + '/my-info/attendance'}>
                    <Info_box imageUrl="/assets/leave.svg" title="My Attendance" iconBg="icon-box bg-green" iconclassName="d-inline-block lnr lnr-heart" card_tag="Present" quantity={<><span className="text-blue">{(props.myInfo.attendanceData && props.myInfo.attendanceData.totalPresent != undefined) ? props.myInfo.attendanceData.totalPresent : 'N/A'}</span> {(props.myInfo.attendanceData && props.myInfo.attendanceData.totalWorkingDays) ? (props.myInfo.attendanceData.totalPresent != undefined) ? '/' + props.myInfo.attendanceData.totalWorkingDays : '' : ''} </>} />
                </a>
            </div>
            <div className="col-xl col-sm-6 pb-3">
                <a href={config.BASE_URL_FRONTEND + '/my-info/attendance'}>
                    <Info_box imageUrl="/assets/leave.svg" title="Leaves applied" iconBg="icon-box bg-red" iconclassName="d-inline-block lnr lnr-calendar-full" card_tag="Pending" quantity={<><span className="text-blue">{(props.myInfo.pendingLeaveData && props.myInfo.pendingLeaveData.pendingLeave != undefined) ? props.myInfo.pendingLeaveData.pendingLeave : 'N/A'}</span> {(props.myInfo.pendingLeaveData && props.myInfo.pendingLeaveData.totalLeave) ? '/ ' + props.myInfo.pendingLeaveData.totalLeave : ''} </>} />
                </a>
            </div>


            <div className="col-xl col-sm-6 pb-3">
                <a href={config.BASE_URL_FRONTEND + '/my-info/personal'}>
                    <Info_box imageUrl="/assets/profile.svg" title="My profile completed" iconBg="icon-box bg-yellow" iconclassName="d-inline-block lnr lnr-user" quantity={<><span className="text-blue">{(props.myInfo.profilePercentage != undefined) ? props.myInfo.profilePercentage + '%' : 'N/A'}</span> </>} />
                </a>
            </div>


            <div className="col-xl col-sm-6 pb-3">
                <a href={config.BASE_URL_FRONTEND + '/employees'}>
                    <Info_box imageUrl="/assets/visa.svg" visaExpiry="true" role={props.role} insVisaExpiry={props.insVisaExpiry} title="Visa expiring on" iconBg="icon-box bg-dgreen" iconclassName="d-inline-block lnr lnr-location" quantity={<><span className="text-blue">{(props.myInfo.visaExpiry) ? moment(props.myInfo.visaExpiry).format('DD') : 'N/A'}</span> {(props.myInfo.visaExpiry) ? '/ ' + moment(props.myInfo.visaExpiry).format('MMM') : ''}</>} />
                </a>
            </div>
        </div>
    }
    else {
        return '';
    }
}
export const DMyTeam = (props) => {

    if (props.myTeam.success == true && props.myTeam.team.staffCount > 0) {
        // console.log('window.location',window.location);
        // console.log('insVisaExpiry',props.insVisaExpiry);
        // if(config.BASE_URL_FRONTEND.indexOf('localhost')!=-1)
        // {
        //     config.BASE_URL_FRONTEND = config.BASE_URL_FRONTEND+':'+process.env.PORT
        // }
        return <div className="row mt-3 wow fadeInUp" data-wow-delay=".3s">
            <div className="col-xl-12 pb-1 pt-3"> <h5 className="font-16">My Team</h5> </div>

            <div className="col-xl col-sm-6 pb-3">
                <a href={config.BASE_URL_FRONTEND + '/employee/view-team'}>
                    <Info_box imageUrl="/assets/staff.svg" title="Team Members" iconBg="icon-box bg-green" iconclassName="d-inline-block lnr lnr-users" quantity={<><span className="text-blue">{props.myTeam.team.staffCount}</span> </>} />
                </a>
            </div>
            <div className="col-xl col-sm-6 pb-3">
                <a href={config.BASE_URL_FRONTEND + '/employee/view-team?activeTab=leave'}>
                    <Info_box imageUrl="/assets/staff.svg" title="Team on leave" iconBg="icon-box bg-red" iconclassName="d-inline-block lnr lnr-calendar-full" quantity={<><span className="text-blue">{props.myTeam.team.LeaveTicketCount}</span> </>} />
                </a>
            </div>
            <div className="col-xl col-sm-6 pb-3">
            <a href={config.BASE_URL_FRONTEND + '/tickets/my-tickets?ticket_type=profile-update'}>
                <Info_box imageUrl="/assets/profile.svg" title="Profile update request" iconBg="icon-box bg-yellow" iconclassName="d-inline-block lnr lnr-user" quantity={<><span className="text-blue">{props.myTeam.team.profileTicketsCount}</span> </>} />
            </a>
            </div>
            <div className="col-xl col-sm-6 pb-3">
                <a href={config.BASE_URL_FRONTEND + '/employees'}>
                    <Info_box imageUrl="/assets/insurance.svg" title="Insurance Expiry" iconBg="icon-box bg-dgreen" iconclassName="d-inline-block lnr lnr-briefcase" insuranceExpiry="true" role={props.role} insVisaExpiry={props.insVisaExpiry} quantity={<><span className="text-blue font-24">{props.myTeam.team.insuraceExp ? moment(props.myTeam.team.insuraceExp).format('DD MMM') : 'N/A'}<br />{props.myTeam.team.insuraceExp ? moment(props.myTeam.team.insuraceExp).format('YYYY') : ''}</span> </>} />
                </a>
            </div>
        </div>
    }
    else {
        return '';
    }
}
export const OverallAdvanceLoan = (props) => {
    return <div className="row mt-3 wow fadeInUp text-center">
        <div className="col-xl col-sm-6 pb-3">
            <div className="card d-block p-1 h-100 shadow-sm">
                <div className="row h-100 no-gutters">
                    <div className="col p-3 py-2">

                        <p className="text-nowrap text-grey pt-4">Original Advance Amount</p>
                        <h3>{'Rs ' + props.overall_advance_loan.advance_amount}</h3>
                    </div>

                </div>
            </div>
        </div>

        <div className="col-xl col-sm-6 pb-3">
            <div className="card d-block p-1 h-100 shadow-sm">
                <div className="row h-100 no-gutters">
                    <div className="col p-3 py-2">

                        <p className="text-nowrap text-grey pt-4">Already Paid Off</p>
                        <h3>{'Rs ' + props.overall_advance_loan.deduction}</h3>
                    </div>

                </div>
            </div>
        </div>


        <div className="col-xl col-sm-6 pb-3">
            <div className="card d-block p-1 h-100 shadow-sm">
                <div className="row h-100 no-gutters">
                    <div className="col p-3 py-2">

                        <p className="text-nowrap text-grey pt-4">Balance Amount</p>
                        <h3>{'Rs ' + props.overall_advance_loan.balance}</h3>
                    </div>

                </div>
            </div>
        </div>


        <div className="col-xl col-sm-6 pb-3">
            <div className="card d-block p-1 h-100 shadow-sm">
                <div className="row h-100 no-gutters">
                    <div className="col p-3 py-2">

                        <p className="text-nowrap text-grey pt-4">Deduction this Month</p>
                        <h3>{'Rs ' + props.overall_advance_loan.ded_this_month}</h3>
                    </div>

                </div>
            </div>
        </div>
    </div>

}

