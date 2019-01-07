const width = 20
let $grid
let $squares
let $scoreboard
let playerPosition = (width*width) - (width/2)
let laserPosition
let rightTimer
let leftTimer
let laserTimer
let direction
const delay = 1000
const laserSpeed = 10
let alienLineCount = 1
let aliens3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
// let aliens2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// let aliens1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// let enemies = []
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
  if (aliens3.length === 0) {
    $squares.eq(laserPosition).removeClass('laser aliens3')
    alert('Congratulations, you fought off the invasion. Your score is ' + score)
  }
}

function handleHit() {
  score += 10
  $scoreboard.text(score)
  $squares.eq(laserPosition).removeClass('laser aliens3')
  const deadAlien = aliens3.indexOf(laserPosition)
  aliens3.splice(deadAlien, 1)
  checkForWin()
}

//GAME FUNCTIONS > These functions control the game elements
function laserPhysics() {
  $squares.eq(laserPosition).removeClass('laser')
  laserPosition -= width
  $squares.eq(laserPosition).addClass('laser')
  if (aliens3.includes(laserPosition)){
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
  aliens3.forEach(index => {
    $squares.eq(index).removeClass('enemy aliens3')
  })
  aliens3 = aliens3.map(element => {
    return element -1
  })
  aliens3.forEach(index => {
    $squares.eq(index).addClass('enemy aliens3')
  })
  if(aliens3.includes(width*(alienLineCount-1))) {
    alienLineCount++
    moveAliensDown()
    clearTimeout(leftTimer)
  } else {
    leftTimer = setTimeout(moveAliensLeft, delay)
  }
}

function moveAliensDown () {
  //Check for player loss
  if (aliens3[aliens3.length-1] > (width*(width-2))) {
    alert('Game Over! Your score is ' + score)
  } else {
    //Move each alien down one row
    aliens3.forEach(index => {
      $squares.eq(index).removeClass('enemy aliens3')
    })
    aliens3 = aliens3.map(element => {
      return element + width
    })
    aliens3.forEach(index => {
      $squares.eq(index).addClass('enemy aliens3')
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


function moveAliensRight() {
  direction = 'right'
  aliens3.forEach(index => {
    $squares.eq(index).removeClass('enemy aliens3')
  })
  aliens3 = aliens3.map(element => {
    return element + 1
  })
  aliens3.forEach(index => {
    $squares.eq(index).addClass('enemy aliens3')
  })
  if(aliens3.includes((width*alienLineCount)-1)) {
    alienLineCount++
    moveAliensDown()
    clearTimeout(rightTimer)
  } else {
    rightTimer = setTimeout(moveAliensRight, delay)
  }
}

//INITALISATION FUNCTIONS > These functions either begin the game, or set the state of the gameboard
function spawnAliens() {
  aliens3.forEach(index => {
    $squares.eq(index).addClass('enemy aliens3')
  })

  // aliens2.forEach(alien2Index =>
  //   $squares.eq(alien2Index + width).addClass('enemy aliens2'))

  // aliens2.forEach(alien2Index =>
  //   $squares.eq(alien2Index + width*2).addClass('enemy aliens2'))
  //
  // aliens1.forEach(alien1Index =>
  //   $squares.eq(alien1Index + width*2).addClass('enemy aliens1'))
  //REMEBER TO ADJUST THE WIDTH ABOVE TO 3
  //
  // aliens1.forEach(alien1Index =>
  //   $squares.eq(alien1Index + width*4).addClass('enemy aliens1'))
}

function handleKeydown(e) {
  switch(e.keyCode) {
    case 37: movePlayerLeft()
      break
    case 39: movePlayerRight()
      break
    case 32: playerShoot()
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
