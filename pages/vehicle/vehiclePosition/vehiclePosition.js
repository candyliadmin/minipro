// pages/vehiclePosition/vehiclePosition.js
const app = getApp();
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    url: '',
    listData: [],
    scale: '15',
    Height: '0',
    latitude: '',
    longitude: '',
    markers: [],
    timer: null,
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.setData({
      url: app.globalData.host
    })
    var data = JSON.stringify({
      page: 1,
      pageSize: 10,
      request: {
        placeLongitude: app.globalData.longitude,
        placeLatitude: app.globalData.latitude,
        userId: app.globalData.userId
      }
    })
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        that.realTimeGetPos()
        that.setData({
          scale: 12,
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    });
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            Height: res.windowHeight
          },
        })
      }
    })
  },
  //定时器方法
  timer: function () {
    let that = this
    that.data.timer = setInterval(function () {
      that.realTimeGetPos();
    }, 10000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.timer();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
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
  controltap(e) {
    var that = this;
    if (e.currentTarget.dataset.controlid === 1) {
      that.setData({
        scale: ++this.data.scale
      })
    } else {
      that.setData({
        scale: --this.data.scale
      })
    }
  },
  //视野发生变化时触发
  regionchange(e) {
    // console.log("regionchange===" + e.type)
  },
  getSchoolMarkers() {
    var market = [];
    for (let item of this.data.listData) {
      let marker1 = this.createMarker(item);
      market.push(marker1)
    }
    return market;
  },
  strSub: function (a) {
    var str = a.split(".")[1];
    str = str.substring(0, str.length - 1)
    return a.split(".")[0] + '.' + str;
  },
  createMarker(point) {
    let latitude = this.strSub(point.placeLatitude);
    let longitude = point.placeLongitude;
    let marker = {
      iconPath: "/image/icon/vehiclepos-icon.png",
      id: point.id || 0,
      name: point.placeName || '',
      title: point.placeName || '',
      latitude: latitude,
      longitude: longitude,
      label: {
        anchorX: -25,
        anchorY: 0,
        content: point.vehicleNum,
        color: "#ff0000",
        textAlign: "center"
      },
      width: 30,
      height: 43
    };
    return marker;
  },
  realTimeGetPos: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    commonUtil.request(api.vehiclesAgencyUrl).then((res) => {
      wx.hideLoading();
      let resulut = res.result;
      that.renderVehiclePos(resulut);
    })
  },
  renderVehiclePos: function (resulut) {
    let markes = [];
    for (let i = 0; i < resulut.length; i++) {
      if (resulut[i].attributes.latitude && resulut[i].attributes.latitude <= 90 && resulut[i].attributes.longitude) {
        var row = new Object();
        row.id = markes.length;
        row.latitude = resulut[i].attributes.latitude;
        row.longitude = resulut[i].attributes.longitude;
        row.width = 25;
        row.height = 15;
        row.iconPath = "/image/common/vehicle-round.png";
        var label = new Object();
        label.content = resulut[i].attributes.license_plate || resulut[i].attributes.label;
        label.fontSize = 13;
        label.color = "#D22100";
        label.bgColor = "#fff";
        label.borderColor = "#B4B4B4";
        label.padding = 2;
        if (app.globalData.environment == 'wxwork') {
          label.x = -30;
        } else {
          label.anchorX = -30;
        }
        label.anchorY = 0;
        label.textAlign ="center";
        row.label = label;
        markes.push(row);
      }
    }
    this.setData({
      markers: markes
    })
  },

  /**
   * 获取路线车辆
   */
  getVehicles: function () {
    let that = this;
    var params = new Object();
    params['filter[route]'] = that.data.routeid;
    params['page[limit]'] = 100;
    params['filter[direction_id]'] = that.data.directionid;
    // console.log("参数：" + JSON.stringify(params));
    wx.showLoading({
      title: '请稍等...',
    })
    API.ajax("api/v1/vehicles", function () {
      wx.hideLoading();
      let resulut = res.data.data;
      let markers = that.data.markers;
      for (let i = 0; i < resulut.length; i++) {
        var row = new Object();
        row.id = markers.length + 1;
        row.latitude = resulut[i].attributes.latitude;
        row.longitude = resulut[i].attributes.longitude;
        //坐标系转换
        // var gc = gcoord.transform([stopList[i].attributes.longitude, stopList[i].attributes.latitude], gcoord.BD09, gcoord.GCJ02);//WGS84转为GCJ02
        // console.log("转换后经纬度：" + gc);//gc[0]经度 gc[1]纬度
        // 接口数据为GCJ02，不需要转换
        // row.latitude = gc[1];
        // row.longitude = gc[0];
        row.width = 25;
        row.height = 15;
        row.iconPath = "/image/common/vehicle-round.png";
        var label = new Object();
        label.content = resulut[i].attributes.license_plate;
        // callout.display = "ALWAYS";//'BYCLICK':点击显示; 'ALWAYS':常显
        label.fontSize = 13;
        label.color = "#D22100";
        label.bgColor = "#fff";
        label.borderColor = "#B4B4B4";
        label.padding = 2;
        label.anchorX = -30
        label.anchorY = 0
        row.label = label;
        markers.push(row);
      }
      that.setData({
        markers: markers
      })
    }, params)
  },
  /**
   * 点击标点时触发
   */
  markertap: function (event) {
    wx.navigateTo({
      url: 'vehicleDetail/vehicleDetail?id=' + event.markerId,
    })
  }
})