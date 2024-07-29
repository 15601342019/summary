// import react from 'react';
import './index.css';

var play = document.getElementById("play")
var workBtn = document.getElementById("work")
var interactionBtn = document.getElementById("interaction")
var iterationCount = 100000000
var value = 0

var expensiveCalculation = function (IdleDeadline) {
  while (iterationCount > 0 && IdleDeadline.timeRemaining() > 1) {
    value =
      Math.random() < 0.5 ? value + Math.random() : value + Math.random()
    iterationCount = iterationCount - 1
  }
  requestIdleCallback(expensiveCalculation)
}

workBtn.addEventListener("click", function () {
  requestIdleCallback(expensiveCalculation)
})

interactionBtn.addEventListener("click", function () {
  play.style.background = "palegreen"
})