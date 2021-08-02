const express = require('express');
const engine = require('ejs-locals');
const firebase = require('firebase');
// 初始一個 express服務：app
const app = express();

app.use(express.urlencoded({  
    extended: false
    }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());


firebase.initializeApp({
    databaseURL: "https://todoapp-3d73a-default-rtdb.firebaseio.com/"
});


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });


// 設定ejs為樣版引擎以及設定讀取的資料夾為根目錄的views資料夾，app.set(name, value)
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    firebase.database().ref('todos').once('value', function(snapshot) {
        var data = snapshot.val(); 
        var itemTotal = Object.keys(data).length;
        console.log(data);
        if(data != null){
            res.render('index',{
                'todoList': data
            })
        }else{
            res.render('index')
        }
        
    });
    
    // 測試資料庫是否能使用
    // var db = firebase.database();
    // console.log(db);
});

// 創造物件
app.post('/create-item', (req, res) => {
    // 利用req.body.item的方式，將從input欄位取得的值存入這個變數。
    console.log(req.body);  // ex: { item: '888' }
    var items = req.body.item;
    // itemRef變數設定資料庫的路徑，把路徑設成'todos'，並且用push方法新增資料到指定的資料庫路徑中
    var itemRef = firebase.database().ref('todos');
    // set方法會覆蓋原有資料；push方法會在原有資料新增新資料
    itemRef.push({
        completed: false,
        item: items
        }).then(function() {
            res.redirect('/');
        });
})

//更新物件
app.post('/update-item', function (req, res) {
    console.log(req.body);
    var id = req.body.id;   // req.body.id 就是browser.js裡面axios所post的部分
    var dbref = firebase.database().ref('todos/' + id);
    dbref.update({
        item: req.body.text
    })
    res.send('Update Success');

})

// 更改任務物件 completed 的值
app.post('/change-item-status', (req, res) => {
    var id = req.body.id;
    var status = req.body.status;
    var dbref = firebase.database().ref('todos/' + id);
    dbref.update({
        completed: status
    })
})

// 刪除物件
app.post('/delete-item', function(req, res) {
    var id = req.body.id;
    var dbref = firebase.database().ref('todos/' + id);
    dbref.remove();
})

app.listen(3000);