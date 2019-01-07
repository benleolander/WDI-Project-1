const width = 20
let $grid
let $squares
let playerPosition = (width*width) - (width/2)
let laserPosition
let rightTimer
let leftTimer
let laserTimer
let direction
const delay = 400
const laserSpeed = 50
// let $enemies = []
let alienLineCount = 1
let aliens3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// const aliens2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// const aliens1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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

function handleHit() {
  console.log('hit')
}

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
  aliens3.forEach(index => {
    $squares.eq(index).removeClass('enemy aliens3')
  })
  aliens3 = aliens3.map(element => {
    return element + width
  })
  aliens3.forEach(index =>
    $squares.eq(index).addClass('enemy aliens3'))
  switch(direction) {
    case 'right': moveAliensLeft()
      break
    case 'left': moveAliensRight()
      break
  }
}


//REFACTOR THIS LIKE THE OTHERS TO USE MAP
function moveAliensRight() {

  direction = 'right'

  aliens3.forEach(index =>
    $squares.eq(index).removeClass('enemy aliens3'))

  const nextIndex = aliens3.shift()
  aliens3.push(nextIndex + 11)

  aliens3.forEach(index =>
    $squares.eq(index).addClass('enemy aliens3'))

  if(aliens3.includes((width*alienLineCount)-1)) {
    alienLineCount++
    moveAliensDown()
    clearTimeout(rightTimer)
  } else {
    rightTimer = setTimeout(moveAliensRight, delay)
  }
}

function spawnAliens() {
  aliens3.forEach(index => {
    $squares.eq(index).addClass('enemy aliens3')
  })
  //
  // aliens2.forEach(alien2Index =>
  //   $squares.eq(alien2Index + width).addClass('enemy aliens2'))
  //
  // aliens2.forEach(alien2Index =>
  //   $squares.eq(alien2Index + width*2).addClass('enemy aliens2'))
  //
  // aliens1.forEach(alien1Index =>
  //   $squares.eq(alien1Index + width*3).addClass('enemy aliens1'))
  //
  // aliens1.forEach(alien1Index =>
  //   $squares.eq(alien1Index + width*4).addClass('enemy aliens1'))
}

function handleKeydown(e) {
  // console.log('Keydown call')
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
  // $enemies = $('.enemy')

  $squares.eq(playerPosition).addClass('player')

  spawnAliens()
  moveAliensRight()

  $(document).on('keydown', handleKeydown)
  // console.log('Init complete')
}

$(init)
