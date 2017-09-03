Template.dateplugin.onRendered(function() {
    $('#demo_date').mobiscroll().date({
        theme: 'sense-ui', // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: 'scroller', // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: 'inline', // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: 'zh' // Specify language like: lang: 'pl' or omit setting to use default 
    });
});