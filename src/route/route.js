const express = require('express');
const router = express.Router();
const {createCustomer,customer,customerById,updateCustomer,deleteCustomer} = require('../controller/customerController');

//customer
router.post('/createCustomer',createCustomer)
router.get('/getAllCustomer',customer)
router.get('/getCustomerById/:customerId',customerById)
router.put('/updateCustomer/:customerId',updateCustomer)
router.delete('/deleteCustomer/:customerId',deleteCustomer)


module.exports = router;