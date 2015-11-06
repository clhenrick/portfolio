$(document).ready(function(){

  var $grid = $('.grid');

  function initMasonry() {
    $grid.isotope({
      itemSelector: '.grid-item',
      layoutMode: 'packery',
      packery: {
        columnWidth: '.grid-sizer',
        percentPosition: true
      }
    });

    // layout Isotope after all images have loaded
    // $grid.imagesLoaded(function() {
    //   $grid.isotope({
    //     //options
    //   });
    // });

    $('#filters').on('click', 'button', function() {
      var filterVal = $(this).attr('data-filter');
      $grid.isotope('shuffle');
      $grid.isotope({ filter: filterVal});
    });

    $('.shuffle').on('click', function() {
      $grid.isotope('shuffle');  
    });

    // shuffles the order of the items
    $grid.isotope('shuffle');
  }
  
  initMasonry();
});