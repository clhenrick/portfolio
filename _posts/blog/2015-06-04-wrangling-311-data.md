---
title: Wrangling NYC's 311 data
layout: page
date: 2015-06-03
teaser: "Battling the task of downloading 311 data and importing it into PostgreSQL for analysis."
header: no
comments: true
tags: 
    - data 
    - postgresql 
    - open-data
---

I've been lucky to have the opportunity to work with the incredibly talented author [Rebecca Solnit](http://rebeccasolnit.net/) on her new book, Impossible Metropolis, an NYC Atlas. Rebecca has previously completed atlases for two other cities; [Infinite City, a San Francisco Atlas](http://rebeccasolnit.net/book/infinite-city-a-san-francisco-atlas/); and [Unfathomable City, a New Orleans Atlas](http://rebeccasolnit.net/book/unfathomable-city-a-new-orleans-atlas/); and they are anything but traditional city planning maps. While Rebecca is not a cartographer by trade (she hires others to make the maps in her books) she has a deep appreciation and in-depth knowledge of the field and thus draws inspiration from the rich history of printed maps. Rebecca has added her own unique touch and brought life to the maps in her books; they range from being quirky, mystifying, poignant, politically charged, or celebratory. Her maps offer a refreshing perspective on map making in the current deluge of maps that are bound to the web mercator projection, algorithmically rendered, and at times just plain ugly.

As part of the map I'm working on for the NYC Atlas (I can't disclose its name yet!), Rebecca and her publishing partner [Joshua Jelly-Schapiro](http://berkeley.academia.edu/JoshuaJellySchapiro) were very interested in looking into NYC's 311 data. This was an exciting opportunity for me to revisit the data, as it had been several years since I last used it when I made the [NYC Rats, Graffiti, and Wifi Hot Spots Map](http://a.parsons.edu/~henrc131/MajorStudio1/seven/03_nyc-graffiti-rats-wifi/).

## Downloading 311 data from the NYC Open Data Portal
Because the 311 dataset is so massive, and Socrata's servers aren't necessarily the fastest, it's not too easy to pull this data down from [NYC Open Data](https://nycopendata.socrata.com/). The solution I came up with was to filter the data on the open data portal so that I only had to download a subset of the data. I grabbed everything from January 1, 2014 to present, made a new "view", then downloaded that data which still ended up being a roughly 1.5 GB CSV file!

## Importing 311 Data into PostgreSQL
I prefer using **PostgreSQL** (also referred to as **Postgres**) as my go-to database for a bunch of reasons, but probably the main is that the map / GIS geek in me really likes to use the [PostGIS](http://postgis.net/) extension, which allows for wrangling spatial data & geoprocessing via SQL queries.

### Problem: importing a 1.5 GB CSV file into postgresql
Typically I use **csvkit**'s [csvsql command line tool](http://csvkit.readthedocs.org/en/latest/scripts/csvsql.html) to import CSV data into **Postgres**. This normally works fairly well, but not in the case of a 1.5 GB CSV file. Basically, attempting to do this row by row *is not the answer!*  
The following Allen Iverson poster comes to mind:

![war is not the answer]({{site.urlimg}}warisnottheanswer1.jpg)

What we need is a way to bulk load the data.

### Solution: PGloader 

**PGloader** is a tool that allows for programatically bulk loading of data into **PostgreSQL**. Using this method ended up taking just 5 minutes 2.127 seconds, instead of hanging up and eventually crashing my computer. I'd say that's an improvement!

**PGloader** can be used one of two ways; by either writing a script or as a command line utility. Because I had yet to create the table in my `nyc_311` database, I decided to go with using a script. My friend [John Krauss](http://blog.johnkrauss.com/) refered me to a **pgloader** script he used which helped me get going. The syntax for pgloader is **PLpgSQL** which is a bit strange when first encountered, but not too difficult to follow. 

Prior to writing the pgloader script a good first step was to pull out the 30 or so 311 complaint field names and rename them to be database friendly. A quick n dirty bash script did the job, it replaces spaces with underscores and converts text to lower case by grabbing the first line of the CSV file using **head** and piping it through **sed** and **tr**, then writing the output to a text file:  

{% highlight bash %}
FILE_IN="311_requests_2014_to_present.csv"
FILE_OUT="311_field_list.txt"
head -n 1 $FILE_IN  | tr ',' '\n'| sed -e 's/ /_/g' | tr '[A-Z]' '[a-z]' > $FILE_OUT
{% endhighlight %}

The list of field names was then used below to in the **pgloader** script.  
Here's the **pgloader** script I ended up using to import the 311 complaints data:

{% highlight sql %}
LOAD CSV
  FROM '/Users/clhenrick/Downloads/311_requests_2014_to_present.csv'
  INTO postgresql:///nyc_311?requests
  WITH skip header = 1,
       fields terminated by ','
  BEFORE LOAD DO  
     $$ drop table if exists requests; $$,
     $$ create table if not exists requests (  
          unique_key bigint,
          created_date DATE,
          closed_date DATE,
          agency TEXT,
          agency_name TEXT,
          complaint_type TEXT,
          descriptor TEXT,
          location_type TEXT,
          incident_zip TEXT,
          incident_address TEXT,
          street_name TEXT,
          cross_street_1 TEXT,
          cross_street_2 TEXT,
          intersection_street_1 TEXT,
          intersection_street_2 TEXT,
          address_type TEXT,
          city TEXT,
          landmark TEXT,
          facility_type TEXT,
          status TEXT,
          due_date DATE,
          resolution_action_updated_date DATE,
          community_board TEXT,
          borough TEXT,
          x_coordinate bigint,
          y_coordinate bigint,
          park_facility_name TEXT,
          park_borough TEXT,
          school_name TEXT,
          school_number TEXT,
          school_region TEXT,
          school_code TEXT,
          school_phone_number TEXT,
          school_address TEXT,
          school_city TEXT,
          school_state TEXT,
          school_zip TEXT,
          school_not_found TEXT,
          school_or_citywide_complaint TEXT,
          vehicle_type TEXT,
          taxi_company_borough TEXT,
          taxi_pick_up_location TEXT,
          bridge_highway_name TEXT,
          bridge_highway_direction TEXT,
          road_ramp TEXT,
          bridge_highway_segment TEXT,
          garage_lot_name TEXT,
          ferry_direction TEXT,
          ferry_terminal_name TEXT,
          latitude NUMERIC,
          longitude NUMERIC,
          location TEXT
        );  
   $$; 

LOAD CSV
  FROM '/Users/clhenrick/Downloads/311_requests_2014_to_present.csv'
  INTO postgresql:///nyc_311?requests
  WITH skip header = 1,
       fields optionally enclosed by '"',  
       fields terminated by ','
;
{% endhighlight %}

## Data Analysis
After I imported the data to Postgres I had some fun. Prior to getting down to analysis the data was indexed, vacuum analyzed, and clustered. These steps are very helpful to speed up queries:

{% highlight sql %}
CREATE UNIQUE INDEX requests_idx ON requests (unique_key);
VACUUM ANALYZE requests;
CLUSTER requests USING requests_idx;
{% endhighlight %}

Thus I was able to accomplish the following:

- list all the [distinct complaint types](https://gist.github.com/clhenrick/ab72cda39e7d5f67de67)
- pull out subsets of the data, such as [taxi cab complaints](http://cdb.io/1BNrcTj).
- geocode data where latitude & longitude values are not null (see the taxi complaint link above).

## Next up:
Well mapping subsets of the data is one step of course, but ideas Rebecca and I tossed around were dividing some complaint data categories qualitatively into either public love / civic mindedness (animal abuse, street conditions, scaffold safety) or animosity / lack of empathy (noise - house of worship, noise - parks) to as a total percent of the 311 data set.

All in all, this was a fun time I'd say, and it certainly paid off to import the 311 complaint data in postgres where I can now "get all crazy with it."