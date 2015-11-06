$(document).ready(function(){

  var $grid = $('.grid');

  function loadWork() {
    // get the Handlebars template
    var template = Handlebars.templates["item.hbs"];
    
    // feed it some JSON
    $.getJSON('../assets/data/work.json', function(data) {
      console.log(data.work);
      var markup = template(data);
      $("#target").html(markup);
      initMasonry();
    });
  }

  function initMasonry() {
    $grid.isotope({
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
  }
  
  loadWork();
});