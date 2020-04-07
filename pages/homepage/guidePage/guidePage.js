// pages/guidePage/guidePage.js
let app = getApp();
let host = app.globalData.host;
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const login = require('../../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl
  },
  login: function() {
    const that = this;
    wx.getSystemInfo({
      success(res) {
        if (res.environment === 'wxwork') {
          app.globalData.environment = 'wxwork';
          wx.qy.login({
            success: function(res) {
              that.wxworkAuthCode(res);
            }
          });
        } else {
          that.xcxLogin();
        }
      }
    })
  },
  xcxLogin: function() {
    login.wxLogin().then((code) => {
      return login.getToken(code);
    }).then((res) => {
      return login.getAccountInfo(res);
    }).then((data) => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    })
  },
  wxworkAuthCode: function(wxres) {
    console.log(wxres);
    commonUtil.request(api.authCodeUrl, {
      code: wxres.code, // 微信自带 JsCode
      appid: 3, // 登录类型, 1: 巴滴出行, 2: 巴滴云, 3: 巴滴云企微
    }, 'GET', {
      "content-Type": "application/json"
    }).then((res) => {
      wx.setStorageSync("token", res);
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, (err) => {
      if (err.errorCode == "92000") {
        wx.redirectTo({
          url: '/pages/common/login/login'
        })
      } else {
        wx.showModal({
          title: '',
          showCancel: false,
          content: err.errorMsg,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})