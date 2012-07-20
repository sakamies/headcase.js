/*
Headcase.js (Uses matchMedia() polyfill by Scott Jehl, Paul Irish, Nicholas Zakas)
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

window.headcase = {};
window.headcase.cases = {};

window.headcase.update = function () {

  var caseNodes = document.querySelectorAll('meta[name=case]');
  var cases = {};
  var caseNode;
  var caseName;
  var media;
  var matches;

  for (var i = 0; i < caseNodes.length; i++) {
    caseName = caseNodes[i].getAttribute('content');

    cases[caseName] = {};
    cases[caseName].node = caseNodes[i];
    cases[caseName].media = caseNodes[i].getAttribute('media');
    cases[caseName].matches = window.matchMedia(cases[caseName].media).matches;

    if (typeof window.headcase.cases[caseName] == 'undefined') {
      cases[caseName].prevMatches = 'undefined'
    }
    else {
      cases[caseName].prevMatches = window.headcase.cases[caseName].matches;
    }
    //console.log('prev:', cases[caseName].prevMatches, 'new:', cases[caseName].matches);
  };

  for (caseName in cases) {

    // Put the case immediately into window.headcase.cases
    window.headcase.cases[caseName] = {};
    window.headcase.cases[caseName].node = cases[caseName].node;
    window.headcase.cases[caseName].media = cases[caseName].media;
    window.headcase.cases[caseName].matches = cases[caseName].matches;

    //Add classes to <html>
    if (cases[caseName].matches) {
      document.documentElement.classList.add('case-' + caseName);
    }
    else {
      document.documentElement.classList.remove('case-' + caseName);
    }

    /* Dispatch caseChange events */


    if (typeof CustomEvent != 'undefined' && cases[caseName].prevMatches != cases[caseName].matches) {
      var caseChangeEvent = new CustomEvent(
        "caseChange",
        {
          detail: {
            caseName: caseName,
            media: cases[caseName].media,
            matches: cases[caseName].matches,
            caseNode: cases[caseName].node
          },
          bubbles: true,
          cancelable: false
        }
      );
      cases[caseName].node.dispatchEvent(caseChangeEvent);

    }
    else if (typeof document.createEvent('HTMLEvents') != 'undefined' && cases[caseName].prevMatches != cases[caseName].matches) {
      var caseChangeEvent = document.createEvent('HTMLEvents');
      caseChangeEvent.initEvent('caseChange', true, false);
      caseChangeEvent.detail = {
        caseName: caseName,
        media: cases[caseName].media,
        matches: cases[caseName].matches,
        caseNode: cases[caseName].node
      }
      cases[caseName].node.dispatchEvent(caseChangeEvent);
    }

    //TODO: creating an HTMLEvent that just had a custom name seemed to work on safari, could use that if CustomEvent is not defined. Need to test that on IE too, maybe it works just like that. As a last resort hack, could resort to piggybacking on some regular event, like active, change, blur, something. Or maybe just a custom event binding mechanism, like window.headcase.bind(caseName, function{}) just like many other similar js projects that use custom events.

    //TODO: should there be separate events for case match and case unmatch? Each case should have a separate event in any case. So you can bind a listener to just a specific case, instead of figuring out which case fired the event in the handler function.
    
    //TODO: update readme accordingly, no more document.addEventListener('caseChange'), instead use caseElement.addEventListener('caseChange')

  }

  return window.headcase.cases;
}


window.headcase.init = function () {

  window.addEventListener('DOMContentLoaded', function() {

    /* Execute the first update right after DOMContentLoaded has fired, so if another script has caseChange event handlers in its own DOMContentLoaded, they will fire. */
    // TODO: Is setTimeout the right way to do this? Oh well, it works. */
    setTimeout(function() {
      window.headcase.update();
    }, 0);

    window.addEventListener('resize', function() {
      window.headcase.update();
    });
    window.addEventListener('orientationchange', function() {
      window.headcase.update();
    });

    //TODO: Would be cool to add DOMNodeInserted, DOMNodeRemoved, DOMAttrModified listeners to head/meta elements so headcase can watch cases being added, removed or changed. Probably practically useless though. If done this way, the meta elements would stay as the canonical caselist and anything could add or remove them, and headcase would react appropriately. There's probably shitty browsers support for those events.

  });

}

window.headcase.init();



