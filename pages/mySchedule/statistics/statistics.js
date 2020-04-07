const app = getApp();
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
const dateFormat = require('../../../utils/dateFormat.js');

const today = dateFormat.formatDate(new Date());
const todaym = dateFormat.formatMonth(new Date());
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    data: {
      "runTimes":0,
      "runDays":0,
      "routeReceipts":[]
    },
    positionType: {
      "driver": '司机',
      "attendant": '乘务',
    },
    date: todaym,
    dateArr: today ? today.split("-") : [],
    today: todaym,
    tabBar: { index: 2 },
    userId:'',
    type:'',
  },
  /**
   * 获取排班列表
   */
  getData: function () {
    let that = this;
    let date = that.data.date;
    const userId = that.data.userId;
    commonUtil.request(api.receiptsStatisticUrl,{
      userId:userId,
      month: date ? date.replace(/-/g, '') : ''
    }).then((res) => {
      wx.hideToast();
      that.setData({
        data: res
      })
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const uid = options.uid || '';
    const type = options.type || '';
    this.setData({
      userId: uid,
      type
    })
    this.getData();
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
   * 选择时间
   */
  bindPickerChange: function (e) {
    const val = e.detail.value;
    if (val) {
      const daym = dateFormat.formatMonth(new Date(val));
      const lastday = this.getLastDay(val);
      if (!daym || daym > this.data.today) return false;
      this.setData({
        date: val,
        dateArr: (daym + '-' + lastday).split('-'),
      })
      this.getData();
    }
  },
  /**
   * 设置前一月后一月
   */
  setDate: function (e) {
    const val = e.currentTarget.dataset.day;
    if (val) {
      const daym = dateFormat.formatMonth(dateFormat.getCustomMonth(new Date(this.data.date), parseInt(val)));
      const lastday = this.getLastDay(val);
      if (!daym || daym>this.data.today) return false;
      this.setData({
        date: daym,
        dateArr: (daym + '-' + lastday).split('-'),
      })
      this.getData();
    }
  },
  /**
   * 获取某月的最后一天
   */
  getLastDay: function (val){
    const day = dateFormat.formatDate(dateFormat.getCustomMonth(new Date(this.data.date), parseInt(val))).split('-');
    return (new Date(day[0], day[1], 0)).getDate();
  },
  /**
   * 跳转至按月统计列表页
   */
  gotoList:function(){
    const uid = this.data.userId || '';
    const day = this.data.date || '';
    const type = this.data.type || '';
    wx.navigateTo({
      url: '../scheduleMonth/scheduleMonth?uid='+uid+'&day='+day+'&type='+type,
    })
  }
})