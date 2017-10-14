// Node 8
// 출처 : https://github.com/axios/axios
const axios = require('axios');

// 출처 : expressjs.com
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// view engine 세팅
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 정적 파일 응답
app.use(express.static('public'));
// GET 이 아닌 방식에는 URL을 통해 알 수 없으므로 리퀘스트 바디를 파싱해야함.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// GET 라우팅
app.get('/heeham', (req, res) => {
  res.send("Welcome to HEEHAM's Home");
});

// GET 파라미터 분석 : req.query.변수명 으로 접근
app.get('/query', (req,res) => {
  var name = req.query.name;
  var age = req.query.age;
  res.send("Name : " + name + " Age : " + age);
});

// GET 동적 라우팅 : req.params.변수명
app.get('/dynamic/:user', (req,res) => {
  var user = req.params.user;
  res.send("User : " + user);
});

// POST 라우팅 : bodyParser 미들웨어를 사용하고, req.body.변수명으로 접근
app.post('/post', (req,res) => {
  var name = req.body.name;
  var age = req.body.age;
  res.json({name: name, age: age});
});

// 상태코드 설정
app.all('/status/:number', (req,res) => {
  var number = req.params.number;
  res.status(number).send("Status : " + number);
});




// JSON 응답
// 다른 타입으로 응답할 때에는 res.type('타입')으로 타입 지정
app.get('/json', (req, res) => {
  var data = {heeham: "hot", age: 26};
  res.send(data);
});


app.listen(3000, () => {
  console.log("App Listening on port 3000");
});
//---------------------------------------------------
// Axios GET request
// res.data에 응답 데이터가 담겨서 온다. e.g. JSON
axios.get('https://httpbin.org/ip')
  .then(function (res) {
    console.log(res.data);
  })
  .catch(function (err) {
    console.log(err);
  });

// GET request with queries : 2번째 매개변수로 params를 오브젝트를 넘긴다.
// 자동으로 쿼리문이 url로 형성된다.
axios.get('https://httpbin.org/get', {
  params: {
    name: "heeham",
    age: 26
  }}
  )
  .then(function (res) {
    console.log(res.data);
  })
  .catch(function (err) {
    console.log(err);
  });


// POST request with params
axios.post('https://httpbin.org/post', {
    name: "heeham",
    age: 26,
    params: {param1: 1, param2: "hee"}
  }
  )
  .then(function (res) {
    console.log(res.data);
  })
  .catch(function (err) {
    console.log(err);
  });

// GET Img
axios.patch('https://httpbin.org/patch')
  .then(function (res) {
    console.log(res.data);
  })
  .catch(function (err) {
    console.log(err);
  });

//-------------------------------
