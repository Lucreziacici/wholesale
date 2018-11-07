// 删减40行 做成公共类 by xixi
// 删减20行 toast 抽象by xixi 18/4/3
var app = getApp()
var url = app.globalData.url
var appid = app.globalData.appid
var resourceurl = app.globalData.resourceurl
var network = require("../../libs/network.js")
Page({
  data: {
    tip: '',//提示框内容
    radio1: true,//单选框
    openid: '',//openid
    array: ['老板', '采购', '店长'],
    resourceurl: resourceurl,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (options) {
    // network.IsuserInfo();
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
    this.setData({
      openid: options.openid
    })
    if (options.cust_shop_type){
      this.setData({
        cust_shop_type: options.cust_shop_type
      })
    }
  },
  radioChange: function (e) {
    this.setData({
      radio1: !this.data.radio1
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  updatenum:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      var timestamp = Date.parse(new Date());
      var expiration = timestamp + 1000 * 60 * 60 * 24 * 5;//记住时间五天后过期
      wx.setStorage({
        key: 'userinfo_time',
        data: expiration,
      })
      var data = {};
      data.nick_name = e.detail.userInfo.nickName;
      data.avatarUrl = e.detail.userInfo.avatarUrl
      data.gender = e.detail.userInfo.gender
      data.province = e.detail.userInfo.province
      data.city = e.detail.userInfo.city
      network.POST("Customer/SaveCustomerWxConfig", data, (res) => {
        console.log(res)
        if (res.data.res_status_code == '0') {
          app.globalData.userInfo = res.data.res_content
          wx.setStorage({
            key: 'userinfo',
            data: res.data.res_content,
            success:  (res)=> {
              this.formBindsubmit();
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else {
          this.selectComponent("#Toast").showToast(res.data.res_message);
        }
      }, (res) => {
        console.log(res)
      })

    } else {
      this.selectComponent("#Toast").showToast('请允许授权');
    }

  },
  formBindsubmit: function (e) {
    var phone=this.data.phone;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  
    if (phone == '') {
      this.selectComponent("#Toast").showToast("请输入手机号码");
      return false;
    }
    if (!myreg.test(phone)) {
      this.selectComponent("#Toast").showToast("手机号码有误");
      return false;
    }
    if (!(this.data.radio1)) {
      this.selectComponent("#Toast").showToast("请阅读协议");
      return false;
    }
    wx.showLoading({
      title: '加载中....',
      mask: true
    });

    var zhuce={};
    zhuce.phone = phone;
    network.POST('Customer/RegisterCustomer',zhuce,
       (res)=> {
         console.log(res)
         wx.hideLoading();
         if (res.data.res_status_code=='0'){
           app.globalData.userInfo = res.data.res_content
           wx.switchTab({
             url: '../main/main'
           })
         }else{
           this.selectComponent("#Toast").showToast(res.data.res_message);
         }

      }, (res) => {
        console.log(res);
      })
  },
})