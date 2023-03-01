import React, { Component } from 'react';
import UserInfo from '../components/UserInfo';

import CasualLeaves  from '../components/LeaveRequest/CausalLeaves';

class LeaveRequest extends Component {
    render() {
        return (
            <div>
                <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">              
                <UserInfo />
                <CasualLeaves />
                </div>
            </div>
        );
    }
}

export default LeaveRequest;