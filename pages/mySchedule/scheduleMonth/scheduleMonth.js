const app = getApp();
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
const dateFormat = require('../../../utils/dateFormat.js');

const todaym = dateFormat.formatMonth(new Date());
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
  getScheduleList: function (isRefresh) {
    let that = this;
    let date = that.data.date;
    const userId = that.data.userId || '';
    if (isRefresh) {
      that.setData({
        pageNo: 0,
        totalPage: 1,
      })
    }
    commonUtil.request(api.receiptsMonthUrl, {
      page: that.data.pageNo,
      userId: userId,
      month: date ? date.replace(/-/g, '') : ''
    }).then((res) => {
      wx.hideToast();
      that.setData({
        scheduleList: isRefresh ? res.content : that.data.scheduleList.concat(res.content),
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
    const uid = options.uid || '';
    const day = options.day || todaym;
    const type = options.type || '';
    this.setData({
      userId: uid,
      date: day ,
      dateArr: day ? day.split("-") : [],
      type
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
        loading:true
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
   * 设置前一月后一月
   */
  setDate: function (e) {
    const val = e.currentTarget.dataset.day;
    if (val) {
      const day = dateFormat.formatMonth(dateFormat.getCustomMonth(new Date(this.data.date), parseInt(val)));
      if (!day || day > this.data.today) return false;
      this.setData({
        date: day,
        dateArr: day.split('-'),
      })
      this.getScheduleList(true);
    }
  },
  gotoList:function(e){
    const index = e.currentTarget.dataset.index;
    if(index || index == 0){
      const item = this.data.scheduleList[index];
      const dateArr = this.data.dateArr;
      if(!item) return false;
      let day = item.day.replace(/(\d+)月(\d+)日/,"$1-$2");
      day = dateArr[0] +'-'+ day;
      wx.navigateTo({
        url: '../scheduleRecord/scheduleRecord?day='+day + '&uid='+this.data.userId ,
      })
    }
  }
})