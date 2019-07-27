const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//Body-Parser Middlware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cross Origin Resource Sharing
let cors = require('cors');
app.use(cors({credentials: true, origin: "*"}));


app.use(express.static('Client/build'));

io.on('connection', (socket) => {
    console.log("Connected");
    socket.on('mousedown', (data) => {
        io.emit('mousedown',data);
    });
    socket.on('mousemove', (data) => {
        io.emit('mousemove',data);
    });
    socket.on('mouseup', (data) => {
        io.emit('mouseup',data);
    });
});

const port = process.env.PORT || 8080;
server.listen(port, function() {
   console.log("Server listening at port", port);
});


