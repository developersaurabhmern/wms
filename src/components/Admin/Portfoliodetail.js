import React from "react";
import { Component } from "react";
import $ from 'jquery';
import axios from 'axios';

//var createReactClass = require('create-react-class');

class Portfoliodetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data1: [],
      data2: [],
    };
  }
  componentDidMount() {
    document.title = "WMS | Folio Detail"
    const query = new URLSearchParams(this.props.location.search);
    // const lastItem = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    // const scheme= lastItem.replace(/%20/g, " ");
    const scheme = query.get('scheme');
    const pan = query.get('pan');
    const folio = query.get('folio');
    const rta = query.get('rta');
    axios.post('http://localhost:3001/api/getschemedetail', { pan: pan, folio: folio, scheme: scheme, rta: rta })
      .then(response => {
        console.log(response);
        this.setState({ data1: response.data.data, isFetching: false })
      })
      .catch(e => {
        console.log(e);
        this.setState({ ...this.state, isFetching: false });
      });
    axios.post('http://localhost:3001/api/getschemepersonaldetail', { pan: pan, folio: folio, scheme: scheme })
      .then(resp => {
        //console.log(response);
        this.setState({ data2: resp.data, isFetching: false })
      })
      .catch(e => {
        console.log(e);
        this.setState({ ...this.state, isFetching: false });
      });


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
          <section className="content">
            <div className="container-fluid">
              <div className="card card-primary card-outline pl-5 pr-5 normal-table">
                <table className="table">
                  {this.state.data2.map((item, index) => (
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td>{item.INVNAME} [ {item.PAN}]</td>
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
                        <th>MOH</th>
                        <td>IND</td>
                      </tr>

                      {/* <tr>
                <th>Joint 1</th>
                 <td>{item.JTNAME1}</td>
                 <th></th>
                 <td></td>
                 <th>Joint 2</th>
                 <td>{item.JTNAME2}</td>
                </tr> */}

                      <tr>
                        <th>Nominee</th>
                        <td>{item.NOMINEE}</td>
                        <th></th>
                        <td></td>
                        <th>Bank</th>
                        <td>{item.BANK} {[item.ACCOUNTNO]}</td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>

              <div className="card card-primary card-outline mt-5">
                <div className="card-header">
                  <h3 className="card-title">DataTable with default features</h3>
                </div>

                <div className="card-body">
                  <table id="example1" className="table table-bordered table-striped">
                    <thead className="bg-primary">
                      <tr>
                        <th>Date</th>
                        <th>Nature</th>
                        <th>Amount</th>
                        <th>NAV/Rate</th>
                        <th>Units/Nos</th>
                        <th>Balance</th>
                        <th>RTA</th>
                      </tr>
                    </thead>
                    {this.state.data1.map((item, index) => (

                      <tbody >
                        {(
                          item.NATURE === 'Switch Out' || item.NATURE === 'SWD' || item.NATURE === 'SWOP') ? (
                          <div class="hide-bal">{(unit = "-" + item.UNITS)}
                          </div>
                          // ):(item.NATURE ==='LTOP' || item.NATURE ==='LTOF' || item.NATURE ==='STPO')? (
                          //   <div class="hide-bal">{(unit = "-"+item.UNITS)}
                          //   </div>
                        ) : (
                          <div class="hide-bal">{(unit = item.UNITS)}
                            {(currentNav = item.cnav)}
                          </div>
                        )}
                        <tr>
                          <td>{item.TD_TRDT}</td>
                          {(item.NATURE === "Switch Out" || item.NATURE === 'SWOP' || item.NATURE === 'RED' || item.NATURE === 'FUL' || item.NATURE === 'LTOP' || item.NATURE === 'LTOF' || item.NATURE === 'STPO') ? (
                            <td>Switch Out</td>) : (item.NATURE === "SIPR") ? (
                              <td>SIP Reversal</td>) : (item.NATURE === "SWD") ? (
                                <td>Sys. Withdraw</td>) : (item.NATURE === "ADDPUR" ||
                                  item.NATURE === "Additional Purchase" || item.NATURE === "NEW" || item.NATURE === "ADD" || item.NATURE === "Fresh Purchase" || item.NATURE === "Purchase") ? (
                            <td>Purchase</td>) : (item.NATURE === "ADDPUR" ||
                              item.NATURE === "STPA" || item.NATURE === "Switch In" || item.NATURE === "TICOB") ? (
                            <td>Sys. Transfer In</td>) : (item.NATURE === "Gross Div.") ? (<td>Gross Div.</td>) : (item.NATURE === "SWO Rejection") ? (
                              <td>SWO Rejection</td>) : (item.NATURE === "Sys. Reversal") ? (
                                <td>Sys. Reversal</td>) : (
                              <td>SIP</td>)}
                          {/* <td>{item.NATURE}</td> */}
                          <td>{item.AMOUNT}</td>
                          <td>{item.TD_NAV}</td>
                          <td>{unit}</td>
                          <td class="balance-unit"><div class="hide-bal">
                            {(balance = parseFloat(unit) + parseFloat(balance))}
                          </div>{balance.toFixed(4)}</td>
                          {/* {( index =='0')? (
                <td class="balance-unit"><div class="hide-bal">{(balancef = item.UNITS)}</div>{item.UNITS}</td>
                ):(
                  
                <td><div class="hide-bal">{(balance = item.UNITS)}</div>{balancef+balance}</td>
                )} */}
                          <td>{item.RTA}</td>
                        </tr>
                      </tbody>
                    ))}

                    <tfoot className="bg-primary">
                      <tr>
                        <th></th>
                        <th>Current Value</th>
                        <th>{(parseFloat(balance) * parseFloat(currentNav)).toFixed(4)}</th>
                        <th>{currentNav}</th>
                        <th>{balance.toFixed(4)}</th>
                        <th></th><th></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>

              </div>


            </div>{/* /.container-fluid */}
          </section>
        </div>
      </>
    );
  }
};

export default Portfoliodetail;

