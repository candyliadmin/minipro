var app = getApp();
var globalData = app.globalData;
const api = require('../config/api.js');
const commonUtil = require('../utils/commonUtil.js');
const BASICDATA = require('../utils/data.js');

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res);
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: '网络错误',
        })
      }
    })
  })
}

function getToken(res) {
  return new Promise((resolve, reject) => {
    commonUtil.request(api.loginUrl, {
      wx_code: res.code,
      app_id: "2"
    }, 'POST', {
      "content-Type": "application/json"
    }).then((data) => {
      wx.setStorageSync("token", data);
      resolve(data);
    }, (err) => {
      wx.showToast({
        title: '登录失败！',
      })
    })
  })
}

function phoneLogin(e) {
  commonUtil.request(api.loginPhoneUrl, {
    encrypted_data: e.detail.encryptedData,
    iv: e.detail.iv,
    app_id: "2",
  }, 'POST')
}

function getAccountInfo() {
  return new Promise((resolve, reject) => {
    commonUtil.request(api.accoutUrl).then((res) => {
      setGlobalAccount(res);
      resolve(res);
    })
  })
}

function setGlobalAccount(res) {
  globalData.userPhone = res.phoneNumber;
  globalData.accountInfo = res;
  setRoleName(res);
}

function setRoleName(res) {
  globalData.roleName = [];
  let roles = res.roles;
  for (let i in BASICDATA.roleGrids) {
    if (commonUtil.inObjArr(roles, "name", i)) {
      globalData.roleName.push(i);
    }
  }
}

function getAccountAuth(res) {
  let roles = res.roles;
  let grids = [];
  let grids_0 = [];
  let grids_1 = [];

  for (let i in BASICDATA.roleGrids) {
    if (commonUtil.inObjArr(roles, "name", i)) {
      let temp_arr = [];
      temp_arr = BASICDATA.roleGrids[i];
      for (let k = 0; k < temp_arr[0].length; k++) {
        if (grids_0.indexOf(temp_arr[0][k]) == -1) {
          grids_0.push(temp_arr[0][k]);
        }
      }
      for (let k = 0; k < temp_arr[1].length; k++) {
        if (grids_1.indexOf(temp_arr[1][k]) == -1) {
          grids_1.push(temp_arr[1][k]);
        }
      }
    }
  }
  grids = grids_0.concat(grids_1);
  return grids;
}

function classifyGrids(girdarr) {
  const grids = girdarr || [];
  let sortGrids = BASICDATA.menuTypes;
  for (let i in sortGrids){
    sortGrids[i]['list'] = [];
  }
  if(grids && grids.length){
    grids.forEach((item)=>{
      if (sortGrids[item.menuType]){
        sortGrids[item.menuType]['list'].push(item);
      }
    })
  }
  return sortGrids || [];
}

module.exports = {
  wxLogin,
  getToken,
  phoneLogin,
  getAccountInfo,
  getAccountAuth,
  classifyGrids,
}