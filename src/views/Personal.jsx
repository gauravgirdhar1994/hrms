import React, { Component } from 'react';
import BasicInfo from '../components/MyInfo/BasicInfo'
import ContactInfo from '../components/MyInfo/ContactInfo'
import VisaInfo from '../components/MyInfo/VisaInfo'
import PassportInfo from '../components/MyInfo/PassportInfo'
import EmiratesId from '../components/MyInfo/EmiratesId'
import University from '../components/Education/University';
import Certification from '../components/Education/Certification';
import WorkExp from '../components/MyInfo/WorkExp';
import EmploymentInfo from '../components/MyInfo/EmploymentInfo';
import SalaryBreakup from '../components/MyInfo/SalaryBreakup';
import BankDetails from '../components/MyInfo/BankDetails';
import DependentInformation from '../components/MyInfo/DependentInformation';
import { withRouter } from 'react-router-dom'

import UserInfo from '../components/UserInfo';
import config from '../config/config';
var CryptoJS = require("crypto-js")
class Personal extends Component {
        dec(cipherText){
                var reb64 = CryptoJS.enc.Hex.parse(cipherText);
                var bytes = reb64.toString(CryptoJS.enc.Base64);
                var decrypt = CryptoJS.AES.decrypt(bytes, config.secret_key);
                var plain = decrypt.toString(CryptoJS.enc.Utf8);
                return plain;
        }
    render() { 
        var editId = this.props.match.params.id;
        //console.log('editId1',editId)
        if(editId)
        {
            //var bytes  = CryptoJS.AES.decrypt(decodeURIComponent(editId).toString(), config.secret_key);
            editId = this.dec(editId);
        }
        else{
            editId = localStorage.getItem("employeeId")
        }
        console.log('editId',editId);
        return (
            <div>
                {this.props.match.params.id ? <div className="col-lg-12 text-right mt-4"><a href={config.BASE_URL_FRONTEND + '/employees'} className="btn btn-primary font-weight-bold">Go to Employees Directory</a> </div> : (
                    <>
                    <div className="col-lg-12"> <UserInfo /> </div>
                    <h4 className="mb-4 font-16 pl-3">My Info - Personal</h4>
                    </>
                )}
                 
                        <div className="col-lg-12">
                                                <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm mt-4">
                                                    <li className="nav-item">
                                                        <a href="#basicinfo" data-target="#basicinfo" data-toggle="tab" className="nav-link active">Basic Info</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a href="#education" data-target="#education" data-toggle="tab" className="nav-link">Education</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a href="#workexp" data-target="#workexp" data-toggle="tab" className="nav-link">Work Experience</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a href="#empinfo" data-target="#empinfo" data-toggle="tab" className="nav-link">Employment Information</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a href="#salary" data-target="#salary" data-toggle="tab" className="nav-link">Salary Breakup</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a href="#bank" data-target="#bank" data-toggle="tab" className="nav-link">Bank Details</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a href="#dependent" data-target="#dependent" data-toggle="tab" className="nav-link">Dependent Info</a>
                                                    </li>
                                                </ul>

                                                <div id="tabsJustifiedContent" className="tab-content py-1">
                                                    <div className="tab-pane fade active show" id="basicinfo">
                                                        <div className="list-group row"> 
                                                            <BasicInfo editId={editId}/>
                                                            <ContactInfo editId={editId}/>
                                                            <VisaInfo editId={editId}/>
                                                            <PassportInfo editId={editId}/>
                                                            <EmiratesId editId={editId}/> 
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="education">
                                                        <div className="row py-2">
                                                            <div className="col-sm-6"><University editId={editId}/></div>
                                                            <div className="col-sm-6"><Certification editId={editId}/> </div>
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="empinfo">
                                                        <div className="list-group row py-2">
                                                            <EmploymentInfo editId={editId}/>
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="workexp">
                                                        <div className="list-group row py-2">
                                                            <div className="col-sm-12">
                                                                <WorkExp editId={editId}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="salary">
                                                        <div className="list-group row py-2">
                                                            
                                                                <SalaryBreakup editId={editId}/>
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="bank">
                                                        <div className="list-group row py-2">
                                                            
                                                                <BankDetails editId={editId}/>
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="dependent">
                                                        <div className="list-group row py-2">
                                                            
                                                                <DependentInformation editId={editId}/>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                        </div>
        )
    }

}

export default withRouter(Personal);