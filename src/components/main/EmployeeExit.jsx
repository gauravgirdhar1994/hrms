import React, { Component } from 'react';

const Employee_exit = ({user_text}) => (
    <div className="d-flex align-items-top border border-top-0 border-bottom-0 border-right-0 border-left-0 mb-1 mt-1 font-16">
       
        <div className="col pb-5 pr-5 pt-2 pl-0">
            <h6 className="m-0 ml-3 mt-1 font-16 black50">
            {user_text}
            </h6>          
        </div>
    </div>
)


export default Employee_exit;