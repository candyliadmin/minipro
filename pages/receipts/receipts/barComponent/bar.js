const app = getApp();
const api = require('../../../../config/api.js');
const commonUtil = require('../../../../utils/commonUtil.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabcon: [{
      name: '未上报',
      key: 'UNREPORTED',
      isReport: false,
      msgKey: '',
      url:'/pages/receipts/receipts/notReported/notReported',
    }, {
      name: '已上报',
      key: 'REPORTED',
      isReport: false,
        msgKey: 'auditedStatus',
        url: '/pages/receipts/receipts/reported/reported',
    }, {
      name: '被驳回',
      key: 'REJECT',
      isReport: false,
        msgKey: 'rejectStatus',
        url: '/pages/receipts/receipts/rejected/rejected',
    }],
    newMsg: {
      "id": '',
      "rejectStatus": 0,
      "auditedStatus": 0,
      "timeoutStatus": 0
    }, //是否有上报相关消息
  },
  ready: function () {
    this.getNewMsg();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getNewMsg: function() {
      let that = this;
      commonUtil.request(api.receiptStatusMessageUrl).then((res) => {
        that.setData({
          newMsg: res
        })
      })
    },
  }
})