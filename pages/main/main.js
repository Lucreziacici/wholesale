//index.js
//获取应用实例
const app = getApp()
var url = app.globalData.url
var appid = app.globalData.appid
var title = app.globalData.title
var network = require("../../libs/network.js")
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [{
        src: '../../images/swiper.jpg',
        link: "/pages/product/product"
      },
      {
        src: '../../images/swiper.jpg',
        link: "/pages/product/product"
      },
      {
        src: '../../images/swiper.jpg',
        link: "/pages/product/product"
      }
    ],
    navigation: [{
        src: "../../images/question-icon.png",
        title: "常见问题",
        link: "/pages/question/question"
      },
      {
        src: "../../images/new-icon.png",
        title: "新品推荐"
      },
      {
        src: "../../images/skin-care-icon.png",
        title: "护肤推荐"
      },
      {
        src: "../../images/beauty-icon.png",
        title: "美妆推荐"
      }
    ],
    special: [],
    page: {},
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    toView: 'red',
    scrollTop: 100,
    topNum: ""
  },
  onLoad: function() {
    network.IsuserInfo();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.getUserInfo((userInfo, open_id) => {
      //更新数据
      this.setData({
        userid: open_id,
        team: userInfo
      });
      if (!this.data.userid) {
        this.selectComponent("#Toast").showToast("信息读取失败，请刷新后重试");
      }
      //action_flag 0:未审核，1：已审核
      if (userInfo.action_flag == 1) {
        this.setData({
          isApprove: true
        })
      }
    })
    network.GET("HomePage/RequestHomePage", (res) => {
      for (var i = 0; i < res.data.res_content.recommend.length; i++) {
        res.data.res_content.recommend[i].category_goods_list = res.data.res_content.recommend[i].category_goods_list.slice(0, 6)
      }
      this.setData({
        imgUrls: res.data.res_content.banner,
        special: res.data.res_content.recommend,
        page: res.data.res_content.page
      })
    }, (res) => {
      console.log(res)
    })
  },
  // 前往搜索页，带个参数
  gosearch: function(e) {
    wx.navigateTo({
      url: "/pages/search/search",
    })
  },
  // getUserInfo: function (e) {
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  onShareAppMessage: function(res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.product.title,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  returnTop() {
    this.setData({
      topNum: 0
    });
  },


})