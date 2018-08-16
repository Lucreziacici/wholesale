// pages/identity/identity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identitylist:[
      {
        image:"../../images/tao_choose.png",
        name:"我是淘宝店",
        shoptype:"Taobao",
      },{
        image: "../../images/wx_choose.png",
        name: "我是微商城",
        shoptype: "WX",
      }, {
        image: "../../images/APP_choose.png",
        name: "我是APP商城",
        shoptype: "App",
      }, {
        image: "../../images/shop_choose.png",
        name: "我是线下实体店",
        shoptype: "Offline",
      }, {
        image: "../../images/person_choose.png",
        name: "我是个人用户",
        shoptype: "Individual",
      }
    ]
  },
  /**
  * 生命周期函数--监听页面加
  */
  onLoad: function (options) {
    // network.IsuserInfo();
    this.setData({
      openid: options.openid,
    })
  },
})