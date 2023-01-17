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

When developing User Interface components, developers sometimes face the choice of either using the web platform's native elements, for example a `<button>`, or rolling their own custom component, perhaps a clickable `<div>` element (aside: it's really better **to not to do the latter**, more on why later). While the rationale, logical, and arguably ethical thing to do is to use the web platform option, there are circumstances where developers find themselves in the position of having to go the custom route. This is something I experienced recently in my current role and honestly did not expect to find myself going down a rabbit hole about it or the solution to be so complex. In this post I'll talk about the problem I encountered, what the options I found to solve it were, and what I and my team decided upon doing to resolve the issue.

The problem I sought to address was to improve the accessibility of our codebase's select menu component. This component had a few accessibility related issues with it such as not correctly implementing keyboard navigation and selection of its options via the keyboard. These issues stemmed partly from the fact that the component was built as a custom select menu from the start, without accessibility in mind. The "happy path" for fixing this would be to create a new component that uses the native `<select>` element. What prevented us from going with this solution was the fact that our existing Select component allowed for custom children (specifically React's `ReactNode` type) in both its button and options sub-components.

It's worth mentioning here that the native elements of the web platform have restrictions on how they can be used, and for logical reasons. For example, the native `<button>` element cannot have block level children or other interactive elements inside of it because our understanding of a button is is that they are meant to have a label and/or icon, not something else like an animated GIF as it would then cease to resemble a button (semantics are important!). In the case of the `<select>` menu, its children may only be `<option>` elements, and those `<option>` elements may only contain text as their child. The `<option>` element may have a `value` attribute that differs from its child text and may have a `selected` property signifying that it is the currently selected option out of the bunch in the list.

Because the existing Select component in our codebase accepted custom content for its button (here I'm using "button" to refer to what you click on or use a key press on to open the select and view its list of options) as well as its equivalent of the `<option>` element, this meant I could not use the native `<select>` element for refactoring the component. Thus I looked to implementing the expected behavior of the native `<select>` using [ARIA](#) attributes and TypeScript (aside: our codebase is written in React and TypeScript with some "CSS in JS" sprinkled on top).

"No problem" so I thought, I'll just look to the internet's "gold standard" of advice on how to implement and use ARIA: the [WAI's ARIA Authoring Practices Guide][wai-apg] which has an excellent list of [patterns][wai-apg-patterns] for implementing common UI components on the web. Thankfully, there is even a [ComboBox][wai-apg-combobox] pattern and in particular, a ["Select Only ComboBox"][wai-apg-select-only] which is meant to mimic the web platform's native `<select>` element, with the added benefit that one could customize it a bit further (for example add custom content in its options and button). Looking over this pattern, in all of its beautifully spec'd out glory, I thought "Terrific! I've found the solution to our Select component's problems!". Not so fast.

After spending some time porting the [WAI APG's example code][select-only-codepen] (written in HTML, CSS, and vanilla JavaScript) to [React][react-select-only-tippy-codesandbox], I decided to test things out using screen reader software. Using a Windows Machine with NVDA installed on it, I tried the React code out and all seemed to work as expected. Navigating via the keyboard to the component read aloud "Select a Fruit, Combobox, Apples". As I used my keyboard to open the list of options NVDA told me the ComboBox was open. When I used my up and down arrow keys to navigate the list of options, their text was read aloud with their position (e.g. "3 of 12"), and whether they were "selected". So far so good!

Next, I decided to try testing the code I'd ported to React using VoiceOver on Safari on my MacBook. To my dismay, I discovered that this example did not work with VoiceOver! When opening the list of options, nothing was announced. Ditto when navigating the list of options and making a selection with my keyboard. "Clearly there must be something wrong with my code, so I'll test this on the original WAI APG's code" I thought to myself. Unfortunately I encountered the same set of issues. How could it be that this ARIA pattern sanctioned by the WAI was flawed? Why would such an example be so prominently displayed on the ARIA patterns part of their site? "There must be an explanation" I told myself as I sought to look for answers. I did find answers, but it only made the plot thicken.

Perhaps I should ask around in the A11Y Slack my co-worker recently told me about.

[wai-apg]: https://www.w3.org/WAI/ARIA/apg/
[wai-apg-patterns]: https://www.w3.org/WAI/ARIA/apg/patterns/
[wai-apg-combobox]: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
[wai-apg-select-only]: https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html
[select-only-codepen]: https://codepen.io/clhenrick/pen/yLEGEvO
[react-select-only-tippy-codesandbox]: https://codesandbox.io/s/react-combobox-select-only-with-tippy-58p0v1

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
