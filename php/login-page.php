<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Sign in using Google account</title>
    <meta name="google-signin-client_id" content="211499477101-d78crq8gs6sojr7grdlm9ebmoltiel71.apps.googleusercontent.com">
    <link rel=stylesheet href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" integrity="sha384-y3tfxAZXuh4HwSYylfB+J125MxIs6mR5FOHamPBG064zB+AFeWH94NdvaCBm8qnd" crossorigin="anonymous">
    <script src="//apis.google.com/js/platform.js" async defer></script>
    <style>
        body {
            height: 100%;;
        }
        .center {
            position: absolute;
            max-width: 320px;
            left: 50%;
            top: 50%;
            margin-left: -160px;
            transform: translateY(-50%);
        }
        #test3dPartyCookies {
            position: absolute;
            max-width: 500px;
            left: 50%;
            margin-left: -225px;
            top: 30px;
            z-index: 1000;
            box-shadow: 0 0 38px darkred;
            border-radius: 2px;
            border: 1px dashed darkred;
            padding: 16px;
            display: none;
            color: darkred;
        }
        a[target="_blank"] {
            display: block;
            padding-top: 9px;
        }
        a[target="_blank"]:after {
            content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=");
            margin: 0 0 0 7px;
        }
    </style>
</head>

<body>
<div class="row center">
    <div class="col-sm-3">Logo</div>
    <div class="col-sm-9">
        <h5>Sign in using your Google account</h5><br>
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
    </div>
</div>

<form action="/" method="post">
    <input type="hidden" name="authGoogleToken">
</form>

<script>
    function onSignIn (googleUser) {
        var hidden = document.getElementsByName('authGoogleToken')[0];
        hidden.value = googleUser.getAuthResponse().id_token;
        hidden.parentNode.submit();
    }

    // check for 3d party cookies are enabeld code
    window.addEventListener("message", function (evt) {
        if (evt.data === 'MM:3PCunsupported') {
            document.getElementById('test3dPartyCookies').style.display = 'block';
        }
    }, false);
</script>

<div id="test3dPartyCookies"><strong>Hey, third party cookies are disabled in your browser.</strong><br>
    You cannot sign in using Google unless you enable them
    <a target=_blank href="https://www.google.com/search?q=how+do+I+enable+3rd+party+cookies+in+my+browser">Search Google how you can fix this in your browser</a>
</div>
<iframe src="//mindmup.github.io/3rdpartycookiecheck/start.html" style="display:none"></iframe>

<!-- load and cache some js to speedup next page -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" async defer></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js" async defer integrity="sha384-vZ2WRJMwsjRMW/8U7i6PWi6AlO1L79snBrmgiDpgIWJ82z8eA5lenwvxbMV1PAh7" crossorigin="anonymous"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js" async defer></script>
<script src="js/xls.core.min.js" async defer></script>

<script src="//www.gstatic.com/charts/loader.js"></script>
<script>
    google.charts.load('current', {'packages': ['bar']});
</script>
</body>
</html>