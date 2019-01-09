const width = 20
let $grid
let $squares
let $scoreboard
let highScores = JSON.parse(localStorage.getItem('scores'))
let $startScreen
let $endScreen
let highScoreUserName
let playerPosition
let laserPosition
let alienLaserPosition
let mothershipDestroyed
let mothershipPosition
let mothershipTimer
let rightTimer
let leftTimer
let laserTimer
let alienLaserTimer
let direction
let delay
const laserSpeed = 10
let alienDifficulty
let alienLineCount = 1
let enemies = []
let enemiesIndices= []
let score

//SCOREBOARD > These functions manage the scoreboard & high score table

function displayHighScores() {
  $endScreen.empty()
  console.table(highScores)
  for (let i=0; i<highScores.length; i++) {
    $endScreen.append('<h2>High Scores</h2>')
    $endScreen.append('<p id="scoreBoardName'+i+'">'+highScores[i].userName+'</p>')
    $endScreen.append('<p id="scoreBoardScore'+i+'">'+highScores[i].score+'</p>')
  }
}

function submitHighScore() {
  const newHighScore = new highScore(highScoreUserName, score)
  for(let i=0; i<highScores.length; i++) {
    if (score > highScores[i].score) {
      highScores.splice(i, 0, newHighScore)
      highScores.pop()
      localStorage.setItem('scores', JSON.stringify(highScores))
      console.log('High Scores saved')
      displayHighScores()
      break
    }
  }
}

function  saveHighScore() {
  $endScreen.empty()
  $endScreen.append('<form class="highScoreForm"><input type="text" name="userName" value ="TEST"><br><input type="submit" value="Submit"></form>')

  const $highScoreForm = $('form')
  const $userName = $('[name="userName"]')

  $highScoreForm.on('submit', e => {
    e.preventDefault()
    highScoreUserName = $userName.val()
    submitHighScore()
  })
}

class highScore {
  constructor(userName, score) {
    this.userName = userName
    this.score = score
  }
}

//DEV ONLY > This fills the scoreboard with placeholder data. Should be called from the console to overwrite user local storage
function overwriteScoreboard() {
  highScores = []
  highScores.push(new highScore('BEN', 1000))
  highScores.push(new highScore('BEN', 900))
  highScores.push(new highScore('BEN', 800))
  highScores.push(new highScore('BEN', 700))
  highScores.push(new highScore('BEN', 600))
  highScores.push(new highScore('BEN', 5000))
  highScores.push(new highScore('BEN', 400))
  highScores.push(new highScore('BEN', 300))
  highScores.push(new highScore('BEN', 200))
  highScores.push(new highScore('BEN', 100))
  localStorage.setItem('scores', JSON.stringify(highScores))
  console.log('Scores overwritten')
}


//CONTROL FUNCTIONS > These functions affect the player craft
function movePlayerLeft() {
  if(playerPosition > (width*width)-width) {
    $squares.removeClass('player')
    playerPosition--
    $squares.eq(playerPosition).addClass('player')
  }
}

function movePlayerRight() {
  if(playerPosition < (width*width)-1) {
    $squares.removeClass('player')
    playerPosition++
    $squares.eq(playerPosition).addClass('player')
  }
}

function playerShoot() {
  laserPosition = playerPosition - width
  $squares.eq(laserPosition).addClass('laser')
  laserPhysics()
}

//CONDITIONAL FUNCTIONS > These functions check for certain conditions.

function levelUp() {
  delay -= 200
  console.log(delay)
  alienDifficulty += 0.1
  console.log(alienDifficulty)
  enemies = []
  enemiesIndices = []
  alienLineCount = 1
  clearTimeout(leftTimer)
  clearTimeout(rightTimer)
  clearTimeout(mothershipTimer)
  spawnAliens()
  updateIndices()
  moveAliensRight()
}

function checkForWin() {
  if (enemiesIndices.length === 0) {
    $squares.eq(laserPosition).removeClass('laser aliens3')
    setTimeout(levelUp, 2000)
  }
}

function handleMothershipHit() {
  score += 250
  mothershipDestroyed = true
  $scoreboard.text('Score: ' + score)
}

function handleHit() {
  const deadAlien = enemies[enemiesIndices.indexOf(laserPosition)]
  score += deadAlien.points
  $scoreboard.text('Score: ' + score)
  $squares.eq(laserPosition).removeClass()
  enemies.splice(enemiesIndices.indexOf(laserPosition), 1)
  updateIndices()
  checkForWin()
}

//GAME FUNCTIONS > These functions control the game elements

function gameOver() {
  $grid.hide()
  $scoreboard.hide()
  $endScreen = $('.endScreen')
  $endScreen.show()
  $grid.empty()
  const $restartButton = $('#restartButton')
  $restartButton.on('click', initGame)
  const $finalScore = $('#finalScore')
  $finalScore.text('Score: ' + score)

  if (score > (highScores[highScores.length-1].score)) {
    $finalScore.append('<p id="highScoreAchieved">You got a high score!</p>')
    $restartButton.hide()
    $finalScore.append('<button id="saveHighScore">Save Score</button>')
    const $saveScoreButton = $('#saveHighScore')
    $saveScoreButton.on('click', saveHighScore)
  }
}

function alienLaserPhysics() {
  $squares.eq(alienLaserPosition).removeClass('alienLaser')
  alienLaserPosition += width
  $squares.eq(alienLaserPosition).addClass('alienLaser')
  if (playerPosition === alienLaserPosition) {
    gameOver()
  } else if (alienLaserPosition > width*width) {
    clearTimeout(alienLaserTimer)
  } else {
    alienLaserTimer = setTimeout(alienLaserPhysics, 40)
  }
}

function handleAlienShoot() {
  const firingAlien = enemiesIndices[Math.floor(Math.random() * enemies.length)]
  alienLaserPosition = firingAlien + width
  $squares.eq(alienLaserPosition).addClass('alienLaser')
  alienLaserPhysics()
}

function checkForAlienShoot() {
  const shootBackProb = Math.random()
  if (shootBackProb < alienDifficulty) {
    handleAlienShoot()
  }
}

function moveMothership() {
  $squares.eq(mothershipPosition).removeClass('mothership')
  mothershipPosition += 1
  $squares.eq(mothershipPosition).addClass('mothership')
  if (mothershipPosition !== width && mothershipDestroyed === false) {
    setTimeout(moveMothership, 250)
  } else {
    $squares.eq(mothershipPosition).removeClass('mothership')
    mothershipTimer = setTimeout(checkForMothership, 15000)
  }
}

function spawnMothership() {
  mothershipDestroyed = false
  mothershipPosition = 0
  $squares.eq(mothershipPosition).addClass('mothership')
  setTimeout(moveMothership, 250)
}

function checkForMothership() {
  const mothershipProb = Math.random()
  if (mothershipProb > 0.6) {
    spawnMothership()
  } else {
    mothershipTimer = setTimeout(checkForMothership, 15000)
  }
}

function laserPhysics() {
  $squares.eq(laserPosition).removeClass('laser')
  laserPosition -= width
  $squares.eq(laserPosition).addClass('laser')
  if (enemiesIndices.includes(laserPosition)){
    handleHit()
  } else if ($squares.eq(laserPosition).hasClass('mothership')) {
    handleMothershipHit()
  } else if (laserPosition > 0) {
    laserTimer = setTimeout(laserPhysics, laserSpeed)
  } else {
    $squares.eq(laserPosition).removeClass('laser')
    clearTimeout(laserTimer)
  }
}

function moveAliensLeft() {
  direction = 'left'
  enemies.forEach(alien => {
    $squares.eq(alien.alienIndex).removeClass(alien.type)
    alien.moveLeft()
  })
  updateIndices()
  enemies.forEach(alien => {
    $squares.eq(alien.alienIndex).addClass(alien.type)
  })
  checkForAlienShoot()
  if(enemiesIndices.includes(width*(alienLineCount-1))) {
    alienLineCount++
    moveAliensDown()
    clearTimeout(leftTimer)
  } else {
    leftTimer = setTimeout(moveAliensLeft, delay)
  }
}

function moveAliensDown () {
  //Check for player loss
  if (enemiesIndices[enemiesIndices.length-1] > (width*(width-2))) {
    gameOver()
  } else {
    //Move each alien down one row
    enemies.forEach(alien => {
      $squares.eq(alien.alienIndex).removeClass(alien.type)
      alien.moveDown()
    })
    updateIndices()
    enemies.forEach(alien => {
      $squares.eq(alien.alienIndex).addClass(alien.type)
    })
    //Switch direction once moved down a row
    switch(direction) {
      case 'right': moveAliensLeft()
        break
      case 'left': moveAliensRight()
        break
    }
  }
}

function updateIndices() {
  enemiesIndices = []
  enemies.forEach(alien => {
    enemiesIndices.push(alien.alienIndex)
  })
}

function moveAliensRight() {
  direction = 'right'
  enemies.forEach(alien => {
    $squares.eq(alien.alienIndex).removeClass(alien.type)
    alien.moveRight()
  })
  updateIndices()
  enemies.forEach(alien => {
    $squares.eq(alien.alienIndex).addClass(alien.type)
  })
  checkForAlienShoot()
  if(enemiesIndices.includes((width*alienLineCount)-1)) {
    alienLineCount++
    moveAliensDown()
    clearTimeout(rightTimer)
  } else {
    rightTimer = setTimeout(moveAliensRight, delay)
  }
}



//INITALISATION FUNCTIONS > These functions either begin the game, or set the state of the gameboard

function spawnAliens() {
  for (let i=0; i < 11; i++) {
    enemies.push(new Alien(i, 30, 'aliens3'))
  }
  for (let i=0; i < 11; i++) {
    enemies.push(new Alien(i+width, 20, 'aliens2'))
  }
  for (let i=0; i < 11; i++) {
    enemies.push(new Alien(i+width*2, 20, 'aliens2'))
  }
  for (let i=0; i < 11; i++) {
    enemies.push(new Alien(i+width*3, 10, 'aliens1'))
  }
  for (let i=0; i < 11; i++) {
    enemies.push(new Alien(i+width*4, 10, 'aliens1'))
  }

  enemies.forEach(alien => {
    $squares.eq(alien.alienIndex).addClass(alien.type)
  })

  setTimeout(checkForMothership, 15000)
}

function handleKeydown(e) {
  switch(e.keyCode) {
    case 37: movePlayerLeft()
      break
    case 39: movePlayerRight()
      break
    case 32: {
      e.preventDefault()
      playerShoot()
      break
    }
    //Case 27 for Development use only. Simulates player death.
    case 27: {
      gameOver()
      break
    }
  }
}

class Alien {
  constructor(alienIndex, points, type) {
    this.alienIndex = alienIndex
    this.points = points
    this.type = type
  }
  moveDown(){
    this.alienIndex = this.alienIndex+width
  }
  moveLeft(){
    this.alienIndex = this.alienIndex-1
  }
  moveRight(){
    this.alienIndex= this.alienIndex+1
  }
}

function initGame() {
  $startScreen = $('.startScreen')
  $startScreen.hide()
  const $endScreen = $('.endScreen')
  $endScreen.hide()

  $grid = $('.grid')
  $grid.show()
  for (let i=0; i<width*width; i++) {
    $grid.append($('<div />'))
  }

  $squares = $grid.find('div')
  $scoreboard = $('.scoreboard')
  score = 0
  $scoreboard.text('Score: ' + score)
  $scoreboard.show()

  playerPosition = (width*width) - (width/2)

  $squares.eq(playerPosition).addClass('player')

  enemies = []
  enemiesIndices = []
  alienLineCount = 1
  clearTimeout(leftTimer)
  clearTimeout(rightTimer)
  clearTimeout(mothershipTimer)
  updateIndices()

  spawnAliens()
  moveAliensRight()
}

function init() {
  $(document).on('keydown', handleKeydown)

  delay = 1000
  alienDifficulty = 0.5

  const $startButton = $('#startButton')
  $startButton.on('click', initGame)
}

//INITIALISATION
$(init)
