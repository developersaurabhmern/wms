import React from "react";
import { Component } from "react";
import { Redirect ,Route} from 'react-router-dom'
import $ from 'jquery';
import moment from 'moment';
// import '../../public/plugins/bootstrap/js/bootstrap.js';
// import '../../public/plugins/fontawesome-free/css/all.min.css';
// import '../../public/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../../public/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../../public/plugins/jqvmap/jqvmap.min.css';
// import '../../public/dist/css/adminlte.min.css';
// import '../../public/plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../../public/plugins/daterangepicker/daterangepicker.css';
// import '../../public/plugins/summernote/summernote-bs4.css';
// import '../../public/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css';
// import '../../public/plugins/datatables-responsive/css/responsive.bootstrap4.min.css';
// import '../../public/plugins/jquery/jquery.min.js';
// import '../../public/plugins/jquery-ui/jquery-ui.min.js';
// import '../../public/plugins/bootstrap/js/bootstrap.bundle.min.js';
// import '../../public/plugins/chart.js/Chart.min.js';
// import '../../public/plugins/sparklines/sparkline.js';
// import '../../public/plugins/jqvmap/jquery.vmap.min.js';
// import '../../public/plugins/jqvmap/maps/jquery.vmap.usa.js';
// import '../../public/plugins/jquery-knob/jquery.knob.min.js';
// import '../../public/plugins/moment/moment.min.js';
// import '../../public/plugins/daterangepicker/daterangepicker.js';
// import '../../public/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js';
// import '../../public/plugins/summernote/summernote-bs4.min.js';
// import '../../public/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js';
// import '../../public/dist/js/adminlte.js';
// import '../../public/dist/js/pages/dashboard.js';
// import '../../public/dist/js/demo.js';
// import '../../public/plugins/datatables/jquery.dataTables.min.js';
// import '../../public/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js';
// import '../../public/plugins/datatables-responsive/js/dataTables.responsive.min.js';
// import '../../public/plugins/datatables-responsive/js/responsive.bootstrap4.min.js';

//var createReactClass = require('create-react-class');

class Home extends Component { 
  constructor(props) {
    super(props);
   // this.changeApplicant = this.changeApplicant.bind(this);
    this.state = {
      searchname: [],
      userdata: [],
      totalpurchase:[],
      totalcurrent:[],
      totalgain:[],
      user:'',
    };
  
  }
  // suggestionBox = (e) => {
  //   $(".inputdata").show();
  //   var inputValue = $(".searchname").val();
  //   $.ajax({
  //     url: "http://localhost:3001/api/getsearchname",
  //     type: "POST",
  //     data: { name: inputValue },
  //     success: function (res4) {
  //       this.setState({ searchname: res4 });

  //     }.bind(this),
  //     error: function (jqXHR) {
  //       console.log(jqXHR);
  //     }
  //   });
  // }

  // changeApplicant = (e) => {
  //   var selectedvalue = e.target.innerText;
  //   var name = selectedvalue.split('/')[0];
  //   var pan = selectedvalue.split('/')[1];
  //   var catValue = "ALL";
  //   $(".searchname").val(selectedvalue);
  //   $(".inputdata").hide();
  //   var fullSchemeHtml = "";
  //   var sch = "";var totalcurrent=0;var totalpurchase=0;  var arr=[];var arrlen;
  //   var totalgain=0;
  //   $.ajax({
  //     url: "http://localhost:3001/api/getportfolioscheme",
  //     type: "POST",
  //     data: { pan: pan, name: name ,category:catValue},
  //     success: function (res) {
  //       for (var i = 0; i < res.length; i++) {
  //    //   console.log("first response=",res[i].SCHEME,res[i].FOLIO)
  //         $.ajax({
  //           url: "http://localhost:3001/api/getschemeportfoliodetail",
  //           type: "POST",
  //           data: { scheme:res[i].SCHEME, pan:res[i].PAN, folio:res[i].FOLIO, name:res[i].NAME,RTA:res[i].RTA },
  //           success: function (res2) {
              
  //             res2.data = res2.data.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());
  //             fullSchemeHtml += "<tr>"
            
  //             var unit = 0; var balance = 0; var amount = 0; var amt = 0; var cnav = 0; var currentval = 0; var gain = 0; var absreturn = 0; var days = 0; var date1 = ""; var date2 = ""; var totaldays = 0;
  //             var t = 0; var cagr = 0; var avgDays = 0; var rootval = 0; var nval = 0; var mathpo = 0;
  //             var arrunit = []; var arrnav = [];var amtt=0;var arrdays=[];var alldays=[];
  //             var arrpurchase = []; var j = 0;var temp333 =0;var temp222=0;var rowval = 0;
  //             var temp1, temp2 = 0; var temp3 = 0; var temp4 = 0; var temp33 = 0; var temp22 = 0; var totdays = 0;
  //             var isin = ""; var newnavdate = "";var daystotal=0;       
  //             for (var n = 0; n < res2.data.length; n++) {
  //               if(typeof res2.data[0] != "undefined"){
  //               if (res2.data[n].SCHEME === res2.data[0].SCHEME) {
  //               for (var jj = 0; jj < arrunit.length; jj++) {
  //                 if (arrunit[jj] === 0)
  //                   arrunit.shift();
  //                 if (arrpurchase[jj] === 0)
  //                   arrpurchase.shift();
  //                   if (arrdays[jj] === 0)
  //                   arrdays.shift();
  //                   if (alldays[jj] === 0)
  //                   alldays.shift();
  //               }
               
  //               if (res2.data[n].NATURE != 'Switch Out') {
  //                 unit = res2.data[n].UNITS
  //                 amount = res2.data[n].AMOUNT;
  //                 var date = res2.data[n].TD_TRDT;
  //                 var navdate = res2.data[n].navdate;

  //                 var d = new Date(date.split("-").reverse().join("-"));
  //                 var dd = d.getDate();
  //                 var mm = d.getMonth() + 1;
  //                 var yy = d.getFullYear();
  //                 var newdate = mm + "/" + dd + "/" + yy;


  //                 var navd = new Date(navdate);
  //                 var navdd = navd.getDate();
  //                 var navmm = navd.getMonth() + 1;
  //                 var navyy = navd.getFullYear();
  //                 var newnavdate = navmm + "/" + navdd + "/" + navyy;
  //                 date1 = new Date(newdate);
  //                 date2 = new Date(newnavdate);
  //                 days = moment(date2).diff(moment(date1), 'days');
  //                 //amtt = res2.data[n].AMT+amtt ;
  //                 arrunit.push(res2.data[n].UNITS);
  //                 arrpurchase.push(Math.round(res2.data[n].UNITS * parseFloat(res2.data[n].TD_NAV)));
  //                 arrdays.push(parseFloat(days)*res2.data[n].UNITS * parseFloat(res2.data[n].TD_NAV));
  //                 alldays.push(parseFloat(days));
  //                 temp1 = res2.data[n].UNITS;
  //                 temp2 = temp1 + temp2;
  //                 var navrate = res2.data[n].TD_NAV
  //               } else {
  //                 unit = "-" + res2.data[n].UNITS
  //                 amount = "-" + res2.data[n].AMOUNT
  //                     if (temp4 != "") {
  //                       arrunit.splice(0, 0, temp4);
  //                     }
  //                     temp2 = res2.data[n].UNITS;
                    
  //                     for (var p = 0; p < arrunit.length; p++) {
  //                       temp3 = arrunit[p];
  //                       rowval = p;
  //                       arrunit[p] = 0;
  //                       if (temp2 > temp3) {
  //                         arrpurchase[p] = 0;
  //                         arrdays[p]=0;
  //                         alldays[p]=0;
  //                         temp2 = parseFloat(temp2) - parseFloat(temp3);
  //                       } else {
  //                         temp4 = temp3 - temp2;
  //                         var len = res2.data.length -1;     
  //                        // console.log("nature=",res2.data[len].NATURE )             
  //                         if(res2.data[len].NATURE === "SIP" || res2.data[len].NATURE === "Purchase"){
  //                           //console.log("nav=",res2.data[rowval].TD_NAV,rowval)
  //                           arrpurchase[p] = temp4 * parseFloat(res2.data[p].TD_NAV);
  //                           arrdays[p] = parseFloat(alldays[p])*temp4 * parseFloat(res2.data[p].TD_NAV);
  //                         }else{
  //                           arrpurchase[p] = temp4 * parseFloat(navrate);
  //                           arrdays[p] = parseFloat(alldays[p])*temp4 * parseFloat(navrate);
  //                         }
  //                         //console.log("arrpurchase=",arrpurchase,rowval,res2.data[p].SCHEME,res2.data[rowval].TD_NAV);
  //                         break;
  //                       }
  //                     }
  //                 }
  //                 balance = parseFloat(unit) + parseFloat(balance);
  //                 cnav = res2.data[n].cnav
  //                 currentval = cnav * balance
                 
  //                 var scheme = res2.data[n].SCHEME;
  //                 var folio = res2.data[n].FOLIO;
  //                 var isin = res2.data[n].ISIN;
  //               }
  //             }
           
  //             }
              
  //             temp22 = 0;           
             
  //             for (var k = 0; k < arrpurchase.length; k++) {
  //               temp33 = Math.round(arrpurchase[k]);
  //               temp22 = temp33 + temp22;
  //               temp333 = Math.round(arrdays[k]);
  //               temp222 = temp333 + temp222;
             
  //             }

  //             gain = currentval - temp22;
              
  //             absreturn = ((parseFloat(currentval) - parseFloat(temp22)) / parseFloat(temp22)) * 100;
  //             nval = parseFloat(currentval) / parseFloat(temp22);
  //             t = parseFloat(temp222/temp22) / 365;
             
  //                 rootval = 1 / parseFloat(t);
                
  //             mathpo = Math.pow(parseFloat(nval), parseFloat(rootval));
            
  //             cagr = (parseFloat(mathpo) - 1) * 100;
             
  //             var baseurl = window.location.href
  //             var domain = baseurl.split('/');
  //             var scheme_name_data = scheme;
  //           //  var portfoliourl = "http://" + domain[domain.length - 2] + "/Portfoliodetail?scheme=" + scheme_name_data + "&pan=" + pan + "&folio=" + folio;
  //            if (balance > 0.01 && balance != 0 && balance != 0.000) {
  //             totalcurrent=parseFloat(currentval)+totalcurrent;
  //             this.setState({ totalcurrent: totalcurrent });
  //              totalpurchase = parseFloat(temp22)+totalpurchase;
  //              this.setState({ totalpurchase: totalpurchase });
  //              totalgain = parseFloat(gain)+totalgain;
  //              this.setState({ totalgain: totalgain });
  //          }
          
  //           }.bind(this),
  //           error: function (jqXHR) {
  //             console.log(jqXHR);
  //           }
            
  //         })
  //       }
        

        
  //     }.bind(this),
  //     error: function (jqXHR) {
  //       console.log(jqXHR);
  //     }
  //   });
      
  // }


  logout = (e) => {
    e.preventDefault();
    // var baseurl = window.location.href;
    // alert(baseurl)
    //var domain = baseurl+"Login"
    window.localStorage.clear();
    window.location.href = "/Login";
  }
  componentDidMount(){
    document.title = "WMS | Dashboard"
    if(localStorage.getItem("user") != ""){
     
      // localStorage.setItem("user",username)
      this.setState({ user: localStorage.getItem("user") });
     
     
     // alert(this.state.user)
     // localStorage.setItem("user", user)
    }
  }
  render(){
    var user = localStorage.getItem("user")
    localStorage.setItem("user",user)
    //alert(user)
    if (user === "" || user === null) {
      return <Redirect to='/Login' />
    }
  return (  
    <>
    
    <style jsx>{`
      .admin-nav{
        display:block!important;
      }
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

    `}</style>
   {/* Content Wrapper. Contains page content */}
   <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Dashboard</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Dashboard {localStorage.getItem("user")}</li>
                  <li className="breadcrumb-item"><a href="" onClick={this.logout}>Logout</a></li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* Small boxes (Stat box) */}
          <div className="col-md-4 offset-md-1">
                          <div className="form-group">
                            {/* <label>Applicant :</label>

                            <input type="text" name="searchname" onKeyUp={this.suggestionBox} className="form-control searchname" autoComplete="off" />
                            <div className="inputdata">
                              <ul className="search-data">
                                {this.state.searchname.map((item, index) => (
                                  <li onClick={this.changeApplicant} >{item.INVNAME}/{item.PAN}</li>
                                ))}

                              </ul>
                              
                            </div> */}
                            <table>
                            <tbody class="randerData">

</tbody>
                            </table>
                          </div>
                        </div>
                        <br></br>
            <div className="row">
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-info">
                  <div className="inner">
                  <p>PURCHASE COST</p>
                    <h3>{Math.round(45421234)}</h3>
                   
                  </div>
                  <div className="icon">
                    <i className="" />
                  </div>
                  <a  className="small-box-footer"> <i className="fas" /></a>
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-success">
                  <div className="inner">
                  <p>MARKET VALUE</p>
                  <h3>{Math.round(44)}</h3>
                    
                   
                  </div>
                  <div className="icon">
                    <i className="" />
                  </div>
                  <a  className="small-box-footer"> <i className="fas" /></a>
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-warning">
                  <div className="inner">
                  <p>DAYS'S CHANGE</p>
                    <h3>44</h3>
               
                  </div>
                  <div className="icon">
                    <i className="" />
                  </div>
                  <a  className="small-box-footer"> <i className="fas" /></a>
                </div>
              </div>
              </div>
              <div className="row">
              {/* ./col */}
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-danger">
                  <div className="inner">
                  <p>DIVIDEND</p>
                    <h3>65</h3>
                    
                  </div>
                  <div className="icon">
                    <i className="" />
                  </div>
                  <a  className="small-box-footer"> <i className="fas" /></a>
                </div>
              </div>
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-secondary">
                  <div className="inner">
                  <p>GAIN/LOSS</p>
                  <h3>{Math.round(4)}</h3>
                   
                  </div>
                  <div className="icon">
                    <i className="" />
                  </div>
                  <a  className="small-box-footer"> <i className="fas" /></a>
                </div>
              </div>
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-info">
                  <div className="inner">
                  <p>CAGR</p>
                    <h3>65</h3>
                   
                  </div>
                  <div className="icon">
                    <i className="" />
                  </div>
                  <a  className="small-box-footer"> <i className="fas" /></a>
                </div>
              </div>
              {/* ./col */}
            </div>
            {/* /.row */}
            {/* Main row */}
            <div className="row">
             
             
            </div>
            {/* /.row (main row) */}
          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
      {/* /.content-wrapper */}
    </>
  );
 }
};

export default Home;
