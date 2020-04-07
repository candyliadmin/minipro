// pages/enterpriseAccount/accountUpdate/authentication/authentication.js
const app = getApp();
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
let c_time = null;//倒计时计时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    phone: '',
    isClick: true,//是否重新获取
    codeMsg: '获取验证码',
    totalTime: 60,
    verificationCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let info = wx.getStorageSync('info');
    console.log(info);
    let phone = app.globalData.userPhone;
    const reg = /^(\d{3})\d*(\d{4})$/;
    const str2 = phone.replace(reg, '$1****$2');
    this.setData({ phone: str2 });
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
  getCode: function () {
    let params = {
      phoneNumber: this.data.phone,
      type: "settleAccount"
    }
    commonUtil.request(api.sendCodeUrl, params, "POST").then((res) => {
      commonUtil.showToast('验证码已发送', 2000);
    }, (res) => {
      commonUtil.showToast(res.errorMsg, 2000);
    })
    this.setData({
      isClick: false,
      codeMsg: '重新发送'
    })
    this.countDown();
  },
  /**
   * 倒计时
   */
  countDown: function () {
    if (!this.data.isClick) {
      c_time = setInterval(() => {
        if (this.data.totalTime <= 1) {
          clearInterval(c_time);
          this.setData({
            isClick: true,
            totalTime: 60
          })
        } else {
          this.setData({
            totalTime: --this.data.totalTime
          })
        }
      }, 1000)
    }
  },
  codeChange: function (event) {
    if (event.detail.value) {
      this.setData({
        active: true,
        verificationCode: event.detail.value
      })
    } else {
      this.setData({
        active: false
      })
    }
  },
  gotoSuccess: function () {
    if (this.data.active) {
      let info = wx.getStorageSync('info');
      let params = Object.assign({ verificationCode: this.data.verificationCode},info);
      
      commonUtil.request(api.settleAccountUrl, params, "PUT").then((res) => {
        wx.redirectTo({
          url: '../success/success',
        })
      }, (res) => {
        commonUtil.showToast(res.errorMsg, 2000);
      })
    }
  },
})