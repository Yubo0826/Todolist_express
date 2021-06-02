const express = require('express');
const engine = require('ejs-locals');
const firebase = require('firebase');
// 初始一個 express服務：app
const app = express();

app.use(express.urlencoded({
    extended: false
    }));
app.use(express.static('public'));
app.use(express.json());


firebase.initializeApp({
    databaseURL: "https://todoapp-3d73a-default-rtdb.firebaseio.com/"
});

// 設定ejs為樣版引擎以及設定讀取的資料夾為根目錄的views資料夾，app.set(name, value)
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    firebase.database().ref('todos').once('value', function(snapshot) {
        var data = snapshot.val(); 
        console.log(data);
        res.render('index', {
            'todolist': data
        });   
    });
    
    // 測試資料庫是否能使用
    // var db = firebase.database();
    // console.log(db);
});

app.post('/create-item', (req, res) => {
    // 利用req.body.item的方式，將從input欄位取得的值存入這個變數。
    console.log(req.body);  // ex: { item: '888' }
    var items = req.body.item;
    // itemRef變數設定資料庫的路徑，把路徑設成'todos'，並且用push方法新增資料到指定的資料庫路徑中
    var itemRef = firebase.database().ref('todos').push();
    itemRef.set({
        item : items
        }).then(function() {
            // firebase.database().ref('todos').once('value', function(snapshot) {
            //     res.send({
            //         "success": true,
            //         "result": snapshot.val(),
            //         "message": "資料讀取成功"
            //         });

            // })
            res.redirect('/');
        });
})

app.post('/update-item', function (req, res) {
    console.log(req.body);
    var id = req.body.id;   // req.body.id 就是browser.js裡面axios所post的部分
    var dbref = firebase.database().ref('todos/' + id);
    dbref.update({
        item: req.body.text
    })
    res.send('Update Success');

})

app.post('/delete-item', function(req, res) {
    var id = req.body.id;
    var dbref = firebase.database().ref('todos/' + id);
    dbref.remove();
})

app.listen(3000);