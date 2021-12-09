let express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  database = require('./database'),
  mongo = require('mongodb'),
  bodyParser = require('body-parser');

// Connect mongo
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
  },
  error => {
    console.log("Database could't be connected to: " + error)
  }
)


const studentAPI = require('./routes/student.route')
const header = {
  origin:'*'
};
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors(header));
app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// API
app.use('/api',cors(header), studentAPI)

// Create port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})
app.use(express.static('public'));

app.get('/index',function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
  });
// Find 404
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});