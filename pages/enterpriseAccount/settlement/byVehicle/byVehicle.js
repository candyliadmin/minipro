const app = getApp();
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const dateFormat = require('../../../../utils/dateFormat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    incomeList: [],
    pageNo: 0,
    totalPage: 1,
    date: '', //日期
    routeId: '',//线路ID
    routeName:'',//线路名称
  },
  getIncomeList: function (isRefresh) {
    const that = this;
    const page = isRefresh ? 0 : that.data.pageNo;

    commonUtil.request(api.royaltySummaryUrl + '/royaltySummaryVehicle', {
      runDate: dateFormat.customDate(that.data.date, ''),
      routeId:that.data.routeId,
      page: page,
    }).then((res) => {
      wx.hideToast();
      that.setData({
        incomeList: isRefresh ? res.page.content : that.data.billList.concat(res.page.content),
        pageNo: ++res.page.number,
        totalPage: res.page.totalPages,
        routeName: res.page.content[0].routeName
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: options.date,
      routeId: options.routeId
    })
    this.getIncomeList(true);
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
    this.getIncomeList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageNo = this.data.pageNo;
    if (pageNo >= this.data.totalPage) {
      wx.showToast({
        title: '没有更多啦',
        icon: 'success',
        duration: 1000
      });
      return;
    } else {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
      });
      this.getIncomeList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})