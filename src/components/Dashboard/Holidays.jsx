/* 
    Date:25-05-2020
Author:Manoj Kalra
 */

import React, { Component } from 'react';
import config from '../../config/config';
import Moment from 'moment';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import HolidayList from './HolidayList'
import {Modal,Button,Carousel} from "react-bootstrap"
const BEARER_TOKEN = localStorage.getItem("userData");

class Holidays extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {holiday:[],showHolidayPopup:false}
        this.OpenHolidayPopup = this.OpenHolidayPopup.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    componentDidMount()
    {
       this.getHolidayList(); 
    }
    getHolidayList()
    {
        var url = config.API_URL+"/dashboard/holiday-list";
      var data=[];
        fetch(url,{
            method:'get',
            withCredentials: true,
            headers: {
                  'Authorization': 'bearer '+BEARER_TOKEN,
              },
            'mode':'cors',
         }).then(res => res.json()).then(res => {             
             //console.log('holiday_list',res);
            
            if(res.success==true && (res.HolidayData).length>0)
            {
                 //var current_date = new Date();
                 //var data=[];
                  for (var i = 0; i < res.HolidayData.length; i++) {

                    // if(new Date(res.HolidayData[i].startDate)>=current_date)
                    // {
                        data[i]=res.HolidayData[i];
                        data[i].date = Moment(res.HolidayData[i].startDate).format('DD');
                        data[i].month = Moment(res.HolidayData[i].startDate).format('MMM');
                        data[i].year = Moment(res.HolidayData[i].startDate).format('YYYY');
                        data[i].day = Moment(res.HolidayData[i].startDate).format('dddd');
                      //  break
                    // }
                    // else
                    // {
                    //     this.props.hideComp('hideHolidayComp',true);
                    // }
                  }
                  this.setState({holiday:data});
            }
            else
            {
                this.props.hideComp('hideHolidayComp',true);
            }
           // console.log('data',data);
            
           
        })
    }
    OpenHolidayPopup()
    {
      console.log('dedd')
      this.setState({showHolidayPopup:true});
    }
    handleClose()
    {
      this.setState({showHolidayPopup:false});
    }
    render()
    {
        console.log('efdfrd',this.state)
    //     const settings = {
    //   dots: true,
    //   infinite: true,
    //   speed: 100,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   autoplay:true,
    //   arrows:true,
    // };
        let items = this.state.holiday.map((obj)=>{
          return <Carousel.Item className="holidayCarouselItem">
              <img
                className="d-block w-100 holidayImage"
                src={config.BASE_URL +'/'+obj.image}
                alt={obj.image}
              />
              <Carousel.Caption>
                  <p>{obj.holidayName+' '+obj.date+' '+obj.month+' '+obj.year}</p>
              </Carousel.Caption>
            </Carousel.Item>
        })
        return(
                 (this.state.holiday)?((this.state.holiday).length>0)?

                <div className="col-xl col-sm-6 pb-3">
                    
                <div className="card d-block p-1 pt-3 h-100 shadow-sm">
                <div className="d-flex justify-content-between">
                      <h4 className="mb-4 font-16 pl-3">Holidays</h4>
                </div>
                  <Carousel>
                  {items}
                </Carousel>

                <div className="font-weight-light mt-4 mb-4 cursor-pointer font-16 pl-3 blue2 text-center" onClick={this.OpenHolidayPopup}>View All</div>
               </div>
 
               <Modal show={this.state.showHolidayPopup} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h6>Holidays List</h6></Modal.Title>
            </Modal.Header>                      
            <Modal.Body>           
              <HolidayList  HolidayListsArr={this.state.holiday}/>
            </Modal.Body>   
            </Modal>
               </div> 

         
             
                :'':'Loading...'
        )
    }
}
export default Holidays;