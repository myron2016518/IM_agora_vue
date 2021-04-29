// @ts-nocheck
/* eslint-disable */

const log = console.log.bind(console);

const produceCode = () => {
  // let code = ''
  // for(let i = 0; i < 4; i++) {
  //   let number = Math.floor(Math.random()*10)
  //   code += number
  // }
  // return code
  // return '2012360'
  let _info = getQueryStringArgs();
  console.log("====", _info);
  return _info.userid || "2012361";
};

/**
 * 解析查询字符串，返回包含所有参数的对象
 */
function getQueryStringArgs() {
  var qs =
      window.location.search.length > 0
        ? window.location.search.substring(1)
        : "",
    args = {},
    items = qs.length > 0 ? qs.split("&") : [],
    item = null,
    name = null,
    value = null;
  items.map((arg, index) => {
    let _sub = "=",
      _v = "";
    let _urlindex = arg.indexOf(_sub);
    _v = arg.substring(_urlindex + _sub.length, arg.length);
    _v && (value = decodeURIComponent(_v));

    item = arg.split("=");
    name = decodeURIComponent(item[0]);
    // value = item[1] && decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  });
  return args;
}

const getUserCode = () => {
  let localStorageCode = localStorage.getItem("usercode");
  if (localStorageCode === null) {
    var usercode = produceCode();
    localStorage.setItem("usercode", usercode);
    return usercode;
  }
  return localStorageCode;
};

const getRoomCode = (c1, c2) => {
  let roomCode = "";
  roomCode = c1 + c2;
  return roomCode;
};

const debounce = function(foo, t) {
  let timer;
  return function() {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      foo.apply(this, arguments);
    }, t);
  };
};

export {
  log,
  produceCode,
  getUserCode,
  getRoomCode,
  debounce,
  getQueryStringArgs
};
