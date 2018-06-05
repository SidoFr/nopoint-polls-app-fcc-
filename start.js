const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.error(`!!!!!! ${err.message}!!!!!!!!`);
});

//import models here
require('./models/Local');
require('./models/Auth');
require('./models/Poll');

const app = require('./app');

app.set('port',process.env.PORT || 80);
const server = app.listen(app.get('port'), () => {
    console.log(`running PORT ${server.address().port}!`);
});