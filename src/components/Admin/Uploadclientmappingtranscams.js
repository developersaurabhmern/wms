import React from "react";
import { Component } from "react";
import $ from 'jquery';
import axios from 'axios';
import { DataTable } from 'mdbreact';
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Uploadclientmappingtranscams extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkboxstate: [],
      searchdata: [],
      data1: [],
      data2: [],
      oldarray: [],
      newarray: [],
    };
  }

  getPan = (e) => {
    this.setState({ checkboxstate: e.target.value })
  }
  // showToast = () => {
  //   toast("USer created succefully !");
  // }
  addnewclient(e) {
    var newdataarray = [];
    var inputvalue = e.split('/');
    var name = inputvalue[0];
    var pan = inputvalue[1];
    var index = inputvalue[2];
    for (var i = 0; i < this.state.oldarray.length; i++) {
      if (name === this.state.oldarray[i].INV_NAME) {
        newdataarray.push(this.state.oldarray[i])
      }
    }
    axios.post('http://localhost:3001/api/addtranscams', { name: name, pan: pan, data: newdataarray })
      .then(res => {
        console.log("test res=", res)
        // $(".loader").css("display", "none");
        var dataarray = [];
        this.state.data1.map((val, key) => {
          console.log("pan=", val.INV_NAME, "name=", val.INV_NAME, "below pan", pan)
          if (val.INV_NAME != name) {
            dataarray.push(val);
            console.log("dataarray if=", dataarray)
            $("#datasection").css("display", "block");
            $("#uploaddata").css("display", "block");
            $("#uploaddatamsg").css("display", "none");
            $("#datasectionresult").css("display", "none");
            document.getElementById("searchpan").value = "";
            document.getElementById("searchname").value = "";
            localStorage.setItem('data1', JSON.stringify(dataarray));
            this.setState({ data1: dataarray })
          } else {
            if (dataarray.length > 0) {
              $("#datasection").css("display", "block");
              $("#uploaddata").css("display", "block");
              $("#uploaddatamsg").css("display", "none");
              $("#datasectionresult").css("display", "none");
              document.getElementById("searchpan").value = "";
              document.getElementById("searchname").value = "";
              localStorage.setItem('data1', JSON.stringify(dataarray));
              this.setState({ data1: dataarray })
              toast("Client created succefully !");
            } else {
              console.log("dataarray else=", dataarray)
              $("#datasection").css("display", "none");
              $("#uploaddata").css("display", "none");
              $("#uploaddatamsg").css("display", "block");
              localStorage.setItem('data1', JSON.stringify(dataarray));
              this.setState({ data1: dataarray })
            }
          }
        })
      })
  }
  showdata = (e) => {
    var inputName = $(".searchname").val();
    var inputPan = $(".searchpan").val();
    if (inputName != "" || inputPan != "") {
      $(".loader").css("display", "block");
      axios.post('http://localhost:3001/api/searchClientMerge', { pan: inputPan, name: inputName })
        .then(res => {
          if (res.data.status === 400) {
            $(".loader").css("display", "none");
            $("#datasection1result").css("display", "block");
            $("#datasectionresult").css("display", "none");
            console.log("data=", res.data)
          } else {
            $('input:radio[name="check2"]').removeAttr('checked');
            $('input:radio[name="check2"]').prop('checked', false);
            $(".loader").css("display", "none");
            $("#datasectionresult").css("display", "block");
            $("#datasection1result").css("display", "none");
            $('html, body').animate({
              scrollTop: $("#example2").offset().top
            }, 1000);
            this.setState({ searchdata: res.data.data });
          }
        })
    } else {
      alert("please enter name or pan")
    }
  }

  mergeClient = (e) => {
    var newarray = [];
    var checkRadio = $('input[name="check"]:checked').attr('class');
    var checkbelowRadio = $('input[name="check2"]:checked').attr('class');
    if (checkRadio != undefined) {
      if (checkbelowRadio != undefined) {
        var checkRadiovalue = $('input[name="check"]:checked').attr('value');
        var checkRadioarrayvalue = $('input[name="check"]:checked').attr('id');
        var checkbelowRadiovalue = $('input[name="check2"]:checked').attr('value');
        var inputValue = checkbelowRadiovalue.split('/');
        var pan = inputValue[0];
        var name = inputValue[1];
        var userid = inputValue[2];
        alert(userid)
        for (var i = 0; i < this.state.oldarray.length; i++) {
          console.log(checkRadioarrayvalue, this.state.oldarray[i].INV_NAME)
          if (checkRadioarrayvalue === this.state.oldarray[i].INV_NAME) {
            newarray.push(this.state.oldarray[i])
          }
        }
        console.log("oldarray=", newarray)
        if (checkRadiovalue === pan) {
          console.log("thisstatedata1", this.state.data1[checkRadio])
          axios.post('http://localhost:3001/api/savecamstest', { userid: userid, pan: pan, name: name, data: newarray })
            .then(res => {
              console.log("res=", res)
              if (res.data.status === 200) {
                $(".loader").css("display", "none");
                var dataarray = [];
                this.state.data1.map((val, key) => {
                  console.log("pan=", val.PAN, "name=", val.INV_NAME, "below pan", pan)
                  if (val.PAN === "") {
                    if (val.INV_NAME != name) {
                      dataarray.push(val);
                      console.log("dataarray if=", dataarray)
                      $("#datasection").css("display", "block");
                      $("#uploaddata").css("display", "block");
                      $("#uploaddatamsg").css("display", "none");
                      $("#datasectionresult").css("display", "none");
                      document.getElementById("searchpan").value = "";
                      document.getElementById("searchname").value = "";
                      localStorage.setItem('data1', JSON.stringify(dataarray));
                      this.setState({ data1: dataarray })
                      // toast("Merge succefully 1 !");
                    }
                  } else if (val.PAN != pan) {
                    dataarray.push(val);
                    console.log("dataarray if=", dataarray)
                    $("#datasection").css("display", "block");
                    $("#uploaddata").css("display", "block");
                    $("#uploaddatamsg").css("display", "none");
                    $("#datasectionresult").css("display", "none");
                    document.getElementById("searchpan").value = "";
                    document.getElementById("searchname").value = "";
                    localStorage.setItem('data1', JSON.stringify(dataarray));
                    this.setState({ data1: dataarray })
                    // toast("Merge succefully 1 !");
                  } else {
                    if (dataarray.length > 0) {
                      $("#datasection").css("display", "block");
                      $("#uploaddata").css("display", "block");
                      $("#uploaddatamsg").css("display", "none");
                      $("#datasectionresult").css("display", "none");
                      document.getElementById("searchpan").value = "";
                      document.getElementById("searchname").value = "";
                      localStorage.setItem('data1', JSON.stringify(dataarray));
                      this.setState({ data1: dataarray });
                      toast("Merge succefully 2 !");
                    } else {
                      console.log("dataarray else=", dataarray)
                      $("#datasection").css("display", "none");
                      $("#uploaddata").css("display", "none");
                      $("#uploaddatamsg").css("display", "block");
                      localStorage.setItem('data1', JSON.stringify(dataarray));
                      this.setState({ data1: dataarray })
                      // toast("Merge succefully 3 !");
                    }
                  }
                })

                console.log("data=", res.data)
              } else {
                $(".loader").css("display", "none");
                $("#datasectionresult").css("display", "block");
                $("#datasection1result").css("display", "none");
              }
            })
        } else {
          alert("Please select same pan client to merge");
          return false;

        }
      } else {
        alert("Please select below client to merge ");
        return false;
      }
    } else {
      alert("Please select above client to merge");
      return false;
    }
  }

  componentDidMount() {
    $("#datasectionresult").css("display", "none");
    $("#datasection1result").css("display", "none");
    $("#uploaddatamsg").css("display", "none");
    document.title = "WMS | Folio Detail"
    if (localStorage.getItem('data1') == '') {
      var newdata = JSON.parse(localStorage.getItem('data'));
      console.log("newdata-1", newdata[0])
      var newuniquedata = newdata[0].filter((temp => a => (k => !temp[k] && (temp[k] = true))(a.INV_NAME + '|' + a.INV_NAME))(Object.create(null)));
      this.setState({ data1: newuniquedata });
      //  console.log("newdata-111",this.state.data1)
      this.setState({ oldarray: newdata[0] })
    } else {
      var newdata = JSON.parse(localStorage.getItem('data1'));
      console.log("newdata-2", newdata)
      var newuniquedata = newdata.filter((temp => a => (k => !temp[k] && (temp[k] = true))(a.INV_NAME + '|' + a.INV_NAME))(Object.create(null)));
      this.setState({ data1: newuniquedata });
      this.setState({ oldarray: newdata })
    }
  }
  render() {
    var newarray = [];
    return (
      <>
        <style jsx>
          {`
     
       .client-name {
        white-space: pre;
       }
      .list-group-item{
        border:none!important;
      }
      .list-group-item:hover{
        border:none!important;
      }
      .normal-table .table td, .normal-table .table th {
        padding: .30rem;
      }
      .hide-bal{
        display:none;
      }
      `}
        </style>
        <ToastContainer toastStyle={{ backgroundColor: "lightgrey" }} />
        <div className="content-wrapper">
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Mapping</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active">Mapping</li>
                  </ol>
                </div>
              </div>
            </div>{/* /.container-fluid */}
          </section>
          <section className="content">
            <div className="container-fluid">
              <div className="card card-primary card-outline mt-5">
                <div id="uploaddatamsg">
                  <div className="card-header">
                    <h3 className="card-title" >Data uploaded successfully</h3>
                  </div>
                  {/* <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Data not found</label> */}
                </div>
                <div id="uploaddata">
                  {/* <div className="card-header">
                  <h3 className="card-title">DataTable with default features</h3>
                </div> */}

                  <div className="card-body" id="uploaddata">
                    <table id="example1" className="table table-bordered table-striped">
                      <thead >
                        <tr>
                          <th></th>
                          <th>NAME</th>
                          <th>PAN</th>
                          <th>FOLIO</th>
                          <th>ADDRESS</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody id="qw">
                        {/* {console.log(this.state.data1[0])} */}
                        {this.state.data1.map((item, index) => (

                          <tr key={index}>
                            <td>
                              <input type="radio" name="check" id={item.INV_NAME} class={index} value={item.PAN} onClick={this.getPan.bind(item.PAN)} /></td>
                            <td class="client-name">{item.INV_NAME}</td>
                            <td>{item.PAN}</td>
                            <td>{item.FOLIO_NO}</td>
                            <td>{index}</td>
                            <td><a href="#" className="btn btn-sm btn-primary" onClick={() => this.addnewclient(item.INV_NAME + "/" + item.PAN + "/" + index)}>NEW CLIENT</a></td>
                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div id="datasection" >
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="form-group">
                          <label>Applicant :</label>
                          <input type="text" name="searchname" id="searchname" className="form-control searchname" />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="form-group">
                          <label>PAN :</label>
                          <input type="text" name="searchpan" id="searchpan" className="form-control searchpan" />
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="form-group mt-1">
                          {/* <a href="#" className="btn btn-primary shadow-sm mt-4 w-100" onClick={this.showdata}>Show</a> */}
                          <button className="btn btn-primary shadow-sm mt-4 w-100" onClick={this.showdata}>Show</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Loader />
                <div id="datasection1result">
                  <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Data not found</label>
                </div>
                <div id="datasectionresult" className="card">
                  <div className="card-body">
                    <div>

                      <table id="example2" className="table table-bordered table-striped">
                        <thead >
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Pan</th>
                            <th>Addesss</th>
                            <th>Navdate</th>
                          </tr>
                        </thead>
                        {this.state.searchdata.map((item, newindex) => (
                          <tbody>
                            <tr>
                              <td><input type="text" id="clientdata" value={item.PAN + "/" + item.INVNAME + "/" + item.USER_ID} hidden /><input type="radio" name="check2" class={newindex} id="check2" value={item.PAN + "/" + item.INVNAME + "/" + item.USER_ID} /></td>
                              <td class="client-name" >{item.INVNAME}</td>
                              <td>{item.PAN}</td>
                              <td>{item.ADD1 + " " + item.ADD2 + " " + item.ADD3}</td>
                              <td>{item.NAVDATE}</td>
                              <td></td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                      <a href="javascript:void(0)" className="btn btn-success ml-3" id="buttonClass" onClick={this.mergeClient}>Merge</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>{/* /.container-fluid */}
          </section>
        </div>
      </>
    );
  }
};

export default Uploadclientmappingtranscams;

