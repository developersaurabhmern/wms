import React, { Component } from "react";
import $ from "jquery";
import validator from 'validator';
import axios from 'axios';
import { MDBDataTableV5 } from 'mdbreact';

class Alluser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data1: [],
      showModalPopup: false
    }
  }
  componentDidMount() {
    axios.get('http://localhost:3001/api/listingclient')
      .then(res1 => {
        console.log(res1.data.data)
        this.setState({
          data1: res1.data.data,
        });
      })
  }

  editclient = (param) => {
    var newlist = [];
    const requestdata = {
      email: param
    }
    axios.post('http://localhost:3001/api/clientdetail', requestdata)
      .then(res1 => {
        console.log(res1.data)
        if (res1.data.status === 200) {
          newlist.push(res1.data.data);
          var newdata= localStorage.setItem('data', JSON.stringify(newlist));
          var URL = "http://localhost:3000/edituser";
          window.open(URL);        
        } else {
         
        }
      })
  }

  check = (param) => {
    const requestdata = {
      email: param
    }
    axios.post('http://localhost:3001/api/clientdetail', requestdata)
      .then(res1 => {
        console.log(res1.data)
        if (res1.data.status === 200) {
          $("#email").html(res1.data.data.email)
          $("#userid").html(res1.data.data.user_id)
          $("#password").html(res1.data.data.password)
          $("#pan").html(res1.data.data.pan_card)
          $("#phone").html(res1.data.data.phone)
          $("#dob").html(res1.data.data.date_of_birrth)
          $("#address").html(res1.data.data.address)
          $("#pincode").html(res1.data.data.pincode)
          $("#city").html(res1.data.data.city)
          $("#state").html(res1.data.data.state)
          $("#country").html(res1.data.data.country)
          $("#headername").html(res1.data.data.name)
          $("#device").html(res1.data.data.type_device)
          $("#hh").html();
          window.$('#myModal').modal('show')
        } else {
          $("#hh").html();
          $("#email").html()
          $("#userid").html()
          $("#pan").html()
          $("#phone").html()
          $("#dob").html()
          $("#address").html()
          $("#pincode").html()
          $("#city").html()
          $("#state").html()
          $("#country").html()
          $("#headername").html()
          $("#device").html()
          window.$('#myModal').modal('show')
        }
      })
  }
  render() {
    const data = {
      columns: [
        {
          label: 'S.No',
          field: 'SR',
          width: 100
        },
        {
          label: 'NAME1',
          field: 'INVNAME1',
          width: 100,
        },
        {
          label: 'NAME',
          field: 'INVNAME',
          width: 100
        },
        {
          label: 'EMAIL',
          field: 'EMAIL',
          width: 100
        },
        {
          label: 'PASSWORD',
          field: 'PASSWORD',
          width: 100
        },
        {
          label: 'USER',
          field: 'USER',
          width: 100
        },
        {
          label: 'DEVICE',
          field: 'DEVICE',
          width: 100
        },
        {
          label: 'ACTION',
          field: 'EDIT',
          width: 100
        },

      ],
      rows: this.state.data1.map((item, index) => {
        return {
          SR: index + 1,
          INVNAME1: item.name,
          INVNAME: <a href="javascript:void(0)" onClick={() => this.check(item.email)}>{item.name}</a>,
          EMAIL: item.email,
          PASSWORD: item.password,
          USER: item.user_id,
          DEVICE: item.type_device,
          EDIT: <><input type="button" onClick={() => this.editclient(item.email)} value="EDIT" /> / <input type="button" value="DELETE" /></>,
        }
      })
    };
    return (
      <>
      <style jsx>
        {`
   
   
    .mdb-dataTable-head tr th:nth-child(2)
    {
      display: none;
    }
    tbody tr td:nth-child(2)
    {
     display: none;
    }
    `}
      </style>
      
      <div className="content-wrapper">
        <section className="content-header p-1">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h3 className="mb-0">List of Users</h3>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="admin">Home</a></li>
                  <li className="breadcrumb-item active">All Users</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              {/* left column */}
              {/* <div className="col-md-10 offset-md-1"> */}
              <div className="col-md-12">
                <div className="card card-outline card-success">
                  {/* <div className="card-header"> */}
                  <div id="example1" >
                    <div className="card-header">
                      <h3 className="card-title"></h3>
                    </div>
                    {/* <div className="card-body"> */}
                    <div class="modal fade" id="myModal" role="dialog">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h4 class="modal-title" id="headername"></h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                          </div>
                          <div class="modal-body">
                            <form>
                              <div id="hh"></div>
                              <div><label>Email&nbsp; :&nbsp;</label><span id="email"></span></div>
                              <div><label>User Id&nbsp; :&nbsp;</label><span id="userid"></span></div>
                              <div><label>Password&nbsp; :&nbsp;</label><span id="password"></span></div>
                              <div><label>Pan Number&nbsp; :&nbsp;</label><span id="pan"></span></div>
                              <div><label>Phone Number&nbsp; :&nbsp;</label><span id="phone"></span></div>
                              <div><label>Date of Birth&nbsp; :&nbsp;</label><span id="dob"></span></div>
                              <div><label>Address&nbsp; :&nbsp;</label><span id="address"></span></div>
                              <div><label>Pincode&nbsp; :&nbsp;</label><span id="pincode"></span></div>
                              <div><label>City&nbsp; :&nbsp;</label><span id="city"></span></div>
                              <div><label>State&nbsp; :&nbsp;</label><span id="state"></span></div>
                              <div><label>Country&nbsp; :&nbsp;</label><span id="country"></span></div>
                              <div><label>Created Device&nbsp; :&nbsp;</label><span id="device"></span></div>
                            </form>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                          </div>
                        </div>

                      </div>
                    </div>
                    {/* </div> */}
                    {/* /.card-header */}
                    <div className="card-body">

                      <MDBDataTableV5 autoWidth hover
                        entriesOptions={[10, 50, 100]}
                        entries={10}
                        pagesAmount={4}
                        refresh
                        striped
                        bordered
                        small
                        responsive
                        data={data}
                        pagingTop
                        searchTop
                        searchBottom={false}
                      />
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* </div> */}
                  {/* </div> */}
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
export default Alluser;