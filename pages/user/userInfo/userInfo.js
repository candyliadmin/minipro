const app = getApp();
const login = require('../../../utils/login.js');
const BASICDATA = require('../../../utils/data.js');
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountInfo: null,
    sexs: [{ key: 'F', name: '女' }, { key: 'M', name: '男' }],
    sexIndex: 0,
    roleType: BASICDATA.roleType,
    roleName:[],
    info:{
      name:'',
      gender:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccountInfo();
  },
  getAccountInfo:function(){
    login.getAccountInfo().then((res) => {
      this.setData({
        accountInfo: res,
        roleName: app.globalData.roleName,
        sexIndex: res.gender === 'F' ? 0 : 1,
        info:{
          name:res.name,
          gender:res.gender
        }
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

  },
  /**
   * 性别选择
   */
  bindSexChange: function (e) {
    let info = this.data.info, sex = this.data.sexs[e.detail.value].key;
    info.gender = sex;
    this.setData({
      sexIndex: e.detail.value,
      sex: sex,
      info: info
    })
    this.saveInfo();
  },
  /**
   * 文本框编辑
   */
  bindinputChange: function (e) {
    let val = e.detail.value, key = e.currentTarget.dataset.name;
    if (key) {
      let info = this.data.info;
      info[key] = val;
      this.setData({
        info: info
      })
    }
  },
  bindblur:function(e){
    const val = e.detail.value;
    if (val){
      this.saveInfo();
    }else{
      const info = this.data.info;
      info.name = this.data.accountInfo.name;
      this.setData({
        info:info
      })
    }
  },
  saveInfo: function () {
    const account = this.data.accountInfo, info = this.data.info;
    commonUtil.request(api.driverAndPassengerUrl, {
      "login": account.login,
      "name": info.name,
      "gender": info.gender,
      "partyId": account.partyId
    }, 'PUT').then((res) => {
      commonUtil.showToast('保存成功', 1000);
      setTimeout(() => {
        wx.navigateBack({

        })
      }, 1000)
    }, (res) => {
      commonUtil.showToast(res.errorMsg, 1500);
    }
    )
  },
})