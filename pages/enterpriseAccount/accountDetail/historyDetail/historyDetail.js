const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const statusObj = {
  submitted: '待激活',
  pedding: '审核中',
  succeeded: '已通过',
  failed: '未通过',
  frozen: '冻结',
}
const cardObj = ['借记卡', '存折', '信用卡', '准贷记卡', '基本户', '一般户'];
const accountTypeObj = {
  b2c: '个人账户',
  b2b: '企业账户',
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,//详情ID
    data: {},
    statusObj: statusObj,
    cardObj:cardObj,
    accountTypeObj:accountTypeObj
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id || 0,
    })
    this.getDetail();
  },
  getDetail:function(){
    const id = this.data.id;
    commonUtil.request(api.accHistoryDetailUrl +'/'+id).then((res) => {
      for(let o in res){
        res[o] = res[o] || '--';
      }
      this.setData({
        data: res,
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