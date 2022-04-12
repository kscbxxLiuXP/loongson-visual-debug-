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