var app = getApp();
var globalData = app.globalData;
const commonUtil = require('../../../utils/commonUtil.js');
const BASICDATA = require('../../../utils/data.js');
const login = require('../../../utils/login.js');
const dateFormat = require('../../../utils/dateFormat.js');
const api = require('../../../config/api.js');

Component({
  data: {
    authGrids: BASICDATA.authGrids,
    grids: [],
    imgUrl: globalData.imgUrl,
    accountInfo:null,//账号信息
    account:null,//账户余额信息
    notice:{
      system:[],
      message:[],
    },
    dataTab:[
      { 'name': '今日', date: '' },
      { 'name': '昨日', date: '' },
    ],
    dataTabActive: 0,
    scheduleTab: [
      { 'name': '今日发车', date: '' },
      { 'name': '明日发车', date: '' },
    ],
    scheduleTabActive: 0,
    directionType: BASICDATA.directionType, // 方向字典
    scheduleList:[],//我的排班列表
    dataPanel:null,//数据面板
    isManage:false,
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.getAccountInfo();
      this.setData({
        dataTab: [
          { 'name': '今日', date: dateFormat.formatDay(new Date()) },
          { 'name': '昨日', date: dateFormat.formatDay(dateFormat.getYesterday(new Date())) },
        ],
        scheduleTab: [
          { 'name': '今日发车', date: dateFormat.formatDay(new Date()) },
          { 'name': '明日发车', date: dateFormat.formatDay(dateFormat.getTomorrow(new Date())) },
        ],
      })
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
    getAccountInfo: function () {
      let that = this;
      login.getAccountInfo().then((res) => {
        let grids = [], temp = [],isManage = false;
        if (app.globalData.roleName.indexOf("MANAGER")!=-1){
          isManage = true;
          temp = BASICDATA.commonUse.MANAGER;
          that.getAccount();
          that.getDataPanel();
        } else if (app.globalData.roleName.indexOf("DRIVER") != -1) {
          temp = BASICDATA.commonUse.DRIVER;
          that.getScheduleList();
        } else if (app.globalData.roleName.indexOf("ATTENDANT") != -1) {
          temp = BASICDATA.commonUse.ATTENDANT;
          that.getScheduleList();
        }
        
        temp.forEach((value)=>{
          for(let i = 0; i<that.data.authGrids.length;i++){
            if (value == that.data.authGrids[i].index){
              grids.push(that.data.authGrids[i]);
              break;
            }
          }
        })
        that.setData({
          accountInfo: res,
          grids,
          isManage
        })
      })
    },
    /**
     * 获取账户余额
     */
    getAccount:function(){
      commonUtil.request(api.businessAccountUrl).then((res) => {
        this.setData({
          account: res
        })
      })
    },
    /**
     * 数据面板今明日切换
     */
    handDataTab:function(e){
      const index = e.currentTarget.dataset.index;
      this.setData({
        dataTabActive: index
      })
      this.getDataPanel();
    },
    /**
     * 获取数据面板数据
     */
    getDataPanel: function () {
      const date = this.data.dataTab[this.data.dataTabActive].date;
      const year = (new Date()).getFullYear();
      commonUtil.request(api.dataPanelUrl,{
        date: date ? year + date.replace(/-/g, '') : '',
      }).then((res) => {
        this.setData({
          dataPanel: res
        })
      })
    },
    /**
     * 我的排班今明日切换
     */
    handScheduleTab: function (e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        scheduleTabActive: index
      })
      this.getScheduleList(true);
    },
    /**
     * 获取排班列表
     * @isRefresh 是否重新加载
     */
    getScheduleList: function (isRefresh) {
      const that = this;
      const date = that.data.scheduleTab[that.data.scheduleTabActive].date;
      const year = (new Date()).getFullYear();
      let pageNo = isRefresh ? 0 : that.data.pageNo;

      // 根据当前用户角色展示排班信息
      const roles = app.globalData.roleName;
      let roleType = '';
      if (roles.indexOf('DRIVER') != -1 && roles.indexOf('ATTENDANT') != -1) {
        roleType = '';
      } else if (roles.indexOf('DRIVER') != -1) {
        roleType = 0;
      } else if (roles.indexOf('ATTENDANT') != -1) {
        roleType = 1;
      }
      commonUtil.request(api.workEffortRolesUrl, {
        page: pageNo,
        size: 10,
        roleType: roleType,
        day: date ? year + date.replace(/-/g, '') : ''
      }).then((res) => {
        wx.hideToast();
        that.setData({
          scheduleList: isRefresh ? res.content : that.data.scheduleList.concat(res.content),
          pageNo: ++res.number,
          totalPage: res.totalPages,
          loading: false,
        })
        wx.stopPullDownRefresh();
      })
    },
  }
})