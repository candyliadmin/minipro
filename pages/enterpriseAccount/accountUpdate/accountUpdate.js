// pages/enterpriseAccount/accountUpdate/accountUpdate.js
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const globalData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: globalData.imgUrl,
    accountType: [{
      id: 'b2c',
      name: '个人账户'
    }, {
      id: 'b2b',
      name: '企业账户'
    }],
    accountTypeIndex: 0,
    cardType: ['借记卡', '存折', '信用卡', '准贷记卡', '基本户','一般户'],
    openBank: '',// 开户行名称
    subBank: '',// 支行名称
    selresult: {}, //选择的银行数据
    info: {
      settleAccountId: '', // 绑卡ID
      username: '', // 开户人姓名，企业账户是法人姓名
      mobile: '', // 预留手机号码
      openBankCode: '', // 开户银行ID
      subBankCode:'', // 支行CODE
      accountName: '', // 银行卡号
      contactCertNo: '',// 法人身份证号码
      contactPhone: '', // 法人手机号
      name: '', // 企业名称
      businessLicenseNo: '',// 营业执照
      cardType:0,//银行卡类型
    },
    showTopTips: false,
    tips: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('selresult', {})
    this.getCard();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let selresult = wx.getStorageSync('selresult');
    this.setData({
      selresult: selresult
    })
    if (selresult && selresult["bank"]) {
      this.setBank(selresult["bank"]);
    }
    if (selresult && selresult["subBank"]) {
      this.setSubBank(selresult["subBank"]);
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getCard: function () {
    commonUtil.request(api.bankAccountUrl).then((res) => {
      let info = this.data.info;
      let accountTypeIndex = res.type =='b2b'?1:0;
      for(let o in info){
        info[o] = res[o] || res[o] == 0?res[o]:'';
      }
      info.username = (accountTypeIndex == 1 ? res.contactName : res.recipientName) || '';
      this.setData({
        info,
        accountTypeIndex,
        openBank: res.openBank || '',
        subBank: res.subBank || '',
      })
    })
  },
  bindAccountTypeChange: function(e) {
    let val = e.detail.value;
    this.setData({
      accountTypeIndex: val
    })
  },
  selSearch: function(e) {
    let key = e.currentTarget.dataset.key;
    let options = {};
    switch (key) {
      case 'bank': 
        options = {
          url: api.banksUrl,
          namekey: 'bank',
          icon: this.data.imgUrl + '/common/icon/vehicle-icon.png',
          searchKey: 'key',
        };
        break;
      case 'subBank':
        options = {
          url: api.subBanksUrl + '?bankId=' + this.data.info.openBankCode,
          namekey: 'subBank',
          icon: this.data.imgUrl + '/common/icon/vehicle-icon.png',
          searchKey: 'key',
        };
        break;
    }
    wx.setStorageSync('searchopt', options);
    wx.navigateTo({
      url: '/pages/common/search/search?key=' + key,
    })
  },
  setBank: function (result) {
    let info = this.data.info;
    let openBank = '',subBank=this.data.subBank;
    if (result.bankId) {
      openBank = result.bank;
      if(result.bankId != info.openBankCode){
        info.subBankCode = '';
        subBank = '';
      }
      info.openBankCode = result.bankId;
    }
    this.setData({
      openBank,
      subBank,
      info
    })
  },
  setSubBank: function (result) {
    let info = this.data.info;
    if (result.subBankCode) info.subBankCode = result.subBankCode;
    this.setData({
      subBank: result.subBank,
      info,
    })
  },
  inputChange: function(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    let info = this.data.info;
    info[key] = value;
    this.setData({
      info
    });
  },
  gotoVerify: function(e) {
    let info = this.data.info;
    if (!info.mobile || !info.accountName) {
      var that = this;
      let tips = '';
      if (!info.accountName) tips='请填写银行卡号';
      if (!info.mobile) tips = '请填写预留手机号码';
      this.setData({
        showTopTips: true,
        tips
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false,
          tips: ''
        });
      }, 3000);
    } else {
      wx.setStorageSync('info', this.data.info)
      wx.navigateTo({
        url: 'authentication/authentication',
      })
    }
  }
})