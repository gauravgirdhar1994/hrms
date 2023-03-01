/* 
    Date:26-05-2020
    Author:Manoj Kalra
 */
import React, { Component } from 'react';
import moment from 'moment';
import config from '../../config/config';
import WishPopup from './WishPopup';
import Moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
class BirthdayAnniversary extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {UpcomingBirthAnni:[],TodayBirthAnni:[],WishData:[],WishPopupShow:false}
        this.getBirthdayAnniData = this.getBirthdayAnniData.bind(this);
        this.getTodayBirthAnni = this.getTodayBirthAnni.bind(this);
        this.getUpcomingBirthAnni = this.getUpcomingBirthAnni.bind(this);
        this.showWishPopup = this.showWishPopup.bind(this);
        this.hideWishPopup = this.hideWishPopup.bind(this);
    }
    componentDidMount()
    {
       // console.log('call componentDidMounts BirthdayAnniversary')
       this.getBirthdayAnniData(); 
    }
    getBirthdayAnniData()
    {
        //console.log('call getBirthdayAnniData')
        var url = config.API_URL+"/dashboard/birthday-anniversary";
      var data=[];
        fetch(url,{
            method:'get',
            withCredentials: true,
            headers: {
                  'Authorization': 'bearer '+BEARER_TOKEN,
              },
            'mode':'cors',
         }).then(res => res.json()).then(res => {             
            // console.log('birthday_anniversary',res);
            
            if(res.success==true)
            {
                if((res.TodayBirthdayAnniversaryData).length>0)
                {
                    this.getTodayBirthAnni(res.TodayBirthdayAnniversaryData);
                }
                if((res.UpcomingBirthdayAnniversaryData).length>0)
                {
                    this.getUpcomingBirthAnni(res.UpcomingBirthdayAnniversaryData);
                }
                if((res.TodayBirthdayAnniversaryData).length<=0 && (res.UpcomingBirthdayAnniversaryData).length<=0)
                {
                    this.props.hideComp('hideBirthdayComp',true);
                }
                //this.setState({holiday:data});
            }
            else
            {
                this.props.hideComp('hideBirthdayComp',true);
            }
            
           
        })
    }
    addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_USER_IMG_URL
    }
    getTodayBirthAnni(data)
    {
        var item = [];
        data.map(obj=>{
          item.push(
                  <div className="d-flex align-items-center border border-top-0 border-right-0 border-left-0 mb-1 mt-1">
        <div className="col-sm-1 col-10 mx-auto px-1">
        <img className="rounded-circle img-fluid mx-auto d-block" alt="Avatar" src={config.BASE_URL + obj.profilePic} onError={this.addDefaultSrc} />
        </div>
        <div className="col p-1">
            <button type="button" onClick={()=>this.showWishPopup(obj)} className="btn btn-sm btn-outline-danger  ml-2 float-right">Wish</button>
            <h6 className="m-0 ml-3 blue1 font-12">
            {obj.firstname+' '+obj.lastname}
            </h6>
           <p className="m-0 ml-3 blue2 font-10">{(obj.type).toUpperCase()} ({ (obj.type == 'anniversary' && obj.joiningDate) ? moment(obj.joiningDate).format(config.DATE_FORMAT) : (obj.birthDate)?moment(obj.birthDate).format(config.DATE_FORMAT):''})</p>
        </div>
    </div>
                  )  
        })
        this.setState({'TodayBirthAnni':item});
    }
    getUpcomingBirthAnni(data)
    {
        var item = [];
        data.map(obj=>{
          item.push(
                  <div className="d-flex align-items-center border border-top-0 border-right-0 border-left-0 mb-1 mt-1">
        <div className="col-sm-1 col-10 mx-auto px-1">
        <img className="rounded-circle img-fluid mx-auto d-block" alt="Avatar" src={config.BASE_URL + obj.profilePic} onError={this.addDefaultSrc} />
        </div>
        <div className="col p-1">
            {/*<button type="button" onClick={()=>this.showWishPopup(obj)} className="btn btn-sm btn-outline-danger  ml-2 float-right">Wish</button>*/}
            <h6 className="m-0 ml-3 blue1 font-18">
            {obj.firstname+' '+obj.lastname}
            </h6>
            <p className="m-0 ml-3 blue2 font-10">{(obj.type).toUpperCase()} ({ (obj.type == 'anniversary' && obj.joiningDate) ? moment(obj.joiningDate).format(config.DATE_FORMAT) : (obj.birthDate)?moment(obj.birthDate).format(config.DATE_FORMAT):''})</p>
        </div>
    </div>
                  )  
        })
        this.setState({'UpcomingBirthAnni':item});
    }
    showWishPopup(WishData)
    {
        this.setState({WishPopupShow:true,WishData:WishData});
    }
    hideWishPopup()
    {
        this.setState({WishPopupShow:false});
    }
    render()
    {
        return (
                <div className="card d-block p-3 h-100 shadow-sm d-none">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="mb-4 font-16 pl-3">Birthdays/Anniversaries</h4>
                                    </div>
                                       {this.state.TodayBirthAnni}
                                       {(this.state.UpcomingBirthAnni.length>0)?
                                        <div className="d-flex justify-content-between">
                                             <h4 className="mb-1 mt-3 font-16 pl-3">Upcoming</h4>                                       
                                       </div>:''}
                                       {this.state.UpcomingBirthAnni}
                                        
                                        {/*<p className="text-center m-0">View All</p>*/}
                                   {(this.state.WishPopupShow)?<WishPopup WishPopupShow = {this.state.WishPopupShow} WishData={this.state.WishData} hideWishPopup={this.hideWishPopup}/>:''}

                                </div>
                             
                               
                                )
    }
}
export default BirthdayAnniversary;