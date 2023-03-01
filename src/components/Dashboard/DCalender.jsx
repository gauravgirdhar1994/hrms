/* 
Date:20-05-2020
Author : Manoj Kalra
 */
import React,{ Component} from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import BootstrapTheme from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import config from '../../config/config';
import LeaveApply from '../Attendance/LeaveApply';
import moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
class DCalender extends Component {
    constructor(props) {
        super(props);
        this.state = {
        items: [], 
            attendanceinfo:[],
            businessHours:[],
            events: [
                { title: "", start: new Date() }
              ],
              show:false,
              start_date:'',
              month:moment(new Date).format('M'),
         }
         this.refreshEvent = this.refreshEvent.bind(this);
         
    }
    componentDidMount() {
      this.refreshEvent()
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
    handleDateClick = (arg) => { 
     this.setState({show:true, start_date:new Date(arg.dateStr)})
    }
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
    handleClose = () => this.setState({show:false});
    render() {

        //console.log(this.state);
    return (
            <React.Fragment>
                <FullCalendar
                                defaultView="dayGridMonth"
                                plugins={[dayGridPlugin, interactionPlugin]}
                                businessHours={{
                                    daysOfWeek: this.state.businessHours.daysOfWeek,
                                    startTime: this.state.businessHours.startTime, // a start time (10am in this example)
                                    endTime: this.state.businessHours.endTime, // an end time (6pm in this example)
                                }}
                                handleWindowResize={true}
                                bootstrapFontAwesome={false}
                                header={{
                                    left: 'prev next',
                                    center: 'title',
                                    right: ''
                                }}
                                dateClick={this.handleDateClick}
                                eventLimit={true}
                                events={(fetchInfo, successCallback, failureCallback) => this.RefreshEvents(fetchInfo, successCallback, failureCallback)}
                                showNonCurrentDates={false}
                                aspectRatio= '3'
                               
                                
                            />
                                    <LeaveApply show={this.state.show} onHide={this.handleClose} start_date={this.state.start_date} refreshEvent={this.refreshEvent} calType="dashboard"/>
                </React.Fragment>
    )}
}
export default DCalender;