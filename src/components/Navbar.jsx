import React from 'react';
import { Redirect } from 'react-router-dom';
import config from '../config/config';
import { Modal, Form, Button, ModalFooter } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import validator from 'validator';

const BEARER_TOKEN = localStorage.getItem("userData");

class Navbar extends React.Component {

  constructor() {
    super();

    this.state = {
      redirectToReferrer: false,
      data: '',
      token: localStorage.getItem("userData"),
      role: localStorage.getItem("roleSlug"),
      show: false,
      mShow: false,
      form: {},
      msg: false,

    };

    this.logout = this.logout.bind(this);
    // this.onChange = this.onChange.bind(this);

  }


  logout = async () => {
    var url = `${config.API_URL}/logout`;
    // var url = 'http://apihrmsuat.91wheels.com/api/login';
    console.log(url);
    var loginData = { "userId": localStorage.getItem("employeeId") };
    console.log('Login Data', JSON.stringify(loginData));
    await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    })
      .then(
        (response) => response.text()
      )
      .then(async (result) => {
        console.log(result);
        result = JSON.parse(result)
        if (result.success) {
          //this.loginSuccess(result);
          // console.log(result.menuData);
          localStorage.removeItem('userData');
          localStorage.removeItem('employeeId');
          localStorage.removeItem('menuRecord');
          localStorage.removeItem('editEmployee');
          this.setState({ redirectToReferrer: true });
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  componentDidMount() {
    var bearer = 'Bearer ' + this.state.token;
    const apiUrl = config.API_URL + '/employee/view/' + localStorage.getItem("employeeId");

    axios.get(apiUrl, { headers: { Authorization: bearer } })
      .then(r => {
        console.log('APi data', r.data);
        this.setState({ data: r.data.personal })
        if (this.state.data.firstLogin === 0) {
          this.setState({ show: true })
          const url = config.API_URL + '/employee/update/view/' + localStorage.getItem("employeeId");
          axios.get(url, { headers: { Authorization: bearer } })
            .then(res => { console.log("result", res) })
        }
      })
      .catch((error) => {
        console.log("API ERR: ", error);
        console.error(error);
        // res.json({ error: error });
      });

  }

  addDefaultSrc(ev) {
    ev.target.src = config.DEFAULT_ORG_IMG_URL
  }
  mHandleShow = () => {
    console.log('close button')
    this.setState({ mShow: true })
  };

  mHandleClose = () => {
    console.log('close button')
    this.setState({ mShow: false })
  };
  mHandleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      form: {
        ...this.state.form, [name]: value
      }

    })
    // console.warn(this.state.form.newPassword);
  }
  handleShow = () => {
    console.log('close button')
    this.setState({ show: true })
  };

  handleClose = () => {
    console.log('close button')
    this.setState({ show: false })
  };
  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      form: {
        ...this.state.form, [name]: value
      }

    })
    // console.warn(this.state.form.newPassword);
  }
  mHandleSubmit = () => {
    let datas = this.state.form;
    // datas.email = this.state.data.email;
    // datas.empId = this.state.data.id;
    // datas.orgId = this.state.data.orgId;
    let value = this.state.form.newPassword;
    // // alert('tatti')
    // console.warn(datas.oldPassword);
    var apiUrl = `${config.API_URL}/auth/change-master-password`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": 'bearer ' + BEARER_TOKEN,
    };
    if (!!value && !!datas.oldPassword && validator.isStrongPassword(value, {
      minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      axios.post(apiUrl, datas, { headers: headers })
        .then(res => {
          console.log('POST response', res);
          if (res.data.success) {
            this.state.msg = true;
            document.getElementById('text').innerHTML = res.data.message;
            document.getElementById('text').innerHTML = '';
            this.setState({ mShow: false });

      logout = async () => {
        var url = `${config.API_URL}/logout`; 
        // var url = 'http://apihrmsuat.91wheels.com/api/login';
        console.log(url);
        var loginData = {"userId": localStorage.getItem("employeeId")};
        console.log('Login Data', JSON.stringify(loginData));
        await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        })
        .then(
          (response) => response.text()
        )
        .then(async (result) => {
          console.log(result);
          result = JSON.parse(result)
          if(result.success){
            //this.loginSuccess(result);
            // console.log(result.menuData);
            localStorage.removeItem('userData');
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('employeeId');
            localStorage.removeItem('menuRecord');
            localStorage.removeItem('editEmployee');
            localStorage.removeItem('salaryProcessMonth');
            this.setState({redirectToReferrer: true});
          }
          // else {
          //   this.state.msg = false;
          //   document.getElementById('text').innerHTML = res.data.message;
          //   setTimeout(function () {
          //     document.getElementById('text').innerHTML = '';

          //   }, 2000)
          // }


        })
    }
  }
  handleSubmit = () => {
    let datas = this.state.form;
    datas.email = this.state.data.email;
    datas.empId = this.state.data.id;
    datas.orgId = this.state.data.orgId;
    let value = this.state.form.newPassword;
    // // alert('tatti')
    // console.warn(datas.oldPassword);
    var apiUrl = `${config.API_URL}/auth/change-password`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": 'bearer ' + BEARER_TOKEN,
    };
    if (!!value && !!datas.oldPassword && validator.isStrongPassword(value, {
      minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      axios.post(apiUrl, datas, { headers: headers })
        .then(res => {
          console.log('POST response', res);
          if (res.data.success) {
            this.state.msg = true;
            document.getElementById('text').innerHTML = res.data.message;
            document.getElementById('text').innerHTML = '';
            this.setState({ show: false });

          }
          else {
            this.state.msg = false;
            document.getElementById('text').innerHTML = res.data.message;
            setTimeout(function () {
              document.getElementById('text').innerHTML = '';

            }, 2000)
          }


        })
    } else {
      this.state.msg = false;
      document.getElementById('text').innerHTML = 'Is Not Strong or Empty Password';
      setTimeout(function () {
        document.getElementById('text').innerHTML = '';
      }, 2000)
    }
  }

  render() {
    // const {item} = this.props.item;
    // console.log('Personal Data', this.state.data);
    if (this.state.redirectToReferrer) {
      return (<Redirect to={'/login'} />)
    }
    return (
      <>

        <nav className="navbar navbar-white navbar-expand px-lg-1">

          <button data-toggle="collapse" data-target=".sidebar-collapse" className="navbar-brand p-0 btn btn-link menu-btn-2" title="Toggle sidebar">
            <span className="h4 align-middle mb-0"><span className="lnr lnr-menu"></span></span>
          </button>
          <div className="brandLogo text-center">
            <img src={localStorage.getItem('orgLogo')} onError={this.addDefaultSrc} width="150" height="75" alt="profile pic" className="navbar-brand p-0 logo-2" />
          </div>
          {/* <button className="btn btn-link navbar-brand p-0" type="button" title="Home" data-toggle="dropdown">Vow First </button> */}
          <div className="dropdown-menu text-uppercase animate-grow-in">
            <a className="dropdown-item px-3" href="../" target="_new">Home</a>
            <a className="dropdown-item px-3" href="../static" target="_new">jQuery version</a>
            <a className="dropdown-item px-3 active" href="../react" target="_new">React version</a>
            <a className="dropdown-item px-3" href="../vue" target="_new">Vue version</a>
          </div>
          <ul className="navbar-nav ml-auto">
            {/* <li className="nav-item"><a  href="javascript:void(0)"><i className="icon-bell icons align-middle mr-1 mr-4 color-red"></i></a></li>
                <li className="nav-item"><a  href="javascript:void(0)"><i className="icon-calendar icons align-middle mr-1 mr-4 color-red"></i></a></li> */}
            <li className="nav-item dropdown profile-dropdown d-flex">
              <a className="py-0 text-truncate pr-3" href="javascript:void(0)" data-toggle="dropdown">
                <i className="icon-user profile-icon icons align-middle mr-1"></i>


                {this.state.data ? (<span className="text-blue font-13 ml-6">{this.state.data.firstname} {this.state.data.lastname}</span>) : ''}
                {this.state.data ? (<span className="font-12 mt-2 ml-6">{this.state.data.position}</span>) : ''}
              </a>

              <div className="dropdown-menu dropdown-menu-right animate-grow-in text-uppercase mt-2" aria-labelledby="dropdownMenu1">
                {this.state.role != 'broker-admin' && this.state.role != 'broker-primary' ? (
                  <a className="dropdown-item px-3" href="/my-info/personal"><span className="lnr lnr-user"></span> Profile</a>) : (this.state.data.id == 1) ? <a className="dropdown-item px-3" href="javascript:void();" onClick={this.mHandleShow}><span className="lnr lnr-pencil"></span> Change Master Password</a> : ''}
                {/* <a className="dropdown-item px-3" href="./inbox">
                                <span className="lnr lnr-inbox"></span> Inbox <span className="badge badge-primary badge-pill font-weight-light align-middle mb-1 p-1" title="notify count">3</span>
                            </a> */}
                <div className="dropdown-divider"></div>
                <a className="dropdown-item px-3" href="javascript:void();" onClick={this.handleShow}><span className="lnr lnr-pencil"></span> Change Password</a>

                <div className="dropdown-divider"></div>
                <a className="dropdown-item px-3" href="javascript:void();" onClick={this.logout}><span className="lnr lnr-exit"></span> Logout</a>
              </div>

            </li>
          </ul>
        </nav>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Change {this.state.data.firstLogin == 0 ? 'Default' : ''} Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={event => { event.preventDefault(); this.handleSubmit(this.state) }}>

              <div className="form-group">
                <label htmlFor="inputPasswordOld">Old Password</label>
                <input type="text" name="oldPassword" className="form-control" id="inputPasswordOld" onChange={this.handleChange} required="" />
              </div>
              <div className="form-group">
                <label htmlFor="inputPasswordNew">New Password</label>
                <input type="password" name="newPassword" className="form-control" id="inputPasswordNew" onChange={this.handleChange} required="" />
                <span className="form-text small text-muted">
                  Atleast : Length: 6, Lowercase: 1, Uppercase: 1, Numbers: 1, Symbols: 1
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="inputPasswordNewVerify">Confirm Password</label>
                <input type="password" name="verifyPassword" className="form-control" id="inputPasswordNewVerify" onChange={this.handleChange} required="" />
                <span className="form-text small text-muted">
                  To confirm, type the new password again.
                </span>
              </div>
              <div className="form-group">
                <Button variant="outline-primary mr-2" onClick={this.handleClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary">
                  Submit
                </Button>

                {
                  this.state.msg ? <h2 id='text' className='font-weight-bold text-success text-center' >

                  </h2> : <h2 id='text' className='font-weight-bold text-danger text-center' >

                  </h2>
                }

              </div>

            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={this.state.mShow} onHide={this.mHandleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Change Master Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={event => { event.preventDefault(); this.mHandleSubmit(this.state) }}>

              <div className="form-group">
                <label htmlFor="inputPasswordOld">Old Master Password</label>
                <input type="text" name="oldPassword" className="form-control" id="inputPasswordOld" onChange={this.handleChange} required="" />
              </div>
              <div className="form-group">
                <label htmlFor="inputPasswordNew">New Master Password</label>
                <input type="password" name="newPassword" className="form-control" id="inputPasswordNew" onChange={this.mHandleChange} required="" />
                <span className="form-text small text-muted">
                  Atleast : Length: 6, Lowercase: 1, Uppercase: 1, Numbers: 1, Symbols: 1
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="inputPasswordNewVerify">Confirm Master Password</label>
                <input type="password" name="verifyPassword" className="form-control" id="inputPasswordNewVerify" onChange={this.mHandleChange} required="" />
                <span className="form-text small text-muted">
                  To confirm, type the new Master password again.
                </span>
              </div>
              <div className="form-group">
                <Button variant="outline-primary mr-2" onClick={this.mHandleClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary">
                  Submit
                </Button>

                {
                  this.state.msg ? <h2 id='text' className='font-weight-bold text-success text-center' >

                  </h2> : <h2 id='text' className='font-weight-bold text-danger text-center' >

                  </h2>
                }

              </div>

            </Form>
          </Modal.Body>
        </Modal>

      </>
    );
  }
}

export default Navbar;
