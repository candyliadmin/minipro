// pages/vehiclePosition/vehicleDetail/vehicleDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    vehicleDetail:{
      speed:"12km/h",
      direction:"上行",
      startTime:"09:30",
      paths:[{
        id:1,
        name:"乌塘"
      }, {
          id: 2,
          name: "罗屋"
        }, {
          id: 3,
          name: "塘沟"
        }, {
          id: 4,
          name: "陆下"
        }, {
          id: 5,
          name: "陆上"
        }, {
          id: 6,
          name: "金屋"
        }, {
          id: 7,
          name: "遂溪"
        },]
    },
    activeIndex:2
  },
  /**
   * 获取车辆位置信息
   */
  getVehiclePos(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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