import React, { Component } from "react";
import $ from "jquery";
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


class Usercreation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editdata: [],
      value: "",
      data: [],
      Pintext: "",
    }
    this.register = this.register.bind(this);
    this.check = this.check.bind(this);
    this.checkpin = this.checkpin.bind(this);
    this.checkleaderpan = this.checkleaderpan.bind(this);
  }
  calculateAge(birthMonth, birthDay, birthYear) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDate();
    var calculatedAge = currentYear - birthYear;

    if (currentMonth < birthMonth - 1) {
      calculatedAge--;
    }
    if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
      calculatedAge--;
    }
    return calculatedAge;
  }
  showToast = () => {
    toast.success("USer created succefully !");
  }
  check = (e) => {
    var txtPANCard = document.getElementById("pan");
    var lblPANCard = document.getElementById("lblPANCard")
    var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (regex.test(txtPANCard.value.toUpperCase())) {
      lblPANCard.style.visibility = "hidden";
      return true;
    } else {
      lblPANCard.style.visibility = "visible";
      return false;
    }
  }
  checkleaderpan = (e) => {
    var txtPANCard = document.getElementById("leaderpan");
    var lblPANCard = document.getElementById("leaderlblPANCard")
    var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (regex.test(txtPANCard.value.toUpperCase())) {
      lblPANCard.style.visibility = "hidden";
      return true;
    } else {
      lblPANCard.style.visibility = "visible";
      return false;
    }
  }

  checkpin = (e) => {
    var data = $(".pincode").val();
    if (data.length > 5) {
      // alert(data)
      const data_loc = {
        pincode: data,
      };

      axios.post("http://localhost:3001/api/StateCitybyPincode", data_loc)
        .then((response) => {
          console.log("res=", response.data)
          if (response.data.status === 200) {
            $("input[name=city]").val(response.data.data.District);
            $("input[name=state]").val(response.data.data.State);
            $("input[name=country]").val(response.data.data.Country);
            this.setState({ Pintext: "" });
            this.setState({ Citytext: "" });
            this.setState({ Statetext: "" });
          } else {
            this.setState({ Pintext: "Invalid Pin Code" });
            $("#city").val('');
            $("#state").val('');
            $("#country").val('');
          }

        });
    }
    else {
      this.setState({ Pintext: "Invalid Pin Code" });
    }
  }
  register = (e) => {
    e.preventDefault();
    var checkboxvalue = 3;
    var cdate = new Date().toISOString().slice(0, 10);
    var regex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    //  var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    var name = $(".name").val();
    var email = $(".email").val();
    var phone = $(".phone").val();
    var pass = $(".password").val();
    var cpass = $(".cpassword").val();
    var utype = $(".usertype").val();
    var pan = $(".pan").val();
    var leaderpan = $(".leaderpan").val();
    var relation = $(".relation").val();
    var dob = new Date($(".dob").val());
    var age = this.calculateAge(dob.getMonth() + 1, dob.getDate(), dob.getFullYear());
    var address = $(".address").val();
    var pincode = $(".pincode").val();
    var city = $(".city").val();
    var state = $(".state").val();
    var country = $(".country").val();
    var selectchecked = document.getElementById('checkiin');
    if (selectchecked.checked === true) {
      checkboxvalue = 1;
    } else {
      checkboxvalue = 0;
    }

    if (phone.length === 10) {
      if (pass.length > 5) {
        if (pass === cpass) {
          if (regex.test(pan)) {

            if (age > 18) {
              if (leaderpan === "") {
                $.ajax({
                  url: "http://localhost:3001/api/updateuser",
                  type: "POST",
                  data: { name: name, email: email, mobile: phone, pass: pass, cpass: cpass, utype: utype, pan: pan, leaderpan: leaderpan, relation: relation, dob: dob, address: address, pincode: pincode, city: city, state: state, country: country, check: checkboxvalue },
                  success: function (res) {
                    console.log("res=", res)
                    console.log("res1 =", res.status)
                    console.log("res2 =", res.message)
                    if (res.status === 200) {
                      // $("#servermsg").hide();
                      var showmsg = "<label style=" + 'color:red' + " >User updated successfully</label>"
                      $("#servermsg").html(showmsg);
                      window.scrollTo(0, 0)
                      document.getElementById("register-form").reset();

                    } else {
                      window.scrollTo(0, 0)
                      var showmsg = "<label style=" + 'color:red' + " >" + res.message + "</label>"
                      $("#servermsg").html(showmsg);

                    }
                  }.bind(this),
                  error: function (jqXHR) {
                    console.log(jqXHR);
                  }
                }).catch((error) => {
                  console.log("err=", error.status);
                })
              } else {
                if (relation === "" || relation === "null") {
                  alert("Please selct relation")
                  $(".relation").focus();
                } else {
                  $.ajax({
                    url: "http://localhost:3001/api/updateuser",
                    type: "POST",
                    data: { name: name, email: email, mobile: phone, pass: pass, cpass: cpass, utype: utype, pan: pan, leaderpan: leaderpan, relation: relation, dob: dob, address: address, pincode: pincode, city: city, state: state, country: country, check: checkboxvalue },
                    success: function (res) {
                      console.log("res3=", res)
                      console.log("res4 =", res.status)
                      console.log("res5 =", res.message)
                      if (res.status === 200) {
                        var showmsg = "<label style=" + 'color:red' + " >User updated successfully</label>"
                        $("#servermsg").html(showmsg);
                        window.scrollTo(0, 0)
                        document.getElementById("register-form").reset();
                      } else {
                        window.scrollTo(0, 0)
                        var showmsg = "<label style=" + 'color:red' + " >" + res.message + "</label>"
                        $("#servermsg").html(showmsg);
                      }
                    }.bind(this),
                    error: function (jqXHR) {
                      console.log(jqXHR);
                    }
                  }).catch((error) => {
                    console.log("err=", error.status);
                  })
                }
              }
            } else {
              alert("Age should be greater than 18")
              $(".dob").focus();
            }
          } else {
            alert("Please enter pan in correct format")
            $(".pan").focus()
          }
        } else {
          alert("password & confirm password not matched")
        }
      } else {
        alert("password is greater than six character")
        $(".password").focus()
      }
    } else {
      alert("please enter correct phone number ")
      $(".phone").focus()
    }
  }
  componentDidMount() {
      var newdata = JSON.parse(localStorage.getItem('data'));
      console.log("newdata-1",newdata[0])
       this.setState({ editdata: newdata[0]});
  }
  render() {
    var today = new Date();
    const values = {
      todate: today.getFullYear() + '-' + (("0" + (today.getMonth() + 1)).slice(-2)) + '-' + ("0" + today.getDate()).slice(-2)
    }
    return (
      <>
        <style jsx>
          {`
           .pan
           {
               text-transform: uppercase;
           }
           .leaderpan
           {
               text-transform: uppercase;
           }
           .panerror
           {
               color: Red;
               visibility: hidden;
           }
           .leaderpanerror
           {
               color: Red;
               visibility: hidden;
           }
         `}
        </style>
        <div className="content-wrapper">
          <section className="content-header p-1">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h3 className="mb-0">Edit User Detail</h3>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="admin">Home</a></li>
                    <li className="breadcrumb-item active">Edit User</li>
                  </ol>
                </div>
              </div>
            </div>{/* /.container-fluid */}
          </section>
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                {/* left column */}
                <div className="col-md-10 offset-md-1">
                  <div className="col-md-12">
                    <div className="card card-outline card-success">
                      <div className="card-header">
                        <form id="register-form" onSubmit={this.register.bind(this)}>
                          <div className="form-row">
                            <div className="form-group col-md-12">
                              <div id="servermsg"></div>
                              <ToastContainer />
                              <br />
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="name">Full Name</label>
                              <input type="text" className="form-control name" ref="fieldname" name="name" defaultValue={this.state.editdata.name}  required />
                              {/* <div><span className="error">{this.state.errors["name"]}</span></div> */}

                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="email">Email</label>
                              <input type="email" className="form-control email" ref="fieldemail" name="email" defaultValue={this.state.editdata.email} required readOnly />
                              {/* <div className="text-danger">{this.state.errors.email}</div> */}
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group  col-2 p-0">
                              <label htmlFor="inputCity">Mobile</label>
                              <input type="text" className="custom-phone-field form-control brtr brbr bltr blbr ml--1 " id="inputPhoneCode" placeholder="+91" name="code" readOnly />
                            </div>
                            <div className="form-group  col-10 p-0">
                              <label htmlFor="mnumber">&nbsp;</label>
                              <input type="text" className="custom-phone-field form-control bltr blbr ml--2 mt-0 phone" name="mnumber" ref="fieldnumber" placeholder="mobile number" defaultValue={this.state.editdata.phone}  required />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group  col-md-6">
                              <label htmlFor="password">Password</label>
                              <input type="password" className="form-control password" ref="fieldpassword" name="password" placeholder="********" required defaultValue={this.state.editdata.password} />
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="cpassword">Confirm Password</label>
                              <input type="password" className="form-control cpassword" ref="fieldcpassword" id="cpassword" name="password_confirmation" placeholder="********" defaultValue={this.state.editdata.password}  required />
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="usertype">User Type</label>
                              <select className="form-control usertype" ref="fieldusertype" required>
                                <option defaultValue={"Client"} >Client</option>
                              </select>
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="pancard">Pancard</label>
                              <input type="text" className="form-control pan" ref="fieldpan" id="pan" name="pancard" onChange={this.check} defaultValue={this.state.editdata.pan_card} required /><span id="lblPANCard" class="panerror">Invalid PAN Number</span>

                            </div>

                            <div className="form-group  col-md-6">
                              <label htmlFor="leader">Group Leader Pan</label>
                              <input type="text" className="form-control leaderpan" ref="fieldleaderpan" id="leaderpan" name="leader" defaultValue={this.state.editdata.group_leader} onChange={this.checkleaderpan} /><span id="leaderlblPANCard" class="leaderpanerror">Invalid PAN Number</span>
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="leader">Group Relation</label>
                              <select className="form-control relation" ref="fieldrelation" defaultValue={this.state.editdata.relation} >
                                <option value={this.state.editdata.relation}>{this.state.editdata.relation}</option>
                                <option value={"Father"}>Father</option>
                                <option value={"Mother"}>Mother</option>
                                <option value={"Wife"}>Wife</option>
                                <option value={"Husband"}>Husband</option>
                                <option value={"Sister"}>Sister</option>
                                <option value={"Brother"}>Brother</option>
                                <option value={"Son"}>Son</option>
                                <option value={"Daughter"}>Daughter</option>
                                <option value={"Other"}>Other</option>
                              </select>
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="pincode">Date of Birth</label>
                              <input type="date" className="form-control dob" id="from" defaultValue={this.state.editdata.date_of_birrth} />
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="address">Address</label>
                              <input type="address" className="form-control address" ref="fieldaddress" id="address" name="address" defaultValue={this.state.editdata.address} placeholder="Address" />
                            </div>

                            <div className="form-group  col-md-6">
                              <label htmlFor="pincode">Pincode</label>
                              <input type="pincode" className="form-control pincode" ref="fieldpincode" id="pincode" name="pincode" placeholder="221002" defaultValue={this.state.editdata.pincode} onKeyUp={this.checkpin} />
                              <div className="text-danger">{this.state.Pintext}</div>
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="city">City</label>
                              <input type="city" className="form-control city" ref="fieldcity" id="city" name="city" defaultValue={this.state.editdata.city} placeholder="City" />
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="state">State</label>
                              <input type="state" className="form-control state" ref="fieldstate" id="state" name="state" defaultValue={this.state.editdata.state} placeholder="State" />
                            </div>
                            <div className="form-group  col-md-6">
                              <label htmlFor="country">Country</label>
                              <input type="city" className="form-control country" ref="fieldcountry" id="country" name="country" defaultValue={this.state.editdata.country} placeholder="Country" />
                            </div>
                            <div className="form-group  col-md-6">
                                <input type="checkbox" id="checkiin" name="checkiin" defaultChecked={this.state.editdata.iin_portfolio==1?"checked":null} />
                              Show portfolio without IIN
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary" id="submit" value="Submit"  >
                            Update</button>

                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </div>


      </>
    );
  };
}
export default Usercreation;