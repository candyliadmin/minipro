const app = getApp();
let timer = null;//错误提醒计时
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const dateFormat = require('../../../../utils/dateFormat.js');
const BASICDATA = require('../../../../utils/data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    cashAmount: '',//提现金额
    active: false,//是否能进入下一步
    isConfirm: false,//是否能进入下一步
    applySuccess:false,//是否申请成功
    errMsg: ['输入金额有误', '输入金额大于可提现余额', '最小提现金额为1元'],
    errIndex: -1,
    accountInfo: {
      totalBalance: 0,//余额
      withdrawableBalance: 0,//可提现余额
      serviceCharge: 0,
    },
    accontNames: BASICDATA.accountType,
    accountType:[],
    activeIndex:0,
    arrvialTime:'',
    applyInfo:{
      accountName:'糖果屋',
      accountingDate:'',
      amount:0,
      amountFee:0,
    }
  },
  /**
   * 获得账户可提现余额
   */
  getAccount:function(){
    commonUtil.request(api.businessAccountUrl).then((res) => {
      let accountInfo = this.data.accountInfo;
      accountInfo.totalBalance = res.totalBalance;
      accountInfo.withdrawableBalance = res.withdrawableBalance;
      this.setData({
        accountInfo
      })
    })
  },
  /**
   * 获得账户类型
   */
  getAccountType: function () {
    const that = this;
    commonUtil.request(api.settleAccountV1Url).then((res) => {
      res.forEach((item)=>{
        if (item.channel && that.data.accontNames[item.channel]){
          item.sunName = that.data.accontNames[item.channel].name;
          item.image = that.data.accontNames[item.channel].image;
        }
      })
      this.setData({
        accountType:res
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccount();
    this.getAccountType();
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
  gotoVerify: function () {
    if (this.data.active) {
      this.setData({
        isConfirm:true,
        arrvialTime: dateFormat.formatDate(dateFormat.getCustomday('',3))
      })
    }
  },
  /**
   * 全部提现
   */
  allCash: function () {
    const mount = this.data.accountInfo.withdrawableBalance.toFixed(2);
    if (mount>0 && mount > this.data.accountInfo.serviceCharge) {
      this.setData({
        cashAmount: this.data.accountInfo.withdrawableBalance,
        active: true
      })
    }else{
      this.setTimer(0);
    }
  },
  /**
   * 监听input更改
   */
  inputChange: function (event) {
    let val = event.detail.value;
    var regPos = /^([1-9][0-9]*)(\.[0-9]{0,2})?$/; //非负浮点数
    if (regPos.test(val)) {
      if (val - this.data.accountInfo.withdrawableBalance > 0) {
        this.setTimer(1);
        return val.slice(0, -1);
      } else if (val < this.data.accountInfo.serviceCharge) {
        this.setTimer(2);
      }else{
        this.setData({
          active: val > 0,
          cashAmount:val
        })
      }
    } else {
      this.setTimer(0);
      return val.slice(0, -1);
    }
  },
  setTimer: function (index) {
    if (index > -1) {
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
        errIndex: -1
      })
    }, 1500)
  },
  clearTimer: function () {
    if (timer) clearTimeout(timer);
  },
  /**
   * 切换收款账户
   */
  bindPickerChange: function (e) {
    this.setData({
      activeIndex: e.detail.value
    })
  },
  /**
   * 申请提现
   */
  apply:function(){
    const that = this;
    commonUtil.request(api.withDrawalApplyUrl,{
      amount: that.data.cashAmount,
      settleAccountId: that.data.accountType[that.data.activeIndex].id || '',
    },'POST').then((res) => { 
      that.applySucess();
      that.closeDialog();
      that.setData({
        applyInfo:res
      })
    },(res)=>{
      commonUtil.showToast(res.errorMsg, 2000);
      that.closeDialog();
    })
  },
  /**
   * 关闭确认提现金额弹窗
   */
  closeDialog: function () {
    this.setData({
      isConfirm: false
    })
  },
  /**
   * 跳转至申请成功页
   */
  applySucess:function(){
    this.setData({
      applySuccess: true
    })
  },
  /**
   * 申请提现成功返回上一页
   */
  gotoBack:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})