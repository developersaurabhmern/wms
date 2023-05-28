var _ = require('underscore');
const moment = require('moment');
var { transc, transk, foliok, folioc, allcamsn, transc2A } = require('../schema/model.schema');



const portfolioApiDetail = (datacon, cb) => {
    const data = _.groupBy(datacon, "RTA");
    try {
        if (data.KARVY != undefined) {
            let match = data.KARVY.map((val) => {
                return { FMCODE: val.PRODCODE, PAN1: { $regex: val.PAN, $options: 'i' }, TD_ACNO: val.FOLIO }
            })
            const pipeline1 = [  //trans_karvy   
                { $match: { $or: match } },
                { $group: { _id: { TD_ACNO: "$TD_ACNO", FMCODE: "$FMCODE", FUNDDESC: "$FUNDDESC", TD_NAV: "$TD_NAV", TD_TRTYPE: "$TD_TRTYPE", TRFLAG: "$TRFLAG", TRDESC: "$TRDESC", NAVDATE: "$NAVDATE", TD_UNITS: "$TD_UNITS", TD_AMT: "$TD_AMT", ASSETTYPE: "$ASSETTYPE", TD_TRNO: "$TD_TRNO", UNQNO: "$UNQNO" } } },
                { $lookup: { from: 'masterdata', localField: '_id.FMCODE', foreignField: 'SCH_CODE', as: 'master' } },
                { $unwind: "$master" },
                { $group: { _id: { TD_ACNO: "$_id.TD_ACNO", FMCODE: "$_id.FMCODE", FUNDDESC: "$_id.FUNDDESC", TD_NAV: "$_id.TD_NAV", TD_TRTYPE: "$_id.TD_TRTYPE", TRFLAG: "$_id.TRFLAG", TRDESC: "$_id.TRDESC", NAVDATE: "$_id.NAVDATE", TD_UNITS: "$_id.TD_UNITS", TD_AMT: "$_id.TD_AMT", ASSETTYPE: "$_id.ASSETTYPE", TD_TRNO: "$_id.TD_TRNO", UNQNO: "$_id.UNQNO", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code" } } },
                {
                    $lookup:
                    {
                        from: "cams_nav",
                        let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $or:
                                            [
                                                { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                { $eq: ["$SchemeCode", "$$amfi"] }
                                            ]
                                    }
                                }
                            },
                            { $project: { _id: 0 } }
                        ],
                        as: "nav"
                    }
                },
                { $unwind: "$nav" },
                { $project: { _id: 0, FOLIO: "$_id.TD_ACNO", PRODCODE: "$_id.FMCODE", SCHEME: "$_id.FUNDDESC", TD_NAV: "$_id.TD_NAV", NATURE: "$_id.TD_TRTYPE", TRFLAG: "$_id.TRFLAG", TRDESC: "$_id.TRDESC", newdate: "$_id.NAVDATE", TD_TRDT: { $dateToString: { format: "%d-%m-%Y", date: "$_id.NAVDATE" } }, cnav: "$nav.NetAssetValue", navdate: "$nav.Date", UNITS: "$_id.TD_UNITS", AMOUNT: "$_id.TD_AMT", TYPE: "$_id.ASSETTYPE", TRXNNO: "$_id.TD_TRNO", UNQNO: "$_id.UNQNO", RTA: "KARVY" } },
            ]
            transk.aggregate(pipeline1, (err, karvy) => {
                var datacon1 = karvy;
                for (var i = 0; i < datacon1.length; i++) {
                    if (datacon1[i]['NATURE'] === "Redemption" || datacon1[i]['NATURE'] === "RED" || datacon1[i]['NATURE'] === "SO" ||
                        datacon1[i]['NATURE'] === "SIPR" || datacon1[i]['NATURE'] === "Full Redemption" ||
                        datacon1[i]['NATURE'] === "Partial Redemption" || datacon1[i]['NATURE'] === "Lateral Shift Out" ||
                        datacon1[i]['NATURE'] === "Switchout" || datacon1[i]['NATURE'] === "Transfer-Out" ||
                        datacon1[i]['NATURE'] === "Transmission Out" || datacon1[i]['NATURE'] === "Switch Over Out" ||
                        datacon1[i]['NATURE'] === "LTOP" || datacon1[i]['NATURE'] === "LTOF" || datacon1[i]['NATURE'] === "FULR" || datacon1[i]['NATURE'] === "SWOP" ||
                        datacon1[i]['NATURE'] === "Partial Switch Out" || datacon1[i]['NATURE'] === "Full Switch Out" || datacon1[i]['NATURE'] === "FUL" ||
                        datacon1[i]['NATURE'] === "STPO" || datacon1[i]['NATURE'] === "SWOF" || datacon1[i]['NATURE'] === "TOCOB" ||
                        datacon1[i]['NATURE'] === "SWD" || datacon1[i]['NATURE'] === "Full Switch Out" || datacon1[i]['NATURE'] === "TRMO") {
                        datacon1[i]['NATURE'] = "Switch Out";
                    }
                    if (datacon1[i]['NATURE'].match(/Systematic Investment.*/) ||
                        datacon1[i]['NATURE'] === "SIN" ||
                        datacon1[i]['NATURE'].match(/Systematic - Instalment.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic - To.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic-NSE.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic Physical.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic-Normal.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic (ECS).*/)) {
                        datacon1[i]['NATURE'] = "SIP";
                    }
                    if (datacon1[i]['TRDESC'].match(/Rej/) && (datacon1[i]['NATURE'] === "REDR" || datacon1[i]['NATURE'] === "SWOFR" || datacon1[i]['NATURE'] === "SWOPR" || datacon1[i]['NATURE'] === "FULR" || datacon1[i]['NATURE'] === "STPOR" || datacon1[i]['NATURE'] === "LTOPR" || datacon1[i]['NATURE'] === "LTOFR") && Math.sign(datacon1[i]['AMOUNT']) === -1) {
                        datacon1[i]['NATURE'] = "SWO Rejection";
                        datacon1[i]['UNITS'] = Math.abs(datacon1[i]['UNITS']);
                        datacon1[i]['AMOUNT'] = Math.abs(datacon1[i]['AMOUNT']);
                    }
                    if (datacon1[i]['NATURE'] === "ADDPUR" || datacon1[i]['NATURE'] === "Additional Purchase" || datacon1[i]['NATURE'] === "NEW" || datacon1[i]['NATURE'] === "ADD" || datacon1[i]['NATURE'] === "Fresh Purchase") {
                        datacon1[i]['NATURE'] = "Purchase";
                    }
                    if (datacon1[i]['NATURE'] === "Lateral Shift In" || datacon1[i]['NATURE'] === "Switch-In"
                        || datacon1[i]['NATURE'] === "Transfer-In" || datacon1[i]['NATURE'] === "Switch Over In"
                        || datacon1[i]['NATURE'] === "LTIN" || datacon1[i]['NATURE'] === "LTIA") {
                        datacon1[i]['NATURE'] = "Switch In";
                    }
                    if (datacon1[i]['TYPE'] === "Balanced" || datacon1[i]['TYPE'] === "Equity(S)" || datacon1[i]['TYPE'] === "Equity(G)" || datacon1[i]['TYPE'] === "EQUITY FUND" || datacon1[i]['TYPE'] === "EQUITY FUN" || datacon1[i]['TYPE'] === "EQUITY-MF" || datacon1[i]['TYPE'] === "Balanced" || datacon1[i]['TYPE'] === "EQUITY" || datacon1[i]['TYPE'] === "Equity Fund" || datacon1[i]['TYPE'] === "Equity" || datacon1[i]['TYPE'] === "ELSS" || datacon1[i]['TYPE'] === "FOF Overseas" || datacon1[i]['TYPE'] === "Arbitrage Fund" || datacon1[i]['TYPE'] === "MIP") {
                        datacon1[i]['TYPE'] = "EQUITY";
                    }
                    if (datacon1[i]['TYPE'] === "Gold FOF") {
                        datacon1[i]['TYPE'] = "GOLD";
                    }
                    if (datacon1[i]['TYPE'] === "DEBT FUND" || datacon1[i]['TYPE'] === "LIQUID" || datacon1[i]['TYPE'] === "DEBT" || datacon1[i]['TYPE'] === "LIQUID FUND" || datacon1[i]['TYPE'] === "INCOME FUND" || datacon1[i]['TYPE'] === "GILT FUND" || datacon1[i]['TYPE'] === "Cash" || datacon1[i]['TYPE'] === "Bond" || datacon1[i]['TYPE'] === "Ultra Liquid" || datacon1[i]['TYPE'] === "Liquid Fund" || datacon1[i]['TYPE'] === "STP" || datacon1[i]['TYPE'] === "Gilt" || datacon1[i]['TYPE'] === "FOF") {
                        datacon1[i]['TYPE'] = "DEBT";
                    }

                }
                datacon1 = datacon1.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);

                if (data.CAMS != undefined) {
                    let camsMatch = data.CAMS.map((val) => {
                        return { PRODCODE: val.PRODCODE, PAN: { $regex: val.PAN, $options: 'i' }, FOLIO_NO: val.FOLIO, }
                    })
                    const pipeline2 = [  //trans_cams
                        { $match: { $or: camsMatch } },
                        { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                        { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                        { $unwind: "$master" },
                        { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", PRODCODE: "$_id.PRODCODE" } } },
                        {
                            $lookup:
                            {
                                from: "cams_nav",
                                let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                                pipeline: [
                                    {
                                        $match:
                                        {
                                            $expr:
                                            {
                                                $or:
                                                    [
                                                        { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                        { $eq: ["$SchemeCode", "$$amfi"] }
                                                    ]
                                            }
                                        }
                                    },
                                    { $project: { _id: 0 } }
                                ],
                                as: "nav"
                            }
                        },

                        { $unwind: "$nav" },
                        { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, cnav: "$nav.NetAssetValue", navdate: "$nav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS" } },
                    ]
                    transc.aggregate(pipeline2, (err, cams) => {
                        cams = cams.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());
                        const pipeline22 = [  //trans_cams
                            { $match: { $or: camsMatch } },
                            { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                            { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                            { $unwind: "$master" },
                            { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", PRODCODE: "$_id.PRODCODE" } } },
                            {
                                $lookup:
                                {
                                    from: "cams_nav",
                                    let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                                    pipeline: [
                                        {
                                            $match:
                                            {
                                                $expr:
                                                {
                                                    $or:
                                                        [
                                                            { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                            { $eq: ["$SchemeCode", "$$amfi"] }
                                                        ]
                                                }
                                            }
                                        },
                                        { $project: { _id: 0 } }
                                    ],
                                    as: "nav"
                                }
                            },

                            { $unwind: "$nav" },
                            { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, cnav: "$nav.NetAssetValue", navdate: "$nav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS2A" } },
                        ]
                        // console.log("line 387=",cams.length)

                        transc2A.aggregate(pipeline22, (err, cams2a) => {
                            //       console.log("line 390=",cams2a.length)
                            cams2a = cams2a.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());
                            if (cams2a != 0) {

                                datacon2 = cams2a.concat(cams)
                            } else {
                                datacon2 = cams
                            }

                            for (var i = 0; i < datacon2.length; i++) {
                                if (datacon2[i]['NATURE'] === "Redemption" || datacon2[i]['NATURE'] === "R" || datacon2[i]['NATURE'] === "RED" ||
                                    datacon2[i]['NATURE'] === "SIPR" || datacon2[i]['NATURE'] === "Full Redemption" ||
                                    datacon2[i]['NATURE'] === "Partial Redemption" || datacon2[i]['NATURE'] === "Lateral Shift Out" ||
                                    datacon2[i]['NATURE'] === "Switchout" || datacon2[i]['NATURE'] === "Transfer-Out" || datacon2[i]['NATURE'] === "Full Switch Out" ||
                                    datacon2[i]['NATURE'] === "Transmission Out" || datacon2[i]['NATURE'] === "Switch Over Out" || datacon2[i]['NATURE'] === "SWOP" || datacon2[i]['NATURE'] === "SO" ||
                                    datacon2[i]['NATURE'] === "LTOP" || datacon2[i]['NATURE'] === "LTOF" || datacon2[i]['NATURE'] === "FULR" ||
                                    datacon2[i]['NATURE'] === "Partial Switch Out" || datacon2[i]['NATURE'] === "Full Switch Out" || datacon2[i]['NATURE'] === "FUL" ||
                                    datacon2[i]['NATURE'] === "STPO" || datacon2[i]['NATURE'] === "SWOF" ||
                                    datacon2[i]['NATURE'] === "SWD" || datacon2[i]['NATURE'] === "TOCOB") {
                                    datacon2[i]['NATURE'] = "Switch Out";
                                }
                                if (datacon2[i]['NATURE'].match(/Systematic Investment.*/) ||
                                    datacon2[i]['NATURE'] === "SIN" ||
                                    datacon2[i]['NATURE'].match(/Systematic - Instalment.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic - To.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic-NSE.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic Physical.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic-Normal.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic (ECS).*/)) {
                                    datacon2[i]['NATURE'] = "SIP";
                                }
                                if (datacon2[i]['TRDESC'].match(/Rej/) && (datacon2[i]['NATURE'] === "REDR" || datacon2[i]['NATURE'] === "SWOFR" || datacon2[i]['NATURE'] === "SWOPR" || datacon2[i]['NATURE'] === "FULR" || datacon2[i]['NATURE'] === "STPOR" || datacon2[i]['NATURE'] === "LTOPR" || datacon2[i]['NATURE'] === "LTOFR") && Math.sign(datacon2[i]['AMOUNT']) === -1) {
                                    datacon2[i]['NATURE'] = "SWO Rejection";
                                    datacon2[i]['UNITS'] = Math.abs(datacon2[i]['UNITS']);
                                    datacon2[i]['AMOUNT'] = Math.abs(datacon2[i]['AMOUNT']);
                                }
                                if (datacon2[i]['NATURE'] === "ADDPUR" || datacon2[i]['NATURE'] === "Additional Purchase" || datacon2[i]['NATURE'] === "NEW" || datacon2[i]['NATURE'] === "ADD" || datacon2[i]['NATURE'] === "Fresh Purchase") {
                                    datacon2[i]['NATURE'] = "Purchase";
                                }
                                if (datacon2[i]['NATURE'] === "Lateral Shift In" || datacon2[i]['NATURE'] === "Switch-In"
                                    || datacon2[i]['NATURE'] === "Transfer-In" || datacon2[i]['NATURE'] === "Switch Over In"
                                    || datacon2[i]['NATURE'] === "LTIN" || datacon2[i]['NATURE'] === "LTIA") {
                                    datacon2[i]['NATURE'] = "Switch In";
                                }
                                if (datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "Equity(S)" || datacon2[i]['TYPE'] === "Equity(G)" || datacon2[i]['TYPE'] === "EQUITY FUND" || datacon2[i]['TYPE'] === "EQUITY FUN" || datacon2[i]['TYPE'] === "EQUITY-MF" || datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "EQUITY" || datacon2[i]['TYPE'] === "Equity Fund" || datacon2[i]['TYPE'] === "Equity" || datacon2[i]['TYPE'] === "ELSS" || datacon2[i]['TYPE'] === "FOF Overseas" || datacon2[i]['TYPE'] === "Arbitrage Fund" || datacon2[i]['TYPE'] === "MIP") {
                                    datacon2[i]['TYPE'] = "EQUITY";
                                }
                                if (datacon2[i]['TYPE'] === "DEBT FUND" || datacon2[i]['TYPE'] === "LIQUID" || datacon2[i]['TYPE'] === "DEBT" || datacon2[i]['TYPE'] === "LIQUID FUND" || datacon2[i]['TYPE'] === "INCOME FUND" || datacon2[i]['TYPE'] === "GILT FUND" || datacon2[i]['TYPE'] === "Cash" || datacon2[i]['TYPE'] === "Bond" || datacon2[i]['TYPE'] === "Ultra Liquid" || datacon2[i]['TYPE'] === "Liquid Fund" || datacon2[i]['TYPE'] === "STP" || datacon2[i]['TYPE'] === "Gilt" || datacon2[i]['TYPE'] === "FOF") {
                                    datacon2[i]['TYPE'] = "DEBT";
                                }
                                if (datacon2[i]['TYPE'] === "Gold FOF") {
                                    datacon2[i]['TYPE'] = "GOLD";
                                }
                            }

                            var datacon = datacon1.concat(datacon2)
                            datacon = datacon.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);
                            cb(datacon);
                        });

                    });

                } else {
                    var datacon = datacon1;
                    cb(datacon);
                }
            });
        } else {
            if (data.CAMS != undefined) {
                let camsMatch = data.CAMS.map((val) => {
                    return { PRODCODE: val.PRODCODE, PAN: { $regex: val.PAN, $options: 'i' }, FOLIO_NO: val.FOLIO }
                })
                const pipeline2 = [  //trans_cams
                    { $match: { $or: camsMatch } },
                    { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                    { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                    { $unwind: "$master" },
                    { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", PRODCODE: "$_id.PRODCODE" } } },
                    {
                        $lookup:
                        {
                            from: "cams_nav",
                            let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $or:
                                                [
                                                    { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                    { $eq: ["$SchemeCode", "$$amfi"] }
                                                ]
                                        }
                                    }
                                },
                                { $project: { _id: 0 } }
                            ],
                            as: "nav"
                        }
                    },

                    { $unwind: "$nav" },
                    { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, newdate: "$_id.TRADDATE", cnav: "$nav.NetAssetValue", navdate: "$nav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS" } },

                ]
                transc.aggregate(pipeline2, (err, cams) => {
                    cams = cams.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime())
                    const pipeline22 = [  //trans_cams
                        { $match: { $or: camsMatch } },
                        { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                        { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                        { $unwind: "$master" },
                        { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", PRODCODE: "$_id.PRODCODE" } } },
                        {
                            $lookup:
                            {
                                from: "cams_nav",
                                let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                                pipeline: [
                                    {
                                        $match:
                                        {
                                            $expr:
                                            {
                                                $or:
                                                    [
                                                        { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                        { $eq: ["$SchemeCode", "$$amfi"] }
                                                    ]
                                            }
                                        }
                                    },
                                    { $project: { _id: 0 } }
                                ],
                                as: "nav"
                            }
                        },

                        { $unwind: "$nav" },
                        { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, newdate: "$_id.TRADDATE", cnav: "$nav.NetAssetValue", navdate: "$nav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS2A" } },

                    ]
                    transc2A.aggregate(pipeline22, (err, cams2a) => {
                        cams2a = cams2a.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime())
                        if (cams2a != 0) {
                            // cams.shift();
                            datacon2 = cams2a.concat(cams)
                        } else {
                            datacon2 = cams
                        }

                        for (var i = 0; i < datacon2.length; i++) {
                            if (datacon2[i]['NATURE'] === "Redemption" || datacon2[i]['NATURE'] === "R" || datacon2[i]['NATURE'] === "RED" ||
                                datacon2[i]['NATURE'] === "SIPR" || datacon2[i]['NATURE'] === "Full Redemption" ||
                                datacon2[i]['NATURE'] === "Partial Redemption" || datacon2[i]['NATURE'] === "Lateral Shift Out" ||
                                datacon2[i]['NATURE'] === "Switchout" || datacon2[i]['NATURE'] === "Transfer-Out" || datacon2[i]['NATURE'] === "Full Switch Out" ||
                                datacon2[i]['NATURE'] === "Transmission Out" || datacon2[i]['NATURE'] === "Switch Over Out" || datacon2[i]['NATURE'] === "SWOP" || datacon2[i]['NATURE'] === "SO" ||
                                datacon2[i]['NATURE'] === "LTOP" || datacon2[i]['NATURE'] === "LTOF" || datacon2[i]['NATURE'] === "FULR" ||
                                datacon2[i]['NATURE'] === "Partial Switch Out" || datacon2[i]['NATURE'] === "Full Switch Out" || datacon2[i]['NATURE'] === "FUL" ||
                                datacon2[i]['NATURE'] === "STPO" || datacon2[i]['NATURE'] === "SWOF" ||
                                datacon2[i]['NATURE'] === "SWD" || datacon2[i]['NATURE'] === "TOCOB") {
                                datacon2[i]['NATURE'] = "Switch Out";
                            }
                            if (datacon2[i]['NATURE'].match(/Systematic Investment.*/) ||
                                datacon2[i]['NATURE'] === "SIN" ||
                                datacon2[i]['NATURE'].match(/Systematic - Instalment.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic - To.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic-NSE.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic Physical.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic-Normal.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic (ECS).*/)) {
                                datacon2[i]['NATURE'] = "SIP";
                            }
                            if (datacon2[i]['NATURE'] === "ADDPUR" || datacon2[i]['NATURE'] === "Additional Purchase" || datacon2[i]['NATURE'] === "NEW" || datacon2[i]['NATURE'] === "ADD" || datacon2[i]['NATURE'] === "Fresh Purchase") {
                                datacon2[i]['NATURE'] = "Purchase";
                            }
                            if (datacon2[i]['NATURE'] === "Lateral Shift In" || datacon2[i]['NATURE'] === "Switch-In"
                                || datacon2[i]['NATURE'] === "Transfer-In" || datacon2[i]['NATURE'] === "Switch Over In"
                                || datacon2[i]['NATURE'] === "LTIN" || datacon2[i]['NATURE'] === "LTIA") {
                                datacon2[i]['NATURE'] = "Switch In";
                            }
                            if (datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "Equity(S)" || datacon2[i]['TYPE'] === "Equity(G)" || datacon2[i]['TYPE'] === "EQUITY FUND" || datacon2[i]['TYPE'] === "EQUITY FUN" || datacon2[i]['TYPE'] === "EQUITY-MF" || datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "EQUITY" || datacon2[i]['TYPE'] === "Equity Fund" || datacon2[i]['TYPE'] === "Equity" || datacon2[i]['TYPE'] === "ELSS" || datacon2[i]['TYPE'] === "FOF Overseas" || datacon2[i]['TYPE'] === "Arbitrage Fund" || datacon2[i]['TYPE'] === "MIP") {
                                datacon2[i]['TYPE'] = "EQUITY";
                            }
                            if (datacon2[i]['TYPE'] === "DEBT FUND" || datacon2[i]['TYPE'] === "LIQUID" || datacon2[i]['TYPE'] === "DEBT" || datacon2[i]['TYPE'] === "LIQUID FUND" || datacon2[i]['TYPE'] === "INCOME FUND" || datacon2[i]['TYPE'] === "GILT FUND" || datacon2[i]['TYPE'] === "Cash" || datacon2[i]['TYPE'] === "Bond" || datacon2[i]['TYPE'] === "Ultra Liquid" || datacon2[i]['TYPE'] === "Liquid Fund" || datacon2[i]['TYPE'] === "STP" || datacon2[i]['TYPE'] === "Gilt" || datacon2[i]['TYPE'] === "FOF") {
                                datacon2[i]['TYPE'] = "DEBT";
                            }
                            if (datacon2[i]['TYPE'] === "Gold FOF") {
                                datacon2[i]['TYPE'] = "GOLD";
                            }

                        }
                        var datacon = datacon2;
                        datacon = datacon.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);
                        cb(datacon);
                    });
                });

            }
        }
    } catch (err) {
        console.log(err)
    }

}

const portfolioApisnapshot = (datacon, cb) => {
    const data = _.groupBy(datacon, "RTA");
    //   const data =  _.groupBy(datacon, function (person) {
    //         var props = ['RTA', 'PAN'], // server-defined
    //         prop = [];
    //         for (var i = 0, length = props.length; i < length; i++) {
    //             prop.push(person[props[i]]);
    //         }
    //         return prop.join('|');
    //     });

    console.log("qq=", data.KARVY)
    try {

        if (data.KARVY != undefined) {
            let match = data.KARVY.map((val) => {
                return { $and: [{ FMCODE: val.PRODCODE }, { PAN1: { $regex: val.PAN, $options: 'i' } }, { TD_ACNO: val.FOLIO }] }
            })
            const pipeline1 = [  //trans_karvy   
                { $match: { $or: match } },
                { $group: { _id: { TD_ACNO: "$TD_ACNO", FMCODE: "$FMCODE", FUNDDESC: "$FUNDDESC", TD_NAV: "$TD_NAV", TD_TRTYPE: "$TD_TRTYPE", NAVDATE: "$NAVDATE", TRFLAG: "$TRFLAG", TRDESC: "$TRDESC", TD_UNITS: "$TD_UNITS", TD_AMT: "$TD_AMT", ASSETTYPE: "$ASSETTYPE", TD_TRNO: "$TD_TRNO", UNQNO: "$UNQNO" } } },
                { $lookup: { from: 'masterdata', localField: '_id.FMCODE', foreignField: 'SCH_CODE', as: 'master' } },
                { $unwind: "$master" },
                { $group: { _id: { TD_ACNO: "$_id.TD_ACNO", FMCODE: "$_id.FMCODE", FUNDDESC: "$_id.FUNDDESC", TD_NAV: "$_id.TD_NAV", TD_TRTYPE: "$_id.TD_TRTYPE", TRFLAG: "$_id.TRFLAG", TRDESC: "$_id.TRDESC", NAVDATE: "$_id.NAVDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", TD_UNITS: "$_id.TD_UNITS", TD_AMT: "$_id.TD_AMT", ASSETTYPE: "$_id.ASSETTYPE", TD_TRNO: "$_id.TD_TRNO", UNQNO: "$_id.UNQNO" } } },
                {
                    $lookup:
                    {
                        from: "allnav",
                        let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                        pipeline: [
                            { $match: { $expr: { $or: [{ $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] }, { $eq: ["$SchemeCode", "$$amfi"] }] } } },
                            { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                            { $sort: { Date: -1 } },
                            { $limit: 2 }
                        ],
                        as: "oldnav"
                    }
                },
                // { $unwind: "$oldnav" },
                { $project: { _id: 0, FOLIO: "$_id.TD_ACNO", PRODCODE: "$_id.FMCODE", SCHEME: "$_id.FUNDDESC", TD_NAV: "$_id.TD_NAV", NATURE: "$_id.TD_TRTYPE", TRFLAG: "$_id.TRFLAG", TRDESC: "$_id.TRDESC", newdate: "$_id.NAVDATE", TD_TRDT: { $dateToString: { format: "%d-%m-%Y", date: "$_id.NAVDATE" } }, ISIN: "$_id.SCHEMEISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.TD_UNITS", AMOUNT: "$_id.TD_AMT", TYPE: "$_id.ASSETTYPE", TRXNNO: "$_id.TD_TRNO", UNQNO: "$_id.UNQNO", RTA: "KARVY" } },
            ]
            transk.aggregate(pipeline1, (err, karvy) => {
                var datacon1 = karvy;
                for (var i = 0; i < datacon1.length; i++) {
                    if (datacon1[i]['NATURE'] === "Redemption" || datacon1[i]['NATURE'] === "RED" ||
                        datacon1[i]['NATURE'] === "SIPR" || datacon1[i]['NATURE'] === "Full Redemption" ||
                        datacon1[i]['NATURE'] === "Partial Redemption" || datacon1[i]['NATURE'] === "Lateral Shift Out" || datacon1[i]['NATURE'] === "Full Switch Out" ||
                        datacon1[i]['NATURE'] === "Switchout" || datacon1[i]['NATURE'] === "Transfer-Out" ||
                        datacon1[i]['NATURE'] === "Transmission Out" || datacon1[i]['NATURE'] === "Switch Over Out" ||
                        datacon1[i]['NATURE'] === "LTOP" || datacon1[i]['NATURE'] === "LTOF" || datacon1[i]['NATURE'] === "FULR" || datacon1[i]['NATURE'] === "SWOP" || datacon1[i]['NATURE'] === "SO" ||
                        datacon1[i]['NATURE'] === "Partial Switch Out" || datacon1[i]['NATURE'] === "Full Switch Out" || datacon1[i]['NATURE'] === "FUL" ||
                        datacon1[i]['NATURE'] === "STPO" || datacon1[i]['NATURE'] === "SWOF" ||
                        datacon1[i]['NATURE'] === "SWD" || datacon1[i]['NATURE'] === "TOCOB" || datacon1[i]['NATURE'] === "TRMO") {
                        datacon1[i]['NATURE'] = "Switch Out";
                    }
                    if (datacon1[i]['NATURE'].match(/Systematic Investment.*/) ||
                        datacon1[i]['NATURE'] === "SIN" ||
                        datacon1[i]['NATURE'].match(/Systematic - Instalment.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic - To.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic-NSE.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic Physical.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic-Normal.*/) ||
                        datacon1[i]['NATURE'].match(/Systematic (ECS).*/)) {
                        datacon1[i]['NATURE'] = "SIP";
                    }
                    if (datacon1[i]['TRDESC'].match(/Rej/) && (datacon1[i]['NATURE'] === "REDR" || datacon1[i]['NATURE'] === "SWOFR" || datacon1[i]['NATURE'] === "SWOPR" || datacon1[i]['NATURE'] === "FULR" || datacon1[i]['NATURE'] === "STPOR" || datacon1[i]['NATURE'] === "LTOPR" || datacon1[i]['NATURE'] === "LTOFR") && Math.sign(datacon1[i]['AMOUNT']) === -1) {
                        datacon1[i]['NATURE'] = "SWO Rejection";
                        datacon1[i]['UNITS'] = Math.abs(datacon1[i]['UNITS']);
                        datacon1[i]['AMOUNT'] = Math.abs(datacon1[i]['AMOUNT']);
                    }
                    if (datacon1[i]['NATURE'] === "ADDPUR" || datacon1[i]['NATURE'] === "Additional Purchase" || datacon1[i]['NATURE'] === "NEW" || datacon1[i]['NATURE'] === "ADD" || datacon1[i]['NATURE'] === "Fresh Purchase") {
                        datacon1[i]['NATURE'] = "Purchase";
                    }
                    if (datacon1[i]['NATURE'] === "Lateral Shift In" || datacon1[i]['NATURE'] === "Switch-In"
                        || datacon1[i]['NATURE'] === "Transfer-In" || datacon1[i]['NATURE'] === "Switch Over In"
                        || datacon1[i]['NATURE'] === "LTIN" || datacon1[i]['NATURE'] === "LTIA") {
                        datacon1[i]['NATURE'] = "Switch In";
                    }
                    if (datacon1[i]['TYPE'] === "Balanced" || datacon1[i]['TYPE'] === "Equity(S)" || datacon1[i]['TYPE'] === "Equity(G)" || datacon1[i]['TYPE'] === "EQUITY FUND" || datacon1[i]['TYPE'] === "EQUITY FUN" || datacon1[i]['TYPE'] === "EQUITY-MF" || datacon1[i]['TYPE'] === "Balanced" || datacon1[i]['TYPE'] === "EQUITY" || datacon1[i]['TYPE'] === "Equity Fund" || datacon1[i]['TYPE'] === "Equity" || datacon1[i]['TYPE'] === "ELSS" || datacon1[i]['TYPE'] === "FOF Overseas" || datacon1[i]['TYPE'] === "Arbitrage Fund" || datacon1[i]['TYPE'] === "MIP") {
                        datacon1[i]['TYPE'] = "EQUITY";
                    }
                    if (datacon1[i]['TYPE'] === "Gold FOF") {
                        datacon1[i]['TYPE'] = "GOLD";
                    }
                    if (datacon1[i]['TYPE'] === "DEBT FUND" || datacon1[i]['TYPE'] === "LIQUID" || datacon1[i]['TYPE'] === "DEBT" || datacon1[i]['TYPE'] === "LIQUID FUND" || datacon1[i]['TYPE'] === "INCOME FUND" || datacon1[i]['TYPE'] === "GILT FUND" || datacon1[i]['TYPE'] === "Cash" || datacon1[i]['TYPE'] === "Bond" || datacon1[i]['TYPE'] === "Ultra Liquid" || datacon1[i]['TYPE'] === "Liquid Fund" || datacon1[i]['TYPE'] === "STP" || datacon1[i]['TYPE'] === "Gilt" || datacon1[i]['TYPE'] === "FOF") {
                        datacon1[i]['TYPE'] = "DEBT";
                    }
                }
                datacon1 = datacon1.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);

                if (data.CAMS != undefined) {
                    let camsMatch = data.CAMS.map((val) => {
                        return { $and: [{ PRODCODE: val.PRODCODE }, { PAN: { $regex: val.PAN, $options: 'i' } }, { FOLIO_NO: val.FOLIO }] }
                    })
                    const pipeline2 = [  //trans_cams
                        { $match: { $or: camsMatch } },
                        { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                        { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                        { $unwind: "$master" },
                        { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", PRODCODE: "$_id.PRODCODE" } } },
                        {
                            $lookup:
                            {
                                from: "allnav",
                                let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [
                                                    { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                    { $eq: ["$SchemeCode", "$$amfi"] }]
                                            }
                                        }
                                    },
                                    { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                                    { $sort: { Date: -1 } },
                                    { $limit: 2 }
                                ],
                                as: "oldnav"
                            }
                        },
                        //  { $unwind: "$oldnav" },
                        { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, ISIN: "$master.ISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS" } },
                    ]
                    transc.aggregate(pipeline2, (err, cams) => {
                        cams = cams.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());
                        const pipeline22 = [  //trans_cams
                            { $match: { $or: camsMatch } },
                            { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                            { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                            { $unwind: "$master" },
                            { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", PRODCODE: "$_id.PRODCODE" } } },
                            {
                                $lookup:
                                {
                                    from: "allnav",
                                    let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $or: [
                                                        { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                        { $eq: ["$SchemeCode", "$$amfi"] }]
                                                }
                                            }
                                        },
                                        { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                                        { $sort: { Date: -1 } },
                                        { $limit: 2 }
                                    ],
                                    as: "oldnav"
                                }
                            },
                            //   { $unwind: "$oldnav" },
                            { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, ISIN: "$master.ISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS2A" } },
                        ]
                        transc2A.aggregate(pipeline22, (err, cams2a) => {
                            cams2a = cams2a.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());
                            var datacon2 = "";
                            if (cams2a != 0) {

                                datacon2 = cams2a.concat(cams)
                            } else {
                                datacon2 = cams
                            }
                            for (var i = 0; i < datacon2.length; i++) {
                                if (datacon2[i]['NATURE'] === "Redemption" || datacon2[i]['NATURE'] === "R" || datacon2[i]['NATURE'] === "RED" ||
                                    datacon2[i]['NATURE'] === "SIPR" || datacon2[i]['NATURE'] === "Full Redemption" || datacon2[i]['NATURE'] === "Full Switch Out" ||
                                    datacon2[i]['NATURE'] === "Partial Redemption" || datacon2[i]['NATURE'] === "Lateral Shift Out" ||
                                    datacon2[i]['NATURE'] === "Switchout" || datacon2[i]['NATURE'] === "Transfer-Out" ||
                                    datacon2[i]['NATURE'] === "Transmission Out" || datacon2[i]['NATURE'] === "Switch Over Out" || datacon2[i]['NATURE'] === "SWOP" ||
                                    datacon2[i]['NATURE'] === "LTOP" || datacon2[i]['NATURE'] === "LTOF" || datacon2[i]['NATURE'] === "FULR" ||
                                    datacon2[i]['NATURE'] === "Partial Switch Out" || datacon2[i]['NATURE'] === "Full Switch Out" || datacon2[i]['NATURE'] === "FUL" || datacon2[i]['NATURE'] === "SO" ||
                                    datacon2[i]['NATURE'] === "STPO" || datacon2[i]['NATURE'] === "SWOF" ||
                                    datacon2[i]['NATURE'] === "SWD" || datacon2[i]['NATURE'] === "TOCOB") {
                                    datacon2[i]['NATURE'] = "Switch Out";
                                }
                                if (datacon2[i]['NATURE'].match(/Systematic Investment.*/) ||
                                    datacon2[i]['NATURE'] === "SIN" ||
                                    datacon2[i]['NATURE'].match(/Systematic - Instalment.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic - To.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic-NSE.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic Physical.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic-Normal.*/) ||
                                    datacon2[i]['NATURE'].match(/Systematic (ECS).*/)) {
                                    datacon2[i]['NATURE'] = "SIP";
                                }
                                if (datacon2[i]['NATURE'] === "ADDPUR" || datacon2[i]['NATURE'] === "Additional Purchase" || datacon2[i]['NATURE'] === "NEW" || datacon2[i]['NATURE'] === "ADD" || datacon2[i]['NATURE'] === "Fresh Purchase") {
                                    datacon2[i]['NATURE'] = "Purchase";
                                }
                                if (datacon2[i]['NATURE'] === "Lateral Shift In" || datacon2[i]['NATURE'] === "Switch-In"
                                    || datacon2[i]['NATURE'] === "Transfer-In" || datacon2[i]['NATURE'] === "Switch Over In"
                                    || datacon2[i]['NATURE'] === "LTIN" || datacon2[i]['NATURE'] === "LTIA") {
                                    datacon2[i]['NATURE'] = "Switch In";
                                }
                                if (datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "Equity(S)" || datacon2[i]['TYPE'] === "Equity(G)" || datacon2[i]['TYPE'] === "EQUITY FUND" || datacon2[i]['TYPE'] === "EQUITY FUN" || datacon2[i]['TYPE'] === "EQUITY-MF" || datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "EQUITY" || datacon2[i]['TYPE'] === "Equity Fund" || datacon2[i]['TYPE'] === "Equity" || datacon2[i]['TYPE'] === "ELSS" || datacon2[i]['TYPE'] === "FOF Overseas" || datacon2[i]['TYPE'] === "Arbitrage Fund" || datacon2[i]['TYPE'] === "MIP") {
                                    datacon2[i]['TYPE'] = "EQUITY";
                                }
                                if (datacon2[i]['TYPE'] === "DEBT FUND" || datacon2[i]['TYPE'] === "LIQUID" || datacon2[i]['TYPE'] === "DEBT" || datacon2[i]['TYPE'] === "LIQUID FUND" || datacon2[i]['TYPE'] === "INCOME FUND" || datacon2[i]['TYPE'] === "GILT FUND" || datacon2[i]['TYPE'] === "Cash" || datacon2[i]['TYPE'] === "Bond" || datacon2[i]['TYPE'] === "Ultra Liquid" || datacon2[i]['TYPE'] === "Liquid Fund" || datacon2[i]['TYPE'] === "STP" || datacon2[i]['TYPE'] === "Gilt" || datacon2[i]['TYPE'] === "FOF") {
                                    datacon2[i]['TYPE'] = "DEBT";
                                }
                                if (datacon2[i]['TYPE'] === "Gold FOF") {
                                    datacon2[i]['TYPE'] = "GOLD";
                                }
                            }
                            var datacon = datacon1.concat(datacon2)
                            datacon = datacon.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);
                            cb(datacon);
                            //   }

                        });
                    });

                } else {
                    var datacon = datacon1;
                    datacon = datacon.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);
                    cb(datacon);
                }
            });
        } else {
            if (data.CAMS != undefined) {
                let camsMatch = data.CAMS.map((val) => {
                    return { PRODCODE: val.PRODCODE, PAN: { $regex: val.PAN, $options: 'i' }, FOLIO_NO: val.FOLIO }
                })
                const pipeline2 = [  //trans_cams
                    { $match: { $or: camsMatch } },
                    { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                    { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                    { $unwind: "$master" },
                    { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", PRODCODE: "$_id.PRODCODE" } } },
                    {
                        $lookup:
                        {
                            from: "allnav",
                            let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $or: [
                                                { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                { $eq: ["$SchemeCode", "$$amfi"] }]
                                        }
                                    }
                                },
                                { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                                { $sort: { Date: -1 } },
                                { $limit: 2 }
                            ],
                            as: "oldnav"
                        }
                    },
                    // { $unwind: "$oldnav" },
                    { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, ISIN: "$master.ISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS" } },
                ]
                transc.aggregate(pipeline2, (err, cams) => {
                    cams = cams.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime())
                    const pipeline22 = [  //trans_cams
                        { $match: { $or: camsMatch } },
                        { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                        { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                        { $unwind: "$master" },
                        { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_", TRADDATE: "$_id.TRADDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", PRODCODE: "$_id.PRODCODE" } } },
                        {
                            $lookup:
                            {
                                from: "allnav",
                                let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [
                                                    { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                                    { $eq: ["$SchemeCode", "$$amfi"] }]
                                            }
                                        }
                                    },
                                    { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                                    { $sort: { Date: -1 } },
                                    { $limit: 2 }
                                ],
                                as: "oldnav"
                            }
                        },
                        // { $unwind: "$oldnav" },
                        { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, ISIN: "$master.ISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS2A" } },
                    ]
                    transc2A.aggregate(pipeline22, (err, cams2a) => {
                        cams2a = cams2a.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime())
                        var datacon2 = "";
                        if (cams2a != 0) {
                            // cams.shift();
                            datacon2 = cams2a.concat(cams)
                        } else {
                            datacon2 = cams
                        }
                        for (var i = 0; i < datacon2.length; i++) {
                            if (datacon2[i]['NATURE'] === "Redemption" || datacon2[i]['NATURE'] === "R" || datacon2[i]['NATURE'] === "RED" ||
                                datacon2[i]['NATURE'] === "SIPR" || datacon2[i]['NATURE'] === "Full Redemption" ||
                                datacon2[i]['NATURE'] === "Partial Redemption" || datacon2[i]['NATURE'] === "Lateral Shift Out" ||
                                datacon2[i]['NATURE'] === "Switchout" || datacon2[i]['NATURE'] === "Transfer-Out" || datacon2[i]['NATURE'] === "Full Switch Out" ||
                                datacon2[i]['NATURE'] === "Transmission Out" || datacon2[i]['NATURE'] === "Switch Over Out" || datacon2[i]['NATURE'] === "SWOP" || datacon2[i]['NATURE'] === "SO" ||
                                datacon2[i]['NATURE'] === "LTOP" || datacon2[i]['NATURE'] === "LTOF" || datacon2[i]['NATURE'] === "FULR" ||
                                datacon2[i]['NATURE'] === "Partial Switch Out" || datacon2[i]['NATURE'] === "Full Switch Out" || datacon2[i]['NATURE'] === "FUL" ||
                                datacon2[i]['NATURE'] === "STPO" || datacon2[i]['NATURE'] === "SWOF" ||
                                datacon2[i]['NATURE'] === "SWD" || datacon2[i]['NATURE'] === "TOCOB") {
                                datacon2[i]['NATURE'] = "Switch Out";
                            }
                            if (datacon2[i]['NATURE'].match(/Systematic Investment.*/) ||
                                datacon2[i]['NATURE'] === "SIN" ||
                                datacon2[i]['NATURE'].match(/Systematic - Instalment.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic - To.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic-NSE.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic Physical.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic-Normal.*/) ||
                                datacon2[i]['NATURE'].match(/Systematic (ECS).*/)) {
                                datacon2[i]['NATURE'] = "SIP";
                            }
                            if (datacon2[i]['NATURE'] === "ADDPUR" || datacon2[i]['NATURE'] === "Additional Purchase" || datacon2[i]['NATURE'] === "NEW" || datacon2[i]['NATURE'] === "ADD" || datacon2[i]['NATURE'] === "Fresh Purchase") {
                                datacon2[i]['NATURE'] = "Purchase";
                            }
                            if (datacon2[i]['NATURE'] === "Lateral Shift In" || datacon2[i]['NATURE'] === "Switch-In"
                                || datacon2[i]['NATURE'] === "Transfer-In" || datacon2[i]['NATURE'] === "Switch Over In"
                                || datacon2[i]['NATURE'] === "LTIN" || datacon2[i]['NATURE'] === "LTIA") {
                                datacon2[i]['NATURE'] = "Switch In";
                            }
                            if (datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "Equity(S)" || datacon2[i]['TYPE'] === "Equity(G)" || datacon2[i]['TYPE'] === "EQUITY FUND" || datacon2[i]['TYPE'] === "EQUITY FUN" || datacon2[i]['TYPE'] === "EQUITY-MF" || datacon2[i]['TYPE'] === "Balanced" || datacon2[i]['TYPE'] === "EQUITY" || datacon2[i]['TYPE'] === "Equity Fund" || datacon2[i]['TYPE'] === "Equity" || datacon2[i]['TYPE'] === "ELSS" || datacon2[i]['TYPE'] === "FOF Overseas" || datacon2[i]['TYPE'] === "Arbitrage Fund" || datacon2[i]['TYPE'] === "MIP") {
                                datacon2[i]['TYPE'] = "EQUITY";
                            }
                            if (datacon2[i]['TYPE'] === "DEBT FUND" || datacon2[i]['TYPE'] === "LIQUID" || datacon2[i]['TYPE'] === "DEBT" || datacon2[i]['TYPE'] === "LIQUID FUND" || datacon2[i]['TYPE'] === "INCOME FUND" || datacon2[i]['TYPE'] === "GILT FUND" || datacon2[i]['TYPE'] === "Cash" || datacon2[i]['TYPE'] === "Bond" || datacon2[i]['TYPE'] === "Ultra Liquid" || datacon2[i]['TYPE'] === "Liquid Fund" || datacon2[i]['TYPE'] === "STP" || datacon2[i]['TYPE'] === "Gilt" || datacon2[i]['TYPE'] === "FOF") {
                                datacon2[i]['TYPE'] = "DEBT";
                            }
                            if (datacon2[i]['TYPE'] === "Gold FOF") {
                                datacon2[i]['TYPE'] = "GOLD";
                            }

                        }
                        //  datacon2 = datacon2.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);
                        var datacon = datacon2
                        datacon = datacon.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);
                        cb(datacon);
                    });
                });
            }
        }
    } catch (err) {
        console.log(err)
    }

}


async function portfolioApisnapshottest(datacon, cb) {
    const data = _.groupBy(datacon, "RTA");
    console.log(data)
    var karvydata = ""; var camsdata = "";
    try {
        if (data.KARVY != undefined) {
            let match = data.KARVY.map((val) => {
                return { $and: [{ FMCODE: val.PRODCODE }, { PAN1: { $regex: val.PAN, $options: 'i' } }, { TD_ACNO: val.FOLIO }] }
            })
            var data2 = transk.aggregate([
                { $match: { $or: match } },
                { $group: { _id: { TD_ACNO: "$TD_ACNO", FMCODE: "$FMCODE", FUNDDESC: "$FUNDDESC", TD_NAV: "$TD_NAV", TD_TRTYPE: "$TD_TRTYPE", NAVDATE: "$NAVDATE", TRFLAG: "$TRFLAG", TRDESC: "$TRDESC", TD_UNITS: "$TD_UNITS", TD_AMT: "$TD_AMT", ASSETTYPE: "$ASSETTYPE", TD_TRNO: "$TD_TRNO", UNQNO: "$UNQNO" } } },
                { $lookup: { from: 'masterdata', localField: '_id.FMCODE', foreignField: 'SCH_CODE', as: 'master' } },
                { $unwind: "$master" },
                { $group: { _id: { TD_ACNO: "$_id.TD_ACNO", FMCODE: "$_id.FMCODE", FUNDDESC: "$_id.FUNDDESC", TD_NAV: "$_id.TD_NAV", TD_TRTYPE: "$_id.TD_TRTYPE", TRFLAG: "$_id.TRFLAG", TRDESC: "$_id.TRDESC", NAVDATE: "$_id.NAVDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", TD_UNITS: "$_id.TD_UNITS", TD_AMT: "$_id.TD_AMT", ASSETTYPE: "$_id.ASSETTYPE", TD_TRNO: "$_id.TD_TRNO", UNQNO: "$_id.UNQNO" } } },
                {
                    $lookup:
                    {
                        from: "allnav",
                        let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                        pipeline: [
                            { $match: { $expr: { $or: [{ $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] }, { $eq: ["$SchemeCode", "$$amfi"] }] } } },
                            { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                            { $sort: { Date: -1 } },
                            { $limit: 2 }
                        ],
                        as: "oldnav"
                    }
                },
                // { $unwind: "$oldnav" },
                { $project: { _id: 0, FOLIO: "$_id.TD_ACNO", PRODCODE: "$_id.FMCODE", SCHEME: "$_id.FUNDDESC", TD_NAV: "$_id.TD_NAV", NATURE: "$_id.TD_TRTYPE", TRFLAG: "$_id.TRFLAG", TRDESC: "$_id.TRDESC", newdate: "$_id.NAVDATE", TD_TRDT: { $dateToString: { format: "%d-%m-%Y", date: "$_id.NAVDATE" } }, ISIN: "$_id.SCHEMEISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.TD_UNITS", AMOUNT: "$_id.TD_AMT", TYPE: "$_id.ASSETTYPE", TRXNNO: "$_id.TD_TRNO", UNQNO: "$_id.UNQNO", RTA: "KARVY" } },
            ]);
            karvydata = await data2.exec();
         //   console.log("karvydata=",karvydata)
        }
        if (data.CAMS != undefined) {
            let camsMatch = data.CAMS.map((val) => {
                return { $and: [{ PRODCODE: val.PRODCODE }, { PAN: { $regex: val.PAN, $options: 'i' } }, { FOLIO_NO: val.FOLIO }] }
            })
           // console.log("camsMatch=",camsMatch)
            var data1 = transc.aggregate([
                { $match: { $or: camsMatch } },
                { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_",TRXN_NATUR:"$TRXN_NATUR", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                { $unwind: "$master" },
                { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_",TRXN_NATUR:"$_id.TRXN_NATUR", TRADDATE: "$_id.TRADDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", PRODCODE: "$_id.PRODCODE" } } },
                {
                    $lookup:
                    {
                        from: "allnav",
                        let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                            { $eq: ["$SchemeCode", "$$amfi"] }]
                                    }
                                }
                            },
                            { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                            { $sort: { Date: -1 } },
                            { $limit: 2 }
                        ],
                        as: "oldnav"
                    }
                },
                // { $unwind: "$oldnav" },
                { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE",TRDESC:"$_id.TRXN_NATUR", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, ISIN: "$master.ISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS" } },
            ]);
            camsdata = await data1.exec();
            camsdata = camsdata.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());

        }
        if (data.CAMS2A != undefined) {
            let cams2aMatch = data.CAMS2A.map((val) => {
                return { $and: [{ PRODCODE: val.PRODCODE }, { PAN: { $regex: val.PAN, $options: 'i' } }, { FOLIO_NO: val.FOLIO }] }
            })
           // console.log("camsMatch=",camsMatch)
            var data3 = transc2A.aggregate([
                { $match: { $or: cams2aMatch } },
                { $group: { _id: { FOLIO_NO: "$FOLIO_NO", SCHEME: "$SCHEME", PURPRICE: "$PURPRICE", TRXN_TYPE_: "$TRXN_TYPE_",TRXN_NATUR:"$TRXN_NATUR", TRADDATE: "$TRADDATE", PRODCODE: "$PRODCODE", UNITS: "$UNITS", AMOUNT: "$AMOUNT", SCHEME_TYP: "$SCHEME_TYP", TRXNNO: "$TRXNNO" } } },
                { $lookup: { from: 'masterdata', localField: '_id.PRODCODE', foreignField: 'Merged', as: 'master' } },
                { $unwind: "$master" },
                { $group: { _id: { FOLIO_NO: "$_id.FOLIO_NO", SCHEME: "$_id.SCHEME", PURPRICE: "$_id.PURPRICE", TRXN_TYPE_: "$_id.TRXN_TYPE_",TRXN_NATUR:"$_id.TRXN_NATUR", TRADDATE: "$_id.TRADDATE", ISIN: "$master.ISIN", AMFI: "$master.AMFI_Code", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", SCHEME_TYP: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", PRODCODE: "$_id.PRODCODE" } } },
                {
                    $lookup:
                    {
                        from: "allnav",
                        let: { isin: "$_id.ISIN", amfi: "$_id.AMFI" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ["$ISINDivPayoutISINGrowth", "$$isin"] },
                                            { $eq: ["$SchemeCode", "$$amfi"] }]
                                    }
                                }
                            },
                            { $project: { _id: 0, NetAssetValue: "$NetAssetValue", Date: "$Date" } },
                            { $sort: { Date: -1 } },
                            { $limit: 2 }
                        ],
                        as: "oldnav"
                    }
                },
                // { $unwind: "$oldnav" },
                { $project: { _id: 0, FOLIO: "$_id.FOLIO_NO", PRODCODE: "$_id.PRODCODE", SCHEME: "$_id.SCHEME", TD_NAV: "$_id.PURPRICE", newdate: "$_id.TRADDATE",TRDESC:"$_id.TRXN_NATUR", NATURE: "$_id.TRXN_TYPE_", TD_TRDT: { $dateToString: { format: "%m/%d/%Y", date: "$_id.TRADDATE" } }, ISIN: "$master.ISIN", cnav: "$oldnav.NetAssetValue", daybefore: "$oldnav.NetAssetValue", navdate: "$oldnav.Date", UNITS: "$_id.UNITS", AMOUNT: "$_id.AMOUNT", TYPE: "$_id.SCHEME_TYP", TRXNNO: "$_id.TRXNNO", RTA: "CAMS" } },
            ]);
            cams2adata = await data3.exec();
            cams2adata = cams2adata.sort((a, b) => new Date(a.TD_TRDT.split("-").reverse().join("/")).getTime() - new Date(b.TD_TRDT.split("-").reverse().join("/")).getTime());

        }
        if (cams2adata != 0) {

            datacon2 = cams2adata.concat(camsdata)
        } else {
            datacon2 = cams
        }
        var datacon = karvydata.concat(camsdata);
      //  console.log(datacon)
        for (var i = 0; i < datacon.length; i++) {
            if (datacon[i]['NATURE'] === "Redemption" || datacon[i]['NATURE'] === "RED" ||
                datacon[i]['NATURE'] === "SIPR" || datacon[i]['NATURE'] === "Full Redemption" ||
                datacon[i]['NATURE'] === "Partial Redemption" || datacon[i]['NATURE'] === "Lateral Shift Out" || datacon[i]['NATURE'] === "Full Switch Out" ||
                datacon[i]['NATURE'] === "Switchout" || datacon[i]['NATURE'] === "Transfer-Out" ||
                datacon[i]['NATURE'] === "Transmission Out" || datacon[i]['NATURE'] === "Switch Over Out" ||
                datacon[i]['NATURE'] === "LTOP" || datacon[i]['NATURE'] === "LTOF" || datacon[i]['NATURE'] === "FULR" || datacon[i]['NATURE'] === "SWOP" || datacon[i]['NATURE'] === "SO" ||
                datacon[i]['NATURE'] === "Partial Switch Out" || datacon[i]['NATURE'] === "Full Switch Out" || datacon[i]['NATURE'] === "FUL" ||
                datacon[i]['NATURE'] === "STPO" || datacon[i]['NATURE'] === "SWOF" ||
                datacon[i]['NATURE'] === "SWD" || datacon[i]['NATURE'] === "TOCOB" || datacon[i]['NATURE'] === "TRMO") {
                datacon[i]['NATURE'] = "Switch Out";
            }
            if (datacon[i]['NATURE'].match(/Systematic Investment.*/) ||
                datacon[i]['NATURE'] === "SIN" ||
                datacon[i]['NATURE'].match(/Systematic - Instalment.*/) ||
                datacon[i]['NATURE'].match(/Systematic - To.*/) ||
                datacon[i]['NATURE'].match(/Systematic-NSE.*/) ||
                datacon[i]['NATURE'].match(/Systematic Physical.*/) ||
                datacon[i]['NATURE'].match(/Systematic.*/) ||
                datacon[i]['NATURE'].match(/Systematic-Normal.*/) ||
                datacon[i]['NATURE'].match(/Systematic (ECS).*/)) {
                datacon[i]['NATURE'] = "SIP";
            }
            if (datacon[i]['TRDESC'].match(/Rej/) && (datacon[i]['NATURE'] === "REDR" || datacon[i]['NATURE'] === "SWOFR" || datacon[i]['NATURE'] === "SWOPR" || datacon[i]['NATURE'] === "FULR" || datacon[i]['NATURE'] === "STPOR" || datacon[i]['NATURE'] === "LTOPR" || datacon[i]['NATURE'] === "LTOFR") && Math.sign(datacon[i]['AMOUNT']) === -1) {
                datacon[i]['NATURE'] = "SWO Rejection";
                datacon[i]['UNITS'] = Math.abs(datacon[i]['UNITS']);
                datacon[i]['AMOUNT'] = Math.abs(datacon[i]['AMOUNT']);
            }
            if (datacon[i]['NATURE'] === "ADDPUR" || datacon[i]['NATURE'] === "Additional Purchase" || datacon[i]['NATURE'] === "NEW" || datacon[i]['NATURE'] === "ADD" || datacon[i]['NATURE'] === "Fresh Purchase") {
                datacon[i]['NATURE'] = "Purchase";
            }
            if (datacon[i]['NATURE'] === "Lateral Shift In" || datacon[i]['NATURE'] === "Switch-In"
                || datacon[i]['NATURE'] === "Transfer-In" || datacon[i]['NATURE'] === "Switch Over In"
                || datacon[i]['NATURE'] === "LTIN" || datacon[i]['NATURE'] === "LTIA") {
                datacon[i]['NATURE'] = "Switch In";
            }
            if (datacon[i]['TYPE'] === "Balanced" || datacon[i]['TYPE'] === "Equity(S)" || datacon[i]['TYPE'] === "Equity(G)" || datacon[i]['TYPE'] === "EQUITY FUND" || datacon[i]['TYPE'] === "EQUITY FUN" || datacon[i]['TYPE'] === "EQUITY-MF" || datacon[i]['TYPE'] === "Balanced" || datacon[i]['TYPE'] === "EQUITY" || datacon[i]['TYPE'] === "Equity Fund" || datacon[i]['TYPE'] === "Equity" || datacon[i]['TYPE'] === "ELSS" || datacon[i]['TYPE'] === "FOF Overseas" || datacon[i]['TYPE'] === "Arbitrage Fund" || datacon[i]['TYPE'] === "MIP") {
                datacon[i]['TYPE'] = "EQUITY";
            }
            if (datacon[i]['TYPE'] === "Gold FOF") {
                datacon[i]['TYPE'] = "GOLD";
            }
            if (datacon[i]['TYPE'] === "DEBT FUND" || datacon[i]['TYPE'] === "LIQUID" || datacon[i]['TYPE'] === "DEBT" || datacon[i]['TYPE'] === "LIQUID FUND" || datacon[i]['TYPE'] === "INCOME FUND" || datacon[i]['TYPE'] === "GILT FUND" || datacon[i]['TYPE'] === "Cash" || datacon[i]['TYPE'] === "Bond" || datacon[i]['TYPE'] === "Ultra Liquid" || datacon[i]['TYPE'] === "Liquid Fund" || datacon[i]['TYPE'] === "STP" || datacon[i]['TYPE'] === "Gilt" || datacon[i]['TYPE'] === "FOF") {
                datacon[i]['TYPE'] = "DEBT";
            }
        }
        datacon = datacon.sort((a, b) => (a.SCHEME > b.SCHEME) ? 1 : -1);
        cb(datacon);
    } catch (err) {
        console.log(err)
    }

}

const helper_Oldnav = (isin, cb) => {
    try {
        pipeline1 = [  //trans_karvy
            { $match: { ISINDivPayoutISINGrowth: isin } },
            { $group: { _id: { NetAssetValue: "$NetAssetValue", Date: "$Date" } } },
            { $project: { _id: 0, NetAssetValue: "$_id.NetAssetValue", Date: { $dateToString: { format: "%Y-%m-%d", date: "$_id.Date" } } } },
            { $sort: { Date: -1 } },
            { $limit: 2 }
        ]
        allcamsn.aggregate(pipeline1, (err, data1) => {
            var datacon = data1;
            datacon = datacon[1].NetAssetValue
            cb(datacon);
        });
    } catch (err) {
        console.log(err)
    }

}

const helper_Minorpan = (guard_pan, res) => {
    try {
        const pipeline1 = [   //folio_cams
            { $match: { GUARD_PAN: guard_pan } },
            { $project: { _id: 0, folio: "$FOLIOCHK", amc_code: "$AMC_CODE", } },
            { $sort: { amc_code: 1 } }
        ]
        const pipeline2 = [   //folio_karvy
            { $match: { GUARDPANNO: guard_pan } },
            { $project: { _id: 0, folio: "$ACNO", amc_code: "$FUND", } },
            { $sort: { amc_code: 1 } }
        ]
        folioc.aggregate(pipeline1, (err, foliocams) => {
            foliok.aggregate(pipeline2, (err, foliokarvy) => {
                if (foliocams != 0 || foliokarvy != 0) {
                    resdata = {
                        status: 200,
                        message: "Successfull",
                        data: foliokarvy
                    }
                    var datacon = foliocams.concat(foliokarvy);
                    datacon = datacon.filter(
                        (temp => a =>
                            (k => !temp[k] && (temp[k] = true))(a.folio + '|' + a.amc_code)
                        )(Object.create(null))
                    );

                    resdata.data = datacon.sort((a, b) => (a.amc_code > b.amc_code) ? 1 : -1);
                    res(resdata);
                } else {
                    resdata = {
                        status: 400,
                        message: "Data not found"
                    }
                    res(resdata);
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
}

const helper_Individualpan = (pan, res) => {
    try {
        const pipeline1 = [   //trans_cams
            { $match: { PAN: pan } },
            { $project: { _id: 0, folio: "$FOLIO_NO", amc_code: "$AMC_CODE", } },
            { $sort: { amc_code: 1 } }
        ]
        const pipeline2 = [  //trans_karvy
            { $match: { PAN1: pan } },
            { $project: { _id: 0, folio: "$TD_ACNO", amc_code: "$TD_FUND" } },
            { $sort: { amc_code: 1 } }
        ];
        transc.aggregate(pipeline1, (err, transcams) => {
            transk.aggregate(pipeline2, (err, transkarvy) => {
                if (transcams != 0 || transkarvy != 0) {
                    resdata = {
                        status: 200,
                        message: "Successfull",
                        data: transkarvy
                    }
                    var datacon = transcams.concat(transkarvy);
                    datacon = datacon.filter(
                        (temp => a =>
                            (k => !temp[k] && (temp[k] = true))(a.folio + '|' + a.amc_code)
                        )(Object.create(null))
                    );

                    resdata.data = datacon.sort((a, b) => (a.amc_code > b.amc_code) ? 1 : -1);
                    res(resdata);
                } else {
                    resdata = {
                        status: 400,
                        message: "Data not found"
                    }
                    res(resdata);
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
}


module.exports = { portfolioApiDetail, helper_Minorpan, helper_Individualpan, helper_Oldnav, portfolioApisnapshot }
