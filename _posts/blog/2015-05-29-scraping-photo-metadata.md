---
title: Scraping Photo Metadata
layout: page
date: 2015-05-29
teaser: "Scraping digital photo exif data using Node JS for web mapping."
subheadline: ""
tags: 
    - data 
    - web-scraping 
    - node-js 
    - web-mapping 
    - flickr-api 
    - cartodb
---

Now that my time as a grad student at the [Parsons MFA Design and Technology program](http://www.newschool.edu/parsons/mfa-design-technology/) is finished, I've finally had some time to come back to a project I worked on in the fall of last year, the [Bushwick Community Map](http://www.bushwickcommunitymap.org). One important piece that has yet to be added to this project is data that was collected from a participatory mapping survey developed with the [North West Bushwick Community Group](http://www.nwbcommunity.org/) and students from the [Parsons Urban Ecologies program](http://www.newschool.edu/parsons/ms-design-urban-ecology/) last Fall. The survey involved mapping landuse in [Bushwick](http://en.wikipedia.org/wiki/Bushwick,_Brooklyn) (eg: vacant lots and lots being used for informal purposes), abandoned buildings, and new construction. This data was collected as teams walked through the various census tracts in Bushwick, making observations on each block, and then filling out a form describing either a lot or building, recording the address, number of floors, state of distress, etc as well as photographing the site. 

## Data Problems
While each photo was taken with geo location tracking enabled, there was some poor management of the photographs collected by various teams. Granted the photos were logically grouped by census tract in folders on Google Drive, yet no unified naming convention was used to name the photographs. 

![]({{site.urlimg}}photo-naming.png)

For example, a sensible naming convention could have been something like:  

{% highlight bash %}
<building-number>-<street>-<census-tract>.jpg
{% endhighlight %}

The way in which the Urban Ecologies students then mapped the photos after they were collected was using Google Earth to produce a KML file of the photos' locations. The problem with this approach is that for some reason unknown to me, the KML they produced only has ~700 features while there are a total of 1008 photos. I didn't learn this until after the Urban Ecologies group shared then survey data, KML, and photos with me. 

![]({{site.urlimg}}bushwick_photos_qgis.png)

To make working with the photos easier I first uploaded all 1008 photos to [Flickr](https://www.flickr.com/) which genorously gives all users a whole terabyte of free storage. I then used the [Flickr API](https://www.flickr.com/services/api/) to [grab the URLs and title for each uploaded photo](#flickr-api-code) and store them in a JSON file. For some reason I wasn't able to see the geo data for the photos using this method which definitely would have helped save some time. 

My original solution was to merge all the layers in the KML file, then convert it to a GeoJSON format and then join it to the Flickr JSON data using the [joiner](https://www.npmjs.com/package/joiner) module for Node JS. Yet I soon realized this was not a good strategy as the KML file was missing locations for ~300 photos. 

Thankfully one last solution occured to me; I could scrape the [Exif metadata](http://en.wikipedia.org/wiki/Exchangeable_image_file_format) from the photos which includes latitude and longitude coordinates (only if geolocation was enabled from the camera). 

The question was, how to do this?

## Node JS to the Rescue

I ended up finding a Node JS library that worked pretty well called [Exif](https://github.com/gomfunkel/node-exif). This module allows to retreive the Exif metadata in a JSON format. From here I [wrote a script](#exif-data-extract) that iterates over the Exif data from all of the photos and outputs a GeoJSON file which I was then able to join to the Flickr JSON data. I ended up doing the join in [CartoDB](https://cartodb.com/) because they make it so easy to do.

The end result is that I successfully geocoded 1006 out of 1008 of the photos so that they can now be added to the Bushwick Community Map. 

![]({{site.urlimg}}bushwick_final_data_cartodb.png)

Next up, integrating the survey photos and data to the Bushwick Community Map!

##Code:
### SQL to parse photo title from file name:
In CartoDB I eneded up creating a new column for the exif geojson and populating it with a substring of the filename, the title without the file extension, so that I could join the Exif GeoJSON and Flickr JSON datasets.  
The following query did the trick:  

{% highlight sql %}
SELECT substring(file_name_column, '(.+?)(\.[^.]*$|$)') FROM table_name;
{% endhighlight %}

[stackoverflow credit](http://stackoverflow.com/questions/624870/regex-get-filename-without-extension-in-one-shot)


###Exif Data Extract
Node JS script to grab lat lon data from images. Processes a director of images and writes a geojson file containing the image name, lat, lon, modify data. Usage: {% highlight bash %} $ touch photo_data.json && node parse_photos.js > photo_data.json {% endhighlight %}


{% highlight javascript %}
var fs = require('graceful-fs');
var ExifImage = require('exif').ExifImage;
var exifCount = 0;
var imgDir = path.join(__dirname, '../all_photos/');
var imgData = {
                "type" : "FeatureCollection",
                "crs": {
                  "type": "name",
                  "properties": {
                    "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
                  },
                "features" : []
              };
var errors = [];

// converts lat lon from Degrees Minutes Seconds to Decimal Degrees
function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

function parseExifData(exifObj, name) {
  var data = {
                "type" : "Feature",
                "geometry" : {
                  "type" : "Point",
                  "coordinates" : []
                },
                "properties" : {}
              };
  var d = exifObj;  
  var imgName = name.split('/')
  data.properties.file_name = imgName[imgName.length-1];
  data.coordinates[1] = convertDMSToDD(
                            d.gps.GPSLatitude[0],
                            d.gps.GPSLatitude[1],
                            d.gps.GPSLatitude[2],
                            d.gps.GPSLatitudeRef
                            );
  data.coordinates[0] = convertDMSToDD(
                            d.gps.GPSLongitude[0],
                            d.gps.GPSLongitude[1],
                            d.gps.GPSLongitude[2],
                            d.gps.GPSLongitudeRef
                            );
  data.properties.modify_date = d.image.ModifyDate;
  imgData.features.push(data);
  exifCount ++;

  if (exifCount === 1006) {
    imgData = JSON.stringify(imgData);
    errors = JSON.stringify(errors);
    console.log(imgData);
  }
}

function readImage(img) {
  try {
      new ExifImage({ image : img }, function (error, exifData) {
          if (error)            
            errors.push({name: img, err: error.message});
          else
            parseExifData(exifData, img);
      });
  } catch (error) {      
      errors.push({name: img, err: error.message});
  }  
}

function readDataDir(path) {
  var files = fs.readdirSync(path);
  var count = 0;
  files.forEach(function(file,i){
    file = '../all_photos/' + file;
    readImage(file);
    count++
  });
}

readDataDir('../all_photos/');
{% endhighlight %}

### Flickr API Code
Node JS script to grab data from the Flickr API.

{% highlight javascript %}
var fs = require('fs'),
      jf = require('jsonfile'),
      Flickr = require('flickrapi'),
      async = require('async'),
      joiner = require('joiner'),
      GeoJson = require('geojson');

var flickrOptions = {
      api_key: "...",
      secret: "...",
      user_id: "..."
    };

var newGeoJson;

function callFlickrAPI() {

  var count = 0;
  var data = [];

  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    for (var i=1; i<4; i++) {
      flickr.photos.search({
        user_id: flickr.options.user_id,
        page: i,
        per_page: 500,
        extras: "url_m"
      }, 

      function(err, result) {
        
        if (err) { console.log('error: ', err); return; }              
        
        var photos = result.photos.photo;

        for (var j=0; j< photos.length; j++) {
          data.push(photos[j]);
          count ++;
        }

        if (count === 1008) {
          processJson(data);
        }        

      });  
    }      
  });
}

function processJson(data) {
  var i = 0,
        o = [];
  for (i; i < data.length; i++) {
    o.push({
      title : data[i].title,
      url : data[i].url_m
    });
  }
  jf.writeFile('flickrPhotoData.json', o, function(err) {
    if (err) { console.log('error: ', err); }
  })
  joinJson(o);
}

function joinJson(data) {
  var data_a = newGeoJson,
        data_b = data,
        key_a = 'name',
        key_b = 'title',
        data_joined = joiner.geoJson(data_a, key_a, data_b, key_b, 'properties');
  writeJson(data_joined);
}

function writeJson(data) {
  var file = "flickrData.json";
  jf.writeFile(file, data, function(err) {
    if (err) { console.log('writeJson error: ', err); return;}
    console.log('data written. report: ', data.report.prose.summary);
  })
}

function processGeoJson() {
  var inputGeoJson = JSON.parse(fs.readFileSync('../data/nwb_photos.geojson'));
  var jsonOut = [];
  for (var i = 0; i<inputGeoJson.features.length; i++) {
    jsonOut.push({
      name : inputGeoJson.features[i].properties.Name,
      lat : inputGeoJson.features[i].geometry.coordinates[1],
      lon : inputGeoJson.features[i].geometry.coordinates[0]
    });
    // console.log(inputGeoJson.features[i].geometry.coordinates);
  }
  
  newGeoJson = GeoJson.parse(jsonOut, {Point: ['lat', 'lon'], include: ['name']});
  callFlickrAPI();
}

processGeoJson();
{% endhighlight %}