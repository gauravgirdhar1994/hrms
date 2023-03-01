import React from 'react';
import { Wrapper } from '../components';
import config from '../config/config';
import axios from 'axios';
class Faq extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {token:localStorage.getItem("userData"),faq_arr2:[]}
        this.getAllFaq = this.getAllFaq.bind(this);
    }
    componentDidMount()
    {
        this.getAllFaq();
        
    }
    getAllFaq()
    {
        const apiUrl = config.API_URL+'/get-faq';
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
        }
        axios.get(apiUrl,{headers: headers})
        .then(res => {
            console.log('res',res);
           if(res.status==200 && res.data.success==true && res.data.data.length>0)
           {
               this.setState({faq_arr2:res.data.data})
           }
        }).catch((error)=>{
            console.log(error);
        })
    }
    render(){
        var faq = this.state.faq_arr2.map((obj,index)=>{
            var show = (index==0)?' show':'';
            return <div className="card">
            <div className="card-header bg-transparent p-2" id={'heading'+index}>
                <h5 className="mb-0">
                    <button className="btn btn-link w-100 text-left" type="button" data-toggle="collapse" data-target={'#collapse'+index} aria-expanded="true" aria-controls={'collapse'+index}>
                      {'Q'+(index+1)+' '+obj.question}
                    </button>
                  </h5>
            </div>

            <div id={'collapse'+index} className={"collapse"+show} aria-labelledby={'heading'+index} data-parent="#faqExample">
                <div className="card-body">
                    <p className="font-weight-bold">Answer:</p>
                    <p>
                        {obj.answer}
                    </p>
                    <a href={config.BASE_URL_FRONTEND+'/faq/edit-faq/'+obj.id} >Edit</a>
                </div>
                
            </div>
           
        </div>
        })
        return (
            <Wrapper>
                 <div className="row flex-grow-1">
                    <div className="col">
                        <h4 className="mb-3 font-weight-light">Frequently Asked Questions</h4>
                        <div className="row">
                            <div className="col-12 mx-auto">
                                <div className="accordion" id="faqExample">
                                   {faq}                                     
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default Faq;
