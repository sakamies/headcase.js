Headcase.js
===

Reusable Media Queries in Your &lt;head&gt;
---

[This article](http://mattwilcox.net/archive/entry/id/1091/) by Matt Wilcox pretty much explains the idea, but basically, headcase came to be so you could use this stuff for real:

    <head>
      <meta name='case' data='breakpoint1' media='min-width:350px' />
      <meta name='case' data='breakpoint2' media='min-width:1000px' />
    </head>

Usage
-----

Include <code>headcase.js</code> in your page. You can now write named media queries in your <code>&lt;head&gt;</code> and reuse them in your css and javascript. All <code>&lt;meta name="case"&lt;</code> elements need to be placed before <code>headcase.js</code> and all scripts using queries parsed by <code>headcase.js</code> need to be placed after <code>headcase.js</code>.

Write a named query like this:

    <meta name='case' data='NAME' media='(max-width:350px)' />

Use it like this in your css:

    .case-NAME h1 {
      border: 5px dashed orange;
    }

If a named media query matches, a class of <code>case-Name</code> will be added
A class of case-NAME will be added to the &lt;html&gt; element if there is a match, also window.caseList will be added in javascript.


Pros:

- Write media queries only once and reuse them in your css and js
- Cleaner css, no more @media rules, just regular selectors

Cons:

- Script needs to be after <meta> elements
- Any script using these media queries needs to come after headcase.js
- Help me out here?


Compatibility
---

So far tested on, and seems to work on the latest Safari, Chrome, Firefox and Opera.


TODO
---

- Should probably use/make a MediaQueryList polyfill instead of a new property on window (https://developer.mozilla.org/en/DOM/MediaQueryList)
  - Use listeners for changing state instead of resize event, there's already some work on that (http://www.paulrhayes.com/2011-11/use-css-transitions-to-link-media-queries-and-javascript/)
- Testing, testing and testing
- Cross browser complatibility.
- Get rid of those global functions
- Better readme


Further reading
---

- [Managing responsive designs is hard, so let's use our &lt;head&gt;](http://mattwilcox.net/archive/entry/id/1091/)
- [Conditional CSS](http://adactio.com/journal/5429/)
- [Named media queries](http://foolproof.me/post/26907878219/named-media-queries)
- [matchMedia() polyfill](https://github.com/paulirish/matchMedia.js)
- [MediaQueryList (MDN)](https://developer.mozilla.org/en/DOM/MediaQueryList)
- [Use CSS transitions to link Media Queries and JavaScript](http://www.paulrhayes.com/2011-11/use-css-transitions-to-link-media-queries-and-javascript/)