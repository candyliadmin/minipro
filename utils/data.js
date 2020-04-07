//基础数据
const imgUrl = '/image/index/';
const BASICDATA = {
  dutyType: ["司机", "乘务"],
  sexType: ["男", "女"],
  genderType: {
    M: "男",
    F: "女",
  },
  roleType: {
    DRIVER: "驾驶员",
    ATTENDANT: "乘务员",
    MANAGER: '车老板'
  },
  directionType: ["上行", "下行", "单边", "环形"],
  directionDes: ['', '上行+下行', '单边', '环形'],
  linetype: ['电车', '地铁', '铁路', '巴士', '渡轮', '有轨电车', '空中升降机', '缆索铁路'],
  vehicleType: ['', '大巴', '中巴', '小巴', '其他'],
  clockInState: [{
    text: '发车',
    btnType: 'btn-green'
  }, {
    text: '到达',
    btnType: 'btn-orange'
  }, {
    text: '已完成',
    btnType: ''
  }],
  reportState: [{
    text: '未上报',
    btnType: 'state-blue-btn'
  }, {
    text: '上报',
    btnType: 'state-red-btn'
  }, {
    text: '已上报',
    btnType: ''
  }],
  overViewType: ['今日营收', '昨日营收', '本月营收'],
  accountType: {
    "alipay": {
      name: '支付宝账户',
      image: '/page/account/zfb.png'
    },
    "wx_pub": {
      name: '微信账户',
      image: '/page/account/wxpay.png'
    },
    'bank_account': {
      name: '银行卡账户',
      image: '/page/account/cardpay.png'
    },
  },
  menuTypes: {
    "transitMan": {
      name: '交易管理'
    },
    "sourceMan": {
      name: '资源管理'
    },
    "businessMan": {
      name: '业务管理'
    },
    "financeMan": {
      name: '账务管理'
    },
    "systemMan": {
      name: '系统管理'
    },
    "other": {
      name: '其他功能'
    },
  },
  authGrids: [{
    index: 0,
    imgUrl: imgUrl + 'overview.png',
    text: '交易数据',
    menuType: 'transitMan',
    navUrl: '/pages/overview/overview'
  }, {
    index: 1,
    imgUrl: imgUrl + 'lines.png',
    text: '线路管理',
    menuType: 'sourceMan',
    navUrl: '/pages/line/line'
  }, {
    index: 2,
    imgUrl: imgUrl + 'vehicle.png',
    text: '车辆管理',
    menuType: 'sourceMan',
    navUrl: '/pages/vehicle/vehicle/vehicle'
  }, {
    index: 3,
    imgUrl: imgUrl + 'driver-passenger.png',
    text: '员工管理',
    menuType: 'sourceMan',
    navUrl: '/pages/driveAndPassenger/driveAndPassenger'
  }, {
    index: 4,
    imgUrl: imgUrl + 'operation.png',
    text: '营运管理',
    menuType: 'businessMan',
    navUrl: '/pages/operationManage/operationManage'
  }, {
    index: 5,
    imgUrl: imgUrl + 'statistic.png',
    text: '订单明细',
    menuType: 'transitMan',
    navUrl: '/pages/dataDetails/dataDetails'
  }, {
    index: 6,
    imgUrl: imgUrl + 'security.png',
    text: '安全管理',
    menuType: 'other',
    navUrl: '/pages/securityManage/securityManage'
  }, {
    index: 7,
    imgUrl: imgUrl + 'notice.png',
    text: '通知公告',
    menuType: 'systemMan',
    navUrl: '/pages/common/emptyPage/emptyPage'
  }, {
    index: 8,
    imgUrl: imgUrl + 'violate.png',
    text: '违章通知',
    menuType: 'systemMan',
    navUrl: '/pages/common/emptyPage/emptyPage'
  }, {
    index: 9,
    imgUrl: imgUrl + 'review.png',
    text: '年审年检',
    menuType: 'other',
    navUrl: '/pages/common/emptyPage/emptyPage'
  }, {
    index: 10,
    imgUrl: imgUrl + 'delivery.png',
    text: '巴士快递',
    menuType: 'other',
    navUrl: '/pages/common/emptyPage/emptyPage'
  }, {
    index: 11,
    imgUrl: imgUrl + 'knowledge.png',
    text: '知识学习',
    menuType: 'other',
    navUrl: '/pages/knowledge/knowledge'
  }, {
    index: 12,
    imgUrl: imgUrl + 'schedule.png',
    text: '排班打卡',
    menuType: 'businessMan',
    navUrl: '/pages/mySchedule/mySchedule/mySchedule'
  }, {
    index: 13,
    imgUrl: imgUrl + 'receivables.png',
    text: '二维码收款',
    menuType: 'businessMan',
    navUrl: '/pages/codeReceipt/codeReceipt'
  }, {
    index: 14,
    imgUrl: imgUrl + 'receipts.png',
    text: '收款上报',
    menuType: 'businessMan',
    navUrl: '/pages/receipts/receipts/notReported/notReported'
  }, {
    index: 15,
    imgUrl: imgUrl + 'account.png',
    text: '企业账户',
    menuType: 'financeMan',
    navUrl: '/pages/enterpriseAccount/account/account'
  }, {
    index: 16,
    imgUrl: imgUrl + 'gongdan.png',
    text: '工单统计',
    menuType: 'businessMan',
      navUrl: '/pages/workbench/workOrder/index/index'
  }],
  roleGrids: {
    "MANAGER": [
      [0, 1, 2, 3, 4, 5, 15,16],
      [6, 7, 8, 9, 10, 11]
    ],
    "DRIVER": [
      [12,16],
      [7, 10, 11]
    ],
    "ATTENDANT": [
      [12, 13, 14,16],
      [7, 10, 11]
    ]
  },
  commonUse: {
    "MANAGER": [0, 4, 15, 12],
    "DRIVER": [12, 7, 10, 11],
    "ATTENDANT": [12, 7, 10, 11],
  },
  tabbar: {
    color: "#B5B5B5",
    selectedColor: "#3E7EE2",
    borderStyle: "white",
    list: [{
        selectedIconPath: "/image/tabbar/dengche-select.png",
        iconPath: "/image/tabbar/dengche.png",
        pagePath: "/pages/homepage/homepage",
        text: "首页",
        clas: "menu-item",
        selected: true,
        show: true,
        auth: []
      },
      {
        selectedIconPath: "/image/tabbar/code.png",
        iconPath: "/image/tabbar/code.png",
        pagePath: "/pages/codeDeparture/codeDeparture/codeDeparture",
        text: "扫码发车",
        clas: "menu-item2",
        selected: false,
        show: false,
        auth: ['DRIVER', 'ATTENDANT']
      },
      {
        selectedIconPath: "/image/tabbar/my-select.png",
        iconPath: "/image/tabbar/my.png",
        pagePath: "/pages/user/user/user",
        text: "我的",
        clas: "menu-item",
        selected: false,
        show: true,
        auth: []
      }
    ],
    position: "bottom"
  }
}

module.exports = BASICDATA