import React from "react";
//import ReactDOM from 'react-dom';

import signup from "../../src/images/signup.svg";
const Signup = () => {
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
              <a href="home"><img src="http://pubweb.bfcgroup.in/images/logos/bfc-publications-logo.png" className="img-fluid" alt=""/></a> 
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
           
                <div className="form_block w-100">
                  <h3>Take a First Step</h3>
                  <form id="register-form">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="fname">First Name</label>
                        <input type="text" className="form-control" name="fname" placeholder="Enter first name" />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="lname">Last Name</label>
                        <input type="text" className="form-control" name="lname" placeholder="Enter Last Name" />
                      </div>
                      <div className="form-group  col-md-12">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" name="email" placeholder="username@domainname.com" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group  col-2 p-0">
                        <label htmlFor="inputCity">Mobile</label>
                        <input type="text" className="custom-phone-field form-control brtr brbr bltr blbr ml--1 " id="inputPhoneCode" placeholder="+91" name="code" readOnly/>
                      </div>
                      <div className="form-group  col-10 p-0">
                        <label htmlFor="mnumber">&nbsp;</label>
                        <input type="text" className="custom-phone-field form-control bltr blbr ml--2 mt-0" name="mnumber" placeholder="mobile number" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group  col-md-6">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" placeholder="********" />
                      </div>
                      <div className="form-group  col-md-6">
                        <label htmlFor="cpassword">Confirm Password</label>
                        <input type="password" className="form-control" id="cpassword" name="password_confirmation" placeholder="********" />
                      </div>
                      <div className="form-group  col-md-12">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="gridCheck" name="accept" defaultValue="yes" />
                          <label className="form-check-label" htmlFor="gridCheck">
                            I accept the terms and condition.
                          </label>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-register w-100 btn-loader" id="submit_button">
                      Register</button>
                    <p>Already Register ? <a href="login" className="text-danger btn-sm "> Login </a></p>
                  </form>
               
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Signup;