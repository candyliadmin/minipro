// pages/enterpriseAccount/bill/billDetail/billDetail.js
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
const bank = require('../../../../lib/src/bank.js');
const BASICDATA = require('../../../../utils/data.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    detailInfo: {},
    detailtype: '',
    id:'',
    type: {
      WITHDRAW: {
        name: '余额提现',
        type:'',
        icon: '/page/account/zhangdan_tx.png'
      },
      SETTLEMENT: {
        name: '票款结算',
        icon: '/page/account/piaokuang_js.png'
      },
      WITHDRAW_FAIL: {
        name: '提现失败',
        icon: '/page/account/shibai.png'
      }
    },
    detailMap: null,
    statusType:{
      "WITHDRAW_FAILED":"申请已驳回",
      "WITHDRAW_SUCCESS": "到账成功",
    }
  },
  /**
   * 获取排班信息
   */
  getDetail: function () {
    const that = this;
    const id = that.data.id;
    const type = that.data.detailtype;
    if(!id) {
      commonUtil.showToast('页面错误！');
      return false;
    }
    commonUtil.request(api.agencyBillUrl + '/' + id + '/' + type).then((res) => {
      wx.hideToast();
      that.setData({
        detailInfo: res
      })
      if (type == 'WITHDRAW') {
        let types = that.data.type;
        if (res.channel === 'bank_account') {
          types[type].icon = bank.getBankLogo(that.data.detailMap[type].bankCode);
        } else if (res.channel === 'wx_pub'){
          types[type].icon = BASICDATA.accountType[res.channel]['image'];
          types[type].type = BASICDATA.accountType[res.channel]['name'];
        }
        that.setData({ type: types })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detailtype: options.type || '',
      id: options.id || ''
    })
    this.getDetail();
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