// e = envent
document.addEventListener('click', function(e) {

    // update feature
    if(e.target.classList.contains('edit-me')) {
        // prompt() 方法可用於顯示對話框讓使用者輸入資料
        let originalText = e.target.parentElement.parentElement.querySelector('.item-text');
        let userInput = prompt('請修改代辦事項', originalText.innerHTML);
        let _id = e.target.getAttribute('data-id');
        // 加入判斷式: 以免使用者按下Edit，之後沒有改變，直接按下取消，資料還是會被更改
        if(userInput){
            axios.post('/update-item', {
                text: userInput,
                id: _id
            }).then(function() {
                console.log(userInput);
                originalText.innerHTML = userInput ;
            }).catch(err => {
                console.log(err);
            })
        } 
    }


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
})