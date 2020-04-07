// pages/login/login.js
const app = getApp();
const host = app.globalData.host;
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const login = require('../../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: false,
    version: app.globalData.version,
    environment: '',
    phone: '',
    proveCode: '',
    error: '',
    errorIndex: 0,
    canLogin:false,
    time:0,
    codetext:'获取验证码',
  },
  login: function(e) {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        if (res.environment === 'wxwork') {
          that.wxworkAuthCode(e);
        } else {
          if (!e.detail.encryptedData) return;
          that.wxLogin(e);
        }
      }
    })
  },
  wxLogin: function(e) {
    login.wxLogin().then((code) => {
      return login.getToken(code);
    }).then((res) => {
      return login.phoneLogin(e);
    }).then((data) => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      environment: app.globalData.environment
    })
  },
  wxworkAuthCode: function() {
    let that = this;
    if (that.validatePhone() && that.validateCode) {
      wx.qy.login({
        success: function(wxres) {
          commonUtil.request(api.authCodeUrl, {
            code: wxres.code, // 微信自带 JsCode
            appid: 3, // 登录类型, 1: 巴滴出行, 2: 巴滴云, 3: 巴滴云企微
            mobile: that.data.phone, //第一次绑定用户需要带手机号
            proveCode: that.data.proveCode //第一次绑定用户需要带手机号的验证码
          }, 'GET', {
            "content-Type": "application/json"
            }).then((res) => {
              wx.setStorageSync("token", res);
              wx.redirectTo({
                url: '/pages/index/index',
              })
          }, (err) => {
            if (err && err.errorMsg){
              wx.showModal({
                title: '',
                content: err.errorMsg,
                showCancel: false,
              })
            }else{
              commonUtil.showToast('登录失败');
            }
          })
        }
      });
    }
  },
  validatePhone: function() {
    const phone = this.data.phone;
    const preg = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/;
    let error = '';
    if (!phone) {
      error = '请输入手机号';
    } else if (!preg.test(phone)) {
      error = '请输入正确手机号';
    }
    this.setData({
      error: error,
      errorIndex: error ? 1 : 0
    })
    return !error;
  },
  validateCode: function() {
    const code = this.data.proveCode;
    const preg = /^\d{6}$/;
    let error = '';
    if (!code) {
      error = '请输入验证码';
    } else if (!preg.test(phone)) {
      error = '请输入正确验证码';
    }
    this.setData({
      error: error,
      errorIndex: error ? 2 : 0
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

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

  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  bindKeyInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
    this.validatePhone();
  },
  bindCodeInput: function(e) {
    this.setData({
      proveCode: e.detail.value
    })
  },
  getCode: function (e) {
    if (this.validatePhone()) {
      this.setCodeAnimate();
      commonUtil.request(api.getCodeUrl, {
        mobile: this.data.phone
      }, 'GET', {
        "content-Type": "application/json"
      }).then((res) => {
        commonUtil.showToast('验证码已发送');
      }, (err) => {
        wx.showModal({
          title: '',
          content: err.errorMsg,
          showCancel: false,
        })
      })
    }
  },
  setCodeAnimate:function(){
    let timer = null;
    let time = 60;
    timer = setInterval(() => {
      if (time == 0) {
        this.setData({
          codetext: '重新发送'
        })
        clearInterval(timer);
      } else {
        this.setData({
          time: --time
        })
      }
    },1000)
  }
})