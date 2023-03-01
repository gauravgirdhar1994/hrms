import React from 'react';
import { Wrapper } from '../components';
import { LoginForm, SignupForm, ChangePasswordForm, ResetPasswordForm, CreditCardPaymentForm, UserInfoForm, ContactForm } from '../components/Forms';

class FormsView extends React.Component{
    render(){
        return (
            <Wrapper>
                <div className="row mx-0 mb-2">
                    <div className="col-md-6 offset-md-3 py-3">
                        <span className="anchor" id="formLogin"></span>
                        <div className="card card-outline-secondary shadow-sm">
                            <div className="card-header">
                                <h3 className="mb-0">Login</h3>
                            </div>
                            <div className="card-body">
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 offset-md-3 py-3">
                        <span className="anchor" id="formRegister"></span>
                        <div className="my-4" />
                        <div className="card card-outline-secondary shadow-sm">
                            <div className="card-header">
                                <h3 className="mb-0">Sign Up</h3>
                            </div>
                            <div className="card-body">
                                <SignupForm />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 offset-md-3 py-3">
                        <span className="anchor" id="formChangePassword"></span>
                        <div className="my-4" />

                        <div className="card card-outline-secondary shadow-sm">
                            <div className="card-header">
                                <h3 className="mb-0">Change Password</h3>
                            </div>
                            <div className="card-body">
                                <ChangePasswordForm />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 offset-md-3 py-3">
                        <span className="anchor" id="formResetPassword"></span>
                        <div className="my-4" />
    
                        <div className="card card-outline-secondary shadow-sm">
                            <div className="card-header">
                                <h3 className="mb-0">Password Reset</h3>
                            </div>
                            <div className="card-body">
                                <ResetPasswordForm /> 
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 offset-md-3 py-3">
                        <span className="anchor" id="formPayment"></span>
                        <div className="my-4" />
                        <div className="card card-outline-secondary shadow-sm">
                            <div className="card-body">
                                <h3 className="text-center">Credit Card Payment</h3>
                                <hr/>
                                <div className="alert alert-info">
                                    <button className="btn btn-link close font-weight-normal initialism" data-dismiss="alert"><small className="align-text-top font-weight-light">&times;</small></button> 
                                    CVC code is required.
                                </div>
                                <CreditCardPaymentForm />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 offset-md-2 py-3">
                        <span className="anchor" id="formUserEdit"></span>
                        <div className="my-4" />

                        <div className="card card-outline-secondary shadow-sm">
                            <div className="card-header">
                                <h3 className="mb-0">User Information</h3>
                            </div>
                            <div className="card-body">
                                <UserInfoForm />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 offset-md-3 py-3">
                        <span className="anchor" id="formContact"></span>
                        <div className="my-4" />
                        <div className="card card-outline-secondary shadow-sm">
                            <div className="card-header">
                                <h3 className="mb-0">Contact</h3>
                            </div>
                            <div className="card-body">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 mx-auto py-4">
                        <span className="anchor" id="formComplex"></span>
                        <div className="my-4" />
                        <h3>Complex Form Example </h3>
                        
                        <div className="row mt-4">
                            <div className="col-sm-5 pb-3">
                                <label htmlFor="exampleAccount">Account #</label>
                                <input type="text" className="form-control" id="exampleAccount" placeholder="XXXXXXXXXXXXXXXX" />
                            </div>
                            <div className="col-sm-3 pb-3">
                                <label htmlFor="exampleCtrl">Control #</label>
                                <input type="text" className="form-control" id="exampleCtrl" placeholder="0000" />
                            </div>
                            <div className="col-sm-4 pb-3">
                                <label htmlFor="exampleAmount">Amount</label>
                                <div className="input-group">
                                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                                    <input type="text" className="form-control" id="exampleAmount" placeholder="Amount" />
                                </div>
                            </div>
                            <div className="col-sm-6 pb-3">
                                <label htmlFor="exampleFirst">First Name</label>
                                <input type="text" className="form-control" id="exampleFirst" />
                            </div>
                            <div className="col-sm-6 pb-3">
                                <label htmlFor="exampleLast">Last Name</label>
                                <input type="text" className="form-control" id="exampleLast" />
                            </div>
                            <div className="col-sm-6 pb-3">
                                <label htmlFor="exampleCity">City</label>
                                <input type="text" className="form-control" id="exampleCity" />
                            </div>
                            <div className="col-sm-3 pb-3">
                                <label htmlFor="exampleSt">State</label>
                                <select className="form-control custom-select" id="exampleSt">
                                    <option>Pick a state</option>
                                </select>
                            </div>
                            <div className="col-sm-3 pb-3">
                                <label htmlFor="exampleZip">Postal Code</label>
                                <input type="text" className="form-control" id="exampleZip" />
                            </div>
                            <div className="col-md-6 pb-3">
                                <label htmlFor="exampleAccount">Color</label>
                                <div className="form-group small">
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="option1" /> Blue
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option2" /> Red
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline disabled">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" defaultValue="option3" disabled="" /> Green
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option4" /> Yellow
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option5" /> Black
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option6" /> Orange
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 pb-3">
                                <label htmlFor="exampleMessage">Message</label>
                                <textarea className="form-control" id="exampleMessage"></textarea>
                                <small className="text-info">
                                  Add the packaging note here.
                                </small>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="name">Generated Id</label>
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" name="gid" id="gid" />
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="name">Date Assigned</label>
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" name="da" id="da" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 mx-auto">
                        <div className="my-4" />
                    </div> 
                </div>
            </Wrapper>
        );
    }
}

export default FormsView;