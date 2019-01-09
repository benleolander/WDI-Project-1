const width = 20
let $grid
let $squares
let $scoreboard
let $wavecount
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
let firingDelay = false
const laserSpeed = 10
let alienDifficulty
let alienLineCount = 1
let enemies = []
let enemiesIndices= []
let wave
let score

//AUDIO VARIABLES
const shootSound = new Audio('./assets/sounds/shoot.wav')
const mothershipMoveSound = new Audio('./assets/sounds/ufo_highpitch.wav')
const mothershipDeathSound = new Audio('./assets/sounds/explosion.wav')
const alienDeathSound = new Audio('./assets/sounds/invaderkilled.wav')
const alienMoveSound = new Audio('./assets/sounds/fastinvader2.wav')


//SCOREBOARD > These functions manage the scoreboard & high score table

function displayHighScores() {
  $endScreen.empty()
  $endScreen.append('<h3>High Scores</h3>'.toUpperCase())
  for (let i=0; i<highScores.length; i++) {
    $endScreen.append('<p class="scoreBoardName">'+highScores[i].userName.toUpperCase()+'<span class="scoreBoardScore">'+highScores[i].score+'</span></p>')


  }
}

function submitHighScore() {
  const newHighScore = new highScore(highScoreUserName, score)
  for(let i=0; i<highScores.length; i++) {
    if (score > highScores[i].score) {
      highScores.splice(i, 0, newHighScore)
      highScores.pop()
      localStorage.setItem('scores', JSON.stringify(highScores))
      displayHighScores()
      break
    }
  }
}

function  saveHighScore() {
  $endScreen.empty()
  $endScreen.append('<form class="highScoreForm"><input type="text" name="userName" placeholder ="NAME"><br><input type="submit" value="Submit"></form>')

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

//DEV ONLY > This function fills the scoreboard with placeholder data. Should be called from the console to overwrite user local storage. Will erase any saved high scores.
function overwriteScoreboard() {
  highScores = []
  highScores.push(new highScore('BEN', 1000))
  highScores.push(new highScore('BEN', 900))
  highScores.push(new highScore('BEN', 800))
  highScores.push(new highScore('BEN', 700))
  highScores.push(new highScore('BEN', 600))
  highScores.push(new highScore('BEN', 500))
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
  shootSound.play()
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
    wave++
    $wavecount.text('Wave: ' + wave)
    $squares.eq(laserPosition).removeClass('laser')
    setTimeout(levelUp, 2000)
  }
}

function handleMothershipHit() {
  score += 250
  mothershipDestroyed = true
  mothershipDeathSound.play()
  $scoreboard.text('Score: ' + score)
}

function handleHit() {
  const deadAlien = enemies[enemiesIndices.indexOf(laserPosition)]
  score += deadAlien.points
  $scoreboard.text('Score: ' + score)
  $squares.eq(laserPosition).removeClass()
  enemies.splice(enemiesIndices.indexOf(laserPosition), 1)
  updateIndices()
  alienDeathSound.currentTime = 0
  alienDeathSound.play()
  checkForWin()
}

//GAME FUNCTIONS > These functions control the game elements

function gameOver() {
  clearTimeout(leftTimer)
  clearTimeout(rightTimer)
  clearTimeout(mothershipTimer)
  $grid.hide()
  $scoreboard.hide()
  $wavecount.hide()
  $endScreen = $('.endScreen')
  $endScreen.show()
  $grid.empty()
  const $restartButton = $('#restartButton')
  $restartButton.on('click', initGame)
  const $finalScore = $('#finalScore')
  $finalScore.text('Score: ' + score)
  const $finalWave = $('#finalWave')
  $finalWave.text('Cleared Waves: ' + (wave-1))

  if (score > (highScores[highScores.length-1].score)) {
    $finalWave.append('<p class="flash">You got a high score!</p>')
    $restartButton.hide()
    $finalWave.append('<button id="saveHighScore">Save Score</button>')
    const $saveScoreButton = $('#saveHighScore')
    $saveScoreButton.on('click', saveHighScore)
  }
}

function alienLaserPhysics() {
  $squares.eq(alienLaserPosition).removeClass('alienLaser')
  alienLaserPosition += width
  $squares.eq(alienLaserPosition).addClass('alienLaser')
  if (playerPosition === alienLaserPosition) {
    mothershipMoveSound.pause()
    mothershipMoveSound.currentTime = 0
    mothershipDeathSound.play()
    gameOver()
  } else if (alienLaserPosition > width*width) {
    $squares.eq(alienLaserPosition).removeClass('alienLaser')
    clearTimeout(alienLaserTimer)
    removeLasers()
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
  mothershipMoveSound.currentTime = 0
  mothershipMoveSound.play()
  $squares.eq(mothershipPosition).addClass('mothership')
  if (mothershipPosition !== width && mothershipDestroyed === false) {
    setTimeout(moveMothership, 200)
  } else {
    $squares.eq(mothershipPosition).removeClass('mothership')
    mothershipTimer = setTimeout(checkForMothership, 15000)
  }
}

function spawnMothership() {
  mothershipDestroyed = false
  mothershipPosition = 0
  $squares.eq(mothershipPosition).addClass('mothership')
  setTimeout(moveMothership, 200)
}

function checkForMothership() {
  const mothershipProb = Math.random()
  if (mothershipProb > 0) {
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
    $squares.eq(laserPosition).removeClass('laser')
    handleHit()
  } else if ($squares.eq(laserPosition).hasClass('mothership')) {
    $squares.eq(laserPosition).removeClass('laser')
    handleMothershipHit()
  } else if (laserPosition > 0) {
    laserTimer = setTimeout(laserPhysics, laserSpeed)
  } else {
    $squares.eq(laserPosition).removeClass('laser')
    clearTimeout(laserTimer)
    removeLasers()
  }
}

function removeLasers() {
  $squares.removeClass('laser alienLaser')
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

function setFiringDelayFalse() {
  firingDelay = false
}

function handleKeydown(e) {
  switch(e.keyCode) {
    case 37: movePlayerLeft()
      break
    case 39: movePlayerRight()
      break
    case 32: {
      e.preventDefault()
      if (!firingDelay){
        firingDelay = true
        playerShoot()
        setTimeout(setFiringDelayFalse, 400 )
        break
      } break
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
    alienMoveSound.play()
    this.alienIndex = this.alienIndex+width
  }
  moveLeft(){
    alienMoveSound.play()
    this.alienIndex = this.alienIndex-1
  }
  moveRight(){
    alienMoveSound.play()
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
  $wavecount = $('.wavecount')
  wave = 1
  $wavecount.text('Wave: ' + wave)
  $wavecount.show()

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
