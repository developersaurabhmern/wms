import React, { Component } from 'react'
import $ from 'jquery';
import moment from 'moment';
import axios from 'axios';
// import "datatables.net-dt/js/dataTables.dataTables"
// import "datatables.net-dt/css/jquery.dataTables.min.css"
// //import 'bootstrap/dist/css/bootstrap.min.css';
// import 'jquery/dist/jquery.min.js';

//import '../../Main';
// import MonthPickerInput  from 'react-month-picker-input';
// import 'react-month-picker-input/dist/react-month-picker-input.css'

class Sipstp extends Component {
  
  constructor(props) {
    super(props);
    this.handlechange1 = this.handlechange1.bind(this);
    this.state = {
      data1:[],
      data2:[],
      data3:[],
    };
   
  }

 
  handlechange1(){
    var sel = document.getElementById("getcalender").value;
     var mon = sel.split('-')[0];
     var yer = sel.split('-')[1];
     $.ajax({
       url: "http://localhost:3001/api/getsipstpall",
       type: "GET",
       data:{month:mon,year:yer},
        success: function (res1) {
         this.setState({
            data1: res1.data,
            msg: res1.message});
       }.bind(this),
       error: function(jqXHR) {
         console.log(jqXHR);         
       }
     });     
 }

 changeApplicant = (e) =>{
   console.log("hello")
  document.title = "WMS | Folio Detail"
  var sel = document.getElementById("getcalender").value;
  var mon = sel.split('-')[1];
  var yer = sel.split('-')[0];
  alert(mon)
 alert(yer)
  $.ajax({
    url: "http://localhost:3001/api/getsipstpuserwise",
    type: "GET",
    data:{month:mon,year:yer,pan:e.target.value},
     success: function (res3) {
      this.setState({
        data3: res3.data,
        msg3: res3.message});
    }.bind(this),
    error: function(jqXHR) {
      console.log(jqXHR);          
    }
  });
}
  componentDidMount(){
    document.title = "WMS | Folio Detail"
    var sel = document.getElementById("getcalender").value;
    var month = sel.split('-')[0];
    var year = sel.split('-')[1];
    $.ajax({
      url: "http://localhost:3001/api/getsipstpall",
      type: "POST",
      data:{month:month,year:year},
       success: function (res1) {
        this.setState({
          data1: res1.data,
          msg: res1.message});
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);          
      }
    });
    $.ajax({
      url: "http://localhost:3001/api/getapplicant",
      type: "GET",
       success: function (res2) {
        this.setState({ data2: res2 });
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);          
      }
    });
  }
  
  render() {   
    // console.log(this.state.data1)
    
    return (  
      <>
      <style jsx>
      {`
      .list-group-item{
        border:none!important;
      }
      .list-group-item:hover{
        border:none!important;
      }
      .normal-table .table td, .normal-table .table th {
        padding: .30rem;
      }
      .table-fix-height{
        height:500px;
      }
      `}
        </style>
       <div className="content-wrapper">
          <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1>My SIP / STP</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href="#">Home</a></li>
                      <li className="breadcrumb-item active">My SIP / STP</li>
                    </ol>
                  </div>
                </div>
              </div>{/* /.container-fluid */}
            </section>
            
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                          <div className="col-md-4 offset-md-4 mt-3">
                              <div className="form-group">
                                  <label>Select Month</label>
                                  <div className="input-group">
                                      <div className="input-group-prepend">
                                          <span className="input-group-text">
                                          <i className="far fa-calendar-alt" />
                                          </span>
                                      </div>
                                      <div>
                                      <input type="month" className="form-control" defaultValue="2021-02" style={{height: '30px'}} id="getcalender" onChange={this.handlechange1}/>
                                      </div>
                                      
                                  </div>
                                  {/* /.input group */}
                              </div>
                          </div>
                    </div>
                      
                      <div className="container">
                              {/* Nav pills */}
                              <ul className="nav nav-pills " role="tablist">
                                <li className="nav-item">
                                  <a className="nav-link active" data-toggle="pill" href="#home">All</a>
                                </li>
                                <li className="nav-item">
                                  <a className="nav-link" data-toggle="pill" href="#menu1">Userwise</a>
                                </li>
                              </ul>
                              {/* Tab panes */}
                              <div className="tab-content">
                               
                                <div id="home" className="container tab-pane active"><br />
                                      {/* /.card */}
                                    <div className="card">
                                        <div className="card-header">
                                          <h3 className="card-title">DataTable with default features</h3>
                                        </div>
                                        {/* /.card-header */}
                                        <div className="container">
                                        <table id="example" className="table table-bordered table-striped">
                                         <thead className="bg-primary">
                                              <tr>
                                                <th>S. No.</th>
                                                <th>Date</th>
                                                <th>Folio no</th>
                                                <th>Scheme</th>
                                                <th>Amount</th>
                                                <th>Trxn Type</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                           
                            

 {this.state.data1.map((item, index) => (
                              
                                <tr key={index}>
                                    <td>{index+1}</td> 
                                    <td>{moment(item.TRADDATE).utc().format('DD/MM/YYYY')}</td>
                                    <td>{item.FOLIO_NO}</td>
                                    <td>{item.SCHEME}</td>
                                    <td>{item.AMOUNT}</td>
                                    {(item.TRXN_NATUR.match(new RegExp(`${"Systematic - To"}`))) ? (
                                     <td>STP</td> ) :(item.TRXN_NATUR.match(new RegExp(`${"Systematic"}`))  && (Math.sign(item.AMOUNT) === -1)) ? (
                                      <td>SIP Reversal</td>  ) :(
                                        <td>SIP</td> ) }
                                </tr>
                            
                            ))} 
          
                              </tbody>
                                          
                                           
                                          
                                          </table>
                                        </div>
                                        {/* /.card-body */}
                                    </div>
                                    {/* /.card */}
                                </div>
                                <div id="menu1" className="container tab-pane fade" ><br />
                                  <div className="col-md-12">
                                          <div className="form-group">
                                              <label>Minimal</label>
                                              <div id="getuser">
                                              <select className="form-control select2"  id="user"  onChange={this.changeuser}>
                                                <option>Select Applicant</option>
                                                {this.state.data2.map((item, index) => (
                                                      <option value={item.PAN}>{item.INVNAME}/{item.PAN}</option>  
                                                  ))}
                                              </select>
                                              </div>
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
  }
}
export default Sipstp;
