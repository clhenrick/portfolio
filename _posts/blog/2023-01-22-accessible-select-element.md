---
title: "Custom and Accessible Select Menus Aren't Easy: Part One"
layout: page
header: no
date: 2023-01-22
teaser: "Trials and tribulations of building a custom and accessible Select menu UI component."
comments: true
tags:
  - HTML
  - CSS
  - A11Y
  - Accessibility
  - React
---

_Last updated on February 5, 2023_

## Introduction

When developing User Interface components, developers sometimes face the choice of either using the web browser's native HTML elements or rolling their own custom component. As a contrived example one might choose between a native HTML `<button>` element or a `<div>` element that's been styled to look like a button and respond like a button when one clicks it (_Aside: it's really better **to not to do the clickable div approach**, more on why later_).

While the rationale, logical, and arguably ethical thing to do is to almost always use the native HTML option, there are circumstances where developers find themselves in the position of having to go the custom route. Choosing to write custom components could be the result of product design requirements. For example, some common component patterns are still not available as native HTML elements, such as tabs. Other times choosing to write a custom component may result from a developer or designer not considering all types of users interacting with their website or app, for example people that navigate the web solely using the keyboard and without a mouse due to physical limitations, or visually impaired folks that rely on using screen reader software to use the web.

This is a conundrum I experienced recently in my current role at Esri and in all honestly I did not expect to find myself going down a rabbit hole to find a solution to what I naively assumed wasn't too difficult of a problem. In this post I'll talk about the problem I encountered when looking to write a custom `Select` component, and what the options I found to solve it were. In part two I'll discuss what I and my team decided upon doing to resolve the issue.

## Potential Pitfalls of UI Component Composition

The original problem I sought to address was to improve the accessibility of our codebase's existing `Select` menu component. This component had a few accessibility related issues with it, such as not correctly implementing ARIA, keyboard navigation, and focus management. These issues stemmed partly from the fact that the component in question was built as a custom select menu from the start and that it happened to wrap our `DropDown` menu component. In component oriented UI libraries (such as React.JS) wrapping components to create new components is a common technique for enhancing or extending a component to do something else, perhaps something more than it was originally intended to do. Because React encourages [composition over inheritance][react-composition], a developer may take an existing component and render it inside a new component with some additional features, styling, and/or behavioral modifications tacked on to solve a product requirement for a new component or variant of an existing component.

To briefly illustrate this technique let's say you need a button component, but you also need variants of this button component such as "primary", "secondary", and "tertiary" to match your team's design system or style guide. Each of these button variants requires unique styling as well as to handle options for different sizes (say large, medium, and small), various states (such as disabled or pressed), handle an `aria-label` when displaying an icon, etc. With component composition, instead of using a single button component to handle all the possible permutations of variant styles and options, you might first create a `<ButtonBasic />` component which is intended to be wrapped by all subsequent variant button components. This "basic button" component might handle things all the variants have in common, such as removing the default browser button styling, providing a shared properties interface, implementing a more accessible friendly disabled state that uses `aria-disabled` instead of the `disabled` property, etc.

{% highlight jsx %}
// ButtonBasic.jsx

// styles common to all button variants
import "./buttonBasic.css";

// the basic button component that all button variants will use
export const ButtonBasic = (props) => {
  const handleClick = (event) => {
    if (props.isDisabled) {
      event.preventDefault();
    } else {
      props.onClick(event);
    }
  };

  const handleKeyDown = (event) => {
    if (props.isDisabled) {
      event.preventDefault();
    } else {
      props.onKeyDown(event);
    }
  };

  return (
    <button
      className={props.className}
      aria-label={props.ariaLabel}
      aria-disabled={props.isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {props.children}
    </button>
  );
};
{% endhighlight %}

Now when you create a primary button component, you render the basic button component and include code specific to the primary button's styles and behavior, including passing down any common properties to the basic button it renders. From a software development perspective this helps make your code more "DRY" and modularized, hopefully making it easier to maintain in the longterm.

{% highlight jsx %}
// ButtonPrimary.jsx

// styles exclusive to the primary button, perhaps name spaced
// under the `.Button-Primary` CSS class name.
import "./buttonPrimary.css";

import { ButtonBasic } from "./ButtonBasic.jsx";

// assume ButtonPrimary accepts the same props as ButtonBasic
export const ButtonPrimary = ({ className, ...otherProps }) => {
  const classNames = className
    ? "Button-Primary" + " " + className
    : "Button-Primary";
  return <ButtonBasic className={classNames} {...otherProps} />;
};
{% endhighlight %}

Imagine repeating the above code for the other button variants, secondary and tertiary, or even using it for a new button type such as a `<ButtonLoading />` that displays a loading animation inside it after being clicked on and then stops the animation once something has finished loading.

**_Aside:_** _I know many UI developers who use React have opinions on how to implement component libraries and may not agree 100% with this example, but bare with me as I'm only using it to describe one way of how component composition is used to someone who may not be familiar with it, or to give it a name to someone who has used it but hasn't heard the term "composition" to describe it before._

While there's nothing wrong about this approach (assuming it's done cautiously and thoughtfully) it can easily become abused if care is not taken. Take for example the concept of a "dropdown" menu. The concept of something that "drops down" in User Interface design has different meanings. It could be a submenu that "drops down" below a button in a navigation menu when clicked on. It might be a select menu that displays a list of options after a user opens it. Maybe a developer sees such an existing "dropdown" component in the codebase and thinks "I could use this dropdown component for a dialog menu I need to create (e.g. a popup that appears when clicking on a button somewhere in the UI) because it already handles the behavior I need." Naively speaking, these various "dropdown" patterns sound like they're similar enough that they can use the same underlying component (one that implements the "dropdown" or popup behavior). When taking a closer look however, it is apparent that each of these types of UI components have different semantics and accessibility requirements.

What becomes a problem is if for example the underlying shared component in all of these types of dropdown variants allows for any type of child component(s) to be rendered within it in almost any kind of surrounding UI context. Questions around usability and accessibility immediately surface such as: How do you correctly implement focus management? How do you handle keyboard navigation? What about dynamically adding the correct ARIA attributes for each use case and context? Should multiple instances of the dropdown variants be allowed to be open simultaneously? If not well thought through then overusing the component "composition" pattern can easily lead to usability and accessibility problems in your website or app, especially if you start wrapping components multiple levels deep and sprinkling their instances all over the app's UI making it difficult to track them down later.

## Getting Solution Oriented

Going back to the case of the `Select` component, the "happy path" for improving accessibility would be to create a new component that uses the browser's native `<select>` and `<option>` HTML elements. These elements offer the best accessibility support across screen reader, browser, operating system, and device combinations. What (initially) prevented us from going with this solution was that our existing `Select` component allowed for custom children (custom meaning React's `ReactNode` type) in both its button and `Option` sub-components which the native `<select>` and `<option>` HTML elements do not support.

It's worth mentioning here that native elements of web browsers have restrictions on how they can be used, and for logical reasons. For example, the native `<button>` element cannot have block level children or other interactive elements inside of it because our understanding of a button is that it is meant to have a label and/or icon to convey its intent or affordance, not something else like an animated GIF, presumably as it would then cease to resemble a button (semantics are important!). In the case of the `<select>` menu, its children may only be `<option>` elements, and those `<option>` elements may only contain text as their child. The `<option>` element may have a `value` attribute that differs from its child text and may have a `selected` property signifying that it is the currently selected option out of the bunch in the list. (MDN is a good reference for reading more about the [select element][mdn-select-element].) One could argue that this restriction of the native `<select>` element is a pitfall of the web platform, but unfortunately it's what we're stuck with if we're going the native / semantic HTML route.

Because the existing `Select` component in our codebase accepts custom content for its button (here I'm using "button" to refer to the element you click on or use a key press on to open the select and view its list of options) as well as its equivalent of the `<option>` element, I could not use the native `<select>` element for refactoring the component. Thus I looked to implementing the expected behavior of the native `<select>` in a new custom `Select` component (one that did not wrap our `DropDown` component) using [ARIA][mdn-aria] attributes to implement semantics and TypeScript for interactions such as click handlers, keyboard navigation, and focus management.

"No problem" so I thought, I'll look to the internet's "gold standard" of advice on how to implement and use ARIA, keyboard navigation, and general UX patterns for accessibility: the [W3C's WAI ARIA Authoring Practices Guide][wai-apg]. The WAI APG has an excellent list of [patterns][wai-apg-patterns] for implementing common UI components on the web (with a focus on accessibility) such as Image Carousels, Tabs, Tooltips, etc. There is even a [ComboBox][wai-apg-combobox] pattern and in particular, a ["Select Only Combobox" variant][wai-apg-select-only] which (from what I can tell) is intended to mimic the web browser's native `<select>` element. This `Combobox` pattern has the added benefit that one could customize it a bit further (for example to add custom content in its options and button). Looking over this pattern, in all of its beautifully detailed specification glory, I thought "Terrific! I've found the solution to our `Select` component's problems!" Or so I thought.

After spending some time porting the [WAI APG's example code][select-only-codepen] (written in HTML, CSS, and "vanilla" JavaScript) to React, I decided to do manual accessibility testing on it using screen reader software. Using a Windows computer with the [NVDA][nvda] screen reader installed on it and the Chrome web browser, I tried the React code out and all seemed to work as expected. Navigating via the keyboard to the component read aloud "Select a Fruit, Combobox, Apples". As I used my keyboard to open the list of options NVDA told me the ComboBox was open. When I used my up and down arrow keys to navigate the list of options, their text was read aloud with their position (e.g. "3 of 12"), and whether they were "selected". So far so good!

Here's the implementation / prototype of the WAI APG's "Select-Only" Combobox in React (note it uses [tippy.js][tippy-js] via [@tippy/react][tippy-react] as we use this library elsewhere in our codebase for handling UI that requires dropdowns, pop-ups, and tooltips):

<iframe src="https://codesandbox.io/embed/react-combobox-select-only-with-tippy-58p0v1?fontsize=14&hidenavigation=1&theme=dark&view=preview"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="React ComboBox Select-Only"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

You may view the above demo in [CodeSandbox][react-select-only-tippy-codesandbox] or in a [separate window without the editor](https://58p0v1.csb.app/).

Next, I decided to try testing the code I'd ported to React using the [VoiceOver screen reader](voiceover) on Safari on my MacBook. To my dismay, I discovered that this example did not work with VoiceOver! When opening the list of options, nothing was announced. Ditto when navigating the list of options and making a selection with my keyboard. "Clearly there must be something wrong with my code, so I'll do a test with VoiceOver on the original WAI APG example code" I thought to myself. Unfortunately I encountered the same set of issues. How could it be that this ARIA pattern sanctioned by the W3C's WAI was flawed? Why would such an example be so prominently displayed and documented on the ARIA patterns part of their APG site if it didn't work across commonly used screen reader software? "There must be an explanation" I told myself as I sought to look for answers. I did find answers, but it only made the plot thicken.

Long story short, it turns out that the "Select-Only" `Combobox` pattern from the WAI APG relies on the [aria-activedescendant attribute][mdn-aria-active-descendant], which (at the time of this writing) is not fully supported in VoiceOver on Safari on MacOS due to [a bug in WebKit][webkit-bug]. The `aria-activedescendant` ARIA attribute is used in the `Combobox` to inform assistive technology (AT) such as screen readers which option is active / "visually focused" (different from the "selected" option) when navigating the list of options via the keyboard. This is important as it enables the `Combobox` component to maintain focus while the navigation of its option elements occurs. The native `<select>` HTML element behaves similarly; if you focus it using your keyboard (e.g. by tabbing to it), open its list of options (by pressing the spacebar), and then use your up and down arrow keys to navigate the list of `<options>`, you'll see that after selecting an option focus remains on the `<select>` element:

<style>
	.basic-select select,
	.basic-select label,
	.basic-radios label {
		appearance: initial;
	}
	.basic-select label,
	.basic-radios label {
		color: inherit;
		margin-bottom: 0.6rem;
	}
	.basic-radios input {
		padding-right: 1rem;
		margin: 0;
	}
	.basic-radios legend {
		color: inherit;
		background-color: inherit;
	}
</style>

<fieldset class="basic-select">
	<label for="fruits-list">Pick a fruit</label>
	<select id="fruits-list">
		<option>Apples</option>
		<option>Oranges</option>
		<option>Grapes</option>
		<option>Pears</option>
		<option>Durians</option>
	</select>
</fieldset>

In fact it is recommended for all interactive UI components that contain interactive child elements that the keyboard arrow keys be used to navigate through their children, while the Tab key is reserved for focusing in and out of the component. Another example of this is radio button groupings:

<fieldset class="basic-radios">
	<legend>Pick a fruit</legend>
	<input id="apples" type="radio" name="fruits"><label for="apples">Apples</label>
	<input id="oranges" type="radio" name="fruits"><label for="oranges">Oranges</label>
	<input id="grapes" type="radio" name="fruits"><label for="grapes">Grapes</label>
	<input id="pears" type="radio" name="fruits"><label for="pears">Pears</label>
	<input id="durians" type="radio" name="fruits"><label for="durians">Durians</label>
</fieldset>

With the legacy Select component in our team's codebase, one would have to use the `Tab` and `Shift` + `Tab` keys to navigate between the list of options. The problem with this approach is that it moves focus out of the Select component, to its list of options, and then to the first option in the list. When an option is selected using the keyboard, focus does not return to the Select and is lost which is disorienting for users of assistive tech like screen readers. Furthermore, when using a screen reader, the `Select` component is not announced as a "combobox" as it should be and is instead announced as a "menu", another aspect that is likely to result in confusion of the component's intent or affordance.

In both the native `<select>` and `Combobox`, the `Tab` key will move focus completely out of the element / component to the next focusable element in the DOM. Effectively, the common pattern for components that have children which are navigable is that the keyboard arrow keys should be used to navigate between them and not the `Tab` key. Instead, by using `Tab` to navigate between a component's children, we not only create a disorienting experience for someone using a screen reader but also make using a keyboard to fill out forms more cumbersome for someone who is a keyboard user, even if they do not have a vision impairment.

## On using ARIA vs. semantic HTML

As for the Select-Only ComboBox's pitfalls with the VoiceOver screen reader on MacOS; to the WAI APG's credit, they do have a banner on each of their examples warning the visitor of their site that their ARIA patterns are not production ready and should be tested prior to using them. They also make it clear that the first rule of ARIA is "No ARIA is better than bad ARIA." In other words, by using ARIA incorrectly you can actually create a degraded experience for someone using assistive technology like a screen reader. This is because ARIA is powerful; it overrides the default semantics of HTML and modifies the [accessibility tree][accessibility-tree] which is what is used by screen readers to interact with the DOM.

<figure>
  <img alt="screen capture of the WAI APG pattern disclaimer" src="{{site.urlimg}}wai-apg-pattern-warning.jpg">
  <caption>The disclaimer that appears on each of the WAI APG's patterns.</caption>
</figure>

One example of the power of ARIA can be demonstrated with the `<button>` element. For example, let's assume we have an icon button with no label, perhaps there's a pen icon within the button to convey that it enables an "edit" mode for a web application similar to Confluence:

{% highlight html %}
<button>
  <svg>
    <!-- icon svg code here -->
  </svg>
</button>
{% endhighlight %}

Without the help of `ARIA` (or a "visually hidden" label within the button that is accessible to screen readers), someone using a screen reader would only hear "button" when navigating to this "edit" button. By adding `aria-label="edit"` to the button, a screen reader would instead announce "edit button" which makes the purpose of the button clear to a user who cannot actually see the button's icon. Furthermore, adding the attribute `aria-pressed="false"` and then changing it to `aria-pressed="true"` when it is clicked conveys to the screen reader user that it is a toggle button:

{% highlight html %}
<button aria-label="edit" aria-pressed="false">
  <svg>
    <!-- icon svg code here -->
  </svg>
</button>
{% endhighlight %}

The native `<button>` element has other accessible benefits. For example it has an implicit role of "button" and also handles key press related events such as using the space bar and enter keys to "click" the button with your keyboard. It is focusable and contains a default CSS `:focus` style. These features are built into the button element because it is part of _semantic HTML_, unlike a `<div>` or `<span>` element which have _no semantic meaning_. This is why one should always use the native `<button>` element (and prefer semantic HTML in general) rather than style a `<div>` or `<span>` to look like a button with an added "click" event handler on it. Doing this will not make the "button like" element focusable (or easily discoverable) to keyboard users, nor will it be conveyed as a button to screen reader users if they do find it, nor will it be "clickable" via the keyboard. We get all these things for free by just using the native `<button>` HTML element.

## Credits

Before ending this post I'd like to mention that in researching custom select menu patterns I happened to stumble upon [Sarah Higley][sarah-higley]'s very in-depth article [Select Your Poison (part two)][select-your-poison-2]. Sarah did an incredible amount of research, including actual user testing of various custom select and combobox UI patterns with people who use screen readers, and generously reported her findings in the aforementioned article. Long story short, the best option in terms of accessibility for a select menu happens to be the native `<select>` HTML element! However, in a dramatic twist, Sarah reports that making the native select a multi-select via `<select multiple>` actually results in a degraded user experience for people that use screen readers.

The moral of the story to me here is always make sure to test your components, even if you are using the native, semantic HTML element. The web is a complicated place!

## Next

In part two of this blog post I'll describe what we ended up doing to solve our `Select` component conundrum. Thanks for reading!

[accessibility-tree]: https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree
[mdn-aria]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
[mdn-aria-active-descendant]: https://developer.mozilla.org/en-US/docs/web/Accessibility/ARIA/Attributes/aria-activedescendant
[mdn-aria-controls]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls
[mdn-select-element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
[nvda]: https://www.nvaccess.org/
[wai-apg]: https://www.w3.org/WAI/ARIA/apg/
[wai-apg-patterns]: https://www.w3.org/WAI/ARIA/apg/patterns/
[wai-apg-combobox]: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
[wai-apg-select-only]: https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html
[sarah-higley]: https://sarahmhigley.com/
[select-only-codepen]: https://codepen.io/clhenrick/pen/yLEGEvO
[select-your-poison-2]: https://www.24a11y.com/2019/select-your-poison-part-2/
[tippy-js]: https://www.npmjs.com/package/tippy.js/v/6.2.5
[tippy-react]: https://www.npmjs.com/package/@tippyjs/react
[react-composition]: https://reactjs.org/docs/composition-vs-inheritance.html
[react-select-only-tippy-codesandbox]: https://codesandbox.io/s/react-combobox-select-only-with-tippy-58p0v1
[voiceover]: https://support.apple.com/guide/voiceover/welcome/mac
[webkit-bug]: https://bugs.webkit.org/show_bug.cgi?id=161734
