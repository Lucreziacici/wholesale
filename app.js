//app.js
var network = require("/libs/network.js")
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    // this.GetAccessToken();
    // this.getUserInfo();
  },
  //获取系统配置 暂时没有用到 以后可能模板消息会遇到
  // GetAccessToken:function(){
  //   network.GET('WxConfig/GetAccessToken', 
  //   (res) => {
  //   console.log(res)
  //   }, (res) => {
  //     console.log(res);
  //   })
  // },
  getUserInfo: function (cb) {
    if (this.globalData.userInfo && this.globalData.open_id) {
      typeof cb == "function" && cb(this.globalData.userInfo, this.globalData.open_id)
    } else {
      //调用登录接口
      wx.login({
        success:  (e)=> {
          wx.request({
            //正式
            url: "https://mall.shjinjia.com.cn/api/Customer/GetOpenID?js_code=" + e.code + "",
            //测试
            // url: "https://mallt.shjinjia.com.cn/api/Customer/GetOpenID?js_code=" + e.code + "",
            //文慧
            // url: "http://10.10.200.4/MiniProgramMall.Api/api/Customer/GetOpenID?js_code=" + e.code + "",
            header: {
              'Content-Type': 'application/json',
              'shop_id': '5'
            },
            success: (res) => {
              console.log(res)
              this.globalData.open_id = res.data.res_content.open_id;
              this.globalData.userInfo = res.data.res_content;
              typeof cb == "function" && cb(this.globalData.userInfo, res.data.res_content.open_id)
              if (res.data.res_content.phone==null){
                // setTimeout(function () {
                  wx.navigateTo({
                    url: '../login/login?openid=' + res.data.res_content.open_id
                  })
                // }, 200)
              
              }
                wx.setStorage({
                  key: 'open_id',
                  data: res.data.res_content.open_id,
                });
                wx.setStorage({
                  key: 'userinfo',
                  data: res.data.res_content,
                });
            },
            fail: function (res) {
              console.log(res)
            }
          });
        }
      })
    }
  },
  globalData: {
    url: 'https://fx.comeyang.com',
    // appid: 'wx56cdb2dddcd85394',//appid需自己提供，此处的appid我随机编写  
    // // secret: '37951450999e53b003be17fb540179e0',//secret需自己提供，此处的secret我随机编写 
    // // partner: '1488718912',//商户号
    // // partnerkey: 'LnFqv5I4LFGSDq3QjsNgUuI8x7jvs2Fo',//支付密钥
    // title: 'ZIGGIE内购商城',
    userInfo: {},
    open_id: null,

  }
})
