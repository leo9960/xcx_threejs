// pages/pano/pano.js
var app = getApp();
var THREE = app.THREE;
var PANOLENS = app.PANOLENS;
var pl;
var requestAnimationFrame, cancelAnimationFrame;
var panorama, viewer;

Page({
  data: {
  },
  onLoad: function () {
    this.setData({
      canvasWidth: app.SystemInfo.windowWidth * app.SystemInfo.pixelRatio,
      canvasHeight: app.SystemInfo.windowHeight * app.SystemInfo.pixelRatio,
      canvasStyleWidth: app.SystemInfo.windowWidth + "px",
      canvasStyleHeight: app.SystemInfo.windowHeight + "px",
    });
  },
  onReady: function () {
    var self = this;
    var query = wx.createSelectorQuery().select('#webgl').node().exec((res) => {
      var canvas = res[0].node;
      canvas.pixelRatio = app.SystemInfo.pixelRatio;
      canvas.width = canvas._width;
      canvas.height = canvas._height;
      canvas.clientWidth = canvas._width;
      canvas.clientHeight = canvas._height;
      canvas.style = {};
      canvas.style.width = canvas.width;
      canvas.style.height = canvas.height;
      canvas.EventListenerList={};
      canvas.addEventListener = function (type, func, useCapture){
        canvas.EventListenerList[type] = canvas.EventListenerList[type]||[];
        canvas.EventListenerList[type].push(func)
      }
      pl = new PANOLENS.init(canvas,self);
      panorama = new pl.ImagePanorama(canvas,'../../textures/fisheye/pano2048-1024.jpg');
      //panorama = new pl.ImageLittlePlanet(canvas, '../../textures/fisheye/pano2048-1024.jpg');
      viewer = new pl.Viewer({ container: canvas, wxEnv: self, controlBar:false});
      viewer.add(panorama);
      viewer.enableControl(pl.Controls.ORBIT);
      //self.initDeviceOrientation();
      //viewer.enableControl(pl.Controls.DEVICEORIENTATION);
    })
  },
  initDeviceOrientation: function () {
    var self = this;
    wx.startDeviceMotionListening({
      interval:"game",
      success(){
        wx.onDeviceMotionChange(self.onDeviceOrientation)
      }
    })
  },
  destroyDeviceOrientation: function (callback) {
    wx.stopDeviceMotionListening({
      success(){
        viewer.container.EventListenerList["deviceorientation"]=[];
        typeof callback == "function" ? callback():"";
      }
    })
  },
  onDeviceOrientation: function (event) {
    var self=this;
    if (pl.currentorientation == 0) {
      event.alpha = -event.alpha;
      event.beta = -event.beta;
    } else if (pl.currentorientation == 90) {
      self.destroyDeviceOrientation(function () {});
    }
    for (var i in viewer.container.EventListenerList["deviceorientation"]) {
      viewer.container.EventListenerList["deviceorientation"][i](event);
    }
  },
  onTouchStart: function (event) {
    for (var i in viewer.container.EventListenerList["touchstart"]){
      viewer.container.EventListenerList["touchstart"][i](event);
    }
    console.log(viewer.container); 
    console.log(viewer.getScene()); 
  },
  onTouchMove: function (event) {
    for (var i in viewer.container.EventListenerList["touchmove"]) {
      viewer.container.EventListenerList["touchmove"][i](event);
    }
  },
  onTouchEnd: function (event) {
    var self = this;
    for (var i in viewer.container.EventListenerList["touchend"]) {
      viewer.container.EventListenerList["touchend"][i](event);
    }
    wx.nextTick(() => {
      var tmpcam = viewer.getCamera();
      var rescam = { position: {}, rotation: {}, fov: tmpcam.fov};
      for (var i in tmpcam.position){
        rescam.position[i] = parseFloat(tmpcam.position[i]).toFixed(2);
      }
      for (var i in tmpcam.rotation) {
        rescam.rotation[i] = parseFloat(tmpcam.rotation[i]).toFixed(2);
      }
      self.setData({ camera: rescam });
    });
  }, 
  onResize(event) {
    var self=this;
    for (var i in viewer.container.EventListenerList["resize"]) {
      viewer.container.EventListenerList["resize"][i](event);
    }
    switch (event.deviceOrientation) {
      case "landscape":
        viewer.enableControl(pl.Controls.ORBIT);
        viewer.enableEffect(pl.Modes.CARDBOARD);
        pl.currentorientation = 90; 
        self.destroyDeviceOrientation();
        break;
      case "portrait":
        viewer.enableControl(pl.Controls.DEVICEORIENTATION);
        viewer.disableEffect();
        pl.currentorientation = 0;
        self.initDeviceOrientation();
        break;
    }
    for (var i in viewer.container.EventListenerList["orientationchange"]) {
      viewer.container.EventListenerList["orientationchange"][i](pl.currentorientation);
    }
    this.setData({
      canvasWidth: viewer.container._width * app.SystemInfo.pixelRatio,
      canvasHeight: viewer.container._height * app.SystemInfo.pixelRatio,
      canvasStyleWidth: viewer.container._width + "px",
      canvasStyleHeight: viewer.container._height + "px",
      currentorientation:pl.currentorientation
    });
  }
})
