

$(function () {
  var currentPage = 1;
  var pageSize = 5;

  var picArr = [];
  
  render();
  // 1.请求数据，渲染页面
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function ( info ) {
        // console.log(info);
        $('.lt_content tbody').html(template("productTpl", info));
        
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil(info.total/info.size),
          currentPage: info.page,
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          },
          size: "normal",
          // itemTexts 可以控制按钮文本
          // 一旦配置了 itemTexts, 每个按钮都会去调用这个 itemTexts
          // 会将这个方法的返回值, 作为按钮的文本
          // type 用于标记按钮的功能类型, page 普通页码, first prev next last
          // page 指的是按钮点击后跳转到那一页
          // current 表示当前页
          itemTexts: function (type, page, current) {
            switch ( type ) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          // 设置了 tooltipTitles 之后, 每个按钮都会调用这个方法
          // 将返回值, 作为提示信息
          tooltipTitles: function (type, page, current) {
            switch ( type ) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往第" + page + "页";
            }
          },
          // 使用 bootstrap 提供的提示框组件
          useBootstrapTooltip: true
        });
      }
    })
  }
  
  
  // 2. 点击添加按钮, 显示添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");

    // 请求模态框中一级分类的下拉单数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function ( info ) {
        console.log(info);
        $('.dropdown-menu').html(template("dropdownTpl", info));
      }
    })
  });

  
  // 3. 通过事件委托, 给下拉框所有的 a 绑定点击事件(选择一级分类，把分类文字放到选框中去，把分类id放到隐藏域中，为了适应接口，手动设置选择分类成功以后的成功状态，为了更新后面的图标为正确的状态)
  $('.dropdown-menu').on("click", "a", function () {
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
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
      // 选择二级分类
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      // 商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      // 请输入商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存要求, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品库存要求, 两位数字-两位数字, 例如: 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入现价"
          }
        }
      },
  
      // 图片是否上传满三张的校验
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });


  // 6. 注册表单校验成功事件, 阻止默认提交, 通过 ajax 进行提交
  $('#form').on("success.form.bv", function (e) {
    e.preventDefault();
    var params = $('#form').serialize();
    params += "&picName1=" + picArr[0].picName + "&picAddr1="+ picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2="+ picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3="+ picArr[2].picAddr;
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: params,
      success: function (info) {
        if(info.success) {
          $('#addModal').modal("hide");
          $('#form').data("bootstrapValidator").resetForm(true);
  
          currentPage = 1;
          render();
          $('#dropdownText').text("请选择二级分类");
          // 删除所有图片, 找到所有的图片, 让他自杀
          $('#imgBox img').remove();
          // 清空数组
          picArr = [];
          
          
        }
      }
    })
  })
  
})