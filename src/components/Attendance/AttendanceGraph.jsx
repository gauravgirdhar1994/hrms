import React, { Component } from 'react';
import { Row, Col, Card } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import {DataFetchBody} from '../../services/DataFetchBody'
import config from '../../config/config';
import moment from 'moment';
const BEARER_TOKEN = localStorage.getItem("userData");
class AttendanceGraph extends Component {
    constructor() {
        super();
        this.state = {
            show:false,
            datas : {}, 
            response:"", 
            month:moment(new Date).format('M'),          
        }
      }
     
    componentDidMount(){
        //this.refreshList()
        const apiUrl = config.API_URL+'/view-attendance/';
        var bearer = 'Bearer ' + BEARER_TOKEN;
        var bodydata =  this.state.month;
      
        DataFetchBody(apiUrl, bearer, bodydata).then((result) => {
            let responseJson = result;
            console.log('jlkjkljlkjkljlkjlkj', responseJson)
            this.setState({ datas: responseJson})
        })
    }
    render() {
      
       if (this.state.datas && typeof this.state.datas.getAvgData !== 'undefined'){
       const {datas} = this.state
       if(datas.getAvgData.avgTime > 0 && datas.getAvgData.onTimePercentage.length > 0){
        var ontime = parseFloat(datas.getAvgData.avgTime)*100/10;
       var lestime = 100 - ontime
       var arrival = parseFloat(datas.getAvgData.onTimePercentage);
       var lesarrival = 100 - arrival
       console.log("gaurav",datas);
       }else{
        var lestime = 100
        var ontime = 0
        var lesarrival = 100
        var arrival = 0
       }
       
       
        const data = canvas => {
            const ctx = canvas.getContext("2d");
            return {
              labels: ['avg hrs','total hrs'],
              datasets: [
                {
                  backgroundColor: ["#ec137c", "#cccccc"],
                  data: [ontime,lestime]
                }
              ]
            };
          };
          const data2 = canvas => {
            const ctx = canvas.getContext("2d");
            return {
              labels: ['on time','total time'],
              datasets: [
                {
                  backgroundColor: ["#ec137c", "#cccccc"],
                  data: [arrival,lesarrival]
                }
              ]
            };
          }
        return (  
            <React.Fragment>
                <Row className="py-3" >
                    <Col className="col-12">
                    <h4 class="mb-4 font-16 pl-3">Attendance Stats for Current Month</h4>
                        <Card className="rounded-sm shadow-sm rounded-sm pb-3">
                            
                        <div className="max-600 width800">
                                    <Row>
                                  
                                        <Col className="col-6 text-center">
                                            <div className="doughnutcenter">
                                                <div class="pie-chart-container"><span className="bold font-16 black">{(this.state.datas.getAvgData.avgTime.length)?this.state.datas.getAvgData.avgTime:0} <i>hrs</i></span><p className="font-10 color-grey">Average hrs/day</p></div>
                                                <Doughnut
                                                    data={data}
                                                    labels={['Avrage hrs','total hrs']}
                                                    options={{   
                                                        cutoutPercentage: 85,                                                   
                                                        legend: {
                                                        display: false, 
                                                        tooltips: false                                               
                                                        }
                                                    }}
                                                    width={150} height={150}
                                                    />
                                            </div>
                                        </Col>
                                        <Col className="col-6 text-center">
                                            <div className="doughnutcenter">
                                                <div class="pie-chart-container"><span className="bold font-16 black">{(this.state.datas.getAvgData.onTimePercentage.length)?datas.getAvgData.onTimePercentage:0}</span><p className="font-10 color-grey">On time Arrival</p></div>                                             
                                                <Doughnut
                                                    data={data2}
                                                    options={{   
                                                        cutoutPercentage: 85,                                                   
                                                        legend: {
                                                        display: false,  
                                                        tooltips: false                                                     
                                                        }
                                                    }}
                                                    width={150} height={150}
                                                    />                                            
                                            </div>
                                        </Col>                                      
                                    </Row>
                                    </div>
                              
                           
                        </Card>
                    </Col>
                </Row>


                {/* Manage Leave Stats */}
               
               
            </React.Fragment>

        );
    }
    return(
        <>  </> 
    )
       
}

}

export default AttendanceGraph;