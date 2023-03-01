/* 
    Date:26-05-2020
    Author:Manoj Kalra
 */
import React, { Component } from 'react';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
class EmpGender extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {EmpGender:[]}
        this.getEmpGender = this.getEmpGender.bind(this);
    }
    componentDidMount()
    {
       // console.log('call componentDidMounts BirthdayAnniversary')
       this.getEmpGender(); 
    }
    getEmpGender()
    {
        //console.log('call getBirthdayAnniData')
        var url = config.API_URL+"/dashboard/employee-gender";
      var data=[];
        fetch(url,{
            method:'get',
            withCredentials: true,
            headers: {
                  'Authorization': 'bearer '+BEARER_TOKEN,
              },
            'mode':'cors',
         }).then(res => res.json()).then(res => {             
             //console.log('emp_gender',res);
            
            if(res.success==true)
            {
                this.setState({EmpGender:res.allData});
            }
            
           
        })
    }
    
    render()
    {
        return (
                <div className="d-flex align-items-top border border-top-0 border-bottom-0 border-right-0 border-left-0 mb-1 mt-1 font-16">
       
        <div className="col pb-5 pr-5 pt-2 pl-0">
            <div className="container">
            <div className="row">
            <div className="d-flex employeegender text-center">
                <div>
                    <span className="pk">{this.state.EmpGender.femalePercentage}%</span>
                    <img src="/assets/Female.svg" />
                    <span className="pk">{this.state.EmpGender.totalFemale}</span>
                    <span className="grey font-12">Woman</span>
                </div>
                <div>
                    <span className="blue2">{this.state.EmpGender.malePercentage}%</span>
                    <img src="/assets/male.svg" />
                    <span className="blue2">{this.state.EmpGender.totalMale}</span>
                    <span className="font-12 grey">Man</span>
                </div>
            </div>
            <div className="container margin-top-20 text-center font-11">
                Avg. Age {this.state.EmpGender.avgAge} years
            </div>
            </div>

            </div>

        </div>
    </div>
                                )
    }
}
export default EmpGender;