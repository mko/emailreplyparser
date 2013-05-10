var fs = require('fs');

var _  = require('underscore');

var EmailReplyParser = require('../lib/emailreplyparser').EmailReplyParser;

function get_email(name) {
	var data = fs.readFileSync(__dirname + '/emails/' + name + '.txt', 'ascii');

	return EmailReplyParser.read(data);
}

function get_raw_email(name) {
  	return fs.readFileSync(__dirname + '/emails/' + name + '.txt', 'ascii');
}

exports.test_reads_simple_body = function(test){
    reply = get_email('email_1_1');
    test.equal(3, reply.fragments.length);

	test.deepEqual([false, false, false], _.map(reply.fragments, function(f) { return f.quoted; }));
	test.deepEqual([false, true, true], _.map(reply.fragments, function(f) { return f.signature; }));
	test.deepEqual([false, true, true], _.map(reply.fragments, function(f) { return f.hidden; }));

    test.equal("Hi folks\n\nWhat is the best way to clear a Riak bucket of all key, values after\nrunning a test?\nI am currently using the Java HTTP API.\n", reply.fragments[0].to_s());

    test.equal("-Abhishek Kona\n\n", reply.fragments[1].to_s());
	test.done();
}

exports.test_reads_top_post = function(test){
    reply = get_email('email_1_3');
    test.equal(5, reply.fragments.length);

    test.deepEqual([false, false, true, false, false], _.map(reply.fragments, function(f) { return f.quoted; }));
    test.deepEqual([false, true, true, true, true], _.map(reply.fragments, function(f) { return f.hidden; }));
    test.deepEqual([false, true, false, false, true], _.map(reply.fragments, function(f) { return f.signature; }));

    test.ok((new RegExp('^Oh thanks.\n\nHaving')).test(reply.fragments[0].to_s()));
    test.ok((new RegExp('^-A')).test(reply.fragments[1].to_s()));
    test.ok((/^On [^\:]+\:/m).test(reply.fragments[2].to_s()));
    test.ok((new RegExp('^_')).test(reply.fragments[4].to_s()));
    test.done();
}

exports.test_reads_bottom_post = function(test){
    reply = get_email('email_1_2');
    test.equal(6, reply.fragments.length);

    test.deepEqual([false, true, false, true, false, false], _.map(reply.fragments, function(f) { return f.quoted; }));
    test.deepEqual([false, false, false, false, false, true], _.map(reply.fragments, function(f) { return f.signature; }));
    test.deepEqual([false, false, false, true, true, true], _.map(reply.fragments, function(f) { return f.hidden; }));

    test.equal("Hi,", reply.fragments[0].to_s());
    test.ok((new RegExp('^On [^\:]+\:')).test(reply.fragments[1].to_s()));
    test.ok((/^You can list/m).test(reply.fragments[2].to_s()));
    test.ok((/^> /m).test(reply.fragments[3].to_s()));
    test.ok((new RegExp('^_')).test(reply.fragments[5].to_s()));
    test.done();
}

exports.test_recognizes_date_string_above_quote = function(test){
    reply = get_email('email_1_4');

    test.ok((/^Awesome/).test(reply.fragments[0].to_s()));
    test.ok((/^On/m).test(reply.fragments[1].to_s()));
    test.ok((/Loader/m).test(reply.fragments[1].to_s()));
    test.done();
}

exports.test_a_complex_body_with_only_one_fragment = function(test){
    reply = get_email('email_1_5');

    test.equal(1, reply.fragments.length);
    test.done();
}

exports.test_reads_email_with_correct_signature = function(test){
    reply = get_email('correct_sig');

    test.equal(2, reply.fragments.length);

    test.deepEqual([false, false], _.map(reply.fragments, function(f) { return f.quoted; }));
	test.deepEqual([false, true], _.map(reply.fragments, function(f) { return f.signature; }));
	test.deepEqual([false, true], _.map(reply.fragments, function(f) { return f.hidden; }));

    test.ok((new RegExp('^-- \nrick')).test(reply.fragments[1].to_s()));
    test.done();
}

exports.test_deals_with_multiline_reply_headers = function(test){
    reply = get_email('email_1_6');

    test.ok((new RegExp('^I get')).test(reply.fragments[0].to_s()));
    test.ok((/^On/m).test(reply.fragments[1].to_s()));
    test.ok((new RegExp('Was this')).test(reply.fragments[1].to_s()));
    test.done();
}

exports.test_does_not_modify_input_string = function(test){
    original = "The Quick Brown Fox Jumps Over The Lazy Dog";
    EmailReplyParser.read(original);
    test.equal("The Quick Brown Fox Jumps Over The Lazy Dog", original);
    test.done();
}

exports.test_returns_only_the_visible_fragments_as_a_string = function(test){
    reply = get_email('email_2_1');

	String.prototype.rtrim = function() {
		return this.replace(/\s*$/g, "");
	}

	var fragments = _.select(reply.fragments, function(f) { return !f.hidden; });
	var fragments = _.map(fragments, function(f) { return f.to_s(); });
    test.equal(fragments.join("\n").rtrim(), reply.visible_text());
    test.done();
}

exports.test_parse_out_just_top_for_outlook_reply = function(test){
    body = get_raw_email('email_2_1');
    test.equal("Outlook with a reply", EmailReplyParser.parse_reply(body));
    test.done();
}

exports.test_parse_out_sent_from_iPhone = function(test){
    body = get_raw_email('email_iPhone');
    test.equal("Here is another email", EmailReplyParser.parse_reply(body));
    test.done();
}

exports.test_parse_out_sent_from_BlackBerry = function(test){
    body = get_raw_email('email_BlackBerry');
    test.equal("Here is another email", EmailReplyParser.parse_reply(body));
    test.done();
}

exports.test_parse_out_send_from_multiword_mobile_device = function(test){
    body = get_raw_email('email_multi_word_sent_from_my_mobile_device');
    test.equal("Here is another email", EmailReplyParser.parse_reply(body));
    test.done();
}

exports.test_do_not_parse_out_send_from_in_regular_sentence = function(test){
    body = get_raw_email('email_sent_from_my_not_signature');
    test.equal("Here is another email\n\nSent from my desk, is much easier then my mobile phone.", EmailReplyParser.parse_reply(body));
    test.done();
}

exports.test_retains_bullets = function(test){
    body = get_raw_email('email_bullets');
    test.equal("test 2 this should list second\n\nand have spaces\n\nand retain this formatting\n\n\n   - how about bullets\n   - and another", EmailReplyParser.parse_reply(body));
    test.done();
}

exports.test_parse_reply = function(test){
    body = get_raw_email('email_1_2');
    test.equal(EmailReplyParser.read(body).visible_text(), EmailReplyParser.parse_reply(body));
    test.done();
}