// pages/enterpriseAccount/account/account.js
let app = getApp();
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    accountInfo: {
      availableBalance: 0,//可提现余额
      serviceCharge: 0,
      withdrawableBalance: 0,
      accountType:'',
    },
    active:false,
    enable:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccount();
    // this.getStatus();
  },
  getStatus:function(){
    commonUtil.request(api.businessStatusUrl).then((res) => {
      if (res.status != "settle_succeeded" && res.status != "settle_first_succeeded"){
        let accountInfo = this.data.accountInfo;
        accountInfo.availableBalance = '-';
        accountInfo.withdrawableBalance = '-';
        this.setData({
          enable:false,
          accountInfo
        })
      }else{
        this.getAccount();
      }
    })
    
  },
  getAccount: function () {
    commonUtil.request(api.businessAccountUrl).then((res) => {
      let accountInfo = this.data.accountInfo;
      accountInfo.availableBalance = res.totalBalance;
      accountInfo.withdrawableBalance = res.withdrawableBalance;
      accountInfo.accountType = res.accountType;
      wx.setStorageSync("accountType", res.accountType)
      // if (res.accountType === 'b2b'){
      //   accountInfo.serviceCharge = 8
      // }
      this.setData({
        enable: true,
        accountInfo
      })
      this.setActive();
    })
  },
  setActive:function(){
    let info = this.data.accountInfo;
    if (info.withdrawableBalance-info.serviceCharge>=1){
      this.setData({
        active:true
      })
    }else{
      this.setData({
        active: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳转提现页
   */
  gotoCash:function(){
    if (this.data.enable && this.data.active) {
      commonUtil.request(api.settleAccountV1Url+'/list').then((res) => {
        if (res && res.withdrawalAccounts.length) {
          if (res.isLimit === false){
            wx.navigateTo({
              url: '../cashWithdrawal/cashWithdrawal/cashWithdrawal',
            })
          }else{
            commonUtil.showToast('已超过单日提现次数', 1500)
          }
        }else{
          commonUtil.showToast('请先绑定收款账户',1500)
        }
      })
    }
  },
  focus: function () {
    // wx.openUrl('https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU2NDU1Nzk1Mw==&scene=124#wechat_redirect')
    // wx.openUrl({ url: 'https://baidu.com' })
    console.log(1)
    wx.requestSubscribeMessage({
      tmplIds: ['sZrzf3D_KEJxIeaWj9asDG9oyMN2YRMbuD7-VCDCxgI'],
      success(res) { console.log(res) },
      fail(res) { console.log(res) },
      complete(res) { console.log(res) }
    })
  },
})