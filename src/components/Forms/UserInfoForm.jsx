import React from 'react';

class UserInfoForm extends React.Component{

    static defaultProps = {
        formName: "userInfoForm",
        submitBtnText: "Save Changes",
        showResetBtn: true,
        method: "POST",
        className: ""
    };
    
    render(){
        const { formName, showResetBtn, submitBtnText, method, className } = this.props;
        return (
            <form className={'form ' + className} autoComplete="off" id={formName} name={formName} noValidate="" method={method}>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">First name</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="text" defaultValue="" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Last name</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="text" defaultValue="" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Email</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="email" defaultValue="" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Company</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="text" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Website</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="url" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Time Zone</label>
                    <div className="col-lg-9">
                        <select id="user_time_zone" className="form-control custom-select" size="0">
                            <option defaultValue="Hawaii">(GMT-10:00) Hawaii</option>
                            <option defaultValue="Alaska">(GMT-09:00) Alaska</option>
                            <option defaultValue="Pacific Time (US &amp; Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                            <option defaultValue="Arizona">(GMT-07:00) Arizona</option>
                            <option defaultValue="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
                            <option defaultValue="Central Time (US &amp; Canada)">(GMT-06:00) Central Time (US &amp; Canada)</option>
                            <option defaultValue="Eastern Time (US &amp; Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                            <option defaultValue="Indiana (East)">(GMT-05:00) Indiana (East)</option>
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Username</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="text" defaultValue="" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Password</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="password" defaultValue="" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label">Confirm</label>
                    <div className="col-lg-9">
                        <input className="form-control" type="password" defaultValue="" />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-lg-3 col-form-label form-control-label"></label>
                    <div className="col-lg-9">
                        {(showResetBtn)?
                        <input type="reset" className="btn btn-secondary mr-2" defaultValue="Cancel" />:null}
                        <input type="button" className="btn btn-primary" value={submitBtnText} />
                    </div>
                </div>
            </form>
        );
    }
}

export default UserInfoForm;
