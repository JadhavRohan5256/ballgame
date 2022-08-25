//variable declaration
let wrapper = document.querySelector("#main-wrapper");
let ball = document.querySelector("#ball");
let paddle = document.querySelector("#paddle");
let scoreBoard = document.querySelector("#score");
let width;
let height;
let score;
let ballTop;
let ballLeft;
let ballSpeedX;
let ballSpeedY;
let paddleSpeed;
let paddleWidth;
let paddleLeft;
let ballSize;
let timer;
let dragFlag = false;


// setting variables
let gear = document.querySelector(".icon i");
let setting = document.querySelector(".setting");
let done = document.querySelector("#done");
let checkbox = document.querySelectorAll(".checkbox");
let modeValue = document.querySelector("#mode");
let root = document.querySelector(":root");
let diffValue = "";
let ballGameStorage = localStorage.getItem("ballGameStorage");


// sound variable
let beepX = new Audio("sounds/beep_x.mp3");
let beepY = new Audio("sounds/beep_y.mp3");
let beepGameOver = new Audio("sounds/beep_game_over.mp3");
let beepPaddle = new Audio("sounds/beep_paddle.mp3");
let enableedSound = false;
let soundButton = document.querySelector("#sound");


// sound play function
function playSound(soundObject) {
  if (enableedSound === true) {
    soundObject.play();
  }
}


//creating localStorage if not created;
// starting method
function declaration() {
  score = 0;
  ballTop = 0;
  ballLeft = 0;
  ballSpeedX = 2;
  if (ballGameStorage.difficultyLevel !== undefined) {
    setDifficulties(ballGameStorage.difficultyLevel);
  } else {
    ballSpeedY = 2;
  }
  paddleSpeed = 50;
  paddleLeft = 0;
  ballSize = 20;
  paddleWidth = width <= 500 ? 60 : 100;
  width = wrapper.clientWidth;
  height = wrapper.clientHeight;
  ballLeft = Math.floor(Math.random() * (width - ballSize) + 1);
  paddleLeft = Math.floor(Math.random() * width);
  paddle.style.width = `${paddleWidth}px`;
  paddle.style.left = `${paddleLeft}px`;
  ball.style.width = `${ballSize}px`;
  ball.style.height = `${ballSize}px`;
  ball.style.borderRadius = `${ballSize / 2}px`;
}


let init = () => {
  //default initialization
  declaration();
  timer = requestAnimationFrame(gameLoop);
  // calling function on event fire
  window.addEventListener("keydown", keyPressed);
  wrapper.addEventListener("mousedown", mouseDown);
  wrapper.addEventListener("mousemove", mouseMove);
  wrapper.addEventListener("mouseup", mouseUp);
  wrapper.addEventListener("touchstart", mouseDown);
  wrapper.addEventListener("touchmove", mouseMove);
  wrapper.addEventListener("touchend", mouseUp);
};


// moving ball and inserting position in html dom
let moveBall = () => {
  ballLeft += ballSpeedX;
  ballTop += ballSpeedY;
  ball.style.top = `${ballTop}px`;
  ball.style.left = `${ballLeft}px`;
};


//updating score and inserting in html dom
let updateScore = () => {
  score += 1;
  if (score > ballGameStorage.maxScore) {
    ballGameStorage.maxScore = score;
    localStorage.setItem("ballGameStorage", JSON.stringify(ballGameStorage));
  }
  scoreBoard.textContent = `Your Score : ${score / 100}`;
};
// render the move ball method and update score method  when gameLoop start
let render = () => {
  moveBall();
  updateScore();
};


/*
collisionX is method to check wether it is collide Left wall 
and right wall
*/
let collisionX = () => {
  if (ballLeft <= 0 || ballLeft >= width - ballSize) {
    playSound(beepX);
    return true;
  }
  return false;
};


/*
collisionY is method to check wether it is collide top wall 
and checking is ball is collide paddle.
*/
let collisionY = () => {
  ball.classList.remove("ball-active");
  if (ballTop < 0) {
    playSound(beepY);
    return true;
  }
  if (ballTop > height - 20 - ballSize) {
    // if ballTop position is equal and greater than paddle
    playSound(beepPaddle);
    var paddleMid = paddleWidth / 2;
    var fourPart = paddleWidth / 4;
    if ( ballLeft >= paddleLeft + fourPart && ballLeft < paddleLeft + paddleMid + fourPart ) {
      // paddle middle part ball hit logic
      if (ballSpeedX < 0) {
        ballSpeedX = -2;
      } else {
        ballSpeedX = 2;
      }
      return true;
    } else if (ballLeft >= paddleLeft && ballLeft < paddleLeft + fourPart) {
      // paddle left part ball hit logic
      if (ballSpeedX < 0) {
        ballSpeedX = -8;
      } else {
        ballSpeedX = 8;
      }
      return true;
    } else if (
      ballLeft >= paddleLeft + paddleMid + fourPart &&
      ballLeft < paddleLeft + paddleWidth
    ) {
      // paddle right part ball hit logic
      if (ballSpeedX < 0) {
        ballSpeedX = -8;
      } else {
        ballSpeedX = 8;
      }
      return true;
    }
  }
  return false;
};


//checking ball is collide top left right wall
let collisions = () => {
  if (collisionX()) {
    ballSpeedX *= -1;
  }
  if (collisionY()) {
    ballSpeedY *= -1;
  }
};


//increasing ball speed when cross
let difficulty = () => {
  if (score % 1000 == 0) {
    if (ballSpeedY > 0) {
      ballSpeedY += 2;
    } else {
      ballSpeedY -= 2;
    }
  }
};


//game loop continuously running
let gameLoop = () => {
  render();
  collisions();
  difficulty();
  if (ballTop < height - ballSize - 2) {
    timer = requestAnimationFrame(gameLoop);
  } else {
    // game over block
    scoreBoard.textContent = `Game Over! Your score is ${score / 100}`;
    swal("Game Over!", `Your score is ${score/ 100}`);
    setTimeout(() => {
      init();
    },3000);
    playSound(beepGameOver);
  }
};


//checking which key are press
let keyPressed = (e) => {
  if (paddleLeft > 0 && e.key == "ArrowLeft") {
    paddleLeft -= paddleSpeed;
  } else if (paddleLeft < width - paddleWidth && e.key == "ArrowRight") {
    paddleLeft += paddleSpeed;
  }
  // checking paddle left assin value
  if (paddleLeft + paddleWidth > width) {
    paddleLeft = width - paddleWidth;
  } else if (paddleLeft < 0) {
    paddleLeft = 0;
  }
  paddle.style.left = `${paddleLeft}px`;
};


// when mouse move
function mouseDown(e) {
  dragFlag = true;
}
function mouseUp(e) {
  dragFlag = false;
}
function mouseMove(e) {
  if (dragFlag) {
    e.preventDefault();
    paddleLeft = e.clientX - 20 || e.targetTouches[0].pageX - 20;
    if (paddleLeft < 0) paddleLeft = 0;
    if (paddleLeft > width - paddleWidth) paddleLeft = width - paddleWidth;
  }
  paddle.style.left = `${paddleLeft}px`;
}


// setting  javascript started
// opening setting navbar
function showSetting() {
  if (setting.classList.contains("setting-none")) {
    setting.classList.remove("setting-none");
    gear.classList.remove("rotate-animation");
    timer = requestAnimationFrame(gameLoop);
  } else {
    setting.classList.add("setting-none");
    gear.classList.add("rotate-animation");
    cancelAnimationFrame(timer);
  }
}
gear.addEventListener("click", showSetting);


ballGameStorage = JSON.parse(localStorage.getItem("ballGameStorage"));
// initializing localStorage with default value
if (ballGameStorage === null) {
  ballGameStorage = {
    colorMode: modeValue.checked,
    difficultyLevel: "0",
    maxScore: 0,
    sound: true,
  };
  localStorage.setItem("ballGameStorage", JSON.stringify(ballGameStorage));
} else {
  modeValue.checked = ballGameStorage.colorMode;
  checkbox.forEach((item) => {
    if (item.value === ballGameStorage.difficultyLevel) {
      item.checked = true;
    }
  });
  soundButton.checked = ballGameStorage.sound;
  if (soundButton.checked) {
    enableedSound = true;
  }
}


//checking sound permission from user
soundButton.addEventListener("click", () => {
  if (ballGameStorage !== null) {
    if (soundButton.checked !== ballGameStorage.sound) {
      ballGameStorage.sound = soundButton.checked;
      localStorage.setItem("ballGameStorage", JSON.stringify(ballGameStorage));
      enableedSound = soundButton.checked;
    }
  }
});


// when use click setting done button then this event is fire
done.addEventListener("click", () => {
  checkbox.forEach((item) => {
    if (item.checked) {
      diffValue = item.value;
    }
  });
  if (ballGameStorage.difficultyLevel !== diffValue) {
    ballGameStorage.difficultyLevel = diffValue;
    localStorage.setItem("ballGameStorage", JSON.stringify(ballGameStorage));
    setDifficulties(diffValue);
  }
  //closing navbar
  showSetting();
});
setDifficulties(ballGameStorage.difficultyLevel);


function setDifficulties(diff) {
  switch (diff) {
    case "0":
      ballSpeedY = 2;
      break;
    case "1":
      ballSpeedY = 5;
      break;
    case "2":
      ballSpeedY = 10;
      break;
    default:
      ballSpeedY = 2;
      break;
  }
}


// creating dark and light mode function
function colorChange() {
  ballGameStorage = JSON.parse(localStorage.getItem("ballGameStorage"));
  if (ballGameStorage.colorMode !== modeValue.checked) {
    ballGameStorage.colorMode = modeValue.checked;
    localStorage.setItem("ballGameStorage", JSON.stringify(ballGameStorage));
  }
  if (modeValue.checked !== true) {
    root.style.setProperty("--score-color", "#000000");
    root.style.setProperty("--primary-bg", "#ffffff");
    root.style.setProperty("--surface-bg", "#ffffff");
    root.style.setProperty("--paddle-bg", "#ffffff");
    root.style.setProperty("--score-bg", "#ffffff");
    root.style.setProperty("--ball-bg", "#000000");
    root.style.setProperty("--label-color", "#ffffff");
  } else {
    root.style.setProperty("--score-color", "#ffffff");
    root.style.setProperty("--primary-bg", "#000000");
    root.style.setProperty("--surface-bg", "#121212");
    root.style.setProperty("--paddle-bg", "#bb86fc");
    root.style.setProperty("--score-bg", "#FF7597");
    root.style.setProperty("--ball-bg", "#03dac6");
    root.style.setProperty("--label-color", "#00B0FF");
  }
}


// when document is loaded then function is called
colorChange();
modeValue.addEventListener("click", colorChange);
//calling init method when document is loaded and when resize the window
window.addEventListener("load", init);
window.addEventListener("resize", init);
modeValue.value = true;
