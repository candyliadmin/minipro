const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const formatDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [month, day].map(formatNumber).join('-')
}

const formatMonth = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return [year, month].map(formatNumber).join('-')
}

const formatHour = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute].map(formatNumber).join(':')
}

const customDate = (date, char) => {
  let d = new Date(date);
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  char = char ? char : ''

  return [year, month, day].map(formatNumber).join(char)
}

const getYesterday = date => {
  let day1 = date ? date : new Date();
  day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
  return day1;
}

const getTomorrow = date => {
  let day1 = date ? date : new Date();
  day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000);
  return day1;
}

const getCustomday = (date, num) => {
  let day1 = date ? date : new Date();
  day1.setTime(day1.getTime() - (- 24 * (num ? num : 1) * 60 * 60 * 1000));
  return day1;
}

//上一月
const preMonth = (curMonth)=> {
  curMonth = curMonth ? curMonth : new Date();
  var month = curMonth.getMonth() - 1;
  curMonth.setMonth(month);
  return curMonth;
}
//下一月
const nextMonth = (curMonth) => {
  curMonth = curMonth ? curMonth : new Date();
  var month = curMonth.getMonth() + 1;
  curMonth.setMonth(month);
  return curMonth;
}

const getCustomMonth = (curMonth,num) => {
  curMonth = curMonth ? curMonth : new Date();
  var month = curMonth.getMonth() + (num ? num:1);
  curMonth.setMonth(month);
  return curMonth;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getFirstDayOfMonth(date) {
  date.setDate(1);
  return new Date(date);
}

function getLastDayOfMonth(date) {
  var now = new Date(date); //当前日期 
  var nowMonth = now.getMonth(); //当前月 
  var nowYear = now.getFullYear(); //当前年 
  //本月的开始时间
  var monthStartDate = new Date(nowYear, nowMonth, 1);
  //本月的结束时间
  var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
  return monthEndDate;
}

function formatStr(date) {
  return new Date(date.replace(/\-/g, '/').replace('.0', ''))
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatMonth: formatMonth,
  formatDay: formatDay,
  customDate: customDate,
  formatNumber: formatNumber,
  getYesterday: getYesterday,
  getTomorrow: getTomorrow,
  formatHour: formatHour,
  getFirstDayOfMonth: getFirstDayOfMonth,
  getLastDayOfMonth: getLastDayOfMonth,
  getCustomday: getCustomday,
  preMonth: preMonth,
  nextMonth: nextMonth,
  getCustomMonth: getCustomMonth,
  formatStr: formatStr
}