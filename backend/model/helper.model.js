var _ = require('underscore');
const moment = require('moment');
const Axios = require("axios");
var xml2js = require('xml2js');
var convert = require('xml-js');
var { transc, transk, foliok, folioc } = require('../schema/model.schema');
const { isRegisteredFormat } = require('archiver');


async function helper_getfoliodetail(amcval, folioval, prcodeval, rta) {
    try {
        var datacon = ""; var unit = 0; var pcode = "";
        var balance = 0; var scheme = "";
        var dataarr = []; var folio = ""; var amc = "";
        if (rta === "CAMS") {

            var data1 = transc.aggregate([
                { $match: { FOLIO_NO: folioval, AMC_CODE: amcval, PRODCODE: prcodeval } },
                { $group: { _id: { PRODCODE: "$PRODCODE", SCHEME: "$SCHEME", AMC_CODE: "$AMC_CODE", FOLIO_NO: "$FOLIO_NO", TRXN_TYPE_: "$TRXN_TYPE_" }, UNITS: { $sum: "$UNITS" } } },
                { $project: { _id: 0, PCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", AMC: "$_id.AMC_CODE", FOLIO: "$_id.FOLIO_NO", NATURE: "$_id.TRXN_TYPE_", UNITS: { $sum: "$UNITS" } } },
            ]);
            datacon = await data1.exec();
        } else {
            var data2 = transk.aggregate([
                { $match: { TD_ACNO: folioval, TD_FUND: amcval, FMCODE: prcodeval } },
                { $group: { _id: { FMCODE: "$FMCODE", FUNDDESC: "$FUNDDESC", TD_FUND: "$TD_FUND", TD_ACNO: "$TD_ACNO", TD_TRTYPE: "$TD_TRTYPE" }, TD_UNITS: { $sum: "$TD_UNITS" } } },
                { $project: { _id: 0, PCODE: "$_id.FMCODE", SCHEME: "$_id.FUNDDESC", AMC: "$_id.TD_FUND", FOLIO: "$_id.TD_ACNO", NATURE: "$_id.TD_TRTYPE", UNITS: { $sum: "$TD_UNITS" } } },
            ]);
            datacon = await data2.exec();
        }

        if (datacon != 0) {
            resdata = {
                status: 200,
                message: "Successfull",
                data: datacon
            };
            datacon = datacon
                .map(JSON.stringify)
                .reverse() // convert to JSON string the array content, then reverse it (to check from end to begining)
                .filter(function (item, index, arr) {
                    return arr.indexOf(item, index + 1) === -1;
                }) // check if there is any occurence of the item in whole array
                .reverse()
                .map(JSON.parse);
            datacon = Array.from(new Set(datacon));
            for (var i = 0; i < datacon.length; i++) {
                if (datacon[i]['NATURE'] === "RED" || datacon[i]['NATURE'] === "LTOP" || datacon[i]['NATURE'] === "Lateral Shift Out" ||
                    datacon[i]['NATURE'] === "Switch Out" || datacon[i]['NATURE'] === "IPOR" || datacon[i]['NATURE'] === "LTOF" ||
                    datacon[i]['NATURE'] === "FUL" || datacon[i]['NATURE'] === "STPO" || datacon[i]['NATURE'] === "CNO" ||
                    datacon[i]['NATURE'] === "FULR" || datacon[i]['NATURE'] === "Full Redemption" || datacon[i]['NATURE'] === "Partial Switch Out"
                    || datacon[i]['NATURE'] === "Full Switch Out" || datacon[i]['NATURE'] === "Partial Redemption"
                    || datacon[i]['NATURE'] === "SWD" || datacon[i]['NATURE'] === "SWOF" || datacon[i]['NATURE'] === "TOCOB") {
                    unit = "-" + datacon[i].UNITS;
                } else {
                    unit = datacon[i].UNITS;
                }

                balance = parseFloat(unit) + parseFloat(balance);
                folio = datacon[i].FOLIO;
                amc = datacon[i].AMC;
                scheme = datacon[i].SCHEME;
                pcode = datacon[i].PCODE;
            }

            if (balance.isNaN || balance < 0) {
                balance = 0;
            }
            dataarr.push({ UNITS: parseFloat(balance.toFixed(3)), FOLIO: folio, AMC: amc, SCHEME: scheme, PCODE: pcode })
            return dataarr;
        } else {
            resdata = {
                status: 400,
                message: "Data not found"
            };
            return resdata;
        }
    } catch (err) {
        console.log(err)
    }
}

async function helper_getAmcFolioViaProfile(investor_pan, guard_pan, jh1_pan, jh2_pan) {
    try {
        var resdata = "";
        if (investor_pan != undefined && guard_pan != undefined && jh1_pan != undefined && jh2_pan != undefined) {
            var newdata = [];
            var regex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
            if (investor_pan === "") {
                if (guard_pan != "") {
                    var data1 = folioc.aggregate([
                        { $match: { $and: [{ GUARD_PAN: guard_pan }, { SCH_NAME: { $not: /Direct/ } }, { SCH_NAME: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$AMC_CODE", folio: "$FOLIOCHK", prcode: "$PRODUCT", rta: "CAMS", scheme: "$SCH_NAME" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata1 = await data1.exec();
                    var data2 = foliok.aggregate([
                        { $match: { $and: [{ GUARDPANNO: guard_pan }, { FUNDDESC: { $not: /Direct/ } }, { FUNDDESC: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$FUND", folio: "$ACNO", prcode: "$PRCODE", rta: "KARVY", scheme: "$FUNDDESC" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata2 = await data2.exec();
                    if (newdata1 != 0 || newdata2 != 0) {
                        var datacon = newdata1.concat(newdata2);
                        datacon = datacon.filter(
                            (temp => a =>
                                (k => !temp[k] && (temp[k] = true))(a.folio + '|' + a.amc + '|' + a.prcode)
                            )(Object.create(null))
                        );
                        datacon = datacon.sort((a, b) => (a.scheme > b.scheme) ? 1 : -1);
                        return datacon;
                    } else {
                        resdata = {
                            status: 400,
                            message: "Data not found"
                        }
                        return resdata;
                    }
                } else {
                    resdata = {
                        status: 400,
                        message: "Data not found"
                    }
                    return resdata;
                }
            } else if (!regex.test(investor_pan)) {
                resdata = {
                    status: 400,
                    message: 'Please enter valid pan',
                }
                return resdata;
            } else {
                if (jh2_pan != "") {
                    var data1 = folioc.aggregate([
                        { $match: { $and: [{ PAN_NO: investor_pan }, { JOINT1_PAN: jh1_pan }, { JOINT2_PAN: jh2_pan }, { SCH_NAME: { $not: /Direct/ } }, { SCH_NAME: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$AMC_CODE", folio: "$FOLIOCHK", prcode: "$PRODUCT", rta: "CAMS", scheme: "$SCH_NAME" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata1 = await data1.exec();
                    var data2 = foliok.aggregate([
                        { $match: { $and: [{ PANGNO: investor_pan }, { PAN2: jh1_pan }, { PAN3: jh2_pan }, { FUNDDESC: { $not: /Direct/ } }, { FUNDDESC: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$FUND", folio: "$ACNO", prcode: "$PRCODE", rta: "KARVY", scheme: "$FUNDDESC" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata2 = await data2.exec();
                    if (newdata2.length != 0 || newdata1.length != 0) {
                        var datacon = newdata1.concat(newdata2);
                        datacon = datacon.filter(
                            (temp => a =>
                                (k => !temp[k] && (temp[k] = true))(a.folio + '|' + a.amc + '|' + a.prcode)
                            )(Object.create(null))
                        );
                        datacon = datacon.sort((a, b) => (a.scheme > b.scheme) ? 1 : -1);
                        return datacon;
                    } else {
                        resdata = {
                            status: 400,
                            message: "Data not found"
                        }
                        return resdata;
                    }

                } else if (jh1_pan != "") {
                    var data1 = folioc.aggregate([
                        { $match: { $and: [{ PAN_NO: investor_pan }, { JOINT1_PAN: jh1_pan }, { JOINT2_PAN: "" }, { SCH_NAME: { $not: /Direct/ } }, { SCH_NAME: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$AMC_CODE", folio: "$FOLIOCHK", prcode: "$PRODUCT", rta: "CAMS", scheme: "$SCH_NAME" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata1 = await data1.exec();
                    var data2 = foliok.aggregate([
                        { $match: { $and: [{ PANGNO: investor_pan }, { PAN2: jh1_pan }, { PAN3: "" }, { FUNDDESC: { $not: /Direct/ } }, { FUNDDESC: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$FUND", folio: "$ACNO", prcode: "$PRCODE", rta: "KARVY", scheme: "$FUNDDESC" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata2 = await data2.exec();
                    if (newdata2.length != 0 || newdata1.length != 0) {
                        var datacon = newdata1.concat(newdata2);
                        datacon = datacon.filter(
                            (temp => a =>
                                (k => !temp[k] && (temp[k] = true))(a.folio + '|' + a.amc + '|' + a.prcode)
                            )(Object.create(null))
                        );
                        datacon = datacon.sort((a, b) => (a.scheme > b.scheme) ? 1 : -1);
                        return datacon;
                    } else {
                        resdata = {
                            status: 400,
                            message: "Data not found"
                        }
                        return resdata;
                    }
                } else {
                    var data1 = folioc.aggregate([
                        { $match: { $and: [{ PAN_NO: investor_pan }, { JOINT1_PAN: "" }, { JOINT2_PAN: "" }, { SCH_NAME: { $not: /Direct/ } }, { SCH_NAME: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$AMC_CODE", folio: "$FOLIOCHK", prcode: "$PRODUCT", rta: "CAMS", scheme: "$SCH_NAME" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata1 = await data1.exec();
                    var data2 = foliok.aggregate([
                        { $match: { $and: [{ PANGNO: investor_pan }, { PAN2: "" }, { PAN3: "" }, { FUNDDESC: { $not: /Direct/ } }, { FUNDDESC: { $not: /DIRECT/ } }] } },
                        { $project: { _id: 0, amc: "$FUND", folio: "$ACNO", prcode: "$PRCODE", rta: "KARVY", scheme: "$FUNDDESC" } },
                        { $sort: { scheme: 1 } }
                    ]);
                    const newdata2 = await data2.exec();
                    if (newdata2.length != 0 || newdata1.length != 0) {
                        var datacon = newdata1.concat(newdata2);
                        datacon = datacon.filter(
                            (temp => a =>
                                (k => !temp[k] && (temp[k] = true))(a.folio + '|' + a.amc + '|' + a.prcode)
                            )(Object.create(null))
                        );
                        datacon = datacon.sort((a, b) => (a.scheme > b.scheme) ? 1 : -1);
                        return datacon;
                    } else {
                        resdata = {
                            status: 400,
                            message: "Data not found"
                        }
                        return resdata;
                    }
                }
            }
        } else {
            resdata = {
                status: 400,
                message: "Key not found"
            }
            return resdata;
        }
    } catch (err) {
        console.log(err)
    }
}

async function mergethreefunction(investor_pan, guard_pan, jh1_pan, jh2_pan) {
    try {
        var secondarraay = []; var responsearray = [];
        var firstfunction = await helper_getAmcFolioViaProfile(investor_pan, guard_pan, jh1_pan, jh2_pan);
        for (var i = 0; i < firstfunction.length; i++) {
            var secondfunction = await helper_getfoliodetail(firstfunction[i].amc, firstfunction[i].folio, firstfunction[i].prcode, firstfunction[i].rta);
            if (secondfunction[0] != undefined) {
                secondarraay.push(secondfunction[0]);
            }
        }
        for (var k = 0; k < secondarraay.length; k++) {
            if (secondarraay[k].UNITS > 0.005) {
                responsearray.push({ unit: secondarraay[k].UNITS, folio: secondarraay[k].FOLIO, amc_code: secondarraay[k].AMC, scheme: secondarraay[k].SCHEME, pcode: secondarraay[k].PCODE })
            }
        }
        if (k === secondarraay.length) {
            return responsearray;
        }
    } catch (err) {
        console.log(err)
    }
}

async function getschemelist(folio,accetclass,divsw,rta) {
    try {
        var datacon=[];
        var products = [];
        if(rta === "CAMS"){
            var data1 = transc.aggregate([
                { $match: { FOLIO_NO: folio } },
                { $group: { _id: { AMC_CODE: "$AMC_CODE", PRODCODE: "$PRODCODE", code: { $substr: ["$PRODCODE", { $strLenCP: "$AMC_CODE" }, -1] } } } },
                {
                    $lookup:
                    {
                        from: "products",
                        let: { ccc: "$_id.code", amc: "$_id.AMC_CODE" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$PRODUCT_CODE", "$$ccc"] },
                                                { $eq: ["$AMC_CODE", "$$amc"] }
                                            ]
                                    }
                                }
                            },
                            { $project: { _id: 0 } }
                        ],
                        as: "products"
                    }
                },
                { $unwind: "$products" },
                { $project: { _id: 0, products: "$products" } },
            ]);
            datacon = await data1.exec();
        }else{
            var data2 = transk.aggregate([
                { $match: { TD_ACNO: folio, SCHEMEISIN: { $ne: null } } },
                { $group: { _id: { SCHEMEISIN: "$SCHEMEISIN" } } },
                { $lookup: { from: 'products', localField: '_id.SCHEMEISIN', foreignField: 'ISIN', as: 'master' } },
                { $unwind: "$master" },
                { $project: { _id: 0, products: "$master" } },
            ]);
            datacon = await data2.exec();
        }
        datacon = datacon.sort((a, b) => (a.products.PRODUCT_LONG_NAME > b.products.PRODUCT_LONG_NAME) ? 1 : -1);
        console.log("ooooo=",datacon)
        
        if (accetclass === "" && divsw === "") {
            for (var i = 0; i < datacon.length; i++) {
                products.push(datacon[i]);
            }
            
         //   console.log("product111s=",products)
            return products;
        } else if (accetclass != "" && divsw === "") {
            for (var i = 0; i < datacon.length; i++) {
                var type = datacon[i].products.ASSET_CLASS;
                datacon[i].products.ASSET_CLASS = (datacon[i].products.ASSET_CLASS).toLowerCase();
                if (datacon[i].products.ASSET_CLASS === 'debt' || datacon[i].products.ASSET_CLASS === 'income' || datacon[i].products.ASSET_CLASS === 'cash') {
                    datacon[i].products.ASSET_CLASS = 'debt';
                } else {
                    datacon[i].products.ASSET_CLASS = 'equity';
                }
                if (datacon[i].products.ASSET_CLASS === accetclass) {
                    datacon[i].products.ASSET_CLASS = type;
                    products.push(datacon[i]);
                }
                if (i + 1 === datacon.length) {
                    return products;
                }
            }
        } else if (accetclass === "" && divsw != "") {
            for (var i = 0; i < datacon.length; i++) {
                var scheme = datacon[i].products.PRODUCT_LONG_NAME;
                datacon[i].products.PRODUCT_LONG_NAME = (datacon[i].products.PRODUCT_LONG_NAME).toLowerCase();
                if (datacon[i].products.PRODUCT_LONG_NAME.search(divsw) > 0) {
                    datacon[i].products.PRODUCT_LONG_NAME = scheme;
                    products.push(datacon[i]);
                }
                if (i + 1 === datacon.length) {
                    return products;
                }
            }
        } else {
            for (var i = 0; i < datacon.length; i++) {
                var scheme = datacon[i].products.PRODUCT_LONG_NAME;
                var type = datacon[i].products.ASSET_CLASS;
                console.log("line 8263=", datacon[i].products.PRODUCT_LONG_NAME.toLowerCase())
                datacon[i].products.ASSET_CLASS = (datacon[i].products.ASSET_CLASS).toLowerCase();
                datacon[i].products.PRODUCT_LONG_NAME = (datacon[i].products.PRODUCT_LONG_NAME).toLowerCase();

                if (datacon[i].products.ASSET_CLASS === 'debt' || datacon[i].products.ASSET_CLASS === 'income' || datacon[i].products.ASSET_CLASS === 'cash') {
                    datacon[i].products.ASSET_CLASS = 'debt';
                } else {
                    datacon[i].products.ASSET_CLASS = 'equity';
                }
                if (datacon[i].products.PRODUCT_LONG_NAME.search(divsw) > 0 && datacon[i].products.ASSET_CLASS === accetclass) {
                    datacon[i].products.ASSET_CLASS = type;
                    datacon[i].products.PRODUCT_LONG_NAME = scheme;
                    products.push(datacon[i]);
                }
                console.log("line 8260=", i, datacon.length)
                if (i + 1 === datacon.length) {
                    return products;
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = { mergethreefunction, getschemelist }


//not used
// async function helper_getschemelist(amc,dataisin) {
//     try {
//         var products = [];
//         Axios.get('https://nsenmf.com/NMFIIService/NMFService/product?BrokerCode=ARN-21399&Appln_Id=MFS21399&Password=CO3062WOJ1RPXM19&amccode='+amc).then(function (result) {
//             let result1 = convert.xml2js(result.data, { compact: true, spaces: 4 });

//             let status = result1.DataSet['diffgr:diffgram'].NewDataSet.service_status.service_return_code._text;

//             let fatcaresult2 = result1.DataSet['diffgr:diffgram'].NewDataSet.product_master;
//             for (var i = 0; i < fatcaresult2.length; i++) {
//                 if (dataisin === "" || dataisin === undefined) {
//                     if (fatcaresult2[i].PRODUCT_CODE._text === newdatapcode) {
//                         products.push({
//                             AMC_CODE: fatcaresult2[i].AMC_CODE._text, PRODUCT_CODE: fatcaresult2[i].PRODUCT_CODE._text,
//                             PRODUCT_LONG_NAME: fatcaresult2[i].PRODUCT_LONG_NAME._text,
//                             SYSTEMATIC_FREQUENCIES: fatcaresult2[i].SYSTEMATIC_FREQUENCIES._text,
//                             SIP_DATES: fatcaresult2[i].SIP_DATES._text,
//                             STP_DATES: fatcaresult2[i].STP_DATES._text,
//                             SWP_DATES: fatcaresult2[i].SWP_DATES._text,
//                             PURCHASE_ALLOWED: fatcaresult2[i].PURCHASE_ALLOWED._text,
//                             SWITCH_ALLOWED: fatcaresult2[i].SWITCH_ALLOWED._text,
//                             REDEMPTION_ALLOWED: fatcaresult2[i].REDEMPTION_ALLOWED._text,
//                             SIP_ALLOWED: fatcaresult2[i].SIP_ALLOWED._text,
//                             STP_ALLOWED: fatcaresult2[i].STP_ALLOWED._text,
//                             SWP_ALLOWED: fatcaresult2[i].SWP_ALLOWED._text,
//                             REINVEST_TAG: fatcaresult2[i].REINVEST_TAG._text,
//                             ISIN: fatcaresult2[i].ISIN._text,
//                             ASSET_CLASS: fatcaresult2[i].ASSET_CLASS._text,
//                             PLAN_TYPE: fatcaresult2[i].PLAN_TYPE._text
//                         })
//                     }
//                 } else {
//                     if (fatcaresult2[i].ISIN._text === dataisin) {
//                         products.push({
//                             AMC_CODE: fatcaresult2[i].AMC_CODE._text, PRODUCT_CODE: fatcaresult2[i].PRODUCT_CODE._text, PRODUCT_LONG_NAME: fatcaresult2[i].PRODUCT_LONG_NAME._text, SYSTEMATIC_FREQUENCIES: fatcaresult2[i].SYSTEMATIC_FREQUENCIES._text,
//                             SIP_DATES: fatcaresult2[i].SIP_DATES._text,
//                             STP_DATES: fatcaresult2[i].STP_DATES._text,
//                             SWP_DATES: fatcaresult2[i].SWP_DATES._text,
//                             PURCHASE_ALLOWED: fatcaresult2[i].PURCHASE_ALLOWED._text, SWITCH_ALLOWED: fatcaresult2[i].SWITCH_ALLOWED._text,
//                             REDEMPTION_ALLOWED: fatcaresult2[i].REDEMPTION_ALLOWED._text,
//                             SIP_ALLOWED: fatcaresult2[i].SIP_ALLOWED._text,
//                             STP_ALLOWED: fatcaresult2[i].STP_ALLOWED._text,
//                             SWP_ALLOWED: fatcaresult2[i].SWP_ALLOWED._text,
//                             REINVEST_TAG: fatcaresult2[i].REINVEST_TAG._text,
//                             ISIN: fatcaresult2[i].ISIN._text,
//                             ASSET_CLASS: fatcaresult2[i].ASSET_CLASS._text,
//                             PLAN_TYPE: fatcaresult2[i].PLAN_TYPE._text
//                         })
//                     }
//                 }
//             }
//               console.log("products=",products)
//             //resdata.data = [{ products }];
//             return products;
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }

// async function getschemelist(folioval, rta) {
//     try {
//         if (rta === "CAMS") {
//             var data1 = transc.aggregate([
//                 { $match: { FOLIO_NO: folioval } },
//                 { $project: { _id: 0, PCODE: "$PRODCODE", AMC: "$AMC_CODE", ISIN: "" } },
//             ]);
//             datacon = await data1.exec();
//         } else {
//             var data2 = transk.aggregate([
//                 { $match: { TD_ACNO: folioval } },
//                 { $project: { _id: 0, PCODE: "$FMCODE", AMC: "$TD_FUND", ISIN: "$SCHEMEISIN" } },
//             ]);
//             datacon = await data2.exec();
//         }
//         if (datacon != 0) {
//             resdata = {
//                 status: 200,
//                 message: "Successfull",
//                 data: datacon
//             };
//             datacon = datacon.filter(
//                 (temp => a =>
//                     (k => !temp[k] && (temp[k] = true))(a.PCODE + '|' + a.AMC)
//                 )(Object.create(null))
//             );
           
//            // console.log("length= ",)
//             for (var j = 0; j < datacon.length; j++) {
//                 // dataamc = datacon[j].AMC;
//                 // dataisin = datacon[j].ISIN;
//                // console.log("dataisin=", dataisin)
//                 // datapcode = datacon[j].PCODE;
//                 // var newdatapcode = datapcode.replace(dataamc, '');
//                 // console.log("newdatapcode=", newdatapcode);
//                 var nseres = await helper_getschemelist(datacon[j].AMC,datacon[j].ISIN);
//                 console.log("nseres=",nseres)
//             }
//         } else {
//             resdata = {
//                 status: 400,
//                 message: "Data not found"
//             };
//             return resdata;
//         }
//     } catch (err) {
//         console.log(err)
//     }
// }