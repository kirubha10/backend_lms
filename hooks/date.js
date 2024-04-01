const DateGenerator = () => {
  const indiaTimeZone = "Asia/Kolkata";

  // Get the current date
  let currentDate = new Date();

  // Convert the date to the Indian time zone
  let indianDate = currentDate
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: indiaTimeZone,
    })
    .replace(/(\d+)\/(\d+)\/(\d+),?/, "$3-$1-$2");

  //get current date in yyyy-mm-dd format
  return indianDate;
};

module.exports = DateGenerator;

// Compare this snippet from backend/controllers/health.ctrl.js:
