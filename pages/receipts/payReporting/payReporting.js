// pages/mySchedule/payReporting/payReporting.js
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scheduleInfo: {},
    directionType: BASICDATA.directionType,
    priceList: [],
    receipt: {},
    total: 0,
    receiptid: 0,
    index: 0,
    back:1,
    showModal:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      receiptid: options.id || '',
      index:options.index || 0,
      back:options.back || 1
    })
    if (this.data.receiptid) {
      this.getReceipt();
    } else {
      this.setPriceList();
    }
  },
  /**
   * 设置价格列表
   */
  setPriceList: function() {
    let priceList = [];
    let receiptList = this.data.receipt && this.data.receipt.receiptItems ? this.data.receipt.receiptItems : [];
    this.setData({
      priceList: receiptList,
      total: this.data.receipt.totalFares
    })
  },
  /**
   * 获取上报信息
   */
  getReceipt: function() {
    let that = this;
    commonUtil.request(api.receiptsUrl + '/' + that.data.receiptid).then((res) => {
      wx.hideToast();
      that.setData({
        receipt: res
      })
      that.setPriceList();
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
    this.setData({
      showModal:false,
    })
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
  /**
   * 增加数量
   */
  addHandle: function(e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let priceList = this.data.priceList;
    if (index || index == 0 && type) {
      if (priceList && priceList[index]) {
        priceList[index][type]++;
        this.setData({
          priceList: priceList
        })
        this.calculateTotal(index);
      }
    }
  },
  /**
   * 减少数量
   */
  reduceHandle: function(e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let priceList = this.data.priceList;
    if (index || index == 0 && type) {
      if (priceList && priceList[index] && priceList[index][type] > 0) {
        priceList[index][type]--;
        this.setData({
          priceList: priceList
        })
        this.calculateTotal(index);
      }
    }
  },
  /**
   * 人数输入时触发
   */
  numHandle: function(e) {
    let num = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let priceList = this.data.priceList;
    if (index || index == 0) {
      if (num >= 0 && priceList[index] && type) {
        priceList[index][type] = num;
        this.setData({
          priceList: priceList
        })
        this.calculateTotal(index);
      }
    }
  },
  /**
   * 计算总价
   */
  calculateTotal: function(index) {
    let list = this.data.priceList;
    let total = 0;
    if ((index || index == 0) && list && list[index]) {
      list[index]['cashIncome'] = (list[index]['fares'] * list[index]['adultNum'] + list[index]['fares'] * list[index]['childNum'] * 0.5).toFixed(2);
      this.setData({
        priceList: list
      })
    }
    for (let i = 0; i < list.length; i++) {
      total -= -list[i].cashIncome;
    }
    this.setData({
      total: total.toFixed(2)
    })
  },
  /**
   * 上报
   */
  submitHandle: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 上报
   */
  reporting: function () {
    let that = this;
    let params = {
      id: parseInt(that.data.receiptid),
      receiptItems: that.data.priceList,
    }
    commonUtil.request(api.reportUrl, params, "PUT").then((res) => {
      wx.hideToast();
      wx.redirectTo({
        url: '../reportSuccess/reportSuccess?total=' + that.data.total + '&back=' + that.data.back,
      })
    },(res)=>{
      commonUtil.showToast(res.errorMsg);
    })
  },
  cancel:function(){
    this.setData({
      showModal:false
    })
  },
  confirm: function () {
    this.reporting();
  },
  /**
   * 提交价格明细
   */
  payReporting: function() {
    let that = this;
    let params = {
      id: parseInt(that.data.receiptid),
      receiptItems: that.data.priceList,
    }
    commonUtil.request(api.receiptsItemUrl, params, "PUT").then((res) => {
      wx.hideToast();
      wx.showToast({
        title: '保存成功',
      })
      if (that.data.back == 2) {
        wx.navigateBack({
          delta: 2
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})