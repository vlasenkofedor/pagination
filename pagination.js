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
    if (typeof exports === "object") {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.Pagination = factory();
    }
}(window, function () {

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
                this.__element = document.querySelector(params.tag);
                if (!this.__element) {
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
            this.__element.addEventListener("click", function (event) {
                var el = event ? event.target : window.event.srcElement;
                var parent = el.parentNode;
                event.preventDefault();
                if (parent.tagName != "LI" || parent.className.indexOf('disabled') !== -1) return;
                if (parent.className && parent.className != "active") {
                    self[parent.className].call(self);
                } else if (self.value != +el.innerHTML) {
                    self.value = +el.innerHTML;
                    self.__callback && self.__callback(self.value);
                }
            }, false);
            this.value = this.params.current;
        },
        build: function () {
            var start = this.__start || 0;
            var col = this.params.row + start;
            var html = '<ul class="pagination' + (this.params.sizing ? ' ' + this.params.sizing : '') + '">';
            var style = '';
            var begin = this.__start == 0;
            var end = this.__start != this.params.total - this.params.row;

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
            this.__element.innerHTML = html;
        },
        /**
         * Show current page
         * @param {function(page)} callback
         */
        onclick: function (callback) {
            if (typeof callback != "function") {
                throw Error("Pagination: callback onclick isn't function");
            }
            this.__callback = callback;
        },
        first: function () {
            if (this.__start != 0) {
                this.__start = 0;
                this.build();
            }
        },
        last: function () {
            var end = this.params.total - this.params.row;
            if (this.__start != end) {
                this.__start = end;
                this.build();
            }
        },
        next: function () {
            var start = this.__start;
            var diff = this.params.total - this.params.row;
            this.__start += this.params.step;
            if (this.__start >= diff) {
                this.__start = diff;
            }
            if (start != this.__start) this.build();
        },
        prev: function () {
            var start = this.__start;
            if (this.__start < this.params.step) {
                this.__start = 0;
            } else {
                this.__start -= this.params.step;
                var diff = this.params.total - this.params.row;
                if (this.__start >= diff) {
                    this.__start = diff - this.params.step;
                }
            }
            if (start != this.__start) this.build();
        },
        get value() {
            return this.params.current;
        },
        set value(value) {
            this.params.current = value;
            if (!(value > this.__start && value <= this.__start + this.params.row)) {
                this.__start = Math.floor((value - 1) / this.params.row) * this.params.row;
            }
            this.build();
        }
    };
    return Pagination;
}));