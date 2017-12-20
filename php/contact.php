<?php

if(empty($_POST['from_email']))
{
	echo "0";
	exit;
}

$yourEmail = "your-email@info.com";
$yourSiteName = "http://www.your-site.com";

$inputs['yousite'] = $yourSiteName;
$inputs['to_email'] = $yourEmail;
$inputs['from_email'] = $_POST['from_email'];
$inputs['subject'] = $_POST['subject'];
$inputs['message'] = nl2br($_POST['message']);

mail_send($inputs);

function mail_send($p)
{
    if (!isset($p['to_email'], $p['from_email'], $p['subject'], $p['message'])) {
        echo "0";
		return;
    }

    $to	= empty($p['to_name']) ? $p['to_email'] : '"' . mb_encode_mimeheader($p['to_name']) . '" <' . $p['to_email'] . '>';
    $from = empty($p['from_name']) ? $p['from_email'] : '"' . mb_encode_mimeheader($p['from_name']) . '" <' . $p['from_email'] . '>';

    $headers = array
    (
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset="UTF-8";',
        'Content-Transfer-Encoding: 7bit',
        'Date: ' . date('r', $_SERVER['REQUEST_TIME']),
        'Message-ID: <' . $_SERVER['REQUEST_TIME'] . md5($_SERVER['REQUEST_TIME']) . '@' . $_SERVER['SERVER_NAME'] . '>',
        'From: ' . $from,
        'Reply-To: ' . $from,
        'Return-Path: ' . $from,
        'X-Mailer: PHP v' . phpversion(),
        'X-Originating-IP: ' . $_SERVER['SERVER_ADDR'],
    );

    $emailBody = "A visitor to ".$p['yousite']." has left the following message:<br/>Sent By: "
                 .$p['from_email']."<br/><br/>Message Sent:<br/>".$p['message']."<br/>";
    $message = $emailBody;

    $ok = mail($to, '=?UTF-8?B?' . base64_encode($p['subject']) . '?=', $message, implode("\n", $headers));
	echo $ok ? "1" : "0";
}

?>