var $grid = $('.grid');

function triggerIsotope() {
  if (! $grid) { return; }

  $grid.isotope({
      itemSelector: '.grid-item',
      layoutMode: 'masonry',
      masonry: {
       columnWidth: 0
      }
  });

}

$(document).ready(function(){
  triggerIsotope();
});