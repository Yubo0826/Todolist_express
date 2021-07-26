// e = envent
document.addEventListener('click', function(e) { 
    // delete feature
    if(e.target.classList.contains('delete-me')) {
        let _id = e.target.getAttribute('data-id');
        if(confirm('確定要刪除這筆資料?')) {
            axios.post('/delete-item', {
                id: _id
            }).then(function() {
                e.target.parentElement.parentElement.remove();
                console.log('已刪除');
            }).catch(err => {  
                console.log(err);
            })
        }
    }

    // update feature ver.2 點擊文本(text)進入文本框(input)就可以修改內容
    if(e.target.classList.contains('item-text')) {
        let originText = e.target.innerHTML;
        let _id = e.target.getAttribute('data-id');
        e.target.innerHTML = '<input type="text" id="updateInput"></input>';
        var updateInput = document.getElementById('updateInput');
        // 點擊文本框，立刻獲得焦點
        updateInput.focus();
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