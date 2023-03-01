import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

class Attendance_stack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            
//            dataDonut3: {
//                "labels": ["Present", "Halfday", "Absent", "Week Off"],
//                "datasets": [
//                {
//                    "backgroundColor": ["#6CD996","#619EE9","#FF858A", "#FECB71"],
//                    "borderWidth": 0,
//                    "data": [
//                    10,
//                    70,
//                    5,
//                    19
//                  ]
//                }
//              ]
//            },
            donutOptions: {
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI,
                responsive: true,
                // maintainAspectRatio: true,
                legend: {
                    labels: {
                      boxHeight: 100
                    }
                }
            }
        };
    }
    componentDidMount()
    {
        if(this.state.attendanceType)
        {
            var labels_arr = [];
            var data_arr = [];
            this.state.attendanceType.map((obj)=>{
                labels_arr.push(obj.type);
                data_arr.push(obj.count);
            })
            var dataDonut3 =  {
                "labels": labels_arr,
                "datasets": [
                {
                    "backgroundColor": ["#6CD996","#619EE9","#FF858A", "#FECB71"],
                    "borderWidth": 0,
                    "data": data_arr
                }
              ]
            }
            this.setState({'dataDonut3':dataDonut3});
        }
    }
    render() {
        
        return (
                
                
                    <div>
                        {
                            (this.state.attendanceType)?
                            <Doughnut options={this.state.donutOptions} data={this.state.dataDonut3} />:''
                        }
                    </div>
                
           
        )
        
    }
}

export default Attendance_stack;