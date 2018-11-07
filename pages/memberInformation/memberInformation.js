// 删减150行 by xixi
var app = getApp()
var url = app.globalData.url
var appid = app.globalData.appid
var network = require("../../libs/network.js")
Page({
  data: {
    tip: '',//提示框文字
    openid: '',//用户openid
    province: '',//省 应该没用到
    city: '',//市 应该没用到
    qu: '',//区 应该没用到
    phone: '',//手机号
    team: {},//用户身份
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: ['老板', '采购', '店长'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo((userInfo, open_id) => {
      //更新数据
      this.setData({
        userid: open_id,
      });
      if (!this.data.userid) {
        this.selectComponent("#Toast").showToast("信息读取失败，请刷新后重试");
      }
      this.CustomerInfo();
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //获取用户信息
  CustomerInfo:function(){
    network.GET('Customer/CustomerInfo',
      (res) => {
        console.log(res)
        if (res.data.res_status_code == '0') {
          this.setData({
            team: res.data.res_content,
            cust_shop_type: res.data.res_content.cust_shop_type,
            phone:res.data.res_content.phone
          });
        } else {
          this.selectComponent("#Toast").showToast(res.data.res_message);
        }
      }, (res) => {
        console.log(res);
      }, this.data.userid)
  },
  updatenum: function (e) {
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
            success: (res) => {
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
      wx.showToast({
        icon: 'none',
        title: '请允许授权',
      })
    }

  },
  //提交表单
  formBindsubmit: function (e) {
    var phone = this.data.phone;//手机号
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (phone == '') {
      this.selectComponent("#Toast").showToast("请输入手机号码");
      return false;
    }
    wx.showLoading({
      title: '加载中....',
      mask: true,
    })
    var zhuce = {};
    zhuce.phone = phone;
    
    network.POST('Customer/ReviseCustomer', zhuce,
      (res) => {
        console.log(res)
        if (res.data.res_status_code == '0') {
          app.globalData.userInfo = res.data.res_content;
          wx.setStorage({
            key: 'userinfo',
            data: res.data.res_content,
          })
          
          wx.navigateBack({})
        } else {
          this.selectComponent("#Toast").showToast(res.data.res_message)
        }
        wx.hideLoading();
      }, (res) => {
        console.log(res);
      })
  },
})