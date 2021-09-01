// pages/manager_index/manager_index.js
var app = getApp()
var db = wx.cloud.database()
var manager = db.collection("test_db_manager")
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['-请选择-', '篮球协会', '跑步协会', '瑜伽协会', '乒乓球协会', '足球协会', '网球协会', '摄影DV联合会', '乐益会', '书法协会', '舞蹈协会', '羽毛球协会', '乐器协会'], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    password: "",
    disable: false,
    len: 8,
    defaultType: true,
    passwordType: true,
  },


  onLoad() {
    var page = this
    manager.where({
      association_uid: _.gte('')
    }).get({
      success(res) {
        // console.log(res.data)
        const result = res.data
        const len = result.length
        for (let i = 0, len = result.length; i < len; ++i) {
          result[i].value = i
        }
        page.setData({
          associations: result,
          len: len
        })
      }
    })
  },

  radioChange(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.associations
    // console.log(items)
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = false
    }
    items[e.detail.value].checked = true

    this.setData({
      associations: items,
      index: e.detail.value
    })
  },

  setPassword: function (e) {
    // console.log(e.detail)
    this.setData({
      password: e.detail
    })

  },

  eyeStatus: function () {
    if (this.data.defaultType) {
      this.setData({
        passwordType: false,
        defaultType: false,
      })
    } else {
      this.setData({
        passwordType: true,
        defaultType: true,
      })
    }
  },

  judge: function (password) {
    var flag = false
    if (password == "") {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
      })
      flag = true
    }
    return flag
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    // console.log(Index)
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

  handleLogin: function (e) {
    var page = this
    var uid = page.data.index
    var password = page.data.password
    //var name= page.data.selectData[index]
    var index = page.data.index

    if (page.judge(uid, password) == false) {
      manager.where({
        xiala_id: uid,
        password: password,
      }).get().then(res => {
        // console.log(res.data)
        if (res.data.length == 0) {

          wx.showModal({
            title: '提示',
            content: '登录失败',
          })
        } else {
          // console.log( uid, password)
          // console.log(res.data[0].association_name)
          app.globalData.managerLogin = true
          console.log(res.data[0].association_name)
          app.globalData.association_name = res.data[0].association_name
          app.globalData.association_uid = this.data.index
          console.log(app.globalData.association_uid)
          wx.switchTab({
            url: '../user/user',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
})