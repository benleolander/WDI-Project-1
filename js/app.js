$(() => {
  const width = 20
  const $grid = $('.grid')
  let $squares

  for (let i=0; i<width*width; i++) {
    $grid.append($('<div />'))
  }
  $squares = $grid.find('div')

  const playerStart = $squares.eq((width*width)-(width/2))

  playerStart.addClass('player')

})
