const width = 20
let $grid
let $squares
let playerPosition = (width*width) - (width/2)

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

function handleKeydown(e) {
  console.log('Keydown call')
  switch(e.keyCode) {
    case 37: moveLeft()
      break
    case 39: moveRight()
      break
    // case 32: shoot
  }
}

function init() {
  $grid = $('.grid')
  for (let i=0; i<width*width; i++) {
    $grid.append($('<div />'))
  }
  $squares = $grid.find('div')

  $squares.eq(playerPosition).addClass('player')

  $(document).on('keydown', handleKeydown)
  console.log('Init complete')
}

$(init)
