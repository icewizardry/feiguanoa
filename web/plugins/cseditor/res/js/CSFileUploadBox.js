/*
renderTo
*/
function CSFileUploadBox(cfg) {
    var _me = this;
    var _panel;
    var _uploader;

    this.getUICore = function () {
        return _panel;
    };

    this.build = function () {
        _panel = $('<div><input type="text" style="width:300px;vertical-align:middle;" /><input type="button" value="上传" style="margin-left:8px;vertical-align:middle;" /><span style="width:0px;vertical-align:middle;">&nbsp;</span></div>');
        _panel.find('input[type=button]').click(function () {
            _uploader.toSelectFile();
        });
        $(cfg.renderTo).append(_panel);

        _uploader = new CSH5Uploader({ uploadUrl: '../../../admin/Handler.ashx?cmd=csft_uploadFileBlockC_1' });

        _uploader.afterAllUploaded = function (r) {
            //var rs = [];
            for (var i = 0; i < r.data.length; i++) {
                //rs.push({ oldFileName: r.data[i].FileName, newFileName: r.data[i].FileName1 });
                _me.setValue('/warehouse/upload/' + r.data[i].FileName1);
            }
            csui.setLoading(false);
        };
        _uploader.build();
    };

    this.setValue = function (v) {
        _panel.find('input[type=text]').val(v);
    };

    this.getValue = function () {
        return _panel.find('input[type=text]').val();
    };
}