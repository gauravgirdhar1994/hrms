import React, { Component } from 'react';
import { Card, Row, Table, Button } from "react-bootstrap"
import { FaPhoneAlt, FaLocationArrow } from "react-icons/fa";
import { IoIosMailOpen } from "react-icons/io";
import config from '../../config/config';
import moment from 'moment';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ReactEncrypt from 'react-encrypt'
// import PropTypes from 'prop-types'
var CryptoJS = require("crypto-js");
class MyTeam extends Component {
    // static contextTypes = {
    //     encrypt: PropTypes.func.isRequired,
    //     decrypt: PropTypes.func.isRequired,
    //   }
    
	constructor(props)
	{
		super(props);
		this.state = {team_arr:this.props.team_arr}
	}
	componentDidUpdate(prevProps) {
		//console.log(prevProps.advanceLoanRow,this.props.advanceLoanRow);

        if(prevProps.team_arr !== this.props.team_arr) {
        	this.setState({team_arr:this.props.team_arr})
        }
     }

     addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_USER_IMG_URL
      }
   enc(plainText){
        var b64 = CryptoJS.AES.encrypt(plainText, config.secret_key).toString();
        var e64 = CryptoJS.enc.Base64.parse(b64);
        var eHex = e64.toString(CryptoJS.enc.Hex);
        return eHex;
    }
	render()
	{
		var items = [];
        //console.log('fdg',this.state.team_arr);
        var settings = {
            slidesToShow: 4,
            adaptiveHeight:true,
            autoplay:true,
          };
		if(this.state.team_arr.teamData && this.state.team_arr.teamData.rows.length>0)
		{
			
		 items = this.state.team_arr.teamData.rows.map((obj)=>{
            //console.log('id=',typeof obj.empDetails.personal.id);
			return <a href={config.BASE_URL_FRONTEND+'/my-info/edit/'+this.enc(obj.empDetails.personal.id.toString())}>
                <div className="myTeamSlider">             
                <img src={config.BASE_URL+obj.empDetails.personal.profilePic} onError={this.addDefaultSrc}/>
                <h3>{obj.empDetails.personal.firstname+' '+obj.empDetails.personal.lastname}</h3>
                <span>{obj.empDetails.personal.email != 0?obj.empDetails.personal.email:''}</span>
                <span>{obj.empDetails.personal.phoneNumber != 0 ?obj.empDetails.personal.phoneNumber:''}</span>

                {/* <h3 className="mt-2">Job Title</h3> */}
                <span>{obj && obj.empDetails.personal.position != 0?obj.empDetails.personal.position:''}</span>
                <span>Location - {obj.empDetails.personal.locationName?obj.empDetails.personal.locationName:''}</span>
                <span>Date of Joining - {obj && obj.empDetails.personal.joiningDate ?moment(obj.empDetails.personal.joiningDate).format(config.DATE_FORMAT):''}</span>







            {/* <div className="row">
			<span className='status'>{config.STATUS[obj.empDetails.personal.status]}</span>
			               <div className="col-sm-4">
                                <img src={config.BASE_URL+obj.empDetails.personal.profilePic} width="120" onError={this.addDefaultSrc}/> 
                            </div>
                                            <div className="col-sm-8">
                                                <h4>{obj.empDetails.personal.firstname+' '+obj.empDetails.personal.lastname}</h4>
                                                <p> <IoIosMailOpen />{obj.empDetails.personal.email != 0?obj.empDetails.personal.email:'N/A'}</p>
         <p className="d-flex jcb aic"><span><FaPhoneAlt />{obj.empDetails.personal.phoneNumber != 0 ?obj.empDetails.personal.phoneNumber:'N/A'}</span> <span><FaLocationArrow />{obj.empDetails.personal.locationName?obj.empDetails.personal.locationName:'N/A'}</span></p>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="d-flex jcb aic">
                                                    <div>
                                                        <label> Job title </label>
                                                        <p>{obj && obj.empDetails.personal.position != 0?obj.empDetails.personal.position:'N/A'}</p>
                                            		</div>
                                                    <div>
                                                        <label> Date of Joining </label>
                                                        <p>{obj && obj.empDetails.personal.joiningDate ?moment(obj.empDetails.personal.joiningDate).format(config.DATE_FORMAT):'N/A'}</p>                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div></a>
                             
		})
    }
   // this.setState({items:items})
   //console.log('items',items)
		return(
			<div>
				{
				(items.length>0)?
				<>
				<h4>Direct Report</h4>
                <div className="myteamSlider">
                        <Slider {...settings}>
                            
                            {items}
                           
                            </Slider>
                            </div>
                       
               
                        </>:''}

                        
               
                <Card className="card d-block pl-3 pt-3 pr-3 pb-3 mt-5 shadow-sm">
                 <h4>Reporting Manager</h4>
                    <Table className="leaveTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Department</th>
                                <th>Designation</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{(this.state.team_arr.ReportingManager)?this.state.team_arr.ReportingManager.firstname+' '+this.state.team_arr.ReportingManager.lastname:''}</td>
                                <td>{(this.state.team_arr.ReportingManager)?this.state.team_arr.ReportingManager.employeeType:''}</td>
                                <td>{(this.state.team_arr.ReportingManager)?this.state.team_arr.ReportingManager.dept:''}</td>
                                <td>{(this.state.team_arr.ReportingManager)?this.state.team_arr.ReportingManager.position:''}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
                                </div>
			)

	}
}
export default MyTeam;