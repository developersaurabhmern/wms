import React from "react";
import { Component } from "react";
import * as XLSX from 'xlsx';
import Axios from "axios";
import $ from "jquery";
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  

function Nav() { 
  let isDisabled = false;
   // process CSV data
   const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers1 = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    console.log("one="+headers1)
    const headers2 = headers1.toString().replace(/ /g,"").split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    console.log("two="+headers2)
    const headers = headers2.toString().replace(/\//g,"").split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    console.log("three="+headers)
    const list = [];const newlist = [];
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
   // console.log("list="+list)
 for(var k=0;k<list.length;k++){
if(list[k].SchemeName != "" &&  !isNaN(list[k].NetAssetValue) ){
       newlist.push(list[k])
}
 }

    // prepare columns list from headers
    //const columns = headers.map(c => ({
  //    name: c,
  //    selector: c,
  //  }));
 
    //setData(list);
    //setColumns(columns);
    // console.log("list length=",list.length);
    
    // console.log("newlist length=",newlist.length);
    
    
     Axios.post('http://localhost:3001/api/savecamsnav',
    //Axios.post('http://localhost:3001/api/saveallnav',
    newlist ,
    // {mode: 'cors'},
    // {headers:
    //   { 'Access-Control-Allow-Origin' : '*',
    //     'Access-Control-Allow-Methods': 'POST',
    //     'Access-Control-Allow-Credentials' : 'true',
    //     'Access-Control-Max-Age' :'3000',
    //     'Access-Control-Allow-Headers' : ' Origin, Content-Type, X-Auth-Token, Accept, X-Requested-With',
    //    // 'Content-Type': 'application/json, charset=utf-8',
    //     'Content-Type':'application/x-www-form-urlencoded',
    //   }
    ).then((res) => {  
        console.log("res=",res)
        if(res.data.status === 200){
            $(".loader").css("display", "none");
           showToast();
          //  window.location.reload();
        //   setTimeout(function() {
        //     window.location.reload();
        //  }, 3800);
      console.log('success data inserted', res.data)
        }
   });
  
  }

  const showToast = () => {
    toast("Data Uploaded Successfully!")
  };
  // handle file upload
  const handleFileUpload = e => {
   
    $(".loader").css("display", "block");   
    // const file1 = e.target.files;
    // console.log("file1=",file1)
    const file = e.target.files[0];
    console.log("file=",file)
    const reader = new FileReader();
    reader.onload = (evt) => {
     // console.log("evt=",evt)
      /* Parse data */
      const bstr = evt.target.result;
      //console.log("bstr=",bstr)
      const wb = XLSX.read(bstr, { type: 'binary' });
      console.log("wb=",wb)
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      console.log("wsname=",wsname)
      const ws = wb.Sheets[wsname];
     // console.log("ws=",ws)
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
     // console.log("data=",data)
      processData(data);
    };
    reader.readAsBinaryString(file);
  }
const uploaddata = e =>{
  Axios.get('http://localhost:3001/api/auto_update_nav',
  {mode: 'cors'},
    {headers:
      { 'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age' :'3000',
        'Access-Control-Allow-Headers' : ' Origin, Content-Type, X-Auth-Token, Accept, X-Requested-With',
        'Content-Type': 'application/json, charset=utf-8',
        //'Content-Type':'application/x-www-form-urlencoded',
      }
    }).then(( data ) => {
      console.log("dataaaaa=",data)
   // alert(data)
    // this.setState({
    //   userDetails: data
    // });
  });
 // alert(aa)
}
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
                <h1>NAV</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">NAV</li>
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
                               NAV
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
                                        <input id="btnnav" type="file" accept=".txt,.json" onChange={handleFileUpload} />
                                        </div>
                                        <ToastContainer toastStyle={{ backgroundColor: "lightgrey" }}/>
                                    </div>
                                    <button type="submit" className="btn btn-primary" onClick={uploaddata}  >
                      Register</button>
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

export default Nav;
