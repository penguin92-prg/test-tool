// ------------------------------
// CSV読み込み関連
const dataCSV = "./asset/data.csv"; // ここにCSVファイルのURLを入力する

// promiseを使用して完了まで待機するシステムにした
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(`Failed to fetch CSV: ${xhr.status}`);
        }
      }
    };
    xhr.open('GET', url);
    xhr.send();
  });
}

// 読み込んだCSVファイルを二次元配列に組みなおす
function parseCSV(csvText) {
  const lines = csvText.split(/\r\n|\n/);
  const data = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length > 0) {
      data.push(currentLine);
    }
  }

  return data;
}


// ------------------------------
// 初期化
var data;
function init() {
  Promise.all([
    fetchCSV(dataCSV)
  ]).then(([csvText]) => {
    data = parseCSV(csvText);

    for(var i=0; i<data.length-2; i++){
      var dataContainer = document.createElement("div");
      dataContainer.setAttribute("id", data[i+1][0]+"-"+data[i+1][1]+"-"+data[i+1][2]);
      dataContainer.classList.add("dataSelect");
      var dataCategory = document.createElement("h2");
      dataCategory.innerHTML = data[i+1][0] + "年" + data[i+1][1] + "学期" + data[i+1][2];
      dataContainer.appendChild(dataCategory);
      var dataCategory = document.createElement("p");
      dataCategory.innerHTML = "P." + data[i+1][3];
      for(var j=0; j<data[i+1].length-4; j++){
        if(data[i+1][j+4] == ""){
          break;
        }
        dataCategory.innerHTML +=  (", " + data[i+1][j+4]);
      }
      dataContainer.appendChild(dataCategory);
      dataContainer.addEventListener("click", function(){
        if(!this.classList.contains("active")){
          for(var k=0; k<document.getElementsByClassName("dataSelect").length; k++){
            document.getElementsByClassName("dataSelect")[k].classList.remove("active");
          }
          this.classList.add("active");
          selected = this.getAttribute("id");
          console.log(selected);
        }
        else{
          this.classList.remove("active");
        }
      })
      document.getElementById("dataSelectContainer").appendChild(dataContainer);
    }
  });
}
init();


// ------------------------------
// モーダル開閉

const modal = document.querySelector("dialog");
const openButton = document.getElementById("openModal");
const closeButton= document.getElementById("dataLoad");

openButton.addEventListener("click", 
  function(){
    modal.showModal();
});

closeButton.addEventListener("click",
  function(){
    modal.close();
    dataTXT = "./" + selected + "/data.txt";  
    dataLoad();
});


// ------------------------------
// データ読み込み

// TXT読み込み関連
var dataTXT = "./2-3-学年末/data.txt"; // 読み込むTXTファイルのパス

// Promiseを使用して非同期でTXTファイルを取得
function fetchTXT(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(`Failed to fetch TXT: ${xhr.status}`);
        }
      }
    };
    xhr.open('GET', url);
    xhr.send();
  });
}

// 読み込んだTXTファイルを行ごとの配列に変換
function parseTXT(txtText) {
  const lines = txtText.split(/\r\n|\n/); // 改行で分割
  return lines.filter(line => line.trim() !== ""); // 空行を除外
}

// ------------------------------
// 初期化
var txtData;
function dataLoad() {
  fetchTXT(dataTXT)
    .then((txtText) => {
      txtData = parseTXT(txtText);
      console.log(txtData);
      while (document.getElementById("main").firstChild) {
        document.getElementById("main").removeChild(document.getElementById("main").firstChild);
      }
      for(var i=0; i<txtData.length; i++){
        console.log(txtData[i].slice(0, 2));
        if(txtData[i][0] == "【"){
          var add = document.createElement("h3");
          add.innerHTML = txtData[i];
          document.getElementById("main").appendChild(document.createElement("br"));
          document.getElementById("main").appendChild(document.createElement("br"));
          document.getElementById("main").appendChild(add);
          document.getElementById("main").appendChild(document.createElement("br"));
        }
        else if(txtData[i].slice(0, 2).match(/\d\d/)){
          var add = document.createElement("h2");
          add.innerHTML = txtData[i];
          document.getElementById("main").appendChild(document.createElement("br"));
          document.getElementById("main").appendChild(document.createElement("br"));
          document.getElementById("main").appendChild(document.createElement("br"));
          document.getElementById("main").appendChild(document.createElement("br"));
          document.getElementById("main").appendChild(add);
          document.getElementById("main").appendChild(document.createElement("br"));
        }
        else{
          var add = document.createElement("div");
          var j = 0;
          var flag = false;
          var tmpBold = "";
          var tmpNormal = "";
          var addBold = document.createElement("strong");
          var addNormal = document.createElement("span");
          for(var j=0; j<txtData[i].length; j++){
            if(txtData[i][j] == "$" && flag == false){
              addNormal.innerHTML = tmpNormal;
              add.appendChild(addNormal);
              tmpNormal = "";

              addBold = document.createElement("strong");
              flag = true;
              tmpBold += txtData[i][j];
            }
            else if(txtData[i][j] == "$" && flag == true){
              flag = false;
              tmpBold = tmpBold.replace("$", "");
              addBold.innerHTML = tmpBold;
              addBold.addEventListener("click",
                function(){
                  this.classList.toggle("active");
                }
              )
              add.appendChild(addBold);
              tmpBold = "";

              addNormal = document.createElement("span");
            }
            else if(flag == true){
              tmpBold += txtData[i][j];
            }
            else{
              tmpNormal += txtData[i][j];
            }
          }
          if(tmpBold != ""){
            tmpBold = tmpBold.replace("$", "");
            addBold.innerHTML = tmpBold;
            add.appendChild(addBold);
          }
          if(tmpNormal != ""){
            addNormal.innerHTML = tmpNormal;
            add.appendChild(addNormal);
          }
          document.getElementById("main").appendChild(add);
          document.getElementById("main").appendChild(document.createElement("br"));
        }
      }
    })
    .catch(error => {
      console.error(error);
    });
}