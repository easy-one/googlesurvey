function Chart (container) {
    var that = this,
        chart;


    this.create = function (data, survey) {
        google.charts.setOnLoadCallback(function () {

            function encodeRow(row) {
                var str = 'Tag,%\n';
                for (var j = 0; j < row.length; j++) {
                    var cell = row[j].toString().replace(/"/g, '""');
                    if (cell.search(/("|,|\n)/g) >= 0) {
                        cell = '"' + cell + '"';
                    }

                    str += (j > 0) ? (',' + cell) : cell;
                }
                return str + '\n';
            }


            var csvStr = '',
                i = 0,
                n = data.length,
                arr = new Array(n + 1);

            for (; i < n; i++) {
                var line = data[i],
                    row = [line[0], line[1] / total * 100];

                arr[i + 1] = row;
                csvStr += encodeRow(row);
            }

            that.csvStr = csvStr;
            that.csvBlob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });


            arr[0] = ['', 'Tag %'];
            var gData = google.visualization.arrayToDataTable(arr);

            container.style.height = 28 * n + 'px';
            if (!chart) {
                chart = new google.charts.Bar(container);
            }
            chart.draw(gData, {
                chart: {},
                bars: 'horizontal' // Required for Material Bar Charts.
            });

            $('#comment-chart').html(
                '<small>Question: ' + survey.question +
                '<br>Total answers: ' + survey.total + '</small><br><br>');
        });
    };
}