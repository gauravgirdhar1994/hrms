import React, { Component } from 'react';
// import userDetail from '../../services/userDetail'
import { connect } from "react-redux";
import { fetchData } from "../../action/fetchData";
import { editData } from "../../action/editData";

import { Modal, Form, Button } from "react-bootstrap"
import NumberFormat from 'react-number-format';
import config from '../../config/config';
import loader from '../../loader.gif';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import axios from 'axios';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import FormLoader from '../../components/Loaders/DataLoading';

const BEARER_TOKEN = localStorage.getItem("userData");

class FormComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: true,
            data: [],
            form: [],
            fields: [],
            response: "",
            token: localStorage.getItem("userData"),
            dropdowns: []
        }
        this.setState({
            form: this.props.item
        })
        console.log('Dependent data Props',this.props.data);
        // this.props.handleChange = this.props.handleChange.bind(this);
        // this.props.uploadFile = this.props.uploadFile.bind(this);
        this.RenderDesign1 = this.RenderDesign1.bind(this);
        this.RenderDesign2 = this.RenderDesign2.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);

    }

    componentDidMount() {
        // this.refreshdata()
        var bearer = 'Bearer ' + BEARER_TOKEN;
        axios.get(config.API_URL + '/field-access-list?menuId='+this.props.menuId, { headers: { Authorization: bearer } })
            .then(r => {
                if (r.status == 200) {
                    console.log('fieldList',r.data.fieldList);
                    this.setState({ fields: r.data.fieldList });
                    let dropdowns = [];
                    if(this.state.fields){
                        this.state.fields.map((inputField, index) => {
                            dropdowns.push(inputField.fieldName);
                            if(index === Object.keys(this.state.fields).length - 1){
                                this.setState({
                                    dropdowns : dropdowns
                                })
                            }
                        })
                        
                    }
                }
            })
            .catch((error) => {
                console.log("API ERR: ");
                console.error(error);
            });
            
            
    }

    addDefaultSrc(ev){
        ev.target.src = config.DEFAULT_USER_IMG_URL
    }

//    shouldComponentUpdate(nextProps, nextState) {
//        console.log(55, nextState);
//        if (this.state.fields == nextState.fields)
//            return false;
//
//        return true;
//    }

    componentDidUpdate(prevProps, prevState) {

    }
    
    handleChange = (event) => {
        console.log('Input event',event.target.value);
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
        form: {
            ...this.state.form, [name]: value
        }
        })
        this.props.handleChange(event)
        console.log('Input event', this.state.form);
    }
    handlePhoneChange = (value, country, e, formattedValue, name) => {
        
        let phonevalue = formattedValue;
        this.setState({
        form: {
            ...this.state.form, [name]: phonevalue
        }
        })
        let event = {
            target:{
                name: name,
                value: formattedValue
            }
        };
        this.props.handleChange(event)
        // console.log('Input event', this.state.form);
    }
    
    dateChange = (name, date) => {
        // console.log('BirthDate', name,date,Moment(date).format('MM/DD/YYYY'))
        this.setState({
            form: {
                ...this.state.form, [name]: (date)?date:''
            }
        })
        this.state.form[name] = (date)?date:'';  
      //  console.log('Date change', this.state.form[name]);
        this.props.dateChange(name,this.state.form[name])
    }

    contains = (str, exp) => {
        if(str.includes(exp)){
                return true;
        }
        else{
                return false;
        }
    }

    handleCencil = () => { this.setState({ show: true }) };
    RenderDesign1()
    {
        const { item } = this.props;
        console.log('dcds Props',this.props);
        if (this.state.fields && this.state.fields.length > 0) {
            const inputFields = this.state.fields;
            // console.log('Input Fields', this.state.fields);
            
            return (
                
                <ul className="myinfoListing">
                   
                        {inputFields.map((inputField, index) => {
                            var disabled='';
                            var cursor_disabled_css_class=''; 
                            var hideLabel=''; 
                            var dateVal = this.state.form[inputField.fieldName] !== undefined ? new Date(this.state.form[inputField.fieldName]) : (item && item[inputField.fieldName]) ? new Date(item[inputField.fieldName]) : '';
                            var dateSel = this.state.form[inputField.fieldName] !== undefined ? new Date(this.state.form[inputField.fieldName]) : (item && item[inputField.fieldName]) ? new Date(item[inputField.fieldName]) : '';
                            if(inputField.view == 1 && inputField.update == 0)
                            {
                                disabled = 'disabled';
                                cursor_disabled_css_class = ' disable-pointer'
                            }
                            if(inputField.view == 0){
                                hideLabel = 'hide';
                            }
                            switch (inputField.fieldType) {
                                case "text" : return <li className={hideLabel}><label htmlFor={inputField.fieldName}>{inputField.fieldTitle}</label><span><input type="text" className={"form-control"+cursor_disabled_css_class} onChange={this.handleChange} id={inputField.fieldName} name={inputField.fieldName} disabled={disabled} value={this.state.form[inputField.fieldName] !== undefined ? this.state.form[inputField.fieldName] : item ? item[inputField.fieldName] : '' }/></span> </li>;
                                case "phone-text" : return <li className={hideLabel}><label htmlFor={inputField.fieldName}>{inputField.fieldTitle}</label><span><PhoneInput country={'ae'} className={"form-control"+cursor_disabled_css_class} onChange={(value, data, event, formattedValue) => this.handlePhoneChange(value, data, event, formattedValue,inputField.fieldName)} id={inputField.fieldName} name={inputField.fieldName} disabled={disabled} value={this.state.form[inputField.fieldName] !== undefined ? this.state.form[inputField.fieldName] : item ? item[inputField.fieldName] : '' }/></span> </li>;
                                case "date" : return <li className={hideLabel}><label htmlFor={inputField.fieldName}>{inputField.fieldTitle}</label><span><DatePicker autoComplete="off" selected={dateSel} dateFormat={config.DP_INPUT_DATE_FORMAT} showYearDropdown dropdownMode= "scroll" className={"form-control"+cursor_disabled_css_class} minDate={this.contains(inputField.fieldName,'expiryDate') ? Moment().toDate() : ''} value={dateVal} onChange={this.dateChange.bind(this, inputField.fieldName)} disabled={disabled} name={inputField.fieldName} id={inputField.fieldName} /></span> </li>;
                                case "textarea" : return <li className={hideLabel}><label htmlFor={inputField.fieldName}>{inputField.fieldTitle}</label><span><textarea type="text" value={this.state.form[inputField.fieldName] !== undefined ? this.state.form[inputField.fieldName] : item ? item[inputField.fieldName] : '' } id={inputField.fieldName} name={inputField.fieldName} disabled={disabled} onChange={this.handleChange} className={"form-control"+cursor_disabled_css_class} required="" /></span> </li>;
                                case "select" : return <li className={hideLabel}><label htmlFor={inputField.fieldName}>{inputField.fieldTitle}</label><span><select className={"form-control"+cursor_disabled_css_class}  onChange={this.handleChange} ref={inputField.fieldName} name={inputField.fieldName} value={this.state.form[inputField.fieldName] !== undefined ? this.state.form[inputField.fieldName] : item ? item[inputField.fieldName] : '' } disabled={disabled}><option selected value=''>Select {inputField.fieldTitle}</option>{this.props[inputField.fieldName] ? this.props[inputField.fieldName] : ''}</select></span> </li>;
                                case "file" : return <li className={hideLabel}> <label>Upload {inputField.fieldTitle} </label> <span> <label htmlFor="uploadId" className="squireUpload">{item ? (<img onError={this.addDefaultSrc} src={this.props.imgSrc ? this.props.imgSrc : item ? config.BASE_URL+item[inputField.fieldName] : ''} width="150"></img>) : this.props.imgSrc === '' ? ( <small> {inputField.fieldTitle} </small>) : ''} <input type="file" name="file" id="uploadId" onChange={this.props.uploadFile}/> </label> </span> </li>;
                                case "number-format" : return <li className={hideLabel}><label htmlFor={inputField.fieldName}>{inputField.fieldTitle}</label><span><NumberFormat value={this.state.form[inputField.fieldName] !== undefined ? this.state.form[inputField.fieldName] : item ? item[inputField.fieldName] : '' } format="###-####-#######-#" className={"form-control"+cursor_disabled_css_class} id={inputField.fieldName} name={inputField.fieldName} disabled={disabled} onValueChange={(values) => {
                                    const {formattedValue, value} = values;
                                    this.setState({form: {
                                        ...this.state.form, [inputField.fieldName]: formattedValue
                                    }})
                                    let event = {
                                        target:{
                                            name: inputField.fieldName,
                                            value: formattedValue
                                        }
                                    };
                                    this.props.handleChange(event)
                                  }} />
                                </span> </li>;
                            }
                        })
                    }
            
                </ul>

            )
        }
        else {
            return <FormLoader/>
        }
    }
    RenderDesign2()
    {
        const { item } = this.props;
        if (this.state.fields && this.state.fields.length > 0) {
            const inputFields = this.state.fields;
            return (
                <fieldset>
                   
                        {inputFields.map((inputField, index) => {
                            var disabled='';
                            var cursor_disabled_css_class=''; 
                             var dateVal = this.state.form[inputField.fieldName] !== undefined ? new Date(this.state.form[inputField.fieldName]) : item ? new Date(item[inputField.fieldName]) : '';
                            var dateSel = this.state.form[inputField.fieldName] !== undefined ? new Date(this.state.form[inputField.fieldName]) : item ? new Date(item[inputField.fieldName]) : '';
                            if(inputField.view == 1 && inputField.update == 0)
                            {
                                disabled = 'disabled';
                                cursor_disabled_css_class = ' disable-pointer'
                            }
                            switch (inputField.fieldType) {
                                case "text" : return <div> <label htmlFor={inputField.fieldName} className="mb-0">{inputField.fieldTitle} *</label><div className="row mb-3"><div className="col-lg-12"><input type="text" id={inputField.fieldName} name={inputField.fieldName} onChange={this.handleChange} placeholder="" className={"form-control"+cursor_disabled_css_class}  defaultValue={this.props.item[inputField.fieldName]} required="" disabled={disabled}/></div></div> </div>;
                                case "textarea" : return <div> <label htmlFor={inputField.fieldName} className="mb-0">{inputField.fieldTitle}</label><div className="row mb-3"><div className="col-lg-12"><textarea type="text" id={inputField.fieldName} name={inputField.fieldName} onChange={this.handleChange} defaultValue={this.props.item[inputField.fieldName]}  placeholder="" className={"form-control"+cursor_disabled_css_class} required="" disabled={disabled}/></div></div> </div>;
                                case "date" : return <div> <label htmlFor={inputField.fieldName} className="mb-0">{inputField.fieldTitle}</label><div className="row mb-3"><div className="col-lg-12"><DatePicker autoComplete="off" showYearDropdown selected={dateSel} dateFormat={config.DP_INPUT_DATE_FORMAT} dropdownMode= "scroll" className={"form-control"+cursor_disabled_css_class} onChange={this.dateChange.bind(this, inputField.fieldName)} value={dateVal} name={inputField.fieldName} id= {inputField.fieldName} disabled={disabled}/></div></div> </div>;
                            }
                        })
                    }
            
                </fieldset>

            )
        }
        else {
            return <FormLoader/>
        }
    }
    render() {
        {
         var design  = (this.props.design)?this.props.design:'design1';
         switch(design)
         {
             case 'design2':
                 {
                     return (this.RenderDesign2());
                     break;
                 }
             default:
                  return (this.RenderDesign1());
         }
        }
    }
}


const mapStateToProps = state => {
    // console.log(256, 'Props Strat',state);
    return {
        item: state.datas,
        error: state.datas.error,
        loading: state.datas.loading,
        success: state.datas.success
    }
}

export default FormComponent;