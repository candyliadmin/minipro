// pages/overview.js
import wxCharts from '../../lib/plugin/wxchart/wxcharts-min.js';
const api = require('../../config/api.js');
const commonUtil = require('../../utils/commonUtil.js');
const dateFormat = require('../../utils/dateFormat.js');
let lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '',
    endTime: '',
    todayRevenue:{
      todayOnline:0,
      todayOffline:0,
      total: 0,
      agencyId: ''
    },
    yesterday: '',
    yesterdayRevenue:{
      yesterdayOnline:0,
      yesterdayOffline: 0,
      total: 0,
      agencyId: ''
    },
    monthRevenue: {
      monthOnline: 0,
      monthOffline: 0,
      total: 0,
      agencyId:''
    },
    currentMonthList:[],
    activeIndex: 1,
    isFirstDay: false
  },
  getDatas:function(){
    let that = this;
    commonUtil.request(api.overviewUrl).then((res) => {
      wx.hideToast();
      let todayOnline = res.today ? (res.today.grandTotalOnline || 0) : 0;//今日线上营收
      let todayOffline = res.today ? (res.today.grandTotalOffline || 0) : 0;//今日现金营收
      let todayTotal = todayOnline - (- todayOffline);
      let yesterdayOnline = res.yesterday ? (res.yesterday.grandTotalOnline || 0) : 0;//昨日线上营收
      let yesterdayOffline = res.yesterday ? (res.yesterday.grandTotalOffline || 0) : 0;//昨日现金营收
      let yesterdayTotal = yesterdayOnline - (- yesterdayOffline);
      let monthOffline = res.month ? (res.month.grandTotalOffline || 0) : 0;//本月线上营收
      let monthOnline = res.month ? (res.month.grandTotalOnline || 0) : 0;//本月现金营收
      let monthTotal = monthOnline - (- monthOffline);
      that.setData({
        todayRevenue: {
          todayOnline: todayOnline,
          todayOffline: todayOffline.toFixed(2),
          total: todayTotal.toFixed(2),
          agencyId: res.today ? res.today.agencyId : '',
        },
        yesterdayRevenue: {
          yesterdayOnline: yesterdayOnline,
          yesterdayOffline: yesterdayOffline.toFixed(2),
          total: yesterdayTotal.toFixed(2),
          agencyId: res.yesterday ? res.yesterday.agencyId : '',
        },
        monthRevenue: {
          monthOnline: monthOnline,
          monthOffline: monthOffline.toFixed(2),
          total: monthTotal.toFixed(2),
          agencyId: res.month ? res.month.agencyId : '',
        },
        currentMonthList: res.incomeList || []
      })
      that.creatLineChart();
    })
  },
  creatLineChart: function () {
    let windowWidth = 320;
    let today = new Date();
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    console.log(windowWidth)
    let monthList = this.data.currentMonthList;
    let dateList = [];//本月已生成营收额的日期
    let dataList = [];//营收额集合
    let today_year = today.getFullYear();
    let today_month = today.getMonth();
    let today_day = today.getDate();
    let max_data = 0;
    for (let i = 1; i < today_day;i++){
      dateList.push((today_month + 1) + '月' + i + '号');
      for (let j = 0; j < monthList.length; j++) {
        let run_day = monthList[j].runDay?new Date(monthList[j].runDay):'';
        let _day = run_day ? run_day.getDate() : '';
        if (monthList[j] && _day == i) {
          let grandTotalOnline = monthList[j].grandTotalOnline || 0;
          let grandTotalOffline = monthList[j].grandTotalOffline || 0;
          let total = grandTotalOnline - (-grandTotalOffline);
          dataList.push(total);
          break;
        }
      }
      if (!dataList[i-1]){
        dataList.push(0.00)
      }
      max_data = max_data <= dataList[i - 1] ? dataList[i - 1] : max_data;
    }
    if (!dataList.length || !dateList.length) return;
    if(max_data == 0){
      max_data = 1;
    }else{
      max_data = Math.ceil(max_data)
    }
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: dateList,
      animation: false,
      series: [{
        name: '本月营收',
        data: dataList,
        color: "#3E7EE2",
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: max_data,
        gridColor: "#BCDDFF"
      },
      width: windowWidth,
      height: 260,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      // extra: {
      //   lineStyle: 'curve'
      // }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = new Date();
    let isFirstDay = today.getDate() == 1 ? true : false;
    this.setData({
      today: dateFormat.formatDay(today),
      endTime: dateFormat.formatTime(today),
      yesterday: dateFormat.formatDay(dateFormat.getYesterday(today)),
      isFirstDay: isFirstDay
    })
    this.getDatas();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

})