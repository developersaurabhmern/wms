import React from "react";
import $ from 'jquery';
import { Component } from "react";

var createReactClass = require('create-react-class');

class Portfolio extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data1: [],
      data2: [],
    };
  }
  changeApplicant = (e) =>{
    var sel = e.target.value;
    $.ajax({
      url: "http://localhost:3001/api/getportfolio",
      type: "GET",
      data:{name:sel},
       success: function (res2) {
        this.setState({ data2: res2 });
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);         
      }
    });   
}
  componentDidMount(){
    document.title = "WMS | Portfolio"
    $.ajax({
      url: "http://localhost:3001/api/getapplicant",
      type: "GET",
       success: function (res1) {
        this.setState({ data1: res1 });
      }.bind(this),
      error: function(jqXHR) {
        console.log(jqXHR);         
      }
    });   
  }
  render(){
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
      `}
      </style>
    <div className="content-wrapper">
     <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Portfolio</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Portfolio</li>
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
                <div className="col-md-8 offset-md-2">
                    <div className="card card-primary card-outline">
                        <div className="card-body box-profile">
                            
                            <h5 className="text-bold text-danger text-center">Mutual Fund</h5>
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>Applicant</label>
                                <select className="form-control" onChange={this.changeApplicant}>
                                {this.state.data1.map((item, index) => (
                                    <option value={item}>{item}</option>
                                  
                                ))}
                                </select>
                              </div>
                            </div>
                            <hr/>
                            <h5 className="text-bold text-info"></h5>
                            <hr/>
                            {this.state.data2.map((item, index) => (
                              <>
                              <h5 className="text-bold text-info">{item.scheme_type} </h5>
                              <hr/>
                            <ul className="list-group list-group-unbordered mb-3">
                                <li className="list-group-item">
                                    <b className="text-primary">{item.scheme} ({item.folio_no})</b> 
                                    <a className="float-right">
                                        <span className="badge bg-warning float-right"><i className="fa fa-plus text-white"></i></span>
                                        <span className="badge badge-pill badge-light float-right mr-2"><i className="fa fa-cubes text-danger" style={{fontSize:'18px'}}></i></span>
                                        <span class="badge bg-warning float-right mr-2"><i className="fa fa-minus text-white"></i></span>
                                    </a>
                                </li>
                                <li className="list-group-item">
                                    Mkt. Value: <b>₹ {item.amount}</b> <a className="float-right"><span class="badge badge-success">Gain :  ₹ 0</span></a>
                                </li>
                                <li className="list-group-item">
                                    Cost : <b>₹ {item.amount}</b> <a className="float-right">CAGR: <b>2.8%</b></a>
                                </li>
                                <li className="list-group-item">
                                    Unit : <b>{item.units}</b> <a className="float-right">Avg. Day: <b>34</b></a>
                                </li>
                            </ul>
                            </>
                            ))}





                           
                            
                          
                           
                            
                        </div>
                    </div>
                </div>
            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
      </div>
    </>
  );
 }
};

export default Portfolio;
