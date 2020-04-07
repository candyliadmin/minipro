// components/collectGuide/emptyData.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bordered:{
      type:Boolean,
      value:true
    },
    small:{
      type:Boolean,
      value:false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
