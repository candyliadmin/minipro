Component({

  ready() {
    this.animation = wx.createAnimation({
      duration: 350,
    });
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    confirmText:{
      type:String,
      value:'确定'
    },
    cancleText: {
      type: String,
      value: '取消'
    },
    showCancel: {
      type: Boolean,
      value: true
    }
  },

  options: {
    multipleSlots: true
  },

  methods: {

    close() {
      const animation = this.animation
      animation.opacity(0).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(() => {
        this.setData({
          show: false
        })
      }, 350)
    },

    open() {
      const animation = this.animation
      animation.opacity(0).step()
      this.setData({
        animationData: animation.export(),
        show: true
      })
      setTimeout(() => {
        animation.opacity(1).step()
        this.setData({
          animationData: animation.export(),
        })
      }, 50)
    },

    _clickMask() {
      // this.setData({show: false})
    },

    _cancel() {
      this.triggerEvent('cancel')
    },

    _confirm() {
      this.triggerEvent('confirm')
    },
  }
})
