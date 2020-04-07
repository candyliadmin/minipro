// pages/vehicle/vehicle/create/create.js
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vehicle: {
      licensePlate: '',
      numberOfSeats: ''
    },
    showTopTips: false,
    tips: '',
  },
  inputChange: function (e) {
    var tag = e.currentTarget.id;
    var vehicle = this.data.vehicle;
    vehicle[tag] = e.detail.value;
    this.setData({
      vehicle
    });
  },
  submitVehicle: function() {
    var info = this.data.vehicle;
    if (!info.licensePlate || !info.numberOfSeats) {
      var that = this;
      let tips = '';
      if (!info.numberOfSeats) tips = '请输入正确席坐数';
      if (!info.licensePlate) tips = '请输入正确车牌号';
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
      commonUtil.request(api.vehiclesUrl, info, "POST").then((res) => {
        wx.showToast({
          title: '新增车辆成功',
          icon: 'success',
          duration: 1000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                del: 1
              })
            }, 1000);
          }
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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