// pages/enterpriseAccount/cashWithdrawal/verification/verification.js
const app = getApp();
let c_time = null;//倒计时计时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    accountInfo: {
      availableBalance: 1200,//可提现余额
      bank: {
        code: '',
        name: '中国农业银行',
        card: '62093786887677'
      },
      serviceCharge: 1,
      tel:'18511753305'
    },
    active:false,//是否可进入下一步
    cashAmount:0,
    phone:'',
    isClick:true,//是否重新获取
    codeMsg:'获取验证码',
    totalTime:60,
    showErrorMsg:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const reg = /^(\d{3})\d*(\d{4})$/;
    const str2 = this.data.accountInfo.tel.replace(reg, '$1****$2');
    this.setData({
      cashAmount:options.amount || 0,
      phone: str2
    })
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
  gotoSuccess:function(){
    if(this.data.active){
      wx.redirectTo({
        url: '../success/success',
      })
    }
  },
  getCode: function () {
    this.setData({
      isClick: false,
      codeMsg:'重新发送'
    })
    this.countDown();
  },
  /**
   * 倒计时
   */
  countDown:function(){
    if(!this.data.isClick){
      c_time = setInterval(()=>{
        if(this.data.totalTime<=1){
          clearInterval(c_time);
          this.setData({
            isClick:true,
            totalTime:60
          })
        } else {
          this.setData({
            totalTime: --this.data.totalTime
          })
        }
      },1000)
    }
  },
  codeChange:function(event){
    if(event.detail.value){
      this.setData({
        active:true
      })
    } else {
      this.setData({
        active: false
      })
    }
  }
})