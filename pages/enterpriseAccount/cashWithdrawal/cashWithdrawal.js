// pages/enterpriseAccount/cashWithdrawal/cashWithdrawal.js
const app = getApp();
let timer = null;//错误提醒计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    cashAmount:'',//提现金额
    active:false,//是否能进入下一步
    errMsg:['输入金额有误','输入金额大于可提现余额','最小提现金额为1元'],
    errIndex:-1,
    accountInfo: {
      availableBalance: 1200,//可提现余额
      bank:{
        code:'',
        name:'中国农业银行',
        card:'62093786887677'
      },
      serviceCharge:1,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 跳转到身份验证
   */
  gotoVerify:function(){
    if(this.data.active){
      wx.navigateTo({
        url: 'verification/verification?amount='+this.data.cashAmount,
      })
    }
  },
  /**
   * 全部提现
   */
  allCash:function(){
    this.setData({
      cashAmount: this.data.accountInfo.availableBalance.toFixed(2),
      active:true
    })
  },
  /**
   * 监听input更改
   */
  inputChange: function (event){
    let val = event.detail.value;
    var regPos = /^([1-9][0-9]*)(\.[0-9]{0,2})?$/; //非负浮点数
    this.setData({
      active: val > 0
    })
    if (regPos.test(val)) {
      if (val - this.data.accountInfo.availableBalance > 0) {
        this.setTimer(1);
        return val.slice(0, -1);
      } else if (val < this.data.accountInfo.serviceCharge){
        this.setTimer(2);
      }
    } else {
      this.setTimer(0);
      return val.slice(0, -1);
    }
  },
  setTimer:function(index){
    if(index>-1){
      this.clearTimer();
      this.setData({
        errIndex: index
      })
      this.hideErrorMsg();
    }
  },
  /**
   * 渐出错误提示
   */
  hideErrorMsg: function () {
    timer = setTimeout(() => {
      this.setData({
        errIndex:-1
      })
    }, 1500)
  },
  clearTimer: function () {
    if (timer) clearTimeout(timer);
  }
})