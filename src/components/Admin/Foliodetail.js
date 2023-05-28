import React, { Component } from 'react'
import $ from 'jquery';
import Axios from 'axios';
import Select from 'react-select';
import '../../../node_modules/aos/dist/aos.css';


class Foliodetail extends Component { 
  constructor(props) {
    super(props);
    this.changeFolio = this.changeFolio.bind(this);
    this.changeApplicant = this.changeApplicant.bind(this);
    this.changeScheme = this.changeScheme.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      data1: [],
      data2: [],
      data3:[],
      data4:[],
      secdrp:'',
      searchname:[],
      selectedOption: null,
      index:0
    };
  }

  

changeScheme = (e) =>{
  var sel = e.target.value;
  var folioval = this.state.secdrp;
   $.ajax({
    url: "http://localhost:3001/api/getfoliodetailweb",
    type: "POST",
    data:{scheme:sel,folio:folioval,pan:this.state.pan},
     success: function (res4) {
      this.setState({ data4: res4.data });
      $("#detail").show();
    }.bind(this),
    error: function(jqXHR) {
      console.log(jqXHR);         
    }
  });   
}

suggestionBox = (e) =>{
  $(".inputdata").show();
  var inputValue = $(".searchname").val();
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

changeFolio = (selectedOption) =>{ 
    // this.setState({ selectedOption });
   // var optionElement = selectedOption.value
      var sel = selectedOption.target.value
  //    var name =  optionElement.split('/')[0];
  // var sel =  optionElement.split('/')[1];
  this.setState({secdrp:sel})
  $.ajax({
    url: "http://localhost:3001/api/getscheme",
    type: "GET",
    data:{folio:sel},
     success: function (res3) {
      this.setState({ data3: res3 });
      var schemename = "<option value=''>Select Scheme</option>";
      var foliodetail = "";
      {this.state.data3.map((item, index) => (
        schemename += '<option value="'+item+'">'+item+'</option>'  
      ))}
      $("#scheme").html(schemename);
      $("#detail").hide();
    }.bind(this),
    error: function(jqXHR) {
      console.log(jqXHR);         
    }
  });   
}

changeApplicant = (e) =>{ 
  var selectedvalue = e.target.innerText;
  var name = selectedvalue.split('/')[0];
  var pan = selectedvalue.split('/')[1];
  //alert(name)
 // var userdetail = "<b>"+name+"/"+"["+pan+"]"+"</b>";
 // $(".namepan").html(userdetail);
  $(".searchname").val(selectedvalue);
  $(".inputdata").hide();

   this.setState({
    pan:pan,
    name: name
  })

    $.ajax({
      url: "http://localhost:3001/api/getfolio",
      type: "GET",
      data:{pan:pan,name:name},
       success: function (res2) {
       // this.setState({ options: res2 });
       this.setState({ data2: res2 });
         var folionumber = "<option value=''>Select Folio No.</option>";
         var schemename = "<option value=''>Select scheme</option>";
        var foliodetail = "";
        {this.state.data2.map((item, index) => (
          folionumber += "<option value='"+item.FOLIO+"'>"+item.AMC+"/"+item.FOLIO+"</option>"   
        ))}
        $("#folio").html(folionumber);
        $("#scheme").html(schemename);
        $("#detail").hide();
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);         
      }
    });   
}

  componentDidMount(){
    document.title = "WMS | Folio Detail"
    $.ajax({
      url: "http://localhost:3001/api/getapplicant",
      type: "GET",
       success: function (res1) {
        this.setState({ searchname: res1 });
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);          
      }
    });
  }
  render(){
    const { selectedOption,options } = this.state;
    var balance = 0;
    var unit = 0;
    var currentNav= 0;
    var index=0;
  return (  
    <>
    <style jsx>
      {`
      .list-group-item:hover{
        border:none!important;
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
        position:absolute;
        max-width:490px;
        max-height:200px;
        min-width:490px;
        z-index: 9;
        width:auto;
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
                <h1>Folio Details</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Folio Details</li>
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
              <div className="col-md-6">
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">View Folio</h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <fieldset>
                  {/* <legend>Personalia:</legend> */}
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
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Folio :</label>
                            <select className="form-control" id="folio" onChange={this.changeFolio}>
                              <option value={""}>Select Folio No.</option>
                             
                            </select>
                          </div>
                        </div>
                         {/* <div className="col-md-12">
                          <div className="form-group">
                            <label>Folio :</label>
                            <Select
        value={selectedOption}
        onChange={this.changeFolio}
        options={options} 
        id="folio"
      />
                          </div>
                        </div>  */}
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Scheme :</label>
                            <select className="form-control"  id="scheme" onChange={this.changeScheme} >
                              <option value={""}>Select Scheme</option>
                              
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /.card-body */}
                    {/* <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div> */}
                  </form>
                  </fieldset>
                </div>
                {/* /.card */}                
              </div>
              {/*/.col (left) */}
              {/* right column */}
              <div className="col-md-6">
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">Folio Detail</h3>
                  </div>
                  {/* /.card-header */}
                  <div className="card card-primary card-outline" id="detail">
                 {/* {console.log(this.state.data4.length)} */}
                  {this.state.data4.map((item, index) => (
                    <div className="card-body box-profile">
                      <h3 className="profile-username text-center">{item.INVNAME}</h3>
                      <ul className="list-group list-group-unbordered mb-3">  
                      {(item.UNITS === "" || item.UNITS === null || item.UNITS === 0 || item.UNITS === NaN) ? (
                        
                        <div> <b>Units</b> <a className="float-right">{0}</a></div>
                        ) : (
                           <li className="list-group-item">
                          <b>Units</b> <a className="float-right">{(item.UNITS).toFixed(3)}</a>
                        </li> )}

                        {(item.cnav === "" && item.UNITS === "" || item.AMOUNT === null) ? (
                        <div> Nav not found</div>
                        
                        ) : (
                          <li className="list-group-item">
                          <b>Current Value</b> <a className="float-right">{(item.cnav * item.UNITS).toFixed(2)}</a>
                        </li>)}
                        {(item.BANK_NAME === "" ) ? (
                        <div></div>
                        ) : (
                           <li className="list-group-item">
                          <b>Bank</b> <a className="float-right">{item.BANK_NAME}</a>
                        </li> )}
                        {(item.AC_NO === "" ) ? (
                        <div></div>
                        ) : (
                           <li className="list-group-item">
                          <b>Account No.</b> <a className="float-right">{item.AC_NO}</a>
                        </li> )}
                       
                        {(item.JTNAME1 === "" ) ? (
                        <div></div>
                        
                        ) : (
                           <li className="list-group-item">
                          <b>Joint 1</b> <a className="float-right">{item.JTNAME1}</a>
                        </li> )}
                       
                        {(item.JTNAME2 === "" ) ? (
                        <div></div>
                        
                        ) : (
                           <li className="list-group-item">
                          <b>Joint 2</b> <a className="float-right">{item.JTNAME2}</a>
                        </li>)}

                        {(item.NOMINEE === "" ) ? (
                        <div></div>
                        
                        ) : (
                            <li className="list-group-item">
                          <b>Nominee</b> <a className="float-right">{item.NOMINEE}</a>
                        </li>)}
                       
                      </ul>
                    </div>
  ))}
                  </div>
                </div>
                {/* /.card */}                
              </div>
              {/*/.col (right) */}
              
            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
      </div>
    </>
  );
 }
};

export default Foliodetail;
