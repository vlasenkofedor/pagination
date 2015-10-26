/**
 * Pagination
 *
 * Copyright (c) 2015 Vlasenko Fedor (VlasenkoFedor@mail.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.0.2
 */

(function (root, factory) {
    if (typeof exports === "object" && typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root["Pagination"] = factory();
    }
}(this, function () {

    /**
     * Page navigation panel
     * @param {object} params
     * @constructor
     */
    function Pagination(params) {
        var self = this instanceof Pagination
            ? this
            : Object.create(Pagination.prototype);
        self.init.apply(self, arguments);
        return self;
    }

    Pagination.prototype = {
        params: {
            tag: '', // element tag
            row: 5, // quantity in row
            total: 25, // total elements
            step: 5, // browsing step
            current: 1, // current position
            prev_text: '<', // prev text
            next_text: '>', // next text
            last_text: '>>', // last text
            first_text: '<<', // first text
            prev_next: true, // show prev and next
            first_last: true, // show first and last
            sizing: '' //Sizing (pagination-lg, pagination-sm) or add class
        },
        init: function (params) {
            var self = this;
            var def_params = this.params;
            if (params && params.hasOwnProperty('tag') && typeof params.tag === 'string') {
                this._element = document.querySelector(params.tag);
                if (!this._element) {
                    throw Error("Pagination: element with this tag isn't found");
                }
            } else {
                throw Error("Pagination: tag is not string");
            }

            this.params = Object.keys(def_params).reduce(function (previous, key) {
                if (!previous.hasOwnProperty(key)) {
                    previous[key] = def_params[key];
                }
                return previous;
            }, params);
            this._element.addEventListener("click", function (event) {
                var el = event ? event.target : window.event.srcElement;
                var parent = el.parentNode;
                event.preventDefault();
                if (parent.tagName != "LI" || parent.className.indexOf('disabled') !== -1) return;
                if (parent.className && parent.className != "active") {
                    self[parent.className].call(self);
                } else if (self.value != +el.innerHTML) {
                    self.value = +el.innerHTML;
                    self._callback && self._callback(self.value);
                }
            }, false);
            this.value = this.params.current;
        },
        build: function () {
            var start = this._start || 0;
            var col = this.params.row + start;
            var html = '<ul class="pagination' + (this.params.sizing ? ' ' + this.params.sizing : '') + '">';
            var style = '';
            var begin = this._start == 0;
            var end = this._start != this.params.total - this.params.row;

            function render(value, style) {
                return '<li' + (style ? ' class="' + style + '"' : '') + '><a href="#">' + value + '</a></li>';
            }

            if (this.params.first_last) {
                style = begin ? 'first disabled' : 'first';
                html += render(this.params.first_text, style);
            }
            if (this.params.prev_next) {
                style = begin ? 'prev disabled' : 'prev';
                html += render(this.params.prev_text, style);
            }
            while (++start <= col) {
                if (start > this.params.total) break;
                style = start == this.value ? 'active' : '';
                html += render(start, style);
            }
            if (this.params.prev_next) {
                style = end ? 'next' : 'next disabled';
                html += render(this.params.next_text, style);
            }
            if (this.params.first_last) {
                style = end ? 'last' : 'last disabled';
                html += render(this.params.last_text, style);
            }
            html += '</ul>';
            this._element.innerHTML = html;
        },
        /**
         * Show current page
         * @param {function(page)} callback
         */
        onclick: function (callback) {
            if (typeof callback != "function") {
                throw Error("Pagination: callback onclick isn't function");
            }
            this._callback = callback;
        },
        first: function () {
            if (this._start != 0) {
                this._start = 0;
                this.build();
            }
        },
        last: function () {
            var end = this.params.total - this.params.row;
            if (this._start != end) {
                this._start = end;
                this.build();
            }
        },
        next: function () {
            var start = this._start;
            var diff = this.params.total - this.params.row;
            this._start += this.params.step;
            if (this._start >= diff) {
                this._start = diff;
            }
            if (start != this._start) this.build();
        },
        prev: function () {
            var start = this._start;
            if (this._start < this.params.step) {
                this._start = 0;
            } else {
                this._start -= this.params.step;
                var diff = this.params.total - this.params.row;
                if (this._start >= diff) {
                    this._start = diff - this.params.step;
                }
            }
            if (start != this._start) this.build();
        },
        get value() {
            return this.params.current;
        },
        set value(value) {
            this.params.current = value;
            if (!(value > this._start && value <= this._start + this.params.row)) {
                this._start = Math.floor((value - 1) / this.params.row) * this.params.row;
            }
            this.build();
        }
    };
    return Pagination;
}));