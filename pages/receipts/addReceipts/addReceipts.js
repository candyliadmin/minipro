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
    receipt: {
      "departureTime": '',
      "routeId": '',
      "routeDirectionId": 0,
      "driverId": '',
      "vehicleId": '',
      "day": '',
      "id": '',
      "check": 1,
    },
    id:'',//判断是添加还是编辑操作
    driverName: '', //司机名称
    vehicleName: '', //车辆名称
    routeName: '', //线路名称
    type: '', //方向类型 1 上行+下行 2 单边 3 环形
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
    istrue: false, //是否展示模态框
    today: '', //今天
    minday:'',//三天前
    needDelId:''
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
      id:options.id || ''
    })
    if(options.id){
      this.getReceipt();
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
        receipt: datas,
        driverName: res.driverName || '',
        vehicleName: res.licensePlate || '',
        routeName: res.routeName || '',
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
    if (selresult && selresult["route"]) {
      this.setRoute(selresult["route"]);
    }
    if (selresult && selresult["driver"]) {
      this.setDriver(selresult["driver"]);
    }
    if (selresult && selresult["vehicle"]) {
      this.setVehicle(selresult["vehicle"]);
    }
  },
  setRoute:function(result){
    let receipt = this.data.receipt;
    if (result.id) receipt.routeId = result.id;
    if (result.directionId && result.directionId != 1) {
      receipt.routeDirectionId = result.directionId;
    } else if (result.directionId === 1){
      receipt.routeDirectionId = 0;
    }else{
      receipt.routeDirectionId = '';
      this.openDialog();
      return false;
    }
    this.setData({
      routeName: result.shortName,
      showDirection: true,
      type: result.directionId ? result.directionId : '',
      receipt: receipt,
      rindex: 0,
    })
  },
  setDriver: function (result) {
    let receipt = this.data.receipt;
    if (result.partyId) receipt.driverId = result.partyId;
    this.setData({
      driverName: result.name,
      receipt: receipt,
    })
  },
  setVehicle: function (result) {
    let receipt = this.data.receipt;
    if (result.id) receipt.vehicleId = result.id;
    this.setData({
      vehicleName: result.licensePlate,
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
    let options = {};
    switch(key){
      case 'route':
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
      url: '/pages/common/search/search?key='+key,
    })
  },
  openDialog: function() {
    this.setData({
      istrue: true
    })
  },
  closeDialog: function() {
    this.setData({
      istrue: false
    })
  },
  submitReceipt: function() {
    let that = this;
    let receipt = this.data.receipt;
    let submitType = that.data.id || that.data.needDelId ? 'PUT' : 'POST';
    for (let r in receipt) {
      if (receipt[r] === '' && r != 'id') {
        wx.showToast({
          title: '信息填写不完整',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
    }
    // if (receipt.arrivalTime && receipt.departureTime && receipt.arrivalTime <= receipt.departureTime){
    //   wx.showToast({
    //     title: '到站时间异常',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    // }
    commonUtil.request(api.receiptsUrl, receipt, submitType).then((res) => {
      //验证是否设置票价
      if (receipt.check == 1) {
        if (res.receiptItems && res.receiptItems.length) {
          wx.navigateTo({
            url: '../payReporting/payReporting?id=' + res.id + '&back=2',
          })
        } else {
          that.openDialog();
        }
      } else if (receipt.check == 0) {
        wx.navigateBack({
          delta: 1
        })
      }
      //如果是添加，则保存临时ID
      if (!that.data.id) {
        let receipt = that.data.receipt;
        receipt.id = res.id;
        that.setData({
          needDelId: res.id,
          receipt: receipt
        })
      }
    }, (res) => {
      commonUtil.showToast(res.errorMsg, 1500);
    }
    )
  },
  cancleReceipt: function() {
    let that = this;
    wx.showModal({
      title: '',
      content: '是否保存发车信息？',
      success:function(res){
        if (res.confirm) {
          let receipt = that.data.receipt;
          receipt.check = 0;
          that.submitReceipt();
        } else {
          //如果是添加，取消时则删除临时记录
          if (!that.data.id && that.data.needDelId) {
            that.delReceipt(that.data.needDelId);
          }
          wx.navigateBack({
            delta:1
          })
        }
      }
    })
  },
  /**
   * 删除上报信息
   */
  delReceipt: function (id) {
    commonUtil.request(api.receiptsUrl + '/' + id, {}, "DELETE").then((res) => {
    })
  },
})