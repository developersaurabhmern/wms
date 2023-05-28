var db = require('../config.js');
var { schememaster } = require('../schema/model.schema');

async function GetAMCList(){
    try{
        const pipeline = [
            { $project: { _id:0, AMC:"$AMC", AMC_CODE:"$AMC_CODE" } }
        ]
        schememaster.aggregate(pipeline, (err, list) => {
            
            var data = list.filter(
                (temp => a =>
                    (k => !temp[k] && (temp[k] = true))(a.AMC + '|' + a.AMC_CODE)
                )(Object.create(null))
            );
            // console.log("getlist=",data.length)
            // console.log("getlist=",data)
        })
        // const getlist = await schememaster.find();
        // console.log("getlist=",getlist)
        // if(getlist != ""){
        //     return getlist;
        // }
    }catch(error){
        console.log("err=",error);
    }
}

module.exports = { GetAMCList }