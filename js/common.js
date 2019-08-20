/*
 * @Author: mipengfei
 * @Date: 2019-08-15 15:10:43
 * @Last Modified by: mipengfei
 * @Last Modified time: 2019-08-16 14:34:17
 */
var isDebug = false
var debugUrl = 'https://saasapi.dclm100.com/api-shop-admin'
var productUrl = 'https://saasapi.financecfb.com/api-shop-admin'
var baseUrl = isDebug ? debugUrl : productUrl;


// 验证手机号
function checkPhone(phone) {
  var reg = new RegExp(/^1[34578]\d{9}$/);
  return reg.test(phone);
}


// 验证密码
function checkPassword(password) {
  var reg = new RegExp(/^[\w_-~!@#$%^&*`./]{6,20}$/);
  return reg.test(password);
}

require(['jquery', 'text!header', 'text!footer', 'text!partners', 'text!regist'], function ($, header, footer, partners, regist) {
  $("#header").html(header);
  $("#footer").html(footer);
  $("#partners").html(partners);
  $("#regist").html(regist);
  var pathname = location.pathname;
  if (pathname === '' || pathname === '/') {
    $('[data-pathname="/index.html"]').addClass('active');
  } else if (pathname === '/enterpriseLdea.html' || pathname === '/join.html') {
    $('[data-pathname="/enterpriseIntro.html"]').addClass('active');
  } else if (pathname === '/articleDetails.html') {
    $('[data-pathname="/dryGods.html"]').addClass('active');
  } else if (pathname === '/cookDetails.html') {
    $('[data-pathname="/industryNews.html"]').addClass('active');
  } else {
    $('[data-pathname="' + pathname + '"]').addClass('active');
  }




  //   $('.mobile').bind('input propertychange', function() {    //手机号校验
  //       if($(".regist-content .mobile").val() == ''){
  //           console.log($(".experice-con .mobile").val())
  //           $('.tip2').css('display','block');
  //           $('.tip2').html('请输入手机号');
  //       }else if(!checkPhone($(".experice-con .mobile").val())){
  //           $('.tip2').css('display','block');
  //           $('.tip2').html('请输入正确的手机号');
  //       }else{
  //           $('.tip2').css('display','none');
  //       }
  //   });

  $('.getCode').on('click', function (e) {
    e.preventDefault()
    let isModelShow = $('.regist-model-content').css('display') === 'block'
    let username = isModelShow ? $('.regist-model-content .username') : $('.regist-content .username')
    let phoneDom = isModelShow ? $('.regist-model-content .mobile') : $('.regist-content .mobile')
    let codeInput = isModelShow ? $('.regist-model-content .code') : $('.regist-content .code')
    let dom = isModelShow ? $('.regist-model-content .getCode') : $('.regist-content .getCode')
    let count = 60

    if (phoneDom.val() == "") {
      $('.TBox .content').html('请输入手机号')
      $('.TBox').css('display', 'block');
      username.removeClass('warning')
      phoneDom.addClass('warning').focus()
    } else if (!checkPhone(phoneDom.val())) {
      $('.TBox .content').html('请输入正确的手机号')
      $('.TBox').css('display', 'block');
      username.removeClass('warning')
      phoneDom.addClass('warning').focus()
    } else {
      getCode(phoneDom.val())
      phoneDom.removeClass('warning')
      codeInput.attr('disabled', false);
      codeInput.focus();
      var curCount = count;
      $(dom).attr("disabled", "true");
      var InterValObj = window.setInterval(function () {
        $(dom).val(curCount + "秒");
        curCount--;
        if (curCount == -1) {
          clearInterval(InterValObj);
          $(dom).removeAttr("disabled");
          $(dom).val("重新发送");
        }
      }, 1000);
    }
  })


  // 获取验证码接口
  function getCode(phone) {
    let params = {
      phone: phone
    }
    console.log('获取手机号' + phone + '的验证码')
    $.ajax({
      url: baseUrl + '/shop/sendNote',
      contentType: "application/json",
      type: "POST",
      dataType: 'json',
      data: JSON.stringify(params),
      success: function (data) {
        data = data.data;
      }
    })
  }


  //注册 弹出框 提交
  $(".submitRegist").click(function () {
    let isModelShow = $('.regist-model-content').css('display') === 'block'

    let username = isModelShow ? $('.regist-model-content .username') : $('.regist-content .username')
    var mobile = isModelShow ? $(".regist-model-content .mobile") : $(".regist-content .mobile");
    var password = isModelShow ? $(".regist-model-content .password") : $(".regist-content .password");
    let code = isModelShow ? $(".regist-model-content .code") : $(".regist-content .code");

    if (username.val() == "") {
      $('.TBox .content').html('请输入联系人')
      $('.TBox').css('display', 'block');
      username.addClass('warning').focus()
    } else if (!checkPhone(mobile.val())) {
      $('.TBox .content').html('请输入正确的手机号')
      $('.TBox').css('display', 'block');
      username.removeClass('warning')
      mobile.addClass('warning').focus()
    } else if ('' === code.val()) {
      $('.TBox .content').html('请输入验证码')
      $('.TBox').css('display', 'block');
      code.addClass('warning').focus()
      mobile.removeClass('warning')
    } else if (!checkPassword(password.val())) {
      $('.TBox .content').html('请输入包含特殊字符、6-20位的密码')
      $('.TBox').css('display', 'block');
      password.addClass('warning').focus()
      code.removeClass('warning')
    } else {
      username.removeClass('warning')
      mobile.removeClass('warning')
      code.removeClass('warning')
      password.removeClass('warning')

      let params = {
        charges: username.val(),
        phone: mobile.val(),
        password: password.val(),
        authCode: code.val(),
      }
      // return
      registApi(params)
    }
  })

  // 注册接口
  function registApi(params) {
    $.ajax({
      url: baseUrl + '/shop/insertByOfficial',
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify(params),
      dataType: 'json',
      success: function (res) {
        resetForm()

        if (res.status === '200') { // 注册成功

          $(".regist-success-content .top div").removeClass('img-defeat').addClass('img-success')
          $(".regist-success-content .top p").html('恭喜！注册成功')
          $(".regist-success-content .inshop").html(res.objs.inShop)
          $(".regist-success-content .domain").html(res.objs.domainName)
          $(".regist-success-content").show();

        } else if (res.status === '201') { // 重复注册
          $(".regist-success-content .top div").removeClass('img-success').addClass('img-defeat')
          $(".regist-success-content .top p").html('该手机号已注册，请勿重复提交')
          $(".regist-success-content .inshop").html(res.objs.inShop)
          $(".regist-success-content .domain").html(res.objs.domainName)
          $(".regist-success-content").show();
        } else { // 注册失败
          $('.TBox .content').html(res.msg)
          $('.TBox').css('display', 'block')
        }
      }
    })
  }


  //遮罩
  $(".maskclose").click(function () {
    $(".mask").css("display", "none");
    $(".smakbox .maskimg").css("background", "url('../img/consulta/katong.png') no-repeat");
  })
  //弹框
  $(".TBox-close").click(function () {
    $(".TBox").css("display", "none");
  })
  $(".TBox .btn-Y").click(function () {
    $(".TBox").css("display", "none");
  })

  // 开启注册弹框
  $('.regist').click(function () {
    $('.regist-model-content').show()
  })
  // 关闭注册弹框
  $(".close-model").click(function () {
    resetForm()
  })

  function resetForm() {
    $(".regist-model-content").hide();
    $(".username").val("").removeClass('warning');
    $(".mobile").val("").removeClass('warning');
    $(".code").val("").removeClass('warning');
    $(".password").val("").removeClass('warning');
  }

  // https://admin.financecfb.com/admin/home
  // http://isw-admin.kk.dclm100.com/
  $('.goAdmin').click(function () {
    window.open('https://admin.financecfb.com/admin/home')
    $('.regist-success-content').hide();
  })

  // 页面滚动监听
  $(window).scroll(function () {
    var sc = $(window).scrollTop();
    // 头部
    if (sc > 900) {
      $('.goUp-btn').fadeIn()
    } else {
      $('.goUp-btn').fadeOut()
    }
  })

  // 返回顶部
  $('.goUp-btn').click(function () {
    $('html').animate({
      scrollTop: 0
    }, 500);
  })

})

function longFormatDate(time) {
  var date = new Date(time);
  var year = date.getFullYear();
  var month = addZero(date.getMonth() + 1);
  var day = addZero(date.getDate());
  var newData = year + '-' + month + '-' + day + ' ';
  return newData;
}

function addZero(num) {
  if (num >= 10) {
    return '' + num;
  } else {
    return '0' + num;
  }
}