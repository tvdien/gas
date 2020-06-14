function postSlack(payload, hookUrl) {
  var defaultIncomingHook = "SLACK_INCOMING_HOOK_URL";
  var fetchOptions = {
    "method" : "POST",
    "headers": { "Content-type": "application/json" },
    "payload" : JSON.stringify(payload)
  };

  if (hookUrl) {
    UrlFetchApp.fetch(hookUrl, fetchOptions);
  } else {
    UrlFetchApp.fetch(defaultIncomingHook, fetchOptions);
  }
}

function postSimpleRecordReminder() {
  var now = new Date();
  var formated_unique_datetime = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy_MM_dd_HH_mm_ss');

  var defaultIncomingHook = "SLACK_INCOMING_HOOK_URL";
  var blocks = {
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Click one to record"
        }
      },
      {
        "type": "actions",
        "block_id": "simpleRecord",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Coffee"
            },
            "value": "coffee"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Water"
            },
            "value": "water"
          }
        ]
      }
    ]
  };
  var options = {
    "method" : "POST",
    "headers": {"Content-type": "application/json"},
    "payload" : JSON.stringify(blocks)
  };
  UrlFetchApp.fetch(defaultIncomingHook, options);
}

function doPost(e) {
  if (e.parameter.user_name === "slackbot") return;
  if (e.parameter.payload) {
    requestBody = JSON.parse(e.parameter.payload);
    record(requestBody.actions[0].value);
    postSlack({ text: requestBody.actions[0].value }, requestBody.response_url);
    postSimpleRecordReminder();
  } else {
    postSlack({ text: 'Ops !!! something went wrong :(' });
  }
}

function record(data) {
  var recordSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('records');
  var lastRow = recordSheet.getLastRow();
  var nextRow = lastRow + 1;

  var date = new Date();
  var formatedDate = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
  var formatedTime = Utilities.formatDate(date, 'Asia/Tokyo', 'HH:mm:ss');

  recordSheet.getRange("A" + nextRow).setValue(formatedDate);
  recordSheet.getRange("B" + nextRow).setValue(formatedTime);
  recordSheet.getRange("C" + nextRow).setValue(data);
}
