# xcx_threejs
基于three.js r97改造

在小程序中直接引入

var THREE=require("three.js")

即可使用

### 关于Texture的加载

目前推荐使用TextureLoader.load(canvas,path)方式加载，或者可以另外创建一个Canvas，将图片通过drawImage画上去，再用wx.canvasGetImageData获取像素点数据传入DataTexture(data,width,height)

##### 有任何建议可以在issue中随意发表，毕竟这个只是刚开始，各位也可以按照思路自行把用到的方法改造到可用
