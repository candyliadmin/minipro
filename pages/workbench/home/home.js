var app = getApp();
var globalData = app.globalData;
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
const login = require('../../../utils/login.js');

Component({
  data: {
    authGrids: BASICDATA.authGrids,
    grids: [],
    imgUrl: globalData.imgUrl,
    tabBar: BASICDATA.tabbar
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.getAccountInfo();
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    /**
     * 获取账号信息
     */
    getAccountInfo: function () {
      let that = this;
      login.getAccountInfo().then((res) => {
        const roles = res.roles;
        const grids = login.getAccountAuth(res);
        const gridsAuth = [];

        for (let j = 0; j < grids.length; j++) {
          if (that.data.authGrids[grids[j]]) {
            gridsAuth.push(that.data.authGrids[grids[j]])
          }
        }
        that.setData({
          grids: login.classifyGrids(gridsAuth)
        })
        wx.stopPullDownRefresh();
      })
    },
  }
})