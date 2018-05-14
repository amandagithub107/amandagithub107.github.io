

$(function () {
  var currentPage = 1;
  var pageSize = 5;
  
  
  render();
  // 1.请求数据，渲染页面
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function ( info ) {
        // console.log(info);
        $('.lt_content tbody').html(template("secondTpl", info));
        
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil(info.total/info.size),
          currentPage: info.page,
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  
  
  // 2. 点击添加按钮, 显示添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
    
    // 请求模态框中一级分类的下拉单数据
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function ( info ) {
        // console.log(info);
        $('.dropdown-menu').html(template("dropdownTpl", info));
      }
    })
  });
  
  
  // 3. 通过事件委托, 给下拉框所有的 a 绑定点击事件(选择一级分类，把分类文字放到选框中去，把分类id放到隐藏域中，为了适应接口，手动设置选择分类成功以后的成功状态，为了更新后面的图标为正确的状态)
  $('.dropdown-menu').on("click", "a", function () {
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });
  
  // 4. 配置文件上传
  $('#fileupload').fileupload({
    dataType: "json",
    done: function (e, data) {
      console.log(data);
      var picUrl = data.result.picAddr;
      $('#imgBox img').attr("src", picUrl);
      $('[name="brandLogo"]').val(picUrl);
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });
  
  // 5. 表单校验
  $('#form').bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
    
  });
  
  
  // 6. 注册表单校验成功事件, 阻止默认提交, 通过 ajax 进行提交
  $('#form').on("success.form.bv", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      success: function (info) {
        if(info.success) {
          $('#addModal').modal("hide");
          currentPage = 1;
          render();
          $('#form').data("bootstrapValidator").resetForm(true);
          $('#dropdownText').text("请选择一级分类");
          $('#imgBox img').attr("src", "./images/none.png");
        }
      }
    })
  })
  
  
  
  
  
})