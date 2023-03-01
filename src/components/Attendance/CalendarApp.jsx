// @flow
import React, { Component,  BackIcon, NextIcon, Item } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import BootstrapTheme from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import config from '../../config/config';
import "react-datepicker/dist/react-datepicker.css";
import Carousel from 'nuka-carousel'
import Slider from 'react-slick'
import LeaveApply from './LeaveApply';
import moment from 'moment';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const BEARER_TOKEN = localStorage.getItem("userData");

class CalendarApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show:false,  items: [], isLoading:true, message:"", start_date:"",
            attendanceinfo:[],
            businessHours:[],
            events: [
                
              ],
            month:moment(new Date).format('M'),
         }
         //console.log('construct ca',this.state);
         this.RefreshEvents = this.RefreshEvents.bind(this);
         this.refreshEvent = this.refreshEvent.bind(this);
//         this.attachInTime = this.attachInTime.bind(this);
      }

      handleSubmit = (event) => {
        this.setState({start_date:this.props.start_date})
        //let datas = this.state;
        var datas = {
            "start_date": "2020-04-28",
            "end_date": "2020-04-28",
            "description": "sadf",
            "leave_type": 5,
            "leave_for": 2
          };
        event.preventDefault();
        const apiUrl = config.API_URL+'/ticket/add/leave';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        const options = {
          method: 'POST',
          headers:{
            'Authorization': bearer,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(datas)
        };
        //console.log(JSON.stringify(datas))
        fetch(apiUrl, options)
          .then(res => {
              res.json()
              console.log(res.json)
            })
          .then(result => {
              console.log(result)
            this.setState({
              response: result
            })
            window.confirm('Lead is added successfully')
          },
          (error) => {
            this.setState({ error });
            alert('fail')
          }
        )
        //this.setState({initialState:this.initialState}); 
    }
   
    componentDidMount() {
        
      this.refreshEvent()
    }

     componentDidUpdate(prevProps, prevState) {
//          Object.entries(this.props).forEach(([key, val]) =>
//        prevProps[key] !== val && console.log(`Prop '${key}' changed`)
//         );
//        if (this.state) {
//          Object.entries(this.state).forEach(([key, val]) =>
//            prevState[key] !== val && console.log(`State '${key}' changed`)
//          );
//        }
//        console.log('eferf',prevState['month'],this.state.month)
//        if(prevState['month']!=this.state.month)
//        {
//            console.log('in refreshEvent')
//            this.refreshEvent()
//        }
        //fetchData();
    }

    refreshEvent(){
      var url = config.API_URL+"/view-attendance";
      var bearer = 'Bearer ' + BEARER_TOKEN;
      console.log(this.state)
      fetch(url, {
              method: 'POST',
              withCredentials: true,
              headers: {
                  'Authorization': bearer,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              },
              'mode':'cors',
              body:JSON.stringify({
                  "month": this.state.month
                })
          }).then(res => res.json()).then(res => {
              //console.log('res',res);
              if (res.monthlyAttendanceData && res.monthlyAttendanceData.length > 0) {
                  this.setState({items: res.monthlyAttendanceData, attendanceinfo:res.attendanceType,'businessHours':res.businessHours});
                  this.setState({ events: this.state.items.map((str) => {
                    if(str.title != ""){  
                    return (
                          {
                              id: str.id,
                              title: str.type,
                              start: new Date(str.entryDatetime).toISOString(),
                              className:str.type.replace(/\s/g,'_').toLowerCase()
                          }
                      )
                      }
                  })
              })
                }
              console.log('events',this.state.events)
          })
          .catch(error => {console.log('error calenderapp',error)});
    }
    
 
    handleClose = () => this.setState({show:false});
    handleShow = () => this.setState({show:true});
    

      viewTicket = (cell, row) => {
        return(
            <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={this.handleShow}>View Ticket</button>
        )
      }

    handleDateClick = (arg) => { // bind with an arrow function
       // console.log(arg)
        //this.handleShow
       //console.log('arg',new Date(arg.dateStr));
      // console.log('arg',new Date(arg.event.start));
      var start_date='';
      if(arg.dateStr)
      {
         start_date =  new Date(arg.dateStr);
      }
      else if(arg.event.start)
      {
         start_date = arg.event.start;
      }
       this.setState({show:true, start_date:start_date})
        // this.setState({
        //     // add new event data
        //     events: this.state.events.concat({
        //       // creates a new array
        //       title: "Apply",
        //       start: arg.date,
        //       allDay: arg.allDay,
        //       className: 'pending',
        //     })
        //   });
      }
     
    // ([
    //     {
    //         id: 1,
    //         title: 'Meeting with Mr. Shreyu!',
    //         start:new Date(2015, 3, 15, 20, 0, 0, 0),
    //         end: new Date(2015, 3, 15, 21, 0, 0, 0),
    //         startRecur: '2020-05-08',
    //         startTime: '10:45:00',
    //         endTime: '12:45:00',
    //         className: 'bg-warning text-white',
    //         endRecur: '2020-05-07',
    //         endAccessor:'12:45:00',
    //     },
    //     {
    //         id: 1,
    //         title: 'Out - 11:38 AM',
    //         startRecur: '2020-05-06',
    //         startTime: '10:45:00',
    //         endTime: '12:45:00',
    //         className: 'present',
    //         endRecur: '2020-05-07',
    //     },

RefreshEvents = (fetchInfo, successCallback, failureCallback)=> {
 if (fetchInfo) {
    var date = new Date(fetchInfo.start).getDate();
    if(date==1)
    {
       var month = new Date(fetchInfo.start).getMonth() + 1; 
    }
    else
    {
       var month = new Date(fetchInfo.start).getMonth() + 2; 
        
    }
    if(month>12)
    {
       month = 1; 
    }
   
    
    
  }
 // console.log(this.state.month,month)
  if(this.state.month!=month)
  {
      this.state.month = month;
      this.refreshEvent();      
  }
//console.log('edeeef',new Date(fetchInfo.start).getMonth(),month,this.state.month);
//this.refreshEvent();
  successCallback(
   
      this.state.events

  );
  failureCallback({});
}
render() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: this.state.attendanceinfo.length,
    slidesToScroll: 1
  };
  console.log(this.state.attendanceinfo);
       // console.log('render calenderapp');
    return (
        <React.Fragment>
            <Row>
                <Col className="col-12">
                    <Card className="rounded-sm c-shadow">
                        <CardBody className="p-0 shadow-sm rounded-sm">

                       <div className="d-flex aic attlist"> 
                       {
                            this.state.attendanceinfo.map((attn)=>{
                               return (<div className="item">{attn.type} <span className={attn.type.toLowerCase()}>{attn.count}</span></div> ) 
                            })
                        }
                        </div>
                     
                            {/* fullcalendar control */}
                            <FullCalendar
                                defaultView="dayGridMonth"
                                plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                                slotDuration='00:15:00'
                                minTime='08:00:00' maxTime='19:00:00' themeSystem='standard'
                                businessHours={{
                                    daysOfWeek: this.state.businessHours.daysOfWeek,
                                    startTime: this.state.businessHours.startTime, // a start time (10am in this example)
                                    endTime: this.state.businessHours.endTime, // an end time (6pm in this example)
                                }}
                                handleWindowResize={true}
                                bootstrapFontAwesome={false}
                                buttonText={{today: 'Today', month: 'Month', week: 'Week', day: 'Day', list: 'List' }}
                                header={{
                                    left: 'prev next',
                                    center: 'title',
                                    right: ''
                                }}
                                dateClick={this.handleDateClick}
                                eventClick={this.handleDateClick}
                                eventLimit={true} // allow "more" link when too many events
                                events={(fetchInfo, successCallback, failureCallback) => this.RefreshEvents(fetchInfo, successCallback, failureCallback)} 
                                eventRender={(info) => {
                                    //console.log('info',info)
                                    var start_time = (info.event.start)?moment(info.event.start).format('HH:mm'):'00:00';
                                    if(info.event.classNames[0] && (info.event.classNames[0]=='present' || info.event.classNames[0]=='work_from_home') && start_time!='00:00')
                                    {
                                        var div = document.createElement('div')                                        
                                        div.innerHTML = 'In Time : '+start_time;
                                        div.setAttribute('class', 'inTime');
                                        info.el.append(div);
                                    }
                                  }}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <LeaveApply show={this.state.show} onHide={this.handleClose} start_date={this.state.start_date} refreshList={this.refreshEvent} refreshEvent={this.refreshEvent} />
        </React.Fragment>
    );
    }
};

export default CalendarApp;
