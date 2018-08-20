var recaptcha_settings = {
    api_server: 'http://www.google.com/recaptcha/api',
    api_secure_server: 'https://www.google.com/recaptcha/api',
    verify_server: 'www.google.com',
    verify_path: '/recaptcha/api/verify'
}

module.exports = {
    get_html: function (pubkey, callback, error, use_ssl) //returns HTML
    {

        if (pubkey == null || pubkey == '')
        {
            throw new Error("To use reCAPTCHA you must get an API key from https://www.google.com/recaptcha/admin/create");
        }

        if (use_ssl)
        {
            var server = recaptcha_settings.api_secure_server;
        }
        else
        {
            var server = recaptcha_settings.api_server;
        }

        var errorpart = '';
        if (error)
        {
            errorpart = "&amp;error=".error;
        }

        callback('<script type="text/javascript" src="' + server + '/challenge?k=' + pubkey + errorpart + '"></script>\
	<noscript>\
  		<iframe src="' + server + '/noscript?k=' + pubkey + errorpart + '" height="300" width="500" frameborder="0"></iframe><br/>\
  		<textarea name="recaptcha_challenge_field" rows="3" cols="40"></textarea>\
  		<input type="hidden" name="recaptcha_response_field" value="manual_challenge"/>\
	</noscript>');
    },
    validate: function (privkey, req, challenge, response, callback) //validates answer
    {
        if (privkey == null || privkey == '')
        {
            throw new Error('To use reCAPTCHA you must get an API key from https://www.google.com/recaptcha/admin/create');
        }

        var remoteip = (req.connection.remoteAddress ? req.connection.remoteAddress : req.remoteAddress);

        console.log('challenge: ' + challenge);

        //discard spam submissions
        if (challenge == null || challenge.length == 0 || response == null || response.length == 0)
        {
            callback(false, 'incorrect-captcha-sol');
        }
        else //verify with server
        {
            var HTTPRequest = require('HTTPRequest');
            HTTPRequest.post("https://" + recaptcha_settings.verify_server + recaptcha_settings.verify_path, {
                privatekey: privkey,
                remoteip: remoteip,
                challenge: challenge,
                response: response
            }, function (status, headers, content)
            {
                if (status == 200)
                {
                    var lines = content.split('\n');
                    if (lines.length >= 2)
                    {
                        if (lines[0] == 'true')
                        {
                            callback(true, lines[1]);
                        }
                        else
                        {
                            callback(false, lines[1]);
                        }
                    }
                }
                else
                {
                    callback(false, 'HTTP ERROR: ' + status);
                }
            }, {
                USERAGENT: 'Node.js reCAPTCHA'
            });
        }
    }
}