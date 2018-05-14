
// 5. 登录拦截分析, 现在注意: 我们是前后端分离的, 前端并不知道当前用户有没有登录
//    不知道, 问呗, 需要一进入页面, 就调用接口, 来判断当前用户有没有登录
//    (1) 如果没有登陆, 不需要下面的操作了, 直接拦截到登录页面即可
//    (2) 如果当前用户登录, 啥都不用干, 让用户继续访问即可
//    (3) 我们需要将不需要用户登录的页面 (登录页, 进行排除)

if ( location.href.indexOf("login.html") === -1 ) {
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function (info) {
      if ( info.error === 400 ) {
        location.href = "login.html";
      }
    }
  })
}





// 禁用进度环
NProgress.configure({ showSpinner: false });

// 需求：每次ajax提交，产生进度条，ajax完成，结束进度条
$(document).ajaxStart(function () {
  // 开启进度条
  NProgress.start();
})

$(document).ajaxStop(function () {
  //工作中定时器要去掉，这里只是为了模拟网络请求的时间过程,即网络环境
  setTimeout(function () {
    //结束进度条
    NProgress.done();
  }, 500);
});

$(function () {
  // 1. 公共的二级菜单切换功能
  $('.category').click(function () {
    $('.lt_aside .child').stop().slideToggle();
  });
  
  // 2. 点击菜单按钮, 进行切换菜单
  $('.icon_menu').click(function () {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  });
  
  // 3. 点击 icon_logout 应该显示模态框
  $('.icon_logout').click(function () {
    // 通过 id 找到模态框, 通过 modal ("show") 显示模态框
    $('#logoutModal').modal("show");
  });
  
  $('#logoutBtn').click(function () {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        if (info.success) {
          location.href = "login.html";
        }
      }
    })
  })
  
  
})



