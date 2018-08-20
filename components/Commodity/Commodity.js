// components/Toast/Toast.js

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    price: {
      type: String,
      value: ''
    },
    img: {
      type: String,
      value: ''
    },
    commodityid: {
      type: String,
      value: ''
    },
    isApprove: {
      type: String,
      value: ''
    },
    commodity: {
      type: Object,
      value: {}
    },
    show_type: {
      type: String,
      value: 'A'
    }


  },

  /**
   * 组件的初始数据
   */
  data: {
    commodity: {}
  },
  ready: function() {},
  /**
   * 组件的方法列表
   */
  methods: {}
})