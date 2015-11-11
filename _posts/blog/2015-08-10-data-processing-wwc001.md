---
title: Data Processing Methodology for "Tracking the Energy Titans"
layout: page
date: 2015-08-10
teaser: "Parsing irregularly formatted CSV files for a visualizaiton with D3JS."
tags:
    - data 
    - node-js 
    - d3js
---

## Background
For my first project at [Radish Lab](http://radishlab.com/) I assisted with creating an interactive data-visualization for the [Woodrow Wilson Center](http://www.wilsoncenter.org/) called [Tracking the Energy Titans](#) that compares energy consumption and exports between the U.S., Canada, and China. One of my roles in creating this interactive was to take raw data provided by WWC and convert it to a structure and format that plays nicely with D3JS, a data-visualization javascript library that is being used to draw the charts in the interactive. Rather than manually reformatting the data in a program like Excel, I chose to write a [Node JS](https://nodejs.org/) script which would parse the data and output it to a [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) data format. The following post describes the process of how I accomplished this.

## About the Data
To facilitate communication with the client about the data Radish Lab utilized Google Drive's Sheets App, which works in a similar fashion to Microsoft's Excel software. This way we could see any updates made to data by the client in real time and give them feedback without having to send files back and forth via email or an FTP. The Google Sheets document contained a total of 8 worksheets: two worksheets for each country representing per-capita and total data, a sheet listing the data sources, and another containing interesting facts relating to the data called "Wow-Factors." 

Here is a sample of the United State's total country data in tabular format:

|  |  | Unit of Measure | 2007 | 2008 | 2009 | 2010 | 2011 | 2012 | 2013 |
|-------------|-------------------------|-----------------------------|---------|---------|---------|---------|---------|---------|------|
| Production |  |  |  |  |  |  |  |  |  |
|  | Coal | Mtce | 846 | 859 | 778 | 793 | 800 | 744 | 720 |
|  | Gas | Mtce | 712 | 745 | 761 | 785 | 843 | 887 | 896 |
|  | Oil | Mtce | 474 | 469 | 501 | 517 | 538 | 612 | 692 |
|  | Nuclear | Mtce | 305 | 303 | 301 | 304 | 298 | 290 | 298 |
|  | Hydro | Mtce | 30 | 31 | 33 | 32 | 39 | 34 | 33 |
|  | Renewables (Solar Wind) | Mtce | 4.3 | 6.9 | 9.2 | 11.8 | 15 | 17.8 | 21.7 |
|  |  |  |  |  |  |  |  |  |  |
| Imports |  |  |  |  |  |  |  |  |  |
|  | Coal | Mtce | 35 | 34 | 21 | 19 | 13 | 9 | 8 |
|  | Gas | Mtce | 170 | 147 | 138 | 138 | 128 | 116 | 106 |
|  | Crude Oil | Mtce | 789 | 772 | 709 | 725 | 705 | 693 | 613 |
|  | Oil Products | Mtce | 247 | 225 | 194 | 188 | 180 | 149 | 146 |
|  | Electricity | Mtce | 6 | 7 | 6 | 6 | 6 | 7 | 8 |
|  |  |  |  |  |  |  |  |  |  |
| Exports |  |  |  |  |  |  |  |  |  |
|  | Coal | Mtce | 56 | 76 | 56 | 77 | 100 | 112 | 105 |
|  | Gas | Mtce | 30 | 35 | 39 | 41 | 55 | 59 | 57 |
|  | Crude Oil | Mtce | 2 | 2 | 3 | 3 | 4 | 5 | 9 |
|  | Oil Products | Mtce | 106 | 135 | 149 | 171 | 213 | 229 | 250 |
|  | Electricity | Mtce | 2 | 3 | 2 | 2 | 2 | 1 | 1 |
|  |  |  |  |  |  |  |  |  |  |
| Consumption |  |  |  |  |  |  |  |  |  |
|  | Power Sector | Mtce | 1369 | 1348 | 1272 | 1326 | 1295 | 1260 | 1263 |
|  | Transport | Mtce | 1046 | 1000 | 974 | 990 | 979 | 962 | 971 |
|  | Industry | Mtce | 895 | 862 | 789 | 850 | 857 | 866 | 893 |
|  | Residential | Mtce | 409 | 418 | 408 | 415 | 409 | 377 | 411 |
|  | Commercial | Mtce | 305 | 312 | 306 | 308 | 309 | 296 | 309 |
|  |  |  |  |  |  |  |  |  |  |
| Impact |  |  |  |  |  |  |  |  |  |
|  | CO2 Emissions | Megaton* | 5851.51 | 5667.24 | 5295.18 | 5425.19 | 5304.77 | 5173.52 | N/A |
|  | Water Use | Billions of gallons per day | 409 | 404.6 | 404.6 | 355 | 355 | 355 |  |
|  | Losses - Power Sector | Mtce | 878 | 860 | 804 | 839 | 810 | 782 | 784 |
|  |  |  |  |  |  |  |  |  |  |
|  |  | *Million Metric Ton |  |  |  |  |  |  |  |

And another for the United State's per-capita data:

| US per capita |  | Unit of Measure | 2007 | 2008 | 2009 | 2010 | 2011 | 2012 | 2013 |
|---------------|-------------------------|---------------------|----------|----------|----------|----------|----------|--------|-------|
| Production |  |  |  |  |  |  |  |  |  |
|  | Coal | tce | 2.800 | 2.825 | 2.536 | 2.564 | 2.568 | 2.370 | 2.278 |
|  | Gas | tce | 2.364 | 2.450 | 2.481 | 2.538 | 2.706 | 2.826 | 2.834 |
|  | Oil | tce | 1.574 | 1.542 | 1.633 | 1.671 | 1.727 | 1.950 | 2.189 |
|  | Nuclear | tce | 1.101 | 0.996 | 0.981 | 0.983 | 0.956 | 0.924 | 0.943 |
|  | Hydro | tce | 0.100 | 0.102 | 0.108 | 0.103 | 0.125 | 0.108 | 0.104 |
|  | Renewables (Solar Wind) | tce | 0.014 | 0.023 | 0.030 | 0.038 | 0.048 | 0.057 | 0.069 |
|  |  |  |  |  |  |  |  |  |  |
| Imports |  |  |  |  |  |  |  |  |  |
|  | Coal | tce | 0.116 | 0.112 | 0.068 | 0.061 | 0.042 | 0.029 | 0.025 |
|  | Gas | tce | 0.564 | 0.483 | 0.450 | 0.446 | 0.411 | 0.370 | 0.335 |
|  | Crude Oil | tce | 2.619 | 2.539 | 2.311 | 2.344 | 2.263 | 2.208 | 1.939 |
|  | Oil Products | tce | 0.820 | 0.740 | 0.632 | 0.608 | 0.578 | 0.475 | 0.462 |
|  | Electricity | tce | 0.020 | 0.023 | 0.020 | 0.019 | 0.019 | 0.022 | 0.025 |
|  |  |  |  |  |  |  |  |  |  |
| Exports |  |  |  |  |  |  |  |  |  |
|  | Coal | tce | 0.186 | 0.250 | 0.183 | 0.249 | 0.321 | 0.357 | 0.332 |
|  | Gas | tce | 0.100 | 0.115 | 0.127 | 0.133 | 0.177 | 0.188 | 0.180 |
|  | Crude Oil | tce | 0.007 | 0.007 | 0.010 | 0.010 | 0.013 | 0.016 | 0.028 |
|  | Oil Products | tce | 0.352 | 0.444 | 0.486 | 0.553 | 0.684 | 0.730 | 0.791 |
|  | Electricity | tce | 0.007 | 0.010 | 0.007 | 0.006 | 0.006 | 0.003 | 0.003 |
|  |  |  |  |  |  |  |  |  |  |
| Consumption |  |  |  |  |  |  |  |  |  |
|  | Power Sector | tce | 4.545 | 4.433 | 4.146 | 4.287 | 4.156 | 4.014 | 3.995 |
|  | Transport | tce | 3.472 | 3.288 | 3.175 | 3.201 | 3.142 | 3.065 | 3.072 |
|  | Industry | tce | 2.971 | 2.835 | 2.572 | 2.748 | 2.750 | 2.759 | 2.825 |
|  | Residential | tce | 1.358 | 1.375 | 1.330 | 1.342 | 1.313 | 1.201 | 1.300 |
|  | Commercial | tce | 1.013 | 1.026 | 0.997 | 0.996 | 0.992 | 0.943 | 0.977 |
|  |  |  |  |  |  |  |  |  |  |
| Impact |  |  |  |  |  |  |  |  |  |
|  | CO2 Emissions | tons per capita | 19.425 | 18.636 | 17.261 | 17.539 | 17.025 | 16.483 |  |
|  | Water Use | gallons per day | 1357.761 | 1330.510 | 1318.897 | 1147.655 | 1139.345 |  |  |
|  | Losses - Power Sector | tce | 2.915 | 2.828 | 2.621 | 2.712 | 2.600 | 2.491 | 2.480 |
|  |  |  |  |  |  |  |  |  |  |
|  |  | *Million Metric Ton |  |  |  |  |  |  |  |


As you can see, the total and per-capita data are structured in such a way that the values are grouped in sub-categories which are then grouped by category. For example for the category Exports there are sub-cateogries for coal, gas, crude oil, oil products, and electricity. This made it difficult to read the raw data into D3JS directly using the [d3.csv](https://github.com/mbostock/d3/wiki/CSV#csv) method. D3 also has a method for [parsing CSV data](https://github.com/mbostock/d3/wiki/CSV#parse), but it didn't make sense to do a ton of work parsing 8 CSV files in the browser each time the interactive loads or changes due to a button click.

The output JSON data format I decided on would look something like the following schema:

{% highlight json %}
{
    "country-one" : { // eg: United States
      "category-one" : { // eg: production
          "sub-category-one" : { // eg: coal
              "total" : [  // sample array for total of category-one > sub-category-two
                {
                  "year" : 2007,
                  "val" : 846
                },
                {
                  "year" : 2008,
                  "val" : 859
                },
                {
                  "year" : 2009,
                  "val" : 778
                },
                {
                  "year" : 2010,
                  "val" : 793
                },
                {
                  "year" : 2011,
                  "val" : 800
                },
                {
                  "year" : 2012,
                  "val" : 744
                },
                {
                  "year" : 2013,
                  "val" : 720
                }
              ], 
              "per_capita" : [ // sample array for per-capita of category-one > sub-category-two
                {
                  "year" : 2007,
                  "val" : 2.800
                },
                {
                  "year" : 2008,
                  "val" : 2.825
                },
                {
                  "year" : 2009,
                  "val" : 2.536
                },
                {
                  "year" : 2010,
                  "val" : 2.564
                },
                {
                  "year" : 2011,
                  "val" : 2.568
                },
                {
                  "year" : 2012,
                  "val" : 2.370
                },
                {
                  "year" : 2013,
                  "val" : 2.278
                }
              ], 
              "source" : ["Energy Information Administration"] // the data's source, this differs country to country
            },
          "sub-category-two" : { // eg: gas
              "total" : [...],
              "per_capita" : [...],
              "source" : [...]
            },              
          // additional sub-categories follow...
          },
        "category-two" : { // eg: consumption
          "sub-category-one" : {  // eg: power-sector
              "total" : [...],
              "per_capita" : [...],
              "source" : [...]
            },
          // additional sub-categories ...
        }
        // additional categories ...
      },          
  "country-two" : {...}, // eg: Canada        
  "country-three" : {...} // eg: China
}
{% endhighlight %}

As you can see the raw data will be re-structured into arrays of objects, where each object contains the year and data-value for that year. These arrays are contained in an object representing a sub-category, which is contained in an object representing a category, which are then contained in objects for each country. Having the data structured this way would make the logic for toggling between category and subcategory in the interactive's user interface fairly straight-forward to code and integrate with D3.

## Parsing in Preparation for D3JS

To parse the data from it's original structure to the JSON structure I ended up writing a Node JS script that would take CSV files I downloaded for each worksheet, convert them to [multi-dimensional arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Creating_a_two-dimensional_array), and then output values from those arrays into objects containing the year and data-value. The key parts of the script are the following functions:

{% highlight javascript %}
function iterateMultiArray(arr,x,y) {
    // iterates over a multi-dimensional array
    // returns an array of numeric values

    var i = 0, l = arr.length, arrToReturn = [];

    for (i; i<l; i++) {
        if (i===y) {
            for (var j=0; j<arr[i].length; j++) {
                if (j>x) {
                    var tmp = arr[i][j]
                    arrToReturn.push(filterFloat(tmp));
                }
            }               
        }
    }       

    return mapData2Years(arrToReturn);
}

function mapData2Years(arr) {
    // maps each value of an array to its corresponding year
    // preferred data format for d3
    var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];
    var toReturn = [];
    for (var i = 0; i < arr.length; i++) {
        var obj = {};
        obj.val = arr[i];
        obj.year = years[i];
    
        // only add the data if it isn't null
        if (obj.val >= 0) {
            toReturn.push(obj);
        }       
    }
    
    return toReturn;
} 
 
// cast data type from string to a number type
// if no data the value will be NaN and output value in JSON will be null
function filterFloat(value) {
    value = value.replace(/ /g,'');
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
        .test(value))
        return Number(value);
  return NaN;
}
{% endhighlight %}

The function `iterateMultiArray` loops over values in a multi-dimensional array that is a result of using Node's file system module and a third party fast-csv module to read and parse each CSV file. You can think of mulit-dimensional arrays as lying on an x, y coordinate system that increases from top to bottom and left to right. So the y coordinate will be starting point for the outer array and the x coordinate will be the starting place for the inner array. A nested for-loop then retrieves the value from the inner array. That value is then converted from a string to a number data type and pushed to a temporary array. Finally, when the for-loops finish the temporary array is mapped to an array of years. However, if the data value returned from `filterFloat()` is null (`NaN`) then no object is created for that particular year. Finally an array of objects is returned.

So for example, if you'd like the value for "coal production" from either the "per-capita" or "total" worksheets you would do `iterateMultiArray(arr,2,2)` where `arr` is the multi-demnsional array representing the corresponding worksheet. Or if you wanted the value for "residential consumption" you would do `iterateMultiArray(arr,2,27)`

If you'd like to see the entire script, have a look at [this Gist (code snippet)](https://gist.github.com/clhenrick/e846432787a6a80065b9).

## After Thoughts
Following the completion of this project I definitely learned a thing or two about improving the workflow for parsing raw data for interactive data visualizations! The main take away I learned is that whatever tool you will be using to visualize your data should determine how the data is structured. Originally I had the data-values in plain old arrays, not objects inside arrays. This proved problematic when there were null values for certain years and we wanted the graph to start drawing at a year later than 2007 or stop drawing at a year earlier than 2013.

The second take away I learned was that there is an API for the Google Sheets App that allows for worksheets to be accessed programatically. I ended up using the [GSpread Python module](https://github.com/burnash/gspread) and writing a Python script to automate the process of downloading the worksheets as CSVs each time the client made updates to the data. This was a heck of a lot easier than manually downloading each of 8 sheets and renaming them!

Scripting the data-parsing proved to be a huge time saver, given that the client made frequent changes to the data during our development process. I can't imagine having had to do all that work on in Excel! If you have any questions or ideas for improvement about this process, feel free to email me at chris [dot] henrick [at] radishlab [dot] com.

cheers,

\- Chris