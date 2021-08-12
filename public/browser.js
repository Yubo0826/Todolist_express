document.addEventListener('click', function(e) { 
    // create feature
    if(e.target.classList.contains('create-btn')) {
        let item = document.getElementById('input_create').value;
        if(item != "") {
            axios.post('/create-item', {
                userId: userId,
                item: item
            }).then(function () {
                location.reload();
              }).catch(function (err) {
                  console.log(err);
              })
        }
    }
    
    // delete feature
    if(e.target.classList.contains('delete-me')) {
        e.target.parentElement.remove();
        let dataId = e.target.getAttribute('data-id');
        if (confirm("確定要刪除這筆資料嗎 ?")) {
            axios.post('/delete-item', {
                userId: userId,
                dataId: dataId
            })
        }
    }

    // update feature ver.2 點擊文本(text)進入文本框(input)就可以修改內容
    if(e.target.classList.contains('item-text')) {
        // 如果任務進行中，就可以被修改
        if(!e.target.previousSibling.previousSibling.checked) {
            let originText = e.target.innerHTML;
            let dataId = e.target.getAttribute('data-id');
            e.target.innerHTML = '<input type="text" id="updateInput" class="update-input-text"></input>';
            var updateInput = document.getElementById('updateInput');
            // 獲得焦點
            updateInput.focus();   
            // 失去焦點後，更新文本，並更新DB資料
            updateInput.onblur = function () {
                let updateVaule = updateInput.value;
                if(updateVaule != "") {
                    axios.post('/update-item', {
                        userId: userId,
                        text: updateVaule,
                        dataId: dataId
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
        let dataId = e.target.getAttribute('data-id');
        let status = e.target.checked;
        axios.post('/change-item-status', {
            userId: userId,
            dataId: dataId,
            status: status
        })
    }
})