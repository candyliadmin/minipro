function socketConnent(url, receiveCallBack, sendData) {
  const app = getApp();
  console.log('WebSocket连接中.....！');

  wx.connectSocket({
    url: url?url:'ws://192.168.0.134:8082/ws/gps',
    header: {
      'content-type': 'application/json'
    },
    method: "GET",
    success: function(res) {
      console.log('创建连接成功！');
    },
    fail: function(res) {
      console.log('创建连接失败！');
    }
  });
  /**
   * 监听 WebSocket 接受到服务器的消息事件
   */
  wx.onSocketMessage(function(res) {
    //res 服务器返回的消息
    console.log('我接受到服务器的消息了');
    console.log(res);
    if (receiveCallBack) receiveCallBack();
  });

  /**
   * 监听 WebSocket 连接打开事件
   */
  wx.onSocketOpen(function() {
    //连接成功的 HTTP 响应 Header
    console.log('WebSocket连接已打开！');
    if (sendData) {
      wx.sendSocketMessage(sendData)
    } else {
      wx.sendSocketMessage({
        data: Math.random()
      })
    }
  });

  /**
   * 监听 WebSocket 连接关闭事件
   */
  wx.onSocketClose(function(res) {
    console.log('WebSocket连接已关闭！');
    // setTimeout(function() {
    //   socketConnent();
    // }, 5000);
  });
  /**
   * 监听 WebSocket 错误事件
   */
  wx.onSocketError(function(res) {
    console.log('WebSocket连接打开失败，请检查！');
    // setTimeout(function() {
    //   socketConnent();
    // }, 5000);
  });
}
module.exports = socketConnent