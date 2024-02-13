$(document).ready(function () {
  $("#play").click(() => startGame());
});

let asteroidGenerationTimer;
let count;
let scoreTimer;
let lastPosY = 0;
let fireImg;
let shuttleImg;

// intervalCollision setta un intervallo di tempo per controllare le collisioni
// tra la navicella e le meteore

function intervalCollision() {
  setInterval(() => {
    const hitboxShuttle = $("#hitboxShuttle");
    const hitboxMeteor = $(".hitboxMeteor");
    hitboxMeteor.each((index, meteor) => {
      if (checkCollision(hitboxShuttle, $(meteor))) {
        gameOver();
      }
    });
  }, 100);
}

// checkCollision controlla se due div si sovrappongono

function checkCollision($div1, $div2) {
  var rect1 = $div1[0].getBoundingClientRect();
  var rect2 = $div2[0].getBoundingClientRect();

  return (
    rect1.right >= rect2.left && rect1.left <= rect2.right && rect1.bottom >= rect2.top && rect1.top <= rect2.bottom
  );
}

// scoreBoardTimer aggiorna il punteggio ogni secondo

const scoreBoardTimer = (pScore) => {
  count = 0;
  scoreTimer = setInterval(() => {
    count++;
    pScore.text(`score: ${count}`);
  }, 1000);
};

// startGame inizializza il gioco e setta gli eventi per la navicella e le meteore

function startGame() {
  $("main").empty();
  var pScore = $("<p>").addClass("position-absolute top-0 start-0 text-white m-5");
  pScore.text("score : 0");
  $("main").append(pScore);
  scoreBoardTimer(pScore);
  generateAsteroid();
  $("main").css("cursor", "none");
  $(document).mousemove(function (event) {
    var mousePosition = {
      x: event.pageX,
      y: event.pageY,
    };

    // Seleziona le immagini generate dinamicamente
    fireImg = $("main img[alt='fire']");
    shuttleImg = $("main img[alt='shuttle']");

    // Se le immagini non esistono, creale
    if (fireImg.length === 0) {
      fireImg = $("<img/>", {
        src: "./assets/imgs/fire.gif",
        alt: "fire",
        css: {
          width: "100px",
          height: "100px",
          backgroundColor: "transparent",
        },
      });
      $("main").append(fireImg);
    }
    // Se le immagini non esistono, creale
    if (shuttleImg.length === 0) {
      shuttleImg = $("<img/>", {
        src: "./assets/imgs/omi.png",
        alt: "shuttle",
        css: {
          width: "100px",
          height: "100px",
          backgroundColor: "transparent",
        },
      });
      $("main").append(shuttleImg);
    }

    // Aggiorna la posizione delle immagini
    fireImg.css({
      position: "absolute",
      left: mousePosition.x - 130,
      top: mousePosition.y - 50,
      transform: "rotate(270deg)",
    });
    // Aggiorna la posizione delle immagini
    shuttleImg.attr("id", "hitboxShuttle").css({
      position: "absolute",
      left: mousePosition.x - 50,
      top: mousePosition.y - 50,
      transform: "rotate(90deg)",
    });
  });
  intervalCollision();
}
// createAsteroidDOM crea un div con un'immagine di una meteora e una coda di fiamma
function createAsteroidDOM(posY) {
  var divOut = $("<div>")
    .addClass("position-absolute asteroid")
    .css("top", posY + "%");

  // Creazione dell'elemento div con jQuery
  var divIn = $("<div>").addClass("position-relative").css({ width: "130px", height: "50px" });

  // Creazione dell'elemento img per la coda di fiamma con jQuery
  var flameTailImg = $("<img>").attr("src", "./assets/imgs/fire.gif").attr("alt", "").addClass("rotate90 flameTail");

  var divMeteor = $("<div>").attr("class", "hitboxMeteor").css({ width: "100px", height: "40px" });

  // Creazione dell'elemento img per la meteora con jQuery
  var meteorImg = $("<img>")
    .attr("src", "./assets/imgs/meteor.webp")
    .attr("alt", "")
    .attr("width", "60")
    .attr("height", "60")
    .addClass("meteor")
    .css("opacity", "0.5");

  var flameTailImg2 = $("<img>")
    .attr("src", "./assets/imgs/fire.gif")
    .attr("alt", "")
    .addClass("rotate90 flameTail")
    .css("opacity", "0.6");

  // Aggiunta degli elementi img come figli del div
  divMeteor.append(meteorImg);
  divIn.append(flameTailImg, divMeteor);
  divOut.append(divIn);

  // divMeteor.mouseover(() => {
  //   gameOver();
  // });

  // Restituzione dell'elemento div creato
  return divOut;
}

// generateAsteroid genera una meteora ogni 2 secondi
function generateAsteroid() {
  asteroidGenerationTimer = setInterval(() => {
    let posY;
    do {
      posY = Math.floor(Math.random() * 80);
    } while (posY < lastPosY + 5 && posY > lastPosY - 5);
    lastPosY = posY;
    const currentAsteroid = createAsteroidDOM(posY);
    $("main").append(currentAsteroid);
    setTimeout(() => {
      destroyAsteroid(currentAsteroid);
    }, 5800);
  }, 2000);
}
// destroyAsteroid rimuove la meteora dal DOM
function destroyAsteroid(currentAsteroid) {
  currentAsteroid.remove();
}
// settings è una funzione vuota
function settings() {}

// gameOver termina il gioco e mostra il punteggio
function gameOver() {
  console.log("game over");
  $("main").empty();

  clearInterval(asteroidGenerationTimer);
  clearInterval(scoreTimer);

  fireImg.css({
    display: "none",
  });

  shuttleImg.css({
    display: "none",
  });
  $("main").css("cursor", "unset");
  $(document).off("mousemove");

  let GameOverDiv = $("<div>").addClass(
    " d-flex vh-100 align-items-center justify-content-center  puff-in-center flex-column"
  );

  let finalDiv = $("<div>").addClass("display-1 text-center text-white fw-bolder");
  finalDiv.text("GAME OVER");
  GameOverDiv.append(finalDiv);

  let scoreDiv = $("<div>").addClass("d-flex flex-column text-center text-white display-3");
  scoreDiv.text(`score: ${count}`);

  GameOverDiv.append(scoreDiv);
  $("main").append(GameOverDiv);

  let restart = $("<button>").addClass("btn btn-info text-light slide-in mt-2").css({ visibility: "hidden" });
  restart.text("Gioca Ancora");
  restart.click(() => {
    startGame();
  });
  GameOverDiv.append(restart);
  setTimeout(() => {
    restart.css({ visibility: "visible" });
  }, 2000);
}
