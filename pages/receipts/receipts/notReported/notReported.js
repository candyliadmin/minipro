// pages/receipts/receipts.js
const app = getApp();
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const BASICDATA = require('../../../../utils/data.js');
const dateFormat = require('../../../../utils/dateFormat.js');
const minday = dateFormat.formatDate(dateFormat.getCustomday('', -2));

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
    activeIndex: 0,
    routeTypeList: ['电车', '地铁', '铁路', '巴士', '渡轮', '有轨电车', '空中升降机', '缆索铁路'],
    startX:0,
    index: 2,
    minday: minday,//三天前，判断是否超时
  },
  getDataList: function(isRefresh) {
    const that = this;
    const pageNo = isRefresh?0:that.data.pageNo;

    commonUtil.request(api.attendantUrl, {
      status: "UNREPORTED",
      page: pageNo
    }).then((res) => {
      const dataList = that.data.dataList;
      const result = res.content;
      that.setData({
        dataList: isRefresh ? result : dataList.concat(result),
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
    this.getDataList(true);
    this.selectComponent("#bar").getNewMsg();
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
    this.getDataList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
  onShareAppMessage: function() {

  },
  canNotMove: function (index){
    const types = ['WORKEFFORT', 'QR','AGENCY'];
    if (types.indexOf(this.data.dataList[index].receiptType)!=-1){
      return true;
    }
    return false;
  },
  touchstart: function (e) {
    let index = e.currentTarget.dataset.index;
    if (this.canNotMove(index)) return false;
    this.setData({
      index: e.currentTarget.dataset.index,
      startX: e.changedTouches[0].pageX,
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    let index = e.currentTarget.dataset.index;
    if (this.canNotMove(index)) return false;
    //列表项数组
    let list = this.data.dataList;
    //手指在屏幕上移动的距离
    //移动距离 = 触摸的位置 - 移动后的触摸位置
    let move = this.data.startX - e.changedTouches[0].pageX;
    // 这里就使用到我们之前记录的索引index
    //比如你滑动第一个列表项index就是0，第二个列表项就是1，···
    //通过index我们就可以很准确的获得当前触发的元素，当然我们需要在事前为数组list的每一项元素添加x属性
    list[this.data.index].x = move > 0 ? -move : 0;
    this.setData({
      dataList: list
    });
  },
  touchend: function (e) {
    let index = e.currentTarget.dataset.index;
    if (this.canNotMove(index)) return false;
    let list = this.data.dataList;
    let move = this.data.startX - e.changedTouches[0].pageX;
    list[this.data.index].x = move > 100 ? -180 : 0;
    this.setData({
      dataList: list
    });
  },
  /**
   * 删除上报信息
   */
  delReceipt:function(e){
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    const that = this;
    commonUtil.request(api.receiptsUrl + '/' + id, {}, "DELETE").then((res) => {
      let dataList = that.data.dataList;
      dataList.splice(index, 1);
      that.setData({
        dataList
      })
      commonUtil.showToast('删除成功')
      wx.stopPullDownRefresh();
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
  showReport: function (id,index) {
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
    }else{
      this.addReceipts();
    }
  },
  unReceipt:function(){
    commonUtil.showToast('该线路未设置票价,暂时无法上报',1500)
  }
})