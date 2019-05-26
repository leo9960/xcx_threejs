//app.js
var THREE=require("./utils/three.js");
App({
  THREE: THREE, 
  PANOLENS:require("./utils/panolens.js"),
  SystemInfo:wx.getSystemInfoSync(),
  onLaunch: function () {
  },
})