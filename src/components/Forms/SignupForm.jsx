import React from 'react';

class SignupForm extends React.Component{

    static defaultProps = {
        formName: "signupForm",
        method:"POST",
        labelName: "Username",
        labelEmail: "Email",
        labelPassword: "Password",
        labelVerifyPassword: "Verify",
        submitBtnText: "Register",
        className: ""
    };
    
    render(){
        const { formName, submitBtnText, labelName, labelEmail, labelPassword, labelVerifyPassword, method, className } = this.props;
        return (
            <form className={'form ' + className} autoComplete="off" id={formName} name={formName} noValidate="" method={method}>
                <div className="form-group">
                    <label htmlFor="inputSignupName">{labelName}</label>
                    <input type="text" className="form-control" id="inputSignupName" placeholder="" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputSignupEmail">{labelEmail}</label>
                    <input type="email" className="form-control" id="inputSignupEmail" placeholder="Email" required="" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputSignupPassword">{labelPassword}</label>
                    <input type="password" className="form-control" id="inputSignupPassword" placeholder="Password" required="" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputSignupVerify">{labelVerifyPassword}</label>
                    <input type="password" className="form-control" id="inputSignupVerify" placeholder="Password (again)" required="" />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-lg float-right">{submitBtnText}</button>
                </div>
            </form>
        );
    }
}

export default SignupForm;
