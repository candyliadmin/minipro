// pages/driveAndPassenger/driveAndPassenger.js
const api = require('../../config/api.js');
const commonUtil = require('../../utils/commonUtil.js');
const BASICDATA = require('../../utils/data.js');
let globalData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: globalData.imgUrl,
    searchstr: '',
    pageNo: 0,
    totalPage: 1,
    driveAndPassenger: [],
    roleType: BASICDATA.roleType,
    genderType:BASICDATA.genderType,
  },
  getDataList: function (isRefresh) {
    let that = this;
    if (isRefresh) {
      that.setData({
        pageNo: 0,
        totalPage: 1,
      })
    }
    commonUtil.request(api.driverAndPassengerUrl, {
      isAndQuery:false,
      name: that.data.searchstr,
      login: that.data.searchstr,
      phoneNumber: that.data.searchstr,
      page: that.data.pageNo
    }).then((res) => {
      let results = res.content;
      for (let i = 0; i < results.length; i++) {
        let arr = results[i].position;
        results[i].isdriver = false;
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] == 'DRIVER') {
            results[i].isdriver = true;
            break;
          }
        }
      }
      that.setData({
        driveAndPassenger: isRefresh ? results : that.data.driveAndPassenger.concat(results),
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
    this.getDataList(true);
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
    this.getDataList(true);
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
      this.getDataList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳转司乘位置追踪
   */
  showDriverPassengerPos() {
    wx.navigateTo({
      url: 'driverPassengerPos/driverPassengerPos',
    })
  },
  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value
    })
    this.getDataList(true);
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
    this.getDataList(true)
  },
  addhandle(){
    this.getDataList(true);
  },
  //清空搜索框
  activity_clear(e) {
    this.setData({
      searchstr: ''
    })
  },
  /**
   * 跳转扫码发车页面
   */
  gotoCode:function(e){
    const uid = e.currentTarget.dataset.uid;
    const index = e.currentTarget.dataset.index;
    if(uid){
      wx.setStorageSync('codeUser', this.data.driveAndPassenger[index]);
      wx.navigateTo({
        url: "/pages/codeDeparture/codeDeparture/codeDeparture?uid="+uid,
      })
    }else{
      commonUtil.showToast('用户异常！')
    }
  },
  /**
   * 跳转工单统计
   */
  showStatistic: function (e) {
    const uid = e.currentTarget.dataset.uid;
    const index = e.currentTarget.dataset.index;
    if (uid) {
      wx.navigateTo({
        url: "/pages/mySchedule/statistics/statistics?uid=" + uid+'&type=1',
      })
    } else {
      commonUtil.showToast('用户异常！')
    }
  },
})