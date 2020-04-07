const imgUrl = '/bank/'
const banks = [
  { open_bank_code: '308', name: '招商银行', code: 'CMB', code_url: 'CMB@2x.png' },
  { open_bank_code: '102', name: '中国工商银行', code: 'ICBC', code_url: 'ICBC@2x.png' },
  { open_bank_code: '105', name: '中国建设银行', code: 'CCB', code_url: 'CCB@2x.png' },
  { open_bank_code: '310', name: '上海浦东发展银行', code: 'SPDB', code_url: 'SPDB@2x.png' },
  { open_bank_code: '103', name: '中国农业银行', code: 'ABC', code_url: 'ABC@2x.png' },
  { open_bank_code: '307', name: '深圳发展银行', code: 'SDB', code_url: 'SDB@2x.png' },
  { open_bank_code: '309', name: '兴业银行', code: 'CIB', code_url: 'CIB@2x.png' },
  { open_bank_code: '303', name: '中国光大银行', code: 'CEB', code_url: 'CEB@2x.png' },
  { open_bank_code: '305', name: '中国民生银行', code: 'CMBC', code_url: 'CMBC@2x.png' },
  { open_bank_code: '302', name: '中信银行', code: 'CITIC', code_url: 'CITIC@2x.png' },
  { open_bank_code: '306', name: '广东发展银行', code: 'GDB', code_url: 'GDB@2x.png' },
  { open_bank_code: '318', name: '平安银行', code: 'SZPAB', code_url: 'SZPAB@2x.png' },
  { open_bank_code: '104', name: '中国银行', code: 'BOC', code_url: 'BOC@2x.png' },
  { open_bank_code: '301', name: '中国交通银行', code: 'COMM', code_url: 'COMM@2x.png' },
  { open_bank_code: '100', name: '中国邮政储蓄银行', code: 'PSBC', code_url: 'PSBC@2x.png' },
  { open_bank_code: '401', name: '上海银行', code: 'BOS', code_url: 'BOS@2x.png' },
  { open_bank_code: '1408', name: '顺德农商', code: 'SDEB', code_url: 'SDEB@2x.png' },
  { open_bank_code: '304', name: '华夏银行', code: 'HXB', code_url: 'HXB@2x.png' },
  { open_bank_code: '403', name: '北京银行', code: 'BCCB', code_url: 'BCCB@2x.png' },
  { open_bank_code: '317', name: '渤海银行', code: 'CBHB', code_url: 'CBHB@2x.png' },
  { open_bank_code: '311', name: '恒丰银行', code: 'EGBANK', code_url: 'EGBANK@2x.png' },
  { open_bank_code: '316', name: '浙商银行', code: 'CZB', code_url: 'CZB@2x.png' },
  { open_bank_code: '423', name: '杭州银行', code: 'HCCB', code_url: 'HCCB@2x.png' },
  { open_bank_code: '479', name: '包商银行', code: 'BSB', code_url: 'BSB@2x.png' },
  { open_bank_code: '441', name: '重庆银行', code: 'CQCB', code_url: 'CQCB@2x.png' },
  { open_bank_code: '442', name: '哈尔滨银行', code: 'HBCB', code_url: 'HBCB@2x.png' },
  { open_bank_code: '508', name: '江苏银行', code: 'JSBC', code_url: 'JSBC@2x.png' },
  { open_bank_code: '408', name: '宁波银行', code: 'NBCB', code_url: 'NBCB@2x.png' },
  { open_bank_code: '424', name: '南京银行', code: 'NJCB', code_url: 'NJCB@2x.png' },
  { open_bank_code: '435', name: '郑州银行', code: 'ZZCB', code_url: 'ZZCB@2x.png' },
  { open_bank_code: '434', name: '天津银行', code: 'TCCB', code_url: 'TCCB@2x.png' },
  { open_bank_code: '1418', name: '北京农商行', code: 'BJRCB', code_url: 'BJRCB@2x.png' },
  { open_bank_code: '461', name: '长沙银行', code: 'CSCB', code_url: 'CSCB@2x.png' },
  { open_bank_code: '530', name: '浙江稠州商业银行', code: 'CZCB', code_url: 'CZCB@2x.png' },
  { open_bank_code: '413', name: '广州市商业银行', code: 'GZCB', code_url: 'GZCB@2x.png' },
  { open_bank_code: '414', name: '汉口银行', code: 'HKBCHINA', code_url: 'HKBCHINA@2x.png' },
  { open_bank_code: '440', name: '徽商银行', code: 'HSBANK', code_url: 'HSBANK@2x.png' },
  { open_bank_code: '1401', name: '上海农村商业银行', code: 'SHRCB', code_url: 'SHRCB@2x.png' },
  { open_bank_code: '1404', name: '深圳农村商业银行', code: 'SNXS', code_url: 'SNXS@2x.png' },
  { open_bank_code: '412', name: '温州市商业银行', code: 'WZCB', code_url: 'WZCB@2x.png' },
  { open_bank_code: '8001', name: '农村商业银行', code: 'RCB', code_url: 'default-bank@2x.png' },
  { open_bank_code: '8002', name: '农村信用合作社', code: 'RCC', code_url: 'RCC@2x.png' },
  { open_bank_code: '8003', name: '村镇银行', code: 'COUNTYBANK', code_url: 'default-bank@2x.png' },
  {
    open_bank_code: '8004',
    name: '城市商业银行',
    code: 'CITYBANK',
    code_url: 'default-bank@2x.png',
  },
  { open_bank_code: '8005', name: '城市信用合作社', code: 'UCC', code_url: 'default-bank@2x.png' },
  { open_bank_code: '8006', name: '农村合作银行', code: 'URCB', code_url: 'URCB@2x.png' },
  { open_bank_code: '8007', name: '华润银行', code: 'CRB', code_url: 'CRB@2x.png' },
  { open_bank_code: '8008', name: '成都银行', code: 'BOCD', code_url: 'BOCD@2x.png' },
  { open_bank_code: '8009', name: '南粤银行', code: 'GDNYB', code_url: 'GDNYB@2x.png' },
  { open_bank_code: '8010', name: '重庆三峡银行', code: 'CCQTGB', code_url: 'CCQTGB@2x.png' },
  { open_bank_code: '8011', name: '集友银行', code: 'CYB', code_url: 'CYB@2x.png' },
  { open_bank_code: '8012', name: '广州市农信社', code: 'GNXS', code_url: 'default-bank@2x.png' },
  { open_bank_code: '8013', name: '东亚银行', code: 'HKBEA', code_url: 'HKBEA@2x.png' },
  { open_bank_code: '8014', name: '湖南农信社', code: 'HNNXS', code_url: 'HNNXS@2x.png' },
  { open_bank_code: '8015', name: '顺德农信社', code: 'SDE', code_url: 'default-bank@2x.png' },
  { open_bank_code: '8016', name: '晋城市商业银行', code: 'SXJS', code_url: 'default-bank@2x.png' },
  {
    open_bank_code: '8017',
    name: '尧都信用合作联社',
    code: 'YDXH',
    code_url: 'default-bank@2x.png',
  },
  {
    open_bank_code: '8018',
    name: '珠海市农村信用合作社',
    code: 'ZHNX',
    code_url: 'default-bank@2x.png',
  },
  { open_bank_code: '8019', name: '渣打银行', code: 'SCB', code_url: 'SCB@2x.png' },
  { open_bank_code: '8100', name: '微信支付', code: 'WXPAY', code_url: 'WXPAY@2x.png' },
];

function getBank(code) {
  if (code) {
    banks.filter((bank) => code === bank.code);
  }
}
function getBankLogo(code) {
  let url = '';
  if (code) {
    const bankInfo = banks.filter((bank) => code === bank.code);
    if (bankInfo && bankInfo.length > 0) {
      url = imgUrl + bankInfo[0].code_url;
    }
  }
  return url;
}

module.exports = {
  getBank,
  getBankLogo,
};