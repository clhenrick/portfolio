---
title: "Storytelling With Data ten week course"
layout: page
date: 2021-6-31
teaser: "Reflections on and learnings from completing the SWD ten week course."
header: no
comments: true
tags:
  - Data Visualization
  - Design
  - Storytelling
---

## About the SWD course

From April to June of 2021 I took part in the [Storytelling With Data](https://www.storytellingwithdata.com/) ten week, online course lead by Cole Nussbaumer Knaflic (Founder and CEO of SWD) and Alex Velez (Data Storyteller with SWD). Each week's class and materials focused on a topic relating to data visualization, communication, and design. The course utilized a wide variety of media and learning methods such as podcasts, videos, blog posts, books, storyboarding, and sketching with pencil and paper which helped make it engaging and fun. The class culminated with creating and presenting a data story on a topic of the student's choosing, with the goal of applying what we learned over the ten weeks. 

As part of taking the class we received two [SWD books](https://www.storytellingwithdata.com/books), one that covers concepts advocated by the SWD team for communicating effectively and impactfully with data, and another that consists of hands on exercises to practice applying those concepts. We also received access to SWD members only and class participant content on the SWD website. These served as excellent reference material during the class and following its completion. If you haven't checked out the SWD website and all of its blog posts, data viz makeovers, conversations, etc. I would recommend doing so; it's a treasure trove of information on and relating to data viz.

We met over Zoom on Mondays for an hour each week for a lecture and discussion on the week's theme. For each week we were given around six to eight types media to watch, listen, or read; opportunities for practicing some of the concepts we were being taught; and a single "synthesize" activity we turned in by posting it on the class website where we would receive feedback from Cole, Alex, and other students from the class. In addition to the final project, the synthesize activities were the only other required activities for receiving a certificate of completion for the class. Overall, I felt that the materials and assignments were tenable to do while also working a full time day job.

## Why I took this course

Having come into the class with considerable experience as a data visualization developer and while working as a UX Engineer at Google at the time, I felt that my experience largely resided more on the technical aspects of creating interactive data visualizations for the web for _exploratory_ purposes, and that I had gaps in my knowledge for creating data visualizations for _explanatory_ purposes. If you're not familiar with these two most common ways of utilizing visualization (exploratory and explanatory), one way of thinking about them could be a continuum where exploratory is on the left and explanatory the right:

{% highlight txt %}
exploratory <--------------------------------------> explanatory
{% endhighlight %}

**Exploratory** visualizations are those that don't attempt to tell a story or message but rather invite the user to explore the data, typically through a user interface of some kind, and draw their own conclusions. These types of visualizations tend to take the form of dashboards and/or interactive geographic maps paired with features such as categorical filters, date time sliders, and/or layer toggles that enable a viewer to "drill down" and discover insights about the data being visualized.

**Explanatory** visualization on the other hand makes an attempt, hopefully in good faith, to communicate a specific insight or hypothesis about the data to the viewer. Charts, graphs, maps, etc. in the form of data journalism from outlets such as The New York Times, Washington Post, Bloomberg, Five Thirty-Eight, and many others all come to mind. "Scrolly-telling" experiences that combine narrative text and other media with data visualization are a popular form that may take on the web as well. However, as we learned in the SWD ten week course, even a static chart that is well designed and paired with a good title and/or caption can be an excellent explanatory data visualization.

I mentioned that the two forms of visualization can be thought of as a continuum as hybrid approaches often take shape. One form of this could be a "scrolly-telling" or other type of interactive visualization that communicates a story using data but then invites the viewer to explore the data on their own. Perhaps this could take the form of encouraging the viewer to search for their home town or city to see how the data used in the story relates to their local community.

## What I learned

The course covered a lot of ground over the ten week period, including topics such as:

- When, why, and how to use a certain chart or graph type. For example, time series data are typically best represented as line charts, and a bar chart is most often a better choice than a pie chart.

- How to design charts to focus a viewer's attention to what's meaningful by decluttering and focusing.

- Techniques for using color intentionally, such as limiting the color palette used in a chart and maybe using a single color to focus attention to a specific aspect of a chart.

- The importance of giving and receiving feedback, and why keeping in mind the context of the work (e.g. deadline, resources, budget, etc.) is helpful.

- Utilizing aspects of narrative / story telling to help people listen to and remember what you're communicating.

- The importance of understanding and designing for your target audience, or why "designing for everyone is designing for no one".

- What you create is for your audience, not you. This relates to determining your target audience and asking for feedback.

- How to plan, craft, and execute a clear presentation that communicates a data story.

At a very high level I'd say that the primary focus of the course was how to be a better communicator with data, as well as a better planner and critical thinker. This makes sense, as _explanatory_ data visualization really is about communicating, particularly communicating the "so what" about a dataset. If your audience is not clear on what the key take away(s) about the dataset is, then you're not communicating effectively.

Learning and putting into practice various strategies for communicating _effectively_ is an important concept that I took away from the course and one that I anticipate to be working on for the rest of my career. *It's crucial to not assume that after you graphed some data and that because it makes sense to you that it will make sense to your viewers* (hence the importance of asking for feedback). I believe that it's probably difficult for many data vis practitioners to come to terms with understanding that in order to communicate effectively, you must first identify your target audience so that you can custom tailor your visualization to them and decide on how to share it with them. Then, you need to get feedback from people representative of this audience to determine whether or not you are communicating effectively. This is just as important as the "what" you're communicating with your visualization.

## Course Project

For my final project I chose to do a presentation on the [Digital Divide](https://en.wikipedia.org/wiki/Digital_divide), or how access to the internet varies across the United States and potential policies that can help address it. [Here's a link to the slide deck](https://docs.google.com/presentation/d/1IFXkuGSwGduACZhJ_qy3FRrSBz9bN9GdoMKnDC1mRFM/edit?usp=sharing), in case you're interested, or view it below:

<style>
  /* Thank you CSS Tricks! https://css-tricks.com/responsive-iframes/ */
  [style*="--aspect-ratio"] > :first-child {
    width: 100%;
  }
  [style*="--aspect-ratio"] > img {  
    height: auto;
  } 
  @supports (--custom:property) {
    [style*="--aspect-ratio"] {
      position: relative;
      margin-bottom: 3rem;
    }
    [style*="--aspect-ratio"]::before {
      content: "";
      display: block;
      padding-bottom: calc(100% / (var(--aspect-ratio)));
    }  
    [style*="--aspect-ratio"] > :first-child {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }  
  }
</style>

<div style="--aspect-ratio: 16/9;">
  <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQ6b2powCE5aPCwjVFszCFnINCVs_vb1DIU57sR6OBhC_VybXSXHvkcvEiTbrTMOkxs4Q_c8i-Cg6Mi/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

## What more could have been offered

The SWD ten week course was a wealth of information and guided by experts in the data visualization and business analytics fields. Most, if not all, of the example visualizations and real world scenarios were from a business setting. This is clearly important if you are working as a data analyst or data scientist in a for-profit business and the success of your job is determined by how well you can recommend your business to increase revenue or cut costs by analyzing internal data. However, I'm sure that not everyone taking the class was working or aspiring to work in this type of role, and so I felt a little disappointed that there weren't scenarios or examples covered in class that had to do with other types of settings such as data journalism, public interest work, or various types of public policy advocacy. Clearly the lessons from class may be applied to other types of settings, but it would have helped to have seen other examples and not have been so focused on business applications. 

## Final Thoughts

Taking and completing the Storytelling With Data ten week course was a worthwhile endeavor. I wish I had taken a class like this when I began venturing into the world of data visualization, rather than focusing primarily on learning the more technical aspects of interactive visualization such as D3JS. Even understanding the difference between exploratory and explanatory visualization would have helped me earlier on in my career. But it's often too easy to be hard on oneself with data viz, as it encompasses aspects of so many disciplines such as statistics, graphic design, communication, computer science, journalism, etc. and that's excluding areas of specialization such as climate science or phylogenetics. I'm happy to know now that I'm more confident in my story telling with data capabilities and look forward to applying and improving them through practice.

_I'd like to thank [Zan Armstrong](https://www.zanarmstrong.com/) for recommending the SWD ten week class to me and introducing me to the SWD website, its community and resources. Thank you Zan!_

