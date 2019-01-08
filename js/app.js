const width = 20
let $grid
let $squares
let $scoreboard
let playerPosition = (width*width) - (width/2)
let laserPosition
let alienLaserPosition
let rightTimer
let leftTimer
let laserTimer
let alienLaserTimer
let direction
const delay = 1000
const laserSpeed = 10
const alienDifficulty = 0.5
let alienLineCount = 1
// let aliens3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
// let aliens2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// let aliens1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const enemies = []
let enemiesIndices= []
let score = 0

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
function checkForWin() {
  if (enemiesIndices.length === 0) {
    $squares.eq(laserPosition).removeClass('laser aliens3')
    alert('Congratulations, you fought off the invasion. Your score is ' + score)
  }
}

function handleHit() {
  const deadAlien = enemies[enemiesIndices.indexOf(laserPosition)]
  score += deadAlien.points
  $scoreboard.text(score)
  $squares.eq(laserPosition).removeClass()
  enemies.splice(enemiesIndices.indexOf(laserPosition), 1)
  updateIndices()
  checkForWin()

  // console.log('hit!')
  // score +=
  // const deadAlien = enemies.indexOf(laserPosition)
}

//GAME FUNCTIONS > These functions control the game elements

function playerHit() {
  alert('You are Dead! Your score is ' + score)
}

function alienLaserPhysics() {
  $squares.eq(alienLaserPosition).removeClass('alienLaser')
  alienLaserPosition += width
  $squares.eq(alienLaserPosition).addClass('alienLaser')
  if (playerPosition === alienLaserPosition) {
    playerHit()
  } else if (alienLaserPosition > width*width) {
    clearTimeout(alienLaserTimer)
  } else {
    alienLaserTimer = setTimeout(alienLaserPhysics, 50)
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

function laserPhysics() {
  $squares.eq(laserPosition).removeClass('laser')
  laserPosition -= width
  $squares.eq(laserPosition).addClass('laser')
  if (enemiesIndices.includes(laserPosition)){
    handleHit()
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
    alert('Game Over! Your score is ' + score)
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
}




// function spawnAliens() {
//   aliens3.forEach(index => {
//     $squares.eq(index).addClass('enemy aliens3')
//   })
//
//   // aliens2.forEach(alien2Index =>
//   //   $squares.eq(alien2Index + width).addClass('enemy aliens2'))
//
//   // aliens2.forEach(alien2Index =>
//   //   $squares.eq(alien2Index + width*2).addClass('enemy aliens2'))
//   //
//   // aliens1.forEach(alien1Index =>
//   //   $squares.eq(alien1Index + width*2).addClass('enemy aliens1'))
//   //REMEBER TO ADJUST THE WIDTH ABOVE TO 3
//   //
//   // aliens1.forEach(alien1Index =>
//   //   $squares.eq(alien1Index + width*4).addClass('enemy aliens1'))
// }

function handleKeydown(e) {
  switch(e.keyCode) {
    case 37: movePlayerLeft()
      break
    case 39: movePlayerRight()
      break
    case 32: playerShoot()
  }
}

class Alien{
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

function init() {
  $grid = $('.grid')
  for (let i=0; i<width*width; i++) {
    $grid.append($('<div />'))
  }
  $squares = $grid.find('div')
  $scoreboard = $('.scoreboard')

  $squares.eq(playerPosition).addClass('player')

  // enemies.push(aliens3, aliens2, aliens1)
  spawnAliens()
  moveAliensRight()

  $(document).on('keydown', handleKeydown)
}

//INITIALISATION
$(init)
