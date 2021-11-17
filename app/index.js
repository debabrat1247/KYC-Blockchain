const express = require('express');
var LRU = require("lru-cache");
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const { jwtSecret } = require('./constant');
// const { generateNonce,authenticateUser } = require('./controller/Login');
const login = require('./controller/Login');
const l=new login();
// const { addBank, removeBank } = require('./controller/Admin');
const admin = require('./controller/Admin');
const a=new admin();
// const { addKycRequest, getBankRequests, verifyCustomer, getVerificationRequests, getVerifiedCustomers, upVoteCustomer, getBanks, upVoteBank } = require('./controller/Bank');

const bank = require('./controller/Bank');
const b=new bank();

const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'KYC App');
app.use(cookieParser());
app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.userToken,
    algorithms: ['HS256'],
  }).unless({ path: ['/', '/auth', '/generate-nonce', ''] })
);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message });
    console.log(err);
    return;
  }
  next();
});

app.get('/', (req, res) => res.send('Healthy!'));
app.get('/generate-nonce', l.generateNonce);
app.post('/auth', l.authenticateUser);

app.post('/addBank', a.addBank);
app.post('/removeBank', a.removeBank);
app.get('/bank', b.getBanks);

app.post('/addKycRequest', b.addKycRequest);

app.get('/bankRequests', b.getBankRequests);
app.get('/verifyCustomer', b.verifyCustomer);
app.get('/verificationRequests', b.getVerificationRequests);
app.get('/verifiedCustomers', b.getVerifiedCustomers);
app.get('/upVoteCustomer', b.upVoteCustomer);
app.get('/upVoteBank', b.upVoteBank);

app.listen(port, () => console.log(`KYC DAPP listening on port ${port}!`));
