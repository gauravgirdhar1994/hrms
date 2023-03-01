import React, { Component } from 'react';

const User_contract = ({profile_detail, user_profile, user_img}) => (
    <div className="d-flex align-items-center border border-top-0 border-right-0 border-left-0 mb-1 mt-1">
        <div className="col-sm-1 col-10 mx-auto px-1">
            <img className="rounded-circle img-fluid mx-auto d-block" src={user_img} alt="Avatar" />
        </div>
        <div className="col p-1">
            <button type="button" className="btn btn-sm btn-outline-danger  ml-2 float-right">Wish</button>
            <h6 className="m-0 ml-3 blue1 font-12">
            {user_profile}
            </h6>
            <p className="m-0 ml-3 blue2 font-10">{profile_detail}</p>
        </div>
    </div>
)


export default User_contract;