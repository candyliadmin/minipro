// pages/user/feedback/feedback.js
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [{
        name: '功能建议',
        value: 0
      },
      {
        name: '异常反馈',
        value: 1
      },
      {
        name: '数据错误',
        value: 2
      },
      {
        name: '客服评价',
        value: 3
      },
      {
        name: '其他',
        value: 4
      }
    ],
    type: '',
    textarea: '',
    textLen:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  checkboxChange: function(e) {
    let checkboxItems = this.data.checkboxItems,
      values = e.detail.value,
      type = '';
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      if (checkboxItems[i].value == values[values.length - 1]) {
        checkboxItems[i].checked = true;
        type = checkboxItems[i].value;
      }
    }
    this.setData({
      checkboxItems: checkboxItems,
      type: type
    });
  },
  textareaChange: function(e) {
    let value = e.detail.value;
    this.setData({
      textarea: value,
      textLen:value.length,
    });
  },
  /**
   * 意见提交
   */
  formSubmit: function() {
    let that = this;
    let type = this.data.type;
    let textarea = this.data.textarea;
    if (type === '') {
      wx.showToast({
        title: '请选择一个问题',
        icon: 'none',
        duration: 800
      })
      return false;
    } else {
      let token = wx.getStorageSync("token");
      commonUtil.request(api.adviceUrl, {
        type: type,
        description: textarea,
        productType: 1,
      }, "POST", {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + (token["access_token"] || '')
      }).then((res) => {
        wx.showToast({
          title: '成功!'
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1200)
      })
    }
  }
})