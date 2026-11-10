<?php
// Contact form handler. Configure the recipient after the first draft.
header('Content-Type: application/json');

$to   = 'you@example.com';          // TODO: set real recipient
$from = 'no-reply@yourdomain.com';  // TODO: an address on your domain (helps deliverability)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Invalid request.']); exit; }
if (!empty($_POST['website'])) { echo json_encode(['ok'=>true]); exit; } // honeypot: silently drop bots

$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim($_POST['email'] ?? '');
$message = trim(strip_tags($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['ok'=>false,'error'=>'Please complete all fields with a valid email.']); exit;
}

$name = str_replace(["\r","\n"], ' ', $name); // block header injection
$headers = "From: $from\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$body = "Name: $name\nEmail: $email\n\n$message\n";

$sent = @mail($to, 'Website enquiry from ' . $name, $body, $headers);
echo json_encode($sent ? ['ok'=>true] : ['ok'=>false,'error'=>'Mail could not be sent. Please use LinkedIn.']);
