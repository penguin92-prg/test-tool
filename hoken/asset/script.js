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

// ------------------------------
// 初期化
var txtData;
function dataLoad() {
  fetchTXT(dataTXT)
    .then((txtText) => {
      txtData = txtText;
      console.log(txtData);
    })
    .catch(error => {
      console.error(error);
    });
}