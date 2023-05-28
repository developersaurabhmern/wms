import React from "react";
import { Component } from "react";
import { Redirect ,Route} from 'react-router-dom'
import $ from 'jquery';
import signup from "../../src/images/signup.svg";


class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state = {
      error: null,
      user: [],
      data: [],
    }
    localStorage.removeItem("user");
  }
  login = (e) => {
    e.preventDefault();
    var inputEmail = $(".email").val();
    var pass = $(".password").val();
    $.ajax({
      url: "http://localhost:3001/api/checklogin",
      type: "POST",
      data: { email: inputEmail, password: pass },
      success: function (res) {
        if(res.data !="" && res.data !=null){
          localStorage.setItem("user", res.data.NAME)
          this.setState({ data: res.data });
        }else{        
          this.setState({ user: res.data });
          if(this.state.user === null){
            $("#msg").css("display", "block");
            this.refs.fieldemail.value="";
            this.refs.fieldpassword.value="";
          }
        }
      }.bind(this),
      error: function (jqXHR) {
        console.log(jqXHR);
      }
    });
  }
  Signup = (e) => {
    e.preventDefault();
    var inputEmail = $(".email").val();
    var pass = $(".password").val();
    $.ajax({
      url: "http://localhost:3001/api/checklogin",
      type: "POST",
      data: { email: inputEmail, password: pass },
      success: function (res) {
         if(res.data !="" && res.data !=null){
         
          localStorage.setItem("user", res.data.NAME)
          this.setState({ data: res.data });
        }else{        
          this.setState({ user: res.data });
          if(this.state.user === null){
            $("#msg").css("display", "block");
            this.refs.fieldemail.value="";
            this.refs.fieldpassword.value="";
          }
        }
      }.bind(this),
      error: function (jqXHR) {
        console.log(jqXHR);
      }
    });
  }
  componentDidMount() {
    $("#msg").css("display", "none");
  }
  render() {
  
    if (this.state.data != "" && this.state.data != null) {
      return <Redirect to='/Home' />
    }
    const mystyle = {
      color: "red",
      display: "none",
    };
    return (
      <>
        <style jsx>{`
    .navbar{
      display:none;
    }
    #footer{
      display:none;
    }
      .admin-nav{
        display:none;
      }
      .main-sidebar{
        display:none;
      }
    `}</style>

        <section className="section_l_header login_section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <a href="index"><img src="http://pubweb.bfcgroup.in/images/logos/bfc-publications-logo.png" className="img-fluid" alt="" /></a>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-6 left_side">
                <div className="left_side_content">
                  <img src={signup} alt="signup" className="img-fluid" />
                </div>
              </div>
              <div className="col-md-6 right_side">
                <div className="register_block">
                  <h2 className="mb-3">Login using your credential</h2>
                  <div className="form_block w-100">
                    <form id="login-form" >
                      <div className="form-row">
                        <div className="form-group col-md-12">
                        <label id="msg" htmlFor="msg"  style={mystyle} >You have enter wrorng detail</label>
                        <br/>

                          <label htmlFor="email">Email</label>
                          <input type="text" className="form-control email" ref="fieldemail" name="email" placeholder="username@domainname.com" />
                          <label id="emaillog" />
                        </div>
                        <div className="form-group col-md-12">
                          <label htmlFor="password">Password</label>
                          <input type="password" className="form-control password" ref="fieldpassword" name="password" placeholder="********" />
                          <label id="passwordlog" />
                        </div>
                      </div>
                      <div className="form-row my-2">
                        <div className="form-group">
                          {/* <a href className="psd"><span className="float-right text-danger">Forget Password</span></a> */}
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary" id="login_button" onClick={this.login}>
                        Sign In</button>
                      <hr />
                      {/* <p className="dont_h_a mb-0 =">Don't have an account? <a href="signup" className="text-warning">Sign up</a></p> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};

export default Login;