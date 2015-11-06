var fs = require('fs'),
      Handlebars = require('handlebars'),
      work = '../assets/data/work.json',
      templateFile = '../_data/item.hbs',
      outTest = 'test.html',
      dataStore = null,
      hbsTemplate = null;

var count = 0;

Handlebars.registerHelper('each', function(context, options) {
  var ret = "";
  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }
  return ret;
});

Handlebars.registerHelper('if', function(conditional, options) {
  if (conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('list', function(items, options){
  var out = "";
  for (var i=0, l=items.length; i<l; i++) {
    out += items[i] + " ";
  }
  return out;
});

function go(file) {
  fs.readFile(file, function(err,data){
    if (err) return console.err(err);
    
    if (file === work) {
      dataStore = JSON.parse(data);  
    } else if (file === templateFile) {
      data = data.toString();
      hbsTemplate = Handlebars.compile(data);
    }

    count ++;

    if (count === 2) {
      console.log('done');
      makeHbs();
    }
  });
}

function makeHbs(){
  // dataStore.work.forEach(function(el,i){
  //   console.log(typeof el);
  //   var html = hbsTemplate(el);
  //   console.log(html);
  // });
  var html = hbsTemplate(dataStore);
  console.log(html);
}

[work, templateFile].forEach(function(el,i){
  go(el);
});