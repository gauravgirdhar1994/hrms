import React, { Component } from 'react';
import GratuityPage from '../components/Payroll/GratuityPage';

class Gratuity extends Component {
    render() { 
        return (
            <div className="p-4 flex-fill d-flex flex-column">
                
                <h4 className="mb-4 font-16 pl-3"> Gratuity Estimator</h4> 


                        
                                               <GratuityPage />
                                        </div>
        )
    }

}

export default Gratuity