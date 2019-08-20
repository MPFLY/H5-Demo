require(['jquery'],function($){

    initTable()

    function initTable() {
        $.ajax({
          type:'GET',
          url:'../data/vip.json',
          dataType:'json',
          success:function(data){
            let data_ = data.data

            var str = '';
            var list = '';

            for (let i = 0; i < data_.length; i++) {
                data_[i].list.forEach(ele_ => {
                    list += `<div class="row">
                                <div>
                                    <p>${ele_.name}</p>
                                    <p>${ele_.name_}</p>
                                </div>
                                <div>${ele_.pro}</div>
                                <div>${ele_.flagship}</div>
                            </div>`
                })
                str += `<div class="table">
                            <p class="title">${data_[i].title}</p>
                            <div class="content">
                                ${list}
                            </div>
                        </div>`
                $('.append').append(str)
                list = ''
                str = ''
            }
          }
        })
    }

})