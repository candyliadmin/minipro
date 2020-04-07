const app = getApp();
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
const dateFormat = require('../../../utils/dateFormat.js');

const today = dateFormat.formatDate(new Date());
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    scheduleList: [],
    pageNo: 0,
    totalPage: 1,
    loading:false,
    isError: false, //是否请求失败
    directionType: BASICDATA.directionType,
    clockInState: BASICDATA.clockInState,
    reportState: BASICDATA.reportState,
    date: today,
    dateArr: today ? today.split("-") : [],
    today: today,
    tabBar:{index:1},
    isOneDay:false,
  },
  /**
   * 获取排班列表
   */
  getScheduleList: function (isRefresh) {
    let that = this;
    let date = that.data.isOneDay ?that.data.isOneDay:that.data.date;
    if (isRefresh) {
      that.setData({
        pageNo: 0,
        totalPage: 1,
      })
    }
    commonUtil.request(api.receiptsUserUrl, {
      page: that.data.pageNo,
      size: 10,
      userId: that.data.userId || '',
      date: date ? date.replace(/-/g, '') : ''
    }).then((res) => {
      wx.hideToast();
      that.setData({
        scheduleList: isRefresh ? res.content : that.data.scheduleList.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages,
        loading: false,
      })
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const day = options.day || '';
    const uid = options.uid || '';
    this.setData({
      isOneDay: day,
      userId:uid
    })
    this.getScheduleList(true);
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
  getMoreList: function () {
    let pageNo = this.data.pageNo;
    if (pageNo < this.data.totalPage && !this.data.loading) {
      this.setData({
        loading:true,
      })
      this.getScheduleList();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳转打卡页面
   */
  showClockIn: function (e) {
    let id = e.currentTarget.dataset.id;
    let vid = e.currentTarget.dataset.vid;
    wx.navigateTo({
      url: '../clockIn/clockIn?id=' + id + '&&vehicleid=' + vid,
    })
  },
  /**
   * 选择时间
   */
  bindPickerChange: function (e) {
    const val = e.detail.value;
    if (val) {
      this.setData({
        date: val,
        dateArr: val.split("-")
      })
      this.getScheduleList(true);
    }
  },
  /**
   * 设置前一天后一天
   */
  setDate: function (e) {
    const val = e.currentTarget.dataset.day;
    if (val) {
      const day = dateFormat.formatDate(dateFormat.getCustomday(new Date(this.data.date), parseInt(val)));
      if (!day || day>this.data.today) return false;
      this.setData({
        date: day,
        dateArr: day.split('-'),
      })
      this.getScheduleList(true);
    }
  }
})