const width = 20
let $grid
let $squares
let playerPosition = (width*width) - (width/2)
const aliens3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const aliens2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const aliens1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function moveLeft() {
  if(playerPosition > (width*width)-width) {
    $squares.removeClass('player')
    playerPosition--
    $squares.eq(playerPosition).addClass('player')
  }
}

function moveRight() {
  if(playerPosition < (width*width)-1) {
    $squares.removeClass('player')
    playerPosition++
    $squares.eq(playerPosition).addClass('player')
  }
}

function spawnAliens() {
  aliens3.forEach(alien3Index =>
    $squares.eq(alien3Index).addClass('enemy aliens3'))

  aliens2.forEach(alien2Index =>
    $squares.eq(alien2Index + width).addClass('enemy aliens2'))

  aliens2.forEach(alien2Index =>
    $squares.eq(alien2Index + width*2).addClass('enemy aliens2'))

  aliens1.forEach(alien1Index =>
    $squares.eq(alien1Index + width*3).addClass('enemy aliens1'))

  aliens1.forEach(alien1Index =>
    $squares.eq(alien1Index + width*4).addClass('enemy aliens1'))
}

function handleKeydown(e) {
  // console.log('Keydown call')
  switch(e.keyCode) {
    case 37: moveLeft()
      break
    case 39: moveRight()
      break
    case 32: console.log('Shots fired!')
  }
}

function init() {
  $grid = $('.grid')
  for (let i=0; i<width*width; i++) {
    $grid.append($('<div />'))
  }
  $squares = $grid.find('div')

  $squares.eq(playerPosition).addClass('player')

  spawnAliens()

  $(document).on('keydown', handleKeydown)
  // console.log('Init complete')
}

$(init)
