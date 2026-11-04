(function () {
    data.knowledgeUrl = '?id=kb_view';
    data.articles = [];
    data.knowledgeError = '';
    if (!gs.isLoggedIn()) return;
    try {
        // Use Knowledge's user-criteria-aware API, not a raw kb_knowledge query.
        var articles = new GlideRecordSecure('kb_knowledge');
        articles.addQuery('workflow_state', 'published');
        articles.addQuery('kb_knowledge_base', 'a7e8a78bff0221009b20ffffffffff17');
        articles.addQuery('valid_to', '>=', new GlideDate().getValue());
        articles.orderByDesc('sys_view_count');
        articles.setLimit(24);
        articles.query();
        while (articles.next() && data.articles.length < 3) {
            if (!$sp.canReadRecord(articles)) continue;
            data.articles.push({
                title: articles.getValue('short_description'),
                number: articles.getValue('number'),
                url: '?id=kb_article&sys_id=' + articles.getUniqueValue()
            });
        }
    } catch (error) {
        data.knowledgeError = 'Could not load articles. Try the knowledge base.';
        gs.warn('LAB09: knowledge preview unavailable.');
    }
})();
