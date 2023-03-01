/* 
    Date:23-05-2020
Author:Manoj Kalra
 */
import React, { Component } from 'react';
import Leaves from '../main/Leaves'
import config from '../../config/config';
import moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
class UpcomingLeaves extends Component 
{
    constructor(props) {
     super(props);
     this.state = {upcomingLeaves:[]}
    }
    componentDidMount() {
      this.getUpcomingLeaves()
    }
    getUpcomingLeaves()
    {
      var url = config.API_URL+"/dashboard/upcoming-leave";
      var data=[];
        fetch(url,{
            method:'get',
            withCredentials: true,
            headers: {
                  'Authorization': 'bearer '+BEARER_TOKEN,
              },
            'mode':'cors',
         }).then(res => res.json()).then(res => {             
             //console.log('upcoming_leaves',res);
            if(res.success==true && (res.appliedLeaveRecord).length>0)
            {
                console.log('Leave Applied Record', res.appliedLeaveRecord);
                (res.appliedLeaveRecord).map((obj)=>{
                    var start_date = (obj.start_date)?moment(obj.start_date).format('DD'):''; 
                    var open_date = obj.opened_on?moment(obj.opened_on).format('DD'):'';
                    var open_month = obj.opened_on?moment(obj.opened_on).format('MMM'):'';
                    var end_date = obj.end_date?moment(obj.end_date).format('DD'):'';
                    var end_month = obj.end_date?moment(obj.end_date).format('MMM'):'';
                    var end_year = obj.start_date?moment(obj.start_date).format('YY'):'';
                    //console.log(start_date)
                    data.push({start_date:start_date,open_date:open_date,open_month:open_month,
                    end_date:end_date,end_month:end_month,end_year:end_year,no_of_days:obj.number_of_days,
                emp_name:''})
                })
                this.setState({upcomingLeaves:data});
            }
            else
            {
                this.props.hideComp('hideULComp',true);
            }
            
        })
    }
    render() {
        
          var items = [];
          this.state.upcomingLeaves.map(obj=>{
                                      items.push(<div className="col-lg-12 pb-2 " >
                    <div className="justify-content-between d-flex pb-2" style={{borderBottom:"1px solid #ccc"}}>
                                        <div className="d-flex">
                                            <div className="bg-green pr-2 pl-2 text-center rounded-sm pt-1 pb-1" style={{color:"#fff", backgroundColor:"#F9804F", fontSize:"10px"}}>{obj.open_date+ ' '+obj.open_month}</div>
                                            <div>
                                                <p className="m-0 ml-3" style={{color:"#233774", fontSize:"12px"}}>{(obj.no_of_days>1)?obj.start_date+' to '+obj.end_date+' '+obj.end_month+' '+obj.end_year:obj.end_date+' '+obj.end_month+' '+obj.end_year}</p>
                                                <p className="m-0 ml-3" style={{color:"#233774", fontSize:"10px"}}>{obj.emp_name}</p>
                                            </div>
                                            <p className="m-0 ml-3" style={{color:"#F8709E", fontSize:"12px"}}>
                                            {obj.no_of_days+' Days'}
                                        </p>
                                        </div>
                                       
                                    </div>
                                    </div>)
                                        })
           return (
                   (items.length>0) ? <div className="col-xl col-sm pb-3"><div className="card d-block p-3 h-100 shadow-sm">
                                       <div className="d-flex justify-content-between">
                                           <h4 className="mb-4 font-16 pl-2">Upcoming Leaves</h4>
                                          {/* <p>Self &nbsp; <span className="lnr lnr-chevron-down"></span></p>*/}
                                       </div>
                                       {
                                        items
                                       }
                                       
                    </div></div> :''    
               )
       }
}
export default UpcomingLeaves;