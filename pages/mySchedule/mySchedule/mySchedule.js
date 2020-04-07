// pages/mySchedule/mySchedule.js
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
    loading: false, // 分页是否在加载中
    isError: false, //是否请求失败
    directionType: BASICDATA.directionType, // 方向字典
    clockInState: BASICDATA.clockInState, // 打卡次数字典
    date: today, // 当前选择日期
    dateArr: today?today.split("-"):[], // 格式化当前选择日期
    today:today, // 今天
  },
  /**
   * 获取排班列表
   * @isRefresh 是否重新加载
   */
  getScheduleList: function (isRefresh) {
    const that = this;
    const date = that.data.date;
    let pageNo = isRefresh?0:that.data.pageNo;

    // 根据当前用户角色展示排班信息
    const roles = app.globalData.roleName;
    let roleType = '';
    if (roles.indexOf('DRIVER') != -1 && roles.indexOf('ATTENDANT') != -1){
      roleType = '';
    } else if (roles.indexOf('DRIVER') != -1){
      roleType = 0;
    } else if (roles.indexOf('ATTENDANT') != -1){
      roleType = 1;
    }
    commonUtil.request(api.workEffortRolesUrl, {
      page: pageNo,
      size:10,
      roleType: roleType,
      day: date?date.replace(/-/g,''):''
    }).then((res) => {
      wx.hideToast();
      that.setData({
        scheduleList: isRefresh ? res.content: that.data.scheduleList.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages,
        loading:false,
      })
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScheduleList(true);
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
    //处理打卡返回当页不刷新数据更新效果
    const item = wx.getStorageSync("workEffortItem");// 更新的排班数据
    if (wx.getStorageSync("workEffortItem")){
      let list = this.data.scheduleList;
      const index = wx.getStorageSync("workEffortIndex");// 需要更新的数据索引值
      if(index || index == 0){
        list[index] = item;
        this.setData({
          scheduleList:list
        })
        wx.removeStorageSync("workEffortItem");// 更新后清空缓存数据
        wx.removeStorageSync("workEffortIndex");
      }
    }
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
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
  },
  /**
   * 下拉加载更多
   */
  getMoreList:function(){
    const pageNo = this.data.pageNo;
    const loading = this.data.loading;
    if (pageNo < this.data.totalPage && !loading) {
      this.setData({
        loading:true
      })
      this.getScheduleList();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 跳转打卡页面
   */
  showClockIn: function(e) {
    const id = e.currentTarget.dataset.id; // 排班ID
    const vid = e.currentTarget.dataset.vid; // 车辆ID
    const index = e.currentTarget.dataset.index; // 数据集索引值
    wx.setStorageSync("workEffortIndex", index); // 缓存当条操作排班数据
    wx.navigateTo({
      url: '../clockIn/clockIn?id=' + id +'&&vehicleid='+vid,
    })
  },
  /**
   * 选择时间
   */
  bindPickerChange:function(e){
    const val = e.detail.value;
    if(val){
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
  setDate:function(e){
    const val = e.currentTarget.dataset.day;
    if(val){
      const day = dateFormat.formatDate(dateFormat.getCustomday(new Date(this.data.date),parseInt(val)));
      if(!day) return false;
      this.setData({
        date: day,
        dateArr:day.split('-'),
      })
      this.getScheduleList(true);
    }
  }
})