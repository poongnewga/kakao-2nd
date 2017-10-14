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
var ids_string;
var ids_string2;
var req_body;

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
// doc_ids_arr 의 0~4까지 각 카테고리가 저장된다.
async function CallSeedAPI() {
  try {
    const res = await axios.get(base_url + "/seed", config);
    doc_ids = res.data;
    // console.log(doc_ids);
    doc_ids_arr = doc_ids.split('\n')
    // index 0~4까지만 사용하면 된다.
    // console.log(doc_ids_arr[4]);
  } catch (err) {
    console.log(err);
  }
}

// 리스트가 나타나지 않을 경우 계속해서 호출하는 과정이 필요하다.
async function CallDocumentAPI() {
  try {

    var this_url = doc_ids_arr[0]
    var res = await axios.get(base_url + doc_ids_arr[0], config);

    var data = res.data;
    var next_url = data.next_url;

    if (next_url != this_url) {
      console.log("OK, Let's get it!");
      console.log();
    } else {
      console.log("Let me do it again");
      console.log();
      res = await axios.get(base_url + doc_ids_arr[0], config);
    }

    var img_arr = data.images;
    // console.log(next_url);
    // console.log(img_arr);

    // 중복 제거 작업
    var img_obj = {};
    for (var element of img_arr) {
      img_obj[`${element.id}`] = element.type;
    }
    // 초기화
    ids_string = "id=";
    ids_string2 = "id=";
    // add 인 경우만 골라서 스트링 생성
    var cnt = 0;
    for (var prop in img_obj) {
      if (cnt < 50) {
        if (img_obj[prop] == 'add') {
          ids_string += (prop + ',');
          cnt++;
        }
      } else {
        ids_string2 += (prop + ',');
        cnt++;
      }
    }
    // console.log(ids_string);
    // console.log(ids_string[ids_string.length-1]);
    ids_string = ids_string.slice(0, ids_string.length-1);
    ids_string2 = ids_string.slice(0, ids_string2.length-1);
    // console.log(ids_string);
  } catch (err) {
    console.log(err);
  }
}


// Feature를 가져온다.

async function GetFeatures() {

  try {
    const res = await axios.get(base_url + "/image/feature?" + ids_string, config);
    var data = res.data;
    // console.log(res.data);
    var features_arr = data.features;
    req_body = {
      "data": features_arr
    };
    console.log(req_body);
  } catch (err) {
    console.log(err);
  }

}


// 모든 함수를 차례대로 실행한다.
async function DoAll() {
  console.log("Started");

  // await CallTokenAPI();

  // 10분 전에 다시 시도할 때는 이걸 사용
  config.headers["X-Auth-Token"] = "TyDeQ73VjylbmU9nQ2pv2wbxNi-dDMOZEgv9Ku0dpXGm74VNkibJbMy90KQmMAd9EqkDdDV";

  await CallSeedAPI();

  await CallDocumentAPI();

  await GetFeatures();





  console.log("Finished");
}

DoAll();









//
