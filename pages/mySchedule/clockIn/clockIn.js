// pages/mySchedule/clockIn/clockIn.js
const app = getApp();
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const dateFormat = require('../../../utils/dateFormat.js');
const BASICDATA = require('../../../utils/data.js');
var QQMapWX = require("../../../lib/plugin/map/qqmap-wx-jssdk.min.js");
var qqwxmap = new QQMapWX({
  key: 'EF6BZ-ZLUKW-XUQRR-OVCBY-42G6Z-6AFWR' // 必填
});
let timer = null;
let ve_timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    scheduleInfo:{},
    btnText:'',// 打卡按钮文字
    state:0,// 当前排班的打卡状态
    workEffortid:0,//排班ID
    vehicleId:'',// 车辆ID
    directionType: BASICDATA.directionType,//线路方向集合
    clockInState: BASICDATA.clockInState,//打卡状态描述集合
    isTiming:false,//是否在倒计时
    address:'',//当前位置
    newdata: {
      time: '',
      latitude: '',
      longitude: '',
      address: '',
      workEffortRoleId: '',
      workEffortVehicleId:'',
      type: ''
    },// 当前打卡位置时间数据信息
    isWarn:false,// 打卡是否异常
    showModal:false,// 打卡操作二次确认框
    type:0,// 打卡次数 判断发车打卡、到达打卡、打卡完成
    clockList:[
      { name: '发车打卡', type: 0, data: null },
      { name: '到达打卡', type: 1, data: null },
    ],
    successTime:'',
    canClock:false
  },
  /**
   * 获取排班信息
   */
  getSchedule: function () {
    let that = this;
    commonUtil.request(api.workEffortRolesUrl+ '/' + that.data.workEffortid).then((res) => {
      wx.hideToast();
      const attendanceSet = res.attendanceSet || [];
      let tempData = that.data.clockList;
      tempData.forEach((item)=>{
        for (let i = 0; i < attendanceSet.length; i++){
          if (item.type === attendanceSet[i].type){
            item.data = attendanceSet[i];
            item.data.formatHour = dateFormat.formatHour(dateFormat.formatStr(attendanceSet[i].time))
            item.data.formatDate = dateFormat.formatDate(dateFormat.formatStr(attendanceSet[i].time))
            break;
          }
        }
      })
      that.setData({
        scheduleInfo: res,
        state: res.clockValue,
        clockList:tempData,
      })
      wx.setStorageSync("workEffortItem", res);
      if (!that.data.address) {
        this.getCurrentPos();
      }

      // 如果打卡未完成，则启动计时器动画
      if (res.clockValue < 2) {
        that.setTiming();
        that.setAnimate();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      workEffortid:options.id,
      vehicleId:options.vehicleid
    })
    this.getSchedule();
  },
  setAnimate:function(){
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    var next = true;
    ve_timer = setInterval(function () {
      if (next) {
        //根据需求实现相应的动画
        this.animation.scale(1.24, 1.24).opacity(1).step()
        next = !next;
      } else {
        this.animation.scale(1, 1).opacity(0.5).step()
        next = !next;
      }
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000);
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
    clearInterval(timer);
    clearInterval(ve_timer);
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
   * 生成打卡记录
   */
  attendancesHandle: function (newData){
    let that = this;
    let info = that.data.scheduleInfo;
    commonUtil.request(api.attendancesUrl, newData, 'POST').then((res) => {
      info.attendanceSet.push(newData);
      that.setData({
        successTime: dateFormat.formatHour(dateFormat.formatStr(newData.time)) ,
        showModal: true,
      })
      that.getSchedule();
      that.setData({
        scheduleInfo: info
      })
    })
  },
  /**
   * 打卡
   */
  clockInHandle: function (e) {
    let type = e.currentTarget.dataset.type;
    const that = this;
    const diff = this.timeDifference(this.data.scheduleInfo.departureTime, this.data.btnText);
    const isDiff = Math.abs(diff) >= 30;
    if (!that.data.canClock || !that.data.btnText) return false;
    that.setData({
      type,
      isWarn: type == 0?isDiff:false,
    })
    if (isDiff && type == 0) {
      commonUtil.showModal({
        title: '',
        content: isDiff && type == 0 ? '打卡时间异常，是否确认打卡?' : '是否确认打卡？',
        success(res) {
          if (res.confirm) {
            that.confirm();
          }
        }
      })
    } else {
      that.confirm();
    }
  },
  /**
   * 计算打卡时间与班次时间差
   * @startTime 开始时间（班次时间 HH:ss）
   * @endTime 结束时间（打卡时间 HH:ss）
   */
  timeDifference:function(startTime, endTime){
    var start1 = startTime.split(":");
    var startAll = parseInt(start1[0] * 60) + parseInt(start1[1]);

    var end1 = endTime.split(":");
    var endAll = parseInt(end1[0] * 60) + parseInt(end1[1]);

    return endAll - startAll;
  },
  /**
   * 时间表
   */
  setTiming: function () {
    let that = this;
    timer = setInterval(function () {
      that.setData({
        btnText: dateFormat.formatHour(new Date()),
        canClock: true
      })
    }, 1000)
  },
  /**
   * 获得当前的位置
   */
  getCurrentPos:function(){
    let that = this;
    commonUtil.showLoading('定位中');
    that.setData({
      canClock:false
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getDistrict(res.latitude, res.longitude);
        commonUtil.hideLoading();
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '需授权地理位置才能为您匹配数据哦。请前往设置：点击右上角-关于巴滴云-点右上角-设置-打开授权位置。',
        })
      }
    })
  },
  /**
   * 根据经纬度获得当前地区名
   */
  getDistrict: function (latitude, longitude){
    let that = this;
    qqwxmap.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let info = that.data.scheduleInfo;
        let address = res.result.address;
        let time = dateFormat.formatTime(new Date());
        let state = that.data.state;
        let newData = Object.assign({}, {
          time: time,
          latitude: latitude,
          longitude: longitude,
          address: address,
          workEffortRoleId: that.data.workEffortid,
          workEffortVehicleId: that.data.vehicleId,
          type: state ? state - 1 : state
        })
        that.setData({
          address: address,
          newdata: newData,
          canClock:true
        })
      }
    })
    return;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=EF6BZ-ZLUKW-XUQRR-OVCBY-42G6Z-6AFWR`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        let info = that.data.scheduleInfo;
        let address = res.data.result.address;
        let time = dateFormat.formatTime(new Date());
        let state = that.data.state;
        let newData = Object.assign({}, {
          time: time,
          latitude: latitude,
          longitude: longitude,
          address: address,
          workEffortRoleId: that.data.workEffortid,
          workEffortVehicleId: that.data.vehicleId,
          type: state?state-1:state
        })
        that.setData({
          address:address,
          newdata:newData
        })
      }
    })
  },
  cancel: function () {
    this.setData({
      showModal: false
    })
  },
  confirm: function () {
    let that = this;
    let state = that.data.state;
    let type = that.data.type;
    console.log(type)
    if (type != state) {
      return false;
    } else {
      let _obj = Object.assign({}, that.data.newdata);
      _obj.type = state;
      that.setData({
        newdata: _obj
      })
      that.attendancesHandle(that.data.newdata);
    }
  },
  handknow:function(){
    this.setData({
      showModal:false
    })
  }
})