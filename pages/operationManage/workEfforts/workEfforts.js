// pages/operationManage/workEfforts/workEfforts.js
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
const dateFormat = require('../../../utils/dateFormat.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    operationList: [],
    directionType:BASICDATA.directionType,
    directionSelect: BASICDATA.directionType,
    directionIndex: 0,
    routeId: 0,
    routeDir: 0,
    pageNo: 0,
    totalPage: 1,
    date:'',
    dateArr:[],
    loading:false,
  },
  /**
   * 获取营运列表
   */
  getOperationList: function(isRefresh) {
    let that = this;
    const page = isRefresh?0:that.data.pageNo;

    commonUtil.request(api.workEffortsUrl, {
      routeId: parseInt(that.data.routeId),
      routeDirectionId: that.data.directionSelect[that.data.directionIndex].value,
      date: dateFormat.customDate(new Date(that.data.date)),
      status:'DRT',
      page: page
    }).then((res) => {
      wx.hideToast();
      that.setData({
        operationList: isRefresh ? res.content : that.data.operationList.concat(res.content),
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
  onLoad: function(options) {
    let route = wx.getStorageSync("route");
    this.setData({
      routeId: route.id || 0,
      routeDir: route.directionId || 0,
      date: dateFormat.formatDate(new Date()),
      dateArr: dateFormat.formatDate(new Date()).split('-')
    })
    this.setDir();
  },
  setDir: function() {
    const dir = this.data.routeDir;
    let dirs = [];
    if (dir == 1) {
      dirs = [{
        name: '全部方向',
        value: ''
      }, {
        name: '上行',
        value: 0
      }, {
        name: '下行',
        value: 1
      }]
    } else if (BASICDATA.directionType[dir]) {
      dirs = [{
        name:BASICDATA.directionType[dir],
        value: dir
      }]
    }
    this.setData({
      directionSelect: dirs
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOperationList(true);
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
    wx.removeStorageSync("route");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getOperationList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  },
  getMoreList:function(){
    let pageNo = this.data.pageNo;
    if (pageNo < this.data.totalPage && !this.data.loading) {
      this.setData({
        loading: true
      })
      this.getOperationList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 选择框回显
   */
  bindPickerChange: function(e) {
    this.setData({
      directionIndex: e.detail.value
    })
    this.getOperationList(true);
  },
  bindPickerTimeChange: function (e) {
    console.log(e.detail.value.split('-'))
    this.setData({
      date: e.detail.value,
      dateArr: e.detail.value.split('-')
    })
    this.getOperationList(true);
  },
  //删除发车信息
  delReceipt:function(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let that = this;
    if (that.data.operationList[index] && that.data.operationList[index].receiptStatus != 'UNREPORTED') {
      commonUtil.showToast('已现金上报数据不能删除！',1500);
      return false;
    }
    wx.showModal({
      title: '',
      content: '删除后将无法找回，是否确认删除？',
      confirmText: '是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
          commonUtil.request(api.workEffortsUrl + '/' + id, {}, "DELETE").then((res) => {
            let operationList = that.data.operationList;
            operationList.splice(index, 1);
            that.setData({
              operationList: operationList
            })
          }, (res) => {
            commonUtil.showToast(res.errorMsg);
          })
        }
      }
    })
  },
  addReceipt: function (e) {
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;
    if (id && status !='UNREPORTED'){
      commonUtil.showToast('已现金上报数据不能修改！', 1500);
      return false;
    }
    wx.navigateTo({
      url: '../editReceipt/editReceipt'+(id?'?id='+id:''),
    })
  }
})