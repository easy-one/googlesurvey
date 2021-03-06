function SimpleTable (container) {

    this.create = function (tags) {
        var str = '';

        for (var i in tags) {
            var line = tags[i];
            str +=
                '<tr><td>' + line[0] + '</td><td>' + (line[1] / total).toFixed(2) + '%</td><td>' + line[1] + '</td></tr>';
        }

        container.innerHTML =   '<table class="table table-striped table-bordered table-hover">' +
                                '<thead class="thead-default"><tr>' +
                                '<th>Tag</th><th>%</th><th>Repeats</th>' +
                                '</tr></thead>' +
                                '<tbody>' + str + '</tbody></table>';
    };
}
