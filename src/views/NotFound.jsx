import React from 'react';
import { Wrapper } from '../components';

class NotFound extends React.Component{
    render(){
        return (
            <Wrapper>
                <div className="flex-fill d-flex">
                    <div className="row flex-fill align-items-center text-center mt-n5">
                        <div className="col">
                            <h1 className="display-2 font-weight-bold mb-0">404<br />
                            <span className="lnr lnr-paw"></span></h1>
                            <h6 className="text-uppercase">Page not found</h6>
                            <p className="text-muted">
                                The page you are looking for is not here. <br />
                                It may have been moved or doesn't exist. <span aria-label="ghosty in the machine" role="img">👻</span>
                            </p>
                            <a href="./" className="btn btn-lg btn-primary">Return Home</a>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default NotFound;
