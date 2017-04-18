var express = require('express'),
    app = express();

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    port = 3000;

app.get('/', function(req, res) {
    app.use(express.static('views/index'));
});

app.listen(port);
console.log('Listening on port ' + port + '...');