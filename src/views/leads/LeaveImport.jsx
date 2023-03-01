import React, { Component } from 'react';
import LeaveUpload from '../../components/Leave/LeaveUpload';
class LeaveImport extends Component {
    render() {
        return (
            <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">
                <LeaveUpload />
            </div>
        );
    }
}

export default LeaveImport;