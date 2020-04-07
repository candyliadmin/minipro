var CONFIG = require("config/config.js");
var util = require("utils/commonUtil.js");
App({
  //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function() {
  },

  globalData: {
    accountInfo: null,
    roleName:[],
    userPhone: '',
    host: CONFIG.httpsUrl,
    wss: CONFIG.wss,
    imgUrl: CONFIG.imgUrl,
    version:CONFIG.version,
    environment:'',
  },
  editTabBar: function (tabBar) {
    if (!tabBar) return false;
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true; //根据页面地址设置当前页面状态
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },

})