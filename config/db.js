const mongoose = require('mongoose');

//Map global promises
mongoose.Promise = global.Promise;
//Mongoose Connect
mongoose.connect
(
    'mongodb://pusherarush:arush1234@ds155352.mlab.com:55352/pusherpoll'
)
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.log(err));