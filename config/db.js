
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("connected database")
}).catch((error)=>{
    console.log(error)
})

module.exports = mongoose


