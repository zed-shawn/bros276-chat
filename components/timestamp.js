var hours = new Date().getHours(); //To get the Current Hours
if (hours < 10) {
  hours = ("0" + hours).slice(-2);
}
var min = new Date().getMinutes(); //To get the Current Minute
if (min < 10) {
  min = ("0" + min).slice(-2);
}

var hours = new Date().getHours(); //To get the Current Hours
if (hours < 10) {
  hours = ("0" + hours).slice(-2);
}
var min = new Date().getMinutes(); //To get the Current Minute
if (min < 10) {
  min = ("0" + min).slice(-2);
}
const timestamp = hours + ":" + min;

export default timestamp