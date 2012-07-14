/*

Headcase.js (Uses matchMedia() polyfill by Scott Jehl, Paul Irish, Nicholas Zakas)
===

Usage
-----

Include headcase.js in your page. You can now write named media queries in your <head> and reuse them in your css and javascript.

Write a query like this:

    <meta name='case' data='NAME' media='(max-width:350px)' /> (Read http://mattwilcox.net/archive/entry/id/1091/)

Use it like this in your css:

    .case-NAME h1 {
      border: 5px dashed orange;
    }

A class of case-NAME will be added to the <html> element if there is a match, also window.caseList will be added in javascript.

NOTE: Headcase.js needs to be included after any media query meta tags, or they cannot be seen by the script.

*/


/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia = window.matchMedia || (function(doc, undefined){

  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';

    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth === 42;
    docElem.removeChild(fakeBody);

    return { matches: bool, media: q };
  };

}(document));



/* Headcase */

function checkCases() {
  var caseList = [];
  var data;
  var media;
  var matches;

  var cases = document.querySelectorAll('meta[name=case]');

  for (var i = 0; i < cases.length; i++) {

    caseList[i] = {};

    data = cases[i].getAttribute('data');
    media = cases[i].getAttribute('media');
    matches = window.matchMedia(media).matches;

    if (matches) {
      document.documentElement.classList.add('case-' + data);
    }
    else {
      document.documentElement.classList.remove('case-' + data);
    }

    caseList[i].data = data;
    caseList[i].media = media;
    caseList[i].matches = matches;

  };

  return caseList;
}
function logCases() {
  console.log('window.caseList:', window.caseList);
  console.log('<html> classList:', document.documentElement.classList.toString());
}

window.caseList = checkCases();

window.addEventListener('resize', function() {
  window.caseList = checkCases();
//  logCases();
})
//logCases();