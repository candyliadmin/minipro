// pages/receipts/addReceipts/addReceipts.js
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const globalData = getApp().globalData;
const dateFormat = require('../../../utils/dateFormat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: globalData.imgUrl,
    detailInfo:null,
    receipt: {
      "departureTime": '',
      "arrivalTime":'',
      "routeId": '',
      "routeDirectionId": 0,
      "driverId": '',
      "vehicleId": '',
      "day": '',
      "attendantId":'',
      "id": '',
    },
    attendantName: '', //乘务名称
    driverName: '', //司机名称
    vehicleName: '', //车辆名称
    directionType: {
      1: [{
          "id": 0,
          "name": '上行'
        },
        {
          "id": 1,
          "name": '下行'
        },
      ],
      2: [{
        "id": 2,
        "name": '单边'
      }],
      3: [{
        "id": 3,
        "name": '环线'
      }],
    },
    type: 0,//路线方向类型
    rindex: 0, //方向索引
    showDirection: false,
    selresult: {}, //选择的路线数据
    today: '', //今天
    minday:'',//三天前
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const today = dateFormat.formatDate(new Date());
    wx.setStorageSync('selresult',{})
    this.setData({
      today: today,
      minday: dateFormat.formatDate(dateFormat.getCustomday('',-2)),
      id:options.id || 0
    })
    if(options.id){
      this.getReceipt();
    }else{
      let route = wx.getStorageSync("route");
      let receipt = this.data.receipt;
      if(route){
        receipt.routeId = route.id;
        receipt.routeDirectionId = route.directionId;
        this.setData({
          routeName: route.shortName,
          receipt: receipt,
          type: route.directionId,
          showDirection: route.directionId === '' || route.directionId === null ? false : true
        })
      }
    }
  },
  /**
   * 获取上报信息
   */
  getReceipt: function () {
    let that = this;
    let datas = that.data.receipt;
    commonUtil.request(api.receiptsUrl + '/' + that.data.id).then((res) => {
      wx.hideToast(res);
      for (let o in datas) {
        datas[o] = res[o] == undefined ? datas[o] : res[o];
      }
      that.setData({
        detailInfo:res,
        receipt: datas,
        driverName: res.driverName || '',
        vehicleName: res.licensePlate || '',
        routeName: res.routeName || '',
        attendantName: res.attendantName || '',
        rindex: res.routeDirectionId === 0 || res.routeDirectionId === 1 ? res.routeDirectionId : 0,
        type: res.routeDirectionId === 0 || res.routeDirectionId === 1 ? 1 : res.routeDirectionId,
        showDirection: res.routeDirectionId === '' || res.routeDirectionId === null ? false : true
      })
    })
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
    if (selresult && selresult["attendant"]) {
      this.setAttendant(selresult["attendant"]);
    }
    if (selresult && selresult["driver"]) {
      this.setDriver(selresult["driver"]);
    }
    if (selresult && selresult["vehicle"]) {
      this.setVehicle(selresult["vehicle"]);
    }
  },
  setAttendant: function (result) {
    let receipt = this.data.receipt;
    receipt.attendantId = result.partyId || '';
    this.setData({
      attendantName: result.name || '',
      receipt: receipt,
    })
  },
  setDriver: function (result) {
    let receipt = this.data.receipt;
    if (result.partyId) receipt.driverId = result.partyId;
    this.setData({
      driverName: result.name || '',
      receipt: receipt,
    })
  },
  setVehicle: function (result) {
    let receipt = this.data.receipt;
    if (result.id) receipt.vehicleId = result.id;
    this.setData({
      vehicleName: result.licensePlate || '',
      receipt: receipt,
    })
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
  //选择时间
  bindPickChange: function(e) {
    let receipt = this.data.receipt;
    let val = e.detail.value;
    let type = e.currentTarget.dataset.type;
    if (type) {
      receipt[type] = val;
      this.setData({
        receipt: receipt
      })
    }
  },
  bindDirectionChange: function(e) {
    let receipt = this.data.receipt;
    let val = e.detail.value;
    receipt.routeDirectionId = this.data.directionType[this.data.type][val].id;
    this.setData({
      rindex: val,
      receipt: receipt
    })
  },
  /**
   * 进入选择页面
   */
  selSearch: function(e) {
    let key = e.currentTarget.dataset.key;
    let empty = e.currentTarget.dataset.empty;
    let options = {};
    switch(key){
      case 'attendant':
        options = {
          url: api.driverAndPassengerUrl + '?roles=ATTENDANT',
          namekey: 'name',
          icon: this.data.imgUrl + '/common/woman-head.png',
        }
        break;
      case 'driver':
        options = {
          url: api.driverAndPassengerUrl + '?roles=DRIVER',
          namekey: 'name',
          icon: this.data.imgUrl+'/common/man-head.png',
        }
        break;
      case 'vehicle':
        options = {
          url: api.vehiclesUrl,
          namekey: 'licensePlate',
          icon: this.data.imgUrl+'/common/icon/vehicle-icon.png',
          searchKey: 'licensePlate',
        }
        break;
    }
    wx.setStorageSync('searchopt', options);
    wx.navigateTo({
      url: '/pages/common/search/search?key=' + key + (empty ? '&empty=1':''),
    })
  },
  submitReceipt: function() {
    let that = this;
    let receipt = this.data.receipt;
    let submitType = receipt.id ? 'PUT' : 'POST';
    for (let r in receipt) {
      if (receipt[r] === '' && r != 'id' && r !='attendantId') {
        wx.showToast({
          title: '信息填写不完整',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
    }
    that.setData({
      disabled:true
    })
    commonUtil.showLoading('提交中');
    commonUtil.request(api.workEffortsUrl, receipt, submitType).then((res) => {
      commonUtil.hideLoading();
      commonUtil.showSuccessToast('保存成功');
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }, (res) => {
      commonUtil.hideLoading();
      commonUtil.showToast(res.errorMsg,1500);
    })
  },
  cancleReceipt: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //删除发车信息
  delReceipt: function (e) {
    const that = this;
    const detail = that.data.detailInfo;
    let id = detail?detail.id:'';
    if (detail && detail.receiptStatus != 'UNREPORTED') {
      commonUtil.showToast('已现金上报数据不能删除！', 1500);
      return false;
    }
    wx.showModal({
      title: '',
      content: '删除后将无法找回，是否确认删除？',
      confirmText: '是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
          commonUtil.request(api.workEffortsUrl + '/' + id, {}, "DELETE").then((res) => {
            wx.navigateBack()
          }, (res) => {
            commonUtil.showToast(res.errorMsg);
          })
        }
      }
    })
  },
})