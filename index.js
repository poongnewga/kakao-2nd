const axios = require('axios');

// 나의 login_token
const login_token = "UBwegpl1JQ20XU49lRdkRDGB6fOEevl9b0VY5U-QevYd-";
var base_url = "http://api.welcome.kakao.com";
var submit_token;
var doc_ids;
var doc_ids_arr;
var config = { headers: {
    "X-Auth-Token": submit_token
  }
};

//
// axios.get(base_url + "/token/" + login_token)
//   .then(function (res) {
//     console.log(res.data);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// GET submit_token : 이렇게 얻은 제출용 토큰은 10분동안 유효하다.
async function CallTokenAPI() {
  try {
    const res = await axios.get(base_url + "/token/" + login_token);
    submit_token = res.data;
    console.log("SUBMIT TOKEN : ")
    console.log(submit_token);
    console.log(" ");
    config.headers["X-Auth-Token"] = submit_token;
  } catch (err) {
    console.log(err);
  }
}

// 카테고리 5개와 doc_id를 가져온다.
// blog, news, social, sport, art
// 해당 /doc/category/doc_id 형태이다.
async function CallSeedAPI() {
  try {
    const res = await axios.get(base_url + "/seed", config);
    doc_ids = res.data;
    console.log(doc_ids);
    doc_ids_arr = doc_ids.split('\n')
    console.log(doc_ids_arr);
  } catch (err) {
    console.log(err);
  }
}

// submit_token 은 10분마다 갱신해야함.
// const submit_token = "TpKjWdRVn9lBQh6wD0lk0yBV2Tn4B3ybWwQ6eS68JzZRG3gkBIMWMrYq0mdvrANZ8NJk4zV";


async function DoAll() {
  console.log("Started");

  await CallTokenAPI();
  await CallSeedAPI();

  console.log("Finished");
}

DoAll();










//
