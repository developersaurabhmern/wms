import React,{ Component } from "react";
import $ from 'jquery';
import axios from 'axios';
import {  MDBDataTableV5 } from 'mdbreact';

class Datafoliodetail extends Component { 
  constructor(props) {
    super(props);

    this.state = {
      data1: [],
      personaldetail: [],
      };
  }
 
  componentDidMount(){
    document.title = "WMS | Folio Detail"
    const query = new URLSearchParams(this.props.location.search);  
    const folio = query.get('folio');
    const rta = query.get('rta');
    const lastItem = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    const scheme= lastItem.replace(/%20/g, " ");
    axios.post('http://localhost:3001/api/getsearchfoliodetail',{folio:folio,rta:rta,scheme:scheme})
            .then(resp => {
                this.setState({personaldetail: resp.data.data, isFetching: false})
            })
            .catch(e => {
                console.log(e);
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
      .normal-table .table td, .normal-table .table th {
        padding: .30rem;
      }
      .hide-bal{
        display:none;
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
        <section className="content">
          <div className="container-fluid">
          <div className="card card-primary card-outline pl-5 pr-5 normal-table">
             <table className="table">
             {this.state.personaldetail.map((item, index) => ( 
               <tbody>
               <tr>
                 <th>Name</th>
                 <td>{item.INVNAME}</td>
                 <th></th>
                 <td></td>
                 <th>Folio Number</th>
                 <td>{item.FOLIO}</td>
                </tr>

                <tr>
                <th>Scheme Name</th>
                 <td>{item.SCHEME}</td>
                 <th></th>
                 <td></td>
                 <th>Pan</th>
                 <td>{item.PAN}</td>
                </tr>

                <tr>
                <th>Plan Type</th>
                 <td>{item.TYPE}</td>
                 <th></th>
                 <td></td>
                 <th>Account No</th>
                 <td>{item.ACCOUNTNO}</td>
                </tr>

                <tr>
                <th>Bank Name</th>
                 <td>{item.BANK}</td>
                 <th></th>
                 <td></td>
                 <th>Account Type</th>
                 <td>{item.BANKTYPE}</td>
                </tr>

                <tr>
                <th>Holding Nature</th>
                 <td>{item.MODEOFHOLD}</td>
                 <th></th>
                 <td></td>
                 <th>Email</th>
                 <td>{item.EMAIL}</td>
                </tr>

                <tr>
                <th>Nominee</th>
                 <td>{item.NOMINEE}</td>
                 <th></th>
                 <td></td>
                 <th></th>
                 <td></td>
                </tr>
                </tbody>
            ) ) }
             </table>
             </div>
            {/* <div className="row">
                <div className="col-md-10 offset-md-1">
            
                </div>
                </div> */}

          {/* <div className="card card-primary card-outline mt-3">
        <div className="card-header">
        <div id="msg"></div>
        </div>
        <div className="card-body">
        </div>
        
      </div> */}
   
          </div>
        </section>
      </div>
    </>
  );
 }
};

export default Datafoliodetail;

