import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { routes } from '../routes';

export const NavbarHorizontal = (props) => {

    return (
    <nav className="navbar navbar-light navbar-expand-lg fixed-top bg-light shadow-sm justify-content-start">
        <div className="container-fluid px-2">
            <a href="../" className="navbar-brand navbar-text" title="Home">Vow First</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarH">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse" id="navbarH">
                <ul className="navbar-nav text-uppercase w-100">
                    {
                      routes
                      .filter((rte,key) => {return rte.showInNav === true})
                      .map((rte,key) => {
                        if (rte.path && !rte.children) {
                            var active = (props.match.path===rte.path)?"active":"";
                            return (
                                <Link className={'nav-item nav-link' + (rte.className||'') + ' ' + active} to={rte.path} key={key}>
                                    <span className='text-truncate align-middle'>{rte.name}</span>
                                </Link>
                            );
                        }
                        else {
                            return (
                                <li className="nav-item dropdown" key={key}>
                                    <button className="btn btn-link nav-link dropdown-toggle text-uppercase" data-toggle="dropdown">
                                    { rte.name }
                                    </button>
                                    <div className="dropdown-menu">
                                    { rte.children.map((child,i) => {
                                        return (
                                            <Link className="dropdown-item" to={child.path} key={i}>
                                            { child.name }
                                            </Link>
                                        )
                                    }) }
                                    </div>
                                </li>
                            );
                        }
                      })
                    }
                    <li className="nav-item dropdown ml-md-auto ml-0">
                        <button className="nav-link btn btn-link p-0 text-truncate" data-toggle="dropdown">
                            <span className="align-middle" data-toggle="tooltip" data-placement="left" title="You are logged in as Robojo">
                                Robojo
                            </span>
                            <img alt="avatar" src="./assets/m20.jpg" className="avatar mx-1 rounded-circle bg-white shadow-sm" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right mt-2 rounded-0" aria-labelledby="dropdownMenu1">
                            <a className="dropdown-item px-3" href="./inbox">
                                <span className="lnr lnr-inbox"></span> Inbox <span className="badge badge-primary badge-pill font-weight-light align-middle mb-1 pt-0" title="notify count"><small>3</small></span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item px-3" href="#modalLogout" data-target="#modalLogout" data-toggle="modal"><span className="lnr lnr-exit"></span> Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    );
};

export default withRouter(NavbarHorizontal);
