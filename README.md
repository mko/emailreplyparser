# Email Reply Parser

Node.js port of Github's EmailReplyParser, a small library to parse plain text email content.


## Known Issues
<small>(Taken from Github's version)</small>

### Quoted Headers

Quoted headers aren't picked up if there's an extra line break:

    On <date>, <author> wrote:

    > blah

Also, they're not picked up if the email client breaks it up into
multiple lines.  GMail breaks up any lines over 80 characters for you.

    On <date>, <author>
    wrote:
    > blah

Not to mention that we're search for "on" and "wrote".  It won't work
with other languages.

Possible solution: Remove "reply@reply.github.com" lines...

### Weird Signatures

Lines starting with `-` or `_` sometimes mark the beginning of
signatures:

    Hello

    --
    Rick

Not everyone follows this convention:

    Hello

    Mr Rick Olson
    Galactic President Superstar Mc Awesomeville
    GitHub

    **********************DISCLAIMER***********************************
    * Note: blah blah blah                                            *
    **********************DISCLAIMER***********************************



### Strange Quoting

Apparently, prefixing lines with `>` isn't universal either:

    Hello

    --
    Rick

    ________________________________________
    From: Bob [reply@reply.github.com]
    Sent: Monday, March 14, 2011 6:16 PM
    To: Rick


### To run the tests
* Install nodeunit  `npm install nodeunit`
* Run the tests:   `nodeunit test/email_reply_parser_test.js`