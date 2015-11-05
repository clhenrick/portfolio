$(document).ready(function(){

  var $grid = $('.grid').isotope({
    itemSelector: '.grid-item',
    layoutMode: 'masonry',
    masonry: {
     columnWidth: 0
    }
  });

  $('#filters').on('click', 'button', function() {
    var filterVal = $(this).attr('data-filter');
    $grid.isotope({ filter: filterVal});
  });

  // shuffles the order of the items
  $grid.isotope('shuffle');

});