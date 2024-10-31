const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// Подключаемся к базе данных MongoDB с помощью Mongoose

db = mongoose.connect('mongodb://localhost:27017/mydatabase');

mongoose.connection
  .once('open', () => console.info('Подключено к базе данных MongoDB mydatabase'))
  .on('error', err => console.error(err));

const {Schema, model}=require('mongoose')

const vacancySchema=new Schema({
    date:{type:String},
    link:{type:String},
    name:{type:String},
    salary:{type:String},
    city:{type:String}
})
  
module.exports=model('vacancy', vacancySchema, 'vacancy')