// pages/codeDeparture/codeDeparture/codeDeparture.js
let app = getApp();
let QR = require("../../../lib/plugin/qrcode/qrcode.js");
const api = require('../../../config/api.js');
const commonUtil = require('../../../utils/commonUtil.js');
const codeTypes = {
  "DRIVER": {
    type: '司机码',
    desc: '扫码机扫一扫，成功发车'
  },
  "ATTENDANT": {
    type: '乘务码',
    desc: '扫码机扫一扫，现金上报'
  }
}
const codeRole = ["DRIVER", "ATTENDANT"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    imagePath: [],
    codeList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    downFilePath: '',
    downHidden: true,
    activeIndex: 0,
    uid: '',
    name:'',
    phone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize(); //动态设置画布大小
    this.setData({
      uid: options.uid || ''
    })
    this.getRoles();

    console.log(getCurrentPages())
  },
  getRoles: function() {
    let that = this;
    if(that.data.uid){
      that.setCode(wx.getStorageSync('codeUser'));
    } else {
      commonUtil.request(api.accoutUrl).then((res) => {
        let reslut = res;
        commonUtil.request(api.userCodeUrl).then((res) => {
          reslut.id = res.userId;
          that.setCode(reslut);
        })
      })
    }
    // commonUtil.request(api.receiptCodeUrl,{
    //   userId:that.data.uid
    // }).then((res) => {
    //   let datas = res;
    //   if (datas && datas.length > 0) {
    //     if (datas.length == 1) that.setData({ indicatorDots:false})
    //     that.createQrCode(datas[that.data.activeIndex].qrCode, "mycanvas", size.w, size.h);
    //     datas.forEach((item) => {
    //       if (codeTypes[item.role]) {
    //         Object.assign(item, codeTypes[item.role]);
    //       }
    //     })
    //   }
    //   this.setData({
    //     codeList: datas
    //   })
    // })
  },
  setCode: function (res) {
    const roles = res ? res.roles : [];
    let that = this;
    var size = this.setCanvasSize();
    if (roles && roles.length > 0) {
      if (roles.length == 1) that.setData({
        indicatorDots: false
      })
      let role_filter = roles.filter((item) => {
        if (codeRole.indexOf(item.name) != -1) {
          let qrcode = that.setUrl(codeRole.indexOf(item.name), res.id?res.id:res.partyId);
          item.qrCode = qrcode;
          if (codeTypes[item.name]) {
            Object.assign(item, codeTypes[item.name]);
          }
        }
        return codeRole.indexOf(item.name) != -1;
      })
      that.createQrCode(role_filter[that.data.activeIndex].qrCode, "mycanvas", size.w, size.h);
      this.setData({
        codeList: role_filter,
        name: res.name,
        phone: res.phoneNumber
      })
    }
  },
  setUrl: function(role, pid) {
    let str = 'badi://01?role=' + role + '&id=' + pid;
    str = commonUtil.baseEncode(str);
    let count = 0;
    if (str.charAt(str.length - 2) == '=') {
      count = 2;
    } else if (str.charAt(str.length - 1) == '=') {
      count = 1;
    }
    return str.substring(0, str.length - count) + count;
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
    wx.removeStorageSync("codeUser");
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
  //适配不同屏幕大小的canvas
  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      //不同屏幕下canvas的适配比例；设计稿是750宽
      var scale = 750 / 686;
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function(e) {
    var img = this.data.imagePath;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  onSlideChangeEnd: function(e) {
    let that = this;
    var size = that.setCanvasSize();
    that.setData({
      activeIndex: e.detail.current
    })
    that.createQrCode(that.data.codeList[that.data.activeIndex].qrCode, "mycanvas", size.w, size.h);
  },
  /**
   * 保存到手机
   */
  downCode: function() {
    commonUtil.showLoading('保存中');
    this.getImage()
  },
  getImage: function() {
    let that = this;
    let promise1 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: that.data.imagePath,
        success: function(res) {
          resolve(res);
        },
        fail: function(res) {
          reject(res);
        }
      })
    })
    let promise2 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: '../../../image/badiyun_logo.png',
        success: function(res) {
          resolve(res);
        },
        fail: function(res) {
          reject(res);
        }
      })
    })
    Promise.all([promise1, promise2]).then(() => {
      that.printCode();
    });
  },
  /**
   * 打印二维码canvas
   */
  printCode: function() {
    let that = this;
    let item = that.data.codeList[that.data.activeIndex];
    const phone = that.data.phone;
    const name = that.data.name;
    var ctx = wx.createCanvasContext('canvas'); //非离屏canvas这个是上面html中定义好的
    ctx.clearRect(0, 0, 750, 1018);
    ctx.setFillStyle('#006C00');
    ctx.fillRect(0, 0, 750, 1018);
    ctx.draw(true);
    ctx.setTextBaseline('top');
    ctx.setTextAlign('center');
    ctx.setFontSize(56);
    ctx.setFillStyle('#ffffff');
    ctx.fillText(name, 375, 18);
    ctx.setStrokeStyle('#ffffff');
    ctx.strokeText(name, 375, 18);
    ctx.draw(true);
    ctx.setFontSize(34);
    ctx.setTextAlign('left');
    ctx.fillText('手机号：' + phone, 195, 94);
    ctx.setTextAlign('left');
    ctx.fillText(phone, 333, 94);
    ctx.fillRect(0, 148, 750, 722);
    ctx.drawImage(that.data.imagePath, 112, 208, 526, 526)
    ctx.draw(true);
    ctx.setFontSize(48);
    ctx.setTextAlign('center');
    ctx.setFillStyle('#9a9a9a');
    ctx.fillText(item.desc, 375, 781);
    ctx.drawImage('../../../image/badiyun_logo.png', 112, 907, 348, 72);
    ctx.draw(true);
    ctx.setFillStyle('#ffffff');
    ctx.setTextAlign('left');
    ctx.setFontSize(32);
    ctx.fillText(item.type, 543, 931);
    ctx.draw(true, setTimeout(function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: 1018,
        destWidth: 750,
        destHeight: 1018,
        canvasId: 'canvas',
        success: function(res) {
          console.log('res.tempFilePath' + res.tempFilePath);
          that.setData({
            downFilePath: res.tempFilePath
          })
          that.saveToAlbum() //保存到相册
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }, 2000))
  },
  /**
   * 保存到相册
   */
  saveToAlbum: function() {
    var that = this
    // 生产环境时 记得这里要加入获取相册授权的代码
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序相册功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
              that.startSaveImage()
            },
            fail() {
              commonUtil.hideLoading();
            }
          })
        } else {
          that.startSaveImage()
        }
      }
    })
  },
  startSaveImage() {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.downFilePath,
      success(res) {
        commonUtil.showSuccessToast('保存成功！');
      },
      fail() {
        commonUtil.showSuccessToast('保存失败！');
      },
      complete() {
        commonUtil.hideLoading();
      }
    })

  },
})