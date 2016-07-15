# Email Reply Parser

Node.js port of Github's EmailReplyParser, a small library to parse plain text email content.

## Usage

``` js
var EmailReplyParser = require('emailreplyparser')

// To parse the reply from an email body
var parsed = EmailReplyParser.parse(emailBody)

// To parse the reply from an email body, preserving signatures
var parsed = EmailReplyParser.parse(emailBody, true)

// Reads in an email and produces an array of fragments.
// Each fragment represents a part of the email.
var fragments = EmailReplyParser.read(emailBody)
```

For examples, refer to the tests.

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


## To run the tests

* Install dependencies  `npm install`
* Run the tests:   `npm test`

## Upgrading to v1.0

- The `EmailReplyParser` is now exported directly. If upgrading from pre 1.0, change the following:

``` js
var EmailReplyParser = require('emailreplyparser').EmailReplyParser
```

to:

``` js
var EmailReplyParser = require('emailreplyparser')
```

- The `parse_reply` function is now called `parse`.
- The module no longer adds any methods to the `String` prototype. If your code was relying on the `trim`, `ltrim`, `strim`, `gsub`, `reverse` or `chomp` methods to be available on the prototype, you'll need to make changes.
