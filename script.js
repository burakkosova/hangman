// open a modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");
const btnMainMenu = document.getElementById("main-menu");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  clearInterval(countDown);
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  location.reload();
};

btnMainMenu.addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  // console.log(e.key);

  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

let password;
let hint;
let passwordDashed;

fetch("./dictionary.json")
  .then((response) => response.json())
  .then((data) => {
    const passwordBoard = data.words;
    const random = Math.floor(Math.random() * passwordBoard.length);
    hint = passwordBoard[random].hint;
    password = passwordBoard[random].name;
    passwordDashed = password.split("").map((letter) => {
      if (letter === " ") return " ";
      else if (letter === "’") return "’";
      else if (letter === ",") return ",";
      else return "_";
    });
    createTable(passwordBoard);
    start();
  });

let letters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVXYZ";
const alphabet = document.getElementById("alphabet");

const passwordDiv = document.querySelector("#board");
const imgDiv = document.querySelector("#hangin-dude");
let fail = 1;
let countDown;

const start = function () {
  timer();

  letters.split("").forEach((letter) => {
    const html = `<div id="${letter}" class="letter">${letter}</div>`;
    alphabet.insertAdjacentHTML("beforeend", html);
  });
  showPassword();
  showHangman(fail);
};

const showPassword = function () {
  passwordDiv.innerHTML = `<span id="hint">${hint}</span> ${passwordDashed.join(
    ""
  )}`;
};
const showHangman = function (nr) {
  imgDiv.innerHTML = `<img src="img/${nr}.svg" alt="" />`;
};

const checkLetter = function (char) {
  if (password.toUpperCase().split("").includes(char)) {
    password
      .toUpperCase()
      .split("")
      .forEach((letter, i) => {
        if (letter === char) {
          passwordDashed[i] = letter;
          showPassword();
        }
      });

    deactivateLetter(true, document.getElementById(char));
  } else {
    fail++;
    showHangman(fail);
    deactivateLetter(false, document.getElementById(char));
  }
  if (fail == 6) {
    finish(false);
  }
  if (password.toUpperCase() === passwordDashed.join("")) {
    finish(true);
  }
};

alphabet.addEventListener("click", (e) => {
  if (e.target.classList.contains("letter")) {
    checkLetter(e.target.textContent);
  }
});

const deactivateLetter = function (hit, letter) {
  letter.style.border = hit
    ? "1px solid rgb(50, 177, 149)"
    : "1px solid rgba(255, 0, 0, 0.338)";
  letter.style.backgroundColor = hit
    ? "rgb(50, 177, 149)"
    : "rgba(255, 0, 0, 0.338)";
  letter.style.color = "white";
  letter.style.cursor = "default";
};

// get input from keyboard
document.addEventListener("keypress", (e) => {
  if (
    (e.keyCode >= 65 && e.keyCode <= 90) ||
    (e.keyCode >= 97 && e.keyCode <= 122)
  ) {
    checkLetter(e.key.toUpperCase());
  }
});

const newGame = function () {
  location.reload();
};

const finish = function (succes) {
  if (succes) {
    alphabet.innerHTML = `<h1>TEBRİKLER!</h1><div class='btn'>YENİ OYUN</div>`;
    clearInterval(countDown);
  } else {
    alphabet.innerHTML = `<h1>KAYBETTİN!</h1><div class='btn'>TEKRAR DENE!</div>`;
    clearInterval(countDown);
  }
  document.querySelector(".btn").addEventListener("click", newGame);
};

document.querySelector("#new-game").addEventListener("click", newGame);

const timer = function () {
  const timer = document.querySelector("#timer");
  let time = new Date(30000);
  const options = {
    minute: "2-digit",
    second: "2-digit",
  };
  const tick = function () {
    time -= 1000;
    timer.textContent = Intl.DateTimeFormat("tr-TR", options).format(time);
    if (time == 0) {
      finish(false);
      clearInterval(countDown);
    }
  };
  tick();
  countDown = setInterval(tick, 1000);
  return countDown;
};

// sözlük işlemleri
const table = document.querySelector("table");

const createTable = function (words) {
  console.log(words);
  const root = document.getElementById("root");
  words.forEach((element, i) =>
    root.insertAdjacentHTML(
      "beforebegin",
      `<tr><td>${i + 1}</td><td>${element.name}</td><td>${
        element.hint
      }</td><td><img class="delete" id="img-${
        i + 1
      }" src="https://img.icons8.com/color/30/000000/trash--v1.png"/></td></tr>`
    )
  );

  const imgs = document.querySelectorAll(".delete");
  console.log(imgs);

  for (let img of imgs) {
    img.addEventListener("click", (e) => {
      console.log(e.target.id);
      table.deleteRow(+e.target.id.slice(-1));
    });
  }
};
