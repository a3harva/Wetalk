
const moment= require('moment');




function fomatMessage(username,text){

    return{
        username,
        text,
        time: moment().format('h:mm a')

    }

}

module.exports=fomatMessage;