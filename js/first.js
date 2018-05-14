

$(function () {
  // 表示当前页
  var currentPage = 1;
  // 每页多少条
  var pageSize = 5;
  
  // 1. 发送请求, 获取数据, 通过模板引擎渲染页面
  //    一进入页面就进行调用渲染
  render();
  
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function ( info ) {
        console.log(info);
        // 渲染所有页面
        $('.lt_content tbody').html( template("firstTpl", info) );
  
        // 进行分页插件配置
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil( info.total/info.size),
          currentPage: info.page,
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }


// 2. 点击添加按钮, 显示模态框
$('#addBtn').click(function () {
  $('#addModal').modal("show");
})

// 3.对模态框的内容进行表达校验
$('#form').bootstrapValidator({
  // 指定校验时的图标显示
  feedbackIcons: {
    // 校验成功的
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  
  // 配置字段  categoryName
  fields: {
    categoryName: {
      validators: {
        notEmpty: {
          message: "请输入一级分类"
        }
      }
    }
  }
});

// 4. 阻止默认校验成功时的提交, 通过 ajax 进行提交
$('#form').on("success.form.bv", function (e) {
  e.preventDefault();
  $.ajax({
    type: "post",
    url: "/category/addTopCategory",
    data: $('#form').serialize(),
    success: function (info) {
      console.log(info);
      if (info.success) {
        $('#addModal').modal('hide');
        currentPage = 1;
        render();
        $('#form').data("bootstrapValidator").resetForm(true);
      }
    }
  })
})

})