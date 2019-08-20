


require(['jquery'],function($){
    
    $('html').animate({ scrollTop: 570 }, 200);
    queryDetails()
    
    function queryDetails() {
        let id = getParameter('id')
        let params = {
            id: id
        }
        $.ajax({
            url:baseUrl+'/article/queryArticle',
            contentType: "application/json",
            type: "post",
            dataType:'json',
            data: JSON.stringify(params),
            success:function(res){
                if(res.success){
                    initDetails(res.objs)
                }else{
                    noDetails()
                }
            }
        })
    }

    // 初始化文章
    function initDetails(data) {
        let str = `
                <p class="title">${data.articleTitle}</p>
                <p class="tip">发布时间：${longFormatDate(data.createDate)}</p>
                <div class="context">
                    ${data.articleContent}
                </div>
                <p class="before">上一篇：<span class="goDetails" data-id="${data.beforeArticleTitleId ? data.beforeArticleTitleId : 'none'}">${data.beforeArticleTitle ? data.beforeArticleTitle : '暂无文章'}</span></p>
                <p class="after">下一篇：<span class="goDetails" data-id="${data.afterArticleTitleId ? data.afterArticleTitleId : 'none'}">${data.afterArticleTitle ? data.afterArticleTitle : '暂无文章'}</span></p>
                `
        $('.article-content .content').html(str)

        $('.goDetails').click(function() {
            let id = $(this).attr('data-id')
            if(id === 'none'){return}
            window.location.href = `articleDetails.html?id=${id}`
        })
    }

    // 查询文章失败, 显示 "暂无文章详情..."
    function noDetails() {
        let str = `<div class="no-article">
                        暂无文章详情...
                    </div>`
        $('.article-content .content').html(str)
    }


    $('.goback').click(function() {
        window.location.href = `dryGods.html`
    })

    

    // 获取地址栏信息
    function getParameter(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})