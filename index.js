const express = require('express');
const engine = require('ejs-locals');
const firebase = require('firebase');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.urlencoded({  
    extended: false
    }));
app.use(express.json());
// 把 public 加入靜態資源目錄
app.use(express.static(__dirname + '/public'));
// sign for cookie
app.use(cookieParser('yub0myt0d5'));
// CROSS 設定
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });
// 設定ejs為樣版引擎以及設定讀取的資料夾為根目錄的views資料夾，app.set(name, value)
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

firebase.initializeApp({
    databaseURL: "https://todoapp-3d73a-default-rtdb.firebaseio.com/"
});


app.get('/', (req, res) => {
    var router = 'noLogin';
    console.log(req.cookies.userId);
    if(req.cookies.userId){
        router = req.cookies.userId;
    }
    firebase.database().ref('todos/' + router).once('value', function(snapshot) {
        var data = snapshot.val();
        console.log(data);
        if(data != null){
            res.render('index',{
                'todoList': data
            })
        }else{
            res.render('index', {
                'todoList': ''
            })
        }
        
    });
});

// 創造物件
app.post('/create-item', (req, res) => {
    // 利用req.body.item的方式，將從input欄位取得的值存入這個變數。
    console.log(req.body);  // ex: { item: '888' }
    var items = req.body.item;
    var userId = req.body.userId;
    // itemRef變數設定資料庫的路徑，把路徑設成'todos'，並且用push方法新增資料到指定的資料庫路徑中
    var itemRef = firebase.database().ref('todos/'+ userId); 
    // set方法會覆蓋原有資料；push方法會在原有資料新增新資料
    itemRef.push({
        completed: false,
        item: items
        });
    res.send('新增成功');
})

//更新物件
app.post('/update-item', (req, res) => {
    var dataId = req.body.dataId;   // req.body.id 就是browser.js裡面axios所post的部分
    var userId = req.body.userId;
    var dbref = firebase.database().ref('todos/' + userId + '/' + dataId);
    dbref.update({
        item: req.body.text
    })
    res.send('Update Success');

})

// 更改任務物件 completed 的值
app.post('/change-item-status', (req, res) => {
    var userId = req.body.userId;
    var dataId = req.body.dataId;
    var status = req.body.status;
    var dbref = firebase.database().ref('todos/' + userId + '/' + dataId);
    dbref.update({
        completed: status
    })
})

// 刪除物件
app.post('/delete-item', (req, res) => {
    var dataId = req.body.dataId;
    var userId = req.body.userId;
    var dbref = firebase.database().ref('todos/' + userId + '/' + dataId);
    dbref.remove();
    console.log('刪除成功');
})

app.post('/setcookie', (req, res) => {
    let userId = req.body.userId;
    res.cookie('userId', userId);
    // 目前不知道: 只有一行res.cookie()不能成功設置cookie
    res.send('success');
    
});

app.listen(process.env.PORT || 3000);