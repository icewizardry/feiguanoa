
function CSEditorAgent(cfg) {
    var _me = this;
    var _tgt;
    var _tgtId;

    this.getRecfgData = function () {
        return {
            enableEdit: cfg.enableEdit,
            menuBarItems: cfg.menuBarItems,
            onLoadedAction: cfg.onLoadedAction,
            onContentChangedAction: cfg.onContentChangedAction,
            onCtrlS: cfg.onCtrlS
        };
    };

    this.getTgt = function () {
        return _tgt;
    };

    this.getEditor = function () {
        return _tgt.contentWindow.csEditor1Js;
    };

    this.getHTML = function () {
        return _tgt.contentWindow.getEditorHTML()
    };

    this.setHTML = function (html) {
        _tgt.contentWindow.setEditorHTML(html);
    };

    this.build = function () {
        if (cfg.tgt != null) {
            _tgt = cfg.tgt;
            _tgtId = _tgt.id;
        }
        else {
            _tgt = document.getElementById(cfg.tgtId);
            _tgtId = cfg.tgtId;
        }
        _tgt.csea = _me;
        _tgt.src = cfg.editorUrl + '?tgtId=' + _tgtId;
    };
}