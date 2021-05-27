
var is_positive = n => !isNaN(n) && n > 0;

const DateHelper = {

    IsDate: function (input) { return Object.prototype.toString.call(input) === "[object Date]"; },

    IsValid: function (value, cal) {
        var ymd = this.YMD(value);
        return ymd.length === 3 && is_positive(ymd[0]) && is_positive(ymd[1]) && is_positive(ymd[2]) && ymd[1] <= 12 && ymd[2] <= cal.daysInMonth(ymd[0], ymd[1]);
    },

    ValidateShamsi: function (ymd) {
        ymd = this.YMD(ymd);
        if (!ymd) return null;
        var y = ymd[0];
        var m = ymd[1];
        var d = ymd[2];
        if (!y) y = 1;
        if (!m) m = 1;
        if (!d) d = 1;
        //--------
        while (m < 1) { m += 12; y -= 1; };
        while (m > 12) { m -= 12; y += 1; };
        //--------
        while (d < 1) {
            m -= 1;
            if (m < 1) { m += 12; y -= 1; }
            d += Shamsi.daysInMonth(y, m);
        };
        while (d > Shamsi.daysInMonth(y, m)) {
            d -= Shamsi.daysInMonth(y, m);
            m += 1;
            if (m > 12) { m -= 12; y += 1; }
        };
        return [y, m, d];
    },

    ValidateMiladi: function (ymd) {
        ymd = this.YMD(ymd);
        if (!ymd) return null;
        var y = ymd[0];
        var m = ymd[1];
        var d = ymd[2];
        if (!y) y = 1;
        if (!m) m = 1;
        if (!d) d = 1;
        //--------
        while (m < 1) { m += 12; y -= 1; };
        while (m > 12) { m -= 12; y += 1; };
        //--------
        while (d < 1) {
            m -= 1;
            if (m < 1) { m += 12; y -= 1; }
            d += Miladi.daysInMonth(y, m);
        };
        while (d > Miladi.daysInMonth(y, m)) {
            d -= Miladi.daysInMonth(y, m);
            m += 1;
            if (m > 12) { m -= 12; y += 1; }
        };
        return [y, m, d];
    },

    YMD: function (ymd) {
        if (DateHelper.IsDate(ymd)) return [ymd.getFullYear(), ymd.getMonth() + 1, ymd.getDate(), ymd.getHours(), ymd.getMinutes(), ymd.getSeconds(), ymd.getMilliseconds()]
        else if (typeof (ymd) === 'string') {
            if (ymd.indexOf('-') > 0 && ymd.indexOf('T') > 0) {
                var s = ymd.trim().split('T')[0]
                ymd = s.split('-')
            }
            else {
                var s = ymd.trim().split(' ')[0]
                ymd = s.split('/')
            }
        }
        else if (Array.isArray(ymd) && ymd.length < 3) {
            var a = [];
            for (var i = 0; i < ymd.length; i++) a.push(ymd[i]);
            ymd = a;
            while (ymd.length < 3) ymd.push(1);
        }
        else if (!Array.isArray(ymd)) return null;
        for (var k = 0; k < ymd.length; k++)
            ymd[k] = ymd[k] * 1;
        return ymd;
    },

    YMD2Date: function (ymd) { return new Date(ymd[0], ymd[1] - 1, ymd[2]); },

    format: function (fmt, ymd, calendar) {
        ymd = DateHelper.YMD(ymd);
        if (!ymd) return null;
        if (!fmt) fmt = 'yyyy/MM/dd';
        var y = ymd[0] * 1;
        var m = ymd[1] * 1;
        var d = ymd[2] * 1;
        var hh = ymd.length > 3 ? ymd[3] : 0;
        var mm = ymd.length > 4 ? ymd[4] : 0;
        var ss = ymd.length > 5 ? ymd[5] : 0;
        var zz = ymd.length > 6 ? ymd[6] : 0;
        zz = zz < 10 ? '00' + zz : (zz < 100 ? '0' + zz : zz + '');

        var res = '';
        for (var i = 0; i < fmt.length; i++) {
            var c = fmt[i];
            var n = 1;
            while (i + 1 < fmt.length && fmt[i + 1] === c) {
                i += 1;
                n += 1;
            }
            switch (c) {
                case 'y':
                case 'Y':
                    if (n === 2 && ((y >= 1300 && y < 1400) || (y >= 1900 && y < 2000))) res += (y % 100) + '';
                    else res += y + '';
                    break;

                case 'M':
                    if (n === 1) res += m + '';
                    else if (n === 2) res += (m < 10 ? '0' : '') + m;
                    else res += calendar.getMonthName(m);
                    break;

                case 'd':
                case 'D':
                    if (n === 1) res += d + '';
                    else if (n === 2) res += (d < 10 ? '0' : '') + d;
                    else res += calendar.getDOWName(y, m, d);
                    break;

                case 'h':
                    var _hh = hh > 12 ? hh - 12 : hh;
                    if (n === 1) res += _hh + '';
                    else res += (_hh < 10 ? '0' : '') + _hh;
                    break;

                case 'H':
                    if (n === 1) res += hh + '';
                    else res += (hh < 10 ? '0' : '') + hh;
                    break;

                case 'm':
                    if (n === 1) res += mm + '';
                    else res += (mm < 10 ? '0' : '') + mm;
                    break;

                case 's':
                    if (n === 1) res += ss + '';
                    else res += (ss < 10 ? '0' : '') + ss;
                    break;

                case 'z':
                    if (n === 1) res += zz.substr(0, 1);
                    else if (n === 2) res += zz.substr(0, 2);
                    else res += zz;
                    break;

                default:
                    while (n-- > 0) res += c;
                    break;
            }
        }
        return res;
    }

}



export const Miladi = new function () {
    var self = this;
    var leaps = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256, 260, 264, 268, 272, 276, 280, 284, 288, 292, 296, 304, 308, 312, 316, 320, 324, 328, 332, 336, 340, 344, 348, 352, 356, 360, 364, 368, 372, 376, 380, 384, 388, 392, 396]
    var dow = [4, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3,];
    var dow_names = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    var month_len = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var m_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    self.Id = "miladi";
    self.year_start = 1800;
    self.year_end = self.year_start + 400;
    self.GoToTodayText = 'Today';
    self.short_dow_names = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];
    self.NextMonthText = 'Next Month';
    self.PrevMonthText = 'Previous Month';

    function ymd_to_days(ymd) {
        ymd = DateHelper.YMD(ymd);
        if (!ymd) return 0;
        //------------------
        var y = ymd[0];
        var days = ymd[2] - 1;
        for (var i = self.year_start; i < y; i++) days += self.isleap(i) ? 366 : 365;
        for (i = 1; i < ymd[1]; i++) days += self.daysInMonth(y, i);
        return days;
    }

    function days_to_ymd(days) {
        var y = self.year_start;
        var m = 1;
        var d = 1;
        //------------------
        while (days > 0) {
            var days_in_year = self.isleap(y) ? 366 : 365;
            if (days < days_in_year) break;
            y += 1;
            days -= days_in_year;
        }
        //------------------
        while (days > 0) {
            var days_in_month = self.daysInMonth(y, m);
            if (days < days_in_month) break;
            m += 1;
            days -= days_in_month;
        }
        if (days > 0) d += days;
        return [y, m, d];
    }


    self.isleap = function (y) {
        y -= self.year_start;
        for (var i = 0; i < leaps.length && leaps[i] <= y; i++)
            if (leaps[i] === y) return true;
        return false;
    }
    self.daysInMonth = function (y, m) {
        while (m < 1) m += 12;
        while (m > 12) m -= 12;
        return m === 2 && self.isleap(y) ? 29 : month_len[m - 1];
    }

    self.getMonthName = function (m) { return m < 1 || m > 12 ? null : m_names[m - 1]; }
    self.getDOWName = function (y, m, d) { return dow_names[self.DOW(y, m, d)]; }
    self.DOW = function (y, m, d) {
        var d1_1 = dow[y - self.year_start];
        var m_dow = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
        var res = (d1_1 + m_dow[m - 1]) % 7;
        if (d > 0) res = (res + (d - 1)) % 7;
        return res;
    }

    self.addDaysYMD = function (ymd, amount) {
        if (ymd == null) ymd = [self.year_start, 1, 1];
        var days = ymd_to_days(ymd);
        return days_to_ymd(days + amount);
    }
    self.addDays = function (ymd, amount) { return DateHelper.format("yyyy/MM/dd", self.addDaysYMD(ymd, amount), self) }
    self.addMonths = function (ymd, amount) {
        ymd = DateHelper.YMD(ymd);
        if (!ymd) return null;
        var y = ymd[0];
        var m = ymd[1] + amount;
        var d = ymd[2];
        //-------------
        while (m < 1) { m += 12; y -= 1; };
        while (m > 12) { m -= 12; y += 1; };
        return DateHelper.format("yyyy/MM/dd", [y, m, d], self);
    }
    self.subtract = function (ymd1, ymd2) { return ymd_to_days(ymd1) - ymd_to_days(ymd2); }
    self.baseOffset = function (ymd) { return ymd_to_days([1821, 3, 21]) }
    self.toShamsiYMD = function (ymd) {
        var x = ymd_to_days(ymd) - self.baseOffset() + Shamsi.baseOffset();
        return Shamsi.addDaysYMD(null, x);
    }
    self.toShamsi = function (ymd) { return DateHelper.format('yyyy/MM/dd', self.toShamsiYMD(ymd), self); }
    self.parse = function (ymd) { return DateHelper.YMD2Date(DateHelper.YMD(ymd)); }
    self.now = function () {
        var dt = new Date();
        var m = dt.getMonth() + 1; //months from 1-12
        var d = dt.getDate();
        var y = dt.getFullYear();
        var res = y + "/" + (m < 10 ? "0" : "") + m + "/" + (d < 10 ? "0" : "") + d;
        return res;
    }
    self.validate = function (value) { return DateHelper.ValidateMiladi(value); }
    self.isValid = function (value) { return DateHelper.IsValid(value, self) }
    self.format = function (dateFormat, value) { return DateHelper.format(dateFormat, DateHelper.YMD(value), self) }
}();



export const Shamsi = new function () {
    var self = this;
    var leaps = [1, 5, 10, 14, 18, 22, 26, 30, 34, 38, 43, 47, 51, 55, 59, 63, 67, 71, 76, 80, 84, 88, 92, 96, 100, 104, 109, 113, 117, 121, 125, 129, 133, 137, 142, 146, 150, 154, 158, 162, 166, 170, 175, 179, 183, 187, 191, 195, 199, 203, 208, 212, 216, 220, 224, 228, 232, 236, 241, 245, 249, 253, 257, 261, 265, 269, 274, 278, 282, 286, 290, 294, 298]
    var dow = [4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 1, 3, 4, 5, 6, 1, 2, 3, 4, 6, 0, 1, 2, 4, 5, 6, 0, 2, 3, 4, 5, 0, 1, 2, 3, 5]
    var dow_names = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    var m_names = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

    self.Id = "shamsi";
    self.year_start = 1200;
    self.year_end = self.year_start + 400;
    self.GoToTodayText = 'برو به امروز';
    self.short_dow_names = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
    self.NextMonthText = 'ماه بعد';
    self.PrevMonthText = 'ماه قبل';

    function ymd_to_days(ymd) {
        ymd = DateHelper.YMD(ymd);
        if (!ymd) return 0;
        //------------------
        var y = ymd[0];
        var days = ymd[2] - 1;
        for (var i = self.year_start; i < y; i++) days += self.isleap(i) ? 366 : 365;
        for (i = 1; i < ymd[1]; i++) days += self.daysInMonth(y, i);
        return days;
    }

    function days_to_ymd(days) {
        var y = self.year_start;
        var m = 1;
        var d = 1;
        //------------------
        while (days > 0) {
            var days_in_year = self.isleap(y) ? 366 : 365;
            if (days < days_in_year) break;
            y += 1;
            days -= days_in_year;
        }
        //------------------
        while (days > 0) {
            var days_in_month = self.daysInMonth(y, m);
            if (days < days_in_month) break;
            m += 1;
            days -= days_in_month;
        }
        if (days > 0) d += days;
        return [y, m, d];
    }

    self.isleap = function (y) {
        y -= self.year_start;
        for (var i = 0; i < leaps.length && leaps[i] <= y; i++)
            if (leaps[i] === y) return true;
        return false;
    }
    self.daysInMonth = function (y, m) {
        while (m < 1) m += 12;
        while (m > 12) m -= 12;
        return m < 7 ? 31 : (m < 12 || self.isleap(y) ? 30 : 29);
    }

    self.getMonthName = function (m) { return m < 1 || m > 12 ? null : m_names[m - 1]; }
    self.getDOWName = function (y, m, d) { return dow_names[self.DOW(y, m, d)]; }
    self.DOW = function (y, m, d) {
        var d1_1 = dow[y - self.year_start];
        var m_dow = [0, 3, 6, 2, 5, 1, 4, 6, 1, 3, 5, 0];
        var res = (d1_1 + m_dow[m - 1]) % 7;
        if (d > 0) res = (res + (d - 1)) % 7;
        return res;
    }

    self.addDaysYMD = function (ymd, amount) {
        if (ymd == null) ymd = [self.year_start, 1, 1];
        var days = ymd_to_days(ymd);
        return days_to_ymd(days + amount);
    }
    self.addDays = function (ymd, amount) { return DateHelper.format("yyyy/MM/dd", self.addDaysYMD(ymd, amount), self) }
    self.addMonths = function (ymd, amount) {
        ymd = DateHelper.YMD(ymd);
        if (!ymd) return null;
        var y = ymd[0];
        var m = ymd[1] + amount;
        var d = ymd[2];
        //-------------
        while (m < 1) { m += 12; y -= 1; };
        while (m > 12) { m -= 12; y += 1; };
        return DateHelper.format("yyyy/MM/dd", [y, m, d], self);
    }
    self.subtract = function (ymd1, ymd2) {
        if (DateHelper.IsDate(ymd1)) ymd1 = Miladi.toShamsiYMD(ymd1)
        if (DateHelper.IsDate(ymd2)) ymd2 = Miladi.toShamsiYMD(ymd2)
        return ymd_to_days(ymd1) - ymd_to_days(ymd2);
    }
    self.baseOffset = function () { return ymd_to_days([1200, 1, 1]) }
    self.toMiladiYMD = function (ymd) {
        if (DateHelper.IsDate(ymd)) return Miladi.format("yyyy/MM/dd", ymd);
        var x = ymd_to_days(ymd) - self.baseOffset() + Miladi.baseOffset();
        return Miladi.addDaysYMD(null, x);
    }
    self.toMiladi = function (ymd) { return DateHelper.format('yyyy/MM/dd', self.toMiladiYMD(ymd), self); }
    self.parse = function (ymd) { return DateHelper.YMD2Date(self.toMiladiYMD(ymd)); }
    self.now = function () { return Miladi.toShamsi(new Date()); }
    self.validate = function (value) { return DateHelper.ValidateShamsi(value); }
    self.isValid = function (value) { return DateHelper.IsValid(value, self) }
    self.format = function (dateFormat, value) {
        var is_sys_date = DateHelper.IsDate(value);
        var ymd = is_sys_date ? Miladi.toShamsiYMD(value) : DateHelper.YMD(value);
        if (is_sys_date) ymd = [ymd[0], ymd[1], ymd[2], value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds()];
        return DateHelper.format(dateFormat, ymd, self)
    }
}();



//var NowYMD_HHMM = function () {
//    var t = new Date();
//    return Calendar.now() + ' ' + t.getHours() + ':' + t.getMinutes();
//}


//alert(Shamsi.toMiladi('1397/07/11'));
//alert(Miladi.toShamsi('2018/10/03'));


//var Calendar = Shamsi;
