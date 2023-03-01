/* 
    Date:29-05-2020
    Author:Manoj Kalra
 */
import React, { Component } from 'react';
import {Modal,Button} from "react-bootstrap"
import config from '../../config/config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BEARER_TOKEN = localStorage.getItem("userData");

class WishPopup extends Component
{
    constructor(props)
    {
        super(props);
         var text = 'Happy ' +(this.props.WishData.type)[0].toUpperCase() +  
            (this.props.WishData.type).slice(1)+' '+this.props.WishData.firstname+' '+this.props.WishData.lastname;
        this.state = {wish:text,WishData:this.props.WishData,
            WishPopupShow:this.props.WishPopupShow,disabled:false};
        this.handleChange = this.handleChange.bind(this);
        this.sendWish = this.sendWish.bind(this);
        //console.log('efef',this.state)
    }
    handleChange(e)
    {
        this.setState({'wish':e.target.value})
    }
    sendWish()
    {
        this.setState({disabled:true});
        document.getElementById('send_wish').innerHTML = 'Loading...'
        var bearer = 'bearer ' + BEARER_TOKEN;
        let finalData = {};
        finalData.text = this.state.wish;
        finalData.recieverId = this.state.WishData.id;
       axios.post(config.API_URL+'/dashboard/send-wish-request',finalData,{ headers: { Authorization: bearer }})
       .then(r => {
          
           if (r.status==200 && r.data.success) {
                toast.success(r.data.message);
                setTimeout(() => {
                    this.setState({WishPopupShow: false});
                  }, 2000)
               //this.setState({WishPopupShow : false});
           }
           else
           {
              toast.error('Something went wrong,Please tryy again.');  
           }
           setTimeout(function(){
                toast.dismiss()
            },2000)
            document.getElementById('send_wish').innerHTML = 'Wish'
            this.setState({disabled:false});
       })
       .catch((error) => {
           console.log("API ERR: ");
           console.error(error);
            document.getElementById('send_wish').innerHTML = 'Wish'
            this.setState({disabled:false});
           // res.json({ error: error });
       });
      
    }
    handleClose = () => {
        this.setState({ WishPopupShow: false })
        this.props.hideWishPopup();
    }
    render()
    {
        //console.log('rtg',this.state);
        var text = this.state.WishData.firstname+' '+this.state.WishData.lastname+' '+(this.state.WishData.type)[0].toUpperCase() +  
            (this.state.WishData.type).slice(1);
    return (
            <div>
            <ToastContainer className="right" position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover />
            <Modal show={this.state.WishPopupShow} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h6>Post Your Wishes For {text}</h6></Modal.Title>
            </Modal.Header>                      
            <Modal.Body>

                            <fieldset>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <textarea type="text" id="wish" name="wish" onChange={this.handleChange} defaultValue={this.state.wish}  className="form-control" required="" />
                                    </div>
                                </div>
                                <Button type="button" disabled={this.state.disabled} id='send_wish' onClick={!this.state.disabled?this.sendWish:null}>
                            Wish
                        </Button>
                            </fieldset>

            </Modal.Body>   
             <Modal.Footer>
                        
                        </Modal.Footer>
            </Modal>
            </div>
    )
    }
}

export default WishPopup;