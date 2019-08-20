/*
*   首页的js
* */

require(['jquery','swiper', 'PicCarousel', 'text!header', 'text!footer', 'zturn'], function ($, Swiper, PicCarousel, header, footer, zturn){
    $(function () {
      setTimeout(function () {
        window.scrollTo(0, 0)
      }, 0)
    })
    
    // 
    $('.look-more').click(function() {
      window.location.href = 'server.html'
    })

    //首页顶部轮播图
    var mySwiper = new Swiper('#swiper',{
      autoplay : 5000,
      speed:300,
      paginationClickable :true,
      autoplayDisableOnInteraction: false,
      loop:true,
      grabCursor: true,
    })
    $('.arrow-left').on('click', function(e){
      e.preventDefault()
      mySwiper.swipePrev()
    })
    $('.arrow-right').on('click', function(e){
      e.preventDefault()
      mySwiper.swipeNext()
    })





    
    var newModelSwiper = new Swiper('#new-model-swiper', {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        // grabCursor : true,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true,
        // },
    });
    $('.new-arrow-left').on('click', function(e){
      e.preventDefault()
      newModelSwiper.swipePrev()
    })
    $('.new-arrow-right').on('click', function(e){
      e.preventDefault()
      newModelSwiper.swipeNext()
    })

    
    

    // --------------animateAdd-------------- //
    $(window).scroll(function(){
        var sc = $(window).scrollTop();
        if(sc > 600){
          $('.header').css('background','#0a0e1a')
        }else{
          $('.header').css('background','none')
        }
    });

});
