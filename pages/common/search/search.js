// pages/search/search.js
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    searchStatus: false,
    pageNo: 0,
    totalPage: 1,
    resultList:[],
    key:'',
    emptyItem:false,
    options:{
      url: api.routesUrl,
      namekey:'shortName',
      icon: app.globalData.imgUrl+'/common/icon/line-icon.png',
      searchKey:'name',
    }
  },
  getSearchResult: function (isRefresh){
    let that = this;
    let options = that.data.options;
    if (isRefresh) {
      that.setData({
        pageNo: 0,
        totalPage: 1,
      })
    }
    let params = {};
    params[options.searchKey] = that.data.keyword;
    params['page'] = that.data.pageNo;
    commonUtil.request(options.url, params).then((res) => {
      that.setData({
        resultList: isRefresh ? res.content : that.data.resultList.concat(res.content),
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
    let key = options.key;
    let empty = options.empty?true:false;
    let searchopt = wx.getStorageSync("searchopt") || {};
    let option = this.data.options;
    Object.assign(option,searchopt);
    this.setData({
      key:key,
      emptyItem: empty,
      options: option,
    })
    this.getSearchResult(true);
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
    let pageNo = this.data.pageNo;
    if (pageNo  >= this.data.totalPage) {
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
      this.getSearchResult();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
    this.getSearchResult(true);
  },
  inputChange: function (e) {
    this.setData({
      keyword: e.detail.value,
    });
    this.getSearchResult(true);
  },
  inputFocus: function () {
    this.setData({
      searchStatus: false
    });
  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  },
  /**
   * 选择该项
   */
  selItem:function(e){
    let index = e.currentTarget.dataset.index;
    let key = this.data.key;
    if(this.data.resultList[index]){
      let result = wx.getStorageSync('selresult') || {};
      result[key] = this.data.resultList[index];
      wx.setStorageSync('selresult', result);
    } else if (index == -1) {
      let result = wx.getStorageSync('selresult') || {};
      result[key] = {};
      wx.setStorageSync('selresult', result);
    }
    wx.navigateBack();
  }
})