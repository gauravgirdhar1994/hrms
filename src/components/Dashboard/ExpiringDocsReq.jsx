/* 
    Date:25-05-2020
Author:Manoj Kalra
 */
import React, { Component } from 'react';
import moment from 'moment';
import config from '../../config/config';
var CryptoJS = require("crypto-js");
class ExpiringDocsReq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expiringDocuments: this.props.expiringDocuments, mol: [], visa: [], passport: [],
            molActive: 'active', passportActive: '', visaActive: '', molShow: 'show', passportShow: '', visaShow: ''
        }
        this.getMol = this.getMol.bind(this);
        this.getVisa = this.getVisa.bind(this);
        this.getPassport = this.getPassport.bind(this);

    }
    enc(plainText) {
        var b64 = CryptoJS.AES.encrypt(plainText, config.secret_key).toString();
        var e64 = CryptoJS.enc.Base64.parse(b64);
        var eHex = e64.toString(CryptoJS.enc.Hex);
        return eHex;
    }
    getMol() {
        var items = [];
        if ((this.state.expiringDocuments) && (this.state.expiringDocuments.Mol !== null) && (this.state.expiringDocuments.Mol).length > 0) {
            (this.state.expiringDocuments.Mol).map(obj => obj !== null ?
                items.push(<div className="d-flex align-items-center border border-top-0 border-right-0 border-left-0 mb-1 mt-1">
                    <div className="col-sm-1 col-10 mx-auto px-1">
                    <img className="rounded-circle img-fluid mx-auto d-block" alt="Avatar" src={config.BASE_URL + obj.profilePic} onError={this.addDefaultSrc} />
                    </div>
                    <div className="col p-1">
                        {/*<button type="button" className="btn btn-sm btn-outline-danger  ml-2 float-right">Wish</button>*/}
                        <a href={'/my-info/edit/' + this.enc(obj.empId.toString())}>
                        <h6 className="m-0 ml-3 blue1 font-16">
                            {obj.empName} <span className="text-black-50 small font-16">{obj.position ? '(' + obj.position + ')' : ''}</span>
                        </h6>
                        </a>
                        <p className="m-0 ml-3 blue2 font-10">Employee ID - {(obj.empCode) ? obj.empCode : 'N/A'} | Emirates ID - {(obj.emiratesId) ? obj.emiratesId : 'N/A'} | <span className="text-danger">Expiry - {(obj.emirateExpiryDate) ? moment(new Date(obj.emirateExpiryDate)).format(config.DATE_FORMAT) : 'N/A'}</span></p>
                    </div>
                </div>) : 'No Document Found'
            )
            this.state.mol = items;
        }
        else {
            this.state.molActive = '';
            this.state.molShow = '';
        }

    }
    getVisa() {
        var items = [];
        if ((this.state.expiringDocuments) && (this.state.expiringDocuments.visa !== null) && (this.state.expiringDocuments.visa).length > 0) {
            (this.state.expiringDocuments.visa).map(obj => obj !== null ?
                items.push(<div className="d-flex align-items-center border border-top-0 border-right-0 border-left-0 mb-1 mt-1">
                    <div className="col-sm-1 col-10 mx-auto px-1">
                    <img className="rounded-circle img-fluid mx-auto d-block" alt="Avatar" src={config.BASE_URL + obj.profilePic} onError={this.addDefaultSrc} />
                    </div>
                    <div className="col p-1">
                    <a href={'/my-info/edit/' + this.enc(obj.empId.toString())}>
                        <h6 className="m-0 ml-3 blue1 font-16">
                            {obj.empName} <span className="text-black-50 small font-16">{obj.position ? '(' + obj.position + ')' : ''}</span>
                        </h6>
                        </a>
                        <p className="m-0 ml-3 blue2 font-10">Employee ID - {(obj.empCode) ? obj.empCode : 'N/A'} | Visa ID - {obj.visasId ? obj.visasId : 'N/A'} | <span className="text-danger">Expiry - {obj.visaExpiryDate ? moment(new Date(obj.visaExpiryDate)).format(config.DATE_FORMAT) : 'N/A'}</span></p>
                    </div>
                </div>) : 'No Document Found'
            )
            this.state.visa = items;
            if ((this.state.expiringDocuments) && ((this.state.expiringDocuments.Mol == null) || (this.state.expiringDocuments.Mol).length <= 0)) {
                this.state.visaActive = 'active';
                this.state.visaShow = 'show';
            }

        }
        else {
            this.state.visaActive = '';
            this.state.visaShow = '';
        }

    }

    addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_USER_IMG_URL
    }

    getPassport() {
        var items = [];
        if ((this.state.expiringDocuments) && (this.state.expiringDocuments.passport !== null) && (this.state.expiringDocuments.passport).length > 0) {
            (this.state.expiringDocuments.passport).map(obj => obj !== null ?
                items.push(<div className="d-flex align-items-center border border-top-0 border-right-0 border-left-0 mb-1 mt-1">
                    <div className="col-sm-1 col-10 mx-auto px-1">
                        <img className="rounded-circle img-fluid mx-auto d-block" alt="Avatar" src={config.BASE_URL + obj.profilePic} onError={this.addDefaultSrc} />
                        {/* <img className="rounded-circle img-fluid mx-auto d-block" src="assets/profile_3.png" alt="Avatar" /> */}
                    </div>
                    <div className="col p-1">
                    <a href={'/my-info/edit/' + this.enc(obj.empId.toString())}>
                        <h6 className="m-0 ml-3 blue1 font-16">
                            {obj.empName} <span className="text-black-50 small font-16">{obj.position ? '(' + obj.position + ')' : ''}</span>
                        </h6>
                        </a>
                        <p className="m-0 ml-3 blue2 font-10">Employee ID - {(obj.empCode) ? obj.empCode : 'N/A'} | Passport Number -  {obj.passportNumber ? obj.passportNumber : 'N/A'} | <span className="text-danger">Expiry - {obj.passportExpiryDate ? moment(new Date(obj.passportExpiryDate)).format(config.DATE_FORMAT) : 'N/A'}</span></p>
                    </div>
                </div>) : 'No Document Found')
            this.state.passport = items;
            if ((this.state.expiringDocuments) && ((this.state.expiringDocuments.Mol == null) || (this.state.expiringDocuments.Mol).length <= 0) && ((this.state.expiringDocuments.visa == null) || (this.state.expiringDocuments.visa).length <= 0)) {
                this.state.passportActive = 'active';
                this.state.passportShow = 'show';
            }
        }
        else {
            this.state.passportActive = '';
            this.state.passportShow = '';
        }

    }

    render() {
        console.log('render edr', this.state)
        this.state.expiringDocuments = this.props.expiringDocuments;

        this.getMol();
        this.getVisa();
        this.getPassport();
        //console.log('render edr state',this.state)

        return (
            <div className="card d-block p-xl-3 p-2  h-100 shadow-sm">
                <h4 className="mb-4 font-16 pl-3">Expiring Documents</h4>
                <div className="col-lg-12">
                    <ul id="tabsJustified" className="nav nav-tabs nav-fill bg-magenta rounded-sm">
                        {(this.state.mol && this.state.mol.length > 0) ? <li className="nav-item">
                            <a href="#home1" data-target="#home1" data-toggle="tab" className={"nav-link " + this.state.molActive}>Emirates Id</a>
                        </li> : ''}
                        {(this.state.visa && this.state.visa.length > 0) ? <li className="nav-item">
                            <a href="#profile1" data-target="#profile1" data-toggle="tab" className={"nav-link " + this.state.visaActive}>Visa</a>
                        </li> : ''}
                        {(this.state.passport && this.state.passport.length > 0) ? <li className="nav-item">
                            <a href="#messages1" data-target="#messages1" data-toggle="tab" className={"nav-link " + this.state.passportActive}>Passport</a>
                        </li> : ''}
                    </ul>
                    <div id="tabsJustifiedContent" className="tab-content py-1">
                        <div className={"tab-pane fade " + this.state.molActive + ' ' + this.state.molShow} id="home1">
                            <div className="list-group">
                                {this.state.mol}
                            </div>
                            {/* <p className="text-center m-0">View All</p>*/}
                        </div>
                        <div className={"tab-pane fade " + this.state.visaActive + ' ' + this.state.visaShow} id="profile1">
                            {this.state.visa}
                        </div>
                        <div className={"tab-pane fade " + this.state.passportActive + ' ' + this.state.passportShow} id="messages1">
                            {this.state.passport}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ExpiringDocsReq;