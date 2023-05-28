import React from "react";
import $ from "jquery";
import { Component } from "react"; 
import {  MDBDataTableV5 } from 'mdbreact';
import { Link } from 'react-router-dom';
import Moment from 'moment';


class Datamanagement extends Component { 
  constructor(props) {
    super(props);
  
    this.state = {
      data1:[],
      searchdata:[],
      searchname:[],
      checkedBoxes: [],
      arr:[],
     }
    //  this.checkAll = this.checkAll.bind(this);
    //  this.deleteProducts = this.deleteProducts.bind(this);
    //   this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }
  checkAll() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var selectchecked = document.getElementById('check');
  if (selectchecked.checked === true) {
    for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            // this.setState = {
            //   //checkedBoxes: checkboxes[i].value
              
            // }
            this.state.checkedBoxes.push(checkboxes[i].value);
         } 
  }else{
    for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
    }
  }
  
}
deleteProducts = () => {
   if(window.confirm('Are you sure, want to delete the selected product?')) {
     for(var i=0 ; i<this.state.checkedBoxes.length ; i++){

    if(this.state.checkedBoxes[i] != "on"){
        $.ajax({
          url: "http://localhost:3001/api/Removedata",
          type: "POST",
          data:{id: this.state.checkedBoxes[i]},
          success: function (response) {
            window.location.reload();
            if(response.status === 200) {
              			document.getElementById('msg').innerHTML = '<span style="color:green;">Products deleted successfully</span>';
                  }
          	}  
          }); 
        }
        }
        }
      }
  serachdata = (e) =>{
    this.setState({searchdata: []});
    this.setState({arr: []});
   // this.setState({searchdata: ""});
    var schemeurl = "Transaction-detail";
    var foliourl = "Datafolio-detail";
    var searchvalue="";
    var searchtype = e.target.id;
    if(searchtype==="searchName"){
      var selectedvalue = e.target.innerText;
        var searchvalue = selectedvalue.split('/')[0];
        $(".searchname").val(selectedvalue);
        $(".inputdata").hide();
    }
    if(searchtype==="searchPan" || searchtype==="searchFolio"){
    searchvalue = $("input[name='"+searchtype+"']").val();
    }   
    // alert(searchvalue)
    // alert(searchtype)
    $.ajax({
      url: "http://localhost:3001/api/getdetailnamewise",
      type: "POST",
      data:{searchvalue: searchvalue,searchtype:searchtype},
      success: function (res) {
     
        for(var i = 0; i< res.length;i++){    
         $.ajax({
      url: "http://localhost:3001/api/getsearchdatamanagement",
      type: "POST",
      data:{scheme:res[i].PRODCODE,pan:res[i].PAN,folio:res[i].FOLIO},
      success: function (res2) {
       

        res2.data =res2.data.sort((a, b) => new Date(a.DATE.split("-").reverse().join("/")).getTime() - new Date(b.DATE.split("-").reverse().join("/")).getTime())
         var unit=0;var balance=0;var cnav=0;var currentvalue = 0;
        for(var j = 0; j<res2.data.length; j++){
            if(res2.data[j].SCHEME === res2.data[0].SCHEME){
            if(res2.data[j].NATURE === 'RED' || res2.data[j].NATURE === 'R' || res2.data[j].NATURE === 'LTOP' || res2.data[j].NATURE === 'Lateral Shift Out' ||
             res2.data[j].NATURE === 'LTOF' || res2.data[j].NATURE === 'IPOR' || res2.data[j].NATURE === 'Switch Out' ||
              res2.data[j].NATURE === 'FUL' || res2.data[j].NATURE === 'STPO' || res2.data[j].NATURE === 'CNO' || res2.data[j].NATURE === 'SWOF'
              || res2.data[j].NATURE === 'FULR'|| res2.data[j].NATURE === 'Full Redemption'|| res2.data[j].NATURE === 'Partial Switch Out'
              || res2.data[j].NATURE === 'Full Switch Out'|| res2.data[j].NATURE === 'Partial Redemption' || res2.data[j].NATURE === 'TOCOB'
              || res2.data[j].NATURE === 'SWD'){
              unit = "-"+res2.data[j].UNITS
            }
            else{
              unit = res2.data[j].UNITS 
            }
            balance = parseFloat(unit)+parseFloat(balance)
            cnav = res2.data[j].cnav;
            currentvalue= parseFloat(cnav)*parseFloat(balance);         
        }
        }
        
        var index = res2.data.length-1;
        if(balance === 0 && currentvalue === 0 && balance === null){
          res2.data[index].AMOUNT = 0; 
        }else{
          if (isNaN(currentvalue)) currentvalue = 0;
          res2.data[index].AMOUNT = Math.round(currentvalue); 
        }
      
          res2.data[index].navdate =res2.data[0].navdate;
          res2.data[index].SCHEME =res2.data[0].SCHEME ;
          res2.data[index].FOLIO =res2.data[0].FOLIO ;
          res2.data[index].INVNAME =res2.data[0].INVNAME;
          res2.data[index].PAN =res2.data[0].PAN; 
          res2.data[index].PRODCODE = res2.data[0].PRODCODE;
         this.state.arr.push(res2.data[index]);
       this.setState({searchdata: this.state.arr});

        }.bind(this),
        error: function(jqXHR) {
         console.log(jqXHR);         
       }
      });
    }
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
        

  componentDidMount(){
    document.title = "WMS | Datamanagement"

  }

  render(){
    // var searchdata = ""
    const {searchdata} = [];
    var schemeurl = "Transaction-detail";
    var foliourl = "Datafolio-detail";
    console.log(this.state);
    
  const data = {
      columns: [
        {
          label: <input type="checkbox" onClick={this.checkAll} id="check" />,
          field: 'CHECK',
          width: 50
        },
        {
          label: 'FOLIO',
          field: 'FOLIO',
          width: 150
        },
        {
          label: 'SCHEME',
          field: 'SCHEME',
          width: 370
        },
        {
          label: 'APPLICANT',
          field: 'INVNAME',
          width: 200
        },
        {
          label: 'PAN',
          field: 'PAN',
          width: 150
        },
        {
          label: 'AUM',
          field: 'AMOUNT',
          width: 50
        },
        {
          label: 'VALUATION DATE',
          field: 'navdate',
          width: 120
        }          
      ],
      rows:this.state.searchdata.map(item => {
       
        return{
          
          CHECK:<input type="checkbox" id="singleclass" class={item.RTA} value={item._id} checked={this.state.checkedBoxes.find((p) => p.id === item._id)} onChange={(e) => this.toggleCheckbox(e, item)}/>,
        FOLIO:item.FOLIO,
        SCHEME: <a href={schemeurl+'?pan='+item.PAN+'&folio='+item.FOLIO+'&scheme='+item.PRODCODE} target='_blank'>{item.SCHEME}</a>,
        INVNAME: item.INVNAME,
        PAN:item.PAN,
        AMOUNT: item.AMOUNT,
      //  navdate:Moment(item.navdate).format("YYYY-MM-DD"),
        
        navdate: new Date(item.navdate).toLocaleDateString(),
        
        }
      })
      
    };

    
   
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
      min-width:430px;
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
    <section className="content-header p-1">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h3 className="mb-0">Data Management</h3>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="admin">Home</a></li>
                  <li className="breadcrumb-item active">Data Management</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
     <div className="card">             
     <div className="card-body">   
     <div class="col-md-5 offset-md-3">
				<nav>
					<div class="nav nav-pills nav-fill" id="nav-tab" role="tablist">
						<a class="nav-item nav-link active nav-primary" id="nav-contact-tab" data-toggle="tab" href="#nav-client" role="tab" aria-controls="nav-client" aria-selected="true">Search Name</a>

						<a class="nav-item nav-link" id="nav-about-tab" data-toggle="tab" href="#nav-folio" role="tab" aria-controls="nav-folio" aria-selected="false">Search Folio</a>

            <a class="nav-item nav-link" id="nav-about-tab" data-toggle="tab" href="#nav-pan" role="tab" aria-controls="nav-pan" aria-selected="false">Search Pan</a>
					</div>
				</nav>
				<div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-client" role="tabpanel" aria-labelledby="nav-client-tab">
					{/* <div class="input-group">
                    <input type="text" class="form-control searchName" name="searchName"  placeholder="Search Name" aria-label="Search Name" aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                    <button id="searchName" onClick={this.serachdata} class="btn btn-outline-secondary" type="button"> <span className="fas fa-search mr-2"></span>Search</button>
                    </div>
                    </div> */}


<input type="text" name="searchname" onKeyUp={this.suggestionBox} className="form-control searchname" autoComplete="off" />
                                        <div className="inputdata">
                                            <ul className="search-data">
                                              {this.state.searchname.map((item, index) => (
                                                <li id="searchName" onClick={this.serachdata} >{item.INVNAME}/{item.PAN}</li> 
                                                ))}
                                               
                                            </ul>
                                          </div>
					</div>

                    <div class="tab-pane fade" id="nav-folio" role="tabpanel" aria-labelledby="nav-folio-tab">
					<div class="input-group ">
                    <input type="text" class="form-control searchFolio" name="searchFolio" placeholder="Search Folio" aria-label="Search Folio" aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                    <button id="searchFolio" onClick={this.serachdata}  class="btn btn-outline-secondary" type="button"> <span className="fas fa-search mr-2"></span>Search</button>
                    </div>
                    </div>
					</div>

          <div class="tab-pane fade" id="nav-pan" role="tabpanel" aria-labelledby="nav-pan-tab">
					<div class="input-group ">
                    <input type="text" class="form-control searchPan" name="searchPan"  placeholder="Search Pan" aria-label="Search Pan" aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                    <button id="searchPan" onClick={this.serachdata}  class="btn btn-outline-secondary" type="button"> <span className="fas fa-search mr-2"></span>Search</button>
                    </div>
                    </div>
					</div>
				</div>			
			</div>
     
      <div className="card-header">
        <div id="msg"></div>
        <button type="button" class="btn btn-primary mb-4" id="delbtn" onClick={this.deleteProducts} >Delete</button>
        </div>
           <div class="datatable">  

             <MDBDataTableV5  hover
      entriesOptions={[100, 300, 500]}
      entries={100}
      pagesAmount={4}
      scrollY
      maxHeight="400px"
      striped
      bordered
      small
      responsive
      data={data}
      pagingTop
      searchTop
      searchBottom={false}/>
          </div>      
            </div>
            </div>
            </div>
   
    </>
  );
 }
};

export default Datamanagement;
