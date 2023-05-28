import React from "react";
import { Component } from "react";
import { Redirect ,Route} from 'react-router-dom'
import $ from 'jquery';

class Userlogin extends Component { 
  constructor(props) {
    super(props);
  
    this.state = {
      searchname: [],
      userdata: [],
      totalpurchase:[],
      totalcurrent:[],
      totalgain:[],
      user:'',
    };
  
  }

  logout = (e) => {
    e.preventDefault();
    window.localStorage.clear();
    window.location.href = "/Login";
  }
  componentDidMount(){
    document.title = "WMS | Dashboard"
    if(localStorage.getItem("user") != ""){
     
      // localStorage.setItem("user",username)
      this.setState({ user: localStorage.getItem("user") });
    }
  }
  render(){
    var user = localStorage.getItem("user")
    localStorage.setItem("user",user)
   // alert(user)
    if (user != "" && user != null) {
      return <Redirect to='/Home' />
    }
  return (  
    <>
    
   
   {/* Content Wrapper. Contains page content */}
   <div className="content-wrapper">
      </div>
      {/* /.content-wrapper */}
    </>
  );
 }
};

export default Userlogin;
