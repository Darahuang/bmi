//設定DOM節點
var btnArea = document.querySelector('.btn');
var btn = document.querySelector('.button');
var list = document.querySelector('.list');
var data = JSON.parse(localStorage.getItem('listData')) || [];
var del = document.querySelector('.deleteAll');


//建立監聽
btnArea.addEventListener('click', calculate, false);
btnArea.addEventListener('click', reset, false);
list.addEventListener('click', delData, false);
del.addEventListener('click', delALL, false);

updateList(data)// 更新資料

// 將bmi各種層級的class以物件狀態管理,切記condition回傳的文字要與bmi各狀態名稱一致
let bmiStatus = {
    underweight: {
        class1: 'colorUnderweight',
        class2: 'borderUnderweight',
        class3: 'bgUnderweight'
    },
    normal: {
        class1: 'colorNormal',
        class2: 'borderNormal',
        class3: 'bgNormal'
    },
    overweight: {
        class1: 'colorOverweight',
        class2: 'borderOverweight',
        class3: 'bgOverweight'
    },
    obese1: {
        class1: 'colorObese1',
        class2: 'borderObese1',
        class3: 'bgObese1'
    },
    obese2: {
        class1: 'colorObese2',
        class2: 'borderObese2',
        class3: 'bgObese2'
    },
    obese3: {
        class1: 'colorObese3',
        class2: 'borderObese3',
        class3: 'bgObese3'
    }

}
// 事件代理:透過事件傳遞的機制,利用父節點來處理子節點的事件
function calculate(e) {
    if (e.target.nodeName === 'INPUT') {
        e.preventDefault();//取消Button的預設行為
        var height = parseInt(document.getElementById('height').value, 10);//取出輸入的值
        var weight = parseInt(document.getElementById('weight').value, 10);
        //檢查輸入資料
        if (height == '' || height == 0) {
            alert('請輸入數值,數值不可為0');
            return;
        } else if (weight == '' || weight == 0) {
            alert('請輸入數值,數值不可為0');
            return;
        }
        //計算BMI並建立變數
        var kg = weight;
        var m = height / 100;
        var bmi = (kg / (m * m)).toFixed(2) //toFixed()函數:四捨五入取小數點;
        var status = '';
        var condition = '';
        //判斷BMI
        if (bmi == 'NaN') {
            alert('請輸入數值')
            return
        } else if (bmi < 18.5) {
            status = '過輕';
            condition = 'underweight';
        } else if (18.5 <= bmi && bmi < 24) {
            status = '健康';
            condition = 'normal'
        } else if (24 <= bmi && bmi < 27) {
            status = '過重';
            condition = 'overweight'
        } else if (27 <= bmi && bmi < 30) {
            status = '輕度肥胖';
            condition = 'obese1'
        } else if (30 <= bmi && bmi < 35) {
            status = '中度肥胖';
            condition = 'obese2'
        } else if (bmi >= 35) {
            status = '重度肥胖';
            condition = 'obese3'
        }

        //日期時間
        var date = new Date(); //以記憶目前時間的Date物件進行初始化
        var yy = date.getFullYear();
        var mm = (date.getMonth()) + 1; //月份從0開始計算;
        var dd = date.getDate();
        var time = mm + '-' + dd + '-' + yy;

        //更改按鈕及狀態顏色並渲染到網頁上
        changeStatus(bmi, condition, status)

        //組成物件
        var newData = {
            condition,
            status,
            bmi,
            height,
            weight,
            time
        }
        data.push(newData) //在陣列最後面新增資料
        updateList(data) //更新資料
        localStorage.setItem('listData', JSON.stringify(data));//資料存在localStorage

    }
}

// 事件代理:透過事件傳遞的機制,利用父節點來處理子節點的事件
function reset(e) {
    e.preventDefault();
    if (e.target.nodeName === 'A') {
        e.preventDefault();
        document.getElementById("myForm").reset();
        var str = '';
        str += '<input type="button" class="button" value="Click!">';
        btnArea.innerHTML = str;

    }

}


//更新資料並渲染到網頁
function updateList(items) {
    var len = items.length;
    var str = '';
    for (var i = 0; i < len; i++) {
        str += `
        <li>
          <p class="${items[i].condition}"></p> 
          <p>${items[i].status}</p>
          <span>BMI</span>
          <p>${items[i].bmi}</p>
          <span>Height</span>
          <p>${items[i].height} cm</p>
          <span>Weight</span>
          <p>${items[i].weight} kg</p>
          <span class="date">${items[i].time}</span>
          <a href="#" class="delete">
            <i class="fa fa-times" aria-hidden="true" data-index=${i}></i>
          </a>
        </li>
        `
    }
    list.innerHTML = str;
}


//單項刪除資料   
function delData(e) {
    e.preventDefault();
    var name = e.target.nodeName;
    var index = e.target.dataset.index;
    if (name == 'I') {
        data.splice(index, 1);
        updateList(data);
        localStorage.setItem('listData', JSON.stringify(data));
    }
}
//全部清除資料
function delALL() {
    localStorage.clear();//清空localStorage的資料
    data = [];
    updateList(data);
}

//更改按鈕及狀態顏色並渲染到網頁上
function changeStatus(bmi, condition,status) {
    var str = '';
    str+=`
    <p class="newBtn ${bmiStatus[condition].class2}"></p>
    <p class="value ${bmiStatus[condition].class1}">${bmi}</p>
    <p class="bmi ${bmiStatus[condition].class1}">BMI</p>
    <p class="status ${bmiStatus[condition].class1}" >${status}</p>
    <a href="#" class="refreshBtn ${bmiStatus[condition].class3}"></a>
    `
    btnArea.innerHTML = str;
}