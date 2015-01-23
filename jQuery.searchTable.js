/*!
    jQuery.searchTable.js v1.0
    Copyright (c) 2014 Mohammad wali, JustCode.io

    Licensed under the MIT license
    http://en.wikipedia.org/wiki/MIT_License

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
*/
!(function($, win, doc) {
    var _win = $(win),
        _doc = $(doc),
        body = doc.body,
        _body = $(body),
        defaults = {
            query: "",
            highlight: true,
            highlightBg: "#FF0",
            highlightColor: "#000",
            hideOthers: true,
            emptyResultsMesage: "No results Found for your query",
            clearSearchButton: false,
            notToSearchIn: "no-search",
            columnsToSearch: "all"
        },
        isInt = function(n) {
            return n % 1 === 0;
        },
        isArray = function(object) {
            return (object.constructor === Array) ? true : false;
        },
        cl = function() {
            if (typeof console.log !== "undefined") return console.log.apply(console, arguments);
        },
        cw = function() {
            if (typeof console.wewwe !== "undefined") return console.warning.apply(console, arguments);
            else {
                var args = Array.prototype.slice.call(arguments);
                args.unshift("Warning:");
                return cl.apply(console, args);
            }
        },
        escRegExp = function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        arrayUnique = function(array) {
            var u = {}, a = [];
            for (var i = 0, l = array.length; i < l; ++i) {
                if (u.hasOwnProperty(array[i])) {
                    continue;
                }
                a.push(array[i]);
                u[array[i]] = 1;
            }
            return a;
        },
        getTds = function(table, options) {
            var columns = options.columnsToSearch;
            if (!isArray(columns)) {
                if (columns != defaults.columnsToSearch) {
                    cw('Invalid columns sent (' + columns + ') using default (' + defaults.columnsToSearch + ')');
                    columns = defaults.columnsToSearch;
                }
            }
            var tbody = table.find("tbody"),
                tds = [];
            if (isArray(columns)) {
                var elms = $(),
                    columns = arrayUnique(columns);
                tbody.find("tr").each(function(e, tr) {
                    tr = $(tr);
                    $.each(columns, function(i, v) {
                        $.merge(elms, tr.find("td").not(options.notToSearchIn).eq(v))
                    });
                })
                tds = elms;
            } else if (columns == defaults.columnsToSearch) {
                tds = tbody.find("tr td").not(options.notToSearchIn);
            }
            return tds;
        },
        highlightWord = function(elm, word) {
            return elm.not(".searchTable-notice").addClass("searchTable-highlited").html(elm.text().replace(RegExp(word, 'gi'), '<mark>$&</mark>'));
        },
        removeHighlight = function(elm) {
            return elm.not(".searchTable-notice").removeClass("searchTable-highlited").html(elm.text());
        },
        getResults = function(tds, query, highlight) {
            var results = $();
            if (!query) return results;
            query = escRegExp(query);
            $.each(tds, function(i, td) {
                td = $(td);
                var text = td.text();
                if (text.match(RegExp(query, 'gi')) !== null) {
                    $.merge(results, td);
                    if (highlight == true) highlightWord(td, query)
                }
            })
            return results;
        },
        getParentsTr = function(tds) {
            var trs = $();
            tds.each(function(i, c) {
                var td = $(c);
                $.merge(trs, td.parents("tr"));
            })
            return trs;
        },
        getColspan = function(table) {
            var colspan = 0;
            colspan = table.find("thead tr:first th").length;
            if (colspan == 0) colspan = table.find("tbody tr:first td").length;
            return colspan;
        },
        methods = {
            init: function(options, callback) {
                var opt = $.extend($.extend({}, defaults), options),
                    table = this;
                if (!$(doc.head).find("#searchTable-styles").length) {
                    $(doc.head).append("<style type='text/css'>table.searchTable-enabled mark{color: " + opt.highlightColor + "!important;background-color:" + opt.highlightBg + ";}</style>");
                }
                return table.each(function(i, current) {
                    var _tbl = $(current);
                    methods.clearSearch.apply(this);
                    var tds = getTds($(current), opt),
                        results = {};
                    results.td = getResults(tds, opt.query, opt.highlight);
                    results.tr = getParentsTr(results.td);
                    if (opt.hideOthers == true) {
                        table.find("tbody tr").not(".searchTable-notice").hide();
                        results.tr.show();
                        if (results.tr.length == 0) {
                            table.append("<tr class=\'searchTable-notice\'><td colspan='" + getColspan(table) + "'>" + opt.emptyResultsMesage + ((opt.clearSearchButton == true) ? "  <a href=\'#\' class='clearSearchTable-button'>Clear Search<\/a>" : "") + "<\/td><\/tr>");
                            if (opt.clearSearchButton == true) {
                                $("tr.searchTable-notice a.clearSearchTable-button").click(function(e) {
                                    e.preventDefault();
                                    console.log($(this).parents("table.searchTable-enabled"));
                                    $(this).parents("table.searchTable-enabled").searchTable("clearSearch");
                                })
                            }
                        }
                    };
                    if (typeof callback == "function") callback(results);
                    $(current).addClass("searchTable-enabled");
                });
            },
            clearSearch: function() {
                methods.clearHighlights.apply(this, arguments);
                return $(this).each(function(i, table) {
                    var _tbl = $(table);
                    if (methods.isSearchTable(_tbl)) {
                        _tbl.find("tbody tr").show();
                        _tbl.removeClass("searchTable-enabled");
                        _tbl.find("tr.searchTable-notice").remove();
                    }
                })
            },
            clearHighlights: function() {
                var tables = this,
                    _arguments = arguments;
                return $(this).each(function(i, table) {
                    var _tbl = $(table);
                    if (methods.isSearchTable(_tbl)) {
                        _tbl.find("tr td").each(function(i, c) {
                            if ($(c).hasClass("searchTable-highlited")) {
                                removeHighlight($(c));
                            }
                        })
                    }
                })
            },
            isSearchTable: function() {
                var table = arguments[0] == "undefined" ? $(this) : arguments[0];
                return table.hasClass("searchTable-enabled");
            }
        }
    $.fn.searchTable = function(options, callback) {
        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (!options) {
            $.error('Options object is required.');
        } else if (typeof options !== 'object' || options.constructor === Array) {
            if (options.constructor === Array) {
                $.error('Options should be an object, array sent.');
            } else $.error('Options should be an object, ' + (typeof options) + ' sent.');
        } else {
            if (typeof options === 'object') {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' + options + ' does not exist on scrolyTable.js');
            }
        }
    };
})(window.jQuery, window, document);