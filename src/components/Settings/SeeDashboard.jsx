import React, { Component } from 'react';
import { Modal, Button, Card, Table } from "react-bootstrap"
import axios from 'axios';
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config/config';
const BEARER_TOKEN = localStorage.getItem("userData");
class SeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state =  {dashboardMenu:this.props.dashboardMenu,currRole:this.props.currRole}
        this.state.assignCard = this.assignCard.bind(this);
    }
    componentDidMount()
    {

    }
    componentDidUpdate(prevProps) {
    	if(prevProps.dashboardMenu !== this.props.dashboardMenu) {
            this.setState({dashboardMenu:this.props.dashboardMenu})
        }
        if(prevProps.currRole !== this.props.currRole) {
            this.setState({currRole:this.props.currRole})
        }
    }
    assignCard(e,view,field_id)
    {
    	console.log('view',typeof view);
    	var newView = (view)? 0 : 1
    	const bearer = 'bearer ' + BEARER_TOKEN;
    	var final_data = {};
    	final_data.fieldId = field_id
    	final_data.roleId = this.state.currRole;
    	final_data.view = newView;
    	final_data.for_others = 0;
        axios.post(config.API_URL+'/setting/save-field-setting',final_data,{ headers: { Authorization: bearer }})
            .then(r=>{
                if(r.status==200 && r.data.success==true)
                {
                  
                   this.props.getDashboardFields(this.state.currRole);
                   toast.success('role updated successfully');
                }
                else
                {
                	toast.error('Something went wrong,Please try again.');
                            setTimeout(() => {
                                 toast.dismiss()
                              }, 2000)
                }
            }).catch(error=>{
            	toast.error('Something went wrong,Please try again.');
                            setTimeout(() => {
                                 toast.dismiss()
                              }, 2000)
            })
    }
    render()
    {

    	let items = this.state.dashboardMenu.map((obj)=>{
    		var active = obj.view ? 'active':'';
           console.log('dsd dashboard rights',obj);
            var view = obj.view;
    		return  <div className="col-lg-3" onClick={(e)=>this.assignCard(e,view,obj.fieldId)}>
                        <Card className={"card d-block p-1 mb-4 shadow-sm card seeboard "+active}>
	                        <i></i>
	                        <p>{obj.fieldTitle}</p>
                        </Card>
            		</div>
    	})
    	return(
    							<>
    							 <ToastContainer className="right" position="top-right"
					                    autoClose={2000}
					                    hideProgressBar={false}
					                    newestOnTop={false}
					                    closeOnClick
					                    rtl={false}
					                    draggable
					            />
    		                     <div className=" mt-4  pr-3">
                                        <div className="pl-4 pr-4">
                                            <div className="row">                                               
                                            {items}                                               
                                            </div>
                                            
                                        </div>
                                    </div>
                                    </>
    	)
    }
}
export default SeeDashboard;