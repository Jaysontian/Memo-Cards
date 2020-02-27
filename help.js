var help = {
  getdate: (dateObj) => {
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    return year + "/" + month + "/" + day;
  },
  notify: (string) => {
    var con = $('<div>').addClass('notify').appendTo('body').fadeIn();
    $('<p>').text(string).appendTo(con);
    setTimeout(function(){ con.fadeOut().then(()=>{con.remove()}); }, 3000);
  }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
