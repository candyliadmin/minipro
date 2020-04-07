const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const dateFormat = require('../../../../utils/dateFormat.js');
const BASICDATA = require('../../../../utils/data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    dateArr:[],
    date:'',
    userList:[],
    roles: BASICDATA.roleType,
    pickType:'day',
    today:'',
    todayArr:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type || 'day';
    let today = dateFormat.formatDate(new Date());
    let month = dateFormat.formatMonth(new Date());
    this.setData({
      type,
      today,
      todayArr: today.split('-'),
      pickType: type == 'month' ? 'month' : 'day',
      date:type=='month'?month:today,
      dateArr: today.split('-')
    })
    this.getUserList(true);
  },
  getUserList: function (isRefresh){
    let that = this;
    let date = that.data.date;
    let pageNo = isRefresh?0:that.data.pageNo;
    let type = that.data.type;

    let params = {
      page: pageNo,
      size: 10,
    }
    if(type == 'month'){
      params.month = date ? date.replace(/-/g, '') : ''
    }else if(type=='day'){
      params.date = date ? date.replace(/-/g, '') : ''
    }

    commonUtil.request(api.workOrderStatisticsUrl + '/' + type, params).then((res) => {
      wx.hideToast();
      that.setData({
        userList: isRefresh ? res.content : that.data.userList.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages,
        loading: false,
      })
      wx.stopPullDownRefresh();
    })
  },
  getMOreList: function () {
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
      this.getUserList();
    }
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
   * 时间筛选
   */
  bindPickerChange:function(e){
    let d = e.detail.value;
    if(d){
      this.setData({
        date: d,
        dateArr: d.split('-')
      })
      this.getUserList(true)
    }
  }
})