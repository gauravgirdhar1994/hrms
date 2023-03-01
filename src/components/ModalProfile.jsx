import React from 'react';
import jquery from "jquery";

class ModalProfile extends React.Component{
    
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
    }
    
    show() {
        jquery(this.refs.modalProfile).modal({backdrop:false});
    }

    render(){
        return (
            <div
                id="modalProfile"
                className="modal fade mt-0 mt-md-5"
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
                ref="modalProfile"
              >
                <div className="modal-dialog modal-xl mx-auto">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 id="myModalLabel">Robojo</h3>
                            <button type="button" className="close font-weight-light" data-dismiss="modal" aria-hidden="true">×</button>
                        </div>
                        <div className="modal-body p-lg-5 p-3">
                            <div className="row">
                                <div className="col-xl order-lg-2 col-lg-8">
                                    <ul className="nav nav-tabs small text-uppercase">
                                        <li className="nav-item">
                                            <a href="#profile" data-target="#profile" data-toggle="tab" className="nav-link active">Profile</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#edit" data-target="#edit" data-toggle="tab" className="nav-link">Edit</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content py-4">
                                        <div className="tab-pane py-2 active" id="profile">
                                            <div className="row my-2">
                                                <div className="col-md-6">
                                                    <h6>Title</h6>
                                                    <p>
                                                        Web Designer, UI/UX Engineer
                                                    </p>
                                                    <h6>About</h6>
                                                    <p>
                                                        Indie music, skiing and hiking. I love the great outdoors.
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6>Recent Tags</h6>
                                                    <span className="badge badge-dark badge-pill mr-1">html5</span>
                                                    <span className="badge badge-dark badge-pill mr-1">react</span>
                                                    <span className="badge badge-dark badge-pill mr-1">bootstrap</span>
                                                    <span className="badge badge-dark badge-pill mr-1">responsive-design</span>
                                                    <hr />
                                                    <span className="badge badge-primary mr-1"><i className="fa fa-user"></i> 900 Followers</span>
                                                    <span className="badge badge-primary mr-1"><i className="fa fa-cog"></i> 43 Forks</span>
                                                    <span className="badge badge-primary mr-1"><i className="fa fa-eye"></i> 245 Views</span>
                                                </div>
                                                <div className="col-md-12">
                                                    <h6 className="mt-3"><span className="fa fa-clock-o ion-clock float-right"></span> Recent Activity</h6>
                                                    <table className="table table-hover table-striped table-sm">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <span className="font-weight-bold">Abby</span> joined ACME Project Team in <span className="font-weight-bold">`Collaboration`</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <span className="font-weight-bold">Gary</span> deleted My Board1 in <span className="font-weight-bold">`Discussions`</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <span className="font-weight-bold">Skell</span> deleted his post Look at Why this is.. in <span className="font-weight-bold">`Discussions`</span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane py-2" id="edit">
                                            <form className="row">
                                                <div className="col-xl-6">
                                                    <div className="form-group">
                                                        <label htmlFor="text-input">Title</label>
                                                        <input type="text" id="text-input" className="form-control" placeholder="Title" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="email-input">Email</label>
                                                        <input type="email" id="email-input" className="form-control" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="tel-input">Mobile phone</label>
                                                        <input type="tel" id="tel-input" className="form-control" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="time-input">Time Zone</label>
                                                        <select id="time-input" size="0" className="form-control custom-select">
                                                            <option defaultValue="Hawaii">(GMT-10:00) Hawaii</option>
                                                            <option defaultValue="Alaska">(GMT-09:00) Alaska</option>
                                                            <option defaultValue="Pacific Time (US &amp; Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                                                            <option defaultValue="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
                                                            <option defaultValue="Central Time (US &amp; Canada)">(GMT-06:00) Central Time (US &amp; Canada)</option>
                                                            <option defaultValue="Eastern Time (US &amp; Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 d-flex flex-column justify-content-between">
                                                    <div className="form-group">
                                                        <label className="form-label">Preferences</label>
                                                        <div className="form-check small">
                                                            <label className="form-check-label">
                                                                <input type="checkbox" className="form-check-input" /> Send notifications via SMS
                                                            </label>
                                                        </div>
                                                        <div className="form-check small">
                                                            <label className="form-check-label">
                                                                <input type="checkbox" className="form-check-input" /> Send copy to group administrator
                                                            </label>
                                                        </div>
                                                        <div className="form-check small disabled">
                                                            <label className="form-check-label">
                                                                <input type="checkbox" disabled="disabled" className="form-check-input" /> Delete messages on server
                                                            </label>
                                                        </div>
                                                        <div className="form-row no-gutters align-items-center small py-2">
                                                            <label htmlFor="example-number" className="col-12 text-truncate">Purge server after</label>
                                                            <input type="text" id="example-number" className="form-control form-control-sm col-12" />
                                                            <span className="col-2 ml-1">messages</span> 
                                                        </div>
                                                        <div className="form-row no-gutters align-items-center small py-2">
                                                            <label htmlFor="example-add" className="col-12 text-truncate">Forward to</label>
                                                            <input type="text" id="example-add" className="form-control form-control-sm col-12" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group text-right">
                                                        <div className="form-row">
                                                            <div className="col-md">
                                                                <button type="button" className="btn btn-outline-secondary d-none d-md-inline" data-dismiss="modal" aria-hidden="true">Close</button>
                                                            </div>
                                                            <div className="col-md">
                                                                <button type="button" className="btn btn-outline-secondary btn-block">Save Settings</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 order-lg-1 col-lg-4 text-center">
                                    <div className="rounded bg-light border p-2 h-100">
                                        <img src="./assets/m20.jpg" className="mx-auto my-2 img-fluid rounded-circle bg-dark" alt="profile avatar" />
                                        <table className="table table-sm small text-left mt-3">
                                            <tbody>
                                                <tr>
                                                    <td className="text-uppercase">Joined</td>
                                                    <td>6-4-2016</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-uppercase">Last seen</td>
                                                    <td>2 hours ago</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-uppercase">Posts</td>
                                                    <td>340</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-uppercase">Reputation</td>
                                                    <td>14,583</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalProfile;
