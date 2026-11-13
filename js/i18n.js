(function () {
  var lang = (document.documentElement.lang || 'pt').toLowerCase().indexOf('en') === 0 ? 'en' : 'pt';
  var STR = {
    pt: {
      scrollDown: 'Descer',
      viewAll: function (n) { return 'Ver todas as fotografias (' + n + ')'; },
      close: 'Fechar', prev: 'Anterior', next: 'Seguinte',
      photo: function (n) { return 'Foto ' + n; }
    },
    en: {
      scrollDown: 'Scroll down',
      viewAll: function (n) { return 'View all photos (' + n + ')'; },
      close: 'Close', prev: 'Previous', next: 'Next',
      photo: function (n) { return 'Photo ' + n; }
    }
  };
  window.CP_LANG = lang;
  // Content files: PT uses content/site.json, EN uses content/site.en.json
  window.CP_SUFFIX = lang === 'en' ? '.en' : '';
  window.CP_T = function (key) {
    var v = STR[lang][key];
    return typeof v === 'function' ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v;
  };
})();
