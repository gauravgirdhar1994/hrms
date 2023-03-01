import React, { Component } from 'react';


const Employee_Gender = ({user_text}) => (
    <div className="d-flex align-items-top border border-top-0 border-bottom-0 border-right-0 border-left-0 mb-1 mt-1 font-16">
       
        <div className="col pb-5 pr-5 pt-2 pl-0">
            <div className="container">
            <div className="row">
            <div className="d-flex employeegender text-center">
                <div>
                    <span className="pk">43%</span>
                    <img src="" />
                    <span className="pk">48</span>
                    <span className="grey font-12">Woman</span>
                </div>
                <div>
                    <span className="blue2">57%</span>
                    <img src="" />
                    <span className="blue2">80</span>
                    <span className="font-12 grey">Man</span>
                </div>
            </div>
            <div className="container margin-top-20 text-center font-11">
                Avg. Age 24.5 years
            </div>
            </div>

            </div>

        </div>
    </div>
)


export default Employee_Gender;