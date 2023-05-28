import React, { Component } from 'react'
import $ from 'jquery';
import Moment from 'moment';
import Select from 'react-select';
import Loader from './loader';

class Sipstp extends Component {
  
  constructor(props) {
    super(props);
    this.changeApplicant = this.changeApplicant.bind(this);
    this.handlechange1 = this.handlechange1.bind(this);
    this.onChanger1 = this.onChanger1.bind(this);
    this.onChanger2 = this.onChanger2.bind(this);

    this.state = {
      data1:[],
      data2:[],
      data3:[],
      msg:"",
      msg3:"",
      rvalue:'',
      user:'',
      defaultValue:"",
      year:'',
      mon:'',
      options:'',
      selectedOption: null,
      searchname:[],
    };
  }
  onChanger1(e) {
    
    this.setState({
      rvalue: e.target.value    
    });
    var sel = document.getElementById("getcalender").value;
    var month = sel.split('-')[1];
    var year = sel.split('-')[0];
      $(".loader").css("display", "block");
      $("#example1").css("display", "none");
    $.ajax({
       url: "http://localhost:3001/api/getsipstpall",
       type: "POST",
       data:{month:month,year:year},
        success: function (res1) {
          this.setState({
            data1: res1.data,
            msg: res1.message});

            $(".loader").css("display", "none");
            $("#example1").css("display", "block");

       }.bind(this)
       
     });
    
 }
  onChanger2(e) {
    this.setState({data3: []});
    $(".search-data").hide();
    $(".inputdata").hide();
    $("#clientdata").hide();
    $("#clientdata").html();

      $("#clientdata").css("display", "none");
    this.setState({
      rvalue: e.target.value    
    });
    if(e.target.value == "no"){
      $.ajax({
        url: "http://localhost:3001/api/getapplicant",
        type: "GET",
         success: function (res2) {
          this.setState({ searchname: res2 });
        }.bind(this),
        error: function(jqXHR) {
          console.log(jqXHR);          
        }
      });
    }
  }
  suggestionBox = (e) =>{
    $(".inputdata").show();
    var inputValue = $(".searchname").val();
   // console.log(inputValue)
    $.ajax({
      url: "http://localhost:3001/api/getsearchname",
      type: "POST",
      data:{name: inputValue},
      success: function (res4) {
        if(res4.status === 200){
          this.setState({ searchname: res4.data });
          }else{
            
          }
        
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);         
      }
    });    
}
  
  changeApplicant = (e) =>{ 
    $(".showmsg").hide();
    $("#clientdata").hide();
    $(".loader").css("display", "block");
      $("#clientdata").css("display", "none");
     var selectedvalue = e.target.innerText;
        var name = selectedvalue.split('/')[0];
        var pan = selectedvalue.split('/')[1];
        $(".searchname").val(selectedvalue);
        $(".inputdata").hide();
     this.setState({
      pan:pan,
      name:name
    })
    var sel = document.getElementById("getcalender").value;
    var month = sel.split('-')[1];
    var year = sel.split('-')[0];
    $.ajax({
      url: "http://localhost:3001/api/getsipstpuserwise",
      type: "POST",
      data:{month:month,year:year,pan:pan,name:name},
       success: function (res3) {
        this.setState({
          data3: res3.data,
          msg3: res3.message});
          if(res3.message === "Data not found"){
            $(".showmsg").show();
            $(".showmsg").html(res3.message);
           }
          $(".loader").css("display", "none");
          $("#clientdata").css("display", "block");
          $(".showmsg").show();
          
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);          
      }
    });
}
handlechange1(){
  $(".showmsg").css("display", "none");
   var sel = document.getElementById("getcalender").value;
    var month = sel.split('-')[1];
    var year = sel.split('-')[0];
  if(this.state.rvalue == "yes"){
    $(".loader").css("display", "block");
    $("#example1").css("display", "none");
    $.ajax({
      url: "http://localhost:3001/api/getsipstpall",
      type: "POST",
      data:{month:month,year:year},
       success: function (res1) {
        this.setState({
           data1: res1.data,
           msg: res1.message});
           $(".loader").css("display", "none");
           $("#example1").css("display", "block");
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);         
      }
    });   
  }else if(this.state.rvalue == "no"){
   $(".loader").css("display", "block");
    $("#clientdata").css("display", "none");
    $.ajax({
      url: "http://localhost:3001/api/getsipstpuserwise",
      type: "POST",
      data:{month:month,year:year,pan:this.state.pan,name:this.state.name},
       success: function (res3) {
        this.setState({
          data3: res3.data,
          msg3: res3.message});
          if(this.state.msg3 === "Data not found"){
            $(".showmsg").show();
            $(".showmsg").html(this.state.msg3);
             }
           $(".loader").css("display", "none");
           $("#clientdata").css("display", "block");
      }.bind(this)
    });
  }else{
    $(".loader").css("display", "none");
     $("#clientdata").css("display", "block");
  }
}

  componentDidMount(){
    document.title = "WMS | Sip/Stp Report"
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
        this.setState({ searchname: res2 });
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);          
      }
    });

  }
  
  render() {     
    const { selectedOption,options } = this.state; 
    var date = new Date();
    const values = {

      todate : date.getFullYear() + '-0' + (date.getMonth() + 1) 
}
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
      .hide-bal{
        display:none;
      }
      .search-data{
        list-style:none;
        padding:10px;
        border:1px solid #eee;
        height:auto;
        overflow-y: auto;
        background-color:white;
        position:absolute !important;
        width:auto;
        min-width:1040px;
        max-width:1040px;
        max-height:200px;
        z-index:9999;
      }
      .search-data li {
        list-style: none;
        padding: 6px 10px;
        border-bottom: 1px solid #eee;
        cursor:pointer;
        
      }
        .search-data li:hover{
          background-color:#eee;
        }
      `}
      </style>
      <div className="content-wrapper">
       <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>My SIP / STP </h1>
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
                {/* left column */}
                <div className="col-md-12 offset-md-0">
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
                                <input type="month" className="form-control" defaultValue={"2021-10"} style={{height: '30px'}} id="getcalender" onChange={this.handlechange1}/>
                                {/* <div>
                                <MonthPickerInput year={2021} month={1} closeOnSelect={true}  maxYear={2021} onChange={this.handlechange} id="calender"/>
                                </div> */}
                                
                            </div>
                            {/* /.input group */}
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12 form-group text-center check_btn">
                      <div className="form-group clearfix" style={{marginLeft:'-144px'}}>
                      <div className="icheck-primary d-inline mr-5">
                        <input type="radio" id="radioPrimary1" name="r1" defaultValue="yes" onClick={this.onChanger1} />
                        <label for="radioPrimary1">
                          All
                        </label>
                      </div>
                      <div className="icheck-primary d-inline">
                        <input type="radio" id="radioPrimary2" name="r1" defaultValue="no" onClick={this.onChanger2}   />
                        <label for="radioPrimary2">
                          Clientwise
                        </label>
                      </div>
                    </div>
                        {/* <div className="form-check-inline">
                          <input type="radio" id="yes" name="kstatus" defaultValue="yes" onClick={this.onChangekstatus}  />
                          <label htmlFor="yes">ALL</label>&nbsp;   <br/>
                        </div> */}
                        {/* <div className="form-check-inline">
                          <input type="radio" id="no" name="kstatus" defaultValue="no" onClick={this.onChangekstatus}/>
                          <label htmlFor="no">Userwise</label>
                        </div>  */}
                      </div>
                    </div>

                    <Loader/>

                    { ( this.state.rvalue==='yes')? (
                <div> 
                  
                  { (this.state.msg==='Successfull')? (
                     
                      <div id="example1" className="card card-primary card-outline mt-5">
                  <div className="card-header">
                    <h3 className="card-title"></h3>
                  </div>
                        {/* /.card-header */}
                        <div className="card-body">
                       
                        <table  className="table table-bordered table-striped">
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
                                    <td>{item.TRADDATE}</td>
                                    <td>{item.FOLIO_NO}</td>
                                    <td>{item.SCHEME}</td>
                                    <td>{item.AMOUNT}</td>
                                    <td>{item.TRXN_NATUR}</td>
                                </tr>     
                            ))}                               
                              </tbody>                             
                          </table>                         
                        </div>
                        {/* /.card-body */}
                      </div>
                        ):  (<div align="center"  className="col-sm-10">
                          <br/>
                        {/* <h6>Data Not Found</h6> */}
                      </div>)}
			 
	  </div>
	  
	   ): ( this.state.rvalue==='no')?(
          <div>
            <form role="form">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Applicant</label>
                
                                    <input type="text" name="searchname" onKeyUp={this.suggestionBox} className="form-control searchname" autoComplete="off" />
                                        <div className="inputdata">
                                            <ul className="search-data">
                                              {this.state.searchname.map((item, index) => (
                                                <li onClick={this.changeApplicant} >{item.INVNAME}/{item.PAN}</li> 
                                                ))}
                                               
                                            </ul>
                                          </div>
                                  </div>
                                </div>
                                </div>
                                </div>
                                </form>
                                <div> 
			 
       { (this.state.msg3==='Successfull')? (
                      <div  id="clientdata"  className="card">
                        <div className="card-header bg-primary">
                          <h3 className="card-title"></h3>
                          <div className="card-tools">
                            {/* <div className="input-group input-group-sm" style={{width: '150px'}}>
                              <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
                              <div className="input-group-append">
                                <button type="submit" className="btn btn-default"><i className="fas fa-search" /></button>
                              </div>
                            </div> */}
                          </div>
                        </div>
                        {/* /.card-header */}
                        <div className="card-body table-responsive p-0">
                       
                          <table className="table table-hover text-nowrap">
                          <thead>
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
                            {this.state.data3.map((item, index) => (
                                <tr key={index}>
                                <td>{index+1}</td>
                                    <td>{item.TRADDATE}</td>
                                    <td>{item.FOLIO_NO}</td>
                                    <td>{item.SCHEME}</td>
                                    <td>{item.AMOUNT}</td>
                                    <td>{item.TRXN_NATUR}</td>
                                    {/* {(item.TRXN_NATUR.match(new RegExp(`${"Systematic - To"}`))) ? (
                                     <td>STP</td> ) :(item.TRXN_NATUR.match(new RegExp(`${"Systematic"}`))  && (Math.sign(item.AMOUNT) === -1)) ? (
                                      <td>SIP Reversal</td>  ) :(
                                        <td>SIP</td> ) } */}
                                </tr>
                            
                            ))}
                                
                              </tbody>
                              
                          </table>
                          
                        </div>
                        {/* /.card-body */}
                      </div>
                        ):  (<div align="center" class="showmsg">
                          <br/>
                        <h6></h6>
                      </div>)}
			 
	  </div>
             </div>
             
             ): (<div> <br /> </div>)}

                      {/* /.card */}
                </div>
                {/*/.col (left) */}
              </div>
              {/* /.row */}
            </div>{/* /.container-fluid */}
          </section>
        </div>
      </>
    );






   
  }
}
export default Sipstp;
