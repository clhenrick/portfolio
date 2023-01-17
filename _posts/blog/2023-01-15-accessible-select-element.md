---
title: "Custom Accessible Select Menus Aren't Easy"
layout: page
header: no
date: 2022-01-31
teaser: "Trials and tribulations of building a custom and accessible Select menu UI component."
comments: true
tags:
  - HTML
  - CSS
  - A11Y
  - Accessibility
  - TypeScript
  - React
---

When developing User Interface components, developers sometimes face the choice of either using the web platform's native elements, for example a `<button>`, or rolling their own custom component, perhaps a clickable `<div>` element (aside: it's really better to not to do the latter, more on why later). While the rationale, logical, and arguably ethical thing to do is to use the web platform option, there are circumstances where developers find themselves in the position of having to go the custom route. This is something I experienced recently in my current role and honestly did not expect to find the solution to be so complex! In this post I'll talk about the problem I encountered, what the options to solve it were, and what I and my team decided upon doing.

The problem I sought to address was to improve the accessibility of our codebase's Select menu. This component had a few accessibility related issues with it such as not correctly implementing keyboard navigation and selection of its options. These issues stemmed partly from the fact that the component was built as a *custom* select menu, but not with accessibility in mind. Ideally a solution would be to create a new component that used the native `<select>` element, however what prevented this solution was the fact that the Select component had custom children in both its button and options.

It's worth mentioning here that the native elements of the web platform have restrictions on how they can be used. For example, the native `<button>` element cannot have block level children or other interactive elements inside of it. In the case of the `<select>` menu, its children must be `<option>` elements, and those `<option>` elements may only contain text. The `<option>` elements may have a `value` attribute that differs from its child text and may have a `selected` property signifying that a single `<option>` in the list of options it is the currently selected option.

Because the existing Select component in our codebase accepted custom content for its button (what you click on to open the select and view its list of options) as well as its equivalent of the `<option>` element, this meant I could not use the native `<select>` element when refactoring the component. Thus I looked to implementing the expected behavior of the native `<select>` using ARIA attributes and TypeScript (aside: our codebase is written in React and TypeScript with some "CSS in JS" sprinkled on top).

"No problem" so I thought, I'll just look to the [WAI's ARIA Authoring Practices Guide][wai-apg]'s excellent list of [patterns][wai-apg-patterns] for implementing common UI components. Thankfully, there is a [ComboBox][wai-apg-combobox] pattern and particularly a ["Select Only ComboBox"][wai-apg-select-only] which is very similar to the web platform's native `<select>` element. Looking over this pattern, in all of its beautifully spec'd out glory I thought "Teriffic! I've found my solution to our problem!". Turns out, not so fast.

[wai-apg]: https://www.w3.org/WAI/ARIA/apg/
[wai-apg-patterns]: https://www.w3.org/WAI/ARIA/apg/patterns/
[wai-apg-combobox]: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
[wai-apg-select-only]: https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html

{% highlight jsx %}
<div>Bla</div>
{% endhighlight %}

Talking about:
- rationale: addressing a11y debt in a codebase
- how it got to be that way

- custom vs. native select
	- what a select is
	- what a combobox is
	- variants of a combobox (autocomplete and others on the APG)
	- variants of a select (multi-select)
	- compared to a "dropdown" menu
	- why one vs. the other (UX, custom stuff in the options)

- ARIA
  - first rule of ARIA
	- roles, states
	- doesn't implement, only describes
	- accessibility tree

- Keyboard navigation
	- tab vs. arrow keys
	- type ahead
	- escape
	- space, enter
- focus management
- option states: active, disabled, selected, hovered
- screen reader testing
- browser + screen reader combinations
- touch screens

References:
- Select your poison parts 1 & 2
- Styling the native select element with CSS
- Inclusive Components
- WAI APG Patterns
- A11Y Slack
