import React, { Component } from 'react';
import Health from '../components/MyInfo/Helath';
import DetailsHealth from '../components/MyInfo/DetailsHelath';

class Settings extends Component {
    render() { 
        return (
            <div>
                
                <h4 className="mb-4 font-16 pl-3"> Health Insurance</h4>               
                                          <div style={{display:"none"}}>
                                               <Health />
                                               </div>
                                        <DetailsHealth />


                                        </div>
        )
    }

}

export default Settings