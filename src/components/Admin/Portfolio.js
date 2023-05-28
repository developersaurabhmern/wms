import React from "react";
import { dateFormat } from 'dateformat';
import { Component } from "react";
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';


//var createReactClass = require('create-react-class');

class Portfolio extends Component {
  constructor(props) {
    super(props);
    this.changeApplicant = this.changeApplicant.bind(this);
    this.getportfolio = this.getportfolio.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      data1: [],
      data2: [],
      data3: [],
      data5: [],
      navdate: [],
      searchname: [],
    };
  }

  selectnameandcategory = (e) => {
    var inputValue = $(".searchname").val();
    var catValue = $("#category").val();
    if (inputValue === "") {
      alert("Please select applicant");
      $(".searchname").focus();
    } else {
      var name = inputValue.split('/')[0];
      var pan = inputValue.split('/')[1];
      var userdetail = "<b>" + name + "/" + "[" + pan + "]" + "</b>";
      $(".namepan").html(userdetail);
      var fullSchemeHtml = "";
      var totalpurchasecost=[];var totalmarketvalue=[];
      var totaldays=[];var totalsum1=[];var totalsum2=[];
      var sch = "";
      $.ajax({
        url: "http://localhost:3001/api/getportfolioscheme",
        type: "POST",
        data: { pan: pan, name: name, category: catValue },
        success: function (res) {
          for (var i = 0; i < res.length; i++) {
            $.ajax({
              url: "http://localhost:3001/api/getschemeportfoliodetail",
              type: "POST",
              data: { scheme: res[i].PRODCODE, pan: res[i].PAN, folio: res[i].FOLIO, RTA: res[i].RTA },
              success: function (res2) {
                res2.data = res2.data.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());
                fullSchemeHtml += "<tr>"
               
                var unit = 0; var balance = 0; var amount = 0; var amt = 0; var cnav = 0; var currentval = 0; var countlength = 0;var externelcount=0;
                var gain = 0; var absreturn = 0; var days = 0; var date1 = ""; var date2 = "";
                var t = 0; var cagr = 0; var avgDays = 0; var rootval = 0; var nval = 0; var mathpo = 0;
                var arrunit = []; var arrnav = []; var amtt = 0; var arrdays = []; var alldays = []; var sum1 = [];
                var arrpurchase = []; var j = 0; var temp333 = 0; var temp222 = 0; var rowval = 0; var sum2 = [];var cnav=0;
                var sum3 = [];
                var temp1, temp2 = 0; var temp3 = 0; var temp4 = 0; var temp33 = 0; var temp22 = 0;
                var totdays = 0;var rta="";
                var isin = ""; var newnavdate = ""; var daystotal = 0; var navrate = 0;
                for (var n = 0; n < res2.data.length; n++) {
                  if (typeof res2.data[n] != "undefined") {
                    if (res2.data[n].PRODCODE === res2.data[0].PRODCODE) {
                      countlength = countlength + 1;
                      if (Math.sign(res2.data[n].UNITS) != -1) {
                        if (res2.data[n].NATURE === "Switch Out")
                          for (var jj = 0; jj < arrunit.length; jj++) {
                            if (arrunit[jj] === 0)
                              arrunit.shift();
                            if (arrpurchase[jj] === 0)
                              arrpurchase.shift();
                            if (arrdays[jj] === 0)
                              arrdays.shift();
                            if (alldays[jj] === 0)
                              alldays.shift();
                            if (sum1[jj] === 0)
                              sum1.shift();
                            if (sum2[jj] === 0)
                              sum2.shift();
                            if (arrnav[jj] === 0)
                              arrnav.shift();
                          }
                      }
                      cnav = res2.data[n].cnav;
                      if (res2.data[n].NATURE != 'Switch Out' && res2.data[n].UNITS != 0) {

                        unit = res2.data[n].UNITS
                        amount = res2.data[n].AMOUNT;
                        var date = res2.data[n].newdate;
                        var navdate = res2.data[n].navdate;

                        date1 = new Date(date);
                        date2 = new Date(navdate);
                        
                        days = Math.round((date2-date1)/(1000*60*60*24));
                        arrunit.push(res2.data[n].UNITS);
                        if(res2.data[n].TD_NAV === 0){
                          arrpurchase.push(0);
                        }else{
                          arrpurchase.push(res2.data[n].AMOUNT);
                        }
                        arrnav.push(res2.data[n].TD_NAV)
                        var precagr = parseFloat( (parseFloat(Math.pow(parseFloat((cnav * res2.data[n].UNITS) / (res2.data[n].AMOUNT)), parseFloat(1 / parseFloat(days / 365)))) - 1) * 100) ;
                        if(precagr=== Infinity){
                            precagr=0;
                        }else{
                            precagr = precagr ;
                        }
                        //sum1(purchase cost*days*cagr)
                        if (days === 0) {
                          sum1.push(0);
                          arrdays.push(0);
                          alldays.push(0);
                          sum2.push(0);
                        } else {
                          arrdays.push(parseFloat(days) * res2.data[n].AMOUNT);
                          alldays.push(parseFloat(days));
                          sum1.push(parseFloat(res2.data[n].AMOUNT) * parseFloat(days) * precagr);
                          sum2.push(parseFloat(res2.data[n].AMOUNT) * parseFloat(days));
                          }
                         } else {
                        unit = "-" + res2.data[n].UNITS
                        amount = "-" + res2.data[n].AMOUNT
                        
                        temp2 = res2.data[n].UNITS;
                        for (var p = 0; p < arrunit.length; p++) {
                          if(arrunit[p] === 0){
                          continue;
                          }
                          temp3 = arrunit[p];
                          if (temp4 === 0) {
                               temp4 = parseFloat(temp3) - parseFloat(temp2);
                               temp4 = parseFloat(temp4.toFixed(4));
                              if (temp4 === 0) {
                                  arrunit[p] = 0;
                                  arrnav[p] = 0;
                                  arrpurchase[p] = 0;
                                  arrdays[p] = 0;
                                  alldays[p] = 0;
                                  sum1[p] = 0;
                                  sum2[p] = 0;
                                  break;
                              } else if (temp4 > 0) {
                                  arrunit[p] = temp4;
                                  arrpurchase[p] = temp4 * arrnav[p];
                                  arrdays[p] = parseFloat(alldays[p] * arrpurchase[p]);
                                  sum1[p] = parseFloat(temp4 * arrnav[p]) * parseFloat(alldays[p]) * parseFloat((parseFloat(Math.pow(parseFloat((cnav * temp4) / (temp4 * arrnav[p])), parseFloat(1 / parseFloat(alldays[p] / 365)))) - 1) * 100);
                                  sum2[p] = parseFloat(arrpurchase[p]) * parseFloat(alldays[p]);
                                  break;
                              } else {
                                  arrunit[p] = 0;
                                  arrnav[p] = 0;
                                  arrpurchase[p] = 0;
                                  arrdays[p] = 0;
                                  alldays[p] = 0;
                                  sum1[p] = 0;
                                  sum2[p] = 0;
                              }
                          } else if (temp4 > 0) {//+ve
                              if (countlength === arrnav.length+1) {
                                    temp4 = parseFloat(temp4) + parseFloat(temp3);
                                    temp4 = parseFloat(temp4.toFixed(4));            
                              }
                              else {
                                    temp4 = parseFloat(temp4) - parseFloat(temp2);
                                    temp4 = parseFloat(temp4.toFixed(4));
                                  }
                              if (temp4 === 0) {
                                  arrunit[p] = 0;
                                  arrnav[p] = 0;
                                  arrpurchase[p] = 0;
                                  arrdays[p] = 0;
                                  alldays[p] = 0;
                                  sum1[p] = 0;
                                  sum2[p] = 0;
                                  break;
                              } else if (temp4 > 0) {
                                  arrunit[p] = temp4;
                                  arrpurchase[p] = temp4 * arrnav[p];
                                  arrdays[p] = parseFloat(alldays[p]) * arrpurchase[p];
                                  sum1[p] = parseFloat(temp4 * arrnav[p]) * parseFloat(alldays[p]) * parseFloat((parseFloat(Math.pow(parseFloat((cnav * temp4) / (temp4 * arrnav[p])), parseFloat(1 / parseFloat(alldays[p] / 365)))) - 1) * 100);
                                  sum2[p] = parseFloat(arrpurchase[p]) * parseFloat(alldays[p]);
                                  break;
                              } else {
                                  arrunit[p] = 0;
                                  arrnav[p] = 0;
                                  arrpurchase[p] = 0;
                                  arrdays[p] = 0;
                                  alldays[p] = 0;
                                  sum1[p] = 0;
                                  sum2[p] = 0;   
                              }
                          } else {//-ve
                                  temp4 = parseFloat(temp4) + parseFloat(temp3);
                                  temp4 = parseFloat(temp4.toFixed(4));
                            if (temp4 === 0) {
                                  arrunit[p] = 0;
                                  arrnav[p] = 0;
                                  arrpurchase[p] = 0;
                                  arrdays[p] = 0;
                                  alldays[p] = 0;
                                  sum1[p] = 0;
                                  sum2[p] = 0;
                                  break;
                              } else if (temp4 > 0) {
                                  arrunit[p] = temp4;
                                  arrpurchase[p] = temp4 * arrnav[p];
                                  arrdays[p] = parseFloat(alldays[p]) * arrpurchase[p];
                                  sum1[p] = parseFloat(temp4 * arrnav[p]) * parseFloat(alldays[p]) * parseFloat((parseFloat(Math.pow(parseFloat((cnav * temp4) / (temp4 * arrnav[p])), parseFloat(1 / parseFloat(alldays[p] / 365)))) - 1) * 100);
                                  sum2[p] = parseFloat(arrpurchase[p]) * parseFloat(alldays[p]);
                                  break;
                              } else {
                                  arrunit[p] = 0;
                                  arrnav[p] = 0;
                                  arrpurchase[p] = 0;
                                  arrdays[p] = 0;
                                  alldays[p] = 0;
                                  sum1[p] = 0;
                                  sum2[p] = 0;
                              }
                          }
                      }           
                      }
                      balance = parseFloat(unit) + parseFloat(balance);
                      cnav = res2.data[n].cnav
                      if (cnav === "" || cnav === undefined || isNaN(balance) || isNaN(cnav)) {
                        balance = 0;
                          cnav = 0;
                     }
                      currentval = cnav * balance;
                      currentval = parseFloat(currentval.toFixed(3));
                      var prodcode = res2.data[n].PRODCODE;
                      var scheme = res2.data[n].SCHEME;
                      var folio = res2.data[n].FOLIO;
                      var isin = res2.data[n].ISIN;
                      var rta = res2.data[n].RTA;
                    }
                  }
                }

                temp22 = 0;temp33=0;
                for (var k = 0; k < arrpurchase.length; k++) {
                  temp22 = arrpurchase[k] + temp22;
                    temp222 = Math.round(arrdays[k]) + temp222;
                }
                if(temp222 === 0 && temp22 === 0 ){
                  days = 0;
                }else{
                    days = Math.round(temp222 / temp22);
                }
              
                var sum1all = 0; var sum2all = 0;
                for (var kk = 0; kk < sum1.length; kk++) {
                  sum1all = sum1[kk] + sum1all;
                }
                for (var kkk = 0; kkk < sum2.length; kkk++) {
                  sum2all = sum2[kkk] + sum2all;
                }
                if(days === Infinity){
                  days = 0;
                  cagr=0;
                }else{
                  cagr = sum1all / sum2all;
                }

                totalpurchasecost.push(temp22);
                totalmarketvalue.push(currentval);
                totaldays.push(days*temp22);
                if(isNaN(cagr) || cagr === Infinity){
                  cagr=0;
                  totalsum1.push(0);
                  totalsum2.push(0);
                }else{                
                  cagr = sum1all / sum2all;
                  totalsum1.push(temp22*days*cagr);
                  totalsum2.push(temp22*days);
                }
                
                var totpurchase =0;var totmarket=0;var totdays=0;
                var totsum1 =0;var totsum2=0;

                for (var k = 0; k < totalpurchasecost.length; k++) {
                  totpurchase = totalpurchasecost[k] + totpurchase; 
                  totmarket = totalmarketvalue[k] + totmarket; 
                  totdays = totaldays[k] + totdays;    
                  totsum1 = totalsum1[k] + totsum1;    
                  totsum2 = totalsum2[k] + totsum2;                   
                }
                totpurchase = totpurchase.toFixed(2);
                totmarket = totmarket.toFixed(2);
                console.log("totsum1=",totsum1)
                console.log("totsum2=",totsum2)
                gain = currentval - temp22;
                if (temp22 === 0) {
                  absreturn = 0;
                } else {
                  absreturn = ((parseFloat(currentval) - parseFloat(temp22)) / parseFloat(temp22)) * 100;
                }
                nval = parseFloat(currentval) / parseFloat(temp22);
                t = parseFloat(temp222 / temp22) / 365;
                rootval = 1 / parseFloat(t);
                mathpo = Math.pow(parseFloat(nval), parseFloat(rootval));

                var baseurl = window.location.href
                var domain = baseurl.split('/');
                var scheme_name_data = prodcode;
                var portfoliourl = "http://" + domain[domain.length - 2] + "/Portfoliodetail?pan=" + pan + "&folio=" + folio + "&rta=" + rta+ "&scheme=" + scheme_name_data  ;
              //  if (balance > 0.01 && balance != 0 && balance != 0.000) {
                  fullSchemeHtml += "<td><a href='" + portfoliourl + "' target='_blank'>" + scheme + "</a></td><td>" + folio + "</td><td>" + balance.toFixed(3) + "</td><td>" + temp22.toLocaleString('en-IN') + "</td><td>" + cnav + "</td><td>" + (Math.round(currentval)).toLocaleString('en-IN') + "</td><td>" + Math.round(gain) + "</td><td>" + days+ "</td><td>" + absreturn.toFixed(2) + "</td><td>" + cagr.toFixed(2) + "</td></tr>";
                  $(".randerData").html(fullSchemeHtml)
               $("#cost").html(totpurchase)
               $("#market").html(totmarket)
               $("#days").html(Math.round(totdays/totpurchase))
               $("#cagr").html((totsum1/totsum2).toFixed(2))
             //   }
              }.bind(this),
              error: function (jqXHR) {
                console.log(jqXHR);
              }
            })
           
          }
          
          this.setState({ data5: res });
        }.bind(this),
        error: function (jqXHR) {
          console.log(jqXHR);
        }
      });
     
    }
  }

  getportfolio = (e) => {
    var baseurl = window.location.href
    var domain = baseurl.split('/');
    var portfoliourl = domain[domain.length - 2] + "/Portfoliodetail?scheme=" + e.SCHEME + "&pan=" + e.PAN;
    window.open(portfoliourl, "_blank") //to open new page
  }

  suggestionBox = (e) => {
    $(".inputdata").show();
    var inputValue = $(".searchname").val();
    $.ajax({
      url: "http://localhost:3001/api/getsearchname",
      type: "POST",
      data: { name: inputValue },
      success: function (res4) {
       if(res4.status === 200){
                  this.setState({ searchname: res4.data });
                  }else{
                    
                  }   

      }.bind(this),
      error: function (jqXHR) {
        console.log(jqXHR);
      }
    });
  }

  changeApplicant = (e) => {
    var selectedvalue = e.target.innerText;
    $(".searchname").val(selectedvalue);
    $(".inputdata").hide();
  }

  componentDidMount() {
    document.title = "WMS | Portfolio Detail"
    $.ajax({
      url: "http://localhost:3001/api/getschemetype",
      type: "GET",
      success: function (res2) {
        this.setState({ data2: res2 });
      }.bind(this),
      error: function (jqXHR) {
        console.log(jqXHR);
      }
    });
    $(".inputdata").hide();
  }
  render() {
    var balance = 0;
    var unit = 0;
    var currentNav = 0;
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
            .hide-bal{
              display:none;
            }
            .search-data{
              list-style: none;
              padding: 10px;
              border: 1px solid #eee;
              height: auto;
              overflow-y: auto;
              background-color: white;
              position: absolute;
              max-width: 486px;
              max-height: 200px;
              min-width:333px;
              z-index: 9;
              width: auto;
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
                  <h1>Portfolio Report</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active">Portfolio Report</li>
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
                <div className="col-md-12">
                  <div className="card card-primary card-outline">
                    <div className="card-header">
                      <div className="row">
                        <div className="col-md-4 offset-md-1">
                          <div className="form-group">
                            <label>Applicant :</label>
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
                        <div className="col-md-2 offset-md-1">
                          <div className="form-group">
                            <label>Category :</label>
                            <select className="form-control" id="category">
                              <option value="ALL">ALL</option>
                              <option value="EQUITY">EQUITY</option>
                              <option value="DEBT">DEBT</option>
                              {/* {this.state.data2.map((item, index) => (
                                <option value={item}>{item}</option>

                              ))} */}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-2 offset-md-1">
                          <div className="form-group">
                            <div >
                              <button type="button" class="btn btn-primary mb-4" onClick={this.selectnameandcategory}>Show</button>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <table id="example2" class="table table-bordered table-hover table-responsive">
                        <thead>
                          <tr className="bg-primary">
                            <th>Scheme/Company</th>
                            <th>Folio</th>
                            <th>Balance Units</th>
                            <th>Purchase</th>
                            <th>Current NAV</th>
                            <th>Current Value</th>
                            {/* <th>Div. Paid</th> */}
                            <th>Gain/Loss</th>
                            <th>Days</th>
                            <th>Absolute Return%</th>
                            <th>CAGR(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="namepan"> </td>
                          </tr>
                        </tbody>
                        <tbody class="randerData">
                        </tbody>
                       <tfoot>
                       <tr className="bg-primary">
                                    <th>Total</th>
                                        <th></th>
                                        <th></th>
                                        <th id="cost"></th> 
                                        <th></th>
                                        <th id="market"></th> 
                                        <th></th>
                                        <th id="days"></th>
                                        <th></th>
                                        <th id="cagr"></th>
                                    </tr>
                                </tfoot>
                      </table>
                    </div>
                  </div>
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
};

export default Portfolio;

