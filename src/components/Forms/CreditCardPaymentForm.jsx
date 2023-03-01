import React from 'react';

class CreditCardPaymentForm extends React.Component{

    static defaultProps = {
        formName: "ccForm",
        showResetBtn: true,
        submitBtnText: "Submit",
        className: ""
    };
    
    render(){
        const { formName, showResetBtn, submitBtnText, className } = this.props;
        return (
            <form className={'form ' + className} autoComplete="off" id={formName} name={formName} noValidate="" method="POST">
                <div className="form-group">
                    <label htmlFor="cc_name">Card Holder's Name</label>
                    <input type="text" className="form-control" id="cc_name" name="cc_name" pattern="\w+ \w+.*" title="First and last name" required="required" />
                </div>
                <div className="form-group">
                    <label htmlFor="cc_number">Card Number</label>
                    <input type="text" className="form-control" id="cc_number" name="cc_number" autoComplete="off" maxLength="20" pattern="\d{16}" title="Credit card number" required="" />
                </div>
                <div className="form-group row">
                    <label className="col-md-12">Card Exp. Date</label>
                    <div className="col-md-4">
                        <select className="form-control custom-select" name="cc_exp_mo" size="0">
                            <option defaultValue="01">01</option>
                            <option defaultValue="02">02</option>
                            <option defaultValue="03">03</option>
                            <option defaultValue="04">04</option>
                            <option defaultValue="05">05</option>
                            <option defaultValue="06">06</option>
                            <option defaultValue="07">07</option>
                            <option defaultValue="08">08</option>
                            <option defaultValue="09">09</option>
                            <option defaultValue="10">10</option>
                            <option defaultValue="11">11</option>
                            <option defaultValue="12">12</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className="form-control custom-select" name="cc_exp_yr" size="0">
                            <option>2019</option>
                            <option>2020</option>
                            <option>2021</option>
                            <option>2022</option>
                            <option>2023</option>
                            <option>2024</option>
                            <option>2025</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control" autoComplete="off" maxLength="3" pattern="\d{3}" title="Three digits at back of your card" required="" placeholder="CVC" />
                    </div>
                </div>
                <div className="row">
                    <label className="col-md-12">Amount</label>
                </div>
                <div className="form-inline">
                    <div className="input-group">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control text-right" id="exampleInputAmount" placeholder="39" />
                        <div className="input-group-append"><span className="input-group-text">.00</span></div>
                    </div>
                </div>
                <hr/>
                <div className="form-group row">
                    <div className="col-md-6">
                        {(showResetBtn)?
                        <button type="reset" className="btn btn-outline-primary btn-lg btn-block">Reset</button>:null}
                    </div>
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-primary btn-lg btn-block">{submitBtnText}</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default CreditCardPaymentForm;
