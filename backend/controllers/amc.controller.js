var { GetAMCList } = require('../model/amc.model');

async function GetAMC(req,res){

    try{
        const list = await GetAMCList();
            resdata = {
                ststus: 200,
                message: 'list found',
                data: list
            }
            res.json(resdata);
    }catch(error){
        console.log("err=",error);
    }
}

module.exports = { GetAMC }