import React from 'react';
import packageJson from '../../package.json';

class ModalAbout extends React.Component{
    
    render(){
        return (
            <div id="modalAbout" className="modal show" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content text-center">
                        <div className="modal-body text-center">
                            <div className="alert text-white bg-primary fade show font-weight-bold" role="alert">
                                Vow First React v{packageJson.version}
                            </div>
                            <p>
                            Admin Starter Template, Theme and UI Kit for Bootstrap <br/> by <a href="javascript:void(0)" target="_new"></a> &copy;2019
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalAbout;
