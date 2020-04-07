const app = getApp();
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const statusObj = {
  submitted: { name: '待激活',image:''},
  pedding: { name: '审核中', image: 'common/icon/auditing.png' },
  succeeded: { name: '已通过', image: 'common/icon/passed.png' },
  failed: { name: '未通过', image: 'common/icon/unpass.png' },
  frozen: { name: '冻结', image: '' },
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    dataList:[], // 修改历史
    statusObj: statusObj,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  /**
   * 获取历史申请记录
   */
  getList:function(){
    commonUtil.request(api.accountHistoryUrl,{
      page:0,
      size:5,
    }).then((res) => {
      this.setData({
        dataList:res.content,
      })
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

  }
})