---
title: "Data Processing for Am I Rent Stabilized?"
layout: page
#date: # to do: back date
teaser: "Documenting the process of creating the data that is used by amirentstabilized.com"
header: no
comments: true
tags:
  - Javascript
  - Handlebars JS
  - SQL
  - CARTO
---

![]({{site.urlimg}}airs_landing_page.png)

## Introduction
*__Note:__ This post originally appeared in CARTO's [Map of the Week, on
May 22, 2015](https://carto.com/blog/rent). I've updated and edited it to
reflect changes in the project since then. Also note that CARTO renamed / rebranded
them self, they were formally CartoDB.*

[*Am I Rent Stabilized?*](https://amirentstabilized.com) is a web application that encourages New York City tenants to find out if their landlord may be illegally overcharging them for a rent stabilized apartment and if so, motivates them to take action. The development of the app was motivated by the lack of enforcement of rent regulation laws in NYC by the local and state government. It is an attempt at using open data as a prompt for civic action, rather than solely for visualization and analysis. The app first asks the user to input their address and borough, then checks it against a database of properties that are likely to have rent stabilized apartments. From there the app recommends a course of action and informs the user of their nearest tenants rights group so they may get help. *Am I Rent Stabilized* features a responsive UI that is mobile friendly, and its entire content can be toggled to either Spanish or Chinese for non-English speakers. You may read more about in a [separate article I wrote for Urban Omnibus](http://urbanomnibus.net/2015/05/using-open-data-to-strengthen-tenants-rights-activism/), an online publication by the NYC Architectural League.   

## DHCR & MapPLUTO Data Processing
*Am I Rent Stabilized?* uses data I created that lives on [CARTO](https://carto.com) which enables the website to work as a fully functional web-app via CARTO's SQL API and the CARTO.JS library. Below, I'll outline the data processing steps that I performed. Typically when working with large datasets that I only need a subset of or want to aggregate, I'll process the data locally so that I don't need to use as much disk space on my CARTO account.

#### 1. Processing the DHCR Rent Stabilized Building List
Excel workbooks obtained from a [Freedom of Information Law request](https://www.dos.ny.gov/coog/freedomfaq.html) that I made to the NYC Department of Housing and Community Renewal were normalized, stacked, and converted to a Comma Separated Value (CSV) file format using a [Node JS script](https://github.com/clhenrick/dhcr-rent-stabilized-data/blob/master/index.js). This made it easier to batch geocode and then import the data into a local PostgreSQL and PostGIS enabled database where it could be joined to and then analyzed with the [NYC MapPLUTO tax lot Shapefile data](http://www.nyc.gov/html/dcp/html/bytes/applbyte.shtml#pluto).

#### 2. Grabbing BBLs for the DHCR data
I wrote a [Python script](https://github.com/clhenrick/dhcr-rent-stabilized-data/blob/master/scripts/geocode-dhcr-list.py) to obtain values for each property's Borough - Block - Lot number (BBL), Building Identification Number (BIN), and latitude - longitude coordinates via the [NYC GeoClient API](https://developer.cityofnewyork.us/api/geoclient-api). A property's street address and borough are passed to the GeoClient API which then returns the relevant information about the property such as the BBL, BIN, latitude and longitude values. The GeoClient API is a must use if you're geocoding address data in NYC as it's more accurate and robust than Google Map's geocoder and works well for [really wonky addresses in Queens](http://gothamist.com/2011/08/21/does_queens_still_need_hyphenated_a.php).

It's important to note that BBLs from the DHCR data won't match the MapPLUTO BBL's 100% of the time.
This is because BBLs often change: for example two tax lots may be merged into a single lot
for a new building that covers both lots. From what I've learned via the super friendly and knowledgable
[Colin Reilly](https://twitter.com/ColinReillyNY) of NYC DoITT, there is often discrepancy between
BBLs in various NYC government departments. The NYC GeoClient API (probably) has the latest
and most up to date BBLs as it's run and used by the NYC Planning Department. The MapPLUTO
data is also created by NYC Planning, but only gets updated or released to the public a couple
times a year. As a result there will inevitably be discrepancies between BBLs returned by
the GeoClient API and those in the MapPLUTO tax lot Shapefiles.

#### 3. Determining NYC Properties That Are Likely Rent Stabilized
After processing and geocoding the DHCR data it was imported into a PostgreSQL
database using [csvkit](https://csvkit.readthedocs.io/en/540/)'s `csvsql` command as follows:

{% highlight bash %}
$ csvsql --db:///nyc_airs --insert dhcr_rs_geocoded.csv --table dhcr_rs
{% endhighlight %}

The MapPLUTO Shapefiles were imported into Postgres. As they come separate for each
borough, I first merged them using a OGR2OGR bash script, then imported them in Postgres via PostGIS's
`shp2pgsql`.

{% highlight bash %}
#!/bin/bash
# path to output merged shapefile
file='/Users/clhenrick/data/nyc/map_pluto/all_map_pluto_2014v2.shp'

# iterate over directories containing each borough's shapefile
#
for i in `find . -name '*MapPLUTO*.shp'`;
do

if [ -f "$file" ]
  then
    # merge the shape files into one for all of nyc
    echo "transforming and merging $i"
    ogr2ogr \
      -f 'ESRI Shapefile' \
      -s_srs EPSG:2263 \
      -t_srs EPSG:4326 \
      -update -append $file $i \
      -nln all_map_pluto_2014v2
  else
    # create the file to merge to, re-projecting original data from NY Long Island State Plane to WGS84
    echo "creating $file"
    ogr2ogr \
      -f 'ESRI Shapefile' \
      -s_srs EPSG:2263 \
      -t_srs EPSG:4326 \
      $file $i
fi

done
{% endhighlight %}

Then import the combined Shapefile into a PostGIS enabled PostgreSQL database via
`shp2pgsql` and `psql`:

{% highlight bash %}
$ shp2pgsql \
  -I \
  -s 4326 \
  all_map_pluto_2014v2.shp \
  map_pluto2014v2 > map_pluto2014v2.sql
$ psql -d nyc_airs -f map_pluto2014v2.sql
{% endhighlight %}

The data can now be analyzed to create the output data which *Am I Rent Stabilized* uses.
[Here is a link to the entire SQL code](https://github.com/clhenrick/dhcr-rent-stabilized-data/blob/master/scripts/select_pluto_from_dhcr.sql),
but I'll go over it here step by step below.

First, I wrote some simple `SELECT` queries get an idea of what I was looking for.
Here I select the number of properties in both the DHCR data and the NYC MapPLUTO data,
I'll call this the DHCR's "registered rent-stabilized building list."

{% highlight sql %}
SELECT Count(a.bbl)
FROM
(
  SELECT DISTINCT bbl FROM map_pluto2014v2
) AS a
INNER JOIN
(
  SELECT DISTINCT ON (bbl) bbl FROM dhcr_rs_w_bbls
  WHERE bbl IS NOT NULL
) AS b
ON a.bbl = b.bbl;
{% endhighlight %}


Next I'll select the number of properties *not in* the DHCR list that fall within a
general "likely to have rent-stabilized apartments" query. NYC tenants rights advocates
will tell you any residential building built before 1973 with 6 or more units that isn't a coop
or a condo may have rent stabilized apartments in it, which translates easily to an SQL query:

{% highlight sql %}
SELECT COUNT(a.bbl)
FROM
(
  SELECT DISTINCT bbl FROM map_pluto2014v2
  WHERE yearbuilt < 1974 AND unitsres >= 6
  AND (ownername NOT ILIKE 'new york city housing authority' or ownername NOT ILIKE 'nycha')
  AND bldgclass NOT ILIKE 'r%'  
) AS a
LEFT JOIN
(   
  SELECT DISTINCT bbl FROM dhcr_rs_w_bbls
  WHERE bbl IS NOT NULL
) AS b
ON a.bbl = b.bbl
WHERE b.bbl IS NULL;
{% endhighlight %}

These two queries tell us: **A.** the number of properties in the MapPLUTO tax lot data
that match those on the DHCR's registered rent-stabilized building list, and **B.**
how many other properties are likely to have rent-stabilized apartments but aren't on the DHCR list.

One side note: we don't really know the exact count of apartments per building or
the actual apartment numbers as the DHCR refuses to give that information out
under claims of protecting the privacy of tenants.

A third category I include in the data are properties that receive a 421a tax break from
the city. [According to the NY State law](#), developers who receive such a tax break
for new development are required to make all units of their buildings rent-stabilized,
even if they are renting them at market rate. The 421a tax break data is public domain,
and some data savy folks at Pro Publica did a great job of making it easier to work with.

Now let's get down to creating the "likely rent-stabilized" table that has all three of
these criteria:

{% highlight sql %}
DROP TABLE IF EXISTS map_pluto_likely_rs;

CREATE TABLE map_pluto_likely_rs (
  bbl bigint primary key,
  address varchar,
  unitsres integer,
  borough varchar,
  ownername varchar,
  zipcode integer,
  yearbuilt smallint,
  geom geometry(MultiPolygon,2263),
  cd smallint,
  council smallint,
  registered boolean,
  exemptions varchar
);
{% endhighlight %}

The above `CREATE TABLE` query shows the basic schema for the final table. Next
I'll insert the rows from the MapPLUTO data that match the DHCR list, setting
values for the `registered` column to `TRUE`:

{% highlight sql %}
INSERT INTO map_pluto_likely_rs
SELECT dhcr.bbl::bigint,
    dhcr.address,
    dhcr.unitsres,
    dhcr.borough,
    dhcr.ownername,
    dhcr.zipcode,
    dhcr.yearbuilt,
    dhcr.geom,
    dhcr.cd,
    dhcr.council,
    dhcr.registered
FROM (
  SELECT a.bbl,
    a.address,
    a.unitsres,
    a.borough,
    a.ownername,
    a.zipcode,
    a.yearbuilt,
    a.geom,
    a.cd,
    a.council,
    TRUE AS registered
  FROM
  all_mappluto a,
  (
    SELECT DISTINCT bbl FROM dhcr_rs
    WHERE bbl IS NOT NULL
  ) b
  WHERE a.bbl = b.bbl
) AS dhcr;
{% endhighlight %}



{% highlight sql %}
INSERT INTO map_pluto_likely_rs
SELECT not_dhcr.bbl::bigint,
  not_dhcr.address,
  not_dhcr.unitsres,
  not_dhcr.borough,
  not_dhcr.ownername,
  not_dhcr.zipcode,
  not_dhcr.yearbuilt,
  not_dhcr.geom,
  not_dhcr.cd,
  not_dhcr.council,
  not_dhcr.registered
FROM (
  SELECT a.*,
    FALSE AS registered
  FROM
  (
    SELECT * FROM all_mappluto
    WHERE yearbuilt < 1974 AND unitsres >= 6
        AND (ownername not ILIKE 'new york city housing authority' or ownername not ILIKE 'nycha')
        AND bldgclASs not ILIKE 'r%'
  ) AS a
  LEFT JOIN
  (
    SELECT DISTINCT bbl FROM dhcr_rs
    WHERE bbl IS NOT NULL
  ) AS b
  ON a.bbl = b.bbl
  WHERE b.bbl IS NULL -- rows that don't match / aren't in the DHCR data
) AS not_dhcr;
{% endhighlight %}

Adding the 421a:

{% highlight sql %}
DROP TABLE IF EXISTS map_pluto_exempt_rs;
CREATE TABLE map_pluto_exempt_rs AS
  SELECT exempt.bbl::bigint,
    exempt.address,
    exempt.unitsres,
    exempt.borough,
    exempt.ownername,
    exempt.zipcode,
    exempt.yearbuilt,
    exempt.geom,
    exempt.cd,
    exempt.council,
    exempt.exemptions
  FROM
    (
      SELECT a.bbl,
        a.address,
        a.unitsres,
        a.borough,
        a.ownername,
        a.zipcode,
        a.yearbuilt,
        a.cd,
        a.council,
        a.geom,
        b.exemptions
      FROM
      all_mappluto a,
      (
        SELECT bbl,
          exemptions
        FROM exempt_stabilized
      ) b
      WHERE a.bbl = b.bbl
    ) AS exempt;
{% endhighlight %}

![properties likely to have rent stabilized units]({{site.urlimg}}likely_rs_map.png)
*Map showing output of joined data: Blue indicates registered, red indicates not registered*

![properties likely to have rent stabilized units]({{site.urlimg}}likely_rs_map.png)
*Map showing output of joined data: Blue indicates registered, red indicates not registered*




Check to make sure the data looks good:

{% highlight sql %}
SELECT Count(*) FROM map_pluto_likely_rs WHERE registered IS NULL;
  -- returns 0 rows
SELECT Count(DISTINCT bbl) FROM map_pluto_likely_rs;
  -- returns 59,679 rows
SELECT Count(*) FROM map_pluto_likely_rs WHERE geom IS NULL;
  -- returns 0 rows
SELECT Sum(unitsres) AS total_res_units FROM map_pluto_likely_rs;
  -- returns 1,962,469
{% endhighlight %}


#### 4. Further Data Processing Using CARTO
Lastly, the data was imported into CARTO and some final tweaks were made.

I Removed all properties owned by the NYC Housing Authority that were missed.
This involved doing a spatial intersect with polygon centroids created from
a Shapefile of NYCHA properties from 2011 to determine other possible spellings
and abbreviations of "NYCHA" in the MapPLUTO attribute data. I didn't want to just
remove all polygons that intersected the NYCHA centroids as that data was older and a
building could have been sold from NYCHA.

{% highlight sql %}
SELECT DISTINCT a.ownername
FROM map_pluto_likely_rs a, nycha_centroids b
where
  ST_Intersects(
  a.the_geom, b.the_geom
  )
ORDER BY ownername

-- remove properties that are obviously owned by NYCHA
DELETE FROM map_pluto_likely_rs WHERE ownername LIKE 'NYC HOUSING%';
DELETE FROM map_pluto_likely_rs WHERE ownername ILIKE 'new york city%';
DELETE FROM map_pluto_likely_rs WHERE ownername LIKE 'NYC CITY HSG%';
DELETE FROM map_pluto_likely_rs WHERE ownername = 'CITY OF NEW YORK';
DELETE FROM map_pluto_likely_rs WHERE ownername LIKE 'N Y C H A%';
DELETE FROM map_pluto_likely_rs WHERE ownername LIKE 'N.Y.C. HOUSING AUTHOR%';
DELETE FROM map_pluto_likely_rs WHERE ownername LIKE 'N Y C HOUSING AUTHORI%';
DELETE FROM map_pluto_likely_rs WHERE ownername = 'NY HOUSING AUTHORITY';
DELETE FROM map_pluto_likely_rs WHERE ownername = 'NEW YRK CTY HSG AUTHR';
{% endhighlight %}

The `pgsql2shp` command converted the boolean value of the "registered" column to `T` / `F`.
I changed the column's datatype to string and values to be 'yes' / 'no' instead, so that
they would be more UX friendly when displayed in map's
[infowindows](https://carto.com/docs/faqs/infowindows) / popups:

{% highlight sql %}
UPDATE map_pluto_likely_rs set registered = 'no' WHERE registered = 'F';
UPDATE map_pluto_likely_rs set registered = 'yes' WHERE registered = 'T';
{% endhighlight %}

I also changed borough codes to actual borough names for the infowindows / popups:

{% highlight sql %}
UPDATE map_pluto_likely_rs set borough = 'Queens' WHERE borough = 'QN';
UPDATE map_pluto_likely_rs set borough = 'Brooklyn' WHERE borough = 'BK';
UPDATE map_pluto_likely_rs set borough = 'Staten Island' WHERE borough = 'SI';
UPDATE map_pluto_likely_rs set borough = 'Bronx' WHERE borough = 'BX';
UPDATE map_pluto_likely_rs set borough = 'Manhattan' WHERE borough = 'MN';
{% endhighlight %}


## Creating Service Area Polygons For Local Tenants Rights Organizations
In order to inform a user as to whether or not any local tenants rights organizations
are operating within their neighborhood, [custom polygon geospatial data](https://github.com/clhenrick/nyc_tenants_rights_orgs_service_areas) was
created to represent each organization's service area, for 94 organizations in total.

First, a list of [Community Based Housing Organizations](http://www.nyshcr.org/Rent/HousingOrgs.htm)
was scraped from an HTML table on the DHCR's website using a
[Python script](https://github.com/clhenrick/DHCR_Community_Based_Housing_Orgs/blob/master/scraper.py).
Organizations that operate in the boroughs / counties that make up NYC were
pulled out from the scraped data into a new table.

For these 94 organizations, polygon data was manually created representing each organization's service area. Reference polygon geospatial data sources used to create the service areas geometries include [Pediatcities NYC Neighborhood boundaries](http://nyc.pediacities.com/New_York_City_Neighborhoods), [NYC Planning Neighborhood Tabulation Areas](http://www.nyc.gov/html/dcp/html/bytes/applbyte.shtml#other), U.S. Census Zipcode Tabulation Areas, and [NYC Planning Community District boundaries](http://www.nyc.gov/html/dcp/html/bytes/applbyte.shtml#district_political). This data was copied and in some cases aggregated (dissolved) into a new dataset using MAPublisher, a GIS plug-in for Adobe Illustrator. In some cases boundaries had to be drawn by hand, such as for the Cooper Square Committee which operates within a very specific area in the East Village of Manhattan. Once completed, the polygon data was joined to the DHCR Community Housing Based Organizations for NYC and then exported to a Shapefile format.

The data was then imported into CARTO for use with *Am I Rent Stabilized*. When a user's address is geocoded, a point in polygon SQL query is made via PostGIS to the data in CARTO.

For example:

{% highlight sql %}
SELECT * FROM nyc_tenants_rights_service_areas
WHERE
ST_Contains(
  nyc_tenants_rights_service_areas.the_geom,
  ST_GeomFromText(
   'Point(-73.917104 40.694827)', 4326
  )  
);
{% endhighlight %}

If a user's address is within a group's service area, that group's information is passed into a modal in the app that displays information such as the group's website url, phone number, contact person, and/or address. As this data varies from group to group, a Handlebars.js helper function is used to check if the data exists before passing it to the Handlebars HTML template.

{% highlight javascript %}
var H = Handlebars;

H.registerHelper('each', function(context, options) {
  var ret = "";
  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }
  return ret;
});

H.registerHelper('if', function(conditional, options) {
  if (conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
{% endhighlight %}

The Handlebars HTML template looks like this:

{% highlight javascript %}
{% raw %}
<script id="org-template" type="text/x-handlebars-template">
  <div class="org-container">
  <a href="#close" title="Close" class="close">X</a>
  <h1>
    Here are some groups that help people with housing
    issues in your neighborhood:
  </h1>

  {{#each orgs}}
    <div class="tr-org-info">  
      <h3>{{name}}</h3>

      {{#if website}}
      <p class="website-url"><span>Website: </span><a target="_blank" href="{{website}}">{{website}}</a></p>
      {{/if}}

      {{#if phone}}
      <p class="phone-no"><span>Phone: </span>{{phone}}</p>
      {{/if}}

      {{#if address}}
      <p class="address"><span>Address: </span>{{address}}</p>
      {{/if}}

      {{#if email}}
      <p class="email"><span>Email: </span>{{email}}</p>
      {{/if}}

      <p class="description"><span>Description: </span><br>
      {{description}}
      </p>
    </div>
  {{/each}}

  </div>
</script>
{% endraw %}
{% endhighlight %}

<!-- ![]({{site.urlimg}}airs_address_search.png)

![]({{site.urlimg}}airs_search_result_yes.png) -->


## Links to Code & Data
Thanks for reading, if you're interested in learning more feel free to check out the following links:

- [Github Repo for Am I Rent Stabilized](https://github.com/clhenrick/am-i-rent-stabilized)  
- [Visualization of NYC properties that likely have rent-stabilized apartments](http://cdb.io/1bfz09d)  
- [DHCR Rent Stabilized Building List](https://github.com/clhenrick/dhcr-rent-stabilized-data)  
- [NYC Likely Rent-Stabilized GIS data](http://chenrick.carto.com/tables/all_nyc_likely_rent_stabl_merged/public)  
- [NYC Local Tenants Rights Groups Service Areas](https://github.com/clhenrick/nyc_tenants_rights_orgs_service_areas)
