

require(['jquery'],function($){
    queryArticleType()

    let articleTypeId = '';
    let page = 1;
    let size = 5; 
    
    // 监听回车键
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            searchFun()();
        }
    });

    $('.searchBtn').click(function() {
        searchFun()
    })


    function searchFun() {
        let text = $('.search-text').val()
        if(text === ''){return}
        let params = {
            articleTitle: text,
            page: page,
            size: size,
        }
        $(".search-left .item").removeClass('active');
        queryArticle(params, true)
    }

    // 查询文章分类api
    function queryArticleType() {
        $.ajax({
          url:baseUrl+'/article/queryAll',
          contentType: "application/json",
          type: "post",
          dataType:'json',
          success:function(res){
            initType(res.objs)
          }
        })
    }

    // 初始化文章分类html
    function initType(data) {
    let str = ''
    data.forEach(ele => {
        str += `<div class="item" data-id="${ele.id}">
                    <span class="title" >${ele.articleTypeName}</span>
                    <span class="arror">&#155</span>
                </div>`
    })

    articleTypeId = data[0].id
    let params = {
        articleTypeId: data[0].id,
        page: page,
        size: size,
    }

    queryArticle(params, true)

    $('.search-left').html(str)
    $('.search-left .item:eq(0)').addClass('active')
    $(".search-left .item").on('click',function(e){
        let id = $(this).attr('data-id')
        // $('html').animate({ scrollTop: 0 }, 100);

        $('.search-right').html(`<div class="right-loading">
                                    <img src="img/dryGods/loading.gif" alt="">
                                </div>`)
        $(".search-left .item").removeClass('active');
        $(this).addClass('active');
        articleTypeId = id
        let params = {
            articleTypeId: id,
            page: page,
            size: size
        }
        queryArticle(params, true)
    })
    }


//   根据文章类型id查找文章列表
    function queryArticle(params, isTurn) {
        $.ajax({
            url:baseUrl+'/article/getList',
            contentType: "application/json",
            type: "post",
            dataType:'json',
            data: JSON.stringify(params),
            success:function(res){
                initlist(res.objs.list)
                if(isTurn){
                    initPage(res.objs.pages)
                }
            }
        })
    }

    // 初始化文章列表
    function initlist(data) {
        let str = ''
        let noList = `<div class="no-list">
                        暂无文章
                    </div>`
        if(data.length === 0){
            $('.search-right').html(noList)
            return
        }
        data.forEach((ele, index) => {
            str += `<div class="item" data-id="${ele.id}">
                        <img src="${ele.articleImageUrl}" alt="">
                        <div class="context">
                            <div class="title">
                                <div class="num">
                                    <span>${index > 9 ? (index+1) : '0'+(index+1)}</span>
                                </div>
                                <div class="text">
                                    <div class="line"></div>
                                    <p>${ele.articleTitle}</p>
                                </div>
                            </div>

                            <div class="info">
                                ${ele.articleSketch}
                            </div>
                        </div>
                    </div>`
        })
        $('.search-right').html(str)

        $('.search-right .item').click(function() {
            let id = $(this).attr('data-id')
            window.location.href = `articleDetails.html?id=${id}`
        })
    }
    // 初始化分页
    function initPage(pages) {
        $("#page").Page({
            totalPages: pages,     //分页总数
            liNums: 7,         //分页的数字按钮数(建议取奇数)
            activeClass: 'activP',      //active 类样式定义
            hasFirstPage: false,
            hasLastPage: false,
            callBack: function (page) {
                turnPage(page);
            }
        });
    }
    // 翻页
    function turnPage(page) {
    let params = {
        articleTypeId: articleTypeId,
        page: page,
        size: size
    }
    queryArticle(params, false)
    }

})