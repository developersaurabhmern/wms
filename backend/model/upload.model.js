var db = require("../config.js");
var async = require('async');
var { users, transk, transc, transc2A, folioc, foliok } = require('../schema/model.schema');
var Axios = require('axios');
const e = require("express");
const moment = require('moment');

/* async function uploadtransactioncams(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        for (var i = 0; i < exceldata.length; i++) {
            exceldata[i].PAN = (exceldata[i].PAN).toUpperCase();

            // let userdata = await users.find({ $and: [{ PAN: exceldata[i].PAN }, { $or: [{ NAME: { '$regex': '^((?!' + exceldata[i].INV_NAME + ').)*$', '$options': 'i' } }, { NAME: { '$regex': exceldata[i].INV_NAME, '$options': 'i' } }] }] }, { _id: 0, DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();

            let userdata = await users.find({ $and: [{ PAN: exceldata[i].PAN }, { NAME: { '$regex': exceldata[i].INV_NAME, '$options': 'i' } }] }, { _id: 0, DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();
            console.log("datawwwwww=", "i=", i, exceldata[i].INV_NAME, exceldata[i].PAN)
            if (userdata === null || userdata[0] === undefined) {
                console.log("data null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO);
                newclientarray.push({ AMC_CODE: exceldata[i].AMC_CODE, FOLIO_NO: exceldata[i].FOLIO_NO, PRODCODE: exceldata[i].PRODCODE, SCHEME: exceldata[i].SCHEME, INV_NAME: exceldata[i].INV_NAME, TRXNTYPE: exceldata[i].TRXNTYPE, TRXNNO: exceldata[i].TRXNNO, TRXNMODE: exceldata[i].TRXNMODE, TRXNSTAT: exceldata[i].TRXNSTAT, USERCODE: exceldata[i].USERCODE, USRTRXNO: exceldata[i].USRTRXNO, TRADDATE: exceldata[i].TRADDATE, POSTDATE: exceldata[i].POSTDATE, PURPRICE: exceldata[i].PURPRICE, UNITS: exceldata[i].UNITS, AMOUNT: exceldata[i].AMOUNT, BROKCODE: exceldata[i].BROKCODE, SUBBROK: exceldata[i].SUBBROK, BROKPERC: exceldata[i].BROKPERC, BROKCOMM: exceldata[i].BROKCOMM, ALTFOLIO: exceldata[i].ALTFOLIO, REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"), TIME1: exceldata[i].TIME1, TRXNSUBTYP: exceldata[i].TRXNSUBTYP, APPLICATIO: exceldata[i].APPLICATIO, TRXN_NATUR: exceldata[i].TRXN_NATUR, TAX: exceldata[i].TAX, TOTAL_TAX: exceldata[i].TOTAL_TAX, TE_15H: exceldata[i].TE_15H, MICR_NO: exceldata[i].MICR_NO, REMARKS: exceldata[i].REMARKS, SWFLAG: exceldata[i].SWFLAG, OLD_FOLIO: exceldata[i].OLD_FOLIO, SEQ_NO: exceldata[i].SEQ_NO, REINVEST_F: exceldata[i].REINVEST_F, MULT_BROK: exceldata[i].MULT_BROK, STT: exceldata[i].STT, LOCATION: exceldata[i].LOCATION, SCHEME_TYP: exceldata[i].SCHEME_TYP, TAX_STATUS: exceldata[i].TAX_STATUS, LOAD: exceldata[i].LOAD, SCANREFNO: exceldata[i].SCANREFNO, PAN: exceldata[i].PAN, INV_IIN: exceldata[i].INV_IIN, TARG_SRC_S: exceldata[i].TARG_SRC_S, TRXN_TYPE_: exceldata[i].TRXN_TYPE_, TICOB_TRTY: exceldata[i].TICOB_TRTY, TICOB_TRNO: exceldata[i].TICOB_TRNO, TICOB_POST: exceldata[i].TICOB_POST, DP_ID: exceldata[i].DP_ID, TRXN_CHARG: exceldata[i].TRXN_CHARG, ELIGIB_AMT: exceldata[i].ELIGIB_AMT, SRC_OF_TXN: exceldata[i].SRC_OF_TXN, TRXN_SUFFI: exceldata[i].TRXN_SUFFI, SIPTRXNNO: exceldata[i].SIPTRXNNO, TER_LOCATI: exceldata[i].TER_LOCATI, EUIN: exceldata[i].EUIN, EUIN_VALID: exceldata[i].EUIN_VALID, EUIN_OPTED: exceldata[i].EUIN_OPTED, SUB_BRK_AR: exceldata[i].SUB_BRK_AR, EXCH_DC_FL: exceldata[i].EXCH_DC_FL, SRC_BRK_CO: exceldata[i].SRC_BRK_CO, SYS_REGN_D: exceldata[i].SYS_REGN_D, AC_NO: exceldata[i].AC_NO, BANK_NAME: exceldata[i].BANK_NAME, REVERSAL_C: exceldata[i].REVERSAL_C, EXCHANGE_F: exceldata[i].EXCHANGE_F, CA_INITIAT: exceldata[i].CA_INITIAT, GST_STATE_: exceldata[i].GST_STATE_, IGST_AMOUN: exceldata[i].IGST_AMOUN, CGST_AMOUN: exceldata[i].CGST_AMOUN, SGST_AMOUN: exceldata[i].SGST_AMOUN, REV_REMARK: exceldata[i].REV_REMARK, ORIGINAL_T: exceldata[i].ORIGINAL_T, STAMP_DUTY: exceldata[i].STAMP_DUTY, FOLIO_OLD: exceldata[i].FOLIO_OLD, SCHEME_FOL: exceldata[i].SCHEME_FOL, AMC_REF_NO: exceldata[i].AMC_REF_NO, REQUEST_RE: exceldata[i].REQUEST_RE });
                resdata = {
                    status: 400,
                    message: 'User not found',
                    data: newclientarray
                }
            } else {
                console.log("data not null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO)
                try {
                    //  j = i;
                    const filter = { TRXNNO: exceldata[i].TRXNNO, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"), AMOUNT: Number(exceldata[i].AMOUNT), PRODCODE: exceldata[i].PRODCODE, SEQ_NO: exceldata[i].SEQ_NO };

                    const updateDoc = {
                        $set: {
                            AMC_CODE: exceldata[i].AMC_CODE,
                            FOLIO_NO: exceldata[i].FOLIO_NO,
                            PRODCODE: exceldata[i].PRODCODE,
                            SCHEME: exceldata[i].SCHEME,
                            INV_NAME: userdata[0]._doc.NAME,
                            TRXNTYPE: exceldata[i].TRXNTYPE,
                            TRXNNO: exceldata[i].TRXNNO,
                            TRXNMODE: exceldata[i].TRXNMODE,
                            TRXNSTAT: exceldata[i].TRXNSTAT,
                            USERCODE: exceldata[i].USERCODE,
                            USRTRXNO: exceldata[i].USRTRXNO,
                            TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"),
                            POSTDATE: moment(new Date(exceldata[i].POSTDATE)).format("YYYY-MM-DD"),
                            PURPRICE: Number(exceldata[i].PURPRICE),
                            UNITS: Number(exceldata[i].UNITS),
                            AMOUNT: Number(exceldata[i].AMOUNT),
                            BROKCODE: exceldata[i].BROKCODE,
                            SUBBROK: exceldata[i].SUBBROK,
                            BROKPERC: exceldata[i].BROKPERC,
                            BROKCOMM: exceldata[i].BROKCOMM,
                            ALTFOLIO: exceldata[i].ALTFOLIO,
                            REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"),
                            TIME1: exceldata[i].TIME1,
                            TRXNSUBTYP: exceldata[i].TRXNSUBTYP,
                            APPLICATIO: exceldata[i].APPLICATIO,
                            TRXN_NATUR: exceldata[i].TRXN_NATUR,
                            TAX: Number(exceldata[i].TAX),
                            TOTAL_TAX: Number(exceldata[i].TOTAL_TAX),
                            TE_15H: exceldata[i].TE_15H,
                            MICR_NO: exceldata[i].MICR_NO,
                            REMARKS: exceldata[i].REMARKS,
                            SWFLAG: exceldata[i].SWFLAG,
                            OLD_FOLIO: exceldata[i].OLD_FOLIO,
                            SEQ_NO: exceldata[i].SEQ_NO,
                            REINVEST_F: exceldata[i].REINVEST_F,
                            MULT_BROK: exceldata[i].MULT_BROK,
                            STT: Number(exceldata[i].STT),
                            LOCATION: exceldata[i].LOCATION,
                            SCHEME_TYP: exceldata[i].SCHEME_TYP,
                            TAX_STATUS: exceldata[i].TAX_STATUS,
                            LOAD: Number(exceldata[i].LOAD),
                            SCANREFNO: exceldata[i].SCANREFNO,
                            PAN: (exceldata[i].PAN).toUpperCase(),
                            INV_IIN: exceldata[i].INV_IIN,
                            TARG_SRC_S: exceldata[i].TARG_SRC_S,
                            TRXN_TYPE_: exceldata[i].TRXN_TYPE_,
                            TICOB_TRTY: exceldata[i].TICOB_TRTY,
                            TICOB_TRNO: exceldata[i].TICOB_TRNO,
                            TICOB_POST: exceldata[i].TICOB_POST,
                            DP_ID: exceldata[i].DP_ID,
                            TRXN_CHARG: Number(exceldata[i].TRXN_CHARG),
                            ELIGIB_AMT: Number(exceldata[i].ELIGIB_AMT),
                            SRC_OF_TXN: exceldata[i].SRC_OF_TXN,
                            TRXN_SUFFI: exceldata[i].TRXN_SUFFI,
                            SIPTRXNNO: exceldata[i].SIPTRXNNO,
                            TER_LOCATI: exceldata[i].TER_LOCATI,
                            EUIN: exceldata[i].EUIN,
                            EUIN_VALID: exceldata[i].EUIN_VALID,
                            EUIN_OPTED: exceldata[i].EUIN_OPTED,
                            SUB_BRK_AR: exceldata[i].SUB_BRK_AR,
                            EXCH_DC_FL: exceldata[i].EXCH_DC_FL,
                            SRC_BRK_CO: exceldata[i].SRC_BRK_CO,
                            SYS_REGN_D: exceldata[i].SYS_REGN_D,
                            AC_NO: exceldata[i].AC_NO,
                            BANK_NAME: exceldata[i].BANK_NAME,
                            REVERSAL_C: exceldata[i].REVERSAL_C,
                            EXCHANGE_F: exceldata[i].EXCHANGE_F,
                            CA_INITIAT: exceldata[i].CA_INITIAT,
                            GST_STATE_: exceldata[i].GST_STATE_,
                            IGST_AMOUN: Number(exceldata[i].IGST_AMOUN),
                            CGST_AMOUN: Number(exceldata[i].CGST_AMOUN),
                            SGST_AMOUN: Number(exceldata[i].SGST_AMOUN),
                            REV_REMARK: exceldata[i].REV_REMARK,
                            ORIGINAL_T: exceldata[i].ORIGINAL_T,
                            STAMP_DUTY: Number(exceldata[i].STAMP_DUTY),
                            FOLIO_OLD: exceldata[i].FOLIO_OLD,
                            SCHEME_FOL: exceldata[i].SCHEME_FOL,
                            AMC_REF_NO: exceldata[i].AMC_REF_NO,
                            REQUEST_RE: exceldata[i].REQUEST_RE,
                            USER_ID: userdata[0]._doc.DOCNO,
                        },

                    };
                    const option = {
                        "upsert": true,
                    };
                    const result = await transc.updateMany(filter, updateDoc, option);

                    console.log(`Updated ${result.n} documents`);
                    transc.find({ TRXNNO: exceldata[i].TRXNNO, PRODCODE: exceldata[i].PRODCODE, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD") }, function (err, data) {
                        //console.log("ddddddd====",data[0]._doc)
                        totaluploaded.push(data[0]._doc)
                        console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                        //console.log("totaluploaded=",totaluploaded)       
                    });
                } catch (error) {
                    console.log(`Error found. ${error}`)
                }
            }

            if (exceldata.length === i + 1) {
                resdata = {
                    status: 200,
                    message: 'Data uploaded',
                    data: newclientarray
                }
                return resdata;
            } else {
                resdata = {
                    status: 400,
                    message: 'Data not uploaded',
                }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
} */

/*  async function uploadtransactionkarvy(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        var j = '';
        for (var i = 0; i < exceldata.length; i++) {
            exceldata[i].PAN1 = (exceldata[i].PAN1).toUpperCase();
            let userdata = await users.find({ $and: [{ PAN: exceldata[i].PAN1 }, { NAME: { '$regex': exceldata[i].INVNAME, '$options': 'i' } }] }, { _id: 0, DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();
            console.log("datawwwwww=", "i=", i, exceldata[i].INVNAME, exceldata[i].PAN1)
            if (userdata === null || userdata[0] === undefined) {
                console.log("data null=", exceldata[i].TD_ACNO, exceldata[i].TD_TRNO)
                newclientarray.push({ FMCODE: exceldata[i].FMCODE, TD_FUND: exceldata[i].TD_FUND, TD_SCHEME: exceldata[i].TD_SCHEME, TD_PLAN: exceldata[i].TD_PLAN, TD_ACNO: exceldata[i].TD_ACNO, SCHPLN: exceldata[i].SCHPLN, DIVOPT: exceldata[i].DIVOPT, FUNDDESC: exceldata[i].FUNDDESC, TD_PURRED: exceldata[i].TD_PURRED, TD_TRNO: exceldata[i].TD_TRNO, SMCODE: exceldata[i].SMCODE, CHQNO: exceldata[i].CHQNO, INVNAME: exceldata[i].INVNAME, TRNMODE: exceldata[i].TRNMODE, TRNSTAT: exceldata[i].TRNSTAT, TD_BRANCH: exceldata[i].TD_BRANCH, ISCTRNO: exceldata[i].ISCTRNO, TD_TRDT: moment(new Date(exceldata[i].TD_TRDT)).format("YYYY-MM-DD"), TD_PRDT: moment(new Date(exceldata[i].TD_PRDT)).format("YYYY-MM-DD"), TD_UNITS: exceldata[i].TD_UNITS, TD_AMT: exceldata[i].TD_AMT, TD_AGENT: exceldata[i].TD_AGENT, TD_BROKER: exceldata[i].TD_BROKER, BROKPER: exceldata[i].BROKPER, BROKCOMM: exceldata[i].BROKCOMM, INVID: exceldata[i].INVID, CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"), CRTIME: exceldata[i].CRTIME, TRNSUB: exceldata[i].TRNSUB, TD_APPNO: exceldata[i].TD_APPNO, UNQNO: exceldata[i].UNQNO, TRDESC: exceldata[i].TRDESC, TD_TRTYPE: exceldata[i].TD_TRTYPE, NAVDATE: moment(new Date(exceldata[i].NAVDATE)).format("YYYY-MM-DD"), PORTDT: moment(new Date(exceldata[i].PORTDT)).format("YYYY-MM-DD"), ASSETTYPE: exceldata[i].ASSETTYPE, SUBTRTYPE: exceldata[i].SUBTRTYPE, CITYCATEG0: exceldata[i].CITYCATEG0, EUIN: exceldata[i].EUIN, TRCHARGES: exceldata[i].TRCHARGES, CLIENTID: exceldata[i].CLIENTID, DPID: exceldata[i].DPID, STT: exceldata[i].STT, IHNO: exceldata[i].IHNO, BRANCHCODE: exceldata[i].BRANCHCODE, INWARDNUM1: exceldata[i].INWARDNUM1, PAN1: exceldata[i].PAN1, PAN2: exceldata[i].PAN2, PAN3: exceldata[i].PAN3, TDSAMOUNT: exceldata[i].TDSAMOUNT, CHQDATE: moment(new Date(exceldata[i].CHQDATE)).format("YYYY-MM-DD"), CHQBANK: exceldata[i].CHQBANK, TRFLAG: exceldata[i].TRFLAG, LOAD1: exceldata[i].LOAD1, BROK_ENTDT: exceldata[i].BROK_ENTDT, NCTREMARKS: exceldata[i].NCTREMARKS, PRCODE1: exceldata[i].PRCODE1, STATUS: exceldata[i].STATUS, SCHEMEISIN: exceldata[i].SCHEMEISIN, TD_NAV: exceldata[i].TD_NAV, INSAMOUNT: exceldata[i].INSAMOUNT, REJTRNOOR2: exceldata[i].REJTRNOOR2, EVALID: exceldata[i].EVALID, EDECLFLAG: exceldata[i].EDECLFLAG, SUBARNCODE: exceldata[i].SUBARNCODE, ATMCARDRE3: exceldata[i].ATMCARDRE3, ATMCARDST4: exceldata[i].ATMCARDST4, SCH1: exceldata[i].SCH1, PLN1: exceldata[i].PLN1, TD_TRXNMO5: exceldata[i].TD_TRXNMO5, NEWUNQNO: exceldata[i].NEWUNQNO, SIPREGDT: exceldata[i].SIPREGDT, DIVPER: exceldata[i].DIVPER, CAN: exceldata[i].CAN, EXCHORGTR6: exceldata[i].EXCHORGTR6, ELECTRXNF7: exceldata[i].ELECTRXNF7, SIPREGSLNO: exceldata[i].SIPREGSLNO, CLEARED: exceldata[i].CLEARED, TD_POP: exceldata[i].TD_POP, INVSTATE: exceldata[i].INVSTATE, STAMPDUTY: exceldata[i].STAMPDUTY });
                resdata = {
                    status: 400,
                    message: 'User not found',
                    data: newclientarray
                }

            } else {
                console.log("data not null=", exceldata[i].TD_ACNO, exceldata[i].TD_TRNO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO)
                try {
                    const filter = { TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_ACNO: exceldata[i].TD_ACNO, FMCODE: exceldata[i].FMCODE, TRFLAG: exceldata[i].TRFLAG };
                    const updateDoc = {
                        $set: {
                            FMCODE: exceldata[i].FMCODE,
                            TD_FUND: exceldata[i].TD_FUND,
                            TD_SCHEME: exceldata[i].TD_SCHEME,
                            TD_PLAN: exceldata[i].TD_PLAN,
                            TD_ACNO: exceldata[i].TD_ACNO,
                            SCHPLN: exceldata[i].SCHPLN,
                            DIVOPT: exceldata[i].DIVOPT,
                            FUNDDESC: exceldata[i].FUNDDESC,
                            TD_PURRED: exceldata[i].TD_PURRED,
                            TD_TRNO: exceldata[i].TD_TRNO,
                            SMCODE: exceldata[i].SMCODE,
                            CHQNO: exceldata[i].CHQNO,
                            INVNAME: userdata[0]._doc.NAME,
                            TRNMODE: exceldata[i].TRNMODE,
                            TRNSTAT: exceldata[i].TRNSTAT,
                            TD_BRANCH: exceldata[i].TD_BRANCH,
                            ISCTRNO: exceldata[i].ISCTRNO,
                            TD_TRDT: moment(new Date(exceldata[i].TD_TRDT)).format("YYYY-MM-DD"),
                            TD_PRDT: moment(new Date(exceldata[i].TD_PRDT)).format("YYYY-MM-DD"),
                            TD_UNITS: Number(exceldata[i].TD_UNITS),
                            TD_AMT: Number(exceldata[i].TD_AMT),
                            TD_AGENT: exceldata[i].TD_AGENT,
                            TD_BROKER: exceldata[i].TD_BROKER,
                            BROKPER: exceldata[i].BROKPER,
                            BROKCOMM: exceldata[i].BROKCOMM,
                            INVID: exceldata[i].INVID,
                            CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"),
                            CRTIME: exceldata[i].CRTIME,
                            TRNSUB: exceldata[i].TRNSUB,
                            TD_APPNO: exceldata[i].TD_APPNO,
                            UNQNO: exceldata[i].UNQNO,
                            TRDESC: exceldata[i].TRDESC,
                            TD_TRTYPE: exceldata[i].TD_TRTYPE,
                            NAVDATE: moment(new Date(exceldata[i].NAVDATE)).format("YYYY-MM-DD"),
                            PORTDT: moment(new Date(exceldata[i].PORTDT)).format("YYYY-MM-DD"),
                            ASSETTYPE: exceldata[i].ASSETTYPE,
                            SUBTRTYPE: exceldata[i].SUBTRTYPE,
                            CITYCATEG0: exceldata[i].CITYCATEG0,
                            EUIN: exceldata[i].EUIN,
                            TRCHARGES: exceldata[i].TRCHARGES,
                            CLIENTID: exceldata[i].CLIENTID,
                            DPID: exceldata[i].DPID,
                            STT: exceldata[i].STT,
                            IHNO: exceldata[i].IHNO,
                            BRANCHCODE: exceldata[i].BRANCHCODE,
                            INWARDNUM1: exceldata[i].INWARDNUM1,
                            PAN1: exceldata[i].PAN1,
                            PAN2: exceldata[i].PAN2,
                            PAN3: exceldata[i].PAN3,
                            TDSAMOUNT: exceldata[i].TDSAMOUNT,
                            CHQDATE: exceldata[i].CHQDATE,
                            CHQBANK: exceldata[i].CHQBANK,
                            TRFLAG: exceldata[i].TRFLAG,
                            LOAD1: exceldata[i].LOAD1,
                            BROK_ENTDT: exceldata[i].BROK_ENTDT,
                            NCTREMARKS: exceldata[i].NCTREMARKS,
                            PRCODE1: exceldata[i].PRCODE1,
                            STATUS: exceldata[i].STATUS,
                            SCHEMEISIN: exceldata[i].SCHEMEISIN,
                            TD_NAV: Number(exceldata[i].TD_NAV),
                            INSAMOUNT: exceldata[i].INSAMOUNT,
                            REJTRNOOR2: exceldata[i].REJTRNOOR2,
                            EVALID: exceldata[i].EVALID,
                            EDECLFLAG: exceldata[i].EDECLFLAG,
                            SUBARNCODE: exceldata[i].SUBARNCODE,
                            ATMCARDRE3: exceldata[i].ATMCARDRE3,
                            ATMCARDST4: exceldata[i].ATMCARDST4,
                            SCH1: exceldata[i].SCH1,
                            PLN1: exceldata[i].PLN1,
                            TD_TRXNMO5: exceldata[i].TD_TRXNMO5,
                            NEWUNQNO: exceldata[i].NEWUNQNO,
                            SIPREGDT: exceldata[i].SIPREGDT,
                            SIPREGSLNO: exceldata[i].SIPREGSLNO,
                            DIVPER: exceldata[i].DIVPER,
                            CAN: exceldata[i].CAN,
                            EXCHORGTR6: exceldata[i].EXCHORGTR6,
                            ELECTRXNF7: exceldata[i].ELECTRXNF7,
                            CLEARED: exceldata[i].CLEARED,
                            BROK_VALU8: exceldata[i].BROK_VALU8,
                            TD_POP: Number(exceldata[i].TD_POP),
                            INVSTATE: exceldata[i].INVSTATE,
                            STAMPDUTY: exceldata[i].STAMPDUTY,
                            USER_ID: userdata[0]._doc.DOCNO,
                        },

                    };
                    const option = {
                        upsert: true,
                    };
                    const result = await transk.updateMany(filter, updateDoc, option);

                    console.log(`Updated ${result.n} documents`);
                    transk.find({ TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_ACNO: exceldata[i].TD_ACNO }, function (err, data) {
                        //console.log("ddddddd====",data[0]._doc)
                        totaluploaded.push(data[0]._doc)
                        console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                        //console.log("totaluploaded=",totaluploaded)       
                    });
                } catch (error) {
                    console.log(`Error found. ${error}`)
                }
            }
            // console.log("newclientarray=",newclientarray)
            if (exceldata.length === i + 1) {

                resdata = {
                    status: 200,
                    message: 'Data uploaded',
                    data: newclientarray
                }
                return resdata;
            } else {
                resdata = {
                    status: 400,
                    message: 'Data not uploaded',
                }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}  */

/* async function uploadtransactioncams2a(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        for (var i = 0; i < exceldata.length; i++) {
            exceldata[i].PAN = (exceldata[i].PAN).toUpperCase();
            let userdata = await users.find({ $and: [{ PAN: exceldata[i].PAN }, { NAME: { '$regex': exceldata[i].INV_NAME, '$options': 'i' } }] }, { _id: 0, DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();
            console.log("datawwwwww=", "i=", i, exceldata[i].INV_NAME, exceldata[i].PAN)
            if (userdata === null || userdata[0] === undefined) {
                console.log("data null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO);
                newclientarray.push({ AMC_CODE: exceldata[i].AMC_CODE, FOLIO_NO: exceldata[i].FOLIO_NO, PRODCODE: exceldata[i].PRODCODE, SCHEME: exceldata[i].SCHEME, INV_NAME: exceldata[i].INV_NAME, TRXNTYPE: exceldata[i].TRXNTYPE, TRXNNO: exceldata[i].TRXNNO, TRXNMODE: exceldata[i].TRXNMODE, TRXNSTAT: exceldata[i].TRXNSTAT, USERCODE: exceldata[i].USERCODE, USRTRXNO: exceldata[i].USRTRXNO, TRADDATE: exceldata[i].TRADDATE, POSTDATE: exceldata[i].POSTDATE, PURPRICE: exceldata[i].PURPRICE, UNITS: exceldata[i].UNITS, AMOUNT: exceldata[i].AMOUNT, BROKCODE: exceldata[i].BROKCODE, SUBBROK: exceldata[i].SUBBROK, BROKPERC: exceldata[i].BROKPERC, BROKCOMM: exceldata[i].BROKCOMM, ALTFOLIO: exceldata[i].ALTFOLIO, REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"), TIME1: exceldata[i].TIME1, TRXNSUBTYP: exceldata[i].TRXNSUBTYP, APPLICATIO: exceldata[i].APPLICATIO, TRXN_NATUR: exceldata[i].TRXN_NATUR, TAX: exceldata[i].TAX, TOTAL_TAX: exceldata[i].TOTAL_TAX, TE_15H: exceldata[i].TE_15H, MICR_NO: exceldata[i].MICR_NO, REMARKS: exceldata[i].REMARKS, SWFLAG: exceldata[i].SWFLAG, OLD_FOLIO: exceldata[i].OLD_FOLIO, SEQ_NO: exceldata[i].SEQ_NO, REINVEST_F: exceldata[i].REINVEST_F, MULT_BROK: exceldata[i].MULT_BROK, STT: exceldata[i].STT, LOCATION: exceldata[i].LOCATION, SCHEME_TYP: exceldata[i].SCHEME_TYP, TAX_STATUS: exceldata[i].TAX_STATUS, LOAD: exceldata[i].LOAD, SCANREFNO: exceldata[i].SCANREFNO, PAN: exceldata[i].PAN, INV_IIN: exceldata[i].INV_IIN, TARG_SRC_S: exceldata[i].TARG_SRC_S, TRXN_TYPE_: exceldata[i].TRXN_TYPE_, TICOB_TRTY: exceldata[i].TICOB_TRTY, TICOB_TRNO: exceldata[i].TICOB_TRNO, TICOB_POST: exceldata[i].TICOB_POST, DP_ID: exceldata[i].DP_ID, TRXN_CHARG: exceldata[i].TRXN_CHARG, ELIGIB_AMT: exceldata[i].ELIGIB_AMT, SRC_OF_TXN: exceldata[i].SRC_OF_TXN, TRXN_SUFFI: exceldata[i].TRXN_SUFFI, SIPTRXNNO: exceldata[i].SIPTRXNNO, TER_LOCATI: exceldata[i].TER_LOCATI, EUIN: exceldata[i].EUIN, EUIN_VALID: exceldata[i].EUIN_VALID, EUIN_OPTED: exceldata[i].EUIN_OPTED, SUB_BRK_AR: exceldata[i].SUB_BRK_AR, EXCH_DC_FL: exceldata[i].EXCH_DC_FL, SRC_BRK_CO: exceldata[i].SRC_BRK_CO, SYS_REGN_D: exceldata[i].SYS_REGN_D, AC_NO: exceldata[i].AC_NO, BANK_NAME: exceldata[i].BANK_NAME, REVERSAL_C: exceldata[i].REVERSAL_C, EXCHANGE_F: exceldata[i].EXCHANGE_F, CA_INITIAT: exceldata[i].CA_INITIAT, GST_STATE_: exceldata[i].GST_STATE_, IGST_AMOUN: exceldata[i].IGST_AMOUN, CGST_AMOUN: exceldata[i].CGST_AMOUN, SGST_AMOUN: exceldata[i].SGST_AMOUN, REV_REMARK: exceldata[i].REV_REMARK, ORIGINAL_T: exceldata[i].ORIGINAL_T, STAMP_DUTY: exceldata[i].STAMP_DUTY, FOLIO_OLD: exceldata[i].FOLIO_OLD, SCHEME_FOL: exceldata[i].SCHEME_FOL, AMC_REF_NO: exceldata[i].AMC_REF_NO, REQUEST_RE: exceldata[i].REQUEST_RE });
                resdata = {
                    status: 400,
                    message: 'User not found',
                    data: newclientarray
                }
            } else {
                console.log("data not null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO)
                try {
                    //  j = i;
                    const filter = { TRXNNO: exceldata[i].TRXNNO, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"), AMOUNT: Number(exceldata[i].AMOUNT), PRODCODE: exceldata[i].PRODCODE, SEQ_NO: exceldata[i].SEQ_NO };

                    const updateDoc = {
                        $set: {
                            AMC_CODE: exceldata[i].AMC_CODE,
                            FOLIO_NO: exceldata[i].FOLIO_NO,
                            PRODCODE: exceldata[i].PRODCODE,
                            SCHEME: exceldata[i].SCHEME,
                            INV_NAME: userdata[0]._doc.NAME,
                            TRXNTYPE: exceldata[i].TRXNTYPE,
                            TRXNNO: exceldata[i].TRXNNO,
                            TRXNMODE: exceldata[i].TRXNMODE,
                            TRXNSTAT: exceldata[i].TRXNSTAT,
                            USERCODE: exceldata[i].USERCODE,
                            USRTRXNO: exceldata[i].USRTRXNO,
                            TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"),
                            POSTDATE: moment(new Date(exceldata[i].POSTDATE)).format("YYYY-MM-DD"),
                            PURPRICE: Number(exceldata[i].PURPRICE),
                            UNITS: Number(exceldata[i].UNITS),
                            AMOUNT: Number(exceldata[i].AMOUNT),
                            BROKCODE: exceldata[i].BROKCODE,
                            SUBBROK: exceldata[i].SUBBROK,
                            BROKPERC: exceldata[i].BROKPERC,
                            BROKCOMM: exceldata[i].BROKCOMM,
                            ALTFOLIO: exceldata[i].ALTFOLIO,
                            REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"),
                            TIME1: exceldata[i].TIME1,
                            TRXNSUBTYP: exceldata[i].TRXNSUBTYP,
                            APPLICATIO: exceldata[i].APPLICATIO,
                            TRXN_NATUR: exceldata[i].TRXN_NATUR,
                            TAX: Number(exceldata[i].TAX),
                            TOTAL_TAX: Number(exceldata[i].TOTAL_TAX),
                            TE_15H: exceldata[i].TE_15H,
                            MICR_NO: exceldata[i].MICR_NO,
                            REMARKS: exceldata[i].REMARKS,
                            SWFLAG: exceldata[i].SWFLAG,
                            OLD_FOLIO: exceldata[i].OLD_FOLIO,
                            SEQ_NO: exceldata[i].SEQ_NO,
                            REINVEST_F: exceldata[i].REINVEST_F,
                            MULT_BROK: exceldata[i].MULT_BROK,
                            STT: Number(exceldata[i].STT),
                            LOCATION: exceldata[i].LOCATION,
                            SCHEME_TYP: exceldata[i].SCHEME_TYP,
                            TAX_STATUS: exceldata[i].TAX_STATUS,
                            LOAD: Number(exceldata[i].LOAD),
                            SCANREFNO: exceldata[i].SCANREFNO,
                            PAN: (exceldata[i].PAN).toUpperCase(),
                            INV_IIN: exceldata[i].INV_IIN,
                            TARG_SRC_S: exceldata[i].TARG_SRC_S,
                            TRXN_TYPE_: exceldata[i].TRXN_TYPE_,
                            TICOB_TRTY: exceldata[i].TICOB_TRTY,
                            TICOB_TRNO: exceldata[i].TICOB_TRNO,
                            TICOB_POST: exceldata[i].TICOB_POST,
                            DP_ID: exceldata[i].DP_ID,
                            TRXN_CHARG: Number(exceldata[i].TRXN_CHARG),
                            ELIGIB_AMT: Number(exceldata[i].ELIGIB_AMT),
                            SRC_OF_TXN: exceldata[i].SRC_OF_TXN,
                            TRXN_SUFFI: exceldata[i].TRXN_SUFFI,
                            SIPTRXNNO: exceldata[i].SIPTRXNNO,
                            TER_LOCATI: exceldata[i].TER_LOCATI,
                            EUIN: exceldata[i].EUIN,
                            EUIN_VALID: exceldata[i].EUIN_VALID,
                            EUIN_OPTED: exceldata[i].EUIN_OPTED,
                            SUB_BRK_AR: exceldata[i].SUB_BRK_AR,
                            EXCH_DC_FL: exceldata[i].EXCH_DC_FL,
                            SRC_BRK_CO: exceldata[i].SRC_BRK_CO,
                            SYS_REGN_D: exceldata[i].SYS_REGN_D,
                            AC_NO: exceldata[i].AC_NO,
                            BANK_NAME: exceldata[i].BANK_NAME,
                            REVERSAL_C: exceldata[i].REVERSAL_C,
                            EXCHANGE_F: exceldata[i].EXCHANGE_F,
                            CA_INITIAT: exceldata[i].CA_INITIAT,
                            GST_STATE_: exceldata[i].GST_STATE_,
                            IGST_AMOUN: Number(exceldata[i].IGST_AMOUN),
                            CGST_AMOUN: Number(exceldata[i].CGST_AMOUN),
                            SGST_AMOUN: Number(exceldata[i].SGST_AMOUN),
                            REV_REMARK: exceldata[i].REV_REMARK,
                            ORIGINAL_T: exceldata[i].ORIGINAL_T,
                            STAMP_DUTY: Number(exceldata[i].STAMP_DUTY),
                            FOLIO_OLD: exceldata[i].FOLIO_OLD,
                            SCHEME_FOL: exceldata[i].SCHEME_FOL,
                            AMC_REF_NO: exceldata[i].AMC_REF_NO,
                            REQUEST_RE: exceldata[i].REQUEST_RE,
                            USER_ID: userdata[0]._doc.DOCNO,
                        },

                    };
                    const option = {
                        "upsert": true,
                    };
                    const result = await transc2A.updateMany(filter, updateDoc, option);

                    console.log(`Updated ${result.n} documents`);
                    transc2A.find({ TRXNNO: exceldata[i].TRXNNO, PRODCODE: exceldata[i].PRODCODE, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD") }, function (err, data) {
                        //console.log("ddddddd====",data[0]._doc)
                        totaluploaded.push(data[0]._doc)
                        console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                        //console.log("totaluploaded=",totaluploaded)       
                    });
                } catch (error) {
                    console.log(`Error found. ${error}`)
                }
            }

            if (exceldata.length === i + 1) {
                resdata = {
                    status: 200,
                    message: 'Data uploaded',
                    data: newclientarray
                }
                return resdata;
            } else {
                resdata = {
                    status: 400,
                    message: 'Data not uploaded',
                }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
} */

/* async function uploadfoliocams(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        for (var i = 0; i < exceldata.length; i++) {
            exceldata[i].PAN_NO = (exceldata[i].PAN_NO).toUpperCase();
            console.log("ttttttt=", exceldata[i].PAN_NO, exceldata[i].INV_NAME)
            let userdata = await users.find({ $and: [{ PAN: exceldata[i].PAN_NO }, { NAME: { '$regex': exceldata[i].INV_NAME, '$options': 'i' } }] }, { _id: 0, DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();

            if (userdata === null || userdata[0] === undefined) {
                console.log("data null=", exceldata[i].FOLIOCHK, exceldata[i].PAN_NO);
                newclientarray.push({
                    FOLIOCHK: exceldata[i].FOLIOCHK, INV_NAME: exceldata[i].INV_NAME, ADDRESS1: exceldata[i].ADDRESS1, ADDRESS2: exceldata[i].ADDRESS2, ADDRESS3: exceldata[i].ADDRESS3, CITY: exceldata[i].CITY, PINCODE: exceldata[i].PINCODE, PRODUCT: exceldata[i].PRODUCT, SCH_NAME: exceldata[i].SCH_NAME, REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"), CLOS_BAL: Number(exceldata[i].CLOS_BAL),
                    RUPEE_BAL: Number(exceldata[i].RUPEE_BAL), JNT_NAME1: exceldata[i].JNT_NAME1,
                    JNT_NAME2: exceldata[i].JNT_NAME2, PHONE_OFF: exceldata[i].PHONE_OFF, PHONE_RES: exceldata[i].PHONE_RES, EMAIL: exceldata[i].EMAIL, HOLDING_NA: exceldata[i].HOLDING_NA,
                    UIN_NO: exceldata[i].UIN_NO, PAN_NO: (exceldata[i].PAN_NO).toUpperCase(), JOINT1_PAN: exceldata[i].JOINT1_PAN, JOINT2_PAN: exceldata[i].JOINT2_PAN, GUARD_PAN: exceldata[i].GUARD_PAN, TAX_STATUS: exceldata[i].TAX_STATUS, BROKER_COD: exceldata[i].BROKER_COD,
                    SUBBROKER: exceldata[i].SUBBROKER, REINV_FLAG: exceldata[i].REINV_FLAG, BANK_NAME: exceldata[i].BANK_NAME, BRANCH: exceldata[i].BRANCH, AC_TYPE: exceldata[i].AC_TYPE,
                    AC_NO: exceldata[i].AC_NO, B_ADDRESS1: exceldata[i].B_ADDRESS1, B_ADDRESS2: exceldata[i].B_ADDRESS2, B_ADDRESS3: exceldata[i].B_ADDRESS3, B_CITY: exceldata[i].B_CITY, B_PINCODE: exceldata[i].B_PINCODE, INV_DOB: exceldata[i].INV_DOB, MOBILE_NO: exceldata[i].MOBILE_NO, OCCUPATION: exceldata[i].OCCUPATION, INV_IIN: exceldata[i].INV_IIN,
                    NOM_NAME: exceldata[i].NOM_NAME, RELATION: exceldata[i].RELATION, NOM_ADDR1: exceldata[i].NOM_ADDR1, NOM_ADDR2: exceldata[i].NOM_ADDR2, NOM_ADDR3: exceldata[i].NOM_ADDR3,
                    NOM_CITY: exceldata[i].NOM_CITY, NOM_STATE: exceldata[i].NOM_STATE, NOM_PINCOD: exceldata[i].NOM_PINCOD, NOM_PH_OFF: exceldata[i].NOM_PH_OFF, NOM_PH_RES: exceldata[i].NOM_PH_RES, NOM_EMAIL: exceldata[i].NOM_EMAIL, NOM_PERCEN: exceldata[i].NOM_PERCEN, NOM2_NAME: exceldata[i].NOM2_NAME, NOM2_RELAT: exceldata[i].NOM2_RELAT, NOM2_ADDR1: exceldata[i].NOM2_ADDR1, NOM2_ADDR2: exceldata[i].NOM2_ADDR2, NOM2_ADDR3: exceldata[i].NOM2_ADDR3, NOM2_CITY: exceldata[i].NOM2_CITY, NOM2_STATE: exceldata[i].NOM2_STATE, NOM2_PINCO: exceldata[i].NOM2_PINCO, NOM2_PH_OF: exceldata[i].NOM2_PH_OF, NOM2_PH_RE: exceldata[i].NOM2_PH_RE, NOM2_EMAIL: exceldata[i].NOM2_EMAIL, NOM2_PERCE: exceldata[i].NOM2_PERCE, NOM3_NAME: exceldata[i].NOM3_NAME, NOM3_RELAT: exceldata[i].NOM3_RELAT, NOM3_ADDR1: exceldata[i].NOM3_ADDR1, NOM3_ADDR2: exceldata[i].NOM3_ADDR2, NOM3_ADDR3: exceldata[i].NOM3_ADDR3, NOM3_CITY: exceldata[i].NOM3_CITY, NOM3_STATE: exceldata[i].NOM3_STATE, NOM3_PINCO: exceldata[i].NOM3_PINCO, NOM3_PH_OF: exceldata[i].NOM3_PH_OF, NOM3_PH_RE: exceldata[i].NOM3_PH_RE, NOM3_EMAIL: exceldata[i].NOM3_EMAIL, NOM3_PERCE: exceldata[i].NOM3_PERCE, IFSC_CODE: exceldata[i].IFSC_CODE, DP_ID: exceldata[i].DP_ID, DEMAT: exceldata[i].DEMAT, GUARD_NAME: exceldata[i].GUARD_NAME, BROKCODE: exceldata[i].BROKCODE, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD"), AADHAAR: exceldata[i].AADHAAR, TPA_LINKED: exceldata[i].TPA_LINKED, FH_CKYC_NO: exceldata[i].FH_CKYC_NO, JH1_CKYC: exceldata[i].JH1_CKYC, JH2_CKYC: exceldata[i].JH2_CKYC, G_CKYC_NO: exceldata[i].G_CKYC_NO, JH1_DOB: exceldata[i].JH1_DOB, JH2_DOB: exceldata[i].JH2_DOB, GUARDIAN_D: exceldata[i].GUARDIAN_D, AMC_CODE: exceldata[i].AMC_CODE, GST_STATE_: exceldata[i].GST_STATE_, FOLIO_OLD: exceldata[i].FOLIO_OLD, SCHEME_FOL: exceldata[i].SCHEME_FOL
                });
                resdata = {
                    status: 400,
                    message: 'User not found',
                    data: newclientarray
                }
            } else {
                console.log("data not null=", exceldata[i].FOLIOCHK, exceldata[i].AC_NO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO)
                try {
                    const filter = { FOLIOCHK: exceldata[i].FOLIOCHK, SCH_NAME: exceldata[i].SCH_NAME, AC_NO: exceldata[i].AC_NO, PRODUCT: exceldata[i].PRODUCT, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD") };

                    const updateDoc = {
                        $set: {
                            FOLIOCHK: exceldata[i].FOLIOCHK,
                            INV_NAME: userdata[0]._doc.NAME,
                            ADDRESS1: exceldata[i].ADDRESS1,
                            ADDRESS2: exceldata[i].ADDRESS2,
                            ADDRESS3: exceldata[i].ADDRESS3,
                            CITY: exceldata[i].CITY,
                            PINCODE: exceldata[i].PINCODE,
                            PRODUCT: exceldata[i].PRODUCT,
                            SCH_NAME: exceldata[i].SCH_NAME,
                            REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"),
                            CLOS_BAL: Number(exceldata[i].CLOS_BAL),
                            RUPEE_BAL: Number(exceldata[i].RUPEE_BAL),
                            JNT_NAME1: exceldata[i].JNT_NAME1,
                            JNT_NAME2: exceldata[i].JNT_NAME2,
                            PHONE_OFF: exceldata[i].PHONE_OFF,
                            PHONE_RES: exceldata[i].PHONE_RES,
                            EMAIL: exceldata[i].EMAIL,
                            HOLDING_NA: exceldata[i].HOLDING_NA,
                            UIN_NO: exceldata[i].UIN_NO,
                            PAN_NO: (exceldata[i].PAN_NO).toUpperCase(),
                            JOINT1_PAN: exceldata[i].JOINT1_PAN,
                            JOINT2_PAN: exceldata[i].JOINT2_PAN,
                            GUARD_PAN: exceldata[i].GUARD_PAN,
                            TAX_STATUS: exceldata[i].TAX_STATUS,
                            BROKER_COD: exceldata[i].BROKER_COD,
                            SUBBROKER: exceldata[i].SUBBROKER,
                            REINV_FLAG: exceldata[i].REINV_FLAG,
                            BANK_NAME: exceldata[i].BANK_NAME,
                            BRANCH: exceldata[i].BRANCH,
                            AC_TYPE: exceldata[i].AC_TYPE,
                            AC_NO: exceldata[i].AC_NO,
                            B_ADDRESS1: exceldata[i].B_ADDRESS1,
                            B_ADDRESS2: exceldata[i].B_ADDRESS2,
                            B_ADDRESS3: exceldata[i].B_ADDRESS3,
                            B_CITY: exceldata[i].B_CITY,
                            B_PINCODE: exceldata[i].B_PINCODE,
                            INV_DOB: exceldata[i].INV_DOB,
                            MOBILE_NO: exceldata[i].MOBILE_NO,
                            OCCUPATION: exceldata[i].OCCUPATION,
                            INV_IIN: exceldata[i].INV_IIN,
                            NOM_NAME: exceldata[i].NOM_NAME,
                            RELATION: exceldata[i].RELATION,
                            NOM_ADDR1: exceldata[i].NOM_ADDR1,
                            NOM_ADDR2: exceldata[i].NOM_ADDR2,
                            NOM_ADDR3: exceldata[i].NOM_ADDR3,
                            NOM_CITY: exceldata[i].NOM_CITY,
                            NOM_STATE: exceldata[i].NOM_STATE,
                            NOM_PINCOD: exceldata[i].NOM_PINCOD,
                            NOM_PH_OFF: exceldata[i].NOM_PH_OFF,
                            NOM_PH_RES: exceldata[i].NOM_PH_RES,
                            NOM_EMAIL: exceldata[i].NOM_EMAIL,
                            NOM_PERCEN: exceldata[i].NOM_PERCEN,
                            NOM2_NAME: exceldata[i].NOM2_NAME,
                            NOM2_RELAT: exceldata[i].NOM2_RELAT,
                            NOM2_ADDR1: exceldata[i].NOM2_ADDR1,
                            NOM2_ADDR2: exceldata[i].NOM2_ADDR2,
                            NOM2_ADDR3: exceldata[i].NOM2_ADDR3,
                            NOM2_CITY: exceldata[i].NOM2_CITY,
                            NOM2_STATE: exceldata[i].NOM2_STATE,
                            NOM2_PINCO: exceldata[i].NOM2_PINCO,
                            NOM2_PH_OF: exceldata[i].NOM2_PH_OF,
                            NOM2_PH_RE: exceldata[i].NOM2_PH_RE,
                            NOM2_EMAIL: exceldata[i].NOM2_EMAIL,
                            NOM2_PERCE: exceldata[i].NOM2_PERCE,
                            NOM3_NAME: exceldata[i].NOM3_NAME,
                            NOM3_RELAT: exceldata[i].NOM3_RELAT,
                            NOM3_ADDR1: exceldata[i].NOM3_ADDR1,
                            NOM3_ADDR2: exceldata[i].NOM3_ADDR2,
                            NOM3_ADDR3: exceldata[i].NOM3_ADDR3,
                            NOM3_CITY: exceldata[i].NOM3_CITY,
                            NOM3_STATE: exceldata[i].NOM3_STATE,
                            NOM3_PINCO: exceldata[i].NOM3_PINCO,
                            NOM3_PH_OF: exceldata[i].NOM3_PH_OF,
                            NOM3_PH_RE: exceldata[i].NOM3_PH_RE,
                            NOM3_EMAIL: exceldata[i].NOM3_EMAIL,
                            NOM3_PERCE: exceldata[i].NOM3_PERCE,
                            IFSC_CODE: exceldata[i].IFSC_CODE,
                            DP_ID: exceldata[i].DP_ID,
                            DEMAT: exceldata[i].DEMAT,
                            GUARD_NAME: exceldata[i].GUARD_NAME,
                            BROKCODE: exceldata[i].BROKCODE,
                            FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD"),
                            AADHAAR: exceldata[i].AADHAAR,
                            TPA_LINKED: exceldata[i].TPA_LINKED,
                            FH_CKYC_NO: exceldata[i].FH_CKYC_NO,
                            JH1_CKYC: exceldata[i].JH1_CKYC,
                            JH2_CKYC: exceldata[i].JH2_CKYC,
                            G_CKYC_NO: exceldata[i].G_CKYC_NO,
                            JH1_DOB: exceldata[i].JH1_DOB,
                            JH2_DOB: exceldata[i].JH2_DOB,
                            GUARDIAN_D: exceldata[i].GUARDIAN_D,
                            AMC_CODE: exceldata[i].AMC_CODE,
                            GST_STATE_: exceldata[i].GST_STATE_,
                            FOLIO_OLD: exceldata[i].FOLIO_OLD,
                            SCHEME_FOL: exceldata[i].SCHEME_FOL,
                            USER_ID: userdata[0]._doc.DOCNO,
                        },

                    };
                    const option = {
                        "upsert": true,
                    };
                    const result = await folioc.updateMany(filter, updateDoc, option);

                    console.log(`Updated ${result.n} documents`);
                    folioc.find({ FOLIOCHK: exceldata[i].FOLIOCHK, PRODUCT: exceldata[i].PRODUCT, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD") }, function (err, data) {
                        //console.log("ddddddd====",data[0]._doc)
                        totaluploaded.push(data[0]._doc)
                        console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length)
                        //console.log("totaluploaded=",totaluploaded)       
                    });
                } catch (error) {
                    console.log(`Error found. ${error}`)
                }
            }

            if (exceldata.length === i + 1) {
                resdata = {
                    status: 200,
                    message: 'Data uploaded',
                    data: newclientarray
                }
                return resdata;
            } else {
                resdata = {
                    status: 400,
                    message: 'Data not uploaded',
                }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
} */

async function uploadtransactionkarvy(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        var j = '';
        for (var i = 0; i < exceldata.length; i++) {
            if (exceldata[i].TD_ACNO != undefined) {
                let foliodata = await foliok.find({ $and: [{ ACNO: exceldata[i].TD_ACNO }, { PRCODE: exceldata[i].FMCODE }] }, { _id: 0, ACNO: "$ACNO", PRCODE: "$PRCODE", USER_ID: "$USER_ID", PAN: "$PANGNO", NAME: "$INVNAME" }).exec();
                if (foliodata === null || foliodata[0] === undefined) {
                    console.log("data null=", exceldata[i].TD_ACNO, exceldata[i].TD_TRNO)
                    newclientarray.push({ FMCODE: exceldata[i].FMCODE, TD_FUND: exceldata[i].TD_FUND, TD_SCHEME: exceldata[i].TD_SCHEME, TD_PLAN: exceldata[i].TD_PLAN, TD_ACNO: exceldata[i].TD_ACNO, SCHPLN: exceldata[i].SCHPLN, DIVOPT: exceldata[i].DIVOPT, FUNDDESC: exceldata[i].FUNDDESC, TD_PURRED: exceldata[i].TD_PURRED, TD_TRNO: exceldata[i].TD_TRNO, SMCODE: exceldata[i].SMCODE, CHQNO: exceldata[i].CHQNO, INVNAME: exceldata[i].INVNAME, TRNMODE: exceldata[i].TRNMODE, TRNSTAT: exceldata[i].TRNSTAT, TD_BRANCH: exceldata[i].TD_BRANCH, ISCTRNO: exceldata[i].ISCTRNO, TD_TRDT: moment(new Date(exceldata[i].TD_TRDT)).format("YYYY-MM-DD"), TD_PRDT: moment(new Date(exceldata[i].TD_PRDT)).format("YYYY-MM-DD"), TD_UNITS: exceldata[i].TD_UNITS, TD_AMT: exceldata[i].TD_AMT, TD_AGENT: exceldata[i].TD_AGENT, TD_BROKER: exceldata[i].TD_BROKER, BROKPER: exceldata[i].BROKPER, BROKCOMM: exceldata[i].BROKCOMM, INVID: exceldata[i].INVID, CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"), CRTIME: exceldata[i].CRTIME, TRNSUB: exceldata[i].TRNSUB, TD_APPNO: exceldata[i].TD_APPNO, UNQNO: exceldata[i].UNQNO, TRDESC: exceldata[i].TRDESC, TD_TRTYPE: exceldata[i].TD_TRTYPE, NAVDATE: moment(new Date(exceldata[i].NAVDATE)).format("YYYY-MM-DD"), PORTDT: moment(new Date(exceldata[i].PORTDT)).format("YYYY-MM-DD"), ASSETTYPE: exceldata[i].ASSETTYPE, SUBTRTYPE: exceldata[i].SUBTRTYPE, CITYCATEG0: exceldata[i].CITYCATEG0, EUIN: exceldata[i].EUIN, TRCHARGES: exceldata[i].TRCHARGES, CLIENTID: exceldata[i].CLIENTID, DPID: exceldata[i].DPID, STT: exceldata[i].STT, IHNO: exceldata[i].IHNO, BRANCHCODE: exceldata[i].BRANCHCODE, INWARDNUM1: exceldata[i].INWARDNUM1, PAN1: exceldata[i].PAN1, PAN2: exceldata[i].PAN2, PAN3: exceldata[i].PAN3, TDSAMOUNT: exceldata[i].TDSAMOUNT, CHQDATE: moment(new Date(exceldata[i].CHQDATE)).format("YYYY-MM-DD"), CHQBANK: exceldata[i].CHQBANK, TRFLAG: exceldata[i].TRFLAG, LOAD1: exceldata[i].LOAD1, BROK_ENTDT: exceldata[i].BROK_ENTDT, NCTREMARKS: exceldata[i].NCTREMARKS, PRCODE1: exceldata[i].PRCODE1, STATUS: exceldata[i].STATUS, SCHEMEISIN: exceldata[i].SCHEMEISIN, TD_NAV: exceldata[i].TD_NAV, INSAMOUNT: exceldata[i].INSAMOUNT, REJTRNOOR2: exceldata[i].REJTRNOOR2, EVALID: exceldata[i].EVALID, EDECLFLAG: exceldata[i].EDECLFLAG, SUBARNCODE: exceldata[i].SUBARNCODE, ATMCARDRE3: exceldata[i].ATMCARDRE3, ATMCARDST4: exceldata[i].ATMCARDST4, SCH1: exceldata[i].SCH1, PLN1: exceldata[i].PLN1, TD_TRXNMO5: exceldata[i].TD_TRXNMO5, NEWUNQNO: exceldata[i].NEWUNQNO, SIPREGDT: exceldata[i].SIPREGDT, DIVPER: exceldata[i].DIVPER, CAN: exceldata[i].CAN, EXCHORGTR6: exceldata[i].EXCHORGTR6, ELECTRXNF7: exceldata[i].ELECTRXNF7, SIPREGSLNO: exceldata[i].SIPREGSLNO, CLEARED: exceldata[i].CLEARED, TD_POP: exceldata[i].TD_POP, INVSTATE: exceldata[i].INVSTATE, STAMPDUTY: exceldata[i].STAMPDUTY });
                    resdata = {
                        status: 400,
                        message: 'User not found',
                        data: newclientarray
                    }
                } else {
                    foliodata = foliodata.filter(
                        (temp => a =>
                            (k => !temp[k] && (temp[k] = true))(a.NAME + '|' + a.PAN + '|' + a.USER_ID)
                        )(Object.create(null))
                    );

                    for (var j = 0; j < foliodata.length; j++) {
                        console.log("data=", foliodata[j]._doc.NAME, foliodata[j]._doc.ACNO, foliodata[j]._doc.USER_ID, foliodata[j]._doc.ACNO)
                        console.log("data not null=", exceldata[i].TD_ACNO, exceldata[i].TD_TRNO, exceldata[i].PAN1)
                        try {
                            const filter = { TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_ACNO: exceldata[i].TD_ACNO, FMCODE: exceldata[i].FMCODE, TRFLAG: exceldata[i].TRFLAG };
                            const updateDoc = {
                                $set: {
                                    FMCODE: exceldata[i].FMCODE,
                                    TD_FUND: exceldata[i].TD_FUND,
                                    TD_SCHEME: exceldata[i].TD_SCHEME,
                                    TD_PLAN: exceldata[i].TD_PLAN,
                                    TD_ACNO: exceldata[i].TD_ACNO,
                                    SCHPLN: exceldata[i].SCHPLN,
                                    DIVOPT: exceldata[i].DIVOPT,
                                    FUNDDESC: exceldata[i].FUNDDESC,
                                    TD_PURRED: exceldata[i].TD_PURRED,
                                    TD_TRNO: exceldata[i].TD_TRNO,
                                    SMCODE: exceldata[i].SMCODE,
                                    CHQNO: exceldata[i].CHQNO,
                                    INVNAME: foliodata[j]._doc.NAME,
                                    TRNMODE: exceldata[i].TRNMODE,
                                    TRNSTAT: exceldata[i].TRNSTAT,
                                    TD_BRANCH: exceldata[i].TD_BRANCH,
                                    ISCTRNO: exceldata[i].ISCTRNO,
                                    TD_TRDT: moment(new Date(exceldata[i].TD_TRDT)).format("YYYY-MM-DD"),
                                    TD_PRDT: moment(new Date(exceldata[i].TD_PRDT)).format("YYYY-MM-DD"),
                                    TD_UNITS: Number(exceldata[i].TD_UNITS),
                                    TD_AMT: Number(exceldata[i].TD_AMT),
                                    TD_AGENT: exceldata[i].TD_AGENT,
                                    TD_BROKER: exceldata[i].TD_BROKER,
                                    BROKPER: exceldata[i].BROKPER,
                                    BROKCOMM: exceldata[i].BROKCOMM,
                                    INVID: exceldata[i].INVID,
                                    CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"),
                                    CRTIME: exceldata[i].CRTIME,
                                    TRNSUB: exceldata[i].TRNSUB,
                                    TD_APPNO: exceldata[i].TD_APPNO,
                                    UNQNO: exceldata[i].UNQNO,
                                    TRDESC: exceldata[i].TRDESC,
                                    TD_TRTYPE: exceldata[i].TD_TRTYPE,
                                    NAVDATE: moment(new Date(exceldata[i].NAVDATE)).format("YYYY-MM-DD"),
                                    PORTDT: moment(new Date(exceldata[i].PORTDT)).format("YYYY-MM-DD"),
                                    ASSETTYPE: exceldata[i].ASSETTYPE,
                                    SUBTRTYPE: exceldata[i].SUBTRTYPE,
                                    CITYCATEG0: exceldata[i].CITYCATEG0,
                                    EUIN: exceldata[i].EUIN,
                                    TRCHARGES: exceldata[i].TRCHARGES,
                                    CLIENTID: exceldata[i].CLIENTID,
                                    DPID: exceldata[i].DPID,
                                    STT: exceldata[i].STT,
                                    IHNO: exceldata[i].IHNO,
                                    BRANCHCODE: exceldata[i].BRANCHCODE,
                                    INWARDNUM1: exceldata[i].INWARDNUM1,
                                    PAN1: (exceldata[i].PAN1).toUpperCase(),
                                    PAN2: exceldata[i].PAN2,
                                    PAN3: exceldata[i].PAN3,
                                    TDSAMOUNT: exceldata[i].TDSAMOUNT,
                                    CHQDATE: exceldata[i].CHQDATE,
                                    CHQBANK: exceldata[i].CHQBANK,
                                    TRFLAG: exceldata[i].TRFLAG,
                                    LOAD1: exceldata[i].LOAD1,
                                    BROK_ENTDT: exceldata[i].BROK_ENTDT,
                                    NCTREMARKS: exceldata[i].NCTREMARKS,
                                    PRCODE1: exceldata[i].PRCODE1,
                                    STATUS: exceldata[i].STATUS,
                                    SCHEMEISIN: exceldata[i].SCHEMEISIN,
                                    TD_NAV: Number(exceldata[i].TD_NAV),
                                    INSAMOUNT: exceldata[i].INSAMOUNT,
                                    REJTRNOOR2: exceldata[i].REJTRNOOR2,
                                    EVALID: exceldata[i].EVALID,
                                    EDECLFLAG: exceldata[i].EDECLFLAG,
                                    SUBARNCODE: exceldata[i].SUBARNCODE,
                                    ATMCARDRE3: exceldata[i].ATMCARDRE3,
                                    ATMCARDST4: exceldata[i].ATMCARDST4,
                                    SCH1: exceldata[i].SCH1,
                                    PLN1: exceldata[i].PLN1,
                                    TD_TRXNMO5: exceldata[i].TD_TRXNMO5,
                                    NEWUNQNO: exceldata[i].NEWUNQNO,
                                    SIPREGDT: exceldata[i].SIPREGDT,
                                    SIPREGSLNO: exceldata[i].SIPREGSLNO,
                                    DIVPER: exceldata[i].DIVPER,
                                    CAN: exceldata[i].CAN,
                                    EXCHORGTR6: exceldata[i].EXCHORGTR6,
                                    ELECTRXNF7: exceldata[i].ELECTRXNF7,
                                    CLEARED: exceldata[i].CLEARED,
                                    BROK_VALU8: exceldata[i].BROK_VALU8,
                                    TD_POP: Number(exceldata[i].TD_POP),
                                    INVSTATE: exceldata[i].INVSTATE,
                                    STAMPDUTY: exceldata[i].STAMPDUTY,
                                    USER_ID: foliodata[j]._doc.USER_ID,
                                },

                            };
                            const option = {
                                upsert: true,
                            };
                            const result = await transk.updateMany(filter, updateDoc, option);

                            console.log(`Updated ${result.n} documents`);
                            transk.find({ TD_TRNO: exceldata[i].TD_TRNO, UNQNO: exceldata[i].UNQNO, NEWUNQNO: exceldata[i].NEWUNQNO, TD_ACNO: exceldata[i].TD_ACNO, FMCODE: exceldata[i].FMCODE, TRFLAG: exceldata[i].TRFLAG }, function (err, data) {
                                //console.log("ddddddd====",data[0]._doc)
                                totaluploaded.push(data[0]._doc)
                                console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                                //console.log("totaluploaded=",totaluploaded)       
                            });
                        } catch (error) {
                            console.log(`Error found. ${error}`)
                        }

                    }
                    console.log("hello")
                }
                if (exceldata.length === i + 1) {

                    resdata = {
                        status: 200,
                        message: 'Data uploaded',
                        data: newclientarray
                    }
                    return resdata;
                } else {
                    resdata = {
                        status: 400,
                        message: 'Data not uploaded',
                    }
                    // return resdata;
                }
            } else {
                // resdata = {
                //     status: 300,
                //     message: 'Uploaded wrong file',
                // }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}

async function uploadtransactioncams(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        for (var i = 0; i < exceldata.length; i++) {
            if (exceldata[i].PAN != undefined && exceldata[i].FOLIO_NO != undefined) {
                exceldata[i].PAN = (exceldata[i].PAN).toUpperCase();
                let foliodata = await folioc.find({ $and: [{ FOLIOCHK: exceldata[i].FOLIO_NO }, { PRODUCT: exceldata[i].PRODCODE }] }, { _id: 0, ACNO: "$FOLIOCHK", PRCODE: "$PRODUCT", USER_ID: "$USER_ID", PAN: "$PAN_NO", NAME: "$INV_NAME" }).exec();

                console.log("datawwwwww=", "i=", i, exceldata[i].INV_NAME, exceldata[i].PAN)
                if (foliodata === null || foliodata[0] === undefined) {
                    console.log("data null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO);
                    newclientarray.push({ AMC_CODE: exceldata[i].AMC_CODE, FOLIO_NO: exceldata[i].FOLIO_NO, PRODCODE: exceldata[i].PRODCODE, SCHEME: exceldata[i].SCHEME, INV_NAME: exceldata[i].INV_NAME, TRXNTYPE: exceldata[i].TRXNTYPE, TRXNNO: exceldata[i].TRXNNO, TRXNMODE: exceldata[i].TRXNMODE, TRXNSTAT: exceldata[i].TRXNSTAT, USERCODE: exceldata[i].USERCODE, USRTRXNO: exceldata[i].USRTRXNO, TRADDATE: exceldata[i].TRADDATE, POSTDATE: exceldata[i].POSTDATE, PURPRICE: exceldata[i].PURPRICE, UNITS: exceldata[i].UNITS, AMOUNT: exceldata[i].AMOUNT, BROKCODE: exceldata[i].BROKCODE, SUBBROK: exceldata[i].SUBBROK, BROKPERC: exceldata[i].BROKPERC, BROKCOMM: exceldata[i].BROKCOMM, ALTFOLIO: exceldata[i].ALTFOLIO, REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"), TIME1: exceldata[i].TIME1, TRXNSUBTYP: exceldata[i].TRXNSUBTYP, APPLICATIO: exceldata[i].APPLICATIO, TRXN_NATUR: exceldata[i].TRXN_NATUR, TAX: exceldata[i].TAX, TOTAL_TAX: exceldata[i].TOTAL_TAX, TE_15H: exceldata[i].TE_15H, MICR_NO: exceldata[i].MICR_NO, REMARKS: exceldata[i].REMARKS, SWFLAG: exceldata[i].SWFLAG, OLD_FOLIO: exceldata[i].OLD_FOLIO, SEQ_NO: exceldata[i].SEQ_NO, REINVEST_F: exceldata[i].REINVEST_F, MULT_BROK: exceldata[i].MULT_BROK, STT: exceldata[i].STT, LOCATION: exceldata[i].LOCATION, SCHEME_TYP: exceldata[i].SCHEME_TYP, TAX_STATUS: exceldata[i].TAX_STATUS, LOAD: exceldata[i].LOAD, SCANREFNO: exceldata[i].SCANREFNO, PAN: exceldata[i].PAN, INV_IIN: exceldata[i].INV_IIN, TARG_SRC_S: exceldata[i].TARG_SRC_S, TRXN_TYPE_: exceldata[i].TRXN_TYPE_, TICOB_TRTY: exceldata[i].TICOB_TRTY, TICOB_TRNO: exceldata[i].TICOB_TRNO, TICOB_POST: exceldata[i].TICOB_POST, DP_ID: exceldata[i].DP_ID, TRXN_CHARG: exceldata[i].TRXN_CHARG, ELIGIB_AMT: exceldata[i].ELIGIB_AMT, SRC_OF_TXN: exceldata[i].SRC_OF_TXN, TRXN_SUFFI: exceldata[i].TRXN_SUFFI, SIPTRXNNO: exceldata[i].SIPTRXNNO, TER_LOCATI: exceldata[i].TER_LOCATI, EUIN: exceldata[i].EUIN, EUIN_VALID: exceldata[i].EUIN_VALID, EUIN_OPTED: exceldata[i].EUIN_OPTED, SUB_BRK_AR: exceldata[i].SUB_BRK_AR, EXCH_DC_FL: exceldata[i].EXCH_DC_FL, SRC_BRK_CO: exceldata[i].SRC_BRK_CO, SYS_REGN_D: exceldata[i].SYS_REGN_D, AC_NO: exceldata[i].AC_NO, BANK_NAME: exceldata[i].BANK_NAME, REVERSAL_C: exceldata[i].REVERSAL_C, EXCHANGE_F: exceldata[i].EXCHANGE_F, CA_INITIAT: exceldata[i].CA_INITIAT, GST_STATE_: exceldata[i].GST_STATE_, IGST_AMOUN: exceldata[i].IGST_AMOUN, CGST_AMOUN: exceldata[i].CGST_AMOUN, SGST_AMOUN: exceldata[i].SGST_AMOUN, REV_REMARK: exceldata[i].REV_REMARK, ORIGINAL_T: exceldata[i].ORIGINAL_T, STAMP_DUTY: exceldata[i].STAMP_DUTY, FOLIO_OLD: exceldata[i].FOLIO_OLD, SCHEME_FOL: exceldata[i].SCHEME_FOL, AMC_REF_NO: exceldata[i].AMC_REF_NO, REQUEST_RE: exceldata[i].REQUEST_RE });
                    resdata = {
                        status: 400,
                        message: 'User not found',
                        data: newclientarray
                    }
                } else {
                    foliodata = foliodata.filter(
                        (temp => a =>
                            (k => !temp[k] && (temp[k] = true))(a.NAME + '|' + a.PAN + '|' + a.USER_ID)
                        )(Object.create(null))
                    );

                    for (var j = 0; j < foliodata.length; j++) {
                        console.log("data=", foliodata[j]._doc.NAME, foliodata[j]._doc.USER_ID, foliodata[j]._doc.ACNO)
                        console.log("data not null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO,)
                        try {
                            const filter = { TRXNNO: exceldata[i].TRXNNO, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"), PRODCODE: exceldata[i].PRODCODE, SEQ_NO: exceldata[i].SEQ_NO };

                            const updateDoc = {
                                $set: {
                                    AMC_CODE: exceldata[i].AMC_CODE,
                                    FOLIO_NO: exceldata[i].FOLIO_NO,
                                    PRODCODE: exceldata[i].PRODCODE,
                                    SCHEME: exceldata[i].SCHEME,
                                    INV_NAME: foliodata[j]._doc.NAME,
                                    TRXNTYPE: exceldata[i].TRXNTYPE,
                                    TRXNNO: exceldata[i].TRXNNO,
                                    TRXNMODE: exceldata[i].TRXNMODE,
                                    TRXNSTAT: exceldata[i].TRXNSTAT,
                                    USERCODE: exceldata[i].USERCODE,
                                    USRTRXNO: exceldata[i].USRTRXNO,
                                    TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"),
                                    POSTDATE: moment(new Date(exceldata[i].POSTDATE)).format("YYYY-MM-DD"),
                                    PURPRICE: Number(exceldata[i].PURPRICE),
                                    UNITS: Number(exceldata[i].UNITS),
                                    AMOUNT: Number(exceldata[i].AMOUNT),
                                    BROKCODE: exceldata[i].BROKCODE,
                                    SUBBROK: exceldata[i].SUBBROK,
                                    BROKPERC: exceldata[i].BROKPERC,
                                    BROKCOMM: exceldata[i].BROKCOMM,
                                    ALTFOLIO: exceldata[i].ALTFOLIO,
                                    REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"),
                                    TIME1: exceldata[i].TIME1,
                                    TRXNSUBTYP: exceldata[i].TRXNSUBTYP,
                                    APPLICATIO: exceldata[i].APPLICATIO,
                                    TRXN_NATUR: exceldata[i].TRXN_NATUR,
                                    TAX: Number(exceldata[i].TAX),
                                    TOTAL_TAX: Number(exceldata[i].TOTAL_TAX),
                                    TE_15H: exceldata[i].TE_15H,
                                    MICR_NO: exceldata[i].MICR_NO,
                                    REMARKS: exceldata[i].REMARKS,
                                    SWFLAG: exceldata[i].SWFLAG,
                                    OLD_FOLIO: exceldata[i].OLD_FOLIO,
                                    SEQ_NO: exceldata[i].SEQ_NO,
                                    REINVEST_F: exceldata[i].REINVEST_F,
                                    MULT_BROK: exceldata[i].MULT_BROK,
                                    STT: Number(exceldata[i].STT),
                                    LOCATION: exceldata[i].LOCATION,
                                    SCHEME_TYP: exceldata[i].SCHEME_TYP,
                                    TAX_STATUS: exceldata[i].TAX_STATUS,
                                    LOAD: Number(exceldata[i].LOAD),
                                    SCANREFNO: exceldata[i].SCANREFNO,
                                    PAN: (exceldata[i].PAN).toUpperCase(),
                                    INV_IIN: exceldata[i].INV_IIN,
                                    TARG_SRC_S: exceldata[i].TARG_SRC_S,
                                    TRXN_TYPE_: exceldata[i].TRXN_TYPE_,
                                    TICOB_TRTY: exceldata[i].TICOB_TRTY,
                                    TICOB_TRNO: exceldata[i].TICOB_TRNO,
                                    TICOB_POST: exceldata[i].TICOB_POST,
                                    DP_ID: exceldata[i].DP_ID,
                                    TRXN_CHARG: Number(exceldata[i].TRXN_CHARG),
                                    ELIGIB_AMT: Number(exceldata[i].ELIGIB_AMT),
                                    SRC_OF_TXN: exceldata[i].SRC_OF_TXN,
                                    TRXN_SUFFI: exceldata[i].TRXN_SUFFI,
                                    SIPTRXNNO: exceldata[i].SIPTRXNNO,
                                    TER_LOCATI: exceldata[i].TER_LOCATI,
                                    EUIN: exceldata[i].EUIN,
                                    EUIN_VALID: exceldata[i].EUIN_VALID,
                                    EUIN_OPTED: exceldata[i].EUIN_OPTED,
                                    SUB_BRK_AR: exceldata[i].SUB_BRK_AR,
                                    EXCH_DC_FL: exceldata[i].EXCH_DC_FL,
                                    SRC_BRK_CO: exceldata[i].SRC_BRK_CO,
                                    SYS_REGN_D: exceldata[i].SYS_REGN_D,
                                    AC_NO: exceldata[i].AC_NO,
                                    BANK_NAME: exceldata[i].BANK_NAME,
                                    REVERSAL_C: exceldata[i].REVERSAL_C,
                                    EXCHANGE_F: exceldata[i].EXCHANGE_F,
                                    CA_INITIAT: exceldata[i].CA_INITIAT,
                                    GST_STATE_: exceldata[i].GST_STATE_,
                                    IGST_AMOUN: Number(exceldata[i].IGST_AMOUN),
                                    CGST_AMOUN: Number(exceldata[i].CGST_AMOUN),
                                    SGST_AMOUN: Number(exceldata[i].SGST_AMOUN),
                                    REV_REMARK: exceldata[i].REV_REMARK,
                                    ORIGINAL_T: exceldata[i].ORIGINAL_T,
                                    STAMP_DUTY: Number(exceldata[i].STAMP_DUTY),
                                    FOLIO_OLD: exceldata[i].FOLIO_OLD,
                                    SCHEME_FOL: exceldata[i].SCHEME_FOL,
                                    AMC_REF_NO: exceldata[i].AMC_REF_NO,
                                    REQUEST_RE: exceldata[i].REQUEST_RE,
                                    USER_ID: foliodata[j]._doc.USER_ID,
                                },

                            };
                            const option = {
                                "upsert": true,
                            };
                            const result = await transc.updateMany(filter, updateDoc, option);

                            console.log(`Updated ${result.n} documents`);
                            transc.find({ TRXNNO: exceldata[i].TRXNNO, PRODCODE: exceldata[i].PRODCODE, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD") }, function (err, data) {
                                //console.log("ddddddd====",data[0]._doc)
                                totaluploaded.push(data[0]._doc)
                                console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                                //console.log("totaluploaded=",totaluploaded)       
                            });
                        } catch (error) {
                            console.log(`Error found. ${error}`)
                        }
                    }
                }

                if (exceldata.length === i + 1) {
                    resdata = {
                        status: 200,
                        message: 'Data uploaded',
                        data: newclientarray
                    }
                    return resdata;
                } else {
                    resdata = {
                        status: 400,
                        message: 'Data not uploaded',
                    }
                    // return resdata;
                }
            } else {
                // resdata = {
                //     status: 300,
                //     message: 'Uploaded wrong file',
                // }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}

async function uploadtransactioncams2a(exceldata) {
    try {
        // return false;
        const totaluploaded = [];
        var newclientarray = [];
        for (var i = 0; i < exceldata.length; i++) {
            if (exceldata[i].PAN != undefined && exceldata[i].FOLIO_NO != undefined) {
                exceldata[i].PAN = (exceldata[i].PAN).toUpperCase();
                let foliodata = await folioc.find({ $and: [{ FOLIOCHK: exceldata[i].FOLIO_NO }, { PRODUCT: exceldata[i].PRODCODE }] }, { _id: 0, ACNO: "$FOLIOCHK", PRCODE: "$PRODUCT", USER_ID: "$USER_ID", PAN: "$PAN_NO", NAME: "$INV_NAME" }).exec();

                console.log("datawwwwww=", "i=", i, exceldata[i].INV_NAME, exceldata[i].PAN)
                if (foliodata === null || foliodata[0] === undefined) {
                    console.log("data null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO);
                    newclientarray.push({ AMC_CODE: exceldata[i].AMC_CODE, FOLIO_NO: exceldata[i].FOLIO_NO, PRODCODE: exceldata[i].PRODCODE, SCHEME: exceldata[i].SCHEME, INV_NAME: exceldata[i].INV_NAME, TRXNTYPE: exceldata[i].TRXNTYPE, TRXNNO: exceldata[i].TRXNNO, TRXNMODE: exceldata[i].TRXNMODE, TRXNSTAT: exceldata[i].TRXNSTAT, USERCODE: exceldata[i].USERCODE, USRTRXNO: exceldata[i].USRTRXNO, TRADDATE: exceldata[i].TRADDATE, POSTDATE: exceldata[i].POSTDATE, PURPRICE: exceldata[i].PURPRICE, UNITS: exceldata[i].UNITS, AMOUNT: exceldata[i].AMOUNT, BROKCODE: exceldata[i].BROKCODE, SUBBROK: exceldata[i].SUBBROK, BROKPERC: exceldata[i].BROKPERC, BROKCOMM: exceldata[i].BROKCOMM, ALTFOLIO: exceldata[i].ALTFOLIO, REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"), TIME1: exceldata[i].TIME1, TRXNSUBTYP: exceldata[i].TRXNSUBTYP, APPLICATIO: exceldata[i].APPLICATIO, TRXN_NATUR: exceldata[i].TRXN_NATUR, TAX: exceldata[i].TAX, TOTAL_TAX: exceldata[i].TOTAL_TAX, TE_15H: exceldata[i].TE_15H, MICR_NO: exceldata[i].MICR_NO, REMARKS: exceldata[i].REMARKS, SWFLAG: exceldata[i].SWFLAG, OLD_FOLIO: exceldata[i].OLD_FOLIO, SEQ_NO: exceldata[i].SEQ_NO, REINVEST_F: exceldata[i].REINVEST_F, MULT_BROK: exceldata[i].MULT_BROK, STT: exceldata[i].STT, LOCATION: exceldata[i].LOCATION, SCHEME_TYP: exceldata[i].SCHEME_TYP, TAX_STATUS: exceldata[i].TAX_STATUS, LOAD: exceldata[i].LOAD, SCANREFNO: exceldata[i].SCANREFNO, PAN: exceldata[i].PAN, INV_IIN: exceldata[i].INV_IIN, TARG_SRC_S: exceldata[i].TARG_SRC_S, TRXN_TYPE_: exceldata[i].TRXN_TYPE_, TICOB_TRTY: exceldata[i].TICOB_TRTY, TICOB_TRNO: exceldata[i].TICOB_TRNO, TICOB_POST: exceldata[i].TICOB_POST, DP_ID: exceldata[i].DP_ID, TRXN_CHARG: exceldata[i].TRXN_CHARG, ELIGIB_AMT: exceldata[i].ELIGIB_AMT, SRC_OF_TXN: exceldata[i].SRC_OF_TXN, TRXN_SUFFI: exceldata[i].TRXN_SUFFI, SIPTRXNNO: exceldata[i].SIPTRXNNO, TER_LOCATI: exceldata[i].TER_LOCATI, EUIN: exceldata[i].EUIN, EUIN_VALID: exceldata[i].EUIN_VALID, EUIN_OPTED: exceldata[i].EUIN_OPTED, SUB_BRK_AR: exceldata[i].SUB_BRK_AR, EXCH_DC_FL: exceldata[i].EXCH_DC_FL, SRC_BRK_CO: exceldata[i].SRC_BRK_CO, SYS_REGN_D: exceldata[i].SYS_REGN_D, AC_NO: exceldata[i].AC_NO, BANK_NAME: exceldata[i].BANK_NAME, REVERSAL_C: exceldata[i].REVERSAL_C, EXCHANGE_F: exceldata[i].EXCHANGE_F, CA_INITIAT: exceldata[i].CA_INITIAT, GST_STATE_: exceldata[i].GST_STATE_, IGST_AMOUN: exceldata[i].IGST_AMOUN, CGST_AMOUN: exceldata[i].CGST_AMOUN, SGST_AMOUN: exceldata[i].SGST_AMOUN, REV_REMARK: exceldata[i].REV_REMARK, ORIGINAL_T: exceldata[i].ORIGINAL_T, STAMP_DUTY: exceldata[i].STAMP_DUTY, FOLIO_OLD: exceldata[i].FOLIO_OLD, SCHEME_FOL: exceldata[i].SCHEME_FOL, AMC_REF_NO: exceldata[i].AMC_REF_NO, REQUEST_RE: exceldata[i].REQUEST_RE });
                    resdata = {
                        status: 400,
                        message: 'User not found',
                        data: newclientarray
                    }
                } else {
                    foliodata = foliodata.filter(
                        (temp => a =>
                            (k => !temp[k] && (temp[k] = true))(a.NAME + '|' + a.PAN + '|' + a.USER_ID)
                        )(Object.create(null))
                    );

                    for (var j = 0; j < foliodata.length; j++) {
                        console.log("data=", foliodata[j]._doc.NAME, foliodata[j]._doc.USER_ID, foliodata[j]._doc.ACNO)
                        console.log("data not null=", exceldata[i].FOLIO_NO, exceldata[i].TRXNNO,)
                        try {
                            const filter = { TRXNNO: exceldata[i].TRXNNO, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"), PRODCODE: exceldata[i].PRODCODE, SEQ_NO: exceldata[i].SEQ_NO };

                            const updateDoc = {
                                $set: {
                                    AMC_CODE: exceldata[i].AMC_CODE,
                                    FOLIO_NO: exceldata[i].FOLIO_NO,
                                    PRODCODE: exceldata[i].PRODCODE,
                                    SCHEME: exceldata[i].SCHEME,
                                    INV_NAME: foliodata[j]._doc.NAME,
                                    TRXNTYPE: exceldata[i].TRXNTYPE,
                                    TRXNNO: exceldata[i].TRXNNO,
                                    TRXNMODE: exceldata[i].TRXNMODE,
                                    TRXNSTAT: exceldata[i].TRXNSTAT,
                                    USERCODE: exceldata[i].USERCODE,
                                    USRTRXNO: exceldata[i].USRTRXNO,
                                    TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD"),
                                    POSTDATE: moment(new Date(exceldata[i].POSTDATE)).format("YYYY-MM-DD"),
                                    PURPRICE: Number(exceldata[i].PURPRICE),
                                    UNITS: Number(exceldata[i].UNITS),
                                    AMOUNT: Number(exceldata[i].AMOUNT),
                                    BROKCODE: exceldata[i].BROKCODE,
                                    SUBBROK: exceldata[i].SUBBROK,
                                    BROKPERC: exceldata[i].BROKPERC,
                                    BROKCOMM: exceldata[i].BROKCOMM,
                                    ALTFOLIO: exceldata[i].ALTFOLIO,
                                    REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"),
                                    TIME1: exceldata[i].TIME1,
                                    TRXNSUBTYP: exceldata[i].TRXNSUBTYP,
                                    APPLICATIO: exceldata[i].APPLICATIO,
                                    TRXN_NATUR: exceldata[i].TRXN_NATUR,
                                    TAX: Number(exceldata[i].TAX),
                                    TOTAL_TAX: Number(exceldata[i].TOTAL_TAX),
                                    TE_15H: exceldata[i].TE_15H,
                                    MICR_NO: exceldata[i].MICR_NO,
                                    REMARKS: exceldata[i].REMARKS,
                                    SWFLAG: exceldata[i].SWFLAG,
                                    OLD_FOLIO: exceldata[i].OLD_FOLIO,
                                    SEQ_NO: exceldata[i].SEQ_NO,
                                    REINVEST_F: exceldata[i].REINVEST_F,
                                    MULT_BROK: exceldata[i].MULT_BROK,
                                    STT: Number(exceldata[i].STT),
                                    LOCATION: exceldata[i].LOCATION,
                                    SCHEME_TYP: exceldata[i].SCHEME_TYP,
                                    TAX_STATUS: exceldata[i].TAX_STATUS,
                                    LOAD: Number(exceldata[i].LOAD),
                                    SCANREFNO: exceldata[i].SCANREFNO,
                                    PAN: (exceldata[i].PAN).toUpperCase(),
                                    INV_IIN: exceldata[i].INV_IIN,
                                    TARG_SRC_S: exceldata[i].TARG_SRC_S,
                                    TRXN_TYPE_: exceldata[i].TRXN_TYPE_,
                                    TICOB_TRTY: exceldata[i].TICOB_TRTY,
                                    TICOB_TRNO: exceldata[i].TICOB_TRNO,
                                    TICOB_POST: exceldata[i].TICOB_POST,
                                    DP_ID: exceldata[i].DP_ID,
                                    TRXN_CHARG: Number(exceldata[i].TRXN_CHARG),
                                    ELIGIB_AMT: Number(exceldata[i].ELIGIB_AMT),
                                    SRC_OF_TXN: exceldata[i].SRC_OF_TXN,
                                    TRXN_SUFFI: exceldata[i].TRXN_SUFFI,
                                    SIPTRXNNO: exceldata[i].SIPTRXNNO,
                                    TER_LOCATI: exceldata[i].TER_LOCATI,
                                    EUIN: exceldata[i].EUIN,
                                    EUIN_VALID: exceldata[i].EUIN_VALID,
                                    EUIN_OPTED: exceldata[i].EUIN_OPTED,
                                    SUB_BRK_AR: exceldata[i].SUB_BRK_AR,
                                    EXCH_DC_FL: exceldata[i].EXCH_DC_FL,
                                    SRC_BRK_CO: exceldata[i].SRC_BRK_CO,
                                    SYS_REGN_D: exceldata[i].SYS_REGN_D,
                                    AC_NO: exceldata[i].AC_NO,
                                    BANK_NAME: exceldata[i].BANK_NAME,
                                    REVERSAL_C: exceldata[i].REVERSAL_C,
                                    EXCHANGE_F: exceldata[i].EXCHANGE_F,
                                    CA_INITIAT: exceldata[i].CA_INITIAT,
                                    GST_STATE_: exceldata[i].GST_STATE_,
                                    IGST_AMOUN: Number(exceldata[i].IGST_AMOUN),
                                    CGST_AMOUN: Number(exceldata[i].CGST_AMOUN),
                                    SGST_AMOUN: Number(exceldata[i].SGST_AMOUN),
                                    REV_REMARK: exceldata[i].REV_REMARK,
                                    ORIGINAL_T: exceldata[i].ORIGINAL_T,
                                    STAMP_DUTY: Number(exceldata[i].STAMP_DUTY),
                                    FOLIO_OLD: exceldata[i].FOLIO_OLD,
                                    SCHEME_FOL: exceldata[i].SCHEME_FOL,
                                    AMC_REF_NO: exceldata[i].AMC_REF_NO,
                                    REQUEST_RE: exceldata[i].REQUEST_RE,
                                    USER_ID: foliodata[j]._doc.USER_ID,
                                },

                            };
                            const option = {
                                "upsert": true,
                            };
                            const result = await transc2A.updateMany(filter, updateDoc, option);

                            console.log(`Updated ${result.n} documents`);
                            transc2A.find({ TRXNNO: exceldata[i].TRXNNO, PRODCODE: exceldata[i].PRODCODE, FOLIO_NO: exceldata[i].FOLIO_NO, TRADDATE: moment(new Date(exceldata[i].TRADDATE)).format("YYYY-MM-DD") }, function (err, data) {
                                totaluploaded.push(data[0]._doc)
                                console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                            });
                        } catch (error) {
                            console.log(`Error found. ${error}`)
                        }
                    }
                }

                if (exceldata.length === i + 1) {
                    resdata = {
                        status: 200,
                        message: 'Data uploaded',
                        data: newclientarray
                    }
                    return resdata;
                } else {
                    resdata = {
                        status: 400,
                        message: 'Data not uploaded',
                    }
                }
            } else {
                // resdata = {
                //     status: 300,
                //     message: 'Uploaded wrong file',
                // }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}


async function uploadfoliocams(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        for (var i = 0; i < exceldata.length; i++) {
            if (exceldata[i].GUARD_PAN != undefined && exceldata[i].PAN_NO != undefined) {
                console.log("guardian=", exceldata[i].GUARD_PAN)
                if (exceldata[i].GUARD_PAN === "") {
                    exceldata[i].PAN_NO = (exceldata[i].PAN_NO).toUpperCase();
                    console.log("ttttttt=", exceldata[i].PAN_NO, exceldata[i].INV_NAME)
                    let userdata = await users.find({ $and: [{ PAN: exceldata[i].PAN_NO }, { NAME: { '$regex': exceldata[i].INV_NAME, '$options': 'i' } }] }, { _id: 0, ADD1: "$ADDRESS1", ADD2: "$ADDRESS2", ADD3: "$ADDRESS3", DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();

                    if (userdata === null || userdata[0] === undefined) {
                        console.log("data null=", exceldata[i].FOLIOCHK, exceldata[i].PAN_NO);
                        newclientarray.push({
                            FOLIOCHK: exceldata[i].FOLIOCHK, INV_NAME: exceldata[i].INV_NAME, ADDRESS1: exceldata[i].ADDRESS1, ADDRESS2: exceldata[i].ADDRESS2, ADDRESS3: exceldata[i].ADDRESS3, CITY: exceldata[i].CITY, PINCODE: exceldata[i].PINCODE, PRODUCT: exceldata[i].PRODUCT, SCH_NAME: exceldata[i].SCH_NAME, REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"), CLOS_BAL: Number(exceldata[i].CLOS_BAL),
                            RUPEE_BAL: Number(exceldata[i].RUPEE_BAL), JNT_NAME1: exceldata[i].JNT_NAME1,
                            JNT_NAME2: exceldata[i].JNT_NAME2, PHONE_OFF: exceldata[i].PHONE_OFF, PHONE_RES: exceldata[i].PHONE_RES, EMAIL: exceldata[i].EMAIL, HOLDING_NA: exceldata[i].HOLDING_NA,
                            UIN_NO: exceldata[i].UIN_NO, PAN_NO: (exceldata[i].PAN_NO).toUpperCase(), JOINT1_PAN: exceldata[i].JOINT1_PAN, JOINT2_PAN: exceldata[i].JOINT2_PAN, GUARD_PAN: exceldata[i].GUARD_PAN, TAX_STATUS: exceldata[i].TAX_STATUS, BROKER_COD: exceldata[i].BROKER_COD,
                            SUBBROKER: exceldata[i].SUBBROKER, REINV_FLAG: exceldata[i].REINV_FLAG, BANK_NAME: exceldata[i].BANK_NAME, BRANCH: exceldata[i].BRANCH, AC_TYPE: exceldata[i].AC_TYPE,
                            AC_NO: exceldata[i].AC_NO, B_ADDRESS1: exceldata[i].B_ADDRESS1, B_ADDRESS2: exceldata[i].B_ADDRESS2, B_ADDRESS3: exceldata[i].B_ADDRESS3, B_CITY: exceldata[i].B_CITY, B_PINCODE: exceldata[i].B_PINCODE, INV_DOB: exceldata[i].INV_DOB, MOBILE_NO: exceldata[i].MOBILE_NO, OCCUPATION: exceldata[i].OCCUPATION, INV_IIN: exceldata[i].INV_IIN,
                            NOM_NAME: exceldata[i].NOM_NAME, RELATION: exceldata[i].RELATION, NOM_ADDR1: exceldata[i].NOM_ADDR1, NOM_ADDR2: exceldata[i].NOM_ADDR2, NOM_ADDR3: exceldata[i].NOM_ADDR3,
                            NOM_CITY: exceldata[i].NOM_CITY, NOM_STATE: exceldata[i].NOM_STATE, NOM_PINCOD: exceldata[i].NOM_PINCOD, NOM_PH_OFF: exceldata[i].NOM_PH_OFF, NOM_PH_RES: exceldata[i].NOM_PH_RES, NOM_EMAIL: exceldata[i].NOM_EMAIL, NOM_PERCEN: exceldata[i].NOM_PERCEN, NOM2_NAME: exceldata[i].NOM2_NAME, NOM2_RELAT: exceldata[i].NOM2_RELAT, NOM2_ADDR1: exceldata[i].NOM2_ADDR1, NOM2_ADDR2: exceldata[i].NOM2_ADDR2, NOM2_ADDR3: exceldata[i].NOM2_ADDR3, NOM2_CITY: exceldata[i].NOM2_CITY, NOM2_STATE: exceldata[i].NOM2_STATE, NOM2_PINCO: exceldata[i].NOM2_PINCO, NOM2_PH_OF: exceldata[i].NOM2_PH_OF, NOM2_PH_RE: exceldata[i].NOM2_PH_RE, NOM2_EMAIL: exceldata[i].NOM2_EMAIL, NOM2_PERCE: exceldata[i].NOM2_PERCE, NOM3_NAME: exceldata[i].NOM3_NAME, NOM3_RELAT: exceldata[i].NOM3_RELAT, NOM3_ADDR1: exceldata[i].NOM3_ADDR1, NOM3_ADDR2: exceldata[i].NOM3_ADDR2, NOM3_ADDR3: exceldata[i].NOM3_ADDR3, NOM3_CITY: exceldata[i].NOM3_CITY, NOM3_STATE: exceldata[i].NOM3_STATE, NOM3_PINCO: exceldata[i].NOM3_PINCO, NOM3_PH_OF: exceldata[i].NOM3_PH_OF, NOM3_PH_RE: exceldata[i].NOM3_PH_RE, NOM3_EMAIL: exceldata[i].NOM3_EMAIL, NOM3_PERCE: exceldata[i].NOM3_PERCE, IFSC_CODE: exceldata[i].IFSC_CODE, DP_ID: exceldata[i].DP_ID, DEMAT: exceldata[i].DEMAT, GUARD_NAME: exceldata[i].GUARD_NAME, BROKCODE: exceldata[i].BROKCODE, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD"), AADHAAR: exceldata[i].AADHAAR, TPA_LINKED: exceldata[i].TPA_LINKED, FH_CKYC_NO: exceldata[i].FH_CKYC_NO, JH1_CKYC: exceldata[i].JH1_CKYC, JH2_CKYC: exceldata[i].JH2_CKYC, G_CKYC_NO: exceldata[i].G_CKYC_NO, JH1_DOB: exceldata[i].JH1_DOB, JH2_DOB: exceldata[i].JH2_DOB, GUARDIAN_D: exceldata[i].GUARDIAN_D, AMC_CODE: exceldata[i].AMC_CODE, GST_STATE_: exceldata[i].GST_STATE_, FOLIO_OLD: exceldata[i].FOLIO_OLD, SCHEME_FOL: exceldata[i].SCHEME_FOL
                        });
                        resdata = {
                            status: 400,
                            message: 'User not found',
                            data: newclientarray
                        }
                    } else {
                        console.log("data not null=", exceldata[i].FOLIOCHK, exceldata[i].AC_NO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO, exceldata[i].PAN_NO)
                        try {
                            const filter = { FOLIOCHK: exceldata[i].FOLIOCHK, AC_NO: exceldata[i].AC_NO, PRODUCT: exceldata[i].PRODUCT, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD") };

                            const updateDoc = {
                                $set: {
                                    FOLIOCHK: exceldata[i].FOLIOCHK,
                                    INV_NAME: userdata[0]._doc.NAME,
                                    ADDRESS1: userdata[0]._doc.ADD1,
                                    ADDRESS2: userdata[0]._doc.ADD2,
                                    ADDRESS3: userdata[0]._doc.ADD3,
                                    CITY: exceldata[i].CITY,
                                    PINCODE: exceldata[i].PINCODE,
                                    PRODUCT: exceldata[i].PRODUCT,
                                    SCH_NAME: exceldata[i].SCH_NAME,
                                    REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"),
                                    CLOS_BAL: Number(exceldata[i].CLOS_BAL),
                                    RUPEE_BAL: Number(exceldata[i].RUPEE_BAL),
                                    JNT_NAME1: exceldata[i].JNT_NAME1,
                                    JNT_NAME2: exceldata[i].JNT_NAME2,
                                    PHONE_OFF: exceldata[i].PHONE_OFF,
                                    PHONE_RES: exceldata[i].PHONE_RES,
                                    EMAIL: exceldata[i].EMAIL,
                                    HOLDING_NA: exceldata[i].HOLDING_NA,
                                    UIN_NO: exceldata[i].UIN_NO,
                                    PAN_NO: (exceldata[i].PAN_NO).toUpperCase(),
                                    JOINT1_PAN: exceldata[i].JOINT1_PAN,
                                    JOINT2_PAN: exceldata[i].JOINT2_PAN,
                                    GUARD_PAN: exceldata[i].GUARD_PAN,
                                    TAX_STATUS: exceldata[i].TAX_STATUS,
                                    BROKER_COD: exceldata[i].BROKER_COD,
                                    SUBBROKER: exceldata[i].SUBBROKER,
                                    REINV_FLAG: exceldata[i].REINV_FLAG,
                                    BANK_NAME: exceldata[i].BANK_NAME,
                                    BRANCH: exceldata[i].BRANCH,
                                    AC_TYPE: exceldata[i].AC_TYPE,
                                    AC_NO: exceldata[i].AC_NO,
                                    B_ADDRESS1: exceldata[i].B_ADDRESS1,
                                    B_ADDRESS2: exceldata[i].B_ADDRESS2,
                                    B_ADDRESS3: exceldata[i].B_ADDRESS3,
                                    B_CITY: exceldata[i].B_CITY,
                                    B_PINCODE: exceldata[i].B_PINCODE,
                                    INV_DOB: exceldata[i].INV_DOB,
                                    MOBILE_NO: exceldata[i].MOBILE_NO,
                                    OCCUPATION: exceldata[i].OCCUPATION,
                                    INV_IIN: exceldata[i].INV_IIN,
                                    NOM_NAME: exceldata[i].NOM_NAME,
                                    RELATION: exceldata[i].RELATION,
                                    NOM_ADDR1: exceldata[i].NOM_ADDR1,
                                    NOM_ADDR2: exceldata[i].NOM_ADDR2,
                                    NOM_ADDR3: exceldata[i].NOM_ADDR3,
                                    NOM_CITY: exceldata[i].NOM_CITY,
                                    NOM_STATE: exceldata[i].NOM_STATE,
                                    NOM_PINCOD: exceldata[i].NOM_PINCOD,
                                    NOM_PH_OFF: exceldata[i].NOM_PH_OFF,
                                    NOM_PH_RES: exceldata[i].NOM_PH_RES,
                                    NOM_EMAIL: exceldata[i].NOM_EMAIL,
                                    NOM_PERCEN: exceldata[i].NOM_PERCEN,
                                    NOM2_NAME: exceldata[i].NOM2_NAME,
                                    NOM2_RELAT: exceldata[i].NOM2_RELAT,
                                    NOM2_ADDR1: exceldata[i].NOM2_ADDR1,
                                    NOM2_ADDR2: exceldata[i].NOM2_ADDR2,
                                    NOM2_ADDR3: exceldata[i].NOM2_ADDR3,
                                    NOM2_CITY: exceldata[i].NOM2_CITY,
                                    NOM2_STATE: exceldata[i].NOM2_STATE,
                                    NOM2_PINCO: exceldata[i].NOM2_PINCO,
                                    NOM2_PH_OF: exceldata[i].NOM2_PH_OF,
                                    NOM2_PH_RE: exceldata[i].NOM2_PH_RE,
                                    NOM2_EMAIL: exceldata[i].NOM2_EMAIL,
                                    NOM2_PERCE: exceldata[i].NOM2_PERCE,
                                    NOM3_NAME: exceldata[i].NOM3_NAME,
                                    NOM3_RELAT: exceldata[i].NOM3_RELAT,
                                    NOM3_ADDR1: exceldata[i].NOM3_ADDR1,
                                    NOM3_ADDR2: exceldata[i].NOM3_ADDR2,
                                    NOM3_ADDR3: exceldata[i].NOM3_ADDR3,
                                    NOM3_CITY: exceldata[i].NOM3_CITY,
                                    NOM3_STATE: exceldata[i].NOM3_STATE,
                                    NOM3_PINCO: exceldata[i].NOM3_PINCO,
                                    NOM3_PH_OF: exceldata[i].NOM3_PH_OF,
                                    NOM3_PH_RE: exceldata[i].NOM3_PH_RE,
                                    NOM3_EMAIL: exceldata[i].NOM3_EMAIL,
                                    NOM3_PERCE: exceldata[i].NOM3_PERCE,
                                    IFSC_CODE: exceldata[i].IFSC_CODE,
                                    DP_ID: exceldata[i].DP_ID,
                                    DEMAT: exceldata[i].DEMAT,
                                    GUARD_NAME: exceldata[i].GUARD_NAME,
                                    BROKCODE: exceldata[i].BROKCODE,
                                    FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD"),
                                    AADHAAR: exceldata[i].AADHAAR,
                                    TPA_LINKED: exceldata[i].TPA_LINKED,
                                    FH_CKYC_NO: exceldata[i].FH_CKYC_NO,
                                    JH1_CKYC: exceldata[i].JH1_CKYC,
                                    JH2_CKYC: exceldata[i].JH2_CKYC,
                                    G_CKYC_NO: exceldata[i].G_CKYC_NO,
                                    JH1_DOB: exceldata[i].JH1_DOB,
                                    JH2_DOB: exceldata[i].JH2_DOB,
                                    GUARDIAN_D: exceldata[i].GUARDIAN_D,
                                    AMC_CODE: exceldata[i].AMC_CODE,
                                    GST_STATE_: exceldata[i].GST_STATE_,
                                    FOLIO_OLD: exceldata[i].FOLIO_OLD,
                                    SCHEME_FOL: exceldata[i].SCHEME_FOL,
                                    USER_ID: userdata[0]._doc.DOCNO,
                                },

                            };
                            const option = {
                                "upsert": true,
                            };
                            const result = await folioc.updateMany(filter, updateDoc, option);

                            console.log(`Updated ${result.n} documents`);
                            folioc.find({ FOLIOCHK: exceldata[i].FOLIOCHK, PRODUCT: exceldata[i].PRODUCT, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD") }, function (err, data) {
                                //console.log("ddddddd====",data[0]._doc)
                                totaluploaded.push(data[0]._doc)
                                console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length)
                                //console.log("totaluploaded=",totaluploaded)       
                            });
                        } catch (error) {
                            console.log(`Error found. ${error}`)
                        }
                    }

                    if (exceldata.length === i + 1) {
                        resdata = {
                            status: 200,
                            message: 'Data uploaded',
                            data: newclientarray
                        }
                        return resdata;
                    } else {
                        resdata = {
                            status: 400,
                            message: 'Data not uploaded',
                        }
                    }
                } else {
                    exceldata[i].GUARD_PAN = (exceldata[i].GUARD_PAN).toUpperCase();
                    console.log("GUARD_PAN=", exceldata[i].GUARD_PAN, exceldata[i].INV_NAME)
                    let userdata = await users.find({ $and: [{ "Guardian Pan": exceldata[i].GUARD_PAN }, { NAME: { '$regex': exceldata[i].INV_NAME, '$options': 'i' } }] }, { _id: 0, ADD1: "$ADDRESS1", ADD2: "$ADDRESS2", ADD3: "$ADDRESS3", DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();

                    if (userdata === null || userdata[0] === undefined) {
                        console.log("GUARD_PAN data null=", exceldata[i].FOLIOCHK, exceldata[i].GUARD_PAN);
                        newclientarray.push({
                            FOLIOCHK: exceldata[i].FOLIOCHK, INV_NAME: exceldata[i].INV_NAME, ADDRESS1: exceldata[i].ADDRESS1, ADDRESS2: exceldata[i].ADDRESS2, ADDRESS3: exceldata[i].ADDRESS3, CITY: exceldata[i].CITY, PINCODE: exceldata[i].PINCODE, PRODUCT: exceldata[i].PRODUCT, SCH_NAME: exceldata[i].SCH_NAME, REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"), CLOS_BAL: Number(exceldata[i].CLOS_BAL),
                            RUPEE_BAL: Number(exceldata[i].RUPEE_BAL), JNT_NAME1: exceldata[i].JNT_NAME1,
                            JNT_NAME2: exceldata[i].JNT_NAME2, PHONE_OFF: exceldata[i].PHONE_OFF, PHONE_RES: exceldata[i].PHONE_RES, EMAIL: exceldata[i].EMAIL, HOLDING_NA: exceldata[i].HOLDING_NA,
                            UIN_NO: exceldata[i].UIN_NO, PAN_NO: (exceldata[i].PAN_NO).toUpperCase(), JOINT1_PAN: exceldata[i].JOINT1_PAN, JOINT2_PAN: exceldata[i].JOINT2_PAN, GUARD_PAN: exceldata[i].GUARD_PAN, TAX_STATUS: exceldata[i].TAX_STATUS, BROKER_COD: exceldata[i].BROKER_COD,
                            SUBBROKER: exceldata[i].SUBBROKER, REINV_FLAG: exceldata[i].REINV_FLAG, BANK_NAME: exceldata[i].BANK_NAME, BRANCH: exceldata[i].BRANCH, AC_TYPE: exceldata[i].AC_TYPE,
                            AC_NO: exceldata[i].AC_NO, B_ADDRESS1: exceldata[i].B_ADDRESS1, B_ADDRESS2: exceldata[i].B_ADDRESS2, B_ADDRESS3: exceldata[i].B_ADDRESS3, B_CITY: exceldata[i].B_CITY, B_PINCODE: exceldata[i].B_PINCODE, INV_DOB: exceldata[i].INV_DOB, MOBILE_NO: exceldata[i].MOBILE_NO, OCCUPATION: exceldata[i].OCCUPATION, INV_IIN: exceldata[i].INV_IIN,
                            NOM_NAME: exceldata[i].NOM_NAME, RELATION: exceldata[i].RELATION, NOM_ADDR1: exceldata[i].NOM_ADDR1, NOM_ADDR2: exceldata[i].NOM_ADDR2, NOM_ADDR3: exceldata[i].NOM_ADDR3,
                            NOM_CITY: exceldata[i].NOM_CITY, NOM_STATE: exceldata[i].NOM_STATE, NOM_PINCOD: exceldata[i].NOM_PINCOD, NOM_PH_OFF: exceldata[i].NOM_PH_OFF, NOM_PH_RES: exceldata[i].NOM_PH_RES, NOM_EMAIL: exceldata[i].NOM_EMAIL, NOM_PERCEN: exceldata[i].NOM_PERCEN, NOM2_NAME: exceldata[i].NOM2_NAME, NOM2_RELAT: exceldata[i].NOM2_RELAT, NOM2_ADDR1: exceldata[i].NOM2_ADDR1, NOM2_ADDR2: exceldata[i].NOM2_ADDR2, NOM2_ADDR3: exceldata[i].NOM2_ADDR3, NOM2_CITY: exceldata[i].NOM2_CITY, NOM2_STATE: exceldata[i].NOM2_STATE, NOM2_PINCO: exceldata[i].NOM2_PINCO, NOM2_PH_OF: exceldata[i].NOM2_PH_OF, NOM2_PH_RE: exceldata[i].NOM2_PH_RE, NOM2_EMAIL: exceldata[i].NOM2_EMAIL, NOM2_PERCE: exceldata[i].NOM2_PERCE, NOM3_NAME: exceldata[i].NOM3_NAME, NOM3_RELAT: exceldata[i].NOM3_RELAT, NOM3_ADDR1: exceldata[i].NOM3_ADDR1, NOM3_ADDR2: exceldata[i].NOM3_ADDR2, NOM3_ADDR3: exceldata[i].NOM3_ADDR3, NOM3_CITY: exceldata[i].NOM3_CITY, NOM3_STATE: exceldata[i].NOM3_STATE, NOM3_PINCO: exceldata[i].NOM3_PINCO, NOM3_PH_OF: exceldata[i].NOM3_PH_OF, NOM3_PH_RE: exceldata[i].NOM3_PH_RE, NOM3_EMAIL: exceldata[i].NOM3_EMAIL, NOM3_PERCE: exceldata[i].NOM3_PERCE, IFSC_CODE: exceldata[i].IFSC_CODE, DP_ID: exceldata[i].DP_ID, DEMAT: exceldata[i].DEMAT, GUARD_NAME: exceldata[i].GUARD_NAME, BROKCODE: exceldata[i].BROKCODE, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD"), AADHAAR: exceldata[i].AADHAAR, TPA_LINKED: exceldata[i].TPA_LINKED, FH_CKYC_NO: exceldata[i].FH_CKYC_NO, JH1_CKYC: exceldata[i].JH1_CKYC, JH2_CKYC: exceldata[i].JH2_CKYC, G_CKYC_NO: exceldata[i].G_CKYC_NO, JH1_DOB: exceldata[i].JH1_DOB, JH2_DOB: exceldata[i].JH2_DOB, GUARDIAN_D: exceldata[i].GUARDIAN_D, AMC_CODE: exceldata[i].AMC_CODE, GST_STATE_: exceldata[i].GST_STATE_, FOLIO_OLD: exceldata[i].FOLIO_OLD, SCHEME_FOL: exceldata[i].SCHEME_FOL
                        });
                        resdata = {
                            status: 400,
                            message: 'User not found',
                            data: newclientarray
                        }
                    } else {
                        console.log("GUARD_PAN data not null=", exceldata[i].FOLIOCHK, exceldata[i].AC_NO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO)
                        try {
                            const filter = { FOLIOCHK: exceldata[i].FOLIOCHK, AC_NO: exceldata[i].AC_NO, PRODUCT: exceldata[i].PRODUCT, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD") };

                            const updateDoc = {
                                $set: {
                                    FOLIOCHK: exceldata[i].FOLIOCHK,
                                    INV_NAME: userdata[0]._doc.NAME,
                                    ADDRESS1: userdata[0]._doc.ADD1,
                                    ADDRESS2: userdata[0]._doc.ADD2,
                                    ADDRESS3: userdata[0]._doc.ADD3,
                                    CITY: exceldata[i].CITY,
                                    PINCODE: exceldata[i].PINCODE,
                                    PRODUCT: exceldata[i].PRODUCT,
                                    SCH_NAME: exceldata[i].SCH_NAME,
                                    REP_DATE: moment(new Date(exceldata[i].REP_DATE)).format("YYYY-MM-DD"),
                                    CLOS_BAL: Number(exceldata[i].CLOS_BAL),
                                    RUPEE_BAL: Number(exceldata[i].RUPEE_BAL),
                                    JNT_NAME1: exceldata[i].JNT_NAME1,
                                    JNT_NAME2: exceldata[i].JNT_NAME2,
                                    PHONE_OFF: exceldata[i].PHONE_OFF,
                                    PHONE_RES: exceldata[i].PHONE_RES,
                                    EMAIL: exceldata[i].EMAIL,
                                    HOLDING_NA: exceldata[i].HOLDING_NA,
                                    UIN_NO: exceldata[i].UIN_NO,
                                    PAN_NO: exceldata[i].PAN_NO,
                                    JOINT1_PAN: exceldata[i].JOINT1_PAN,
                                    JOINT2_PAN: exceldata[i].JOINT2_PAN,
                                    GUARD_PAN: exceldata[i].GUARD_PAN,
                                    TAX_STATUS: exceldata[i].TAX_STATUS,
                                    BROKER_COD: exceldata[i].BROKER_COD,
                                    SUBBROKER: exceldata[i].SUBBROKER,
                                    REINV_FLAG: exceldata[i].REINV_FLAG,
                                    BANK_NAME: exceldata[i].BANK_NAME,
                                    BRANCH: exceldata[i].BRANCH,
                                    AC_TYPE: exceldata[i].AC_TYPE,
                                    AC_NO: exceldata[i].AC_NO,
                                    B_ADDRESS1: exceldata[i].B_ADDRESS1,
                                    B_ADDRESS2: exceldata[i].B_ADDRESS2,
                                    B_ADDRESS3: exceldata[i].B_ADDRESS3,
                                    B_CITY: exceldata[i].B_CITY,
                                    B_PINCODE: exceldata[i].B_PINCODE,
                                    INV_DOB: exceldata[i].INV_DOB,
                                    MOBILE_NO: exceldata[i].MOBILE_NO,
                                    OCCUPATION: exceldata[i].OCCUPATION,
                                    INV_IIN: exceldata[i].INV_IIN,
                                    NOM_NAME: exceldata[i].NOM_NAME,
                                    RELATION: exceldata[i].RELATION,
                                    NOM_ADDR1: exceldata[i].NOM_ADDR1,
                                    NOM_ADDR2: exceldata[i].NOM_ADDR2,
                                    NOM_ADDR3: exceldata[i].NOM_ADDR3,
                                    NOM_CITY: exceldata[i].NOM_CITY,
                                    NOM_STATE: exceldata[i].NOM_STATE,
                                    NOM_PINCOD: exceldata[i].NOM_PINCOD,
                                    NOM_PH_OFF: exceldata[i].NOM_PH_OFF,
                                    NOM_PH_RES: exceldata[i].NOM_PH_RES,
                                    NOM_EMAIL: exceldata[i].NOM_EMAIL,
                                    NOM_PERCEN: exceldata[i].NOM_PERCEN,
                                    NOM2_NAME: exceldata[i].NOM2_NAME,
                                    NOM2_RELAT: exceldata[i].NOM2_RELAT,
                                    NOM2_ADDR1: exceldata[i].NOM2_ADDR1,
                                    NOM2_ADDR2: exceldata[i].NOM2_ADDR2,
                                    NOM2_ADDR3: exceldata[i].NOM2_ADDR3,
                                    NOM2_CITY: exceldata[i].NOM2_CITY,
                                    NOM2_STATE: exceldata[i].NOM2_STATE,
                                    NOM2_PINCO: exceldata[i].NOM2_PINCO,
                                    NOM2_PH_OF: exceldata[i].NOM2_PH_OF,
                                    NOM2_PH_RE: exceldata[i].NOM2_PH_RE,
                                    NOM2_EMAIL: exceldata[i].NOM2_EMAIL,
                                    NOM2_PERCE: exceldata[i].NOM2_PERCE,
                                    NOM3_NAME: exceldata[i].NOM3_NAME,
                                    NOM3_RELAT: exceldata[i].NOM3_RELAT,
                                    NOM3_ADDR1: exceldata[i].NOM3_ADDR1,
                                    NOM3_ADDR2: exceldata[i].NOM3_ADDR2,
                                    NOM3_ADDR3: exceldata[i].NOM3_ADDR3,
                                    NOM3_CITY: exceldata[i].NOM3_CITY,
                                    NOM3_STATE: exceldata[i].NOM3_STATE,
                                    NOM3_PINCO: exceldata[i].NOM3_PINCO,
                                    NOM3_PH_OF: exceldata[i].NOM3_PH_OF,
                                    NOM3_PH_RE: exceldata[i].NOM3_PH_RE,
                                    NOM3_EMAIL: exceldata[i].NOM3_EMAIL,
                                    NOM3_PERCE: exceldata[i].NOM3_PERCE,
                                    IFSC_CODE: exceldata[i].IFSC_CODE,
                                    DP_ID: exceldata[i].DP_ID,
                                    DEMAT: exceldata[i].DEMAT,
                                    GUARD_NAME: exceldata[i].GUARD_NAME,
                                    BROKCODE: exceldata[i].BROKCODE,
                                    FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD"),
                                    AADHAAR: exceldata[i].AADHAAR,
                                    TPA_LINKED: exceldata[i].TPA_LINKED,
                                    FH_CKYC_NO: exceldata[i].FH_CKYC_NO,
                                    JH1_CKYC: exceldata[i].JH1_CKYC,
                                    JH2_CKYC: exceldata[i].JH2_CKYC,
                                    G_CKYC_NO: exceldata[i].G_CKYC_NO,
                                    JH1_DOB: exceldata[i].JH1_DOB,
                                    JH2_DOB: exceldata[i].JH2_DOB,
                                    GUARDIAN_D: exceldata[i].GUARDIAN_D,
                                    AMC_CODE: exceldata[i].AMC_CODE,
                                    GST_STATE_: exceldata[i].GST_STATE_,
                                    FOLIO_OLD: exceldata[i].FOLIO_OLD,
                                    SCHEME_FOL: exceldata[i].SCHEME_FOL,
                                    USER_ID: userdata[0]._doc.DOCNO,
                                },

                            };
                            const option = {
                                "upsert": true,
                            };
                            const result = await folioc.updateMany(filter, updateDoc, option);

                            console.log(`Updated ${result.n} documents`);
                            folioc.find({ FOLIOCHK: exceldata[i].FOLIOCHK, PRODUCT: exceldata[i].PRODUCT, FOLIO_DATE: moment(new Date(exceldata[i].FOLIO_DATE)).format("YYYY-MM-DD") }, function (err, data) {
                                //console.log("ddddddd====",data[0]._doc)
                                totaluploaded.push(data[0]._doc)
                                console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length)
                                //console.log("totaluploaded=",totaluploaded)       
                            });
                        } catch (error) {
                            console.log(`Error found. ${error}`)
                        }
                    }

                    if (exceldata.length === i + 1) {
                        resdata = {
                            status: 200,
                            message: 'Data uploaded',
                            data: newclientarray
                        }
                        return resdata;
                    } else {
                        resdata = {
                            status: 400,
                            message: 'Data not uploaded',
                        }
                        // return resdata;
                    }
                }
            } else {
                // resdata = {
                //     status: 300,
                //     message: 'Uploaded wrong file',
                // }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}

async function uploadfoliokarvy(exceldata) {
    try {
        const totaluploaded = [];
        var newclientarray = [];
        for (var i = 0; i < exceldata.length; i++) {
            if (exceldata[i].GUARDPANNO != undefined && exceldata[i].PANGNO != undefined) {
                if (exceldata[i].GUARDPANNO === "" || exceldata[i].GUARDPANNO === "0") {
                    let userdata = await users.find({ $and: [{ PAN: exceldata[i].PANGNO }, { NAME: { '$regex': exceldata[i].INVNAME, '$options': 'i' } }] }, { _id: 0, ADD1: "$ADDRESS1", ADD2: "$ADDRESS2", ADD3: "$ADDRESS3", DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();

                    console.log("datawwwwww=", exceldata[i].INVNAME, "i=", i)
                    if (userdata === null || userdata[0] === undefined) {
                        console.log("data null=", exceldata[i].ACNO);
                        newclientarray.push({
                            PRCODE: exceldata[i].PRCODE, FUND: exceldata[i].FUND, ACNO: exceldata[i].ACNO, FUNDDESC: exceldata[i].FUNDDESC, INVNAME: exceldata[i].INVNAME, JTNAME1: exceldata[i].JTNAME1, JTNAME2: exceldata[i].JTNAME2, ADD1: exceldata[i].ADD1, ADD2: exceldata[i].ADD2, ADD3: exceldata[i].ADD3, CITY: exceldata[i].CITY, PIN: exceldata[i].PIN, STATE: exceldata[i].STATE, COUNTRY: exceldata[i].COUNTRY, TPIN: exceldata[i].TPIN, DOB: exceldata[i].DOB, FNAME: exceldata[i].FNAME, MNAME: exceldata[i].MNAME, RPHONE: exceldata[i].RPHONE, PH_RES1: exceldata[i].PH_RES1, PH_RES2: exceldata[i].PH_RES2, OPHONE: exceldata[i].OPHONE, PH_OFF1: exceldata[i].PH_OFF1, PH_OFF2: exceldata[i].PH_OFF2, FAX: exceldata[i].FAX, FAX_OFF: exceldata[i].FAX_OFF, STATUS: exceldata[i].STATUS, OCCPN: exceldata[i].OCCPN, EMAIL: exceldata[i].EMAIL, BNKACNO: exceldata[i].BNKACNO, BNAME: exceldata[i].BNAME, BNKACTYPE: exceldata[i].BNKACTYPE, BRANCH: exceldata[i].BRANCH, BADD1: exceldata[i].BADD1, BADD2: exceldata[i].BADD2, BADD3: exceldata[i].BADD3, BCITY: exceldata[i].BCITY, BPHONE: exceldata[i].BPHONE, BSTATE: exceldata[i].BSTATE, BCOUNTRY: exceldata[i].BCOUNTRY, INV_ID: exceldata[i].INV_ID, BROKCODE: exceldata[i].BROKCODE, CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"), CRTIME: exceldata[i].CRTIME, PANGNO: (exceldata[i].PANGNO).toUpperCase(), MOBILE: exceldata[i].MOBILE, DIVOPT: exceldata[i].DIVOPT, OCCP_DESC: exceldata[i].OCCP_DESC, MODEOFHOLD: exceldata[i].MODEOFHOLD, MAPIN: exceldata[i].MAPIN, PAN2: exceldata[i].PAN2, PAN3: exceldata[i].PAN3, IMCATEGORY: exceldata[i].IMCATEGORY, GUARDIANN0: exceldata[i].GUARDIANN0, NOMINEE: exceldata[i].NOMINEE, CLIENTID: exceldata[i].CLIENTID, STATUSDESC: exceldata[i].STATUSDESC, IFSC: exceldata[i].IFSC, NOMINEE2: exceldata[i].NOMINEE2, NOMINEE3: exceldata[i].NOMINEE3, KYC1FLAG: exceldata[i].KYC1FLAG, KYC2FLAG: exceldata[i].KYC2FLAG, KYC3FLAG: exceldata[i].KYC3FLAG, GUARDPANNO: exceldata[i].GUARDPANNO, LASTUPDAT1: moment(new Date(exceldata[i].LASTUPDAT1)).format("YYYY-MM-DD"), NOMINEEREL: exceldata[i].NOMINEEREL, NOMINEE2R2: exceldata[i].NOMINEE2R2, NOMINEE3R3: exceldata[i].NOMINEE3R3, ADRH1INFO: exceldata[i].ADRH1INFO, ADRH2INFO: exceldata[i].ADRH2INFO, ADRH3NFO: exceldata[i].ADRH3NFO, ADRGINFO: exceldata[i].ADRGINFO
                        });
                        resdata = {
                            status: 400,
                            message: 'User not found',
                            data: newclientarray
                        }
                    } else {
                        console.log("data not null=", exceldata[i].ACNO, exceldata[i].BNKACNO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO)
                        try {
                            console.log("data333333=", exceldata[i].INVNAME, exceldata[i].JTNAME1, exceldata[i].ACNO, exceldata[i].PRCODE, exceldata[i].BNKACNO, exceldata[i].PANGNO)
                            const filter = { ACNO: exceldata[i].ACNO, PRCODE: exceldata[i].PRCODE, BNKACNO: exceldata[i].BNKACNO, PANGNO: (exceldata[i].PANGNO).toUpperCase() };
                            const updateDoc = {
                                $set: {
                                    PRCODE: exceldata[i].PRCODE,
                                    FUND: exceldata[i].FUND,
                                    ACNO: exceldata[i].ACNO,
                                    FUNDDESC: exceldata[i].FUNDDESC,
                                    INVNAME: userdata[0]._doc.NAME,
                                    JTNAME1: exceldata[i].JTNAME1,
                                    JTNAME2: exceldata[i].JTNAME2,
                                    ADD1: userdata[0]._doc.ADD1,
                                    ADD2: userdata[0]._doc.ADD2,
                                    ADD3: userdata[0]._doc.ADD3,
                                    CITY: exceldata[i].CITY,
                                    PIN: exceldata[i].PIN,
                                    STATE: exceldata[i].STATE,
                                    COUNTRY: exceldata[i].COUNTRY,
                                    TPIN: exceldata[i].TPIN,
                                    DOB: exceldata[i].DOB,
                                    FNAME: exceldata[i].FNAME,
                                    MNAME: exceldata[i].MNAME,
                                    RPHONE: exceldata[i].RPHONE,
                                    PH_RES1: exceldata[i].PH_RES1,
                                    PH_RES2: exceldata[i].PH_RES2,
                                    OPHONE: exceldata[i].OPHONE,
                                    PH_OFF1: exceldata[i].PH_OFF1,
                                    PH_OFF2: exceldata[i].PH_OFF2,
                                    FAX: exceldata[i].FAX,
                                    FAX_OFF: exceldata[i].FAX_OFF,
                                    STATUS: exceldata[i].STATUS,
                                    OCCPN: exceldata[i].OCCPN,
                                    EMAIL: exceldata[i].EMAIL,
                                    BNKACNO: exceldata[i].BNKACNO,
                                    BNAME: exceldata[i].BNAME,
                                    BNKACTYPE: exceldata[i].BNKACTYPE,
                                    BRANCH: exceldata[i].BRANCH,
                                    BADD1: exceldata[i].BADD1,
                                    BADD2: exceldata[i].BADD2,
                                    BADD3: exceldata[i].BADD3,
                                    BCITY: exceldata[i].BCITY,
                                    BPHONE: exceldata[i].BPHONE,
                                    BSTATE: exceldata[i].BSTATE,
                                    BCOUNTRY: exceldata[i].BCOUNTRY,
                                    INV_ID: exceldata[i].INV_ID,
                                    BROKCODE: exceldata[i].BROKCODE,
                                    CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"),
                                    CRTIME: exceldata[i].CRTIME,
                                    PANGNO: (exceldata[i].PANGNO).toUpperCase(),
                                    MOBILE: exceldata[i].MOBILE,
                                    DIVOPT: exceldata[i].DIVOPT,
                                    OCCP_DESC: exceldata[i].OCCP_DESC,
                                    MODEOFHOLD: exceldata[i].MODEOFHOLD,
                                    MAPIN: exceldata[i].MAPIN,
                                    PAN2: exceldata[i].PAN2,
                                    PAN3: exceldata[i].PAN3,
                                    IMCATEGORY: exceldata[i].IMCATEGORY,
                                    GUARDIANN0: exceldata[i].GUARDIANN0,
                                    NOMINEE: exceldata[i].NOMINEE,
                                    CLIENTID: exceldata[i].CLIENTID,
                                    STATUSDESC: exceldata[i].STATUSDESC,
                                    IFSC: exceldata[i].IFSC,
                                    NOMINEE2: exceldata[i].NOMINEE2,
                                    NOMINEE3: exceldata[i].NOMINEE3,
                                    KYC1FLAG: exceldata[i].KYC1FLAG,
                                    KYC2FLAG: exceldata[i].KYC2FLAG,
                                    KYC3FLAG: exceldata[i].KYC3FLAG,
                                    GUARDPANNO: exceldata[i].GUARDPANNO,
                                    LASTUPDAT0: (exceldata[i].LASTUPDAT0) ? moment(new Date(exceldata[i].LASTUPDAT0)).format("YYYY-MM-DD") : (exceldata[i].LASTUPDAT1) ? moment(new Date(exceldata[i].LASTUPDAT1)).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
                                    NOMINEEREL: exceldata[i].NOMINEEREL,
                                    NOMINEE2R2: exceldata[i].NOMINEE2R2,
                                    NOMINEE3R3: exceldata[i].NOMINEE3R3,
                                    ADRH1INFO: exceldata[i].ADRH1INFO,
                                    ADRH2INFO: exceldata[i].ADRH2INFO,
                                    ADRH3NFO: exceldata[i].ADRH3NFO,
                                    ADRGINFO: exceldata[i].ADRGINFO,
                                    USER_ID: userdata[0]._doc.DOCNO,
                                },
                            };
                            const option = {
                                "upsert": true,
                            };
                            const result = await foliok.updateMany(filter, updateDoc, option);
                            console.log(`Updated ${result.n} documents`);

                            foliok.find({ ACNO: exceldata[i].ACNO, PRCODE: exceldata[i].PRCODE, BNKACNO: exceldata[i].BNKACNO, PANGNO: (exceldata[i].PANGNO).toUpperCase() }, function (err, data) {
                                //    console.log("ddddddd====",data)
                                totaluploaded.push(data[0]._doc)
                                console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                                //console.log("totaluploaded=",totaluploaded)       
                            });
                        } catch (error) {
                            console.log(`Error found. ${error}`)
                        }
                    }

                    if (exceldata.length === i + 1) {
                        resdata = {
                            status: 200,
                            message: 'Data uploaded',
                            data: newclientarray
                        }
                        return resdata;
                    } else {
                        resdata = {
                            status: 400,
                            message: 'Data not uploaded',
                        }
                        // return resdata;
                    }
                } else {
                    let userdata = await users.find({ $and: [{ "Guardian Pan": exceldata[i].GUARDPANNO }, { NAME: { '$regex': exceldata[i].INVNAME, '$options': 'i' } }] }, { _id: 0, ADD1: "$ADDRESS1", ADD2: "$ADDRESS2", ADD3: "$ADDRESS3", DOCNO: "$DOCNO", PAN: "$PAN", NAME: "$NAME" }).exec();

                    console.log(" GUARDPANNO datawwwwww=", exceldata[i].INVNAME, "i=", i)
                    if (userdata === null || userdata[0] === undefined) {
                        console.log("data null=", exceldata[i].ACNO);
                        newclientarray.push({
                            PRCODE: exceldata[i].PRCODE, FUND: exceldata[i].FUND, ACNO: exceldata[i].ACNO, FUNDDESC: exceldata[i].FUNDDESC, INVNAME: exceldata[i].INVNAME, JTNAME1: exceldata[i].JTNAME1, JTNAME2: exceldata[i].JTNAME2, ADD1: exceldata[i].ADD1, ADD2: exceldata[i].ADD2, ADD3: exceldata[i].ADD3, CITY: exceldata[i].CITY, PIN: exceldata[i].PIN, STATE: exceldata[i].STATE, COUNTRY: exceldata[i].COUNTRY, TPIN: exceldata[i].TPIN, DOB: exceldata[i].DOB, FNAME: exceldata[i].FNAME, MNAME: exceldata[i].MNAME, RPHONE: exceldata[i].RPHONE, PH_RES1: exceldata[i].PH_RES1, PH_RES2: exceldata[i].PH_RES2, OPHONE: exceldata[i].OPHONE, PH_OFF1: exceldata[i].PH_OFF1, PH_OFF2: exceldata[i].PH_OFF2, FAX: exceldata[i].FAX, FAX_OFF: exceldata[i].FAX_OFF, STATUS: exceldata[i].STATUS, OCCPN: exceldata[i].OCCPN, EMAIL: exceldata[i].EMAIL, BNKACNO: exceldata[i].BNKACNO, BNAME: exceldata[i].BNAME, BNKACTYPE: exceldata[i].BNKACTYPE, BRANCH: exceldata[i].BRANCH, BADD1: exceldata[i].BADD1, BADD2: exceldata[i].BADD2, BADD3: exceldata[i].BADD3, BCITY: exceldata[i].BCITY, BPHONE: exceldata[i].BPHONE, BSTATE: exceldata[i].BSTATE, BCOUNTRY: exceldata[i].BCOUNTRY, INV_ID: exceldata[i].INV_ID, BROKCODE: exceldata[i].BROKCODE, CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"), CRTIME: exceldata[i].CRTIME, PANGNO: (exceldata[i].PANGNO).toUpperCase(), MOBILE: exceldata[i].MOBILE, DIVOPT: exceldata[i].DIVOPT, OCCP_DESC: exceldata[i].OCCP_DESC, MODEOFHOLD: exceldata[i].MODEOFHOLD, MAPIN: exceldata[i].MAPIN, PAN2: exceldata[i].PAN2, PAN3: exceldata[i].PAN3, IMCATEGORY: exceldata[i].IMCATEGORY, GUARDIANN0: exceldata[i].GUARDIANN0, NOMINEE: exceldata[i].NOMINEE, CLIENTID: exceldata[i].CLIENTID, STATUSDESC: exceldata[i].STATUSDESC, IFSC: exceldata[i].IFSC, NOMINEE2: exceldata[i].NOMINEE2, NOMINEE3: exceldata[i].NOMINEE3, KYC1FLAG: exceldata[i].KYC1FLAG, KYC2FLAG: exceldata[i].KYC2FLAG, KYC3FLAG: exceldata[i].KYC3FLAG, GUARDPANNO: exceldata[i].GUARDPANNO, LASTUPDAT1: moment(new Date(exceldata[i].LASTUPDAT1)).format("YYYY-MM-DD"), NOMINEEREL: exceldata[i].NOMINEEREL, NOMINEE2R2: exceldata[i].NOMINEE2R2, NOMINEE3R3: exceldata[i].NOMINEE3R3, ADRH1INFO: exceldata[i].ADRH1INFO, ADRH2INFO: exceldata[i].ADRH2INFO, ADRH3NFO: exceldata[i].ADRH3NFO, ADRGINFO: exceldata[i].ADRGINFO
                        });
                        resdata = {
                            status: 400,
                            message: 'User not found',
                            data: newclientarray
                        }
                    } else {
                        console.log("GUARDPANNO data not null=", exceldata[i].ACNO, exceldata[i].BNKACNO, userdata[0]._doc.NAME, userdata[0]._doc.DOCNO)
                        try {
                            console.log("data333333=", exceldata[i].INVNAME, exceldata[i].JTNAME1, exceldata[i].ACNO, exceldata[i].PRCODE, exceldata[i].BNKACNO, exceldata[i].PANGNO)
                            const filter = { ACNO: exceldata[i].ACNO, PRCODE: exceldata[i].PRCODE, BNKACNO: exceldata[i].BNKACNO, PANGNO: (exceldata[i].PANGNO).toUpperCase() };
                            const updateDoc = {
                                $set: {
                                    PRCODE: exceldata[i].PRCODE,
                                    FUND: exceldata[i].FUND,
                                    ACNO: exceldata[i].ACNO,
                                    FUNDDESC: exceldata[i].FUNDDESC,
                                    INVNAME: userdata[0]._doc.NAME,
                                    JTNAME1: exceldata[i].JTNAME1,
                                    JTNAME2: exceldata[i].JTNAME2,
                                    ADD1: userdata[0]._doc.ADD1,
                                    ADD2: userdata[0]._doc.ADD2,
                                    ADD3: userdata[0]._doc.ADD3,
                                    CITY: exceldata[i].CITY,
                                    PIN: exceldata[i].PIN,
                                    STATE: exceldata[i].STATE,
                                    COUNTRY: exceldata[i].COUNTRY,
                                    TPIN: exceldata[i].TPIN,
                                    DOB: exceldata[i].DOB,
                                    FNAME: exceldata[i].FNAME,
                                    MNAME: exceldata[i].MNAME,
                                    RPHONE: exceldata[i].RPHONE,
                                    PH_RES1: exceldata[i].PH_RES1,
                                    PH_RES2: exceldata[i].PH_RES2,
                                    OPHONE: exceldata[i].OPHONE,
                                    PH_OFF1: exceldata[i].PH_OFF1,
                                    PH_OFF2: exceldata[i].PH_OFF2,
                                    FAX: exceldata[i].FAX,
                                    FAX_OFF: exceldata[i].FAX_OFF,
                                    STATUS: exceldata[i].STATUS,
                                    OCCPN: exceldata[i].OCCPN,
                                    EMAIL: exceldata[i].EMAIL,
                                    BNKACNO: exceldata[i].BNKACNO,
                                    BNAME: exceldata[i].BNAME,
                                    BNKACTYPE: exceldata[i].BNKACTYPE,
                                    BRANCH: exceldata[i].BRANCH,
                                    BADD1: exceldata[i].BADD1,
                                    BADD2: exceldata[i].BADD2,
                                    BADD3: exceldata[i].BADD3,
                                    BCITY: exceldata[i].BCITY,
                                    BPHONE: exceldata[i].BPHONE,
                                    BSTATE: exceldata[i].BSTATE,
                                    BCOUNTRY: exceldata[i].BCOUNTRY,
                                    INV_ID: exceldata[i].INV_ID,
                                    BROKCODE: exceldata[i].BROKCODE,
                                    CRDATE: moment(new Date(exceldata[i].CRDATE)).format("YYYY-MM-DD"),
                                    CRTIME: exceldata[i].CRTIME,
                                    PANGNO: exceldata[i].PANGNO,
                                    MOBILE: exceldata[i].MOBILE,
                                    DIVOPT: exceldata[i].DIVOPT,
                                    OCCP_DESC: exceldata[i].OCCP_DESC,
                                    MODEOFHOLD: exceldata[i].MODEOFHOLD,
                                    MAPIN: exceldata[i].MAPIN,
                                    PAN2: exceldata[i].PAN2,
                                    PAN3: exceldata[i].PAN3,
                                    IMCATEGORY: exceldata[i].IMCATEGORY,
                                    GUARDIANN0: exceldata[i].GUARDIANN0,
                                    NOMINEE: exceldata[i].NOMINEE,
                                    CLIENTID: exceldata[i].CLIENTID,
                                    STATUSDESC: exceldata[i].STATUSDESC,
                                    IFSC: exceldata[i].IFSC,
                                    NOMINEE2: exceldata[i].NOMINEE2,
                                    NOMINEE3: exceldata[i].NOMINEE3,
                                    KYC1FLAG: exceldata[i].KYC1FLAG,
                                    KYC2FLAG: exceldata[i].KYC2FLAG,
                                    KYC3FLAG: exceldata[i].KYC3FLAG,
                                    GUARDPANNO: exceldata[i].GUARDPANNO,
                                    LASTUPDAT0: (exceldata[i].LASTUPDAT0) ? moment(new Date(exceldata[i].LASTUPDAT0)).format("YYYY-MM-DD") : (exceldata[i].LASTUPDAT1) ? moment(new Date(exceldata[i].LASTUPDAT1)).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
                                    NOMINEEREL: exceldata[i].NOMINEEREL,
                                    NOMINEE2R2: exceldata[i].NOMINEE2R2,
                                    NOMINEE3R3: exceldata[i].NOMINEE3R3,
                                    ADRH1INFO: exceldata[i].ADRH1INFO,
                                    ADRH2INFO: exceldata[i].ADRH2INFO,
                                    ADRH3NFO: exceldata[i].ADRH3NFO,
                                    ADRGINFO: exceldata[i].ADRGINFO,
                                    USER_ID: userdata[0]._doc.DOCNO,
                                },
                            };
                            const option = {
                                "upsert": true,
                            };
                            const result = await foliok.updateMany(filter, updateDoc, option);
                            console.log(`Updated ${result.n} documents`);

                            foliok.find({ ACNO: exceldata[i].ACNO, PRCODE: exceldata[i].PRCODE, BNKACNO: exceldata[i].BNKACNO, PANGNO: (exceldata[i].PANGNO).toUpperCase() }, function (err, data) {
                                //    console.log("ddddddd====",data)
                                totaluploaded.push(data[0]._doc)
                                console.log("i=", i, "totaluploaded.length=", totaluploaded.length, "exceldata=", exceldata.length, "newclient=", newclientarray.length)
                                //console.log("totaluploaded=",totaluploaded)       
                            });
                        } catch (error) {
                            console.log(`Error found. ${error}`)
                        }
                    }

                    if (exceldata.length === i + 1) {
                        resdata = {
                            status: 200,
                            message: 'Data uploaded',
                            data: newclientarray
                        }
                        return resdata;
                    } else {
                        resdata = {
                            status: 400,
                            message: 'Data not uploaded',
                        }
                        // return resdata;
                    }
                }
            } else {
                // resdata = {
                //     status: 300,
                //     message: 'Uploaded wrong file',
                // }
                // return resdata;
            }
        }
    } catch (error) {
        console.log(`Error found. ${error}`)
    }
}

module.exports = { uploadtransactionkarvy, uploadtransactioncams, uploadtransactioncams2a, uploadfoliocams, uploadfoliokarvy }