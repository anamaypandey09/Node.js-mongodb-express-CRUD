const express = require('express');
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render("employee/addoredit",{
        viewTitle:"Insert Employee"
    });
})

router.post('/',(req,res)=>{
   if(req.body._id == '') insertRecord(req,res);
   else updateRecord(req, res);
})

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addoredit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

function insertRecord(req,res){
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.city = req.body.city;
    employee.mobile = req.body.mobile;
    employee.save((err,doc)=>{
        if(!err){
            res.redirect('employee/list')
        }
        else{
            if(err.name == 'ValidationError'){
                handlevalidationError(err, req.body);
                res.render("employee/addoredit",{
                    viewTitle:"Insert Employee",
                    employee: req.body
                });
            }
            
            else{
            console.log('some error occured'+ err);
            }
        }
    })

}

router.get('/list',(req,res)=>{
    
    Employee.find((err,docs)=>{
        if(!err){
            res.render("employee/list",{
                list: docs
            }
            
            );
        }
        else{
            console.log('Error in retrieveing data'+err)
        }
    });
});

function handlevalidationError(err, body){
    for(field in err.errors){
        switch (err.errors[field].path){
            case 'fullname':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;    
            }
    }
}
router.get('/:id',(req,res)=>{
    Employee.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render("employee/addoredit",{
                viewTitle:"Update Employee",
                employee:doc
            })
        }
    });
});
router.get('/delete/:id',(req,res)=>{
    Employee.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log('Error in employee database' +err)
        }
    });
});
module.exports = router;