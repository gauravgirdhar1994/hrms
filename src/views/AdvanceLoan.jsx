import React from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import config from '../config/config';
import { Wrapper} from '../components';
import {OverallAdvanceLoan} from '../components/MultiComponents';
import { Row, Col} from 'reactstrap';
import AdvanceLoanListing from '../components/AdvanceLoan/AdvanceLoanListing';
import AddLoan from '../components/AdvanceLoan/AddLoan';
import {Modal,Button} from "react-bootstrap"
const BEARER_TOKEN = localStorage.getItem("userData");
var role_id = localStorage.getItem("role");
var roleSlug = localStorage.getItem("roleSlug");
class AdvanceLoan extends React.Component{
	constructor(props)
	{
		super(props);
		this.state = { redirectToReferrer: false,advanceLoanArr:[],overall:{'advance_amount':0,'deduction':0,
    'balance':0,'ded_this_month':0},'advanceLoanRow':{},addNewLoanShow:false,emp_id:'',emp_id_add_loan:'',
    employee_option:<option value={localStorage.getItem("employeeId")}>All</option>}
		this.getAdvanceLoan= this.getAdvanceLoan.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.OpenAddLoanForm = this.OpenAddLoanForm.bind(this);
    this.editLoan = this.editLoan.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.getEmployeeList = this.getEmployeeList.bind(this);
     this.getAdvanceLoanEmpId = this.getAdvanceLoanEmpId.bind(this)
	}
	componentDidMount() {
// 
        if(localStorage.getItem("userData")){
          if(config.advance_loan_role_id_allow.indexOf(roleSlug)!=-1)
          {
            this.getEmployeeList();
          }
          else
          {
              this.setState({emp_id:localStorage.getItem("employeeId")});
              this.state.emp_id = localStorage.getItem("employeeId");
              //this.getAdvanceLoan();  
          }
          
        	this.getAdvanceLoan();
        }       
        else{
         this.setState({redirectToReferrer: true});
        }
        
     
       }
    getAdvanceLoan()
    {
       var bearer = 'bearer ' + BEARER_TOKEN;
       console.log('emp_id',this.state.emp_id)
    	axios.get(config.API_URL+'/payroll/get-advance-loan-detail?emp_id='+this.state.emp_id,{ headers: { Authorization: bearer }})
       .then(r => {
          
           if (r.status==200 && r.data.success) {
           	console.log('r',r)
                this.setState({advanceLoanArr:r.data.data.advanceLoanArr,overall:r.data.data.overall})
           }

       })
       .catch((error) => {
           console.log("API ERR: ");
           console.error(error);
       });
    }
    handleClose()
    {
      this.setState({addNewLoanShow:false})
    }
    OpenAddLoanForm()
    {
      this.setState({addNewLoanShow:true,emp_id:this.state.emp_id,advanceLoanRow:{}})
    }
    editLoan(data)
    {
      //console.log('efef',data)
      this.setState({addNewLoanShow:true,advanceLoanRow:data,emp_id_add_loan:data.emp_id})
    }
    handleChange=(event)=>
    {
       //console.log(event)
        var name = event.target.name;
        var val = event.target.value;
        var obj = {[name]:val}
          //console.log(obj)
        this.setState(obj);
    }
    getEmployeeList()
    {
        const headers = {
            "Authorization": 'bearer '+BEARER_TOKEN,
        }
        var orgId = localStorage.getItem("orgId");
        axios.get(config.API_URL+'/employees/list?orgId='+orgId,{headers: headers})
            .then(res => {
                //console.log(res.data.employees.rows);
                if(res.data.employees.rows.length>0)
                {
                    let employee_option = res.data.employees.rows.map((obj,index)=>{
                        return <option value={obj.id} key={index}>{obj.empDetails.personal.firstname+' '+obj.empDetails.personal.lastname}</option>
                    })
                    var AllOption = <option value=''>All</option>
                    employee_option.unshift(AllOption);
                    this.setState({employee_option:employee_option})
                }
                })
    }
    getAdvanceLoanEmpId(e)
    {
      //var val='';
      // if(e.target.value=='')
      // {
      //   val = localStorage.getItem("employeeId");
      // }
      // else{
        var val = e.target.value;
     // }
      this.setState({'emp_id':val,emp_id_add_loan:val});
      this.state.emp_id = val;
      this.getAdvanceLoan();      
    }
	render()
	{
		//console.log('advanceLoanArr',this.state.advanceLoanArr);
		 if (this.state.redirectToReferrer) {
            return (<Redirect to={'/login'}/>)
          }
		return(
			// <Wrapper>
      //           <main className="flex-fill">
      //             <OverallAdvanceLoan overall_advance_loan={this.state.overall} />
      //           </main>
      //       </Wrapper>

      <>

        <div className="p-3">
        {(config.advance_loan_role_id_allow.indexOf(roleSlug)!=-1)?<div className="row mb-3">
            <div className="col-lg-6">
            <h4 class="font-16 pl-3">Select Employee</h4>
                <select className="form-control custom-select" onChange={this.getAdvanceLoanEmpId} name='emp_id' id='emp_id' value={this.state.emp_id}>{this.state.employee_option}</select>
            </div>
        </div>:''}
        <OverallAdvanceLoan overall_advance_loan={this.state.overall} />
        {((roleSlug=='hr' || roleSlug=='super-admin') && this.state.emp_id!='')?<div className="card d-block  shadow-sm text-center pb-50">
              <div className="onboardingRequest" onClick={this.OpenAddLoanForm}> <span>+</span> New Advance Loan</div>              
        </div>:''}
        <AdvanceLoanListing advanceLoanArr={this.state.advanceLoanArr}  editLoan={this.editLoan} />
        </div>

        <Modal show={this.state.addNewLoanShow} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h6>Advance Loan Request</h6></Modal.Title>
            </Modal.Header>                      
            <Modal.Body>           
              <AddLoan advanceLoanRow={this.state.advanceLoanRow} handleClose={this.handleClose} getAdvanceLoan={this.getAdvanceLoan} emp_id={this.state.emp_id_add_loan}/>
            </Modal.Body>   
             <Modal.Footer>
                        
            </Modal.Footer>
            </Modal>
    </>
		)
	}
}
export default AdvanceLoan