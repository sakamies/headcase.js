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
window.headcase.prefix = 'case-';

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

//TODO: Separate window.headcase.cases and html classes updating from firing events. On init the cases and classes should be updated immediately, but events fired only after DOMContentLoaded.

    //TODO: Would be cool to add DOMNodeInserted, DOMNodeRemoved, DOMAttrModified listeners to head/meta elements so headcase can watch cases being added, removed or changed. Probably practically useless though. If done this way, the meta elements would stay as the canonical caselist and anything could add or remove them, and headcase would react appropriately. There's probably shitty browsers support for those events.

  });
}

window.headcase.update = function () {

  var caseNodes = document.querySelectorAll('meta[name=case]');
  var cases = {};
  var caseNode;
  var caseName;
  var media;
  var matches;
  var prefix = window.headcase.prefix;

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

    //Only do stuff if the case has changed
    if (cases[caseName].prevMatches != cases[caseName].matches) {

      // Put the case immediately into window.headcase.cases
      window.headcase.cases[caseName] = {};
      window.headcase.cases[caseName].node = cases[caseName].node;
      window.headcase.cases[caseName].media = cases[caseName].media;
      window.headcase.cases[caseName].matches = cases[caseName].matches;

      //Add or remove appropriate class to/from <html>
      var classList = document.documentElement.className.split(/\s+/);
      var caseClass = prefix + caseName;
      var classIndex = classList.indexOf(caseClass);
      if (cases[caseName].matches && classIndex == -1) {
        classList.push(caseClass);
        document.documentElement.className = classList.join(' ');
      }
      else if (classIndex != -1) {
        classList.splice(classIndex, 1);
        document.documentElement.className = classList.join(' ');
      }

      /* Dispatch caseChange events */
      if (typeof CustomEvent != 'undefined') {
        var caseChangeEvent = document.createEvent('CustomEvent');
        caseChangeEvent.initCustomEvent(
          'caseChange',
          true,
          false,
          {
            caseName: caseName,
            media: cases[caseName].media,
            matches: cases[caseName].matches,
            caseNode: cases[caseName].node
          }
        );
        cases[caseName].node.dispatchEvent(caseChangeEvent);
      }
      else if (typeof document.createEvent('HTMLEvents') != 'undefined') {
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
    };
  }

  return window.headcase.cases;
}

window.headcase.init();



