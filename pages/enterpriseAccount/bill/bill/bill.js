// pages/operationManage/workEfforts/workEfforts.js
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
    operationList: [],
    pageNo: 0,
    pageSize: 10,
    totalPage: 1,
    loading: false,
    billSelect: [{ value: '', name: '全部' }, { value: 'WITHDRAW', name: '余额提现' }, { value: 'SETTLEMENT', name: '票款结算' }, { value: 'WITHDRAW_FAIL', name: '提现失败'}],
    date: dateFormat.formatMonth(new Date()),
    dateArr: [(new Date()).getFullYear(), (new Date()).getMonth() + 1],
    billIndex: 0,
    type: {
      WITHDRAW: {
        name: '余额提现',
        icon:'/page/account/zhangdan_tx.png'
      },
      SETTLEMENT: {
        name: '票款结算',
        icon: '/page/account/piaokuang_js.png'
      },
      WITHDRAW_FAIL: {
        name: '提现失败',
        icon: '/page/account/shibai.png'
      }
    }
  },
  /**
   * 获取营运列表
   */
  getOperationList: function (isRefresh) {
    const that = this;
    const date = that.data.date;
    const pageNo = isRefresh ? 0 : that.data.pageNo;
    
    commonUtil.request(api.agencyBillUrl, {
      type: that.data.billSelect[that.data.billIndex].value,
      startDate: dateFormat.customDate(dateFormat.getFirstDayOfMonth(new Date(date))),
      endDate: dateFormat.customDate(dateFormat.getLastDayOfMonth(date)),
      page: pageNo,
      pageSize: that.data.pageSize
    }).then((res) => {
      wx.hideToast();
      that.setData({
        operationList: isRefresh ? res.content : that.data.operationList.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages,
        loading:false
      })
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOperationList(true);
  },
  getMOreList: function () {
    let pageNo = this.data.pageNo;
    if (pageNo < this.data.totalPage && !this.data.loading) {
      this.setData({
        loading: true
      })
      this.getOperationList();
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
    this.getOperationList(true);
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
  navigate: function (e) {
    const type = e.currentTarget.dataset.type || '';
    const id = e.currentTarget.dataset.id || '';
    wx.navigateTo({
      url: '../billDetail/billDetail?type=' + type + '&id=' + id,
    })
  },
  /**
   * 选择框回显
   */
  bindPickerChange: function (e) {
    this.setData({
      billIndex: e.detail.value
    })
    this.getOperationList(true);
  },

  bindPickerTimeChange: function (e) {
    this.setData({
      date: e.detail.value,
      dateArr: e.detail.value.split('-')
    })
    this.getOperationList(true);
  }

})