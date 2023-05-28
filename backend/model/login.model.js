var db = require("../config.js");
var async = require('async');
var { loginschema, family, folioc, foliok,transc} = require('../schema/model.schema');
var Axios = require('axios');
const e = require("express");
const moment = require('moment');


async function checkLoginDetail(email, password) {
    try {
        const loginResponse = await db.collection("login").findOne({ EMAIL: email, PASSWORD: password }, { "_id": 0, NAME: 1, USERTYPE: 1 });
        if (loginResponse != "") {
            return loginResponse;
        } else {
            return loginResponse;
        }

    } catch (error) {
        console.log(`Login not found. ${error}`)
    }
}
async function checkclientDetail(email, mobile) {
    try {
        const loginResponse = await db.collection("login").findOne({ $or: [{ EMAIL: email }, { MOBILE: mobile }] }, { "_id": 0, NAME: 1, USERTYPE: 1 });
        // console.log("loginres=",loginResponse)
        if (loginResponse != "") {

            return loginResponse;
        } else {
            return loginResponse;
        }

    } catch (error) {
        console.log(`Login not found. ${error}`)
    }
}

async function signupDetail(name, email, mobile, password, usertype, pan,iin, leaderpan, relation, dob, address, pincode, city, state, country, iin_portfolio) {
    try {
        var current = new Date();
        const timeStamp = new Date(Date.UTC(current.getFullYear(),
            current.getMonth(), current.getDate(), current.getHours(),
            current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
        if (usertype === "Client") {
            if (relation != null || relation === "") {
                var member = new family({
                    memberPan: pan,
                    adminPan: leaderpan,
                    memberRelation: relation,
                    email: email,
                    date: timeStamp,
                });

                await member.save(function (err, Response) {
                    //     if(Response != ""){
                    //     //    console.log("exists resp=")
                    //         return Response;
                    //     }else{
                    //    //     console.log(" not resp=")
                    //         return Response;
                    //     }
                })
            }
            const request_data = {
                "name": name,
                "phone": mobile,
                "email": email,
                "password": password,
                "pan_card": pan,
                "group_leader": leaderpan,
                "relation": relation,
                "date_of_birrth": moment(new Date(dob)).format("YYYY-MM-DD"),
                "address": address,
                "pincode": pincode,
                "city": city,
                "state": state,
                "country": country,
                "iin_portfolio": iin_portfolio,
                "iin":iin,
            };

            return await Axios.post('https://mfprodigy.bfccapital.com/api/create_client',request_data
                , {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json"
                    }
                })

        } else {

            var user = new loginschema({
                NAME: name,
                EMAIL: email,
                MOBILE: mobile,
                PASSWORD: password,
                USERTYPE: usertype,
                PAN: pan,
                LEADERPAN: leaderpan,
                RELATION: relation,
                DOB: moment(new Date(dob)).format("YYYY-MM-DD"),
                ADDRESS: address,
                PINCODE: pincode,
                CITY: city,
                STATE: state,
                COUNTRY: country,
                IIN_PORTFOLIO: iin_portfolio,
                DATE: timeStamp,
            });
            await user.save(function (err, Response) {
                if (Response != "") {
                    return Response;
                } else {
                    return Response;
                }
            })
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}

async function updateDetail(name, email, mobile, password, usertype, pan, leaderpan, relation, dob, address, pincode, city, state, country, iin_portfolio) {
    try {
        var current = new Date();
        const timeStamp = new Date(Date.UTC(current.getFullYear(),
            current.getMonth(), current.getDate(), current.getHours(),
            current.getMinutes(), current.getSeconds(), current.getMilliseconds()));

        if (usertype === "Client") {
            const request_data = {
                "name": name,
                "phone": mobile,
                "email": email,
                "password": password,
                "pan_card": pan,
                "group_leader": leaderpan,
                "relation": relation,
                "date_of_birrth": moment(new Date(dob)).format("YYYY-MM-DD"),
                "address": address,
                "pincode": pincode,
                "city": city,
                "state": state,
                "country": country,
                "iin_portfolio": iin_portfolio
            };

            return await Axios.post('https://mfprodigy.bfccapital.com/api/update_client', request_data
                , {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json"
                    }
                })

        } else {
            var user = new loginschema({
                NAME: name,
                EMAIL: email,
                MOBILE: mobile,
                PASSWORD: password,
                USERTYPE: usertype,
                PAN: pan,
                LEADERPAN: leaderpan,
                RELATION: relation,
                DOB: moment(new Date(dob)).format("YYYY-MM-DD"),
                ADDRESS: address,
                PINCODE: pincode,
                CITY: city,
                STATE: state,
                COUNTRY: country,
                IIN_PORTFOLIO: iin_portfolio,
                DATE: timeStamp,
            });

            await user.save(function (err, Response) {
                if (Response != "") {
                    return Response;
                } else {
                    return Response;
                }
            })
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}

const getclientDetailtranscams= async() => {
    try {

            // const filter = {  };
            // const updateDoc = {
            //     $set: {
            //         "USER_ID": "initial value",
            //     },
                
            //   };
            //   const result = await transk.updateMany(filter, updateDoc);
              
            //   console.log(`Updated ${result.n  } documents`);
            let foliokarvy = await folioc.find({   }, { _id: 0, FOLIOCHK:"$FOLIOCHK" ,USER_ID:"$USER_ID"}).exec();
            //  console.log("wwwwww=",foliokarvy)
           for(var j=0; j < foliokarvy.length; j++){
            console.log("foliokarvy=",foliokarvy[j]._doc)
            console.log("5555foliokarvy=",foliokarvy[j]._doc.USER_ID,"docno=",foliokarvy[j]._doc.FOLIOCHK,)
            const filter = { FOLIO_NO:foliokarvy[j]._doc.FOLIOCHK  };
            const updateDoc = {
                $set: {
                    "USER_ID": foliokarvy[j]._doc.USER_ID,
                },
                
              };
              const result = await transc.updateMany(filter, updateDoc);
              
              console.log(`Updated ${result.n  } documents`);
           }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}



// async function uploadtransactionkarvy(exceldata){
//   try {
//         var totaluploaded = [];
//         var j = gg.length;
//         console.log("j=",j)
//         var newclientarray = [];
//         var j = '';
//         for (i = 0; i < exceldata.length; i++) {
//             let userdata = await users.find({ PAN: exceldata[i].PAN1,NAME: { $regex: exceldata[i].INVNAME, $options: 'i' }  }, { _id: 0, DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME"  }).exec();
//            console.log("dataaaa=",userdata)
//             if (userdata === null) {
//                 console.log("data null=",exceldata[i].TD_ACNO,exceldata[i].TD_TRNO)
//                 j = exceldata.length;
//                 transk.updateMany(
//                     { TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_AMT: exceldata[i].TD_AMT, TD_ACNO: exceldata[i].TD_ACNO, FMCODE: exceldata[i].FMCODE,TRFLAG: exceldata[i].TRFLAG },
//                     {
//                         $set:
//                         {
//                             FMCODE: exceldata[i].FMCODE,
//                             TD_FUND: exceldata[i].TD_FUND,
//                             TD_SCHEME: exceldata[i].TD_SCHEME,
//                             TD_PLAN: exceldata[i].TD_PLAN,
//                             TD_ACNO: exceldata[i].TD_ACNO,
//                             SCHPLN: exceldata[i].SCHPLN,
//                             DIVOPT: exceldata[i].DIVOPT,
//                             FUNDDESC: exceldata[i].FUNDDESC,
//                             TD_PURRED: exceldata[i].TD_PURRED,
//                             TD_TRNO: exceldata[i].TD_TRNO,
//                             SMCODE: exceldata[i].SMCODE,
//                             CHQNO: exceldata[i].CHQNO,
//                             INVNAME: exceldata[i].INVNAME,
//                             TRNMODE: exceldata[i].TRNMODE,
//                             TRNSTAT: exceldata[i].TRNSTAT,
//                             TD_BRANCH: exceldata[i].TD_BRANCH,
//                             ISCTRNO: exceldata[i].ISCTRNO,
//                             TD_TRDT: moment(new Date(exceldata[i].TD_TRDT)).format("YYYY-MM-DD"),
//                             TD_PRDT: moment(new Date(exceldata[i].TD_PRDT)).format("YYYY-MM-DD"),
//                             TD_UNITS: Number(exceldata[i].TD_UNITS),
//                             TD_AMT: Number(exceldata[i].TD_AMT),
//                             TD_AGENT: exceldata[i].TD_AGENT,
//                             TD_BROKER: exceldata[i].TD_BROKER,
//                             BROKPER: exceldata[i].BROKPER,
//                             BROKCOMM: exceldata[i].BROKCOMM,
//                             INVID: exceldata[i].INVID,
//                             CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"),
//                             CRTIME: exceldata[i].CRTIME,
//                             TRNSUB: exceldata[i].TRNSUB,
//                             TD_APPNO: exceldata[i].TD_APPNO,
//                             UNQNO: exceldata[i].UNQNO,
//                             TRDESC: exceldata[i].TRDESC,
//                             TD_TRTYPE: exceldata[i].TD_TRTYPE,
//                             NAVDATE: moment(new Date(exceldata[i].NAVDATE)).format("YYYY-MM-DD"),
//                             PORTDT: moment(new Date(exceldata[i].PORTDT)).format("YYYY-MM-DD"),
//                             ASSETTYPE: exceldata[i].ASSETTYPE,
//                             SUBTRTYPE: exceldata[i].SUBTRTYPE,
//                             CITYCATEG0: exceldata[i].CITYCATEG0,
//                             EUIN: exceldata[i].EUIN,
//                             TRCHARGES: exceldata[i].TRCHARGES,
//                             CLIENTID: exceldata[i].CLIENTID,
//                             DPID: exceldata[i].DPID,
//                             STT: exceldata[i].STT,
//                             IHNO: exceldata[i].IHNO,
//                             BRANCHCODE: exceldata[i].BRANCHCODE,
//                             INWARDNUM1: exceldata[i].INWARDNUM1,
//                             PAN1: exceldata[i].PAN1,
//                             PAN2: exceldata[i].PAN2,
//                             PAN3: exceldata[i].PAN3,
//                             TDSAMOUNT: exceldata[i].TDSAMOUNT,
//                             CHQDATE: exceldata[i].CHQDATE,
//                             CHQBANK: exceldata[i].CHQBANK,
//                             TRFLAG: exceldata[i].TRFLAG,
//                             LOAD1: exceldata[i].LOAD1,
//                             BROK_ENTDT: exceldata[i].BROK_ENTDT,
//                             NCTREMARKS: exceldata[i].NCTREMARKS,
//                             PRCODE1: exceldata[i].PRCODE1,
//                             STATUS: exceldata[i].STATUS,
//                             SCHEMEISIN: exceldata[i].SCHEMEISIN,
//                             TD_NAV: Number(exceldata[i].TD_NAV),
//                             INSAMOUNT: exceldata[i].INSAMOUNT,
//                             REJTRNOOR2: exceldata[i].REJTRNOOR2,
//                             EVALID: exceldata[i].EVALID,
//                             EDECLFLAG: exceldata[i].EDECLFLAG,
//                             SUBARNCODE: exceldata[i].SUBARNCODE,
//                             ATMCARDRE3: exceldata[i].ATMCARDRE3,
//                             ATMCARDST4: exceldata[i].ATMCARDST4,
//                             SCH1: exceldata[i].SCH1,
//                             PLN1: exceldata[i].PLN1,
//                             TD_TRXNMO5: exceldata[i].TD_TRXNMO5,
//                             NEWUNQNO: exceldata[i].NEWUNQNO,
//                             SIPREGDT: exceldata[i].SIPREGDT,
//                             SIPREGSLNO: exceldata[i].SIPREGSLNO,
//                             DIVPER: exceldata[i].DIVPER,
//                             CAN: exceldata[i].CAN,
//                             EXCHORGTR6: exceldata[i].EXCHORGTR6,
//                             ELECTRXNF7: exceldata[i].ELECTRXNF7,
//                             CLEARED: exceldata[i].CLEARED,
//                             BROK_VALU8: exceldata[i].BROK_VALU8,
//                             TD_POP: Number(exceldata[i].TD_POP),
//                             INVSTATE: exceldata[i].INVSTATE,
//                             STAMPDUTY: exceldata[i].STAMPDUTY,
//                             USER_ID:"initial value",
//                         }
//                     },
//                     {
//                         "upsert": true
//                     },
//                     function (err, object) {
//                         if (err) {
//                             //  console.warn(err.message);  // returns error if no matching object found
//                         }
//                     })
//                     transk.find({ TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_AMT: exceldata[i].TD_AMT, TD_ACNO: exceldata[i].TD_ACNO,TRFLAG: exceldata[i].TRFLAG }, function (err, data) {
//                         totaluploaded.push(data)           
//                     });
//             } else {
//                 console.log("data not null=",exceldata[i].TD_ACNO,exceldata[i].TD_TRNO,userdata[0]._doc.NAME,userdata[0]._doc.DOCNO)
//                 try {
//                     j = exceldata.length;
//                     transk.updateMany(
//                         { TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_AMT: exceldata[i].TD_AMT, TD_ACNO: exceldata[i].TD_ACNO, FMCODE: exceldata[i].FMCODE,TRFLAG: exceldata[i].TRFLAG },
//                         {
//                             $set:
//                             {
//                                 FMCODE: exceldata[i].FMCODE,
//                                 TD_FUND: exceldata[i].TD_FUND,
//                                 TD_SCHEME: exceldata[i].TD_SCHEME,
//                                 TD_PLAN: exceldata[i].TD_PLAN,
//                                 TD_ACNO: exceldata[i].TD_ACNO,
//                                 SCHPLN: exceldata[i].SCHPLN,
//                                 DIVOPT: exceldata[i].DIVOPT,
//                                 FUNDDESC: exceldata[i].FUNDDESC,
//                                 TD_PURRED: exceldata[i].TD_PURRED,
//                                 TD_TRNO: exceldata[i].TD_TRNO,
//                                 SMCODE: exceldata[i].SMCODE,
//                                 CHQNO: exceldata[i].CHQNO,
//                                 INVNAME: userdata[0]._doc.NAME,
//                                 TRNMODE: exceldata[i].TRNMODE,
//                                 TRNSTAT: exceldata[i].TRNSTAT,
//                                 TD_BRANCH: exceldata[i].TD_BRANCH,
//                                 ISCTRNO: exceldata[i].ISCTRNO,
//                                 TD_TRDT: moment(new Date(exceldata[i].TD_TRDT)).format("YYYY-MM-DD"),
//                                 TD_PRDT: moment(new Date(exceldata[i].TD_PRDT)).format("YYYY-MM-DD"),
//                                 TD_UNITS: Number(exceldata[i].TD_UNITS),
//                                 TD_AMT: Number(exceldata[i].TD_AMT),
//                                 TD_AGENT: exceldata[i].TD_AGENT,
//                                 TD_BROKER: exceldata[i].TD_BROKER,
//                                 BROKPER: exceldata[i].BROKPER,
//                                 BROKCOMM: exceldata[i].BROKCOMM,
//                                 INVID: exceldata[i].INVID,
//                                 CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"),
//                                 CRTIME: exceldata[i].CRTIME,
//                                 TRNSUB: exceldata[i].TRNSUB,
//                                 TD_APPNO: exceldata[i].TD_APPNO,
//                                 UNQNO: exceldata[i].UNQNO,
//                                 TRDESC: exceldata[i].TRDESC,
//                                 TD_TRTYPE: exceldata[i].TD_TRTYPE,
//                                 NAVDATE: moment(new Date(exceldata[i].NAVDATE)).format("YYYY-MM-DD"),
//                                 PORTDT: moment(new Date(exceldata[i].PORTDT)).format("YYYY-MM-DD"),
//                                 ASSETTYPE: exceldata[i].ASSETTYPE,
//                                 SUBTRTYPE: exceldata[i].SUBTRTYPE,
//                                 CITYCATEG0: exceldata[i].CITYCATEG0,
//                                 EUIN: exceldata[i].EUIN,
//                                 TRCHARGES: exceldata[i].TRCHARGES,
//                                 CLIENTID: exceldata[i].CLIENTID,
//                                 DPID: exceldata[i].DPID,
//                                 STT: exceldata[i].STT,
//                                 IHNO: exceldata[i].IHNO,
//                                 BRANCHCODE: exceldata[i].BRANCHCODE,
//                                 INWARDNUM1: exceldata[i].INWARDNUM1,
//                                 PAN1: exceldata[i].PAN1,
//                                 PAN2: exceldata[i].PAN2,
//                                 PAN3: exceldata[i].PAN3,
//                                 TDSAMOUNT: exceldata[i].TDSAMOUNT,
//                                 CHQDATE: exceldata[i].CHQDATE,
//                                 CHQBANK: exceldata[i].CHQBANK,
//                                 TRFLAG: exceldata[i].TRFLAG,
//                                 LOAD1: exceldata[i].LOAD1,
//                                 BROK_ENTDT: exceldata[i].BROK_ENTDT,
//                                 NCTREMARKS: exceldata[i].NCTREMARKS,
//                                 PRCODE1: exceldata[i].PRCODE1,
//                                 STATUS: exceldata[i].STATUS,
//                                 SCHEMEISIN: exceldata[i].SCHEMEISIN,
//                                 TD_NAV: Number(exceldata[i].TD_NAV),
//                                 INSAMOUNT: exceldata[i].INSAMOUNT,
//                                 REJTRNOOR2: exceldata[i].REJTRNOOR2,
//                                 EVALID: exceldata[i].EVALID,
//                                 EDECLFLAG: exceldata[i].EDECLFLAG,
//                                 SUBARNCODE: exceldata[i].SUBARNCODE,
//                                 ATMCARDRE3: exceldata[i].ATMCARDRE3,
//                                 ATMCARDST4: exceldata[i].ATMCARDST4,
//                                 SCH1: exceldata[i].SCH1,
//                                 PLN1: exceldata[i].PLN1,
//                                 TD_TRXNMO5: exceldata[i].TD_TRXNMO5,
//                                 NEWUNQNO: exceldata[i].NEWUNQNO,
//                                 SIPREGDT: exceldata[i].SIPREGDT,
//                                 SIPREGSLNO: exceldata[i].SIPREGSLNO,
//                                 DIVPER: exceldata[i].DIVPER,
//                                 CAN: exceldata[i].CAN,
//                                 EXCHORGTR6: exceldata[i].EXCHORGTR6,
//                                 ELECTRXNF7: exceldata[i].ELECTRXNF7,
//                                 CLEARED: exceldata[i].CLEARED,
//                                 BROK_VALU8: exceldata[i].BROK_VALU8,
//                                 TD_POP: Number(exceldata[i].TD_POP),
//                                 INVSTATE: exceldata[i].INVSTATE,
//                                 STAMPDUTY: exceldata[i].STAMPDUTY,
//                                 USER_ID:userdata[0]._doc.DOCNO,
//                             }
//                         },
//                         {
//                             "upsert": true
//                         },
//                         function (err, object) {
//                             if (err) {
//                                 //  console.warn(err.message);  // returns error if no matching object found
//                             }
//                         })
//                     transk.find({ TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_AMT: exceldata[i].TD_AMT, TD_ACNO: exceldata[i].TD_ACNO,TRFLAG: exceldata[i].TRFLAG, }, function (err, data) {
//                         totaluploaded.push(data)             
//                     });
//                 } catch (error) {
//                     console.log(`Error found. ${error}`)
//                 }
//             }
//             if ( j === totaluploaded.length) {
//                 resdata = {
//                     status: 200,
//                     message: 'Data uploaded',
//                 }
//                 return resdata;
//             } else {
//                 resdata = {
//                     status: 400,
//                     message: 'Data not uploaded',
//                 }
//                 return resdata;
//             }
//         }
        
//         // res.json(resdata);
//         // return resdata;
//     } catch (error) {
//         console.log(`Error found. ${error}`)
//     }
// }

const getclientDetail= async() => {
    try {
        //   db.collection('trans_karvy').remove({TD_ACNO:"11012605385",FMCODE:"101EQGP"});
        //   return false;
        var str1 = ""; var str2 = "";var newdata="";
        if (gpan === "" || gpan === null) {
            str1 = { $and: [{ PAN_NO: pan.toUpperCase() }, { INV_NAME: { $regex: name, $options: 'i' } }] }//folio_cams
            str2 = { $and: [{ PANGNO: pan.toUpperCase() }, { INVNAME: { $regex: name, $options: 'i' } }] }//folio_karvy
        } else {
            str1 = { $and: [{ GUARD_PAN: gpan.toUpperCase() }, { INV_NAME: { $regex: name, $options: 'i' } }] }//folio_cams
            str2 = { $and: [{ GUARDPANNO: gpan.toUpperCase() }, { INVNAME: { $regex: name, $options: 'i' } }] }//folio_karvy
        }
       
        const karvyResponse = await foliok.findOne( str2 , { _id: 0,  ADD1: "$ADD1", ADD2: "$ADD2", ADD3: "$ADD3",CITY:"$CITY",PINCODE:"$PIN" ,STATE:"$STATE",COUNTRY:"$COUNTRY" });
        const camsResponse = await folioc.findOne( str1 , { _id: 0,   ADD1: "$ADDRESS1", ADD2: "$ADDRESS2", ADD3: "$ADDRESS3", CITY:"$CITY",PINCODE:"$PINCODE",STATE:"",COUNTRY:""  });
                if(karvyResponse != null || camsResponse != null){
                     newdata = Object.assign(karvyResponse, camsResponse);
                     return newdata;
                }else {
                     return newdata;
                }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}

module.exports = { checkLoginDetail, signupDetail, checkclientDetail, updateDetail, getclientDetail }