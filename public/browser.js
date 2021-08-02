document.addEventListener('click', function(e) { 
    // delete feature
    if(e.target.classList.contains('delete-me')) {
        e.target.parentElement.remove();
        let _id = e.target.getAttribute('data-id');
        if (confirm("確定要刪除這筆資料嗎 ?")) {
            axios.post('/delete-item', {
                id: _id
            })
        }
    }

    // update feature ver.2 點擊文本(text)進入文本框(input)就可以修改內容
    if(e.target.classList.contains('item-text')) {
        // 如果任務進行中，就可以被修改
        if(!e.target.previousSibling.previousSibling.checked) {
            let originText = e.target.innerHTML;
            let _id = e.target.getAttribute('data-id');
            e.target.innerHTML = '<input type="text" id="updateInput" class="update-input-text"></input>';
            var updateInput = document.getElementById('updateInput');
            // 獲得焦點
            updateInput.focus();   
            // 失去焦點後，更新文本，並更新DB資料
            updateInput.onblur = function () {
                let updateVaule = updateInput.value;
                if(updateVaule != "") {
                    axios.post('/update-item', {
                        text: updateVaule,
                        id: _id
                    }).then(function() {
                        e.target.innerHTML = updateVaule;
                    }).catch(err => {
                        console.log(err);
                    })
                }else {
                    e.target.innerHTML = originText;
                }
            };
        }
    }

    // 點擊checkbox 更改任務completed屬性真假值
    if(e.target.classList.contains('completed-checkbox')) {
        let _id = e.target.getAttribute('data-id');
        let status = e.target.checked;
        axios.post('/change-item-status', {
            id: _id,
            status: status
        })
        console.log(_id + ' 已更改為 '+ status);
    }
})