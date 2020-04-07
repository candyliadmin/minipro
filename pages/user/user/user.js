
const app = getApp();
const login = require('../../../utils/login.js');

Component({
  data: {
    imgUrl: app.globalData.imgUrl,
    hasUserInfo: false,
    userPhone: '',
    roleName: [],
    accountInfo: {},
    version: app.globalData.version,
    isManage:false,
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      if (app.globalData.roleName) {
        this.setData({
          roleName: app.globalData.roleName,
        })
        this.isManage();
      }
      if (app.globalData.userPhone) {
        this.setData({
          userPhone: app.globalData.userPhone,
        })
      }
      if (app.globalData.accountInfo) {
        this.setData({
          accountInfo: app.globalData.accountInfo,
          hasUserInfo: true
        })
      } else {
        login.getAccountInfo().then((res) => {
          this.setData({
            accountInfo: res,
            userPhone: res.phoneNumber,
            roleName: app.globalData.roleName,
            hasUserInfo: true
          })
          this.isManage();
        })
      }
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
    },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    /**
     * 获取账号信息
     */
    getUserInfo: function (e) {
      const _this = this;
      app.globalData.userInfo = e.detail.userInfo
      _this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      if (e.currentTarget.dataset) {
        if (e.currentTarget.dataset.login) {
          _this.login();
        }
      }
    },
    logout: function () {
      wx.clearStorageSync();
      app.globalData.accountInfo = null;
      app.globalData.isLogined = false;
      app.globalData.userPhone = '';
      app.globalData.roleName = [];
      this.setData({
        userInfo: null,
        hasUserInfo: false,
        isLogined: false,
        userPhone: ''
      });
      wx.showToast({
        title: '退出成功',
      })
      wx.reLaunch({
        url: '/pages/homepage/guidePage/guidePage',
      })
    },

    login: function () {
      const prePageUrl = this.route;
      wx.redirectTo({
        url: '/pages/login/login?prePageUrl=' + prePageUrl + '&isBar=true',
      })
    },
    isManage:function(){
      const roles = app.globalData.roleName || [];
      if (roles && roles.indexOf('MANAGER')!=-1){
        this.setData({
          isManage:true
        })
      }
    }
  }
})