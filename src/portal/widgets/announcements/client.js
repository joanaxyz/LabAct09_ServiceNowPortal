api.controller = function($injector) {
  var c = this;
  c.announcementsKnown = false;
  c.hasAnnouncements = false;
  // The verified native widget uses this same visibility-filtered store.
  if ($injector.has('spAnnouncement')) {
    var service = $injector.get('spAnnouncement');
    var result = service.get(service.filterOnType(''), 3, 1);
    if (result && result.data) {
      c.announcementsKnown = true;
      c.hasAnnouncements = result.data.length > 0;
    }
  }
};
