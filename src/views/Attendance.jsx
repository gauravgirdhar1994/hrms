import React, { Component } from 'react';
import CalendarApp from '../components/Attendance/CalendarApp'
import UserInfo from '../components/UserInfo';
import AttendanceGraph from '../components/Attendance/AttendanceGraph';

//import AttendanceImport from '../components/Attendance/AttendanceUpload';

class Attendance extends Component {
    render() {
        return (
            <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">              
                
                <UserInfo />
               <AttendanceGraph />
                {/* <AttendanceImport />  */}
                <CalendarApp />
            </div>
        );
    }
}

export default Attendance;