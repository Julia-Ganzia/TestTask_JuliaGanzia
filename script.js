"use strict";

let data =
  '{"accounts": [{"title": "user 1","img":"https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/8422811681584409092-64.png"},{"title": "user 2","img":"https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/8422811681584409092-64.png"},{"title": "user 3","img":"https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/8422811681584409092-64.png"}]}';

let accountsObj = JSON.parse(data);
let accounts = accountsObj.accounts;
let parentElement = document.getElementById("screen");
let nameSheet = document.querySelector("h1");
let screenFlag;
let index = 0;

startMainManegerFunction();

function startMainManegerFunction() {
  getScreen1();
  parentElement.addEventListener("mousedown", () => event.preventDefault());
  parentElement.addEventListener("keydown", keyDownElementMain);
}

function getScreen1() {
  screenFlag = true;
  nameSheet.innerHTML = "Screen 1";
  let accountConteiner = document.createElement("nav");
  accountConteiner.classList.toggle("navScreen1");
  accountConteiner.innerHTML = `${accounts.map(getAccounts).join("")}`;
  accountConteiner.firstElementChild.autofocus = true;
  let button = document.createElement("button");
  button.classList.toggle("buttonScreen1");
  button.innerText = "ADD";
  parentElement.append(accountConteiner, button);
}

function getScreen2() {
  screenFlag = false;
  nameSheet.innerHTML = "Screen 2";
  let form = document.createElement("nav");
  form.classList.toggle("formScreen2");
  let textArea = document.createElement("input");
  let buttons = document.createElement("div");
  let butADD = document.createElement("button");
  butADD.innerText = "ADD";
  let butCancel = document.createElement("button");
  butCancel.innerText = "Cancel";
  buttons.append(butADD, butCancel);
  buttons.classList.toggle("buttonScreen2");
  form.append(textArea, buttons);
  parentElement.append(form);
}

function changeScreen() {
  parentElement.innerHTML = "";
  if (screenFlag) {
    getScreen2();
    document.querySelector("input").focus();
  } else {
    getScreen1();
    document.querySelector("div").focus();
  }
}

function getAccounts(account) {
  return `
  <div id="accounts"  tabindex="0">
    <img class="account_photo" src="${account.img}">
    <h3 >${account.title}</h3>
    </div>
   `;
}

function getIndexAccount(arr) {
  for (let y = 0; y < accounts.length; y++) {
    arr[y].addEventListener("keydown", () => {
      index = y;
    });
  }
  return index;
}

function keyDownElementMain(elem) {
  let element = elem.target.tagName;
  let elementValue = elem.target.innerText;
  let key = elem.key;
  screenFlag
    ? keyDownElementScreen1(element, key)
    : keyDownElementScreen2(element, elementValue, key);
}

function keyDownElementScreen1(element, key) {
  let accountsElement = document.querySelectorAll("div");
  if (
    (element == "DIV" && key !== "ArrowLeft") ||
    (element == "BUTTON" && key == "ArrowLeft")
  ) {
    getIndexAccount(accountsElement);
    index = keyDownEventScreen1(key, index);
    index !== null ? accountsElement[index].focus() : index;
  }
  if (element == "DIV" && key == "ArrowLeft") {
    deleteAccount(accountsElement, index);
    index = index == 0 ? index + 1 : index - 1;
    accountsElement[index].focus();
  }
  if (element == "BUTTON" && key == "Enter") {
    changeScreen();
  }
}
function keyDownElementScreen2(element, elementValue, key) {
  let buttonElement = document.querySelector("button");
  if (
    key == "ArrowDown" ||
    key == "ArrowLeft" ||
    (key == "Enter" && element == "INPUT")
  ) {
    buttonElement.focus();
  }
  if (key == "ArrowRight") {
    buttonElement.nextElementSibling.focus();
  }
  if (key == "ArrowUp") {
    document.querySelector("input").focus();
  }
  if (key == "Enter" && element == "BUTTON") {
    elementValue == "Cancel" ? changeScreen() : addAccount();
  }
}

const keyDownEventScreen1 = (key, i) => {
  switch (key) {
    case "ArrowLeft":
      return (i = localStorage.getItem("accountInFocus"));
    case "ArrowUp":
      return (i = i === 0 ? accounts.length - 1 : --i);
    case "ArrowRight":
      document.querySelector("button").focus();
      localStorage.setItem("accountInFocus", i);
      return null;
    case "ArrowDown":
      return (i = i === accounts.length - 1 ? 0 : ++i);
  }
};

const deleteAccount = (obj, m) => {
  obj[m].remove();
  accountsObj.accounts.splice(m, 1);
  data = JSON.stringify(accountsObj);
};

const addAccount = () => {
  let nameNewAccount = document.querySelector("input").value;
  if (nameNewAccount) {
    const user = new userAccount(nameNewAccount);
    accountsObj.accounts.push({ ...user });
    data = JSON.stringify(accountsObj);
    document.querySelector("input").value = "";
  }
};

function userAccount(title, img) {
  this.title = title;
  this.img =
    img ||
    "https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/8422811681584409092-64.png";
}
