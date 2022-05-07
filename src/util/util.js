export const transDate = (strtime) => {
    var date = new Date(strtime.replace(/-/g, '/'));
    date = Date.parse(date);
    console.log('date', date)
    var tt = new Date(parseInt(date));
    var days = parseInt((new Date().getTime() - date) / 86400000);
    var today = new Date().getDate();
    var year = tt.getFullYear();
    var mouth = tt.getMonth() + 1;
    var day = tt.getDate();
    var time = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
    var min = tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
    var result, offset;
    offset = Math.abs(today - day);
    if (days < 4 && offset < 4) {
        if (offset === 0) {
            result = "今天 " + time + ":" + min;
        } else if (offset === 1) {
            result = "昨天 " + time + ":" + min;
        } else if (offset === 2) {
            result = "前天 " + time + ":" + min;
        }
    } else {
        result = year + "-" + mouth + "-" + day + " " + time + ":" + min;
    }
    return result;
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
}

export  const util={
    uuid,

}