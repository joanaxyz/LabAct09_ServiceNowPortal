(function () {
    var portal = $sp.getPortalRecord();
    var homepage = portal.homepage.getRefRecord();
    data.homeUrl = '?id=' + encodeURIComponent(String(homepage.getValue('id') || ''));
    var logo = String(portal.getValue('logo') || '').replace(/\.iix$/, '');
    data.art = { logo: '/sys_attachment.do?sys_id=' + encodeURIComponent(logo) };
})();
