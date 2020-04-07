const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    carList: [],
    pageNo: 0,
    totalPage: 1,
    vehicleType: BASICDATA.vehicleType,
    searchstr: '',
  },
  goVehicleMonitor: function() {
    wx.navigateTo({
      url: '../vehicleMonitor/vehicleMonitor',
    })
  },
  addVehicle: function() {
    wx.navigateTo({
      url: 'create/create',
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  getCarList: function(isRefresh) {
    let that = this;
    if (isRefresh) {
      that.setData({
        pageNo: 0,
        totalPage: 1,
      })
    }
    commonUtil.request(api.vehiclesUrl, {
      licensePlate: that.data.searchstr,
      page: that.data.pageNo,
      size: 30
    }).then((res) => {
      wx.hideToast();
      that.setData({
        carList: isRefresh ? res.content : that.data.carList.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages
      })
      wx.stopPullDownRefresh();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCarList(true);
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
    this.getCarList(true);
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
    this.getCarList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
      this.getCarList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 跳转至车辆位置页
   */
  showVehiclePos: function() {
    wx.navigateTo({
      url: '/pages/vehicle/vehiclePosition/vehiclePosition',
    })
  },
  /**
   * 跳转至车辆监控页
   */
  showVehicleMonitor: function() {
    wx.navigateTo({
      url: '../vehicleMonitor/vehicleMonitor',
    })
  },
  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value
    })
    this.getCarList(true);
    console.log('搜索框输入时触发')
  },
  //点击完成按钮搜索回调
  endsearchList(e) {
    this.getCarList(true);
    console.log('查询数据')
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
    this.getCarList(true);
  },
  addhandle() {
    this.getCarList(true);
  },
  //清空搜索框
  activity_clear(e) {
    this.setData({
      searchstr: ''
    })
  },
})