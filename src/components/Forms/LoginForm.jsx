import React from "react";
import { Redirect } from "react-router-dom";
import config from "../../config/config";
import { Modal, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';

let BaseURL = "http://apihrmsuat.91wheels.com/api/login";

class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      subDomain: "",
      organizations: "",
      organizationsCount: "",
      firstLogin: false,
      redirectToReferrer: false,
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  login = async () => {
    var url = `${config.API_URL}/login`;
    // var url = 'http://apihrmsuat.91wheels.com/api/login';
    // console.log(url);
    var loginData = {
      username: this.state.username,
      password: this.state.password,
      orgId: (this.state.organizationsCount > 0)?this.state.organizations.id:0 
    };
    // console.log("Login Data", JSON.stringify(loginData));
    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.text())
      .then(async (result) => {
        console.log('Login result', result);
        result = JSON.parse(result);
        if (result.success) {
          //this.loginSuccess(result);
          console.log('Current Org',result.currOrg);
          localStorage.setItem("userData", result.token);
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("employeeId", result.currUser);
          localStorage.setItem("orgId", result.currOrg);
          localStorage.setItem("role", result.currRole);
          localStorage.setItem("roleSlug", result.currRoleSlug);
          localStorage.setItem("menuRecord", JSON.stringify(result.menuData));
          this.setState({firstLogin: result.firstLogin});
          if(result.currOrg == "0"){
            console.log('Current Org',result.currOrg);
            localStorage.setItem("orgLogo", config.VOW_FIRST_LOGO);
          }
          else {
                  console.log('orgLogo', result.orgData.logo);
            localStorage.setItem("orgLogo", config.BASE_URL+result.orgData.logo);
          }
          this.setState({ redirectToReferrer: true });
        }
        const toasts = result.Message;
        toast.error(result.Message);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getOrganizationData = () => {
        axios.get(config.API_URL + '/organizations/list?domain='+this.state.subDomain)
          .then(r => {
                this.setState({
                  organizations: r.data.organizations ? r.data.organizations.rows[0] : '404',
                    organizationsCount: r.data.organizations.count,
                    
                })
            })
            .catch((error) => {
                console.log("API ERR:", error);
                console.error(error);
                // res.json({ error: error });
        })
  }

  componentDidMount() {
    let host = window.location.host;
    let protocol = window.location.protocol;
    let parts = host.split(".");
    let subdomain = "";
    let partsLength = "";
    // If we get more than 3 parts, then we have a subdomain
    // INFO: This could be 4, if you have a co.uk TLD or something like that.
    if(parts[0] === 'localhost' || parts[1] === 'localhost'){
      partsLength = 3;
    }
    if(parts[0] === config.DEFAULT_DOMAIN || parts[1] === config.DEFAULT_DOMAIN){
      partsLength = 4;
    }
    console.log(parts);
    if (parts.length >= partsLength) {
      subdomain = parts[0];
      // Remove the subdomain from the parts list
      parts.splice(0, 1);
      
      this.setState({ subDomain: subdomain });
    }
    else{
      subdomain = config.DEFAULT_DOMAIN;

      this.setState({ subDomain: subdomain, organizations: {id: 0, logo: config.VOW_FIRST_LOGO} });

    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addDefaultSrc(ev){
    ev.target.src = config.DEFAULT_ORG_IMG_URL
  }

  render() {

    var styles = {
      display: "flex",
      maxWidth: "768px",
      margin: "10.75rem auto",
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
    }

    console.log('Login Data', this.state.organizations);
    if (this.state.redirectToReferrer) {
      if (localStorage.getItem("roleslug").match('broker-admin')) {
          window.location.href = "/organizations";
      } else {
        if(this.state.firstLogin){
          window.location.href = "/settings";
        }
        else{
          window.location.href = "/dashboard";
        }
      }
    }

    if (localStorage.getItem("userData")) {
      if (localStorage.getItem("roleSlug").match('broker-primary')) {
        window.location.href = "/tickets/my-tickets";
      } else {
        if(this.state.firstLogin){
          window.location.href = "/settings";
        }
        else{
          window.location.href = "/dashboard";
        }
      }
    }

    if (this.state.organizations === undefined) {

    }
    else {
      if (this.state.subDomain && !this.state.organizations) {
        console.log("SubDomain", this.state.subDomain);
        this.getOrganizationData();
      }
    }


    if (!this.state.organizations) {
      return null;
    }

    return (
      <div className="row h-100" id="Body" className="loginForm">
        <div className="mx-auto my-auto text-center">
        
          <div className="card d-block p-1 shadow-sm pt-4 pl-5 pr-5 pb-4 text-left loginBox">
            <ToastContainer />
            <img
                src={this.state.organizations.id != 0 ? config.BASE_URL+this.state.organizations.logo : config.VOW_FIRST_LOGO}
                alt="profile pic"
                width="300"
                className="navbar-brand p-0 mx-auto d-block mb-3"
                onError={this.addDefaultSrc}
            />
            {this.state.organizations.id == 0 ? (
              <Form
              onSubmit={(event) => {
                event.preventDefault();
                this.login();
              }}
            >
              <div className="medium-5 columns left">
              
                <h4 style={{ fontWeight: 600, fontSize: "16px" }}>
                  Sign in with your organizational account
                </h4>
                <div className="form-group">
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    style={{ padding: "1.75rem 0.75rem" }}
                    placeholder="Username"
                    onChange={this.onChange}onError={this.addDefaultSrc}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    style={{ padding: "1.75rem 0.75rem" }}
                    placeholder="Password"
                    onChange={this.onChange}
                  />
                </div>
                <Button type="submit" variant="primary">
                  Login
                </Button>
                {/* <input type="submit" className="btn btn-primary" defaultValue="Login" onClick={this.login}/> */}
                <a href="/forgot-password"> &nbsp; Forgot Password?</a>
                <div className="mt-3 text-right">
                  POWERED BY{" "}
                  <img
                    src="assets/logo.png"
                    alt="profile pic"
                    className="navbar-brand p-0 m-0"
                  />{" "}
                </div>
              </div>
            </Form>
            ) : 
            this.state.organizations.status ? (
                <Form
                onSubmit={(event) => {
                  event.preventDefault();
                  this.login();
                }}
              >
                <div className="medium-5 columns left">
                
                  <h4 style={{ fontWeight: 600, fontSize: "16px" }}>
                    Sign in with your organizational account
                  </h4>
                  <div className="form-group">
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      style={{ padding: "1.75rem 0.75rem" }}
                      placeholder="Username"
                      onChange={this.onChange}onError={this.addDefaultSrc}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      style={{ padding: "1.75rem 0.75rem" }}
                      placeholder="Password"
                      onChange={this.onChange}
                    />
                  </div>
                  <Button type="submit" variant="primary">
                    Login
                  </Button>
                  {/* <input type="submit" className="btn btn-primary" defaultValue="Login" onClick={this.login}/> */}
                  <a href="/forgot-password"> &nbsp; Forgot Password?</a>
                  <div className="mt-3 text-right">
                    POWERED BY{" "}
                    <img
                      src="assets/logo.png"
                      alt="profile pic"
                      className="navbar-brand p-0 m-0"
                    />{" "}
                  </div>
                </div>
              </Form>
            ): (
              <p className="font-32 text-danger text-center InactiveMsg">The organization is currently Inactive. Please contact your administrator.</p>
            )}
            
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
