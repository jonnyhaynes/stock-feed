var StockFeed = (function () {

  var config = {
    quandleCode: 'LSE/BSY',
    apiKey: 'xxxxxx',
    selector: '.stock-price'
  };

  /**
   * Show the popup
   */
  var _show = function (title, url) {

    var html = '',
    monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    stockCache = _readCookie();
    if (stockCache !== (undefined || null)) {

      var element = document.querySelector(config.selector);
      element.innerHTML = _readCookie('stockPrice');

    } else {

      _getFileContents('https://www.quandl.com/api/v3/datasets/' + config.quandleCode + '.json' + '?api_key=' + config.apiKey + '&limit=1', function (response) {

        var json = JSON.parse(response),
            date = new Date(json.dataset.refreshed_at),
            time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2),
            day = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();

        html = '<strong>Stock Price: ' + json.dataset.data[0][1].toFixed(2) + 'p</strong>' + json.dataset.data[0][6].toFixed(2) + 'p (' + json.dataset.data[0][7] + '%) at ' + time + ', ' + day;

        document.querySelector(config.selector).innerHTML = html;

        _setCookie(html);
      });

    }

  };

  /**
   * Set the cookie
   */

  var _setCookie = function (value) {
    var date = new Date();
    date.setTime(date.getTime() + 43200000);
    var expires = "; expires=" + date.toGMTString();
    document.cookie = escape('stockPrice') + "=" + escape(value) + expires + "; path=/";
  }

  /**
   * Read the cookie
   */

  var _readCookie = function () {
    var nameEQ = escape('stockPrice') + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
  }
  
  /**
   * Get the contents of a file on the same domain
   *
   * @public
   * @param {String} file - The url of the file
   * @param {Function} success - The name of the event
   */
  var _getFileContents = function (file, success, error) {

    // Detect whether XMLHttpRequest is supported
    if (!window.XMLHttpRequest) {
      return;
    }

    // Create a new request
    var request = new XMLHttpRequest();

    // Setup callbacks
    request.onreadystatechange = function () {

      // If the request is completed
      if (this.readyState === 4) {

        // If the request failed
        if (request.status !== 200) {
          if (error && typeof(error) === 'function') {
            error(request.responseText, request);
          }
          return;
        }

        // If the request was successful
        if (success && typeof(success) === 'function') {
          success(request.responseText, request);
        }
      }
    };

    // Send the HTML
    request.open('GET', file, true);
    request.send();

  };

  /**
   * Initialise
   */
  var init = function () {

    _show();

  };

  return {
    init: init
  };

})();
