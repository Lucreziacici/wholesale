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
    resourceurl: resourceurl
  },
  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (options) {
    // network.IsuserInfo();
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
  formBindsubmit: function (e) {
    var real_name = e.detail.value.name;//姓名
    var department = e.detail.value.bumen;//部门
    var manager = e.detail.value.name1;//主管姓名
    var phone = e.detail.value.phone;//手机号
    var company=e.detail.value.company;//公司
    var idcard=e.detail.value.idcard;//身份证
    var cust_shop_name = e.detail.value.shopname;//店铺名称
    var cust_shopkeeper_id = e.detail.value.managerid;//掌柜id
    var cust_public_name = e.detail.value.officialname;//公众号名称
    var cust_position = this.data.array[this.data.index];//职务
    var cust_remark = e.detail.value.remark;//备注
    var cust_shop_address = e.detail.value.shopaddress;//地址
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    // if (real_name == '') {
    //   this.selectComponent("#Toast").showToast("请填写姓名");
    //   return false;
    // }
    // if (idcard == '' && !this.data.cust_shop_type) {
    //   this.selectComponent("#Toast").showToast("身份号不能为空");
    //   return false;
    // }
    // if (!pattern.test(idcard) && !this.data.cust_shop_type) {
    //   this.selectComponent("#Toast").showToast("身份号格式有误");
    //   return false;
    // }
    if (phone == '') {
      this.selectComponent("#Toast").showToast("请输入手机号码");
      return false;
    }
    if (!myreg.test(phone)) {
      this.selectComponent("#Toast").showToast("手机号码有误");
      return false;
    }
    // if (!department && !this.data.cust_shop_type) {
    //   this.selectComponent("#Toast").showToast("请填写所在部门");
    //   return false;
    // }
    // if (!manager && !this.data.cust_shop_type) {
    //   this.selectComponent("#Toast").showToast("请填写主管姓名");
    //   return false;
    // }
    // if (!company && !this.data.cust_shop_type){
    //   this.selectComponent("#Toast").showToast("请填写公司名称");
    //   return false;
    // }
    // if (!cust_shop_name && this.data.cust_shop_type) {
    //   this.selectComponent("#Toast").showToast("请填写店铺名称");
    //   return false;
    // }
    // if (!cust_shopkeeper_id && this.data.cust_shop_type=='Taobao') {
    //   this.selectComponent("#Toast").showToast("请填写掌柜ID");
    //   return false;
    // }
    // if (!cust_public_name && this.data.cust_shop_type == 'WX') {
    //   this.selectComponent("#Toast").showToast("请填写公众号名称");
    //   return false;
    // }
    // if (!cust_position && this.data.cust_shop_type) {
    //   this.selectComponent("#Toast").showToast("请填写职位");
    //   return false;
    // }
    // if (!cust_shop_address && this.data.cust_shop_type == 'Offline') {
    //   this.selectComponent("#Toast").showToast("请填写店铺地址");
    //   return false;
    // }
    if (!(this.data.radio1)) {
      this.selectComponent("#Toast").showToast("请阅读协议");
      return false;
    }
    wx.showLoading({
      title: '加载中....',
      mask: true
    });

    var zhuce={};
    if (real_name) zhuce.real_name = real_name;
    else zhuce.real_name = ''
    zhuce.phone = phone;
    if (manager) zhuce.manager = manager;
    else zhuce.manager=''
    if (department) zhuce.department = department;
    else zhuce.department = ''
    if (company) zhuce.company = company;
    else zhuce.company = ''
    if (idcard) zhuce.id_card = idcard;
    else zhuce.id_card = ''
    if (cust_shop_name) zhuce.cust_shop_name = cust_shop_name;
    else zhuce.cust_shop_name = ''
    if (cust_shopkeeper_id) zhuce.cust_shopkeeper_id = cust_shopkeeper_id;
    else zhuce.cust_shopkeeper_id = ''
    if (cust_public_name) zhuce.cust_public_name = cust_public_name;
    else zhuce.cust_public_name = ''
    if (cust_position) zhuce.cust_position = cust_position; 
    else zhuce.cust_position = '';
    if (cust_shop_address) zhuce.cust_shop_address = cust_shop_address;
    else zhuce.cust_shop_address = ''
    if (cust_remark) zhuce.cust_remark = cust_remark;
    else zhuce.cust_remark = ''
    if (this.data.cust_shop_type) zhuce.cust_shop_type = this.data.cust_shop_type;
    else zhuce.cust_shop_type=''
    console.log(zhuce)
    network.POST('Customer/RegisterCustomer',zhuce,
       (res)=> {
         console.log(res)
         wx.hideLoading();
         if (res.data.res_status_code=='0'){
           app.globalData.userInfo = res.data.res_content
          //  wx.switchTab({
          //    url: '../main/main'
          //  })
           wx.navigateTo({
             url: '../accredit/accredit'
           })
          //  wx.navigateBack();
         }else{
           this.selectComponent("#Toast").showToast(res.data.res_message);
         }

      }, (res) => {
        console.log(res);
      })
  },
})