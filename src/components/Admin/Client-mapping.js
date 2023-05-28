import React, { Component } from "react";
import $ from "jquery";
import { DataTable } from 'mdbreact';
import Loader from './loader';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import axios from 'axios';

class Trans_Report extends Component {

  constructor(props) {
    super(props);
    this.selectdata = this.selectdata.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.selectRow = this.selectRow.bind(this);
    this.updateData = this.updateData.bind(this);
    this.state = {
      searchdata: [],
      amclist: [],
      checkedBoxes: [],
      searchuserid: [],
      searchid: [],
      count: 0
    }
  }


  selectdata = (e) => {
    var inputName = $(".searchname").val();
    var inputPan = $(".searchpan").val();
    var regex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    var fromdate = $("#from").val();
    var todate = $("#to").val();
    $(".loader").css("display", "block");
    $("#datasection").css("display", "none");
    $("#datasection1").css("display", "none");
    axios.post('http://localhost:3001/api/searchclient', { pan: inputPan, name: inputName, fromdate: fromdate, todate: todate })
      .then(res => {
        if (res.data.message === "Data not found !") {
          $(".loader").css("display", "none");
          $("#datasection1").css("display", "block");
        } else {

          this.setState({ searchdata: res.data.data });
          $(".loader").css("display", "none");
          $("#datasection").css("display", "block");
        }
      })
  }

  checkAll = () => {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var selectchecked = document.getElementById('check');
    if (selectchecked.checked === true) {
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
        // this.setState = {  
        // }
        this.setState({ checkedBoxes: [] });
        this.state.checkedBoxes.push(checkboxes[i].value);
      }
    } else {
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
    }
  }

  toggleCheckbox = (e, item) => {
    if (e.target.checked) {
      let arr = this.state.checkedBoxes;
      arr.push(item._id);
      this.setState({ checkedBoxes: arr })
    } else {
      let items = this.state.checkedBoxes.splice(this.state.checkedBoxes.indexOf(item._id), 1);
      this.setState({ checkedBoxes: items })
    }
  }

  selectRow = (e) => {
    var ids = $('.clientdata:checkbox:checked').map(function () {
      return this.id;
    }).get();
    var idval = $('.clientdata:checkbox:checked').map(function () {
      return this.name;
    }).get();
    var inc = 0;
    if (idval.length === 1) {
      alert("Please merge min two data.");
      return false;

    }
    for (var i = 0; i < idval.length; i++) {
      if (idval[0] != idval[i]) {
        inc = inc + i;
      }
      else {
        inc = inc - i;
      }
    }
    if (inc > 0) {
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure want to merge two different pan.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              $.ajax({
                url: "http://localhost:3001/api/getselecteddata",
                type: "POST",
                data: { id: ids },
                success: function (res1) {
                  var foliodetail = "<option value=''>Select Data.</option>";
                  {
                    res1.map((item, index) => (
                      foliodetail += "<option value='" + item.PAN + "_" + item.INVNAME + "_" + item.GUARDPAN + "_" + item.USER_ID + "_" + item.ADD1 + "_" + item.ADD2 + "_" + item.ADD3 + "'><span class='client-name'>" + item.INVNAME + "</span>  " + item.PAN + "  " + item.USER_ID + "  " + item.ADD1 + "  " + item.ADD2 + "  " + item.ADD3 + "</option>"
                    ))
                  }
                  $("#resdata").html(foliodetail);
                }.bind(this)
              });
            }
          },
          {
            label: 'No',
            onClick: () => { return false; }
          }
        ]
      });
      return false;
    }
    if (inc < 0) {
      $.ajax({
        url: "http://localhost:3001/api/getselecteddata",
        type: "POST",
        data: { id: ids },
        success: function (res1) {
          var foliodetail = "<option value=''>Select Data.</option>";
          {
            res1.map((item, index) => (
              foliodetail += "<span class='client-name'><option value='" + item.PAN + "_" + item.INVNAME + "_" + item.GUARDPAN + "_"+ item.USER_ID + "_" + item.ADD1 + "_" + item.ADD2 + "_" + item.ADD3 + "'>" + item.INVNAME + "" + item.PAN + "  " + item.USER_ID + "  " + item.ADD1 + "  " + item.ADD2 + "  " + item.ADD3 + "</option></span>"
            ))
          }
          $("#resdata").html(foliodetail);
        }.bind(this)
      });
    }
  }

  updateData() {
    var selectedValue = $("#resdata").val();
    if (selectedValue === "") {
      alert("please select which data you want to update")
    } else {
      var ids = $(':checkbox:checked').map(function () {
        return this.value;
      }).get();
      console.log("idval=",ids)
      var pan = selectedValue.split('_')[0];
      var name = selectedValue.split('_')[1];
      var gpan = selectedValue.split('_')[2];
      var userid = selectedValue.split('_')[3];
      var add1 = selectedValue.split('_')[4];
      var add2 = selectedValue.split('_')[5];
      var add3 = selectedValue.split('_')[6];
      $.ajax({
        url: "http://localhost:3001/api/updatepersonaldetail",
        type: "POST",
        data: { updatepan: pan, updatename: name,gpan:gpan,updateuserid:userid, updateadd1: add1, updateadd2: add2, updateadd3: add3, id: ids },
        success: () => {
          $('input:checked').prop('checked', false);
          $("#resdata").val('');
          this.selectdata();
        }
      });
    }
  }

  componentDidMount() {
    $("#datasection1").css("display", "none");
    $("#datasection").css("display", "none");
    document.title = "WMS | Mapping Detail"
  }
  render() {
    var today = new Date();
    //  var d = new Date();
    //  var month = d.getMonth()+1;
    //  var day = d.getDate();
    //  var output = d.getFullYear() + '/' +
    //      ((''+month).length<2 ? '0' : '') + month + '/' +
    //      ((''+day).length<2 ? '0' : '') + day;



    const values = {
      fromdate: "2017-01-01",
      todate: today.getFullYear() + '-' + (("0" + (today.getMonth() + 1)).slice(-2)) + '-' + ("0" + today.getDate()).slice(-2)

    }

    const data = {
      columns: [
        {
          label: <input type="checkbox" onClick={this.checkAll} id="check" class="chk" />,
          field: 'CHECK',
          sort: 'disabled',
        },
        {
          label: 'APPLICANT',
          field: 'INVNAME',
          sort: 'disabled',
        },
        {
          label: 'ADDRESS',
          field: 'ADD1',
          sort: 'disabled',
        },
        {
          label: 'CREATEDATE',
          field: 'NAVDATE',
        },
        {
          label: 'PAN',
          field: 'PAN',
          sort: 'disabled',
        },
        {
          label: 'ID',
          field: 'ID',
        },
      ],
      rows: this.state.searchdata.map(item => {
        return {
          CHECK: <input type="checkbox" class="clientdata" id={item._id} name={item.PAN} value={item.PAN + "_" + item.INVNAME + "_" +item.GPAN + "_" + item.USER_ID + "_" + item.ADD1 + "_" + item.ADD2 + "_" + item.ADD3} checked={this.state.checkedBoxes.find((p) => p.id === item._id)} onChange={(e) => this.toggleCheckbox(e, item)} />,
          INVNAME: <span class="client-name">{item.INVNAME}</span>,
          ADD1: item.ADD1 + item.ADD2 + item.ADD3,
          NAVDATE: item.NAVDATE,
          PAN: item.PAN,
          ID: item.USER_ID,
        }
      })
    };
    return (
      <>
        <style jsx>
          {`
            
             .client-name {
              white-space: pre;
             }
             .search-data{
                list-style: none;
                padding: 10px;
                border: 0px solid #eee;
                height: auto;
                overflow-y: auto;
                background-color: white;
                position: absolute;
                max-width: 486px;
                min-width: 280px;
                max-height: 200px;
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
                .removeFromInput{
                  border: none;
                  background: transparent;

                }
                .dataTable_scrollBody .dataTable tbody tr td:nth-child(1) {
                  width: 90px;
                }
                .dataTable_scrollBody .dataTable tbody tr td:nth-child(2) {
                  min-width: 170px;
                  max-width: 215px;
                  overflow: auto;
                }
                .dataTable_scrollBody .dataTable tbody tr td:nth-child(3) {
                  width: 255px;
                }
                .dataTable_scrollBody .dataTable tbody tr td:nth-child(4) {
                  width: 320px;
                }
                
         `}
        </style>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Client Mapping</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active">Client Mapping</li>
                  </ol>
                </div>
              </div>
            </div>{/* /.container-fluid */}
          </section>
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              <div className="card card-primary card-outline">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label>Applicant :</label>
                        <input type="text" name="searchname" className="form-control searchname" />

                        {/* <input type="text" name="searchname" onKeyUp={this.suggestionBox} className="form-control searchname" autoComplete="off" /> */}
                        {/* <div className="inputdata">
                              <ul className="search-data">
                                {this.state.searchname.map((item, index) => (
                                  <li onClick={this.changeApplicant} >{item.INVNAME}</li>
                                ))}

                              </ul>
                            </div>    */}
                        {/* <div >
                            
                              <input type="text" name="clientname" className="form-control clientname" />
                              
                            </div>                    */}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label>PAN :</label>
                        <input type="text" name="searchpan" className="form-control searchpan" />
                      </div>
                    </div>
                    {/* <div className="col-lg-3">
                            <div className="form-group">
                                <label>Scheme :</label>
                                <select id="searchscheme" className="form-control searchscheme" >
                                <option value="">Select Scheme</option>
                                {this.state.searchscheme.map((item, index) => (
                                  <option value={item}>{item}</option>
                                ))}
                                </select>                    
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-group">
                            <label>Folio :</label>
                            <input type="text" id="folio" className="form-control" />               
                            </div>
                        </div> */}
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label>From :</label>
                        <input type="date" className="form-control" id="from" defaultValue={values.fromdate} />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label>To :</label>
                        <input type="date" className="form-control" id="to" defaultValue={values.todate} />
                      </div>
                    </div>

                    {/* <div className="col-lg-3">
                            <div className="form-group">
                                <label>RTA :</label>
                                <select className="form-control">
                                  <option value="">Select RTA</option>
                                  <option value="CAMS">CAMS</option>
                                  <option value="KARVY">KARVY</option>
                                </select>                   
                            </div>
                        </div> */}
                    <div className="col-lg-3">
                      <div className="form-group mt-1">
                        <a href="#" className="btn btn-primary shadow-sm mt-4 w-100" onClick={this.selectdata}>Show</a>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Loader />
              <div id="datasection1">
                <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Data not found</label>
              </div>
              <div id="datasection" >
                <div className="card">
                  <div className="card-body">
                    <div class="datatable">

                      <DataTable hover
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
                        searchBottom={false} />

                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <select className="form-control" id="resdata">
                          </select>

                        </div>
                        <div><a href="javascript:void(0)" className="btn btn-success" onClick={this.updateData}>Update</a>   </div>

                      </div>
                      <div className="col-6 text-right">
                        <div className="form-group d-inline">
                          <a href="javascript:void(0)" className="btn btn-success ml-3" id="buttonClass" onClick={this.selectRow}>Merge</a>
                          <a href="#" className="btn btn-success ml-3">Save</a>
                          <a href="#" className="btn btn-danger ml-3">Delete Marked</a>
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
};

export default Trans_Report;

