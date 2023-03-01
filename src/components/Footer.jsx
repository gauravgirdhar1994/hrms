import React from 'react';

class Footer extends React.Component{

    render(){
        return (
            <footer id="footer" className="p-4 py-5 mt-auto">
                <div className="row">
                    <div className="col-6 col-md-3">
                        <ul className="list-unstyled">
                            <li><a href="./">Products</a></li>
                            <li><a href="./">Services</a></li>
                            <li><a href="./">Benefits</a></li>
                            <li><a href="./">Developers</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-3 column">
                        <ul className="list-unstyled">
                            <li><a href="./">Contact Us</a></li>
                            <li><a href="./">Delivery Information</a></li>
                            <li><a href="./">Privacy Policy</a></li>
                            <li><a href="./">Terms &amp; Conditions</a></li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-3 column">
                        <h6 className="text-primary">Want Updates?</h6>
                        <form>
                            <div className="form-group">
                                <input type="text" className="form-control" title="Enter your email. No spam, we promise!" placeholder="Enter your email address" />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-outline-primary text-uppercase small" data-toggle="modal" data-target="#modalSmall" type="button">Subscribe</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-12 col-md-3 text-md-right text-center">
                        <h6 className="text-primary">Were Social</h6>
                        <ul className="list-inline h4">
                            <li className="list-inline-item"><a rel="nofollow" href="//twitter.com/ThemesGuide" title="Twitter"><i className="icons icon-social-twitter"></i></a>&nbsp; </li>
                            <li className="list-inline-item"><a rel="nofollow" href="./" title=""><i className="icons icon-social-instagram"></i></a>&nbsp; </li>
                            <li className="list-inline-item"><a rel="nofollow" href="./" title="Facebook"><i className="icons icon-social-facebook"></i></a>&nbsp; </li>
                            <li className="list-inline-item"><a rel="nofollow" href="./" title="Dribbble"><i className="icons icon-social-dribbble"></i></a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
