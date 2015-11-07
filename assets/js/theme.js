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
      
      if (!$(this).hasClass('shuffle')){
        $('#filters > button').removeClass('active');
        $(this).addClass('active');
      }
    });

    $('.shuffle').on('click', function() {
      $('#filters > button').removeClass('active');
      $('button.all').addClass('active');
      $grid.isotope('shuffle');  
    });

    // shuffles the order of the items
    $grid.isotope('shuffle');
  }
  
  initMasonry();
});