// $Id$

Dida.module.highcharts.tableToChart = function(self) {
  var options = {
    chart: {type: self.attr('type') || 'spline', zoomType: 'x'},
    title: {text: self.attr('title') || ''},
    xAxis: {categories: []},
    yAxis: {title: {text: self.attr('ytitle') || ''}},
    tooltip: {
      crosshairs: true,
      formatter: function() { return "<b>" + this.series.name + "</b><br/><b>"+this.key+"：</b>" + this.y;}
    },
    series: [],
    exporting: {enabled: false }
  };

  var names = [];

  $('thead th', self).each(function(i, key) {
    if (i != 0) {
      names[names.length] = $(this).text();
    }
  });

  var data = [];
  $('tbody tr', self).each(function() {
    $('td', this).each(function(i, key) {
      if (!data[i]) data[i] = [];
      if (i != 0) {
        var v = parseFloat($(this).text().replace(/[^0-9]/g, ''));
        data[i][data[i].length] = {'y': (isNaN(v) || v == 0 ? null : v), 'name': data[0][data[i].length]};
      } else {
        data[i][data[i].length] = $(this).text();
      }
    });
  });

  for (var i in data) {
    if (i != 0) {
      //data[i].unshift(names[i]);
      options.series[options.series.length] = {'data': data[i], 'name': names[(i-1)]};
    } else {
      var k = parseInt(data[i].length/9); // 数据过多，省略坐标
      if (k > 1) {
        for (var j in data[i]) {
          options.xAxis.categories[j] = j%k ? '' : data[i][j];
        }
      } else {
        options.xAxis.categories = data[i];
      }
    }
  }

  if (self.attr('chartoptions')) {
    var p = eval('(' + self.attr('chartoptions').replace(/\\/g, '') + ')');
    if (typeof p == 'object') {
      $.extend(true, options, p);
    }
  }

  $('#' + self.attr('chartId')).highcharts(options);
}

$(function() {
  $('.dida_highcharts_data_table').each(function() {
    Dida.module.highcharts.tableToChart($(this));
  });

  $('.dida_highcharts_menu_labels').click(function() {
    var enableDataLabels = $(this).data('dataLabels');
    if (typeof(enableDataLabels) == 'undefined') enableDataLabels = true;
    var chart = $('#' + $(this).attr('chartId')).highcharts();
    if (chart) {
      for (var i in chart.series) {
        chart.series[i].update({
          dataLabels: {
            enabled: enableDataLabels
          }
        });
      }
    }
    $(this).data('dataLabels', !enableDataLabels);
    return false;
  });

  $('.dida_highcharts_menu_display').click(function() {
    var shows = $(this).data('shows');
    if (typeof(shows) == 'undefined') shows = true;
    var chart = $('#' + $(this).attr('chartId')).highcharts();
    if (chart) {
      for (var i in chart.series) {
        if (shows) {
          chart.series[i].hide();
        } else {
          chart.series[i].show();
        }
      }
    }
    $(this).data('shows', !shows);
    return false;
  });
});
