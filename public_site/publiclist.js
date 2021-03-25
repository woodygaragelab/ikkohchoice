var callAPI = (userId,remarks,trxCd)=>{
    if(userId == "") {
        showSnackbarError("UserIDを入力してください。");
        return;
    }
    setDisabled(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "UserID":userId,
        "TrxCode":trxCd,
        "EmpNo":userId,
        "FirstName":'',
        "LastName":'',
        "Remarks":remarks
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://yv3egw6vf0.execute-api.ap-northeast-1.amazonaws.com/beta", requestOptions)
    .then(response => response.text())
    .then(result => {
        let resdata = JSON.parse(result).data;
        setDisabled(false);
        //alert("登録が完了しました。\n\n登録区分：" + convTrxCodeToName(resdata.TrxCode) + "\n登録時刻： " + resdata.TimeStamp.full);
        document.getElementById("input_remarks").value = "";
        showTable(userId);
        showSnackbar("Success! " + convTrxCodeToName(resdata.TrxCode) + "  " + resdata.TimeStamp.full);
    })
    .catch(error => {
        console.log('error', error);
        setDisabled(false);
        showSnackbarError("Error! 登録が失敗しました。");
    });
}

var callAnnotate = (userId,remarks,trxCd)=>{
    if(userId == "") {
        showSnackbarError("textを入力してください。");
        document.getElementById("annotated").value = "no text";
        return;
    }
    //setDisabled(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "text":userId
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    //fetch("https://0seohnjg1f.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)             // woodymeter 環境
    fetch("https://y6qycvcst7.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)             // ars-admin  環境
    //
    .then(response => response.text())
    .then(result => {
        let resdata = JSON.parse(result).body;
        document.getElementById("annotated").value = resdata;
        
        document.getElementById("input_userid").value = JSON.parse(resdata).UserID;
        document.getElementById("input_remarks").value = JSON.parse(resdata).Remarks;

        console.log(resdata);
        showSnackbar("Success! " + resdata);
    })
    .catch(error => {
        console.log('error', error);
        showSnackbarError("Error! 変換が失敗しました。");
    });
}





function convTrxCodeToName(code) {
    if(code == "IN") {
        return "出社";
    }
    return "退社";
}

function setDisabled(flg){
    if (flg){
        document.getElementById("input_userid").setAttribute("disabled", flg);
        document.getElementById("input_remarks").setAttribute("disabled", flg);
        document.getElementById("inbutton").setAttribute("disabled", flg);
        document.getElementById("outbutton").setAttribute("disabled", flg);
        document.getElementById("querybutton").setAttribute("disabled", flg);
    } else {
        document.getElementById("input_userid").removeAttribute("disabled");
        document.getElementById("input_remarks").removeAttribute("disabled");
        document.getElementById("inbutton").removeAttribute("disabled");
        document.getElementById("outbutton").removeAttribute("disabled");
        document.getElementById("querybutton").removeAttribute("disabled");
    }
}

var showTable = (userId) => {
    if(userId == "") {
        showSnackbarError("UserIDを入力してください。");
        return;
    }
    setDisabled(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "UserID":userId
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("https://0817cl4qa9.execute-api.ap-northeast-1.amazonaws.com/beta", requestOptions)
        .then(response => response.text())
        .then(result => {
            let tableData = JSON.parse(result);
            //console.log(tableData);
            setTable(tableData);
            setDisabled(false);
        })
        .catch(error => {
            console.log('error', error);
            setDisabled(false);
            showSnackbarError("Error! 照会が失敗しました。");
        }
    );
}

//table header
const thArray = [ 
    "TrxCode"
    , "Date"
    , "Time"
    , "Remarks"
    //, "UserID" 
];

var preTable;

function getPosition(key) {
    for(header in thArray) {
        if(thArray[header] == key) {
            return header;
        }
    }
    return 0;
}

function isTrxCode(key) {
    if("TrxCode" == key) {
        return true;
    }
    return false;
}

function setTable(json) {

    if(preTable !== undefined) {
        document.getElementById('queryTable').removeChild(preTable);
    }
    var ary = new Array(5);

    var table = document.createElement('table');
    table.classList.add('u-full-width');

    var tr = document.createElement('tr');
    for (key in thArray) {
        var th = document.createElement('th');
        th.textContent =thArray[key];
        tr.appendChild(th);
    }
    table.appendChild(tr);

    for (var i = 0; i < json.length; i++) {
        var tr = document.createElement('tr');
        for (key in json[0]) {
            var tc = json[i][key];
            ary[getPosition(key)] = isTrxCode(key) ? convTrxCodeToName(tc) : tc;
        }
        for(trd in ary) {
            var td = document.createElement('td');
            td.textContent = ary[trd];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    preTable = document.getElementById('queryTable').appendChild(table);
}

