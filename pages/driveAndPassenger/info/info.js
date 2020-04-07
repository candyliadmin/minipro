const app = getApp();
const login = require('../../../utils/login.js');
const BASICDATA = require('../../../utils/data.js');
const dateFormat = require('../../../utils/dateFormat.js');
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountInfo: null,
    sexs: [{ key: 'F', name: '女' }, { key: 'M', name: '男' }],
    sexIndex:0,
    roleType: BASICDATA.roleType,
    roleName: [],
    today:'',
    info:{
      name:'',
      gender:'',
      position:[],
      licenceCode:''
    },
    showTopTips:false,
    errtext:'',
    errObj:{
      'name':'姓名必填',
      'position':'职位必选',
      'gender':'性别必选'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || '';
    if (id) {
      this.getAccountInfo(id);
      this.setData({
        today: dateFormat.formatDate(new Date())
      })
    }else{
      commonUtil.showToast('参数错误！',1500);
      setTimeout(()=>{
        wx.navigateBack();
      },1500)
    }
  },
  getAccountInfo: function (id) {
    commonUtil.request(api.driverAndPassengerUrl+'/'+id).then((res) => {
      const info = this.data.info;
      for(let i in info){
        info[i] = res[i] || ''
      }
      this.setData({
        info: info,
        sexIndex:info.gender === 'F'?0:1,
        accountInfo: res,
        roleName:res.position
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
    const roles = wx.getStorageSync("selvalues") || [],info = this.data.info;
    if (roles.length) {
      info.position = roles;
      this.setData({
        roleName: roles,
        info:info
      })
    }
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
    wx.removeStorageSync("selvalues");
    // this.isChange();
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
   * 文本框编辑
   */
  bindinputChange:function(e){
    let val = e.detail.value, key = e.currentTarget.dataset.name;
    if(key){
      let info = this.data.info;
      info[key] = val;
      this.setData({
        info:info
      })
    }
  },
  /**
   * 性别选择
   */
  bindSexChange: function (e) {
    let info = this.data.info, sex = this.data.sexs[e.detail.value].key;
    info.gender = sex;
    this.setData({
      sexIndex:e.detail.value,
      sex: sex,
      info:info
    })
  },
  selRole:function(){
    wx.setStorageSync("selvalues", this.data.roleName)
    wx.navigateTo({
      url: '/pages/common/selPage/selPage',
    })
  },
  validate: function () {
    let info = this.data.info;
    for (let i in info) {
      if (i != 'licenceCode' && (!info[i] || info[i].length == 0)) {
        console.log('有空值')
        this.setData({
          showTopTips: true,
          errtext: this.data.errObj[i]
        })
        this.hideTip();
        return false;
      }
    }
    return true;
  },
  submit:function(){
    if (this.validate()){
      this.showModal();
    }
  },
  saveInfo: function () {
    const account = this.data.accountInfo,info = this.data.info;
    commonUtil.request(api.driverAndPassengerUrl, {
      "login": account.login,
      "name": info.name,
      "gender": info.gender,
      "position": info.position,
      "licenceCode": info.licenceCode,
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
  hideTip:function(){
    setTimeout(()=>{
      this.setData({
        showTopTips:false
      })
    },2000)
  },
  /**
   * 判断是否有修改
   */
  isChange:function(){
    const info = this.data.info,account = this.data.accountInfo;
    if (this.validate()) {
      for (let i in info) {
        if (info[i] != account[i]) {
          console.log(11)
          this.showModal();
          return false;
        }
      }
    }
  },
  showModal:function(){
    let that = this;
    commonUtil.showModal({
      title: '确认保存',
      content: '是否保存当前员工信息？',
      success: function () {
        that.saveInfo();
      }
    })
  }
})