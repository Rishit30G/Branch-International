const mongoose = require('mongoose');

//The connection is established now, we need to get the collection name branch_international
const messageSchema = new mongoose.Schema({
}, { strict: false });

const Register = mongoose.model('branch_international', messageSchema, 'branch_international');

module.exports = Register;