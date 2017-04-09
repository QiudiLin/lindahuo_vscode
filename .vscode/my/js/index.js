$(document).ready(function () {
    if ($('div[data-lq-page="index"]').length > 0) {
        indexMgr.init($('div[data-lq-page="index"]'));
    }
});

var indexMgr = {
    $wrapper: '',
    isAreaComplate1: false,

    init: function ($wrapper) {
        indexMgr.$wrapper = $wrapper;
        indexMgr.initPageEvent();
        indexMgr.initPageData();
        //indexMgr.initBarBox();
    },

    intPageEvent: function () {


    },

    initPageData: function () {

    },

    initBarBox: function () {
        self.parent = indexMgr;
        var $progssValue = self.parent.$wrapper.find('.j-progss-value');

        $progssValue.each(function (index, item) {
            var dataValue = $(item).atr('data-value');

            $(item).css('width', dataValue + '%').find('.j-progress-laber').css('opacity', 1);
        })
    }
}