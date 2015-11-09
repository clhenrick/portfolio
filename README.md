# CLHENRICK
Personal portfolio and blog of Chris Henrick using the [Feeling Resposive](http://phlow.github.io/feeling-responsive/) Jekyll theme. Forked from [Phlow](https://github.com/Phlow/feeling-responsive)

## Migrating Portfolio
1. Edit `assets/data/work.json`
2. Precompile Handlebars templates (see below)
3. Add any necessary images
4. Run Jekyll: `jekyll serve --config _config.yml,_config_dev.yml`

### Precompiling Handlebars
Make sure [Node JS](https://nodejs.org) and [Handlebars](http://handlebarsjs.com/) are installed.

From the root of this repo do: `handlebars _data/item.hbs -f assets/js/work.js -k each`

## Updating
Should be done by creating new posts tagged with `portfolio` in the `_posts/portfolio/` directory.

## TO DO List:
- [ ] Make thumbnails & resize images

- [ ] CV / Resume

- [ ] Talks

- [x] Node JS script to generate posts in `_posts/portfolio/` from `assets/data/work.json`

- [ ] ~~liquid logic to only render blog posts in `_posts/blog/`~~

- [x] liquid logic to create masonry layout from `_posts/portfolio/`

- [ ] move blog posts from chenrickmfadt.wordpress:  
    - see: http://import.jekyllrb.com/docs/wordpress/
    - see: https://wordpress.org/plugins/jekyll-exporter/
    - do: `gem install unidecode sequel mysql2 htmlentities`
    - do: `gem install jekyll-import`
    - see: https://github.com/jekyll/jekyll-import/blob/v0.7.1/lib/jekyll-import/importers/wordpress.rb

- [ ] move site to clhenrick.io(?)

- [ ] forward chrishenrick.com to clhenrick.io(?)

- [ ] add portfolio images for print work
    - [ ] resize existing images to be smaller file size
    - [ ] create thumbnails for them? Probably depends on masonry.js
    
- [ ] add portfolio projects for web work (AIRS, Bushwick, Toxicity Map, etc)

- [ ] create a logo!

- [ ] generate favicons & touch icons from logo using [real favicon generator](http://realfavicongenerator.net/)

- [ ] index with Google’s SEO & custom search

## Deploying Jekyll With Git On A Remote VPS
- https://www.digitalocean.com/community/tutorials/how-to-deploy-jekyll-blogs-with-git
- https://www.digitalocean.com/community/tutorials/how-to-get-started-with-jekyll-on-an-ubuntu-vps

## Helpful Architecture Info:
### jekyll
- http://jekyllrb.com/docs/variables/
- http://pixelcog.com/blog/2013/jekyll-from-scratch-core-architecture/

### Feeling Responsive Jekyll Theme
- https://phlow.github.io/feeling-responsive/
- https://github.com/Phlow/feeling-responsive

### Foundation
- http://foundation.zurb.com/docs/components/grid.html

### Liquid
- https://github.com/Shopify/liquid/wiki/Liquid-for-Designers

### Helpful UI Stuff
#### Favicons & Touch Icons
- https://mathiasbynens.be/notes/touch-icons
- https://css-tricks.com/favicon-quiz/
- http://realfavicongenerator.net/

#### Flexible / Staggered Multiple Column Layouts:  
- http://isotope.metafizzy.co/
- http://masonry.desandro.com/


