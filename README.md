# Portfolio
Personal portfolio and blog of Chris Henrick using the [Feeling Resposive](http://phlow.github.io/feeling-responsive/) Jekyll theme with some added style tweaks (dark theme) and personal touches. Forked from [Phlow](https://github.com/Phlow/feeling-responsive).

This site is live at [clhenrick.io](http://clhenrick.io).

## Develop
Make sure you have Ruby and Jekyll installed.

To run this site in a Jekyll dev environment, from the root of this repo do:

```bash
jekyll serve --config _config.yml,_config_dev.yml
```

## Deploy
Note that this site is not being hosted on Github Pages but on a remote VPS via Digital Ocean.

```bash
# list remotes
$ git remote -v
droplet	user@myvps:projects/clhenrick.io.git (fetch)
droplet	user@myvps:projects/clhenrick.io.git (push)
origin	https://github.com/clhenrick/portfolio.git (fetch)
origin	https://github.com/clhenrick/portfolio.git (push)

# to push to the remote vps and trigger the rebuild do
$ git push droplet master
```

## Creating the Portfolio
To migrate work from an [existing portfolio](http://chrishenrick.com), I created `JSON` data containing information for each project. This data lives in `_data/work.json`. A [Node.JS script](./scripts/make-portfolio-posts.js) generates a markdown file for each project and creates the portfolio overview page in `./work/`.

Updating the portfolio works like this:  

1. Edit `_data/work.json` as needed.
2. `cd scripts/ && npm install`
3. from the `scripts/` dir do `node make-portfolio-posts.js`

## Adding a New Project
To add a new project add a new object entry to the `work` array in `_data/work.json` containing the following attributes:

- "title" : required: title of the project
- "tags" : an array of relevant tags
- "description" : a short description shown in `/work/`
- "description_long" : a long description shown in the corresponding project page
- "thumb" : required: thumb nail image
- "tech" : an array containing the names of whatever tech was used
- "video" : an object containing the following if the project has a video
  - "url" : link to a video if the project has one  
    ( eg: "https://vimeo.com/81728484")
  - "embed" : link to the embed url for the video  
    (eg: "https://player.vimeo.com/video/81728484")
- "imgs" : required: an array of any images associated with the project
- "size" : size to give to the project that corresponds to a `CSS` class
  (depreciated / unnecessary)
- "date" : date the project was created in the format of Year-Month-Day, eg: "2014-11-02"

Then `cd` to the `scripts` dir and do `node make-portfolio-pages.js`

## TO DO List:
- [x] Make thumbnails & resize images

- [x] Make portfolio mobile friendly

- [x] add presentations as a git sub-module

- [x] add CV / Resume

- [x] add Talks

- [x] Node JS script to generate posts in `_posts/portfolio/` from `assets/data/work.json`

- [x] ~~liquid logic to only render blog posts in `_posts/blog/`~~

- [x] liquid logic to create masonry layout from `_posts/portfolio/`

- [ ] move blog posts from chenrickmfadt.wordpress:  
    - see: http://import.jekyllrb.com/docs/wordpress/
    - see: https://wordpress.org/plugins/jekyll-exporter/
    - do: `gem install unidecode sequel mysql2 htmlentities`
    - do: `gem install jekyll-import`
    - see: https://github.com/jekyll/jekyll-import/blob/v0.7.1/lib/jekyll-import/importers/wordpress.rb

- [x] move site to clhenrick.io(?)

- [ ] ~~forward chrishenrick.com to clhenrick.io(?)~~

- [x] add portfolio images for print work
    - [x] resize existing images to be smaller file size
    - [x] create thumbnails for them? Probably depends on masonry.js

- [x] add portfolio projects for web work (AIRS, Bushwick, Toxicity Map, etc)

- [ ] create a logo!

- [ ] generate favicons & touch icons from logo using [real favicon generator](http://realfavicongenerator.net/)

- [x] index with Google’s SEO & custom search using sitemap.xml

## Helpful Architecture Info:
Some resources that helped me with developing this portfolio & blog site:

### Deploying Jekyll With Git On A Remote VPS
- https://www.digitalocean.com/community/tutorials/how-to-deploy-jekyll-blogs-with-git
- https://www.digitalocean.com/community/tutorials/how-to-get-started-with-jekyll-on-an-ubuntu-vps

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
