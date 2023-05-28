var { mergethreefunction, getschemelist } = require('../model/helper.model');

async function GetNonZeroFolio(req, res) {
    try {
        const list = await mergethreefunction(req.body.investor_pan, req.body.guard_pan, req.body.jh1_pan, req.body.jh2_pan);
        if (list != "" && list != undefined) {
            resdata = {
                status: 200,
                message: 'Data found',
                data: list
            }
        } else {
            resdata = {
                status: 400,
                message: 'Data not found',
            }
        }
        // console.log("list=",list)
        res.json(resdata);
    } catch (error) {
        console.log("err=", error);
    }
}

async function GetSchemeList(req, res) {
    try {
        if (req.body.folio != undefined) {
            if (req.body.folio === "") {
                resdata = {
                    status: 400,
                    message: 'Please enter folio !',
                }
                res.json(resdata);
                return resdata;
            } else {
                var folio = req.body.folio;
                var accetclass = req.body.ASSET_CLASS.toLowerCase();
                var divsw = req.body.DIV_GW.toLowerCase();
                console.log("folio=",folio,"accetclass=",accetclass,"divsw=",divsw)
                const list = await getschemelist(folio,accetclass,divsw,req.body.rta);
                console.log("list=", list)
                if (list != "" && list != undefined) {
                    resdata = {
                        status: 200,
                        message: 'Successful',
                        data: list
                    }
                } else {
                    resdata = {
                        status: 400,
                        message: 'Data not found',
                    }
                }
                res.json(resdata);
            }
        } else {
            resdata = {
                status: 400,
                message: 'Key not found',
            }
        }
    } catch (error) {
        console.log("err=", error);
    }
}

module.exports = { GetNonZeroFolio, GetSchemeList }