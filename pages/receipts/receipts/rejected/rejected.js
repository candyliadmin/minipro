// pages/receipts/receipts.js
const app = getApp();
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const BASICDATA = require('../../../../utils/data.js');
const dateFormat = require('../../../../utils/dateFormat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    pageNo: 0,
    totalPage: 1,
    loading:false,
    dataList: [],
    directionType: BASICDATA.directionType,
    activeIndex: 2,
    routeTypeList: ['电车', '地铁', '铁路', '巴士', '渡轮', '有轨电车', '空中升降机', '缆索铁路'],
    index: 2,
    today: '',
    day: '',//已上报日期筛选字段
    minday: '',//三天前，判断是否超时
  },
  getDataList: function (isRefresh) {
    const that = this;
    const pageNo = isRefresh ? 0 : that.data.pageNo;

    commonUtil.request(api.attendantUrl, {
      status: "REJECT",
      page: pageNo,
      date: that.data.date || that.data.day.replace(/-/g, '')
    }).then((res) => {
      that.setData({
        dataList: isRefresh ? res.content : that.data.dataList.concat(res.content),
        pageNo: ++res.number,
        totalPage: res.totalPages,
        loading:false,
      })
      commonUtil.hideLoading();
      wx.stopPullDownRefresh();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      today: dateFormat.formatDate(new Date()),
      minday: dateFormat.formatDate(dateFormat.getCustomday('', -2)),
    });
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
    this.selectComponent("#bar").getNewMsg();
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
    this.getDataList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  getMOreList: function () {
    let pageNo = this.data.pageNo;
    if (pageNo < this.data.totalPage && !this.data.loading) {
      this.setData({
        loading: true
      })
      this.getDataList();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 取消被驳回的上报记录
   */
  cancleReceipt: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '是否取消?',
      content: '取消后，发车记录将被删除!',
      confirmText: '是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
          commonUtil.request(api.cancelReceiptsUrl + '/' + id, {}, "PUT").then((res) => {
            let dataList = that.data.dataList;
            dataList.splice(index, 1);
            that.setData({
              dataList: dataList
            })
          })
        }
      }
    })
  },
  /**
   * 跳转添加发车信息
   */
  addReceipts: function (id) {
    wx.navigateTo({
      url: '../../addReceipts/addReceipts?id=' + (id ? id : ''),
    })
  },
  /**
   * 跳转上报收款页面
   */
  showReport: function (id, index) {
    wx.navigateTo({
      url: '../../payReporting/payReporting?id=' + id + '&index=' + index,
    })
  },
  editReceipt: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    if (id) {
      if (type == 'CUSTOM') {
        this.addReceipts(id);
      } else if (type == 'WORKEFFORT' || type == 'QR' || type == 'AGENCY') {
        this.showReport(id, index);
      }
    } else {
      this.addReceipts();
    }
  },
})