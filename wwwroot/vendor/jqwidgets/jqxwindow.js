/*
jQWidgets v5.4.0 (2017-Oct)
Copyright (c) 2011-2017 jQWidgets.
License: https://jqwidgets.com/license/
*/

(function (a) {
    a.jqx.jqxWidget("jqxWindow", "", {});
    a.extend(a.jqx._jqxWindow.prototype, {
        defineInstance: function () {
            var e = {
                height: "auto",
                width: 200,
                minHeight: 50,
                maxHeight: 1200,
                minWidth: 50,
                maxWidth: 1200,
                showCloseButton: true,
                disabled: false,
                autoOpen: true,
                keyboardCloseKey: "esc",
                title: "",
                content: "",
                draggable: true,
                resizable: true,
                animationType: "fade",
                closeAnimationDuration: 250,
                showAnimationDuration: 250,
                isModal: false,
                position: "center",
                closeButtonSize: 16,
                closeButtonAction: "hide",
                modalOpacity: 0.3,
                dragArea: null,
                okButton: null,
                cancelButton: null,
                dialogResult: {OK: false, Cancel: false, None: true},
                collapsed: false,
                showCollapseButton: false,
                collapseAnimationDuration: 150,
                collapseButtonSize: 16,
                rtl: false,
                keyboardNavigation: true,
                headerHeight: null,
                _events: ["created", "closed", "moving", "moved", "open", "collapse", "expand", "open", "close", "resize"],
                initContent: null,
                enableResize: true,
                restricter: null,
                autoFocus: true,
                closing: null,
                _invalidArgumentExceptions: {
                    invalidHeight: "Invalid height!",
                    invalidWidth: "Invalid width!",
                    invalidMinHeight: "Invalid minHeight!",
                    invalidMaxHeight: "Invalid maxHeight!",
                    invalidMinWidth: "Invalid minWidth!",
                    invalidMaxWidth: "Invalid maxWidth",
                    invalidKeyCode: "Invalid keyCode!",
                    invalidAnimationType: "Invalid animationType!",
                    invalidCloseAnimationDuration: "Invalid closeAnimationDuration!",
                    invalidShowAnimationDuration: "Invalid showAnimationDuration!",
                    invalidPosition: "Invalid position!",
                    invalidCloseButtonSize: "Invalid closeButtonSize!",
                    invalidCollapseButtonSize: "Invalid collapseButtonSize!",
                    invalidCloseButtonAction: "Invalid cluseButtonAction!",
                    invalidModalOpacity: "Invalid modalOpacity!",
                    invalidDragArea: "Invalid dragArea!",
                    invalidDialogResult: "Invalid dialogResult!",
                    invalidIsModal: "You can have just one modal window!"
                },
                _enableResizeCollapseBackup: null,
                _enableResizeBackup: undefined,
                _heightBeforeCollapse: null,
                _minHeightBeforeCollapse: null,
                _mouseDown: false,
                _isDragging: false,
                _rightContentWrapper: null,
                _leftContentWrapper: null,
                _headerContentWrapper: null,
                _closeButton: null,
                _collapseButton: null,
                _title: null,
                _content: null,
                _mousePosition: {},
                _windowPosition: {},
                _modalBackground: null,
                _SCROLL_WIDTH: 21,
                _visible: true,
                modalBackgroundZIndex: 1299,
                modalZIndex: 1800,
                zIndex: 1000,
                _touchEvents: {
                    mousedown: a.jqx.mobile.getTouchEventName("touchstart"),
                    mouseup: a.jqx.mobile.getTouchEventName("touchend"),
                    mousemove: a.jqx.mobile.getTouchEventName("touchmove"),
                    mouseenter: "mouseenter",
                    mouseleave: "mouseleave",
                    click: a.jqx.mobile.getTouchEventName("touchstart")
                }
            };
            if (this === a.jqx._jqxWindow.prototype) {
                return e
            }
            a.extend(true, this, e);
            return e
        }, createInstance: function () {
            if (this.host.initAnimate) {
                this.host.initAnimate()
            }
            this.host.attr("role", "dialog");
            this.host.removeAttr("data-bind");
            this.host.appendTo(document.body);
            var g = this;
            var f = function (l) {
                for (var k = 0; k < l.length; k++) {
                    var j = l[k];
                    if (g[j] && g[j].toString().indexOf("px") >= 0) {
                        g[j] = parseInt(g[j], 10)
                    }
                }
            };
            f(["minWidth", "minHeight", "maxWidth", "maxHeight", "width", "height"]);
            var h = function () {
                var j = parseInt(a(g.restricter).css("padding-top"), 10);
                var i = parseInt(a(g.restricter).css("padding-left"), 10);
                var k = parseInt(a(g.restricter).css("padding-bottom"), 10);
                var m = parseInt(a(g.restricter).css("padding-right"), 10);
                var l = a(g.restricter).coord();
                g.dragArea = {
                    left: i + l.left,
                    top: j + l.top,
                    width: 1 + m + a(g.restricter).width(),
                    height: 1 + k + a(g.restricter).height()
                }
            };
            if (this.restricter) {
                h()
            }
            if (this.restricter) {
                this.addHandler(a(window), "resize." + this.element.id, function () {
                    h()
                });
                this.addHandler(a(window), "orientationchanged." + this.element.id, function () {
                    h()
                });
                this.addHandler(a(window), "orientationchange." + this.element.id, function () {
                    h()
                })
            }
            this._isTouchDevice = a.jqx.mobile.isTouchDevice();
            this._validateProperties();
            this._createStructure();
            this._refresh();
            if (!this.autoOpen) {
                this.element.style.display = "none"
            }
            if (a.jqx.browser.msie) {
                this.host.addClass(this.toThemeProperty("jqx-noshadow"))
            }
            if (!this.isModal) {
                this._fixWindowZIndex()
            }
            this._setStartupSettings();
            this._positionWindow();
            this._raiseEvent(0);
            if (this.autoOpen) {
                this._performLayout();
                var e = this;
                if (this.isModal) {
                    this._fixWindowZIndex("modal-show")
                }
                if (e.initContent) {
                    e.initContent();
                    e._contentInitialized = true
                }
                this._raiseEvent(7);
                this._raiseEvent(9)
            }
        }, refresh: function () {
            this._performLayout()
        }, _setStartupSettings: function () {
            if (this.disabled) {
                this.disable()
            }
            if (this.collapsed) {
                this.collapsed = false;
                this.collapse(0)
            }
            if (!this.autoOpen) {
                this.hide(null, 0.001, true);
                this._visible = false
            }
            if (this.title !== null && this.title !== "") {
                this.setTitle(this.title)
            }
            if (this.content !== null && this.content !== "") {
                this.setContent(this.content)
            }
            this.title = this._headerContentWrapper.html();
            this.content = this._content.html()
        }, _fixWindowZIndex: function (h) {
            var g = a.data(document.body, "jqxwindows-list") || [], l = this.zIndex;
            if (!this.isModal) {
                if (this._indexOf(this.host, g) < 0) {
                    g.push(this.host)
                }
                a.data(document.body, "jqxwindows-list", g);
                if (g.length > 1) {
                    var k = g[g.length - 2];
                    if (k.css("z-index") == "auto") {
                        l = this.zIndex + g.length + 1
                    } else {
                        var i = this.zIndex;
                        l = parseInt(k.css("z-index"), 10) + 1;
                        if (l < i) {
                            l = i
                        }
                    }
                }
            } else {
                if (g) {
                    g = this._removeFromArray(this.host, g);
                    a.data(document.body, "jqxwindows-list", g)
                }
                var f = a.data(document.body, "jqxwindows-modallist");
                if (!f) {
                    if (h == "modal-show") {
                        var j = [];
                        j.push(this.host);
                        a.data(document.body, "jqxwindows-modallist", j);
                        f = j
                    } else {
                        a.data(document.body, "jqxwindows-modallist", []);
                        f = []
                    }
                } else {
                    if (h == "modal-show") {
                        f.push(this.host)
                    } else {
                        var e = f.indexOf(this.host);
                        if (e != -1) {
                            f.splice(e, 1)
                        }
                    }
                }
                l = this.modalZIndex;
                a.each(f, function () {
                    if (this.data()) {
                        if (this.data().jqxWindow) {
                            var m = this.data().jqxWindow.instance;
                            m._modalBackground.style.zIndex = l;
                            m.element.style.zIndex = l + 1;
                            l += 2
                        }
                    }
                });
                a.data(document.body, "jqxwindow-modal", this.host);
                return
            }
            this.element.style.zIndex = l;
            this._sortByStyle("z-index", g)
        }, _validateProperties: function () {
            try {
                this._validateSize();
                this._validateAnimationProperties();
                this._validateInteractionProperties();
                this._validateModalProperties();
                if (!this.position) {
                    throw new Error(this._invalidArgumentExceptions.invalidPosition)
                }
                if (isNaN(this.closeButtonSize) || parseInt(this.closeButtonSize, 10) < 0) {
                    throw new Error(this._invalidArgumentExceptions.invalidCloseButtonSize)
                }
                if (isNaN(this.collapseButtonSize) || parseInt(this.collapseButtonSize, 10) < 0) {
                    throw new Error(this._invalidArgumentExceptions.invalidCollapseButtonSize)
                }
            } catch (e) {
                throw new Error(e)
            }
        }, _validateModalProperties: function () {
            if (this.modalOpacity < 0 || this.modalOpacity > 1) {
                throw new Error(this._invalidArgumentExceptions.invalidModalOpacity)
            }
            if (this.isModal && !this._singleModalCheck()) {
                throw new Error(this._invalidArgumentExceptions.invalidIsModal)
            }
        }, _validateSize: function () {
            this._validateSizeLimits();
            if (this.height !== "auto" && isNaN(parseInt(this.height, 10))) {
                throw new Error(this._invalidArgumentExceptions.invalidHeight)
            }
            if (this.width !== "auto" && isNaN(parseInt(this.width, 10))) {
                throw new Error(this._invalidArgumentExceptions.invalidWidth)
            }
            if (this.height !== "auto" && this.height < this.minHeight) {
                this.height = this.minHeight
            }
            if (this.width < this.minWidth) {
                this.width = this.minWidth
            }
            if (this.height !== "auto" && this.height > this.maxHeight) {
                this.height = this.maxHeight
            }
            if (this.width > this.maxWidth) {
                this.width = this.maxWidth
            }
            if (this.dragArea === null) {
                return
            }
            if (this.dragArea && ((this.dragArea.height !== null && this.host.height() > this.dragArea.height) || (parseInt(this.height, 10) > this.dragArea.height)) || (this.dragArea.width !== null && this.width > this.dragArea.width) || (this.maxHeight > this.dragArea.height || this.maxWidth > this.dragArea.width)) {
            }
        }, _validateSizeLimits: function () {
            if (this.maxHeight == null) {
                this.maxHeight = 9999
            }
            if (this.minWidth == null) {
                this.minWidth = 0
            }
            if (this.maxWidth == null) {
                this.maxWidth = 9999
            }
            if (this.minHeight == null) {
                this.minHeight = 0
            }
            if (isNaN(parseInt(this.minHeight, 10))) {
                throw new Error(this._invalidArgumentExceptions.invalidMinHeight)
            }
            if (isNaN(parseInt(this.maxHeight, 10))) {
                throw new Error(this._invalidArgumentExceptions.invalidMaxHeight)
            }
            if (isNaN(parseInt(this.minWidth, 10))) {
                throw new Error(this._invalidArgumentExceptions.invalidMinWidth)
            }
            if (isNaN(parseInt(this.maxWidth, 10))) {
                throw new Error(this._invalidArgumentExceptions.invalidMaxWidth)
            }
            if (this.minHeight && this.maxHeight) {
                if (parseInt(this.minHeight, 10) > parseInt(this.maxHeight, 10) && this.maxHeight != Number.MAX_VALUE) {
                    throw new Error(this._invalidArgumentExceptions.invalidMinHeight)
                }
            }
            if (this.minWidth && this.maxWidth) {
                if (parseInt(this.minWidth, 10) > parseInt(this.maxWidth, 10) && this.maxWidth != Number.MAX_VALUE) {
                    throw new Error(this._invalidArgumentExceptions.invalidMinWidth)
                }
            }
        }, _validateAnimationProperties: function () {
            if (this.animationType !== "fade" && this.animationType !== "slide" && this.animationType !== "combined" && this.animationType !== "none") {
                throw new Error(this._invalidArgumentExceptions.invalidAnimationType)
            }
            if (isNaN(parseInt(this.closeAnimationDuration, 10)) || this.closeAnimationDuration < 0) {
                throw new Error(this._invalidArgumentExceptions.invalidCloseAnimationDuration)
            }
            if (isNaN(parseInt(this.showAnimationDuration, 10)) || this.showAnimationDuration < 0) {
                throw new Error(this._invalidArgumentExceptions.invalidShowAnimationDuration)
            }
        }, _validateInteractionProperties: function () {
            if (parseInt(this.keyCode, 10) < 0 || parseInt(this.keyCode, 10) > 130 && this.keyCode !== "esc") {
                throw new Error(this._invalidArgumentExceptions.invalidKeyCode)
            }
            if (this.dragArea !== null && (typeof this.dragArea.width === "undefined" || typeof this.dragArea.height === "undefined" || typeof this.dragArea.left === "undefined" || typeof this.dragArea.top === "undefined")) {
                throw new Error(this._invalidArgumentExceptions.invalidDragArea)
            }
            if (!this.dialogResult || (!this.dialogResult.OK && !this.dialogResult.Cancel && !this.dialogResult.None)) {
                throw new Error(this._invalidArgumentExceptions.invalidDialogResult)
            }
            if (this.closeButtonAction !== "hide" && this.closeButtonAction !== "close") {
                throw new Error(this._invalidArgumentExceptions.invalidCloseButtonAction)
            }
        }, _singleModalCheck: function () {
            var e = a.data(document.body, "jqxwindows-list") || [], f = e.length;
            while (f) {
                f -= 1;
                if (a(e[f].attr("id")).length > 0) {
                    if (a(e[f].attr("id")).jqxWindow("isModal")) {
                        return false
                    }
                }
            }
            return true
        }, _createStructure: function () {
            var e = this.host.children();
            if (e.length === 1) {
                this._content = e[0];
                this._header = document.createElement("div");
                this._header.innerHTML = this.host.attr("caption");
                this.element.insertBefore(this._header, this._content);
                this.host.attr("caption", "");
                this._header = a(this._header);
                this._content = a(this._content)
            } else {
                if (e.length === 2) {
                    this._header = a(e[0]);
                    this._content = a(e[1])
                } else {
                    throw new Error("Invalid structure!")
                }
            }
        }, _refresh: function () {
            this._render();
            this._addStyles();
            this._performLayout();
            this._removeEventHandlers();
            this._addEventHandlers();
            this._initializeResize()
        }, _render: function () {
            this._addHeaderWrapper();
            this._addCloseButton();
            this._addCollapseButton();
            this._removeModal();
            this._makeModal()
        }, _addHeaderWrapper: function () {
            if (!this._headerContentWrapper) {
                this._header[0].innerHTML = '<div style="float:left;">' + this._header[0].innerHTML + "</div>";
                this._headerContentWrapper = a(this._header.children()[0]);
                if (this.headerHeight !== null) {
                    this._header.height(this.headerHeight)
                }
            }
        }, _addCloseButton: function () {
            if (!this._closeButton) {
                this._closeButtonWrapper = document.createElement("div");
                this._closeButtonWrapper.className = this.toThemeProperty("jqx-window-close-button-background");
                this._closeButton = document.createElement("div");
                this._closeButton.className = this.toThemeProperty("jqx-window-close-button jqx-icon-close");
                this._closeButton.style.width = "100%";
                this._closeButton.style.height = "100%";
                this._closeButtonWrapper.appendChild(this._closeButton);
                this._header[0].appendChild(this._closeButtonWrapper);
                this._closeButtonWrapper = a(this._closeButtonWrapper);
                this._closeButton = a(this._closeButton)
            }
        }, _addCollapseButton: function () {
            if (!this._collapseButton) {
                this._collapseButtonWrapper = document.createElement("div");
                this._collapseButtonWrapper.className = this.toThemeProperty("jqx-window-collapse-button-background");
                this._collapseButton = document.createElement("div");
                this._collapseButton.className = this.toThemeProperty("jqx-window-collapse-button jqx-icon-arrow-up");
                this._collapseButton.style.width = "100%";
                this._collapseButton.style.height = "100%";
                this._collapseButtonWrapper.appendChild(this._collapseButton);
                this._header[0].appendChild(this._collapseButtonWrapper);
                this._collapseButtonWrapper = a(this._collapseButtonWrapper);
                this._collapseButton = a(this._collapseButton)
            }
        }, _removeModal: function () {
            if (!this.isModal && typeof this._modalBackground === "object" && this._modalBackground !== null) {
                a("." + this.toThemeProperty("jqx-window-modal")).remove();
                this._modalBackground = null
            }
        }, focus: function () {
            try {
                this.host.focus();
                var f = this;
                setTimeout(function () {
                    f.host.focus()
                }, 10)
            } catch (e) {
            }
        }, _makeModal: function () {
            if (this.isModal && !this._modalBackground) {
                var g = a.data(document.body, "jqxwindows-list");
                if (g) {
                    this._removeFromArray(this.host, g);
                    a.data(document.body, "jqxwindows-list", g)
                }
                this._modalBackground = document.createElement("div");
                this._modalBackground.className = this.toThemeProperty("jqx-window-modal");
                this._setModalBackgroundStyles();
                document.body.appendChild(this._modalBackground);
                this.addHandler(this._modalBackground, this._getEvent("click"), function () {
                    return false
                });
                var f = this;
                var e = function (h, i) {
                    return i.contains(h)
                };
                this.addHandler(this._modalBackground, "mouseup", function (h) {
                    f._stopResizing(f);
                    h.preventDefault()
                });
                this.addHandler(this._modalBackground, "mousedown", function (i) {
                    var h = f._getTabbables();
                    if (h.length > 0) {
                        h[0].focus(1);
                        setTimeout(function () {
                            h[0].focus(1)
                        }, 100)
                    }
                    i.preventDefault();
                    return false
                });
                this.addHandler(a(document), "keydown.window" + this.element.id, function (k) {
                    if (k.keyCode !== 9) {
                        return
                    }
                    var h = a.data(document.body, "jqxwindows-modallist");
                    if (h.length > 1) {
                        if (h[h.length - 1][0] != f.element) {
                            return
                        }
                    }
                    var j = f._getTabbables();
                    var l = null;
                    var i = null;
                    if (f.element.offsetWidth === 0 || f.element.offsetHeight === 0) {
                        return
                    }
                    if (j.length > 0) {
                        l = j[0];
                        i = j[j.length - 1]
                    }
                    if (k.target == f.element) {
                        return
                    }
                    if (l == null) {
                        return
                    }
                    if (!e(k.target, f.element)) {
                        l.focus(1);
                        return false
                    }
                    if (k.target === i && !k.shiftKey) {
                        l.focus(1);
                        return false
                    } else {
                        if (k.target === l && k.shiftKey) {
                            i.focus(1);
                            return false
                        }
                    }
                })
            }
        }, _addStyles: function () {
            this.host.addClass(this.toThemeProperty("jqx-rc-all"));
            this.host.addClass(this.toThemeProperty("jqx-window"));
            this.host.addClass(this.toThemeProperty("jqx-popup"));
            if (a.jqx.browser.msie) {
                this.host.addClass(this.toThemeProperty("jqx-noshadow"))
            }
            this.host.addClass(this.toThemeProperty("jqx-widget"));
            this.host.addClass(this.toThemeProperty("jqx-widget-content"));
            this._header.addClass(this.toThemeProperty("jqx-window-header"));
            this._content.addClass(this.toThemeProperty("jqx-window-content"));
            this._header.addClass(this.toThemeProperty("jqx-widget-header"));
            this._content.addClass(this.toThemeProperty("jqx-widget-content"));
            this._header.addClass(this.toThemeProperty("jqx-disableselect"));
            this._header.addClass(this.toThemeProperty("jqx-rc-t"));
            this._content.addClass(this.toThemeProperty("jqx-rc-b"));
            if (!this.host.attr("tabindex")) {
                this.element.tabIndex = 0;
                this._header[0].tabIndex = 0;
                this._content[0].tabIndex = 0
            }
            this.element.setAttribute("hideFocus", "true");
            this.element.style.outline = "none"
        }, _performHeaderLayout: function () {
            this._handleHeaderButtons();
            this._header[0].style.position = "relative";
            if (this.rtl) {
                this._headerContentWrapper[0].style.direction = "rtl";
                this._headerContentWrapper[0].style["float"] = "right"
            } else {
                this._headerContentWrapper[0].style.direction = "ltr";
                this._headerContentWrapper[0].style["float"] = "left"
            }
            this._performHeaderCloseButtonLayout();
            this._performHeaderCollapseButtonLayout();
            this._centerElement(this._headerContentWrapper, this._header, "y", "margin");
            if (this.headerHeight) {
                this._centerElement(this._closeButtonWrapper, this._header, "y", "margin");
                this._centerElement(this._collapseButtonWrapper, this._header, "y", "margin")
            }
        }, _handleHeaderButtons: function () {
            if (!this._closeButtonWrapper) {
                return
            }
            if (!this.showCloseButton) {
                this._closeButtonWrapper[0].style.visibility = "hidden"
            } else {
                this._closeButtonWrapper[0].style.visibility = "visible";
                var e = this._toPx(this.closeButtonSize);
                this._closeButtonWrapper[0].style.width = e;
                this._closeButtonWrapper[0].style.height = e
            }
            if (!this.showCollapseButton) {
                this._collapseButtonWrapper[0].style.visibility = "hidden"
            } else {
                this._collapseButtonWrapper[0].style.visibility = "visible";
                var f = this._toPx(this.collapseButtonSize);
                this._collapseButtonWrapper[0].style.width = f;
                this._collapseButtonWrapper[0].style.height = f
            }
        }, _performHeaderCloseButtonLayout: function () {
            if (!this._closeButtonWrapper) {
                return
            }
            var e = parseInt(this._header.css("padding-right"), 10);
            if (!isNaN(e)) {
                this._closeButtonWrapper.width(this._closeButton.width());
                if (!this.rtl) {
                    this._closeButtonWrapper[0].style.marginRight = this._toPx(e);
                    this._closeButtonWrapper[0].style.marginLeft = "0px"
                } else {
                    this._closeButtonWrapper[0].style.marginRight = "0px";
                    this._closeButtonWrapper[0].style.marginLeft = this._toPx(e)
                }
            }
            this._closeButtonWrapper[0].style.position = "absolute";
            if (!this.rtl) {
                this._closeButtonWrapper[0].style.right = "0px";
                this._closeButtonWrapper[0].style.left = ""
            } else {
                this._closeButtonWrapper[0].style.right = "";
                this._closeButtonWrapper[0].style.left = "0px"
            }
        }, _performHeaderCollapseButtonLayout: function () {
            if (!this._closeButtonWrapper) {
                return
            }
            var g = parseInt(this._header.css("padding-right"), 10);
            if (!isNaN(g)) {
                var f = this._toPx(this.collapseButtonSize);
                this._collapseButtonWrapper[0].style.width = f;
                this._collapseButtonWrapper[0].style.height = f;
                if (!this.rtl) {
                    this._collapseButtonWrapper[0].style.marginRight = this._toPx(g);
                    this._collapseButtonWrapper[0].style.marginLeft = "0px"
                } else {
                    this._collapseButtonWrapper[0].style.marginRight = "0px";
                    this._collapseButtonWrapper[0].style.marginLeft = this._toPx(g)
                }
            }
            this._collapseButtonWrapper[0].style.position = "absolute";
            var e = this._toPx(this.showCloseButton ? this._closeButton.outerWidth(true) : 0);
            if (!this.rtl) {
                this._collapseButtonWrapper[0].style.right = e;
                this._collapseButtonWrapper[0].style.left = ""
            } else {
                this._collapseButtonWrapper[0].style.right = "";
                this._collapseButtonWrapper[0].style.left = e
            }
            this._centerElement(this._collapseButton, a(this._collapseButton[0].parentElement), "y")
        }, _performWidgetLayout: function () {
            var e;
            if (this.width !== "auto") {
                if (this.width && this.width.toString().indexOf("%") >= 0) {
                    this.element.style.width = this.width
                } else {
                    this.element.style.width = this._toPx(this.width)
                }
            }
            if (!this.collapsed) {
                if (this.height !== "auto") {
                    if (this.height && this.height.toString().indexOf("%") >= 0) {
                        this.element.style.height = this.height
                    } else {
                        this.element.style.height = this._toPx(this.height)
                    }
                } else {
                    this.element.style.height = this.host.height() + "px"
                }
                this.element.style.minHeight = this._toPx(this.minHeight)
            }
            this._setChildrenLayout();
            e = this._validateMinSize();
            this.element.style.maxHeight = this._toPx(this.maxHeight);
            this.element.style.minWidth = this._toPx(this.minWidth);
            this.element.style.maxWidth = this._toPx(this.maxWidth);
            if (!e) {
                this._setChildrenLayout()
            }
        }, _setChildrenLayout: function () {
            this._header.width(this.host.width() - (this._header.outerWidth(true) - this._header.width()));
            this._content.width(this.host.width() - (this._content.outerWidth(true) - this._content.width()));
            this._content.height(this.host.height() - this._header.outerHeight(true) - (this._content.outerHeight(true) - this._content.height()))
        }, _validateMinSize: function () {
            var f = true;
            if (this.minHeight < this._header.height()) {
                this.minHeight = this._header.height();
                f = false
            }
            var h = a(this._header.children()[0]).outerWidth(),
                e = this._header.children()[1] ? a(this._header.children()[1]).outerWidth() : 0, g = h + e;
            if (this.minWidth < 100) {
                this.minWidth = Math.min(g, 100);
                f = false
            }
            return f
        }, _centerElement: function (h, f, e, g) {
            if (typeof f.left === "number" && typeof f.top === "number" && typeof f.height === "number" && typeof f.width === "number") {
                this._centerElementInArea(h, f, e)
            } else {
                this._centerElementInParent(h, f, e, g)
            }
        }, _centerElementInParent: function (e, o, j, g) {
            var n = e.css("display") === "none";
            var f, h;
            j = j.toLowerCase();
            if (g) {
                f = g + "Top";
                h = g + "Left"
            } else {
                f = "top";
                h = "left"
            }
            if (j.indexOf("y") >= 0) {
                if (n) {
                    e[0].style.display = "block"
                }
                var i = e.outerHeight(true), l;
                if (n) {
                    e[0].style.display = "none"
                }
                l = o.height();
                var k = (Math.max(0, l - i)) / 2;
                e[0].style[f] = k + "px"
            }
            if (j.indexOf("x") >= 0) {
                if (n) {
                    e[0].style.display = "block"
                }
                var q = e.outerWidth(true), p;
                if (n) {
                    e[0].style.display = "none"
                }
                p = o.width();
                var m = (Math.max(0, p - q)) / 2;
                e[0].style[h] = m + "px"
            }
        }, _centerElementInArea: function (f, e, h) {
            h = h.toLowerCase();
            if (h.indexOf("y") >= 0) {
                var g = f.outerHeight(true);
                var j = e.height;
                var i = (j - g) / 2;
                f[0].style.top = i + e.top + "px"
            }
            if (h.indexOf("x") >= 0) {
                var m = f.outerWidth(true);
                var l = e.width;
                var k = (l - m) / 2;
                f[0].style.left = k + e.left + "px"
            }
        }, _removeEventHandlers: function () {
            this.removeHandler(this._header, this._getEvent("mousedown"));
            this.removeHandler(this._header, this._getEvent("mousemove"));
            this.removeHandler(this._header, "focus");
            this.removeHandler(a(document), this._getEvent("mousemove") + "." + this.host.attr("id"));
            this.removeHandler(a(document), this._getEvent("mouseup") + "." + this.host.attr("id"));
            this.removeHandler(this.host, "keydown");
            this.removeHandler(this._closeButton, this._getEvent("click"));
            this.removeHandler(this._closeButton, this._getEvent("mouseenter"));
            this.removeHandler(this._closeButton, this._getEvent("mouseleave"));
            this.removeHandler(this._collapseButton, this._getEvent("click"));
            this.removeHandler(this._collapseButton, this._getEvent("mouseenter"));
            this.removeHandler(this._collapseButton, this._getEvent("mouseleave"));
            this.removeHandler(this.host, this._getEvent("mousedown"));
            if (this.okButton) {
                this.removeHandler(a(this.okButton), this._getEvent("click"), this._setDialogResultHandler)
            }
            if (this.cancelButton) {
                this.removeHandler(a(this.cancelButton), this._getEvent("click"), this._setDialogResultHandler)
            }
            this.removeHandler(this._header, this._getEvent("mouseenter"));
            this.removeHandler(this._header, this._getEvent("mouseleave"));
            this.removeHandler(this.host, "resizing", this._windowResizeHandler)
        }, _removeFromArray: function (e, g) {
            var f = this._indexOf(e, g);
            if (f >= 0) {
                return g.splice(this._indexOf(e, g), 1)
            } else {
                return g
            }
        }, _sortByStyle: function (e, l) {
            for (var h = 0; h < l.length; h++) {
                for (var f = l.length - 1; f > h; f--) {
                    var m = l[f], k = l[f - 1], g;
                    if (parseInt(m.css(e), 10) < parseInt(k.css(e), 10)) {
                        g = m;
                        l[f] = k;
                        l[f - 1] = g
                    }
                }
            }
        }, _initializeResize: function () {
            if (this.resizable) {
                var e = this;
                this.initResize({
                    target: this.host,
                    alsoResize: e._content,
                    maxWidth: e.maxWidth,
                    minWidth: e.minWidth,
                    maxHeight: e.maxHeight,
                    minHeight: e.minHeight,
                    indicatorSize: 10,
                    resizeParent: e.dragArea
                })
            }
        }, _removeResize: function () {
            this.removeResize()
        }, _getEvent: function (e) {
            if (this._isTouchDevice) {
                return this._touchEvents[e]
            } else {
                return e
            }
        }, _addEventHandlers: function () {
            this._addDragDropHandlers();
            this._addCloseHandlers();
            this._addCollapseHandlers();
            this._addFocusHandlers();
            this._documentResizeHandlers();
            this._closeButtonHover();
            this._collapseButtonHover();
            this._addDialogButtonsHandlers();
            this._addHeaderHoverEffect();
            this._addResizeHandlers();
            var e = this;
            this.addHandler(this._header, this._getEvent("mousemove"), function () {
                e._addHeaderCursorHandlers(e)
            })
        }, _addResizeHandlers: function () {
            var e = this;
            e.addHandler(e.host, "resizing", e._windowResizeHandler, {self: e});
            this.addHandler(a(window), "orientationchanged." + this.element.id, function () {
                e._performLayout()
            });
            this.addHandler(a(window), "orientationchange." + this.element.id, function () {
                e._performLayout()
            })
        }, _windowResizeHandler: function (h) {
            var e = h.data.self;
            e._header.width(e.host.width() - (e._header.outerWidth(true) - e._header.width()));
            if (e.width && e.width.toString().indexOf("%") >= 0) {
                var g = a(document.body).width() / 100;
                var f = 1 / g;
                e.width = (f * h.args.width) + "%"
            } else {
                e.width = h.args.width
            }
            if (e.height && e.height.toString().indexOf("%") >= 0) {
                var g = a(document.body).height() / 100;
                var f = 1 / g;
                e.height = (f * h.args.height) + "%"
            } else {
                e.height = h.args.height
            }
        }, _addHeaderHoverEffect: function () {
            var e = this;
            this.addHandler(this._header, this._getEvent("mouseenter"), function () {
                a(this).addClass(e.toThemeProperty("jqx-window-header-hover"))
            });
            this.addHandler(this._header, this._getEvent("mouseleave"), function () {
                a(this).removeClass(e.toThemeProperty("jqx-window-header-hover"))
            })
        }, _addDialogButtonsHandlers: function () {
            if (this.okButton) {
                this.addHandler(a(this.okButton), this._getEvent("click"), this._setDialogResultHandler, {
                    self: this,
                    result: "ok"
                })
            }
            if (this.cancelButton) {
                this.addHandler(a(this.cancelButton), this._getEvent("click"), this._setDialogResultHandler, {
                    self: this,
                    result: "cancel"
                })
            }
        }, _documentResizeHandlers: function () {
            var e = this;
            if (this.isModal) {
                this.addHandler(a(window), "resize.window" + this.element.id, function () {
                    if (typeof e._modalBackground === "object" && e._modalBackground !== null) {
                        if (e.isOpen()) {
                            e._modalBackground.style.display = "none"
                        }
                        if (!e.restricter) {
                            var f = e._getDocumentSize();
                            e._modalBackground.style.width = f.width + "px";
                            e._modalBackground.style.height = f.height + "px"
                        } else {
                            e._modalBackground.style.left = e._toPx(e.dragArea.left);
                            e._modalBackground.style.top = e._toPx(e.dragArea.top);
                            e._modalBackground.style.width = e._toPx(e.dragArea.width);
                            e._modalBackground.style.height = e._toPx(e.dragArea.height)
                        }
                        if (e.isOpen()) {
                            e._modalBackground.style.display = "block"
                        }
                    }
                })
            }
        }, _setDialogResultHandler: function (f) {
            var e = f.data.self;
            e._setDialogResult(f.data.result);
            e.closeWindow()
        }, _setDialogResult: function (e) {
            this.dialogResult.OK = false;
            this.dialogResult.None = false;
            this.dialogResult.Cancel = false;
            e = e.toLowerCase();
            switch (e) {
                case"ok":
                    this.dialogResult.OK = true;
                    break;
                case"cancel":
                    this.dialogResult.Cancel = true;
                    break;
                default:
                    this.dialogResult.None = true
            }
        }, _getDocumentSize: function () {
            var e = a.jqx.browser.msie && a.jqx.browser.version < 9;
            var f = e ? 4 : 0;
            var g = f;
            if (document.body.scrollHeight > document.body.clientHeight && e) {
                f = this._SCROLL_WIDTH
            }
            if (document.body.scrollWidth > document.body.clientWidth && e) {
                g = this._SCROLL_WIDTH
            }
            return {width: a(document).width() - f, height: a(document).height() - g}
        }, _closeButtonHover: function () {
            var e = this;
            this.addHandler(this._closeButton, this._getEvent("mouseenter"), function () {
                e._closeButton.addClass(e.toThemeProperty("jqx-window-close-button-hover"))
            });
            this.addHandler(this._closeButton, this._getEvent("mouseleave"), function () {
                e._closeButton.removeClass(e.toThemeProperty("jqx-window-close-button-hover"))
            })
        }, _collapseButtonHover: function () {
            var e = this;
            this.addHandler(this._collapseButton, this._getEvent("mouseenter"), function () {
                e._collapseButton.addClass(e.toThemeProperty("jqx-window-collapse-button-hover"))
            });
            this.addHandler(this._collapseButton, this._getEvent("mouseleave"), function () {
                e._collapseButton.removeClass(e.toThemeProperty("jqx-window-collapse-button-hover"))
            })
        }, _setModalBackgroundStyles: function () {
            if (this.isModal) {
                var e = this._getDocumentSize();
                if (!(a.jqx.browser.msie && a.jqx.browser.version < 9)) {
                    this._modalBackground.style.opacity = this.modalOpacity
                } else {
                    this._modalBackground.style.filter = "alpha(opacity=" + (this.modalOpacity * 100) + ")"
                }
                this._modalBackground.style.position = "absolute";
                this._modalBackground.style.top = "0px";
                this._modalBackground.style.left = "0px";
                this._modalBackground.style.width = e.width;
                this._modalBackground.style.height = e.height;
                this._modalBackground.style.zIndex = this.modalBackgroundZIndex;
                if (!this.autoOpen) {
                    this._modalBackground.style.display = "none"
                }
            }
        }, _addFocusHandlers: function () {
            var e = this;
            this.addHandler(this.host, this._getEvent("mousedown"), function () {
                if (!e.isModal) {
                    e.bringToFront()
                }
            })
        }, _indexOf: function (f, g) {
            for (var e = 0; e < g.length; e++) {
                if (g[e][0] === f[0]) {
                    return e
                }
            }
            return -1
        }, _addCloseHandlers: function () {
            var e = this;
            this.addHandler(this._closeButton, this._getEvent("click"), function (f) {
                return e._closeWindow(f)
            });
            if (this.keyboardCloseKey !== "none") {
                if (typeof this.keyboardCloseKey !== "number" && this.keyboardCloseKey.toLowerCase() === "esc") {
                    this.keyboardCloseKey = 27
                }
            }
            this.addHandler(this.host, "keydown", function (f) {
                if (f.keyCode === e.keyboardCloseKey && e.keyboardCloseKey != null && e.keyboardCloseKey != "none") {
                    e._closeWindow(f)
                } else {
                    e._handleKeys(f)
                }
            }, {self: this});
            this.addHandler(this.host, "keyup", function () {
                if (!e.keyboardNavigation) {
                    return
                }
                if (e._moved) {
                    var h = e.host.coord();
                    var g = h.left;
                    var f = h.top;
                    e._raiseEvent(3, g, f, g, f);
                    e._moved = false
                }
            })
        }, _handleKeys: function (f) {
            if (!this.keyboardNavigation) {
                return
            }
            if (!this._headerFocused) {
                return
            }
            if (a(document.activeElement).ischildof(this._content)) {
                return
            }
            var e = f.ctrlKey;
            var m = f.keyCode;
            var k = this.host.coord();
            var j = k.left;
            var l = k.top;
            var g = this._getDraggingArea();
            var h = this.host.width();
            var n = this.host.height();
            var o = true;
            var i = 10;
            switch (m) {
                case 37:
                    if (!e) {
                        if (this.draggable) {
                            if (j - i >= 0) {
                                this.move(j - i, l)
                            }
                        }
                    } else {
                        if (this.resizable) {
                            this.resize(h - i, n)
                        }
                    }
                    o = false;
                    break;
                case 38:
                    if (!e) {
                        if (this.draggable) {
                            if (l - i >= 0) {
                                this.move(j, l - i)
                            }
                        }
                    } else {
                        if (this.resizable) {
                            this.resize(h, n - i)
                        }
                    }
                    o = false;
                    break;
                case 39:
                    if (!e) {
                        if (this.draggable) {
                            if (j + h + i <= g.width) {
                                this.move(j + i, l)
                            }
                        }
                    } else {
                        if (this.resizable) {
                            this.resize(h + i, n)
                        }
                    }
                    o = false;
                    break;
                case 40:
                    if (!e) {
                        if (this.draggable) {
                            if (l + n + i <= g.height) {
                                this.move(j, l + i)
                            }
                        }
                    } else {
                        if (this.resizable) {
                            this.resize(h, n + i)
                        }
                    }
                    o = false;
                    break
            }
            if (!o) {
                if (f.preventDefault) {
                    f.preventDefault()
                }
                if (f.stopPropagation) {
                    f.stopPropagation()
                }
            }
            return o
        }, _addCollapseHandlers: function () {
            var e = this;
            this.addHandler(this._collapseButton, this._getEvent("click"), function () {
                if (!e.collapsed) {
                    e.collapse()
                } else {
                    e.expand()
                }
            })
        }, _closeWindow: function () {
            this.closeWindow();
            return false
        }, _addHeaderCursorHandlers: function (e) {
            if (e.resizeArea && e.resizable && !e.collapsed) {
                e._header[0].style.cursor = e._resizeWrapper.style.cursor;
                return
            } else {
                if (e.draggable) {
                    e._header[0].style.cursor = "move";
                    return
                }
            }
            e._header[0].style.cursor = "default";
            if (e._resizeWrapper) {
                e._resizeWrapper.style.cursor = "default"
            }
        }, _addDragDropHandlers: function () {
            if (this.draggable) {
                var e = this;
                this.addHandler(this.host, "focus", function () {
                    e._headerFocused = true
                });
                this.addHandler(this.host, "blur", function () {
                    e._headerFocused = false
                });
                this.addHandler(this._header, "focus", function () {
                    e._headerFocused = true;
                    return false
                });
                this.addHandler(this._header, this._getEvent("mousedown"), function (j, i, k) {
                    if (i) {
                        j.pageX = i
                    }
                    if (k) {
                        j.pageY = k
                    }
                    e._headerMouseDownHandler(e, j);
                    return true
                });
                this.addHandler(this._header, "dragstart", function (i) {
                    if (i.preventDefault) {
                        i.preventDefault()
                    }
                    return false
                });
                this.addHandler(this._header, this._getEvent("mousemove"), function (i) {
                    return e._headerMouseMoveHandler(e, i)
                });
                this.addHandler(a(document), this._getEvent("mousemove") + "." + this.host.attr("id"), function (i) {
                    return e._dragHandler(e, i)
                });
                this.addHandler(a(document), this._getEvent("mouseup") + "." + this.host.attr("id"), function (i) {
                    return e._dropHandler(e, i)
                });
                try {
                    if (document.referrer !== "" || window.frameElement) {
                        var h = null;
                        if (window.top != null && window.top != window.self) {
                            if (window.parent && document.referrer) {
                                h = document.referrer
                            }
                        }
                        if (h && h.indexOf(document.location.host) != -1) {
                            var g = function (i) {
                                e._dropHandler(e, i)
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
                } catch (f) {
                }
            }
        }, _headerMouseDownHandler: function (f, g) {
            if (!f.isModal) {
                f.bringToFront()
            }
            if (f._resizeDirection == null) {
                var e = a.jqx.position(g);
                f._mousePosition.x = e.left;
                f._mousePosition.y = e.top;
                f._mouseDown = true;
                f._isDragging = false
            }
        }, _headerMouseMoveHandler: function (f, i) {
            if (f._mouseDown && !f._isDragging) {
                var j = a.jqx.mobile.getTouches(i);
                var k = j[0];
                var h = k.pageX, g = k.pageY;
                var e = a.jqx.position(i);
                h = e.left;
                g = e.top;
                if ((h + 3 < f._mousePosition.x || h - 3 > f._mousePosition.x) || (g + 3 < f._mousePosition.y || g - 3 > f._mousePosition.y)) {
                    f._isDragging = true;
                    f._mousePosition = {x: h, y: g};
                    f._windowPosition = {x: f.host.coord().left, y: f.host.coord().top};
                    a(document.body).addClass(f.toThemeProperty("jqx-disableselect"))
                }
                if (f._isTouchDevice) {
                    i.preventDefault();
                    return true
                }
                return false
            }
            if (f._isDragging) {
                if (f._isTouchDevice) {
                    i.preventDefault();
                    return true
                }
                return false
            }
            return true
        }, _dropHandler: function (g, j) {
            var f = true;
            if (g._isDragging && !g.isResizing && !g._resizeDirection) {
                var e = parseInt(g.host.css("left"), 10), k = parseInt(g.host.css("top"), 10),
                    i = (g._isTouchDevice) ? 0 : j.pageX, h = (g._isTouchDevice) ? 0 : j.pageY;
                g.enableResize = g._enableResizeBackup;
                g._enableResizeBackup = "undefined";
                g._raiseEvent(3, e, k, i, h);
                f = false;
                if (j.preventDefault != "undefined") {
                    j.preventDefault()
                }
                if (j.originalEvent != null) {
                    j.originalEvent.mouseHandled = true
                }
                if (j.stopPropagation != "undefined") {
                    j.stopPropagation()
                }
            }
            g._isDragging = false;
            g._mouseDown = false;
            a(document.body).removeClass(g.toThemeProperty("jqx-disableselect"));
            return f
        }, _dragHandler: function (m, h) {
            if (m._isDragging && !m.isResizing && !m._resizeDirection) {
                var l = (m._isTouchDevice) ? h.originalEvent.which : h.which;
                if (typeof m._enableResizeBackup === "undefined") {
                    m._enableResizeBackup = m.enableResize
                }
                m.enableResize = false;
                if (l === 0 && a.jqx.browser.msie && a.jqx.browser.version < 8) {
                    return m._dropHandler(m, h)
                }
                var k = a.jqx.position(h);
                var j = k.left, i = k.top, g = j - m._mousePosition.x, f = i - m._mousePosition.y,
                    e = m._windowPosition.x + g, n = m._windowPosition.y + f;
                m.move(e, n, h);
                h.preventDefault();
                return false
            }
            return true
        }, _validateCoordinates: function (e, k, i, j) {
            var h = this._getDraggingArea();
            e = (e < h.left) ? h.left : e;
            k = (k < h.top) ? h.top : k;
            var f = this.host.outerWidth(true);
            var g = this.host.outerHeight(true);
            if (e + f >= h.width + h.left - 2 * j) {
                e = h.width + h.left - f - j
            }
            if (k + g >= h.height + h.top - i) {
                k = h.height + h.top - g - i
            }
            return {x: e, y: k}
        }, _performLayout: function () {
            this._performHeaderLayout();
            this._performWidgetLayout()
        }, _parseDragAreaAttributes: function () {
            if (this.dragArea !== null) {
                this.dragArea.height = parseInt(this.dragArea.height, 10);
                this.dragArea.width = parseInt(this.dragArea.width, 10);
                this.dragArea.top = parseInt(this.dragArea.top, 10);
                this.dragArea.left = parseInt(this.dragArea.left, 10)
            }
        }, _positionWindow: function () {
            this._parseDragAreaAttributes();
            if (this.position instanceof Array && this.position.length === 2 && typeof this.position[0] === "number" && typeof this.position[1] === "number") {
                this.element.style.left = this._toPx(this.position[0]);
                this.element.style.top = this._toPx(this.position[1])
            } else {
                if (this.position instanceof Object) {
                    if (this.position.left) {
                        this.host.offset(this.position)
                    } else {
                        if (this.position.x !== undefined && this.position.y !== undefined) {
                            this.element.style.left = this._toPx(this.position.x);
                            this.element.style.top = this._toPx(this.position.y)
                        } else {
                            if (this.position.center) {
                                this._centerElement(this.host, this.position.center, "xy");
                                var g = this.position.center.coord();
                                var f = parseInt(this.host.css("left"), 10);
                                var e = parseInt(this.host.css("top"), 10);
                                this.element.style.left = this._toPx(f + g.left);
                                this.element.style.top = this._toPx(e + g.top)
                            }
                        }
                    }
                } else {
                    this._positionFromLiteral()
                }
            }
        }, _getDraggingArea: function () {
            var e = {};
            e.left = ((this.dragArea && this.dragArea.left) ? this.dragArea.left : 0);
            e.top = ((this.dragArea && this.dragArea.top) ? this.dragArea.top : 0);
            e.width = ((this.dragArea && this.dragArea.width) ? this.dragArea.width : this._getDocumentSize().width);
            e.height = ((this.dragArea && this.dragArea.height) ? this.dragArea.height : this._getDocumentSize().height);
            return e
        }, _positionFromLiteral: function () {
            if (!(this.position instanceof Array)) {
                this.position = this.position.split(",")
            }
            var e = this.position.length, f = this._getDraggingArea();
            while (e) {
                e -= 1;
                this.position[e] = this.position[e].replace(/ /g, "");
                switch (this.position[e]) {
                    case"top":
                        this.element.style.top = this._toPx(f.top);
                        break;
                    case"left":
                        this.element.style.left = this._toPx(f.left);
                        break;
                    case"bottom":
                        this.element.style.top = this._toPx(f.height - this.host.height() + f.top);
                        break;
                    case"right":
                        this.element.style.left = this._toPx(f.left + f.width - this.host.width());
                        break;
                    default:
                        if (!this.dragArea) {
                            f = a(window)
                        }
                        this._centerElement(this.host, f, "xy");
                        break
                }
            }
        }, _raiseEvent: function (g) {
            var f = this._events[g], h = a.Event(f), e = {};
            if (g === 2 || g === 3) {
                e.x = arguments[1];
                e.y = arguments[2];
                e.pageX = arguments[3];
                e.pageY = arguments[4]
            }
            if (f === "closed" || f === "close") {
                e.dialogResult = this.dialogResult
            }
            h.args = e;
            return this.host.trigger(h)
        }, destroy: function () {
            this.removeHandler(a(window), "resize.window" + this.element.id);
            this._removeEventHandlers();
            this._destroy()
        }, _destroy: function () {
            if (this.isModal) {
                if (this._modalBackground !== null) {
                    a(this._modalBackground).remove()
                }
                this.host.jqxWindow({isModal: false})
            }
            if (this.restricter) {
                this.removeHandler(a(window), "resize." + this.element.id);
                this.removeHandler(a(window), "orientationchanged." + this.element.id);
                this.removeHandler(a(window), "orientationchange." + this.element.id)
            }
            this.host.remove();
            if (this._modalBackground !== null) {
                a(this._modalBackground).remove()
            }
        }, _toClose: function (f, e) {
            return ((f && e[0] === this.element) || (e[0] !== this.element && typeof e[0] === "object"))
        }, propertyChangedHandler: function (e, g, m, k) {
            this._validateProperties();
            switch (g) {
                case"rtl":
                    this._performLayout();
                    break;
                case"dragArea":
                    this._positionWindow();
                    break;
                case"collapseButtonSize":
                    this._performLayout();
                    break;
                case"closeButtonSize":
                    this._performLayout();
                    break;
                case"isModal":
                    this._refresh();
                    this._fixWindowZIndex();
                    if (k === false) {
                        var h = a.data(document.body, "jqxwindows-modallist");
                        var l = [];
                        for (var f = 0; f < h.length; f++) {
                            var j = h[f][0];
                            if (j !== this.element) {
                                l.push(h[f])
                            }
                        }
                    }
                    a.data(document.body, "jqxwindows-modallist", l);
                    break;
                case"keyboardCloseKey":
                    this._removeEventHandlers();
                    this._addEventHandlers();
                    break;
                case"disabled":
                    if (k) {
                        this.disable()
                    } else {
                        this.disabled = true;
                        this.enable()
                    }
                    break;
                case"showCloseButton":
                case"showCollapseButton":
                    this._performLayout();
                    break;
                case"height":
                    this._performLayout();
                    break;
                case"width":
                    this._performLayout();
                    break;
                case"title":
                    this.setTitle(k);
                    this.title = k;
                    break;
                case"content":
                    this.setContent(k);
                    break;
                case"draggable":
                    this._removeEventHandlers();
                    this._addEventHandlers();
                    this._removeResize();
                    this._initializeResize();
                    break;
                case"resizable":
                    this.enableResize = k;
                    if (k) {
                        this._initializeResize()
                    } else {
                        this._removeResize()
                    }
                    break;
                case"position":
                    this._positionWindow();
                    break;
                case"modalOpacity":
                    this._setModalBackgroundStyles();
                    break;
                case"okButton":
                    if (k) {
                        this._addDialogButtonsHandlers()
                    } else {
                        this.removeHandler(this.okButton)
                    }
                    break;
                case"cancelButton":
                    if (k) {
                        this._addDialogButtonsHandlers()
                    } else {
                        this.removeHandler(this.cancelButton)
                    }
                    break;
                case"collapsed":
                    if (k) {
                        if (!m) {
                            this.collapsed = false;
                            this.collapse(0)
                        }
                    } else {
                        if (m) {
                            this.collapsed = true;
                            this.expand(0)
                        }
                    }
                    break;
                case"theme":
                    a.jqx.utilities.setTheme(m, k, this.host);
                    break;
                case"enableResize":
                    return;
                case"maxWidth":
                case"maxHeight":
                case"minWidth":
                case"minHeight":
                    e._performLayout();
                    e._removeResize();
                    e._initializeResize();
                    return;
                default:
                    return
            }
        }, collapse: function (g) {
            if (!this.collapsed && this._animationInProgress !== true) {
                if (this.host.css("display") == "none") {
                    return
                }
                var e = this, h = this._header.outerHeight(true),
                    i = parseInt(this._header.css("border-bottom-width"), 10),
                    f = parseInt(this._header.css("margin-bottom"), 10);
                g = !isNaN(parseInt(g, 10)) ? g : this.collapseAnimationDuration;
                if (!isNaN(i)) {
                    h -= 2 * i
                }
                if (!isNaN(f)) {
                    h += f
                }
                this._heightBeforeCollapse = this.host.height();
                this._minHeightBeforeCollapse = this.host.css("min-height");
                this.element.style.minHeight = this._toPx(h);
                e._animationInProgress = true;
                this.host.animate({height: h}, {
                    duration: g, complete: function () {
                        e._animationInProgress = false;
                        e.collapsed = true;
                        e._collapseButton.addClass(e.toThemeProperty("jqx-window-collapse-button-collapsed"));
                        e._collapseButton.addClass(e.toThemeProperty("jqx-icon-arrow-down"));
                        e._content[0].style.display = "none";
                        e._raiseEvent(5);
                        e._raiseEvent(9);
                        a.jqx.aria(e, "aria-expanded", false)
                    }
                })
            }
        }, expand: function (f) {
            if (this.collapsed && this._animationInProgress !== true) {
                var e = this;
                f = !isNaN(parseInt(f, 10)) ? f : this.collapseAnimationDuration;
                e._animationInProgress = true;
                this.host.animate({height: this._heightBeforeCollapse}, {
                    duration: f, complete: function () {
                        e._animationInProgress = false;
                        e.collapsed = false;
                        e.element.style.minHeight = e._toPx(e._minHeightBeforeCollapse);
                        e._collapseButton.removeClass(e.toThemeProperty("jqx-window-collapse-button-collapsed"));
                        e._collapseButton.removeClass(e.toThemeProperty("jqx-icon-arrow-down"));
                        e._content[0].style.display = "block";
                        e._raiseEvent(6);
                        e._performWidgetLayout();
                        e._raiseEvent(9);
                        a.jqx.aria(e, "aria-expanded", true)
                    }
                })
            }
        }, closeAll: function (h) {
            h = true;
            var g = a.data(document.body, "jqxwindows-list"), f = g.length,
                e = a.data(document.body, "jqxwindow-modal") || [];
            while (f) {
                f -= 1;
                if (this._toClose(h, g[f])) {
                    g[f].jqxWindow("closeWindow", "close");
                    g.splice(f, 1)
                }
            }
            if (this._toClose(h, e)) {
                e.jqxWindow("closeWindow", "close");
                a.data(document.body, "jqxwindow-modal", [])
            }
            a.data(document.body, "jqxwindows-list", g)
        }, setTitle: function (f) {
            if (typeof f === "string") {
                this._headerContentWrapper.html(f)
            } else {
                if (typeof f === "object") {
                    try {
                        this._headerContentWrapper[0].innerHTML = "";
                        if (f instanceof HTMLElement) {
                            this._headerContentWrapper[0].appendChild(f)
                        } else {
                            if (f.appendTo) {
                                f.appendTo(this._headerContentWrapper)
                            }
                        }
                    } catch (e) {
                        throw new Error(e)
                    }
                }
            }
            this.title = f;
            this._performLayout()
        }, setContent: function (h) {
            this._contentInitialized = false;
            var g = this._content, j = false;
            while (!j) {
                g[0].style.width = "auto";
                g[0].style.height = "auto";
                if (g.hasClass("jqx-window")) {
                    j = true
                } else {
                    g = a(g[0].parentNode)
                }
            }
            if (a.isArray(h)) {
                for (var f = 0; f < h.length; f++) {
                    h[f].appendTo(this._content)
                }
            } else {
                if (typeof h === "string") {
                    a(this._content[0]).html(h)
                } else {
                    if (typeof h === "object") {
                        try {
                            this._content[0].innerHTML = "";
                            if (h instanceof HTMLElement) {
                                this._content[0].appendChild(h)
                            } else {
                                if (h.appendTo) {
                                    h.appendTo(this._content)
                                }
                            }
                        } catch (e) {
                            throw new Error(e)
                        }
                    }
                }
            }
            this.content = h;
            this._performLayout()
        }, disable: function () {
            this.disabled = true;
            this._removeEventHandlers();
            this._header.addClass(this.toThemeProperty("jqx-window-header-disabled"));
            this._closeButton.addClass(this.toThemeProperty("jqx-window-close-button-disabled"));
            this._collapseButton.addClass(this.toThemeProperty("jqx-window-collapse-button-disabled"));
            this._content.addClass(this.toThemeProperty("jqx-window-content-disabled"));
            this.host.addClass(this.toThemeProperty("jqx-window-disabled"));
            this.host.addClass(this.toThemeProperty("jqx-fill-state-disabled"));
            this._removeResize()
        }, enable: function () {
            if (this.disabled) {
                this._addEventHandlers();
                this._header.removeClass(this.toThemeProperty("jqx-window-header-disabled"));
                this._content.removeClass(this.toThemeProperty("jqx-window-content-disabled"));
                this._closeButton.removeClass(this.toThemeProperty("jqx-window-close-button-disabled"));
                this._collapseButton.removeClass(this.toThemeProperty("jqx-window-collapse-button-disabled"));
                this.host.removeClass(this.toThemeProperty("jqx-window-disabled"));
                this.host.removeClass(this.toThemeProperty("jqx-fill-state-disabled"));
                this.disabled = false;
                this._initializeResize()
            }
        }, isOpen: function () {
            return this._visible
        }, closeWindow: function (f) {
            var e = this;
            f = (typeof f === "undefined") ? this.closeButtonAction : f;
            this.hide(function () {
                if (f === "close") {
                    e._destroy()
                }
            })
        }, bringToFront: function () {


            var f = a.data(document.body, "jqxwindows-list");
            if (this.isModal) {
                f = a.data(document.body, "jqxwindows-modallist");
                this._fixWindowZIndex("modal-hide");
                this._fixWindowZIndex("modal-show");
                return
            }
            var k = f[f.length - 1], j = parseInt(k.css("z-index"), 10), g = this._indexOf(this.host, f);
            for (var e = f.length - 1; e > g; e -= 1) {
                var h = parseInt(f[e].css("z-index"), 10) - 1;
                f[e][0].style.zIndex = h
            }
            this.element.style.zIndex = j;
            this._sortByStyle("z-index", f);

            // buhta
            if (buhta) {
                console.log("bringToFront----------------->")
                buhta.appState.desktop.clearToolbarFocusedGroups();
                setTimeout(buhta.appState.desktop.forceUpdate.bind(buhta.appState.desktop),25);
            }

        }, hide: function (i, h, e) {
            var g = this;
            if (this.closing) {
                var f = this.closing();
                if (f === false) {
                    return
                }
            }
            h = h || this.closeAnimationDuration;
            switch (this.animationType) {
                case"none":
                    this.element.style.display = "none";
                    break;
                case"fade":
                    g._animationInProgress = true;
                    this.host.fadeOut({
                        duration: h, callback: function () {
                            g._animationInProgress = false;
                            if (i instanceof Function) {
                                i()
                            }
                        }
                    });
                    break;
                case"slide":
                    g._animationInProgress = true;
                    this.host.slideUp({
                        duration: h, callback: function () {
                            g._animationInProgress = false;
                            if (i instanceof Function) {
                                i()
                            }
                        }
                    });
                    break;
                case"combined":
                    g._animationInProgress = true;
                    this.host.animate({opacity: 0, width: "0px", height: "0px"}, {
                        duration: h, complete: function () {
                            g._animationInProgress = false;
                            g.element.style.display = "none";
                            if (i instanceof Function) {
                                i()
                            }
                        }
                    });
                    break
            }
            this._visible = false;
            if (this.isModal) {
                a(this._modalBackground).hide();
                this._fixWindowZIndex("modal-hide")
            }
            if (e !== true) {
                this._raiseEvent(1);
                this._raiseEvent(8)
            }
        }, open: function (f, e) {
            this.show(f, e)
        }, close: function (g, f, e) {
            this.hide(g, f, e)
        }, show: function (k, j) {
            var i = this;
            this._setDialogResult("none");
            j = j || this.showAnimationDuration;
            switch (this.animationType) {
                case"none":
                    this.element.style.display = "block";
                    break;
                case"fade":
                    i._animationInProgress = true;
                    this.host.fadeIn({
                        duration: j, complete: function () {
                            i._animationInProgress = false;
                            if (k instanceof Function) {
                                k()
                            }
                        }
                    });
                    break;
                case"slide":
                    i._animationInProgress = true;
                    this.host.slideDown({
                        duration: j, callback: function () {
                            i._animationInProgress = false;
                            if (k instanceof Function) {
                                k()
                            }
                        }
                    });
                    break;
                case"combined":
                    this.element.style.display = "block";
                    var g = i.host.width();
                    var e = i.host.height();
                    this.element.style.minWidth = "0px";
                    this.element.style.minHeight = "0px";
                    this.element.style.opacity = 0;
                    this.element.style.width = "0px";
                    this.element.style.height = "0px";
                    i._animationInProgress = true;
                    this.host.animate({opacity: 1, width: g + "px", height: e + "px"}, {
                        duration: j, complete: function () {
                            i._animationInProgress = false;
                            i._performLayout();
                            if (k instanceof Function) {
                                k()
                            }
                        }
                    });
                    break
            }
            if (this.isModal) {
                a(this._modalBackground).show();
                this._fixWindowZIndex("modal-show")
            }
            var h = this;
            if (!this._visible) {
                if (j > 150 && this.animationType != "none") {
                    setTimeout(function () {
                        if (!h._contentInitialized) {
                            if (h.initContent) {
                                h.initContent();
                                h._contentInitialized = true
                            }
                        }
                        h._raiseEvent(7);
                        h._raiseEvent(9)
                    }, j - 150)
                } else {
                    if (!h._contentInitialized) {
                        if (h.initContent) {
                            h.initContent();
                            h._contentInitialized = true
                        }
                    }
                    this._raiseEvent(7);
                    h._raiseEvent(9)
                }
            }
            this._visible = true;
            if (i.animationType !== "combined") {
                this._performLayout()
            }
            if (this.autoFocus) {
                var f = function () {
                    if (!h._isTouchDevice) {
                        h._content[0].focus()
                    }
                };
                f();
                setTimeout(function () {
                    f()
                }, 100)
            }
        }, _getTabbables: function () {
            var f;
            if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                f = this._content.find("*")
            } else {
                f = this._content[0].querySelectorAll("*")
            }
            var e = [];
            a.each(f, function () {
                if (d(this)) {
                    e[e.length] = this
                }
            });
            return e
        }, move: function (n, m, e, h) {
            var g = 0, f = 0, k, j, i;
            n = parseInt(n, 10);
            m = parseInt(m, 10);
            if (a.jqx.browser.msie) {
                if (a(window).width() > a(document).width() && !this.dragArea) {
                    f = this._SCROLL_WIDTH
                }
                if (a(window).height() < a(document).height() && document.documentElement.clientWidth > document.documentElement.scrollWidth && !this.dragArea) {
                    g = this._SCROLL_WIDTH
                }
            }
            k = this._validateCoordinates(n, m, f, g);
            if (parseInt(this.host.css("left"), 10) !== k.x || parseInt(this.host.css("top"), 10) !== k.y) {
                if (e) {
                    var l = a.jqx.position(e);
                    j = l.left;
                    i = l.top
                }
                if (j === undefined) {
                    j = n
                }
                if (i === undefined) {
                    i = m
                }
                if (h !== false) {
                    this._raiseEvent(2, k.x, k.y, j, i)
                }
            }
            this.element.style.left = k.x + "px";
            this.element.style.top = k.y + "px";
            this._moved = true
        }, _toPx: function (e) {
            if (typeof e === "number") {
                return e + "px"
            } else {
                return e
            }
        }
    });

    function c(g, e) {
        var j = g.nodeName.toLowerCase();
        if ("area" === j) {
            var i = g.parentNode, h = i.name, f;
            if (!g.href || !h || i.nodeName.toLowerCase() !== "map") {
                return false
            }
            f = a("img[usemap=#" + h + "]")[0];
            return !!f && b(f)
        }
        return (/input|select|textarea|button|object/.test(j) ? !g.disabled : "a" == j ? g.href || e : e) && b(g)
    }

    function b(f) {
        var e = a(f);
        return e.css("display") !== "none" && e.css("visibility") !== "hidden"
    }

    function d(g) {
        var e = g.getAttribute("tabindex"), f = e === null;
        return (f || e >= 0) && c(g, !f)
    }
}(jqxBaseFramework));
(function (b) {
    var a = (function (c) {
        return {
            resizeConfig: function () {
                this.resizeTarget = null;
                this.resizeIndicatorSize = 5;
                this.resizeTargetChildren = null;
                this.isResizing = false;
                this.resizeArea = false;
                this.minWidth = 1;
                this.maxWidth = 100;
                this.minHeight = 1;
                this.maxHeight = 100;
                this.resizeParent = null;
                this.enableResize = true;
                this._resizeEvents = ["resizing", "resized", "resize"];
                this._resizeMouseDown = false;
                this._resizeCurrentMode = null;
                this._mouseResizePosition = {};
                this._resizeMethods = null;
                this._SCROLL_WIDTH = 21
            },
            _resizeExceptions: {
                invalidTarget: "Invalid target!",
                invalidMinHeight: "Invalid minimal height!",
                invalidMaxHeight: "Invalid maximum height!",
                invalidMinWidth: "Invalid minimum width!",
                invalidMaxWidth: "Invalid maximum width!",
                invalidIndicatorSize: "Invalid indicator size!",
                invalidSize: "Invalid size!"
            },
            removeResize: function () {
                if (this.resizeTarget) {
                    var f = c(this.resizeTarget.children(".jqx-resize"));
                    f.detach();
                    var e = f.children();
                    this._removeResizeEventListeners();
                    for (var d = 0; d < e.length; d += 1) {
                        c(e[d]).detach();
                        this.resizeTarget.append(e[d])
                    }
                    f.remove()
                }
                this._resizeDirection = null
            },
            initResize: function (d) {
                this.resizeConfig();
                this.resizeTarget = c(d.target);
                this.resizeIndicatorSize = d.indicatorSize || 10;
                this.maxWidth = d.maxWidth || 100;
                this.minWidth = d.minWidth || 1;
                this.maxHeight = d.maxHeight || 100;
                this.minHeight = d.minHeight || 1;
                this.resizeParent = d.resizeParent;
                this._parseResizeParentProperties();
                this._validateResizeProperties();
                this._validateResizeTargetDimensions();
                this._getChildren(this.resizeTarget.maxWidth, this.resizeTarget.minWidth, this.resizeTarget.maxHeight, this.resizeTarget.minHeight, d.alsoResize);
                this._refreshResize();
                this._cursorBackup = this.resizeTarget.css("cursor");
                if (this._cursorBackup === "auto") {
                    this._cursorBackup = "default"
                }
            },
            _validateResizeTargetDimensions: function () {
                this.resizeTarget.maxWidth = this.maxWidth;
                this.resizeTarget.minWidth = ((3 * this.resizeIndicatorSize > this.minWidth) ? 3 * this.resizeIndicatorSize : this.minWidth);
                this.resizeTarget.maxHeight = this.maxHeight;
                this.resizeTarget.minHeight = ((3 * this.resizeIndicatorSize > this.minHeight) ? 3 * this.resizeIndicatorSize : this.minHeight)
            },
            _parseResizeParentProperties: function () {
                if (this.resizeParent) {
                    this.resizeParent.left = parseInt(this.resizeParent.left, 10);
                    this.resizeParent.top = parseInt(this.resizeParent.top, 10);
                    this.resizeParent.width = parseInt(this.resizeParent.width, 10);
                    this.resizeParent.height = parseInt(this.resizeParent.height, 10)
                }
            },
            _getChildren: function (h, e, g, i, d) {
                this.resizeTargetChildren = c(d);
                this.resizeTargetChildren = this.resizeTargetChildren.toArray();
                var f = this.resizeTargetChildren.length;
                while (f) {
                    f -= 1;
                    this.resizeTargetChildren[f] = c(this.resizeTargetChildren[f])
                }
            },
            _refreshResize: function () {
                this._renderResize();
                this._performResizeLayout();
                this._removeResizeEventListeners();
                this._addResizeEventHandlers()
            },
            _renderResize: function () {
                var d = this;
                if (d._resizeWrapper !== undefined && c(d._resizeWrapper).parents().length > 0) {
                    return
                }
                var e = document.createElement("div");
                e.className = "jqx-resize jqx-rc-all";
                e.style.zIndex = 8000;
                e.appendChild(d._header[0]);
                e.appendChild(d._content[0]);
                d.resizeTarget[0].appendChild(e);
                d._resizeWrapper = e
            },
            _performResizeLayout: function () {
                this._resizeWrapper.style.height = this.resizeTarget.height() + "px";
                this._resizeWrapper.style.width = this.resizeTarget.width() + "px"
            },
            _removeResizeEventListeners: function () {
                var d = this.resizeTarget.attr("id");
                this.removeHandler(this._resizeWrapper, "mousemove.resize" + d);
                this.removeHandler(this._resizeWrapper, "mousedown.resize" + d);
                this.removeHandler(c(document), "mousemove.resize" + d);
                this.removeHandler(c(document), "mouseup.resize" + d)
            },
            _addResizeEventHandlers: function () {
                var g = this.resizeTarget.attr("id");
                var d = this;
                if (d._isTouchDevice) {
                    this.addHandler(this._resizeWrapper, "touchmove.resize." + g, function (h) {
                        d._resizeCursorChangeHandler(d, h)
                    });
                    this.addHandler(this._resizeWrapper, "touchstart.resize." + g, function (h) {
                        d._resizeCursorChangeHandler(d, h);
                        d._resizeMouseDownHandler(d, h)
                    });
                    this.addHandler(c(document), "touchmove.resize." + g, function (h) {
                        return d._resizeHandler(d, h)
                    });
                    this.addHandler(c(document), "touchend.resize." + g, function (h) {
                        d._stopResizing(d, h)
                    })
                } else {
                    this.addHandler(this._resizeWrapper, "mousemove.resize." + g, function (h) {
                        d._resizeCursorChangeHandler(d, h)
                    });
                    this.addHandler(this._resizeWrapper, "mousedown.resize." + g, function (h) {
                        d._resizeMouseDownHandler(d, h)
                    });
                    this.addHandler(c(document), "mousemove.resize." + g, function (h) {
                        return d._resizeHandler(d, h)
                    });
                    this.addHandler(c(document), "mouseup.resize." + g, function (h) {
                        d._stopResizing(d, h)
                    })
                }
                try {
                    if (document.referrer !== "" || window.frameElement) {
                        var f = function (h) {
                            d._stopResizing(d, h)
                        };
                        if (window.top.document.addEventListener) {
                            window.top.document.addEventListener("mouseup", f, false)
                        } else {
                            if (window.top.document.attachEvent) {
                                window.top.document.attachEvent("onmouseup", f)
                            }
                        }
                    }
                } catch (e) {
                }
            },
            _stopResizing: function (d) {
                if (d.enableResize) {
                    if (d.isResizing) {
                        d._raiseResizeEvent(1)
                    }
                    d._resizeMouseDown = false;
                    d.isResizing = false;
                    d._resizeDirection = null;
                    if (d.resizeTarget) {
                        d.resizeTarget.removeClass("jqx-disableselect")
                    }
                }
                if (d._cursorBackup == "undefined") {
                    d._cursorBackup = "default"
                }
                if (d._resizeWrapper) {
                    d._resizeWrapper.style.cursor = d._cursorBackup
                }
            },
            _resizeHandler: function (e, f) {
                if (e.enableResize && !e.collapsed) {
                    if (e.isResizing && e._resizeDirection) {
                        if (f.which === 0 && c.jqx.browser.msie && c.jqx.browser.version < 9) {
                            e._stopResizing(f)
                        }
                        if (e._isTouchDevice) {
                            var d = c.jqx.position(f);
                            e._performResize(d.left, d.top);
                            return false
                        }
                        e._performResize(f.pageX, f.pageY);
                        return false
                    } else {
                        if (e._isTouchDevice) {
                            var d = c.jqx.position(f);
                            return e._resizeCaptureCursor(d.left, d.top)
                        }
                        return e._resizeCaptureCursor(f.pageX, f.pageY)
                    }
                }
            },
            _resizeCaptureCursor: function (e, d) {
                if (this._resizeMouseDown && !this.isResizing && this._resizeDirection) {
                    var f = 3;
                    if (this._isTouchDevice) {
                        this._changeCursor(e - parseInt(this.resizeTarget.css("left"), 10), d - parseInt(this.resizeTarget.css("top"), 10));
                        this._mouseResizePosition = {x: e, y: d};
                        this._prepareResizeMethods(this._resizeDirection);
                        this._resizeBackupData();
                        this.isResizing = true;
                        this.resizeTarget.addClass("jqx-disableselect");
                        return false
                    }
                    if ((e + f < this._mouseResizePosition.x || e - f > this._mouseResizePosition.x) || (d + f < this._mouseResizePosition.y || d - f > this._mouseResizePosition.y)) {
                        this._changeCursor(e - parseInt(this.resizeTarget.css("left"), 10), d - parseInt(this.resizeTarget.css("top"), 10));
                        this._mouseResizePosition = {x: e, y: d};
                        this._prepareResizeMethods(this._resizeDirection);
                        this._resizeBackupData();
                        this.isResizing = true;
                        this.resizeTarget.addClass("jqx-disableselect");
                        return false
                    }
                }
            },
            _resizeBackupData: function () {
                this.resizeTarget.lastWidth = this.resizeTarget.width();
                this.resizeTarget.lastHeight = this.resizeTarget.height();
                this.resizeTarget.x = parseInt(this.resizeTarget.css("left"), 10);
                this.resizeTarget.y = parseInt(this.resizeTarget.css("top"), 10);
                this._resizeBackupChildrenSize()
            },
            _resizeBackupChildrenSize: function () {
                var d = this.resizeTargetChildren.length, e;
                while (d) {
                    d -= 1;
                    e = this.resizeTargetChildren[d];
                    this.resizeTargetChildren[d].lastWidth = e.width();
                    this.resizeTargetChildren[d].lastHeight = e.height()
                }
            },
            _performResize: function (g, f) {
                var e = g - this._mouseResizePosition.x, d = f - this._mouseResizePosition.y;
                if (this._resizeDirection) {
                    this._resize(this.resizeTarget, e, d)
                }
            },
            _resizeCursorChangeHandler: function (e, f) {
                if (e.enableResize && !e.collapsed) {
                    if (!e.isResizing) {
                        if (e._isTouchDevice) {
                            var d = c.jqx.position(f);
                            e._changeCursor(d.left - parseInt(e.resizeTarget.css("left"), 10), d.top - parseInt(e.resizeTarget.css("top"), 10));
                            return
                        }
                        e._changeCursor(f.pageX - parseInt(e.resizeTarget.css("left"), 10), f.pageY - parseInt(e.resizeTarget.css("top"), 10))
                    }
                }
            },
            _resizeMouseDownHandler: function (e, f) {
                if (e.enableResize) {
                    if (e._resizeDirection !== null) {
                        e._resizeMouseDown = true;
                        if (e._isTouchDevice) {
                            var d = c.jqx.position(f);
                            e._mouseResizePosition.x = d.left;
                            e._mouseResizePosition.y = d.top
                        } else {
                            e._mouseResizePosition.x = f.pageX;
                            e._mouseResizePosition.y = f.pageY
                        }
                        f.preventDefault()
                    }
                }
            },
            _validateResizeProperties: function () {
                try {
                    if (!this.resizeTarget || this.resizeTarget.length !== 1) {
                        throw new Error(this._resizeExceptions.invalidTarget)
                    }
                    if (this.minHeight < 0 || isNaN(parseInt(this.minHeight, 10))) {
                        throw new Error(this._resizeExceptions.invalidMinHeight)
                    }
                    if (this.maxHeight <= 0 || isNaN(parseInt(this.maxHeight, 10))) {
                        throw new Error(this._resizeExceptions.invalidMaxHeight)
                    }
                    if (this.minWidth < 0 || isNaN(parseInt(this.minWidth, 10))) {
                        throw new Error(this._resizeExceptions.invalidMinWidth)
                    }
                    if (this.maxWidth < 0 || isNaN(parseInt(this.maxWidth, 10))) {
                        throw new Error(this._resizeExceptions.invalidMaxWidth)
                    }
                    if (this.resizeIndicatorSize < 0 || isNaN(parseInt(this.resizeIndicatorSize, 10))) {
                        throw new Error(this._resizeExceptions.invalidIndicatorSize)
                    }
                    if (this.minHeight > this.maxHeight || this.minWidth > this.maxWidth) {
                        throw new Error(this._resizeExceptions.invalidSize)
                    }
                } catch (d) {
                    throw new Error(d)
                }
            },
            _changeCursor: function (d, e) {
                if (this.isResizing || this._resizeMouseDown) {
                    return
                }
                this.resizeArea = true;
                if (d <= this.resizeIndicatorSize && d >= 0 && e <= this.resizeIndicatorSize && e > 0) {
                    this._resizeWrapper.style.cursor = "nw-resize";
                    this._resizeDirection = "topleft"
                } else {
                    if (e <= this.resizeIndicatorSize && e > 0 && d >= this.resizeTarget.width() - this.resizeIndicatorSize) {
                        this._resizeWrapper.style.cursor = "ne-resize";
                        this._resizeDirection = "topright"
                    } else {
                        if (e >= this.resizeTarget.height() - this.resizeIndicatorSize && e < this.resizeTarget.height() && d <= this.resizeIndicatorSize && d >= 0) {
                            this._resizeWrapper.style.cursor = "sw-resize";
                            this._resizeDirection = "bottomleft"
                        } else {
                            if (e >= this.resizeTarget.height() - this.resizeIndicatorSize && e < this.resizeTarget.height() && d >= this.resizeTarget.width() - this.resizeIndicatorSize && d < this.resizeTarget.width()) {
                                this._resizeWrapper.style.cursor = "se-resize";
                                this._resizeDirection = "bottomright"
                            } else {
                                if (d <= this.resizeIndicatorSize && d >= 0) {
                                    this._resizeWrapper.style.cursor = "e-resize";
                                    this._resizeDirection = "left"
                                } else {
                                    if (e <= this.resizeIndicatorSize && e > 0) {
                                        this._resizeWrapper.style.cursor = "n-resize";
                                        this._resizeDirection = "top"
                                    } else {
                                        if (e >= this.resizeTarget.height() - this.resizeIndicatorSize && e < this.resizeTarget.height()) {
                                            this._resizeWrapper.style.cursor = "n-resize";
                                            this._resizeDirection = "bottom"
                                        } else {
                                            if (d >= this.resizeTarget.width() - this.resizeIndicatorSize && d < this.resizeTarget.width()) {
                                                this._resizeWrapper.style.cursor = "e-resize";
                                                this._resizeDirection = "right"
                                            } else {
                                                this._resizeWrapper.style.cursor = this._cursorBackup;
                                                this._resizeDirection = null;
                                                this.resizeArea = false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            _prepareResizeMethods: function (d) {
                this._resizeMethods = [];
                if (d.indexOf("left") >= 0) {
                    this._resizeMethods.push(this._resizeLeft)
                }
                if (d.indexOf("top") >= 0) {
                    this._resizeMethods.push(this._resizeTop)
                }
                if (d.indexOf("right") >= 0) {
                    this._resizeMethods.push(this._resizeRight)
                }
                if (d.indexOf("bottom") >= 0) {
                    this._resizeMethods.push(this._resizeBottom)
                }
            },
            _validateResize: function (g, d, h, f, e) {
                if (h === "horizontal" || h === "both") {
                    return this._validateWidth(g, f, e)
                } else {
                    if (h === "vertical" || h === "both") {
                        return this._validateHeight(d, f, e)
                    }
                }
                return {result: false, fix: 0}
            },
            _getParent: function () {
                if (this.resizeParent !== null && this.resizeParent !== "undefined" && this.resizeParent.height && this.resizeParent.width && this.resizeParent.top && this.resizeParent.left) {
                    return this.resizeParent
                }
                return {left: 0, top: 0, width: c(document).width(), height: c(document).height()}
            },
            _validateHeight: function (e, h, g) {
                var i = 0, d = 2, f = this._getParent();
                if (c(window).width() > c(document).width() && c.jqx.browser.msie && f.height === c(document).height()) {
                    i = this._SCROLL_WIDTH
                }
                if (g === "bottom" && (e + h.position().top + i + d > f.height + f.top)) {
                    return {fix: f.height - h.position().top - i - d + f.top, result: false}
                }
                if (g === "top" && h.lastHeight - e + h.y < f.top) {
                    return {fix: e + (h.lastHeight - e + h.y) - f.top, result: false}
                }
                if (e < h.minHeight) {
                    return {fix: h.minHeight, result: false}
                }
                if (e > h.maxHeight) {
                    return {fix: h.maxHeight, result: false}
                }
                return {result: true, fix: e}
            },
            _validateWidth: function (h, g, f) {
                var i = 0, d = 2, e = this._getParent();
                if (c(window).height() < c(document).height() && c.jqx.browser.msie && document.documentElement.clientWidth >= document.documentElement.scrollWidth && e.width === c(document).width()) {
                    i = this._SCROLL_WIDTH
                }
                if (f === "right" && (h + g.position().left + i + d > e.width + e.left)) {
                    return {fix: e.width - g.position().left - i - d + e.left, result: false}
                }
                if (f === "left" && (g.lastWidth - h + g.x < e.left)) {
                    return {fix: h + (g.lastWidth - h + g.x) - e.left, result: false}
                }
                if (h < g.minWidth) {
                    return {fix: g.minWidth, result: false}
                }
                if (h > g.maxWidth) {
                    return {fix: g.maxWidth, result: false}
                }
                return {result: true, fix: h}
            },
            _resize: function (h, e, d) {
                var j = this._resizeMethods.length;
                for (var g = 0; g < j; g++) {
                    if (this._resizeMethods[g] instanceof Function) {
                        var f = {element: h, x: e, y: d, self: this};
                        this._resizeMethods[g](f)
                    }
                }
                this._performResizeLayout()
            },
            resize: function (g, d) {
                if (this.resizable) {
                    var f = g - this.host.width();
                    var e = d - this.host.height();
                    var h = "right";
                    if (e !== 0) {
                        h = "bottom"
                    }
                    this._resizeDirection = h;
                    this._prepareResizeMethods(this._resizeDirection);
                    this._resizeBackupData();
                    this.isResizing = true;
                    this._resize(this.resizeTarget, f, e);
                    this.isResizing = false
                }
            },
            _setResizeChildrenSize: function (e, f) {
                var h = this.resizeTargetChildren.length;
                while (h) {
                    h--;
                    if (f === "width") {
                        var g = this.resizeTargetChildren[h].lastWidth - (this.resizeTarget.lastWidth - e);
                        if (g < this.resizeTarget.maxWidth && g > 0) {
                            this.resizeTargetChildren[h].width(g)
                        }
                    } else {
                        var d = this.resizeTargetChildren[h].lastHeight - (this.resizeTarget.lastHeight - e);
                        if (d < this.resizeTarget.maxHeight && d > 0) {
                            this.resizeTargetChildren[h].height(d)
                        }
                    }
                }
            },
            _resizeRight: function (g) {
                var h = g.element.lastWidth + g.x, d = g.self._validateResize(h, 0, "horizontal", g.element, "right");
                if (!d.result) {
                    h = d.fix
                }
                if (g.element.width() !== h) {
                    g.self._setResizeChildrenSize(h, "width");
                    g.element.width(h);
                    if (g.self.width.toString().indexOf("%") >= 0) {
                        var f = c(document.body).width() / 100;
                        var e = 1 / f;
                        g.element[0].style.width = (e * h) + "%";
                        g.self._setChildrenLayout()
                    }
                    g.self._raiseResizeEvent(0)
                }
                return h
            },
            _resizeLeft: function (h) {
                var i = h.element.lastWidth - h.x, e = h.self._validateResize(i, 0, "horizontal", h.element, "left"),
                    d = h.element.x + h.x;
                if (!e.result) {
                    d = h.element.x + (h.element.lastWidth - e.fix);
                    i = e.fix;
                    return
                }
                if (h.element.width() !== i) {
                    h.self._setResizeChildrenSize(i, "width");
                    h.element.width(i);
                    if (h.self.width.toString().indexOf("%") >= 0) {
                        var g = c(document.body).width() / 100;
                        var f = 1 / g;
                        h.element[0].style.width = (f * i) + "%";
                        h.self._setChildrenLayout()
                    }
                    h.element[0].style.left = h.self._toPx(d);
                    h.self._raiseResizeEvent(0)
                }
                return i
            },
            _resizeBottom: function (h) {
                var e = h.element.lastHeight + h.y, d = h.self._validateResize(0, e, "vertical", h.element, "bottom");
                if (!d.result) {
                    e = d.fix
                }
                if (h.element.height() !== e) {
                    h.self._setResizeChildrenSize(e, "height");
                    h.element.height(e);
                    if (h.self.height.toString().indexOf("%") >= 0) {
                        var g = c(document.body).height() / 100;
                        var f = 1 / g;
                        h.element[0].style.height = (f * e) + "%";
                        h.self._setChildrenLayout()
                    }
                    h.self._raiseResizeEvent(0)
                }
                return e
            },
            _resizeTop: function (h) {
                var e = h.element.lastHeight - h.y, d = h.self._validateResize(0, e, "vertical", h.element, "top"),
                    i = h.element.y + h.y;
                if (!d.result) {
                    i = h.element.y + (h.element.lastHeight - d.fix);
                    e = d.fix;
                    return
                }
                if (h.element.height() !== e) {
                    h.self._setResizeChildrenSize(e, "height");
                    h.element.height(e);
                    if (h.self.height.toString().indexOf("%") >= 0) {
                        var g = c(document.body).height() / 100;
                        var f = 1 / g;
                        h.element[0].style.height = (f * e) + "%";
                        h.self._setChildrenLayout()
                    }
                    h.element[0].style.top = h.self._toPx(i);
                    h.self._raiseResizeEvent(0)
                }
                return e
            },
            _raiseResizeEvent: function (f) {
                var e = this._resizeEvents[f], g = c.Event(e), d = {};
                d.width = parseInt(this.resizeTarget[0].style.width, 10);
                d.height = parseInt(this.resizeTarget[0].style.height, 10);
                g.args = d;
                if (f === 0) {
                    e = this._resizeEvents[2];
                    var h = c.Event(e);
                    h.args = d;
                    this.resizeTarget.trigger(h)
                }
                return this.resizeTarget.trigger(g)
            }
        }
    }(jqxBaseFramework));
    b.extend(b.jqx._jqxWindow.prototype, a)
}(jqxBaseFramework));

