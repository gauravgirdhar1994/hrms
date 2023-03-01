import React from 'react';
import {Form, Button} from "react-bootstrap"
import config from '../config/config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class AddFaq extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {question:'',answer:'',status:'',token: localStorage.getItem("userData"),faq_id:0,disabled:false}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFaq = this.getFaq.bind(this);
    }
    componentDidMount()
    {
        var faq_id = this.props.match.params.id;
        if(faq_id)
        {
            this.setState({faq_id:faq_id});
            this.state.faq_id = faq_id;
            this.getFaq();
        }
    }
    handleChange(e)
    {
        var name =e.target.name;
        var val = e.target.value        
        var obj = {[name]:val}
       // console.log(obj);
        this.setState(obj);
    }
    handleSubmit(e)
    {
        e.preventDefault();
        this.setState({disabled:true});
        document.getElementById('save_faq').innerHTML = 'Loading...'
        let datas = {
            'question':this.state.question,
            'answer':this.state.answer,
            'status':this.state.status,
            'faq_id':this.state.faq_id
        }
        ///let ids = Math.floor(Math.random() * 100) + 55;
        const apiUrl = config.API_URL+'/add-faq';
        var bearer = 'Bearer ' + this.state.token;
        // this.props.editData(datas, apiUrl, bearer)
        const headers = {
            "Authorization": bearer,            
        }

        // console.log('headers => ', headers);
        axios.post(apiUrl, datas, {headers: headers})
            .then(r => {
                
           if (r.status==200 && r.data.success) {
            window.location.href=config.BASE_URL_FRONTEND+'/faq/faq-list'
        
            }
            else
            {
                toast.error('Something went wrong,Please try again.');  
            }
       
        document.getElementById('save_faq').innerHTML = 'Save'
        this.setState({disabled:false});
        }).catch((error)=>{
            console.log(error);
            toast.error('Something went wrong,Please try again.'); 
            document.getElementById('save_faq').innerHTML = 'Save'
            this.setState({disabled:false});
        })
        setTimeout(function(){
            toast.dismiss()
        },2000)
       // console.log('SProps'+53,this.props)
        //this.setState({show:false})
    }
    getFaq()
    {
        const apiUrl = config.API_URL+'/get-faq/'+this.state.faq_id;
        var bearer = 'Bearer ' + this.state.token;
        const headers = {
            "Authorization": bearer,
        }
        axios.get(apiUrl,{headers: headers})
        .then(res => {
            console.log('res',res);
           if(res.status==200 && res.data.success==true && res.data.data.length>0)
           {
               this.setState({question:res.data.data[0]['question'],answer:res.data.data[0]['answer'],status:res.data.data[0]['status']})
           }
        }).catch((error)=>{
            console.log(error);
        })
    }
    render()
    {
        var statusOpt = Object.keys(config.STATUS).map((index)=>{
            return <option value={index} key={index} >{config.STATUS[index]}</option>
        })
        var blankOption = <option value="">Select Status</option>;
        statusOpt.unshift(blankOption);
       // console.log(statusOpt);
        return(
            <div className="mt-5 ml-5">
                 <ToastContainer className="right" position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover />
                <h3 className='mb-5'>Add FAQ</h3>
             <Form>
                <fieldset>
                    <label htmlFor="jobDetails" className="mb-0">Question</label>
                    <div className="row mb-3">
                        <div className="col-lg-12">
                            <textarea type="text" id="question" name="question" onChange={this.handleChange} defaultValue={this.state.question}  placeholder="" className="form-control" required="" />
                        </div>
                    </div>
                    <label htmlFor="jobDetails" className="mb-0">Answer</label>
                    <div className="row mb-3">
                        <div className="col-lg-12">
                            <textarea type="text" id="answer" name="answer" onChange={this.handleChange} defaultValue={this.state.answer}  placeholder="" className="form-control" required="" />
                        </div>
                    </div>
                    <label htmlFor="jobDetails" className="mb-0">Status</label>
                    <div className="row mb-3">
                        <div className="col-lg-6">
                            <select name='status' onChange={this.handleChange} value={this.state.status} className="form-control" required="">
                             {statusOpt}
                            </select>
                        </div>
                    </div>
                    <Button type="submit" id='save_faq' disabled={this.state.disabled} variant="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
                </fieldset>
            </Form>
            </div>
            
        )
    }
}
export default AddFaq;