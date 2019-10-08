const constants = {
  START_CONSOLE_RECORDING: "START_CONSOLE_RECORDING",
  STOP_CONSOLE_RECORDING: "STOP_CONSOLE_RECORDING",
  SET_SCREENSHOT: "SET_SCREENSHOT",
  GET_SCREENSHOTS: "GET_SCREENSHOTS"
};
/* window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  console.stdlog('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
} */


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case constants.SET_SCREENSHOT:
      addScreenShots(request.payload)
      // sendResponse({ msg: "screen_shot" });
      break;
    case constants.START_CONSOLE_RECORDING:
      // console.stdlog = console.log.bind(console);
      // console.log = function() {
      //   // console.logs.push(Array.from(arguments));

      //   const consoleLogs = JSON.parse(
      //     localStorage.getItem('consoleLogs') ?
      //     localStorage.getItem('consoleLogs') :
      //     '[]'
      //   );
      //   consoleLogs.push(Array.from(arguments));
      //   localStorage.setItem('consoleLogs', JSON.stringify(consoleLogs));
      //   console.stdlog.apply(console, arguments);
      // }
      // setTimeout(() => {
      //   const a = document.getElementById('btn_addCandidates');

      //   console.log('btn_addCandidates', a);
      // }, 5000);
      // cleanConsoleLogs();

      AddConsolejs();
      sendResponse({ message: `Started logging` });
      break;
    case constants.STOP_CONSOLE_RECORDING:
      sendResponse({ logs: JSON.parse(localStorage.getItem("consoleLogs")) });
      break;
    case constants.GET_SCREENSHOTS:
      sendResponse(JSON.parse(localStorage.getItem("screen_shots")))
      setTimeout(() => cleanConsoleLogs(), 400)
      break;
    default:
      sendResponse({ error: "Unhandled action" });
  }
});

const cleanConsoleLogs = () => {
  localStorage.setItem("consoleLogs", '[]');
  localStorage.setItem("screen_shots", '[]');

};

function addScreenShots(payload) {
  let screenShots = JSON.parse(localStorage.getItem('screen_shots'))
  if (screenShots == undefined)
    screenShots = []
  screenShots.push(payload)
  localStorage.setItem('screen_shots', JSON.stringify(screenShots))
}

function AddConsolejs() {
  if (IsTopWindow()) {
    var body = document.getElementsByTagName("body")[0];
    var consoleJS = document.createElement("script");
    consoleJS.setAttribute("type", "text/javascript");
    consoleJS.setAttribute("src", chrome.extension.getURL("console.js"));

    body.appendChild(consoleJS);
  }
}

function IsTopWindow() {
  try {
    if (window.location == window.parent.location) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

