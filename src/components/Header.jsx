import React from 'react';
import { Navbar, ModalProfile } from './';
import config from '../config/config';

class Header extends React.Component{
    
    constructor(props) {
        super(props);
        this.showProfile = this.showProfile.bind(this);
        this.ModalProfile = React.createRef();
    }

    showProfile() {
        this.ModalProfile.current.show();
    }

    addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_ORG_IMG_URL
      }
    
    render(){
       // console.log('Session Storage', localStorage);
        return (
            <div className="container-fluid fixed-top bg-white px-lg-3 px-0" id="topnav">
                <div className="row collapse show no-gutters d-flex h-100 position-relative sidebar-collapse">
                    <div className="col-3 pr-4 w-sidebar navbar-collapse collapse d-none d-lg-flex">
                        
                    <button data-toggle="collapse" data-target=".sidebar-collapse" className="navbar-brand p-0 btn btn-link" title="Toggle sidebar">
                    <span className="h4 align-middle mb-0"><span className="lnr lnr-menu"></span></span>
                </button>
                        {/* <input className="form-control form-control-sm mr-1 border-0 font-weight-light rounded-pill" type="text" placeholder="search..." /> */}
                       <div className="brandLogo text-center"> <img src={localStorage.getItem('orgLogo')} onError={this.addDefaultSrc} width="150" height="75" alt="profile pic" className="navbar-brand p-0" /></div>
                    </div>
                    <div className="col pr-3">
                        <Navbar parent={this} />
                    </div>
                </div>
                <ModalProfile ref={this.ModalProfile}  />
            </div>
        );
    }
}

export default Header;
