import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchData } from "../action/fetchData";
import config from '../config/config';
import Moment from 'moment';
import axios from 'axios';
import TopProfileLoader from '../components/Loaders/TopProfileLoader';
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
            form: [],
            item: [],
        }
    }

    componentDidMount(){
        const apiUrl = config.API_URL+'/employee/view/'+localStorage.getItem("employeeId");
        const BEARER_TOKEN = localStorage.getItem("userData");
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(apiUrl, { headers: { Authorization: bearer }})
        .then((r) => {
            console.log("Api result", r);
            this.setState({ item: r.data });
        })
        .catch((error) => {
            console.log("API ERR: ");
            console.error(error);
            // res.json({ error: error });
        });
        // this.props.fetchData(apiUrl, bearer);
    }

    addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_USER_IMG_URL
      }

    render() {
        var myDate = new Date();
        var hrs = myDate.getHours();
    
        var greet;
    
        if (hrs < 12)
        greet = 'Good Morning';
        else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon';
        else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening'; 
        // var currentdate = new Date().toLocaleString();
        var currentdate = new Date();
        console.log('Current Date', Moment(currentdate).format(config.HEADER_DATE_FORMAT));
        currentdate = Moment().format(config.HEADER_DATE_FORMAT);

        const {item} = this.state;

        console.log('userinfo', item)

if (item && item.personal){
        return (
            <> 
                <div className="row mt-3 wow fadeInUp" data-wow-delay=".3s">
                    <div className="col-lg-12 d-flex pb-4 justify-content-between">
                        <div className="d-flex ">
                            <img className="rounded-circle img-fluid userlogo" height="50" width="70" src={item.personal.profilePic !== '0' && item.personal.profilePic !== null ? config.BASE_URL + item.personal.profilePic : process.env.PUBLIC_URL + '/assets/' + config.DEFAULT_USER_IMG_URL} onError={this.addDefaultSrc} alt="Avatar" />
                            <div className="pl-3 pt-1">
                             <h3 className="mb-0 font-16">{greet} {item.personal.firstname != 0 ? item.personal.firstname : ''} {item.personal.lastname != 0 ? item.personal.lastname : ''}</h3>
                                <p>{item.personal.position}</p>
                            </div>
                        </div>
                        <div className="pl-3 pt-1">
                            {currentdate}
                        </div>
                    </div>
                 </div>
            </>
        )
    }
    return (
      <TopProfileLoader/>  
    );
    }
    }

const mapStateToProps = state => ({
    item: state.datas
    });
export default connect(mapStateToProps, {fetchData})(UserInfo);

//export default UserInfo;