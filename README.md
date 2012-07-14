Headcase.js
===

Reusable Media Queries in Your &lt;head&gt;
---

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

- Should probably use a MediaQueryList polyfill instead of a new property on window (https://developer.mozilla.org/en/DOM/MediaQueryList)
  - Use listeners for changing stat instead of resize event, there's already some work on that (http://www.paulrhayes.com/2011-11/use-css-transitions-to-link-media-queries-and-javascript/)
- Testing, testing and testing
- Cross browser complatibility.
- Get rid of those global functions


What made me do this and further reading
---

http://mattwilcox.net/archive/entry/id/1091/
http://adactio.com/journal/5429/
http://foolproof.me/post/26907878219/named-media-queries
https://github.com/paulirish/matchMedia.js