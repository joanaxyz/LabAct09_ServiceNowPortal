(function () {
    data.authenticated = gs.isLoggedIn();
    data.requests = [];
    data.requestsUrl = '?id=my_requests';
    data.requestsError = '';
    if (!data.authenticated) return;
    try {
        // Native request_filter and GlideRecordSecure behavior remain owned by ServiceNow.
        data.requestsWidget = $sp.getWidget('8cc0df25875023000f220cf888cb0bb5', {
            title: 'My requests', items_per_page: 5, show_view: 'true'
        });
    } catch (error) {
        data.requestsError = 'Could not load requests. Open My requests to try again.';
        gs.warn('LAB09: native request preview unavailable.');
    }
})();
