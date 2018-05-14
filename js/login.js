/*
* 1.基本表单校验
* 校验是否非空，校验用户名和密码数位
* */
$(function () {
  $('#form').bootstrapValidator({
  
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名必须是2-6位"
          },
          callback: {
            message: "用户名错误"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须在6-12位"
          },
          //专门用来配置回调校验提示信息
          callback:{
            message: "密码错误"
          }
        }
      }
      
    }
  });


/*
*2.基本登陆功能
 *  校验成功(仅对用户名和密码的位数，是否非空，进行简单的验证)，调用校验插件的校验成功事件，在这个事件中，再进行ajax验证密码和用户名是否和后台session中的一致
* */
  $('#form').on('success.form.bv', function (e) {
  e.preventDefault();//表单校验插件，成功以后会默认提交，由于还没有验证用户名和密码是否正确，所以要阻止这一行为。ajax验证成功后由ajax进行提交
  $.ajax({
    type: "post",
    url: "/employee/employeeLogin",
    dataType: "json",
    data: $('#form').serialize(),
    success: function ( info ) {
      if(info.success){
        // alert("登陆成功");
        location.href = "index.html";
      }
      if(info.error === 1001) {
        $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
      }
      if(info.error === 1000) {
        // alert("用户名不存在");
        $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
      }
    }
  })
})

/*
* 3.实现重置功能
*给重置按钮添加点击事件，触发以后，实例化表单验证插件，调用该实例的重置方法，传入的参数是布尔值
* */
  $('[type="reset"]').click(function () {
    $('#form').data("bootstrapValidator").resetForm(true);
  })





})