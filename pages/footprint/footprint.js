// pages/footprint/footprint.js
var app = getApp()
var url = app.globalData.url
var appid = app.globalData.appid
var title = app.globalData.title
var network = require("../../libs/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historylist:[],
    modalHidden:true,
    page_index: "1",//当前页
    page_size: "8",//每页记录数
    nomore:false,
    noresult:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo((userInfo, open_id) => {
      //更新数据
      console.log(userInfo)
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
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.setData({
          team: res.data
        })
        //action_flag 0:未审核，1：已审核
        if (res.data.action_flag == 1) {
          this.setData({
            isApprove: true
          })
        }
      },
    })
    this.ViewHistoryList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page_index = parseInt(this.data.page_index) + 1
    this.setData({
      page_index: page_index
    })
    this.ViewHistoryList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 获取足迹消息
  ViewHistoryList:function(){
    var getdata = {};
    getdata.page_index = this.data.page_index;
    getdata.page_size = this.data.page_size;
    network.GETJSON("ShopGoods/ViewHistoryList", getdata, (res) => {
      console.log(res)
     
      if (res.data.res_status_code == '0') {
        var historylist = this.data.historylist;
        for (var i = 0; i < res.data.res_content.data_list.length; i++) {
          historylist.push(res.data.res_content.data_list[i])
        }
        this.setData({
          historylist: historylist
        });
        if (res.data.res_content.page_index >= res.data.res_content.total_pages) {
          this.setData({
            nomore: true,
            noresult: false,
          })
        }
        if (res.data.res_content.data_list.length == '0' && res.data.res_content.total_pages == '0') {
          this.setData({
            noresult: true,
            nomore: false
          })
        }
      }
      
    }, (res) => {
      console.log(res)
    })
  },
  //删除足迹
  deleteprint:function(){
     this.setData({
       modalHidden:false
     })
  },
  confirmDelete:function(){
    network.POST("ShopGoods/DeleteMyHistoryView",{}, (res) => {
      console.log(res)
      if (res.data.res_status_code == '0') {
        console.log("123123")
        // wx.showToast({
        //   title: '删除成功',
        // });
        this.setData({
          modalHidden:true,
          page_index:"1",
          historylist:[],
        })
        this.ViewHistoryList();
      }else{
        this.selectComponent("#Toast").showToast(res.data.res_message);
      }
    }, (res) => {
      console.log(res)
    })
  },
  cancelDelete:function(){
    this.setData({
      modalHidden: true
    })
    
  }

})