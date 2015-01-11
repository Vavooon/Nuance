var isIE = new Function('', '/*@cc_on return true@*/')();

if (!isIE)
{
    function showLoginPopup()
    {
        function onEnterKeyPress(e)
        {
            if (e.keyCode === 13)
            {
                form.submit();
            }
        }

        var form = ce('form',
                {
                    className: 'login-body',
                    action: './login',
                    method: "POST",
                    autocomplete: 'on'
                });
        actionField = ce('input',
                {
                    name: 'action',
                    value: 'login',
                    type: 'hidden'
                }, form);
        loginField = new Nuance.input.TextField(
                {
                    title: _('Login'),
                    name: 'login',
                    onkeypress: onEnterKeyPress
                });
        passwordField = new Nuance.input.PasswordField(
                {
                    title: _('Password'),
                    name: 'password',
                    onkeypress: onEnterKeyPress
                });
        var submitButton = new Nuance.input.Button(
                {
                    value: _("Authorize"),
                    onclick: function ()
                    {
                        form.submit()
                    }
                });
        submitButton.el.style.position = 'relative';
        if (location.hash == '#badpassword')
        {
            var errWin = new Nuance.Popup(
                    {
                        title: _('Error'),
                        closable: false,
                        body: ce("div",
                                {
                                    innerHTML: _("Wrong username or password")
                                })
                    });
            errWin._popupWin.classList.add('error');
            errWin._popupWin.classList.add('blink');
            setTimeout(function ()
            {
                errWin._popupWin.classList.remove('blink');
            }, 1000);
            location.hash = '#';
        }
        var popupTitle = '<img id="login-logo" src="themes/default/img/logo.png">';
        if (location.search === "?badpassword=true")
        {
            ce('div',
                    {
                        className: "error",
                        innerHTML: _("Wrong username or password")
                    }, form, true);
        }
        var b = new Nuance.Popup(
                {
                    title: popupTitle,
                    closable: false,
                    body: form,
                    fields: [loginField, passwordField],
                    buttons: [submitButton]
                });
        b._popupWraps.classList.add('login-wraps');
        b._popupWin.classList.add('login-window');
        b._popupWin.lastChild.classList.add('single');
    }
    var htmlEl = document.getElementsByTagName('html')[0];
    if (!document.body)
        htmlEl.appendChild(document.createElement('body'));
    window.addEventListener('load', function ()
    {
        if (htmlEl.children[2])
            htmlEl.removeChild(htmlEl.children[2]);
    });

    showLoginPopup();
}