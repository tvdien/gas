function postSlack(text){
  var url = "SLACK_INCOMING_HOOK_URL";
  var options = {
    "method" : "POST",
    "headers": {"Content-type": "application/json"},
    "payload" : '{"text":"' + text + '"}'
  };
  UrlFetchApp.fetch(url, options);
}

// Morning reminder
function postReminder(e) {
  var message = "Good morning :sunny: :cloud: :rain_cloud: ！\nDon't forget to record your daily action\n coffee = :coffee:\nshoppping = :shopping_trolley:\nrunning = :running:";
  postSlack(message);
}

function doPost(e) {
  if (e.parameter.user_name === "slackbot") return;

  record(e.parameter.text);
  postSlack("Added！ :thumbsup:");
}

function record(data) {
  var recordSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('records');
  var lastRow = recordSheet.getLastRow();
  var nextRow = lastRow + 1;

  var date = new Date();
  var formatedDate = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
  var formatedTime = Utilities.formatDate(date, 'Asia/Tokyo', 'HH:mm:ss');

  if (data === 'coffee' || data === 'running' || data === 'shopping') {
    recordSheet.getRange("A" + nextRow).setValue(formatedDate);
    recordSheet.getRange("B" + nextRow).setValue(formatedTime);
    recordSheet.getRange("C" + nextRow).setValue(data);
  }
}
