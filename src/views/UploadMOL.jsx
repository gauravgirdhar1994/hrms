import React, { Component } from 'react';
import { Row, Col, Card, Table, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import config from '../config/config';
import axios from 'axios';

class AcceptOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
           acceptOffer : '',
           subDomain: '',
           organizations: "",
           organizationsCount: "",
           show: false,
           selectedFile : '',
           letterUploaded: false,
           empData: [],
           reason: ''
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

    componentDidMount(){
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

        this.setState({ subDomain: subdomain, organizations: {id: 0, orgImage: config.VOW_FIRST_LOGO} });

        }
        const search =this.props.location.search;
        const params = new URLSearchParams(search);
        // const authority = params.get('authority'); //

        const apiUrl = config.API_URL + '/employee/onboarding/personalData/'+params.get('id');
        
        var bearer = '';
        
        const headers = {
        "Authorization": bearer,
        "Content-Type": "application/json"
        }
        
        axios.get(apiUrl, { headers: headers })
        .then(res => {
            // console.log('POST response',res);
            this.setState({empData: res.data.empData})
        })
    }

    addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_ORG_IMG_URL
    }
    
    uploadOfferLetter = () => {
        this.setState({show: true})
    }

    handleClose = () => {
        this.setState({show: false})
    }

    handleChange = (event) => {
        this.setState({reason: event.target.value})
    }

    uploadFile = (event) => {
        const search =this.props.location.search;
        const params = new URLSearchParams(search);
        let data = {};
        data.empId = params.get('id');

        var bearer = '';

        const headers = {
            "Authorization": bearer
        };

        this.state.selectedFile = event.target.files[0];
        // Details of the uploaded file 
        console.log('Selected file', this.state.organizations);

        const formData = new FormData();

        // Update the formData object 
        formData.append(
            'file',
            this.state.selectedFile
        );

        formData.append('employeeId', data.empId);
        formData.append('orgId', this.state.organizations.id);
        formData.append('documentType',22);
        // Request made to the backend api 
        // Send formData object 
        axios.post(config.API_URL + "/employee/document/add", formData, { headers: headers }).then(res => {
            // console.log('POST response', res);
            if (res.data.success) {
                // this.refreshData();
                toast.success(res.data.message);
                setTimeout(function () {
                    toast.dismiss()
                }, 2000)
                this.setState({ show: false, letterUploaded: true })
            }
            else {
                this.refreshData();
                toast.error(res.data.message);
                setTimeout(function () {
                    toast.dismiss()
                }, 2000)
                // this.setState({ errorFilePath: res.data.filePath })
            }

        });
    }
    
    render() {

        if(this.state.subDomain && !this.state.organizations){
            console.log("SubDomain", this.state.subDomain);
            this.getOrganizationData();
        }
        return(
        <React.Fragment>
            <ToastContainer></ToastContainer>
        
            <>
            <div className="">
                <img src={this.state.organizations ? config.BASE_URL + this.state.organizations.orgImage : ''} onError={this.addDefaultSrc} width="200" styles={{padding:'10px'}} className="img-fluid"></img>
            </div>

            
                <div className="container-fluid py-4 text-center bg-blue mb-3">
                    <h4 className="font-weight-bold mb-0 font-30 pl-3"><strong>Upload Signed MOL Contract</strong></h4>
                </div>

                <div className="card container topFilter d-block pl-4 pr-4 pt-3 pb-3 py-4 br-3 mb-4 mt-4 text-center shadow-sm">
                    <p className="font-16 text-left">Hi {this.state.empData.firstname} {this.state.empData.lastname},</p>
                    <p className="font-16 text-left">Please upload the signed copy of the MOL contract sent to you over the email for further process of your onboarding to the organization, </p>
                     {!this.state.letterUploaded ? ( <button className="btn btn-primary btn-md mt-3 font-16 text-white" onClick={this.uploadOfferLetter}>Upload signed MOL Contact</button>) : ''}
                </div>
               
                   
            
            </>
        

        <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select File to Upload</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {/* <label>Upload CSV File</label> */}
                        <span className="text-center">
                            <label htmlFor="uploadId" className="squireUpload">
                                <small className="font-20">Upload Signed MOL Contract</small>
                                <input type="file" ref="file" name="logo" id="uploadId" onChange={this.uploadFile} />
                            </label>
                        </span>
                    </Modal.Body>
                </Modal>
        </React.Fragment>
        )      
    }
}

export default AcceptOffer;