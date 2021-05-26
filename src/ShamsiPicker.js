(function ($, window, document, undefined) {
    //this == $
    var pluginName = 'shamsiPicker';

    var Plugin = function (elem, options) {
        elem = $(elem);
        var self = this;
        var today = null;
        var today_ymd = null;
        var cal = null;
        var cal_ym;
        var selected_ymd;
        var viewmode = 0;
        options = $.extend(true, {}, $.fn[pluginName].defaults, options);

        //----------------
        this.close = function () {
            elem.focus();
            cal.hide();
        }

        //----------------
        this.open = function () {
            if (cal.is(':visible') || elem.is('[readonly]')) {
                self.close();
                return;
            }
            set_date(elem.val());
            var pos = elem.offset();
            if (!options.anchorRight)
                if (!options.anchorTop) cal.css(adjust_pos({ left: pos.left, top: pos.top + elem.outerHeight() }));
                else cal.css(adjust_pos({ left: pos.left, top: pos.top - cal.outerHeight() }));
            else
                if (!options.anchorTop) cal.css(adjust_pos({ left: pos.left + elem.outerWidth() - cal.outerWidth(), top: pos.top + elem.outerHeight() }));
                else cal.css(adjust_pos({ left: pos.left + elem.outerWidth() - cal.outerWidth(), top: pos.top - cal.outerHeight() }));

            setTimeout(function () {
                cal.show();
                cal.focus();
            }, 100)
        }

        function adjust_pos(pos) {
            var W = $(window).width();
            var H = $(window).height();
            //-------
            var r = pos.left + cal.outerWidth();
            if (r > W) pos.left += W - r;
            //-------
            var b = pos.top + cal.outerHeight();
            if (b > H) pos.top += H - b;
            //-------
            if (pos.left < 0) pos.left = 0;
            if (pos.top < 0) pos.top = 0;
            return pos;
        }

        this.changeDate = function (value, autoclose) {
            var x = DateHelper.YMD(value);
            if (x[0] < Calendar.year_start) x[0] = Calendar.year_start;
            if (x[0] >= Calendar.year_end) x[0] = Calendar.year_end - 1;
            value = DateHelper.format('yyyy/MM/dd', x);
            set_date(value);
            if (autoclose) {
                elem.val(value);
                elem.change();
                self.close();
            }
        }

        function set_date(value) {
            today = Calendar.now();
            today_ymd = DateHelper.YMD(today);
            if (!value || value.trim().length < 10) value = today;
            selected_ymd = Calendar.Validate(value);
            if (selected_ymd.length) {
                if (selected_ymd[0] < Calendar.year_start) selected_ymd[0] = Calendar.year_start;
                if (selected_ymd[0] >= Calendar.year_end) selected_ymd[0] = Calendar.year_end - 1;
            }
            set_cal(selected_ymd[0], selected_ymd[1]);
        }

        //----------------
        function set_viewmode(value) {
            viewmode = value % 3;
            cal.removeClass('shp-viewmode-1');
            cal.removeClass('shp-viewmode-2');
            if (viewmode > 0) cal.addClass('shp-viewmode-' + viewmode);
        }
        //----------------
        function set_cal(y, m) {
            m = m < 1 ? 1 : (m > 12 ? 12 : m);
            y = y < Calendar.year_start ? Calendar.year_start : (y >= Calendar.year_end ? Calendar.year_end - 1 : y);
            cal_ym = [y, m];
            //-------------
            var title_elem = cal.find('.shp-header li:eq(1)');
            title_elem.text(y + ' ' + Calendar.getMonthName(m));
            //-------------
            var dow = Calendar.DOW(y, m, 1);
            if (dow == 0) dow = 7;
            var last_month = Calendar.Validate([y, m - 1, 1]);
            var next_month = Calendar.Validate([y, m + 1, 1]);
            var days_in_month = Calendar.daysInMonth(y, m);
            for (var i = 0; i <= 7 * 6; i++) {
                if (i < dow) set_day(i, last_month[0], last_month[1], Calendar.daysInMonth(last_month[0], last_month[1]) - dow + i + 1, true);
                else if (i < dow + days_in_month) set_day(i, y, m, i - dow + 1, false);
                else set_day(i, next_month[0], next_month[1], i - dow - days_in_month + 1, true);
            }
            //-------------
            for (var i = 0; i < 12; i++) set_month(i, i + 1);
            //-------------
            var start_y = y - (y % 20);
            if (start_y < Calendar.year_start) start_y = Calendar.year_start;
            if (start_y + 20 > Calendar.year_end) start_y = Calendar.year_end - 20;
            for (var i = 0; i < 20; i++) set_year(i, i + start_y);
        }

        function set_day(i, y, m, d, is_gray) {
            var c = i % 7;
            var r = i / 7 >> 0;
            var _rows = cal.find('.shp-days tbody tr');
            var _cells = $(_rows[r]).find('td');
            var cell = $(_cells[c]);
            var curr = DateHelper.format('yyyy/MM/dd', [y, m, d]);
            if (y == selected_ymd[0] && m == selected_ymd[1] && d == selected_ymd[2]) cell.addClass('shp-selected'); else cell.removeClass('shp-selected');
            if (curr == today) cell.addClass('shp-today'); else cell.removeClass('shp-today');
            if (is_gray) cell.addClass('shp-gray'); else cell.removeClass('shp-gray');
            cell.text(d);
            cell.data('shp-date', curr);
        }

        function set_month(i, m) {
            var c = i % 3;
            var r = i / 3 >> 0;
            var _rows = cal.find('.shp-months tbody tr');
            var _cells = $(_rows[r]).find('td');
            var cell = $(_cells[c]);

            if (cal_ym[0] == selected_ymd[0] && m == selected_ymd[1]) cell.addClass('shp-selected'); else cell.removeClass('shp-selected');
            if (cal_ym[0] == today_ymd[0] && m == today_ymd[1]) cell.addClass('shp-today'); else cell.removeClass('shp-today');
            cell.text(Calendar.getMonthName(m));
            cell.data('shp-month', m);
        }

        function set_year(i, y) {
            var c = i % 5;
            var r = i / 5 >> 0;
            var _rows = cal.find('.shp-years tbody tr');
            var _cells = $(_rows[r]).find('td');
            var cell = $(_cells[c]);
            if (y == selected_ymd[0]) cell.addClass('shp-selected'); else cell.removeClass('shp-selected');
            if (y == today_ymd[0]) cell.addClass('shp-today'); else cell.removeClass('shp-today');
            cell.text(y);
        }
        //----------------
        function change_cal(dy, dm) {
            var x = Calendar.addMonths(cal_ym, dm);
            set_cal(x[0] + dy, x[1]);
        }

        function change_selected_date_by_viewmode(dy, dm, dd) {
            if (viewmode == 0) selected_ymd = Calendar.addDays(selected_ymd, dd);
            else if (viewmode == 1) selected_ymd = Calendar.addMonths(selected_ymd, dm);
            else selected_ymd = Calendar.addMonths(selected_ymd, dy);
            var new_date = DateHelper.format('yyyy/MM/dd', selected_ymd);
            self.changeDate(new_date, false);
        }

        //----------------
        this.init = function () {
            cal = generateHtml();
            cal.keydown(function (e) {
                switch (e.keyCode) {
                    case 27: self.close(); break;
                    case 32: set_viewmode(viewmode + 1); break;

                    case 13:
                        if (viewmode == 0) self.changeDate(DateHelper.format('yyyy/MM/dd', selected_ymd), true);
                        else set_viewmode(viewmode - 1);
                        stop_event(e);
                        break;

                    case 33: change_selected_date_by_viewmode(-5 * 12 * 4, -12, -5 * 7); break;// pg-up
                    case 34: change_selected_date_by_viewmode(5 * 12 * 4, 12, 5 * 7); break;// pg-dn
                    case 37: change_selected_date_by_viewmode(12, 1, 1); break;// left
                    case 38: change_selected_date_by_viewmode(-5 * 12, -3, -7); break;// up
                    case 39: change_selected_date_by_viewmode(-12, -1, -1); break;// right
                    case 40: change_selected_date_by_viewmode(5 * 12, 3, 7); break;// down

                    case 46: self.changeDate(today, false); break;// del
                    default: return;
                }
                return stop_event(e);
            });
            //-----
            var next_button_month_steps = [1, 12, 12 * 20];
            cal.find('.shp-header li:eq(0)').click(function () { change_cal(viewmode == 1 ? 1 : (viewmode == 2 ? 20 : 0), viewmode == 0 ? 1 : 0); });
            cal.find('.shp-header li:eq(2)').click(function () { change_cal(viewmode == 1 ? -1 : (viewmode == 2 ? -20 : 0), viewmode == 0 ? -1 : 0); });
            cal.find('.shp-header li:eq(1)').click(function () {
                set_viewmode(viewmode + 1);
            });
            //-----
            cal.find('.shp-days td').click(function () {
                var d = $(this).data('shp-date');
                var ymd = DateHelper.YMD(d);
                if (ymd[1] != cal_ym[1]) set_cal(ymd[0], ymd[1]);
                else self.changeDate(d, true);
            })
            cal.find('.shp-months td').click(function () {
                var m = $(this).data('shp-month');
                set_cal(cal_ym[0], m);
                set_viewmode(0);
            })
            cal.find('.shp-years td').click(function () {
                var y = $(this).text();
                set_cal(y, cal_ym[1]);
                set_viewmode(1);
            })
            //-----
            cal.find('.shp-footer a').click(function (e) { self.changeDate(today, false); cal.focus(); stop_event(e); return false; })
            //-----
            cal.find('.shp-days')[0].addEventListener("wheel", function (e) {
                if (e.deltaY > 0) change_cal(e.ctrlKey ? 1 : 0, e.ctrlKey ? 0 : 1);
                if (e.deltaY < 0) change_cal(e.ctrlKey ? -1 : 0, e.ctrlKey ? 0 : -1);
                return stop_event(e);
            })
            cal.find('.shp-months')[0].addEventListener("wheel", function (e) {
                if (e.deltaY > 0) change_cal(e.ctrlKey ? 10 : 1, 0);
                if (e.deltaY < 0) change_cal(e.ctrlKey ? -10 : -1, 0);
                return stop_event(e);
            })
            cal.find('.shp-years')[0].addEventListener("wheel", function (e) {
                if (e.deltaY > 0) change_cal(e.ctrlKey ? 50 : 20, 0);
                if (e.deltaY < 0) change_cal(e.ctrlKey ? -50 : -20, 0);
                return stop_event(e);
            })
            //-----
            cal.on('click contextmenu', function (e) { stop_event(e); return false; })

            $(window).on('click resize contextmenu blur', function () { cal.hide() });

            //elem.on("click", function () {
            //    self.open();
            //});


            $('body').append(cal);
        }

        function stop_event(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }


        function generateHtml() {
            var header = '<ul class="shp-header"><li title="' + Calendar.NextMonthText + '"><i class="fa fa-chevron-left"></i></li><li>1397 مهر</li><li title="' + Calendar.PrevMonthText + '"><i class="fa fa-chevron-right"></i></li></ul>';
            var footer = '<small class="shp-footer"><a href="javascript:void(0)">' + Calendar.GoToTodayText + '</a></small>';
            var tb_months = '<div class="shp-months"><table><tr><td>فروردین</td><td>اردیبهشت</td><td>خرداد</td></tr><tr><td>تیر</td><td>مرداد</td><td>شهریور</td></tr><tr><td>مهر</td><td>آبان</td><td>آذر</td></tr><tr><td>دی</td><td>بهمن</td><td>اسفند</td></tr></table></div>';
            tb_months = '<div class="shp-months"><table>';
            var m = 1;
            for (var r = 0; r < 4; r++) {
                tb_months += '<tr>';
                for (var c = 0; c < 3; c++)
                    tb_months += '<td>' + Calendar.getMonthName(m++) + '</td>';
                tb_months += '</tr>';
            }
            tb_months += '</table></div>';

            return $('<div class="shp" tabindex=0>' + header + get_table_html('shp-days', 6, 7, Calendar.short_dow_names) + tb_months + get_table_html('shp-years', 4, 5) + footer + '<div>');
        }


        function get_table_html(css, rows, cols, titles) {
            var thead = '';
            if (titles) {
                //var list = titles.split(',')
                for (var i = 0; i < titles.length; i++) thead += '<th>' + titles[i] + '</th>';
                thead = '<thead><tr>' + thead + '</tr></thead>'
            }
            var tbody = '';
            for (var r = 0; r < rows; r++) {
                tbody += '<tr>'
                for (var c = 0; c < cols; c++) tbody += '<td></td>'
                tbody += '</tr>'
            }
            tbody = '<tbody>' + tbody + '</tbody>';
            return '<div class="' + css + '"><table>' + thead + tbody + '</table></div>';
        }

        this.init();
    }


    //Plugin.prototype = {
    //    init: function () {

    //    },

    //    destroy: function () {
    //        this.$elem.removeData();
    //    }
    //}

    $.fn[pluginName] = function (options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            }
            else {
                return this.each(function () {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };

    $.fn[pluginName].defaults = {
        anchorRight: true,
        anchorTop: false,

    };

}(jQuery, window, document));