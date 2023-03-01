import React, { Component } from 'react';
import WPSPage from '../components/Payroll/WPSPage';

class WPS extends Component {
    render() { 
        return (
            <div>
                
                <h4 className="mb-4 font-16 pl-3"> WPS</h4>               
                        
                                               <WPSPage />
                                        </div>
        )
    }

}

export default WPS