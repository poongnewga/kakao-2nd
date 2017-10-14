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
var features_arr;


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
    // 카테고리별로 반복한다.
    for (var i=0; i<=0; i++) {

      var this_url = doc_ids_arr[i]
      var res = await axios.get(base_url + doc_ids_arr[i], config);

      var data = res.data;
      var next_url = data.next_url;

      if (next_url != this_url) {
        console.log("OK, Let's get it!");
        console.log("Try : " + doc_ids_arr[i]);
        console.log();

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


        } else {
          console.log("Let me do it again");
          console.log();
          res = await axios.get(base_url + doc_ids_arr[i], config);
        }




      }

  } catch (err) {
    console.log(err);
  }
}


// Add 할 대상에 대해서만! Feature를 가져온다.
// Save에 사용할 features_arr을 리턴한다.
async function GetFeatures(IDs_string) {

  try {

    const res = await axios.get(base_url + "/image/feature?" + IDs_string, config);
    var data = res.data;
    // console.log(res.data);
    features_arr = data.features;
    return features_arr;

  } catch (err) {
    console.log(err);
  }

}

async function SaveFeature(id_feature_obj) {
  try {
    // const res = await axios.post(base_url + "/image/feature", req_body);
    const res = await axios({
      method: 'post',
      url: base_url + "/image/feature",
      headers: {
          "X-Auth-Token": submit_token
        },
      data: {
        data: id_feature_obj
      }
    });
    console.log("Save Status : " + res.status);
  } catch (err) {
    console.log(err);
  }
}

async function DeleteFeature(id_obj) {
  try {

    const res = await axios({
      method: 'post',
      url: base_url + "/image/feature",
      headers: {
          "X-Auth-Token": submit_token
        },
      data: {
        data: id_obj
      }
    });

    console.log("Delete Status : " + res.status);

  } catch (err) {
    console.log(err);
  }
}


// 모든 함수를 차례대로 실행한다.
async function DoAll() {
  console.log("Started");

  // await CallTokenAPI();

  // 10분 전에 다시 시도할 때는 이걸 사용
  submit_token = "TnypdWZVnglNYI1VkpXep3MbqT6Ep1yWeRGOxSjyzknK0D9GrfBjBvgZJ6z3vUG-3lK8rkX";
  config.headers["X-Auth-Token"] = submit_token;

  await CallSeedAPI();
  // 여기까지는 그냥 진행하면 되고 아래부터는 여러 호출을 동시에 진행해야 할 것 같다.

  await CallDocumentAPI();

  await GetFeatures();

  await SaveFeature(features_arr);





  console.log("Finished");
}

DoAll();









//
