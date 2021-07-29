const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 }
  });

  module.exports = mongoose.model('Department', departmentSchema) || mongoose.model('Department');