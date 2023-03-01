import React from 'react';
import { connect } from "react-redux";
import { editData } from "../../action/editData";
import {Modal, Form, Button} from "react-bootstrap"
import config from "../../config/config";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
class ChangePasswordForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show:false, 
            data : [], 
            response:"",
            form:{
               email : ""
            },
            subDomain: "",
            organizations: "",
            organizationsCount: "",
            redirect: false
        }
      }
    
    static defaultProps = {
        formName: "changePasswordForm",
        method:"POST",
        submitBtnText: "Save",
        className: ""
    };
    
    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
        form: {
            ...this.state.form, [name]: value
        }
        })
        }
    
        componentDidMount(){
            if(this.props){
                this.state.form = this.props.data
              } else {
                this.state.form = this.state.form;
              }
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

        getOrganizationData = () => {
            axios.get(config.API_URL + '/organizations/list?domain='+this.state.subDomain)
                .then(r => {
                    this.setState({
                        organizations: r.data.organizations.rows[0],
                        organizationsCount: r.data.organizations.count,
                        
                    })
                })
                .catch((error) => {
                    console.log("API ERR:", error);
                    console.error(error);
                    // res.json({ error: error });
            })
      }
    
        handleSubmit = () => {
            let datas = this.state.form;
            datas.token = this.props.token;
            // alert('tatti')
            console.log(datas);
            var apiUrl = `${config.API_URL}/auth/reset-password`;
            // this.props.editData(datas, apiUrl, bearer)
            const headers = {
                "Content-Type": "application/json"
            }
            // const apiUrl = 'http://apihrmsuat.91wheels.com/api/auth/forgot-password';
            const bearer = '';
            axios.post(apiUrl, datas, {headers: headers})
            .then(res => {
                console.log('POST response',res);
                if(res.data.success){
                    toast.success(res.data.message);
                    setTimeout(function(){
                        toast.dismiss();
                        
                    },2000)
                    this.setState({redirect: true})
                }
                else{
                    toast.error(res.data.message);
                    setTimeout(function(){
                        toast.dismiss();
                        
                    },2000)
                }
                
                
            })
        }

        addDefaultSrc(ev){
            ev.target.src = config.DEFAULT_ORG_IMG_URL
        }
    
    render(){

        if (this.state.redirect) {
            window.location.href="/login";
         }

        const { data, show, editData, response} = this.state;
        const { formName, submitBtnText, className } = this.props;
        if(this.state.subDomain && !this.state.organizations){
            console.log("SubDomain", this.state.subDomain);
            this.getOrganizationData();
          }
      
          if (!this.state.organizations) {
            return null;
          }
        let urlToken = this.props.token;
        console.log('Params',urlToken);
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
            <Form onSubmit={event => {   event.preventDefault();        this.handleSubmit(this.state)      }}>
            <input type="hidden" name="token" value={urlToken} id="token" onChange={this.handleChange} />
                <div className="form-group">
                    <label htmlFor="inputPasswordNew">New Password</label>
                    <input type="password" name="newPassword" className="form-control" id="inputPasswordNew" onChange={this.handleChange} required="" />
                    {/* <span className="form-text small text-muted">
                        The password must be 8-20 characters, and must <em>not</em> contain spaces.
                    </span> */}
                </div>
                <div className="form-group">
                    <label htmlFor="inputPasswordNewVerify">Confirm Password</label>
                    <input type="password" name="verifyPassword" className="form-control"  id="inputPasswordNewVerify" onChange={this.handleChange} required="" />
                    <span className="form-text small text-muted">
                        To confirm, type the new password again.
                    </span>
                </div>
                <div className="form-group">
                <Button type="submit" variant="primary">
                            {submitBtnText}
                </Button>
                </div>
            </Form>
              {/* <a href="/forgot-password"> &nbsp; Forgot Password?</a> */}
              <div className="mt-3 text-right">POWERED BY <img src={config.VOW_FIRST_LOGO} alt="profile pic" className="navbar-brand p-0 m-0" /> </div> 
              </div>
              </div>
              </div>
        );
    }
}


const mapStateToProps = state => ({
    item: state.datas.item,
    error: state.datas.error,
    loading:state.datas.loading
  });
  
export default connect(mapStateToProps, {editData})(ChangePasswordForm);
