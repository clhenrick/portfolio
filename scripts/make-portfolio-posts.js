var fs = require('fs'),
    Handlebars = require('handlebars'),
    work = '../_data/work.json',
    templateFile = '../_data/portfolio-page.hbs',
    outDir = '../pages/work/',
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
    if (err) return console.error(err);
    
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
  dataStore.work.forEach(function(el,i){
    // console.log(typeof el);
    var name = el.title.toLowerCase().replace(/[^\w\s]/gi, '')
                 .split(' ').join('-') + '.md';
    var permalink = el.title.toLowerCase().replace(/[^\w\s]/gi, '')
                 .split(' ').join('-') + '.html';
    el.permalink = permalink;
    var html = hbsTemplate(el);
    // console.log(name, '\n', html);
    writeMD(name,html);
  });
}

function writeMD(fileName, markup) {
  var writeDir = outDir + fileName;
  fs.writeFile(writeDir,markup,'utf-8', function(err,written,string){
    if (err) { return console.error(err); }
    console.log('wrote: ', fileName);
  });
}

[work, templateFile].forEach(function(el,i){
  go(el);
});