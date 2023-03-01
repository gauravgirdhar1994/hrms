import React, { Component } from 'react';
import  AttendanceUpload from '../components/Attendance/AttendanceUpload';
class AttendanceImport extends Component {
    render() {
        return (
            <div className="p-4 flex-fill d-flex flex-column page-fade-enter-done">
                <AttendanceUpload />
            </div>
        );
    }
}

export default AttendanceImport;