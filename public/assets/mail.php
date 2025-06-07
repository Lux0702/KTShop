<?php
// ✅ BẮT BUỘC: KHÔNG được có dòng trống hoặc khoảng trắng trước dòng này
header("Access-Control-Allow-Origin: *");
echo "CORS test success";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// ✅ Cho phép preflight request (CORS OPTIONS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name    = isset($_POST["name"]) ? trim($_POST["name"]) : "";
    $name_2  = isset($_POST["l_name"]) ? trim($_POST["l_name"]) : "";
    $email   = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : "";
    $subject = isset($_POST["subject"]) ? trim($_POST["subject"]) : "";
    $phone   = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
    $company = isset($_POST["company"]) ? trim($_POST["company"]) : "";
    $message = isset($_POST["message"]) ? trim($_POST["message"]) : "";

    if (
        empty($name) || empty($name_2) || empty($subject) || empty($message) ||
        empty($phone) || empty($company) || !filter_var($email, FILTER_VALIDATE_EMAIL)
    ) {
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    $recipient = "thanhsang8a1@gmail.com";
    $sender = "New contact from $name";
    $email_content = "/// Theme_Pure Shofy HTML \\\ \n\n";
    $email_content .= "Name: {$name} {$name_2}\n";
    $email_content .= "Email: {$email}\n";
    $email_content .= "Subject: {$subject}\n";
    $email_content .= "Company: {$company}\n";
    $email_content .= "Phone: {$phone}\n\n";
    $email_content .= "Message:\n{$message}\n";
    $email_headers = "From: {$name} {$name_2} <{$email}>";

    if (mail($recipient, $sender, $email_content, $email_headers)) {
        http_response_code(200);
        echo "Thank You! Your message has been sent.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }

} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
