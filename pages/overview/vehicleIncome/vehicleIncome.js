  // pages/overview/vehicleIncome/vehicleIncome.js
const app = getApp();
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const dateFormat = require('../../../utils/dateFormat.js');
const BASICDATA = require('../../../utils/data.js');
let today = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    incomeList: [],
    pageNo: 0,
    totalPage: 1,
    yesterday: dateFormat.formatDay(dateFormat.getYesterday()),
    today: dateFormat.formatTime(today),
    type: '',//1是本月
    overViewType: BASICDATA.overViewType,
    agencyId: '',
    routeId: '',
    routeName:''
  },
  getIncomeList: function () {
    let that = this;
    let url = '', params = {};
    switch (that.data.type) {
      case '0':
        url = api.vehicleIncomeTodayUrl;
        params = {
          routeId: that.data.routeId,
          agencyId: that.data.agencyId
        }
        break;
      case '1':
        url = api.vehicleIncomeUrl;
        params = {
          routeId: that.data.routeId,
          date: dateFormat.customDate(dateFormat.getYesterday()),
          agencyId: that.data.agencyId
        };
        break;
      case '2':
        url = api.vehicleDateScopeUrl;
        params = {
          routeId: that.data.routeId,
          agencyId: that.data.agencyId,
          startDate: dateFormat.customDate(dateFormat.getFirstDayOfMonth(today)),
          endDate: dateFormat.customDate(dateFormat.getYesterday()),
        };
        break;
    }
    commonUtil.request(url, params).then((res) => {
      wx.hideToast();
      that.setData({
        incomeList: res,
        routeName: res && res.length ? res[0].routeName : ''
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type || '',
      agencyId: options.agencyId,
      routeId:options.routeId
    })
    this.getIncomeList();
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
    // let pageNo = this.data.pageNo;
    // pageNo = pageNo + 1;
    // if (pageNo + 1 > this.data.totalPage) {
    //   wx.showToast({
    //     title: '没有更多啦',
    //     icon: 'success',
    //     duration: 1000
    //   });
    //   return;
    // } else {
    //   wx.showToast({
    //     title: '加载中',
    //     icon: 'loading',
    //   });
    //   this.getIncomeList();
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})