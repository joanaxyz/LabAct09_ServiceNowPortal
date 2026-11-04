api.controller = function($window) {
  var c = this;
  c.query = '';
  c.searching = false;
  c.search = function() {
    var query = (c.query || '').replace(/^\s+|\s+$/g, '');
    if (!query || c.searching) return;
    c.searching = true;
    $window.location.href = (c.data.searchUrl || '?id=search&spa=1') + '&q=' + encodeURIComponent(query);
  };
};
