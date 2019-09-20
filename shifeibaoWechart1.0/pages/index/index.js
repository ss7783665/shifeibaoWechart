//index.js
//获取应用实例
const app = getApp()
var hasClick = false;//防止用户极快速度触发两次tap回调


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //1.0事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 2.0用户触发了下拉刷新操作
  onPullDownRefresh: function () {
    // 拉取新数据重新渲染界面
    wx.stopPullDownRefresh() // 可以停止当前页面的下拉刷新。
  },


  //3.0上拉加载--当界面的下方距离页面底部距离小于100像素时触发回调
  onReachBottom: function () {
    console.log('上拉加载')
    if (hasClick) {
      return
    }
    hasClick = true
    wx.showLoading({ title: '加载中' })

    wx.request({
      url: 'https://ssl.sparkay.sparkgis.com:9000/tfts/app/api/crop/getHomeCrop',
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {},
      //data: { id: 1, version: '1.0.0' },
      //成功
      success: function (res) {
        console.log(res)// 服务器回包信息
        if (res.statusCode === 200) {
          console.log(res.data)// 服务器回包内容
        }
      },
      //失败
      fail: function (res) {
        wx.showToast({ title: '系统错误' })
      },
      //完成
      complete: function (res) {
        wx.hideLoading()
        hasClick = false
      }
    })

  },



  // 显示Toast
  bindViewhover: function() {
    // wx.showToast({ 
    //   title: '已发送',
    //   // icon: 'success',
    //   duration: 1500
    // })
    // wx.hideToast() // 隐藏Toast
    //显示AlertView
    wx.showModal({
      title: '标题',
      content: '告知当前状态，信息和解决方法',
      confirmText: '确认',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确认')
          wx.navigateTo({
            url: '../index3/index3'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
