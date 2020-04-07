// pages/common/selPage/selPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '车队长', value:'MANAGER'},
      { name: '驾驶员', value: 'DRIVER'},
      { name: '乘务员', value: 'ATTENDANT' }
    ],
    values:[],
    isAllSelect:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const roles = wx.getStorageSync("selvalues");
    if (roles){
      this.setData({
        values:roles
      })
      this.setSelected();
    }
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
   * 设置选中
   */
  setSelected: function (values) {
    var items = this.data.items, values = values || this.data.values;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value == values[j]) {
          items[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      items: items,
      values: values
    });
    this.isAllSelect(items, values);
  },
  /**
   * 判断是否已全选
   */
  isAllSelect: function (items,values){
    var items = items || this.data.items, values = values || this.data.values;
    var flag = true;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      if(!items[i].checked){
        flag = false;
        break;
      }
    }
    this.setData({
      isAllSelect:flag
    })
    return flag;
  },
  /**
   * 点击复选框
   */
  checkboxChange: function (e) {
    this.setSelected(e.detail.value);
  },
  /**
   * 全选全不选
   */
  selAll: function () {
    var items = this.data.items, values = this.data.values;
    var flag = this.isAllSelect();
    var values = [];
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = !flag;
      values.push(items[i].value);
    }
    this.setData({
      items: items,
      values: flag ? [] : values
    });
    this.isAllSelect();
  },
  /**
   * 确定，临存数据
   */
  submit:function(){
    const values = this.data.values;
    wx.setStorageSync('selvalues', values);
    wx.navigateBack();
  }
})