const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/EmployeeDB', {useNewUrlParser: true, useUnifiedTopology: true},err=>{
    if(!err){console.log('Mongoose connected successfully')};
});

require('./employee.model')