// pages/dataDetails/dataDetails.js
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const dateFormat = require('../../../../utils/dateFormat.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    billList: [],
    pageNo: 0,
    totalPage: 1,
    tabArr: [{ name: '订单明细' }, { name: '账单查询' }],
    tabIndex: 0,
    startday: '',//汇总开始日期
    endday: '',//汇总结束日期
    today: '',
    total:0,
  },
  getBillList: function (isRefresh) {
    let that = this;
    const page = isRefresh ? 0 : that.data.pageNo;
    commonUtil.request(api.royaltySummaryUrl +'/royaltySummary', {
      page:page,
      startDate: that.data.startday ? dateFormat.customDate(that.data.startday) : '',
      endDate: that.data.endday ? dateFormat.customDate(that.data.endday) : '',
    }).then((res) => {
      wx.hideToast();
      that.setData({
        billList: isRefresh ? res.page.content : that.data.billList.concat(res.page.content),
        pageNo: ++res.page.number,
        totalPage: res.page.totalPages,
        total: res.royaltyAmountSum.toFixed(2)
      })
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = dateFormat.formatDate(new Date());
    this.setData({
      today: today,
      endday: dateFormat.formatDate(dateFormat.getCustomday('', -4)),
      startday: dateFormat.formatDate(dateFormat.getCustomday('', -7))
    })
    this.getBillList(true);
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
    this.getBillList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
      this.setTabList(this.data.tabIndex);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindPickChange: function (e) {
    let val = e.detail.value;
    let type = e.currentTarget.dataset.type;
    if (type === 'start') {
      this.setData({
        startday: val
      })
    }
    if (type === 'end') {
      this.setData({
        endday: val
      })
    }
    this.getBillList(true)
  },
  clearDay: function () {
    this.setData({
      startday: '',
      endday: ''
    })
    this.getBillList(true);
  },
})