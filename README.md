Headcase.js
===

Reusable Media Queries in Your &lt;head&gt;
---

[This article](http://mattwilcox.net/archive/entry/id/1091/) by Matt Wilcox pretty much explains the idea, but basically, headcase came to be so you could use this stuff for real:

    <head>
      <meta name='case' data='breakpoint1' media='(min-width:350px)' />
      <meta name='case' data='breakpoint2' media='(min-width:1000px)' />
    </head>

By defining the media queries in the <code>&lt;head&gt;</code> of your document, they'll be reusable in css and javascript. In css, you can use regular descendant selectors instead of media queries. This simplifies the syntax and doesn't require changing the same query in multiple places if you need to use different rules based on queries apart from each other. In javascript, you can use <code>caseChange</code> events to respond to media changes.

Headcase itself is just a few lines of code, please dive in and make it better. :)

Usage
-----

Include <code>headcase.js</code> in your page. You can now write named media queries in your <code>&lt;head&gt;</code> and reuse them in your css and javascript. Note that <code>&lt;meta name="case"&gt;</code> elements need to be placed before <code>headcase.js</code>.

Write a named query like this:

    <meta name='case' data='NAME' media='(max-width:350px)' />

Use it like this in your css:

    .case-NAME h1 {
      border: 5px dashed orange;
    }

If a named media query matches, a class of <code>case-NAME</code> will be added to the <code>&lt;html&gt;</code> element.

Use it in javascript javascript like this:

    document.addEventListener('caseChange', function(event) {
      caseName = event.detail.caseName;
      matches = event.detail.matches;
    });

The cases are checked whenever a <code>resize</code> or an <code>orientationchange</code> event is fired. All cases also fire an event right after <code>DOMContentLoaded</code>, so you can attach event listeners on <code>DOMContentLoaded</code> and do stuff based on cases when the page loads. When a media query defined in a case matches, or no longer matches, an event is dispatched, with the new state of the case in <code>event.matches</code>.


Compatibility
---

So far tested on Safari, Firefox, Chrome and Opera. Css works on all these, but custom events are not yet supported on Safari. No IE testing done yet.


TODO
---

- Find a polyfill for custom events. jQuery would work, but i'd like to avoid dependencies, might be necessary if there starts to be a need for more polyfills.
- The logic here assumes the list of cases stays exactly the same once it's been created, should there be the possibility to add or remove cases, if so, how? An API would be fine, but wouldn't see changes if meta elements were added by other means. Is there a way to detect that, is it worthwhile to do so?
- window.caselist object should not be used in authored javascript. It's correctness at any given time cannot be guaranteed (If you try to check the caseList in your own resize event handler, the resize event that checks the cases could be done running, or it might not, who knows.), so it's only used internally by headcase for keeping track if the state of a query has changed. The meta elements are the canonical caseList for authors to use, and can be accessed and tested with normal DOM methods. Like so: window.matchMedia(caseNode.getAttribute('media')); Events are dispatched any time the state of a case changes. Only the events should be used in scripts.
- Discard window.caseList and use window.headcase instead. Would make it's more obvious that the object is for the script, not for common use. Also should put all the functions inside there so they're not global.
- Testing, testing and testing
- Cross browser compatibility (I hate IE)


Further reading
---

- [Managing responsive designs is hard, so let's use our &lt;head&gt;](http://mattwilcox.net/archive/entry/id/1091/)
- [Conditional CSS](http://adactio.com/journal/5429/)
- [Named media queries](http://foolproof.me/post/26907878219/named-media-queries)
- [matchMedia() polyfill](https://github.com/paulirish/matchMedia.js)
- [MediaQueryList (MDN)](https://developer.mozilla.org/en/DOM/MediaQueryList)
- [Use CSS transitions to link Media Queries and JavaScript](http://www.paulrhayes.com/2011-11/use-css-transitions-to-link-media-queries-and-javascript/)