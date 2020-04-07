// pages/line/line.js
const app = getApp();
const api = require('../../config/api.js');
const commonUtil = require('../../utils/commonUtil.js');
const BASICDATA = require('../../utils/data.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    searchstr: '',
    pageNo:0,
    totalPage:1,
    lineList:[],
    linetype: BASICDATA.linetype,
    directionDes: BASICDATA.directionDes,
  },
  getLineData: function (isRefresh) {
    let that = this;
    if (isRefresh) {
      that.setData({
        pageNo: 0,
        totalPage: 1,
      })
    }
    commonUtil.request(api.routesUrl, {
      name: that.data.searchstr,
      page: that.data.pageNo
    }).then((res) => {
      that.setData({
        lineList: isRefresh ? res.content : that.data.lineList.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages
      })
      wx.stopPullDownRefresh();
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLineData(true);
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
    this.getLineData(true);
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
      this.getLineData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value,
    })
    this.getLineData(true);
    console.log('搜索框输入时触发')
  },
  //点击完成按钮搜索回调
  endsearchList(e) {
    this.getLineData(true);
    console.log('查询数据')
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
    this.getLineData(true);
  },
  //搜索点击
  addhandle() {
    this.getLineData(true);
  },
  //清空搜索框
  activity_clear(e) {
    this.setData({
      searchstr: ''
    })
  },
})