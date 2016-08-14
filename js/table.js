var $undo = $('#undo'),
    ctrl,
    dragData;


$undo[0].onclick = function (evt) {
    var target = evt.target,
        tagName = target.tagName;

    if (tagName === 'UNDO') {
        ctrl.undoRow(target.getAttribute('trash-id'));
        $undo[0].removeChild(target.parentNode);
    }
    else if (tagName === 'DEL-UNDO') {
        $undo[0].removeChild(target.parentNode);
    }
};



function Table (container, tblType) {
    var tbody,
        $tbody,
        masterCheckbox,
        visibleTerms,
        isFiltered;


    function toPerc (repeat) {
        return (100 * repeat / total).toFixed(2);
    }


    this.create = function (arr, tags) {
        if (tblType === TBL_terms) {
            visibleTerms = Array(arr.length).fill(true);
        }

        if (tbody) {
            this.update(arr, tags);
            return;
        }

        tbody = null;

        var tableHeading = ['Tags and synonyms', 'Unused terms', 'Answer', 'Tags'],
            columnHeading = ['Tag', 'Term', '', 'Tag'],
            colCount = [5, 5, 3, 4],
            str = '<table class="table table-striped table-bordered table-hover"' + (tblType === TBL_terms ? ' ondragover="return false"' : '') + '>' +
                  '<thead class="thead-default"' + (tblType === TBL_tags ? ' ondragover="return false"' : '') + '><tr>' +
                  '<th colspan=' + colCount[tblType] + '><b>' + tableHeading[tblType] + '</b></th>';
            if (tblType !== TBL_answers) {
                str += '</tr><tr>' +
                    '<th><input type=checkbox></th>' +
                    '<th>' + columnHeading[tblType] + '</th>' +
                    '<th colspan=' + (colCount[tblType] - 2) + '>Repeats</th>';
            }

            str += '</tr></thead>' +
                   '<tbody>' +
                       fillTableBody(arr, tags) +
                   '</tbody></table>';

        container.innerHTML = str;
        tbody = container.children[0].children[1];

        setTimeout(function () {
            $tbody = $(tbody);
            ctrl = ctrl || angular.element(document.getElementById('logged-in')).scope().ctrl;
            if (tblType !== TBL_answers) {
                addMasterCheckbox();
            }
            assignDragNDrop();
            assignDynamicInput();
        }, 0);
    };


    function fillTableBody (arr, tags) {
        var str = '',
            i, j,
            line,
            syn,
            synStr;


        switch (tblType) {
            case TBL_tags:
                for (i in arr) {
                    line = arr[i];

                    if (syn = line[2]) {
                        // simultaneously (and implicitly!) unpack on first pass
                        if (!tbody) {
                            syn = syn.split(',');
                            line[2] = syn;
                            line[3] = line[3].split(',');
                        }

                        synStr = '<ul>';
                        for (j in syn) {
                            synStr += '<li><span draggable=true>' + syn[j] + '</span><del-syn>×</del-syn><dupl-syn>clone</dupl-syn></li>';
                        }
                        synStr += '</ul>';
                    }
                    else {
                        synStr = '';
                    }

                    str +=
                        '<tr ondragover="return false"><td><input type=checkbox></td>' +
                        '<td><span draggable=true>' + line[0] + '</span>' + synStr + '</td>' +
                        '<td>' + toPerc(line[1]) + '%</td><td>' + line[1] + '</td><td class=del-line>×</td></tr>';
                }
                break;

            case TBL_terms:
                for (i in arr) {
                    line = arr[i];

                    str +=
                        '<tr><td><input type=checkbox></td>' +
                        '<td><span draggable=true>' + line[0] + '</span></td>' +
                        '<td>' + toPerc(line[1]) + '%</td><td>' + line[1] + '</td><td class=del-line>×</td></tr>';
                }
                break;

            case TBL_answers:
                for (i in arr) {
                    line = arr[i];

                    if (syn = line[1]) {
                        // simultaneously (and implicitly!) unpack on first pass
                        syn = syn.split(',');

                        synStr = '<ul>';
                        for (j = 0; j < syn.length - 1; j++) {
                            synStr += '<li><text>' + tags[syn[j]][0] + '</text><del-tag>×</del-tag></li>';
                        }
                        synStr += '</ul>';
                    }
                    else {
                        synStr = '';
                    }
                    str +=
                        '<tr ondragover="return false">' +
                        '<td>' + line[0] + synStr + '</td></tr>';
                }
                break;

            case TBL_short:
                for (i in arr) {
                    line = arr[i];

                    if (syn = line[2]) {
                        synStr = '<ul>';
                        for (j in syn) {
                            synStr += '<li>' + syn[j] + '</li>';
                        }
                        synStr += '</ul>';
                    }
                    else {
                        synStr = '';
                    }

                    str +=
                        '<tr><td><input type=checkbox></td>' +
                        '<td draggable=true>' + line[0] + str + '</td>' +
                        '<td>' + toPerc(line[1]) + '%</td><td>' + line[1] + '</td></tr>';
                }
                break;
        }

        return str;
    }


    function addMasterCheckbox () {
        masterCheckbox = container.querySelector('thead input');
        masterCheckbox.onchange = function () {
            var rows = tbody.children,
                checked = this.checked;

            for (var i = 0, n = rows.length; i < n; i++) {
                if (tblType !== TBL_terms || visibleTerms[i]) {
                    rows[i].children[0].children[0].checked = checked;
                }
            }
        };
    }


    function getClosestRow (el) {
        while (el && el.tagName !== 'TR') {
            el = el.parentNode;
        }
        return el;
    }


    function getClosestDrop (el) {
        while (el && el.getAttribute && !el.getAttribute('ondragover')) {
            el = el.parentNode;
        }
        return el;
    }


    function getIndex (el) {
        var tr = getClosestRow(el),
            arr = Array.prototype.slice.call(tbody.children);
        return arr.indexOf(tr);
    }


    function getSynIndex (el) {
        var ul = el.parentNode,
            arr = Array.prototype.slice.call(ul.children);
        return arr.indexOf(el);
    }


    function assignDragNDrop () {
        var outline, lastTarget,
            table = container.children[0];

        tbody.addEventListener('dragstart', function (evt) {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }

            var target = evt.target;

            if (!(target instanceof HTMLElement && target.draggable)) {
                return false;
            }

            var startRow = getClosestRow(target),
                li = target.parentNode,
                isSyn = li.tagName === 'LI';

            dragData = {
                index: getIndex(startRow),
                startRow: startRow,
                synPos: isSyn ? getSynIndex(li) : 0,
                isSynonym: isSyn,
                tblType: tblType
            };

            $tbody.find('input:checked').css('outline', '5px solid rgba(0, 0, 255, 0.2)');// todo
        });


        table.addEventListener('dragenter', function (evt) {
            var target = evt.target;

            if (!lastTarget || !lastTarget.contains(target)) {
                if (lastTarget) {
                    outline.style.background = '';
                    outline.style.outline = '';
                    lastTarget = undefined;
                }

                if (!dragData.startRow.contains(target)) {
                    if (tblType === TBL_terms) {
                        target = table;
                    }
                    else {
                        target = getClosestDrop(target);
                    }
                    if (target !== document) {
                        lastTarget = target;
                        if (target.tagName === 'THEAD') {
                            outline = target.parentNode;
                        }
                        else {
                            outline = target;
                        }
                        outline.style.background = 'rgba(0, 0, 255, 0.1)'; // todo dont do this mult times
                        outline.style.outline = '2px solid blue';
                    }
                }
            }

            if (tblType !== TBL_answers) {
                masterCheckbox.checked = false;
            }
            evt.stopPropagation();
        });


        document.addEventListener('dragenter', function () {
            if (lastTarget) {
                outline.style.background = '';
                outline.style.outline = '';
                lastTarget = undefined;
            }
        });


        table.addEventListener('drop', function (evt) {
            var target = getClosestDrop(evt.target),
                isRow = (tblType === TBL_tags || tblType === TBL_answers) && target.tagName === 'TR',
                to = {
                    index: isRow && getIndex(target),
                    isRow: isRow,
                    tblType: tblType
                };

            if (lastTarget) {
                outline.style.background = '';
                outline.style.outline = '';
            }

            ctrl.dragTag(dragData, to);
        });
    }


    function assignDynamicInput () {
        tbody.addEventListener('click', function (evt) {
            var target = evt.target,
                tagName = target.tagName,
                li = target.parentNode;

            if (tagName === 'SPAN') {
                var oldName = target.innerHTML;

                target.style.padding = '0';
                target.innerHTML = '<input value="' + oldName + '">';
                var input = target.children[0];
                input.focus();
                input.onblur = function () {
                    var val = input.value,
                        pos;
                    if (val && oldName !== input.value) {
                        if (li.tagName === 'LI') {
                            pos = getSynIndex(li);
                        }
                        ctrl.updateTag(tblType === TBL_tags || tblType === TBL_short, getIndex(target), pos, val);
                    }
                    target.style.padding = '';
                    target.innerHTML = val;
                };
                input.onkeyup = function (e) {
                    if (e.keyCode == 13 || e.keyCode == 27) {
                        this.blur();
                    }
                };
            }

            else if (tagName === 'DEL-SYN') {
                ctrl.deleteSyn(getIndex(target), getSynIndex(li));
            }

            else if (tagName === 'DUPL-SYN') {
                ctrl.cloneSyn(getIndex(target), getSynIndex(li));
            }

            else if (tagName === 'DEL-TAG') {
                ctrl.deleteTag(getIndex(target), getSynIndex(li));
            }

            else if (target.className === 'del-line') {
                ctrl.deleteRow(getIndex(target), tblType === TBL_tags);
            }
        });
    }


    this.selectedIndexes = function () {
        var selected = [],
            rows = tbody.children,
            i, n;

        if (tblType !== TBL_terms) {
            for (i in visibleTerms) {
                if (visibleTerms[i] && rows[i].children[0].children[0].checked) {
                    selected.push(i);
                }
            }
        }
        else {
            for (var i = 0, n = rows.length; i < n; i++) {
                if (rows[i].children[0].children[0].checked) {
                    selected.push(i);
                }
            }
        }
        return selected;
    };


    this.filter = function (arr, word) {
        var rows = tbody.children,
            tr,
            fil;

        if (word.length) {
            for (var i in arr) {
                fil = arr[i][0].indexOf(word) !== -1;
                tr = rows[i];
                if (fil != visibleTerms[i]) {
                    tr.style.display = fil ? 'table-row' : 'none';
                }
                visibleTerms[i] = fil;
                if (!isFiltered) {
                    tr.children[0].children[0].checked = false;
                }
            }

            masterCheckbox.checked = false;
            isFiltered = true;
        }
        else {
            for (i in arr) {
                if (!visibleTerms[i]) {
                    rows[i].style.display = 'table-row';
                }
            }
            visibleTerms = Array(arr.length).fill(true);
            isFiltered = false;
        }
    };

    
    this.updatePerc = function (arr) {
        var rows = tbody.children,
            i, n;

        if (tblType !== TBL_terms) {
            for (i in visibleTerms) {
                if (visibleTerms[i]) {
                    rows[i].children[2].innerHTML = toPerc(arr[i][1]) + '%'
                }
            }
        }
        else {
            for (var i = 0, n = rows.length; i < n; i++) {
                rows[i].children[2].innerHTML = toPerc(arr[i][1]) + '%'
            }
        }
    };
    

    this.update = function (arr, tags) {
        tbody.innerHTML = '';
        if (tblType === TBL_terms) {
            visibleTerms = [];
        }
        this.addRows(arr, tags);
    };
    

    this.addRow = function (tag) {
        $tbody.prepend(fillTableBody([tag]));

        if (tblType === TBL_terms) {
            visibleTerms.unshift(true);
        }
    };


    this.addRows = function (arr, tags) {
        $tbody.prepend(fillTableBody(arr, tags));

        if (tblType === TBL_terms) {
            visibleTerms = Array(arr.length).fill(true).concat(visibleTerms);
        }
    };


    this.addSyn = function (index, name, repeat, pos) {
        var tr = tbody.children[index],
            ul = tr.children[1].children[1],
            str = '<li><span draggable=true>' + name + '</span><del-syn>×</del-syn><dupl-syn>clone</dupl-syn></li>';

        if (ul) {
            if (pos) {
                $(ul.children[pos]).after(str);
            }
            else {
                $(ul).prepend(str);
            }
        }
        else {
            $(tr.children[1].children[0]).after('<ul>' + str + '</ul>');
        }
        if (tblType !== TBL_answers) {
            tr.children[2].innerHTML = toPerc(repeat) + '%';
            tr.children[3].innerHTML = repeat;
        }
    };


    this.addSyns = function (index, arr) {
        var $ul = $(tbody.children[index].children[1].children[1]),
            str = arr.join('</span><del-syn>×</del-syn><dupl-syn>clone</dupl-syn></li><li><span draggable=true>');
        
        $ul.prepend('<li><span draggable=true>' + str + '</span><del-syn>×</del-syn><dupl-syn>clone</dupl-syn></li>');
    };


    function addTrash (trashId) {
        if (trashId !== undefined) {
            setTimeout(function () {
                // don't remove this timeout, this is to fix trash initialisation order
                var restore = trash[trashId],
                    type = restore[1],
                    typeStr;

                if (type === true) {
                    typeStr = 'tag';
                }
                else if (type === false) {
                    typeStr = 'term';
                }
                else {
                    typeStr = 'subterm';
                }

                $undo.prepend('<div><undo trash-id=' + trashId + '>undo</undo> <i>' + typeStr + '</i> ' + restore[0][0] + '<del-undo>×</del-undo></div>');
            }, 0);
        }
    }


    this.deleteSyn = function (index, pos, repeat, trashId) {
        var tr = tbody.children[index],
            ul = tr.children[1].children[1];
        ul.removeChild(ul.children[pos]);
        if (tblType !== TBL_answers) {
            tr.children[2].innerHTML = toPerc(repeat) + '%';
            tr.children[3].innerHTML = repeat;
            addTrash(trashId);
        }
    };


    this.deleteRow = function (index, trashId) {
        tbody.removeChild(tbody.children[index]);
        if (tblType === TBL_terms) {
            visibleTerms.splice(index, 1);
        }
        addTrash(trashId);
    };
}
