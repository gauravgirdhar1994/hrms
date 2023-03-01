import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { routes } from '../routes';
var menuRecord = JSON.parse(localStorage.getItem('menuRecord'));
if(!menuRecord)
{
    menuRecord = [];
}
//console.log('menuRecord',menuRecord);
const Sidebar = (props) => {
    return (
        <div className="navbar navbar-dark d-block bg-transparent text-dark position-fixed h-100 align-self-start w-sidebar p-0 pt-2 pb-4" id="sidebar">
            <button data-toggle="collapse" data-target=".sidebar-collapse" className="navbar-brand my-1 mr-3 float-right p-0 d-inline-block d-lg-none btn btn-link menu-btn-2">
                <span className="h4 align-middle mb-0"><span className="lnr lnr-menu"></span></span>
            </button>
            <div className="nav flex-column flex-wrap pt-5 mt-3" id="menu1">
                {
                  menuRecord
                   .map((rte,key) => {
                    if (!rte.childern) {
                        var active = "";
                        // console.log('Current Path', props.location.pathname, rte.link)
                        if (props.location.pathname === rte.link || props.location.pathname.includes(rte.link)) {
                            // console.log('Current Path', props.location.pathname, rte.link)
                            active = "active";
                        }
                        return (
                            <>
                          <Link className={'nav-item nav-link ripple line-50' + (rte.className||'') + ' ' + active} to={rte.link} key={key} menu_id={rte.menuId}>
                            <i className={rte.icon + ' margin-right-30'}></i> 
                            <span className='text-truncate align-middle'>{rte.menuName}</span>
                          </Link>
                          
                          </>
                        );
                    }
                    else {
                        // route with children
                        return (
                            <React.Fragment key={key}>
                                <button className="nav-link btn btn-link text-left line-50" aria-expanded="false" data-toggle="collapse" data-target={'#submenu'+key}>
                                    <i className={rte.icon +  ' margin-right-30'}></i>
                                    <span className='text-truncate align-middle'>{rte.menuName}</span>
                                </button>
                                <div className="collapse subNav" id={'submenu'+key} data-parent="#menu1">
                                    <div className="nav pb-2 pl-3 flex-column flex-wrap text-truncate">
                                    { rte.childern.map((child,i) => {
                                        var active = "";
                                        console.log('Current Path', props.location.pathname, child.link)
                                        if (props.location.pathname === child.link) {
                                            console.log('Current Path', props.location.pathname, child.link)
                                            active = "active";
                                        }
                                        return (
                                            <Link className={'nav-item nav-link ripple line-50' + (rte.className||'') + ' ' + active} to={child.link} key={i} menu_id={child.menuId}>
                                            { child.menuName }
                                            </Link>
                                        
                                        );
                                    }) }
                                    </div>
                                </div>                               
                            </React.Fragment>
                        );
                    }
                  })
                }
                 <div className="font-12 mt-3 bold powerdBy"><a href="https://vowfirst.com" target="_blank">POWERED BY <img src="/assets/logo.png" /></a></div>
            </div>
        </div>
    );
};

export default withRouter(Sidebar);