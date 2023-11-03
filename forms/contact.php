<?php
/*
 *  CONFIGURE EVERYTHING HERE
 */

// an email address that will be in the From field of the email.
$from = 'Demo contact form <demo@domain.com>';

// an email address that will receive the email with the output of the form
$sendTo = 'selwyn.rollorata@carsu.edu.ph';

// subject of the email
$subject = 'New message from contact form';

// form field names and their translations.
// array variable name => Text to appear in the email
$fields = array('name' => 'Name', 'subject' => 'Subject', 'email' => 'Email', 'message' => 'Message');

// message that will be displayed when everything is OK :)
$okMessage = 'Contact form successfully submitted. Thank you, I will get back to you soon!';

// If something goes wrong, we will display this message.
$errorMessage = 'There was an error while submitting the form. Please try again later';

/*
 *  LET'S DO THE SENDING
 */

// if you are not debugging and don't need error reporting, turn this off by error_reporting(0);
error_reporting(E_ALL & ~E_NOTICE);

try {

  if (count($_POST) == 0) throw new \Exception('Form is empty');

  $emailText = "You have a new message from your contact form\n=============================\n";

  foreach ($_POST as $key => $value) {
    // If the field exists in the $fields array, include it in the email 
    if (isset($fields[$key])) {
      $emailText .= "$fields[$key]: $value\n";
    }
  }

  // All the necessary headers for the email.
  $headers = array(
    'Content-Type: text/plain; charset="UTF-8";',
    'From: ' . $from,
    'Reply-To: ' . $_POST['email'],
    'Return-Path: ' . $from,
  );

  // Send email
  mail($sendTo, $subject, $emailText, implode("\n", $headers));

  $responseArray = array('type' => 'success', 'message' => $okMessage);
} catch (\Exception $e) {
  $responseArray = array('type' => 'danger', 'message' => $errorMessage);
}


// if requested by AJAX request return JSON response
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
  $encoded = json_encode($responseArray);

  header('Content-Type: application/json');

  echo $encoded;
}
// else just display the message
else {
  echo $responseArray['message'];
}
/**
 * Requires the "PHP Email Form" library
 * The "PHP Email Form" library is available only in the pro version of the template
 * The library should be uploaded to: vendor/php-email-form/php-email-form.php
 * For more info and help: https://bootstrapmade.com/php-email-form/
 */

// Replace contact@example.com with your real receiving email address
// $receiving_email_address = 'selwynrollorata14@gmail.com';

// if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
//   include( $php_email_form );
// } else {
//   die( 'Unable to load the "PHP Email Form" Library!');
// }

// $contact = new PHP_Email_Form;
// $contact->ajax = true;

// $contact->to = $receiving_email_address;
// $contact->from_name = $_POST['name'];
// $contact->from_email = $_POST['email'];
// $contact->subject = $_POST['subject'];

// Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
/*
  $contact->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
  );
  */

// $contact->add_message( $_POST['name'], 'From');
// $contact->add_message( $_POST['email'], 'Email');
// $contact->add_message( $_POST['message'], 'Message', 10);

// echo $contact->send();

// $to = 'selwynrollorata14@gmail.com';
// $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
// $from = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
// $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_SPECIAL_CHARS);
// $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

// if (filter_var($from, FILTER_VALIDATE_EMAIL)) {
//   $headers = [
//     'From' => ($name ? "<$name> " : '') . $from,
//     'X-Mailer' => 'PHP/' . phpversion()
//   ];

//   mail($to, $subject, $message . "\r\n\r\nfrom: " . $_SERVER['REMOTE_ADDR'], $headers);
//   die('OK');
// } else {
//   die('Invalid address');
// }
