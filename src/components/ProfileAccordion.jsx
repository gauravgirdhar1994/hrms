import React from 'react';
import profiles from '../data/profiles.json';

class ProfileAccordion extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            profiles: this.props.profiles||[]
        };
    }
    
    static defaultProps = {
        accordionId: "accProfiles",
        heading: "Latest Profiles",
        profiles: profiles,
        activeIndex: 0,
        className: "",
        likesLink: "./",
        friendsLink: "./",
        postsLink: "./",
        headerClasses: "",
        contentClasses: "text-center",
        countClasses: "text-center"
    };

    render(){
        var { profiles } = this.state;
        return (
            <div className={this.props.className} id={this.props.accordionId}>
                {profiles && profiles.length > 0 ? profiles.map((item,key) => (
                <React.Fragment key={key}>
                    <a role="tab" id="headingTwo" data-toggle="collapse" href={'#item_'+key} className="card-header d-block collapsed">
                        { item.fullName }
                    </a>
                    <div id={'item_'+key} role="tabpanel" className={'collapse ' + ((key===this.props.activeIndex)?'show':'')} data-parent={'#'+this.props.accordionId}>
                        <div className="card border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-xl-8 col-lg-9 col-md-7">
                                        <h5>{ item.short }</h5>
                                        <p>{ item.bio }</p>
                                        <p>
                                            {item.tags && item.tags.length > 0 ? item.tags.map((tag,k) => (
                                                <span key={k} className="badge badge-info mr-1">{tag}</span>
                                            )):''}
                                        </p>
                                    </div>
                                    <div className="col-xl col-lg col-md col-10 text-center mx-auto">
                                        <img src={ item.pic } alt="profile" className="mx-auto rounded-circle img-fluid bg-dark" />
                                        <ul title="Ratings" className="list-inline ratings text-center">
                                            <li className="list-inline-item"><a href="."><span className="lnr lnr-star"></span></a></li>
                                            <li className="list-inline-item"><a href="."><span className="lnr lnr-star"></span></a></li>
                                            <li className="list-inline-item"><a href="."><span className="lnr lnr-star"></span></a></li>
                                            <li className="list-inline-item"><a href="."><span className="lnr lnr-star"></span></a></li>
                                            <li className="list-inline-item"><a href="."><span className="lnr lnr-star-half"></span></a></li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-4">
                                        <h3 className="mb-0">{item.followers}</h3> <small>Followers</small>
                                        <button className="btn btn-block btn-outline-secondary"><span className="fa fa-plus-circle"></span> Follow</button>
                                    </div>
                                    <div className="col-sm-4">
                                        <h3 className="mb-0">{item.friends}</h3> <small>Following</small>
                                        <button className="btn btn-outline-secondary btn-block text-truncate"><span className="fa fa-user"></span> Profile</button>
                                    </div>
                                    <div className="col-sm-4">
                                        <h3 className="mb-0">{item.posts}</h3> <small>Posts</small>
                                        <button type="button" className="btn btn-outline-secondary btn-block"><span className="fa fa-gear"></span> Options</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
                )):''}
            </div>
        );
    }
}

export default ProfileAccordion;