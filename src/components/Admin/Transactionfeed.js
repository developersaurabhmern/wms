import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import Axios from "axios";
import DataTable from 'react-data-table-component';
import $ from "jquery";
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
// var localStorage = require('localStorage');

function Transactionfeed() {
  //const ndata = []; const ncolumns = [];
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);


  const processData = (dataString,file) => {
    var filename = file.name;
    filename = filename.split('.');
    
    var lastTwo = filename[0].substr(filename[0].length - 2); 
    var lastTwo = filename[0].substr(filename[0].length - 2); 
    console.log("fileeee=",file.name,filename[0],lastTwo);
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list = []; const newlist = []
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
    if(lastTwo === 'R2'){
    Axios.post('http://localhost:3001/api/uploadtranscamstest',
      list ,
    ).then((res) => {
      console.log("restest=", res)
      if (res.data.status === 200) {
        console.log("resnew-", res.data.data.data)
        newlist.push(res.data.data.data);
        console.log("resnew-", res.data.data.data.length, "type=", typeof newlist)
        $(".loader").css("display", "none");
        showToast();
        if (res.data.data.data.length > 0) {
          setTimeout(function () {
            localStorage.setItem('data1', '');
            var newdata = localStorage.setItem('data', JSON.stringify(newlist));
            var URL = "http://localhost:3000/Uploadclientmappingtranscams";
            $("#filecamsControl").val('');
            window.open(URL);
          }, 3900);
        } else {
          setTimeout(function () {
            $("#filecamsControl").val('');
          }, 3900);
        }
        console.log('success data inserted', res.data)
      } else {
        $(".loader").css("display", "none");
        wrongfileToast();
        $("#filecamsControl").val('');
      }
    });
  } else {
    $(".loader").css("display", "none");
    wrongfileToast();
    $("#filecamsControl").val('');
  }
  }
  const showToast = () => {
    toast("Data Uploaded Successfully!")
  };
  const wrongfileToast = () => {
    toast("Uploaded wrong file!")
  };
  const showFailedToast = () => {
    toast("Data not Uploaded!")
  };
  const processDatakarvy = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list = []; const databaselist = []; const newlist = []
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));
    // for(var i=0;i<list.length;i++){
    //   console.log("data=",list[i].INVNAME)
    // }
    //setData(list);
    // setList(list);
    // setColumns(columns);

    Axios.post('http://localhost:3001/api/uploadtranskarvytest',
      list ,

    ).then((res) => {
      // console.log('success data inserted', result)
      console.log("restest=", res)
      if (res.data.status === 200) {
        console.log("resnew-", res.data.data.data)
        newlist.push(res.data.data.data);
        console.log("resnew-", res.data.data.data.length, "type=", typeof newlist)
        $(".loader").css("display", "none");
        showToast();
        if (res.data.data.data.length > 0) {
          setTimeout(function () {
            localStorage.setItem('data1', '');
            var newdata = localStorage.setItem('data', JSON.stringify(newlist));
            var URL = "http://localhost:3000/Uploadclientmappingtranskarvy";
            $("#fileControl").val('');
            window.open(URL);
            // $("#fileControl").val('');
            //  window.location.reload();
          }, 3900);
        } else {
          setTimeout(function () {
            $("#fileControl").val('');
          }, 3900);
        }

        console.log('success data inserted', res.data)
      } else {
        $(".loader").css("display", "none");
        wrongfileToast();
        $("#fileControl").val('');
      }
    });
  }
  const processDatacams2A = (dataString,file) => {
 
    var filename = file.name;
    filename = filename.split('.');
    
    var lastTwo = filename[0].substr(filename[0].length - 2); 
    var lastTwo = filename[0].substr(filename[0].length - 2); 
    console.log("fileeee=",file.name,filename[0],lastTwo);
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list = []; const newlist = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
    if(lastTwo === '2A'){
    Axios.post('http://localhost:3001/api/uploadtranscams2atest',
      list,
      { mode: 'cors' },
    ).then((res) => {
      console.log("restest=", res,lastTwo)
      if (res.data.status === 200) {
        console.log("resnew-", res.data.data.data)
        newlist.push(res.data.data.data);
        console.log("resnew-", res.data.data.data.length, "type=", typeof newlist)
        $(".loader").css("display", "none");
        showToast();
        if (res.data.data.data.length > 0) {
          setTimeout(function () {
            localStorage.setItem('data1', '');
            var newdata = localStorage.setItem('data', JSON.stringify(newlist));
            var URL = "http://localhost:3000/Uploadclientmappingtranscams2A";
            $("#filecams2aControl").val('');
            window.open(URL);
          }, 3900);
        } else {
          setTimeout(function () {
            $("#filecams2aControl").val('');
          }, 3900);
        }
        console.log('success data inserted', res.data)
      } else {
        $(".loader").css("display", "none");
        wrongfileToast();
        $("#filecams2aControl").val('');
      }
    });
  }else{
    $(".loader").css("display", "none");
    wrongfileToast();
    $("#filecams2aControl").val('');
  }
  }
  // handle file upload
  const handleFileUpload = e => {
    $(".loader").css("display", "block");
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data,file);
    };
    reader.readAsBinaryString(file);
  }
  const handleFileUploadkarvy = e => {
    $(".loader").css("display", "block");
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processDatakarvy(data);
    };
    reader.readAsBinaryString(file);
  }
  const handleFileUploadcams2A = e => {
    $(".loader").css("display", "block");
    const file = e.target.files[0];
  
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processDatacams2A(data,file);
    };
    reader.readAsBinaryString(file);
  }

  return (

    <>
      <style jsx>
        {`
      .client-name {
        white-space: pre;
      }
       .removeFromInput{
        border: none;
        background: transparent;
      }
      .list-group-item{
        border:none!important;
      }
      .list-group-item:hover{
        border:none!important;
      }
      `}
      </style>
      <ToastContainer toastStyle={{ backgroundColor: "lightgrey" }} />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Transaction Feeds</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Transaction Feeds</li>
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
                <div className="col-md-12">
                  <div className="card card-outline card-success">
                    <div className="card-header">
                      <h3 className="card-title">Select Registrar Transfer Agent</h3>
                      <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                        </button>
                      </div>
                      {/* /.card-tools */}
                    </div>
                    {/* /.card-header */}
                    <div className="card-body">
                      <div className="accordion" id="accordionExample">
                        <div className="card">
                          <div className="card-header" id="headingOne">
                            <h2 className="mb-0">
                              <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Cams
                              </button>
                            </h2>
                          </div>
                          <div>
                            <Loader />

                          </div>
                          <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <div className="card-body">
                              <div className="form-group">
                                <label htmlFor="exampleInputFile">File input</label>
                                <div className="input-group">
                                  <div className="custom-file">
                                    <input type="file" accept=".csv,.xlsx,.xls," id="filecamsControl" onChange={handleFileUpload} />
                                  </div>
                                 
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-header" id="headingTwo">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Karvy
                              </button>
                            </h2>
                          </div>
                          <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                            <div className="card-body">
                              <div className="form-group">
                                <label htmlFor="exampleInputFile">File input</label>
                                <div className="input-group">
                                  <div className="custom-file">
                                    <input type="file" accept=".csv,.xlsx,.xls" id="fileControl" onChange={handleFileUploadkarvy} />
                                  </div>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <DataTable
                              highlightOnHover
                              columns={columns}
                              data={list}
                            />
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="headingThree">
                            <h2 className="mb-0">
                              <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Cams2A
                              </button>
                            </h2>
                          </div>
                          <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                            <div className="card-body">
                              <div className="form-group">
                                <label htmlFor="exampleInputFile">File input</label>
                                <div className="input-group">
                                  <div className="custom-file">
                                    <input type="file" accept=".csv,.xlsx,.xls," id="filecams2aControl" onChange={handleFileUploadcams2A} />
                                  </div>
                                 
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
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

};

export default Transactionfeed;
