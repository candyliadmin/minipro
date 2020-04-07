let debug = true;//是否开启调试模式
const http = debug ? 'test.badiyun.com' : 'api.badiyun.com';
let httpsUrl = 'https://' + http;
let wss = 'wss://' + http + '/wss';
let apiRootUrl = httpsUrl + '/services/transit';
// let imgUrl = '/image';
let imgUrl = 'https://static.badiyun.com/wxapp-agencies/image';
let version = 'v1.3.8.1';

module.exports = {
  httpsUrl: httpsUrl,
  wss: wss,
  apiRootUrl: apiRootUrl,
  imgUrl: imgUrl,
  version: version
}