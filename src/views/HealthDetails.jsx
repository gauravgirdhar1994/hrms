import React, { Component } from 'react';
import DetailsHealth from '../components/MyInfo/DetailsHelath';

class HealthDetails extends Component {
    render() { 
        return (
            <div>
                
                <h4 className="mb-4 font-16 pl-3 mt-5"> Health Insurance</h4>               
                        
                                               <DetailsHealth />
                                        </div>
        )
    }

}

export default HealthDetails