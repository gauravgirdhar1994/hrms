import React from 'react';

class ModalLogout extends React.Component{

    
    render(){
        return (
            <div id="modalLogout" className="modal show" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-sm modal-dialog-centered">
                    <div className="modal-content text-center">
                        <div className="modal-body text-center">
                            <div className="alert text-white bg-primary fade show font-weight-bold" role="alert">
                                You're now logged out.
                            </div>
                            <button className="btn btn-link" data-dismiss="modal">
                                <span aria-hidden="true" className="display-2">×</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalLogout;
