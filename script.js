document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  // https://developer.mozilla.org/en-US/docs/Web/API/Element.matches
  // http://caniuse.com/matchesselector
  var matches = (function(node) {
    var methodName = 'matches';
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    "matches mozMatchesSelector webkitMatchesSelector msMatchesSelector".split(" ").some(function(key) {
      if (key in node) {
        methodName = key;
        return true;
      }
    });
    
    return methodName;
  })(document.body);
  
  function valueMap(elements) {
    var map = {};
    [].forEach.call(elements, function(element) {
      map[element.value] = element;
    });
    
    return map;
  }
  
  var state = {
    wer: null,
    was: null,
    warum: null,
    warum2: null,
    'wer-sonst': null,
    'was-sonst': null,
    'warum-sonst': null,
    aufsicht: null
  };

  var values = {
    wer: valueMap(document.querySelectorAll('[name="wer"]')),
    was: valueMap(document.querySelectorAll('[name="was"]')),
    warum: valueMap(document.querySelectorAll('[name="warum"]')),
    warum2: valueMap(document.querySelectorAll('[name="warum2"]'))
  };
  
  var legends = {
    wer: document.getElementById('wer-legend'),
    was: document.getElementById('was-legend'),
    warum: document.getElementById('warum-legend')
  };
  
  var texts = {
    wer: document.querySelector('[name="wer-sonst"]'),
    was: document.querySelector('[name="was-sonst"]'),
    warum: document.querySelector('[name="warum-sonst"]')
  };
  
  var main = document.getElementsByTagName('main')[0];
  var aufsicht = document.querySelector('[name="aufsicht"]');
  
  function setState() {
    Object.keys(values).forEach(function(key) {
      var element = values[key][state[key]];
      state[key] && (element.checked = true) && setOption(element);
    });
    
    Object.keys(texts).forEach(function(key) {
      var element = texts[key];
      state[key] && (element.value = state[key]) && setText(element);
    });
    
    state.aufsicht && (aufsicht.value = state.aufsicht) && setText(aufsicht);
  }
  
  function setOption(element) {
    var set = element.name;
    var legend = element.dataset.legend;
    var warum2 = element.dataset.warum2;
    
    state[set] = element.value;
    element.checked = true;
        
    if (legends[set]) {
      legends[set].textContent = legend;
      if (warum2) {
        setOption(values.warum2[warum2]);
      }
    }
    
    updateHash();
  }
  
  function setText(element) {
    var set = element.name;
    state[set] = element.value;
    updateHash();
  }

  var hashTimeout;
  function updateHash() {
    clearTimeout(hashTimeout);
    hashTimeout = setTimeout(_updateHash, 50);
  }

  function _updateHash() {
    var _hash = [];
    Object.keys(state).sort().forEach(function(key) {
      if (state[key]) {
        _hash.push(encodeURIComponent(key) + '=' + encodeURIComponent(state[key]));
      }
    });
    
    location.hash = _hash.join('&');
  }
  
  function importHash() {
    location.hash.substring(1).split('&').forEach(function(val) {
      var value = val.split('=');
      state[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
    });
  }
  
  main.addEventListener('click', function(event) {
    var element = event.srcElement;
    if (!element[matches]('input[type="radio"]')) {
      return;
    }
    setOption(element);
  }, true);
  
  main.addEventListener('focus', function(event) {
    var element = event.srcElement;
    if (!element[matches]('input[type="text"]')) {
      return;
    }
    setOption(element.parentElement.firstElementChild);
  }, true);
  
  main.addEventListener('keyup', function(event) {
    var element = event.srcElement;
    if (!element[matches]('input[type="text"]')) {
      return;
    }
    setText(element);
  }, true);

  aufsicht.addEventListener('keyup', function(event) {
    setText(this);
  }, true);

  importHash();
  setState();
}, true);
