// pages/enterpriseAccount/accountDetail/accountInfo/accountInfo.js
const app = getApp();
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    isOpenEye: false,
    isQiye: false,
    info:{
      username:'',
      tel:'',
      bank:'',
      card:'',
      idcard:'',
      agencyname: '',
      businessLicenseNo: '',
    },
    formatInfo: {
      username: '',
      tel: '',
      bank: '',
      card: '',
      idcard: '',
      agencyname: '',
      businessLicenseNo:'',
    },
    account: {
      username: '',
      tel: '',
      bank: '',
      card: '',
      idcard: '',
      agencyname: '',
      businessLicenseNo: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'b2b'){
      this.setData({
        isQiye:true
      })
    } else {
      this.setData({
        isQiye: false
      })
    }
  },
  formatInfo: function () {
    let info = this.data.info;
    let formatInfo = this.data.formatInfo;
    formatInfo = Object.assign({}, info);
    formatInfo.username = info.username.slice(0,1)+'**';
    formatInfo.tel = info.tel?info.tel.replace(/^(\d{3})\d*(\d{4})$/,'$1****$2'):'未绑定';
    formatInfo.bank = info.bank;
    formatInfo.card = '**** **** **** '+info.card.slice(-4);
    formatInfo.businessLicenseNo = '******************';
    formatInfo.idcard = info.idcard ? info.tel.replace(/^(\d{6})\d*(\d{4})$/, '$1****$2') : '未绑定';
    this.setData({
      formatInfo:formatInfo
    })
  },
  setAccount:function(){
    this.setData({
      account: this.data.isOpenEye?this.data.info:this.data.formatInfo
    })
  },
  getCard:function(){
    commonUtil.request(api.bankAccountUrl).then((res) => {
      let info = this.data.info;
      info.username = (this.data.isQiye ? res.contactName : res.recipientName) || '';
      info.bank = res.openBank || '';
      info.card = res.accountName || '';
      if (this.data.isQiye){
        info.tel = res.contactPhone || '';
        info.idcard = res.contactCertNo || '';
        info.agencyname = res.name || '';
        info.businessLicenseNo = res.businessLicenseNo || '';
      }else{
        info.tel = res.mobile || '';
      }
      this.setData({
        info
      })
      this.formatInfo();
      this.setAccount();
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
    this.getCard();
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

  },
  /**
   * 申请修改
   */
  editInfo:function(){
    if (this.data.isQiye) {
      wx.showToast({
        icon: 'none',
        title: '企业账户暂不支持修改',
      })
    } else {
      wx.navigateTo({
        url: '../../accountUpdate/accountUpdate',
      })
    }
  },
  showDetail:function(){
    this.setData({
      isOpenEye:!this.data.isOpenEye
    })
    this.setAccount();
  }
})