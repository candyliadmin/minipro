import {
  CONFIG
} from '../config/config.js';
var api = require("../config/api.js");

//判断值是否为空
function isEmpty(value) {
  if (value == undefined) {
    return true;
  }
  if (value == null) {
    return true;
  }
  if (typeof(value) == "string") {
    if (value.trim() == "") {
      return true;
    }
  }
  return false;

}

function showSuccessToast(text, time) {
  wx.showToast({
    title: text,
    duration: time ? time : 1000
  })
}

function showToast(text, time) {
  wx.showToast({
    icon: 'none',
    title: text,
    duration: time ? time : 1000
  })
}

function showErrorToast(text) {
  wx.showToast({
    title: text,
    // image: 'https://m.chepaidang.cc/xcxImg/image/login/error@2x.png',
    duration: 2000
  })
}

function showModal(config={}) {
  wx.showModal(Object.assign({
    title: '提示',
    content: '提示信息',
    showCancel: true,
    confirmColor: "#3E7EE2"
  }, config))
}


function showLoading(text) {
  wx.showLoading({
    title: text,
    mask: true
  })
}

function hideLoading() {
  wx.hideLoading();
}
/**
 * 输出打印信息
 */
function consolelog(msg) {
  if (CONFIG.debug) {
    console.log(msg);
  }
}

function getRad(d) {
  return d * Math.PI / 180.0;
}
/**
 * 计算两点距离
 * 参数类型必须是number
 */
function getDistance(lat1, lng1, lat2, lng2) {
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = 6378137.0; //单位M
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  var str = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  // console.log(typeof (lat1))//注意类型是number
  // console.log(lat1+","+lng1+"-"+lat2+","+lng2+"距离："+str);
  return str;
}

/**
 * 获取数组对象属性，用于sort排序时查找排序字段
 */
function getAttr(arr, obj) {
  let attr = '';
  if (!arr || !arr.length || !obj) return false;
  for (let i = 0; i < arr.length; i++) {
    if (attr) {
      attr = attr[arr[i]] ? attr[arr[i]] : ''
    } else {
      attr = obj[arr[i]] ? obj[arr[i]] : ''
    }
  }
  return attr;
}
/**
 * 判断对象数组是否存在某属性值
 * arr 数组对象
 * attr 对象属性
 * val 值
 */
function inObjArr(arr, attr, val) {
  for (let i = 0; i < arr.length; i++) {
    // console.log(arr[i][attr])
    if (arr[i][attr] === val) {
      return true;
    }
  }
  return false;
}
/**
 * 比较大小
 */
function compare(prop) {
  return function(obj1, obj2) {
    let attr = [];
    if (prop.indexOf(".") != -1) {
      attr = prop.split(".");
    }
    var val1 = attr ? getAttr(attr, obj1) : obj1[prop];
    var val2 = attr ? getAttr(attr, obj2) : obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET", header) {
  let token = wx.getStorageSync("token");
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header ? header : {
        "content-Type": "application/json",
        "authorization": "Bearer " + token["access_token"]
      },
      success: function(res) {
        switch (res.statusCode) {
          case 400:
            showToast(res.data.errorMsg || res.data.message,1500);
            break;
          case 401:
            let pages = getCurrentPages();
            let prePageUrl = pages[0].route;
            if (prePageUrl != 'pages/common/login/login') {
              wx.redirectTo({
                url: '/pages/common/login/login?prePageUrl=' + prePageUrl + '&isBar=true'
              })
            } else {
              wx.showModal({
                title: '',
                content: '该账号不存在，请去后台录入',
                showCancel: false,
                confirmText: '好的',
                success(res) {}
              })
            }
            break;
          case 403:
            showToast('没有该权限', 1500);
            break;
          case 404:
            showToast('没找到相关页面', 1500);
            break;
          case 500:
            showToast('服务器正忙', 1500);
            break;
          default:
            if (res.statusCode == 200 || res.statusCode == 201) {
              if (res.data.errno == 401) {
                //需要登录后才可以操作
                wx.showModal({
                  title: '',
                  content: '请先登录',
                  success: function(res) {
                    if (res.confirm) {}
                  }
                });
              } else {
                resolve(res.data);
              }
            } else {
              reject(res.data);
            }
        }
      },
      fail: function(err) {
        wx.hideLoading();
        showToast('加载失败！')
        reject(err)
        console.log("failed")
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  });
}

/*
  *  base64编码(编码，配合encodeURIComponent使用)
  *  @parm : str 传入的字符串
  *  使用：
        1、引入util.js(路径更改) :const util  = require('../../utils/util.js');
        2、util.base64_encode(util.utf16to8('base64 编码'));
 */
function base64_encode(str) {
  //下面是64个基本的编码
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
}
/*
 *  base64编码(编码，配合encodeURIComponent使用)
 *  @parm : str 传入的字符串
 */
function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

/*
  *  base64解码(配合decodeURIComponent使用)
  *  @parm : input 传入的字符串
  *  使用：
        1、引入util.js(路径更改) :const util  = require('../../utils/util.js');
        2、util.base64_decode('YmFzZTY0IOe8lueggQ==');
 */
function base64_decode(input) {
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  return utf8_decode(output);
}

/*
 *  utf-8解码
 *  @parm : utftext 传入的字符串
 */
function utf8_decode(utftext) {
  var string = '';
  let i = 0;
  let c = 0;
  let c1 = 0;
  let c2 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c1 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      i += 2;
    } else {
      c1 = utftext.charCodeAt(i + 1);
      c2 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      i += 3;
    }
  }
  return string;
}

/*
  * base64编码函数封装
  * @parm: str(传入要编成base64的内容)
  * 使用：
      1、引入util.js(路径更改) :const util  = require('../../utils/util.js');
      2、util.baseEncode('base64 编码');
*/
function baseEncode(str) {
  return base64_encode(utf16to8(str));
}
/*
  * base64解码函数封装
  * @parm: str(传入要解为正常字体)
  * 使用：
      1、引入util.js(路径更改) :const util  = require('../../utils/util.js');
      2、util.baseDecode(util.baseEncode('base64 编码'))
*/
function baseDecode(str) {
  return base64_decode(str);
} // 抛出函数使用
module.exports = {
  isEmpty: isEmpty,
  showSuccessToast: showSuccessToast,
  showToast: showToast,
  showErrorToast: showErrorToast,
  showModal: showModal,
  showLoading: showLoading,
  hideLoading: hideLoading,
  getDistance: getDistance,
  compare: compare,
  request: request,
  inObjArr: inObjArr,
  baseEncode: baseEncode,
  baseDecode: baseDecode,
}