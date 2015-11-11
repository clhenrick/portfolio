$(document).ready(function(){

  var $grid = $('.grid');

  function initMasonry() {
    $grid.isotope({
      itemSelector: '.grid-item',
      layoutMode: 'packery',
      packery: {
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        percentPosition: true
      }
    });

    // layout Isotope after all images have loaded
    $grid.imagesLoaded(function() {
      $grid.isotope({
        itemSelector: '.grid-item',
        layoutMode: 'packery',
        packery: {
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer',
          percentPosition: true
        }
      });
    });

    $('#filters').on('click', 'button', function() {
      var filterVal = $(this).attr('data-filter');
      $grid.isotope({ filter: filterVal});
      $grid.isotope('shuffle');
      
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

  }
  
  initMasonry();
});