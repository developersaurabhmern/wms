import React from "react";
import AOS from 'aos';
import img1 from "../../../src/images/img1.jpg"
import '../../../node_modules/aos/dist/aos.css';
import { Component } from "react";

//var createReactClass = require('create-react-class');

class Adminprofile extends Component { 
  
  render(){
  return (  
    <>
    <style jsx>{`
      .front-nav{
        display:none;
      }
      .section-footer{
        display:none;
      }
      .admin-nav{
        display:block!important;
      }
      .booklist img{
          height:80px;
          width:80px;
          border-radius:50%;
      }
      .viewbookimage{
        height:200px;
      }
      .viewbookimage img{
        height:100%;
      }
    `}</style>
    <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Admin Profile</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Admin Profile</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              {/* Profile Image */}
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <div className="text-center">
                    <img className="profile-user-img img-fluid img-circle" src="../../dist/img/user4-128x128.jpg" alt="User profile picture" />
                  </div>
                  <h3 className="profile-username text-center">WMS</h3>
                  <p className="text-muted text-center">WMS</p>
                  
                </div>
                {/* /.card-body */}
              </div>
              {/* /.card */}
            </div>
            {/* /.col */}
            <div className="col-md-9">
              <div className="card">
                <div className="card-header p-2">
                  <ul className="nav nav-pills">
                    <li className="nav-item"><a className="nav-link active" href="#settings" data-toggle="tab">Settings</a></li>
                  </ul>
                </div>{/* /.card-header */}
                <div className="card-body">
                  <div className="tab-content">
                    {/* /.tab-pane */}
                    <div className="tab-pane active" id="settings">
                      <form className="form-horizontal">
                        <div className="form-group row">
                          <label htmlFor="inputName" className="col-sm-2 col-form-label">Old Password</label>
                          <div className="col-sm-10">
                            <input type="password" className="form-control" id="inputName" placeholder="Old Password" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="inputEmail" className="col-sm-2 col-form-label">New Password</label>
                          <div className="col-sm-10">
                            <input type="password" className="form-control" id="inputEmail" placeholder="New Password" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="offset-sm-2 col-sm-10">
                            <button type="submit" className="btn btn-danger">Update</button>
                          </div>
                        </div>
                      </form>
                    </div>
                    {/* /.tab-pane */}
                  </div>
                  {/* /.tab-content */}
                </div>{/* /.card-body */}
              </div>
              {/* /.nav-tabs-custom */}
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>{/* /.container-fluid */}
      </section>
     </div>
    </>
  );
 }
};

export default Adminprofile;
