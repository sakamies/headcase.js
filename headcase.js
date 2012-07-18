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

window.headcase.update = function() {

  if (typeof window.headcase.caseList == 'undefined') {
    window.headcase.caseList = [];
  };

  var caseNodes = document.querySelectorAll('meta[name=case]');
  var caseName;
  var media;
  var matches;
  var caseNode;
  var prevMatches

  for (var i = 0; i < caseNodes.length; i++) {

    /* get some case properties */
    caseName = caseNodes[i].getAttribute('data');
    media = caseNodes[i].getAttribute('media');
    matches = window.matchMedia(media).matches;
    caseNode = caseNodes[i];

    if (typeof window.headcase.caseList[i] != 'undefined') {
      prevMatches = window.headcase.caseList[i].matches;
    }

    /* put the case immediately into window.headcase.caseList  */
    window.headcase.caseList[i] = {};
    window.headcase.caseList[i].caseName = caseName;
    window.headcase.caseList[i].media = media;
    window.headcase.caseList[i].matches = matches;

    /* 2. Update classes on <html> */
    if (matches) {
      document.documentElement.classList.add('case-' + caseName);
    }
    else {
      document.documentElement.classList.remove('case-' + caseName);
    }

    /* 3. dispatch caseChange events */
    if (document.createEvent && (prevMatches !== matches)) {
      var event = document.createEvent('CustomEvent');

      if (typeof CustomEvent != 'undefined') {
        var caseChangeEvent = new CustomEvent(
          "caseChange",
          {
            detail: {  
              caseName: caseName,
              media: media,
              matches: matches,
              caseNode: caseNode
            },  
            bubbles: true,  
            cancelable: true
          }
        );
        document.dispatchEvent(caseChangeEvent);
      };

    };

  };

  return window.headcase.caseList;
}

window.addEventListener('resize', function() {
  window.headcase.update();
});
window.addEventListener('orientationchange', function() {
  window.headcase.update();
});
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    window.headcase.update();
  }, 0);
});