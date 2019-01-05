$(() => {
  const width = 10
  const $grid = $('.grid')
  let $squares

  for (let i=0; i<width*width; i++) {
    $grid.append($('<div />'))
  }
  $squares = $grid.find('div')

})
