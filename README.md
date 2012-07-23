# Headcase.js

## Reusable Media Queries in Your &lt;head&gt;


[This article](http://mattwilcox.net/archive/entry/id/1091/) by Matt Wilcox pretty much explains the idea, but basically, headcase came to be so you could use this stuff for real:

    <head>
      <meta name='case' content='breakpoint1' media='(min-width:350px)' />
      <meta name='case' content='breakpoint2' media='(min-width:1000px)' />
    </head>

By defining the media queries in the <code>&lt;head&gt;</code> of your document, they'll be reusable in css and javascript. In css, you can use regular descendant selectors instead of media queries. This simplifies the syntax and removes the need to ever copy & paste the same query in multiple places. In javascript, you can use <code>caseChange</code> events to respond to media changes.


## Usage

Include <code>headcase.js</code> in your page. You can now write named media queries in your <code>&lt;head&gt;</code> and reuse them in your css and javascript.

### Write a case

    <meta name='case' content='NAME' media='(max-width:350px)' />

### Use in CSS

    .case-NAME h1 {
      border: 5px dashed orange;
    }

If a named media query matches, a class of <code>case-NAME</code> will be added to the <code>&lt;html&gt;</code> element.

### Use in Javascript

    document.addEventListener('DOMContentLoaded', function() {

      //Handle a particular case change
      var case = document.getElementById('small'); //The meta element that defined the case
      case.addEventListener('caseChange', function(event) {
        console.log('case small:', event.detail.matches);
      }, false);

      //Handle any case change
      document.addEventListener('caseChange', function(event) {
        console.log('caseChange.detail', event.detail);
      }, false);

    }, false);

The cases are re-checked whenever a <code>resize</code> or an <code>orientationchange</code> event is fired. All cases fire an initial event right after <code>DOMContentLoaded</code>, so you can attach event listeners inside your own <code>DOMContentLoaded</code> and do stuff based on cases when the page loads. When a media query defined in a case matches, or no longer matches, an event is dispatched, with the new state of the case in <code>event.detail.matches</code>.


Compatibility
---

So far tested to work on Internet Explorer 9 and the latest versions of Safari, Firefox, Chrome, Opera.


TODO
---

- Testing, testing and testing
- Test older versions of Safari, Firefox and Opera and IE for graceful exit
- Should separate window.headcase.cases and html class updating from event firing. On init the cases and classes should be updated immediately, but events fired only after DOMContentLoaded
- Should there be separate events for when a query becomes true and when it becomes false? There's now just a caseChange event per case, that contains the matches property.
- Now that the events seem doable in a cross browser way, should the class stuff on the html element be removed? Since you can easily bind your own caseChange events, it's trivial to make your own class modifier.

Further reading
---

- [Managing responsive designs is hard, so let's use our &lt;head&gt;](http://mattwilcox.net/archive/entry/id/1091/)
- [Conditional CSS](http://adactio.com/journal/5429/)
- [Named media queries](http://foolproof.me/post/26907878219/named-media-queries)
- [matchMedia() polyfill](https://github.com/paulirish/matchMedia.js)
- [MediaQueryList (MDN)](https://developer.mozilla.org/en/DOM/MediaQueryList)
- [Use CSS transitions to link Media Queries and JavaScript](http://www.paulrhayes.com/2011-11/use-css-transitions-to-link-media-queries-and-javascript/)