(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['item.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=container.escapeExpression;

  return "<div class=\"grid-item "
    + alias3(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"size","hash":{},"data":data}) : helper)))
    + "  "
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.tags : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n  <a href=\""
    + alias3(((helper = (helper = helpers["post-url"] || (depth0 != null ? depth0["post-url"] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"post-url","hash":{},"data":data}) : helper)))
    + "\">\n    <img class=\"item-img\" src=\"\">\n  </a>\n  <div class=\"item-meta\">\n    <a href=\""
    + alias3(((helper = (helper = helpers["post-url"] || (depth0 != null ? depth0["post-url"] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"post-url","hash":{},"data":data}) : helper)))
    + "\">\n      <h4 class=\"item-title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\n    </a>\n    <p class=\"item-description\">"
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\n  </div>\n</div>  \n";
},"2":function(container,depth0,helpers,partials,data) {
    return " "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + " ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.work : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();