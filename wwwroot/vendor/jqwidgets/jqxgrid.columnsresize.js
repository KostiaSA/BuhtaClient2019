/*
jQWidgets v5.4.0 (2017-Oct)
Copyright (c) 2011-2017 jQWidgets.
License: https://jqwidgets.com/license/
*/

(function (a) {
    a.extend(a.jqx._jqxGrid.prototype, {
        autoresizecolumns: function (z, g) {
            if (z != "cells" && z != "all" && z != "column") {
                z = "all"
            }
            var A = this.that;

            // buhta ограничиваем к-во записей до 500 .slice(0,500)
            var n = this.getrows().slice(0,500);

            if (this.pageable) {
                n = this.dataview.rows;
                if (this.groupable) {
                    n = this.dataview.records
                }
            }
            if (g == undefined) {
                g = 0
            } else {
                g = parseInt(g)
            }
            var e = n.length;
            if (e == undefined && n != undefined) {
                var t = new Array();
                a.each(n, function (i) {
                    t.push(this)
                });
                n = t;
                e = n.length
            }
            var w = a("<span></span>");
            w.addClass(this.toThemeProperty("jqx-widget"));
            w.addClass(this.toThemeProperty("jqx-grid-cell"));
            a(document.body).append(w);
            var c = [];
            var f = [];
            var b = [];
            var q = [];
            var o = A.host.width();
            if (A.vScrollBar[0].style.visibility != "hidden") {
                o -= this.scrollbarsize + 5
            }
            if (o < 0) {
                o = 0
            }
            for (var x = 0; x < e; x++) {
                var k = n[x];
                for (var v = 0; v < this.columns.records.length; v++) {
                    var d = this.columns.records[v];
                    if (d.hidden) {
                        continue
                    }
                    if (this.groups.length > 0 && v <= this.groups.length - 1) {
                        continue
                    }
                    if (f[d.displayfield] == undefined) {
                        f[d.displayfield] = 0
                    }
                    if (b[d.displayfield] == undefined) {
                        b[d.displayfield] = ""
                    }
                    var r = k[d.displayfield];
                    if (d.cellsformat != "") {
                        if (a.jqx.dataFormat) {
                            if (a.jqx.dataFormat.isDate(r)) {
                                r = a.jqx.dataFormat.formatdate(r, d.cellsformat, this.gridlocalization)
                            } else {
                                if (a.jqx.dataFormat.isNumber(r)) {
                                    r = a.jqx.dataFormat.formatnumber(r, d.cellsformat, this.gridlocalization)
                                }
                            }
                        }
                    } else {
                        if (d.cellsrenderer) {
                            var s = A._defaultcellsrenderer(r, d);
                            var p = d.cellsrenderer(x, d.datafield, r, s, d.getcolumnproperties(), k);
                            if (p != undefined) {
                                r = a(p).text()
                            }
                        }
                    }
                    if (z == undefined || z == "cells" || z == "all") {
                        if (r != null) {
                            var c = r.toString().length;
                            var u = r.toString();
                            var B = u.replace(/[^A-Z]/g, "").length;
                            if (c > f[d.displayfield]) {
                                f[d.displayfield] = c;
                                b[d.displayfield] = r;
                                q[d.displayfield] = B
                            }
                            if (c > 0 && c >= B) {
                                var m = B * 20 + (c - B) * 15;
                                var l = q[d.displayfield] * 20 + (f[d.displayfield] - q[d.displayfield]) * 15;
                                if (m > l && m > 0 && l > 0) {
                                    f[d.displayfield] = c;
                                    b[d.displayfield] = r;
                                    q[d.displayfield] = B
                                }
                            }
                        }
                    }
                    if (z == "column" || z == "all") {
                        if (d.text.toString().length > f[d.displayfield]) {
                            b[d.displayfield] = d.text;
                            f[d.displayfield] = d.text.length;
                            var u = d.text.toString();
                            var B = u.replace(/[^A-Z]/g, "").length;
                            q[d.displayfield] = B
                        }
                        var r = d.text;
                        var c = r.toString().length;
                        var u = r.toString();
                        var B = u.replace(/[^A-Z]/g, "").length;
                        if (c > 0 && c >= B) {
                            var m = B * 20 + (c - B) * 15;
                            var l = q[d.displayfield] * 20 + (f[d.displayfield] - q[d.displayfield]) * 15;
                            if (m > l && m > 0 && l > 0) {
                                f[d.displayfield] = c;
                                b[d.displayfield] = r;
                                q[d.displayfield] = B
                            }
                        }
                    }
                }
            }
            if (!this.columns.records) {
                return
            }
            for (var v = 0; v < this.columns.records.length; v++) {
                var d = this.columns.records[v];
                if (!d.displayfield) {
                    continue
                }
                if (b[d.displayfield] == undefined) {
                    b[d.displayfield] = d.text
                }
                if (w[0].className.indexOf("jqx-grid-column-header") >= 0) {
                    w.removeClass(this.toThemeProperty("jqx-grid-column-header"))
                }
                if (b[d.displayfield] == d.text) {
                    w.addClass(this.toThemeProperty("jqx-grid-column-header"))
                }
                w[0].innerHTML = b[d.displayfield].toString();
                var y = w.outerWidth() + 10;
                if (w.children().length > 0) {
                    y = w.children().outerWidth() + 10
                }
                if (a.jqx.browser.msie && a.jqx.browser.version < 8) {
                    y += 10
                }
                if (this.filterable && this.showfilterrow) {
                    y += 5
                }
                y += g;
                if (y > d.maxwidth) {
                    y = d.maxwidth
                }
                if (d._width != undefined) {
                    d.__width = d._width
                }
                d._width = null;
                if (d.maxwidth == "auto" || y <= d.maxwidth) {
                    var h = d.width;
                    if (y < d.minwidth) {
                        y = d.minwidth
                    }
                    d.width = y;
                    if (d._percentagewidth != undefined) {
                        d._percentagewidth = null
                    }
                    this._raiseEvent(14, {
                        columntext: d.text,
                        column: d.getcolumnproperties(),
                        datafield: d.datafield,
                        displayfield: d.displayfield,
                        oldwidth: h,
                        newwidth: y
                    })
                }
            }
            w.remove();
            this._updatecolumnwidths();
            this._updatecellwidths();
            this._renderrows(this.virtualsizeinfo);
            for (var v = 0; v < this.columns.records.length; v++) {
                var d = this.columns.records[v];
                if (d.__width != undefined) {
                    d._width = d.__width
                }
            }
        }, autoresizecolumn: function (p, v, g) {
            if (v != "cells" && v != "all" && v != "column") {
                v = "all"
            }
            if (p == undefined) {
                return false
            }

            // buhta ограничиваем к-во записей до 500 .slice(0,500)
            //var l = this.getrows();
            var l = this.getrows().slice(0,500);

            if (this.pageable) {
                l = this.dataview.rows;
                if (this.groupable) {
                    l = this.dataview.records
                }
            }
            var d = this.getcolumn(p);
            if (d == undefined) {
                return false
            }
            if (g == undefined) {
                g = 0
            } else {
                g = parseInt(g)
            }
            var e = l.length;
            var s = a("<span></span>");
            s.addClass(this.toThemeProperty("jqx-widget"));
            s.addClass(this.toThemeProperty("jqx-grid-cell"));
            a(document.body).append(s);
            var f = 0;
            var b = "";
            var o = 0;
            var w = this.that;
            var m = w.host.width();
            if (w.vScrollBar[0].style.visibility != "hidden") {
                m -= this.scrollbarsize + 5
            }
            if (m < 0) {
                m = 0
            }
            if (v == undefined || v == "cells" || v == "all") {
                for (var t = 0; t < e; t++) {
                    var q = l[t][d.displayfield];
                    if (d.cellsformat != "") {
                        if (a.jqx.dataFormat) {
                            if (a.jqx.dataFormat.isDate(q)) {
                                q = a.jqx.dataFormat.formatdate(q, d.cellsformat, this.gridlocalization)
                            } else {
                                if (a.jqx.dataFormat.isNumber(q)) {
                                    q = a.jqx.dataFormat.formatnumber(q, d.cellsformat, this.gridlocalization)
                                }
                            }
                        }
                    } else {
                        if (d.cellsrenderer) {
                            var n = d.cellsrenderer(t, d, q);
                            if (n != undefined) {
                                q = a(n).text()
                            }
                        }
                    }
                    if (q != null) {
                        var c = q.toString().length;
                        var r = q.toString();
                        var x = r.replace(/[^A-Z]/g, "").length;
                        if (c > f) {
                            f = c;
                            b = q;
                            o = x
                        }
                        if (c > 0 && c >= x) {
                            var k = x * 20 + (c - x) * 15;
                            var j = o * 20 + (f - o) * 15;
                            if (k > j && k > 0 && j > 0) {
                                f = c;
                                b = q;
                                o = x
                            }
                        }
                    }
                }
            }
            if (v == "column" || v == "all") {
                if (d.text.toString().length > f) {
                    b = d.text
                }
                var q = d.text.toString();
                var c = q.toString().length;
                var r = q.toString();
                var x = r.replace(/[^A-Z]/g, "").length;
                if (c > 0 && c >= x) {
                    var k = x * 20 + (c - x) * 15;
                    var j = o * 20 + (f - o) * 15;
                    if (k > j && k > 0 && j > 0) {
                        f = c;
                        b = q;
                        o = x
                    }
                }
            }
            if (b == undefined) {
                b = d.text
            }
            s[0].innerHTML = b;
            if (b == d.text) {
                s.addClass(this.toThemeProperty("jqx-grid-column-header"))
            }
            var u = s.outerWidth() + 10;
            if (a.jqx.browser.msie && a.jqx.browser.version < 8) {
                u += 5
            }
            if (this.filterable && this.showfilterrow) {
                u += 5
            }
            u += g;
            s.remove();
            if (u > d.maxwidth) {
                u = d.maxwidth
            }
            if (d.maxwidth == "auto" || u <= d.maxwidth) {
                var h = d.width;
                if (u < d.minwidth) {
                    u = d.minwidth
                }
                d.width = u;
                if (d._width != undefined) {
                    d.__width = d._width
                }
                d._width = null;
                if (d._percentagewidth != undefined) {
                    d._percentagewidth = null
                }
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._raiseEvent(14, {
                    columntext: d.text,
                    column: d.getcolumnproperties(),
                    datafield: p,
                    displayfield: d.displayfield,
                    oldwidth: h,
                    newwidth: u
                });
                this._renderrows(this.virtualsizeinfo);
                if (d._width != undefined) {
                    d._width = d.__width
                }
            }
        }, _handlecolumnsresize: function () {
            var j = this.that;
            if (this.columnsresize) {
                var i = false;
                if (j.isTouchDevice() && j.touchmode !== true) {
                    i = true
                }
                var f = "mousemove.resize" + this.element.id;
                var c = "mousedown.resize" + this.element.id;
                var d = "mouseup.resize" + this.element.id;
                if (i) {
                    var f = a.jqx.mobile.getTouchEventName("touchmove") + ".resize" + this.element.id;
                    var c = a.jqx.mobile.getTouchEventName("touchstart") + ".resize" + this.element.id;
                    var d = a.jqx.mobile.getTouchEventName("touchend") + ".resize" + this.element.id
                }
                this.removeHandler(a(document), f);
                this.addHandler(a(document), f, function (m) {
                    var n = a.data(document.body, "contextmenu" + j.element.id);
                    if (n != null && j.autoshowcolumnsmenubutton) {
                        return true
                    }
                    if (j.resizablecolumn != null && !j.disabled && j.resizing) {
                        if (j.resizeline != null) {
                            var s = j.resizablecolumn.columnelement;
                            var p = j.host.coord();
                            var v = parseInt(j.resizestartline.coord().left);
                            var k = v - j._startcolumnwidth;
                            var w = j.resizablecolumn.column.minwidth;
                            if (w == "auto") {
                                w = 0
                            } else {
                                w = parseInt(w)
                            }
                            var l = j.resizablecolumn.column.maxwidth;
                            if (l == "auto") {
                                l = 0
                            } else {
                                l = parseInt(l)
                            }
                            var q = m.pageX;
                            if (i) {
                                var t = j.getTouches(m);
                                var r = t[0];
                                q = r.pageX
                            }
                            k += w;
                            var u = l > 0 ? v + l : 0;
                            var o = l == 0 ? true : j._startcolumnwidth + q - v < l ? true : false;
                            if (j.rtl) {
                                var o = true
                            }
                            if (o) {
                                if (!j.rtl) {
                                    if (q >= p.left && q >= k) {
                                        if (u != 0 && m.pageX < u) {
                                            j.resizeline.css("left", q)
                                        } else {
                                            if (u == 0) {
                                                j.resizeline.css("left", q)
                                            }
                                        }
                                        if (i) {
                                            return false
                                        }
                                    }
                                } else {
                                    if (q >= p.left && q <= p.left + j.host.width()) {
                                        j.resizeline.css("left", q);
                                        if (i) {
                                            return false
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (!i && j.resizablecolumn != null) {
                        return false
                    }
                });
                this.removeHandler(a(document), c);
                this.addHandler(a(document), c, function (p) {
                    var o = a.data(document.body, "contextmenu" + j.element.id);
                    if (o != null && j.autoshowcolumnsmenubutton) {
                        return true
                    }
                    if (j.resizablecolumn != null && !j.disabled) {
                        var k = j.resizablecolumn.columnelement;
                        if (k.coord().top + k.height() + 5 < p.pageY) {
                            j.resizablecolumn = null;
                            return
                        }
                        if (k.coord().top - 5 > p.pageY) {
                            j.resizablecolumn = null;
                            return
                        }
                        j._startcolumnwidth = j.resizablecolumn.column.width;
                        j.resizablecolumn.column._width = null;
                        a(document.body).addClass("jqx-disableselect");
                        a(document.body).addClass("jqx-position-reset");
                        j.host.addClass("jqx-disableselect");
                        j.content.addClass("jqx-disableselect");
                        j._mouseDownResize = new Date();
                        j.resizing = true;
                        if (j._lastmouseDownResize && j.columnsautoresize) {
                            if (j._lastmouseDownResize - j._mouseDownResize < 300 && j._lastmouseDownResize - j._mouseDownResize > -500) {
                                var n = j.resizablecolumn.column;
                                if (n.resizable) {
                                    var m = j.resizablecolumn.column.width;
                                    var l = j.hScrollBar[0].style.visibility;
                                    j._resizecolumn = null;
                                    j.resizeline.hide();
                                    j.resizestartline.hide();
                                    j.resizebackground.remove();
                                    j.resizablecolumn = null;
                                    j.columndragstarted = false;
                                    j.dragmousedown = null;
                                    j.__drag = false;
                                    j.autoresizecolumn(n.displayfield, "all");
                                    if (l != j.hScrollBar[0].style.visibility) {
                                        j.hScrollInstance.setPosition(0)
                                    }
                                    if (j.rtl) {
                                        j._arrange()
                                    }
                                    if (j.autosavestate) {
                                        if (j.savestate) {
                                            j.savestate()
                                        }
                                    }
                                    p.stopPropagation();
                                    j.suspendClick = true;
                                    setTimeout(function () {
                                        j.suspendClick = false
                                    }, 100);
                                    return false
                                }
                            }
                        }
                        j._lastmouseDownResize = new Date();
                        j._resizecolumn = j.resizablecolumn.column;
                        j.resizeline = j.resizeline || a('<div style="position: absolute;"></div>');
                        j.resizestartline = j.resizestartline || a('<div style="position: absolute;"></div>');
                        j.resizebackground = j.resizebackground || a('<div style="position: absolute; left: 0; top: 0; background: #000;"></div>');
                        j.resizebackground.css("opacity", 0.01);
                        j.resizebackground.css("cursor", "col-resize");
                        j.resizeline.css("cursor", "col-resize");
                        j.resizestartline.css("cursor", "col-resize");
                        j.resizeline.addClass(j.toThemeProperty("jqx-grid-column-resizeline"));
                        j.resizestartline.addClass(j.toThemeProperty("jqx-grid-column-resizestartline"));
                        a(document.body).append(j.resizeline);
                        a(document.body).append(j.resizestartline);
                        a(document.body).append(j.resizebackground);
                        var q = j.resizablecolumn.columnelement.coord();
                        j.resizebackground.css("left", j.host.coord().left);
                        j.resizebackground.css("top", j.host.coord().top);
                        j.resizebackground.width(j.host.width());
                        j.resizebackground.height(j.host.height());
                        j.resizebackground.css("z-index", 9999);
                        var r = function (t) {
                            if (!j.rtl) {
                                t.css("left", parseInt(q.left) + j._startcolumnwidth)
                            } else {
                                t.css("left", parseInt(q.left))
                            }
                            var w = j._groupsheader();
                            var v = w ? j.groupsheader.height() : 0;
                            var y = j.showtoolbar ? j.toolbarheight : 0;
                            v += y;
                            var s = j.showstatusbar ? j.statusbarheight : 0;
                            v += s;
                            var u = 0;
                            if (j.pageable) {
                                u = j.pagerheight
                            }
                            var x = j.hScrollBar.css("visibility") == "visible" ? 17 : 0;
                            t.css("top", parseInt(q.top));
                            t.css("z-index", 99999);
                            if (j.columngroups) {
                                t.height(j.host.height() + j.resizablecolumn.columnelement.height() - u - v - x - j.columngroupslevel * j.columnsheight)
                            } else {
                                t.height(j.host.height() - u - v - x)
                            }
                            if (j.enableanimations) {
                                t.show("fast")
                            } else {
                                t.show()
                            }
                        };
                        r(j.resizeline);
                        r(j.resizestartline);
                        j.dragmousedown = null
                    }
                });
                var e = function () {
                    a(document.body).removeClass("jqx-disableselect");
                    a(document.body).removeClass("jqx-position-reset");
                    if (j.showfilterrow || j.showstatusbar || j.showtoolbar || j.enablebrowserselection) {
                        j.host.removeClass("jqx-disableselect");
                        j.content.removeClass("jqx-disableselect")
                    }
                    if (!j.resizing) {
                        return
                    }
                    j._mouseUpResize = new Date();
                    var r = j._mouseUpResize - j._mouseDownResize;
                    if (r < 200) {
                        j.resizing = false;
                        if (j._resizecolumn != null && j.resizeline != null && j.resizeline.css("display") == "block") {
                            j._resizecolumn = null;
                            j.resizeline.hide();
                            j.resizestartline.hide();
                            j.resizebackground.remove()
                        }
                        return
                    }
                    j.resizing = false;
                    if (j.disabled) {
                        return
                    }
                    var p = j.host.width();
                    if (j.vScrollBar[0].style.visibility != "hidden") {
                        p -= 20
                    }
                    if (p < 0) {
                        p = 0
                    }
                    if (j._resizecolumn != null && j.resizeline != null && j.resizeline.css("display") == "block") {
                        var s = parseInt(j.resizeline.css("left"));
                        var o = parseInt(j.resizestartline.css("left"));
                        var l = j._startcolumnwidth + s - o;
                        if (j.rtl) {
                            var l = j._startcolumnwidth - s + o
                        }
                        var q = j._resizecolumn.width;
                        j._closemenu();
                        if (l < j._resizecolumn.minwidth) {
                            l = j._resizecolumn.minwidth
                        }
                        j._resizecolumn.width = l;
                        if (j._resizecolumn._percentagewidth != undefined) {
                            j._resizecolumn._percentagewidth = (l / p) * 100
                        }
                        for (var k = 0; k < j._columns.length; k++) {
                            if (j._columns[k].datafield === j._resizecolumn.datafield) {
                                j._columns[k].width = j._resizecolumn.width;
                                if (j._columns[k].width < j._resizecolumn.minwidth) {
                                    j._columns[k].width = j._resizecolumn.minwidth
                                }
                                break
                            }
                        }
                        var n = j.hScrollBar[0].style.visibility;
                        j._updatecolumnwidths();
                        j._updatecellwidths();
                        j._raiseEvent(14, {
                            columntext: j._resizecolumn.text,
                            column: j._resizecolumn.getcolumnproperties(),
                            datafield: j._resizecolumn.datafield,
                            oldwidth: q,
                            newwidth: l
                        });
                        j._renderrows(j.virtualsizeinfo);
                        if (j.autosavestate) {
                            if (j.savestate) {
                                j.savestate()
                            }
                        }
                        if (n != j.hScrollBar[0].style.visibility) {
                            j.hScrollInstance.setPosition(0)
                        }
                        if (j.rtl) {
                            j._arrange()
                        }
                        j._resizecolumn = null;
                        j.resizeline.hide();
                        j.resizestartline.hide();
                        j.resizebackground.remove();
                        j.resizablecolumn = null
                    } else {
                        j.resizablecolumn = null
                    }
                };
                try {
                    if (document.referrer != "" || window.frameElement) {
                        var b = null;
                        if (window.top != null && window.top != window.self) {
                            if (window.parent && document.referrer) {
                                b = document.referrer
                            }
                        }
                        if (b && b.indexOf(document.location.host) != -1) {
                            var g = function (k) {
                                e()
                            };
                            if (window.top.document.addEventListener) {
                                window.top.document.addEventListener("mouseup", g, false)
                            } else {
                                if (window.top.document.attachEvent) {
                                    window.top.document.attachEvent("onmouseup", g)
                                }
                            }
                        }
                    }
                } catch (h) {
                }
                this.removeHandler(a(document), d);
                this.addHandler(a(document), d, function (l) {
                    var k = a.data(document.body, "contextmenu" + j.element.id);
                    if (k != null && j.autoshowcolumnsmenubutton) {
                        return true
                    }
                    e()
                })
            }
        }
    })
})(jqxBaseFramework);

