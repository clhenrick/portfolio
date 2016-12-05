---
title: Introducing the AWS Lambda Tiler
layout: page
date: 2016-12-05
teaser: "Server-Free Web Map Tile Generation"
header: no
comments: true
tags:
    - AWS
    - AWS Lambda
    - GDAL
    - Web Mapping
---

![assortment of map tiles generated using the AWS Lambda Tiler]({{site.urlimg}}aws-lambda-tiler.png)

### _The following is a very small excerpt from the original post, you may read the full post at  [Hi.Stamen.com](https://hi.stamen.com/stamen-aws-lambda-tiler-blog-post-76fc1138a145)_

<br />
Recently at Stamen and thanks to a grant from the John S. and James L. Knight Foundation, we’ve been experimenting with a new way of generating raster map tiles using AWS Lambda with open source GIS software. If you haven’t heard of, or aren’t familiar with AWS Lambda:

> AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume — there is no charge when your code is not running. With Lambda, you can run code for virtually any type of application or backend service — all with zero administration. Just upload your code and Lambda takes care of everything required to run and scale your code with high availability. You can set up your code to automatically trigger from other AWS services or call it directly from any web or mobile app.

Some of the benefits of using AWS Lambda are that you have no tile server to maintain, it’s cost efficient to run, and that it can scale up as well as down. We’ve found that this process works well for tiling raster data from hillshades, aerial imagery, and landcover; as well as vector data via sources such as OpenStreetMap and Natural Earth. As such it can be applied to a wide range of use cases. This method was and is continuing to be developed by Seth Fitzsimmons, formerly Stamen’s Director of Technology. Since first applying it to power our latest global map tiles, Terrain Classic, he has applied it to other projects such as OpenAerialMap and Portable OpenStreetMap, as the POSM Imagery API, intended for use with UAV imagery processed through OpenDroneMap.

In this post I’ll explain how we implemented this process so that you can replicate it to create raster tiles from your own GIS raster data. In a future post I’ll describe how to implement it for creating map tiles from vector data. If you’re following along it’s recommended that you have knowledge of the command line using Bash, how “slippy maps” work, and general concepts of geospatial data processing.

. . .

_Read more on [Medium.com](https://hi.stamen.com/stamen-aws-lambda-tiler-blog-post-76fc1138a145)._
