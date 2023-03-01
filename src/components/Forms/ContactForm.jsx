import React from 'react';

class ContactForm extends React.Component{

    static defaultProps = {
        formName: "contactForm",
        submitBtnText: "Send Message",
        method: "POST",
        className: ""
    };
    
    render(){
        const { formName, submitBtnText, method, className } = this.props;
        return (
            <form className={'form ' + className} autoComplete="off" id={formName} name={formName} noValidate="" method={method}>
                <fieldset>
                    <label htmlFor="name2" className="mb-0">Name</label>
                    <div className="row mb-1">
                        <div className="col-lg-12">
                            <input type="text" name="name2" id="name2" className="form-control" required="" />
                        </div>
                    </div>
                    <label htmlFor="email2" className="mb-0">Email</label>
                    <div className="row mb-1">
                        <div className="col-lg-12">
                            <input type="text" name="email2" id="email2" className="form-control" required="" />
                        </div>
                    </div>
                    <label htmlFor="message2" className="mb-0">Message</label>
                    <div className="row mb-1">
                        <div className="col-lg-12">
                            <textarea rows="6" name="message2" id="message2" className="form-control" required=""></textarea>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-secondary btn-lg float-right">{submitBtnText}</button>
                </fieldset>
            </form>
        );
    }
}

export default ContactForm;
