const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const dateFormat = require('../../../../utils/dateFormat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    date:'',
    dateArr:[],
    data:null,
    today:'',
    todayArr:[],
    isOne:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = dateFormat.formatDate(new Date());
    let month = dateFormat.formatMonth(new Date());
    let d = options.date || month;
    if (d) {
      this.setData({
        date: d,
        today,
        isOne:options.date?false:true,
        dateArr: today.split('-'),
        todayArr: today.split('-')
      })
      this.getList(true);
      this.getData();
    }else{
      commonUtil.showToast('参数错误')
    }
  },
  /**
   * 获取排班列表
   */
  getData: function () {
    let that = this;
    let date = that.data.date;
    commonUtil.request(api.receiptsStatisticUrl, {
      userId: '',
      month: date ? date.replace(/-/g, '') : ''
    }).then((res) => {
      wx.hideToast();
      that.setData({
        data: res
      })
      wx.stopPullDownRefresh();
    })
  },
  getList: function (isRefresh) {
    let that = this;
    let date = that.data.date;
    let pageNo = isRefresh ? 0 : that.data.pageNo;

    commonUtil.request(api.workOrderStatisticsUrl + '/month/day', {
      page: pageNo,
      size: 10,
      month: date ? date.replace(/-/g, '') : ''
    }).then((res) => {
      wx.hideToast();
      that.setData({
        list: isRefresh ? res.content : that.data.list.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages,
        loading: false,
      })
      wx.stopPullDownRefresh();
    })
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
  getMoreList:function(){
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
      this.getList();
    }
  },
  bindPickerChange:function(e){
    let d = e.detail.value;
    if (d) {
      this.setData({
        date: d,
        dateArr: d.split('-')
      })
      this.getData();
      this.getList(true)
    }
  }
})