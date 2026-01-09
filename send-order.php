<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$envPath = __DIR__ . '/../.env'; 
if (!file_exists($envPath)) {
    $envPath = __DIR__ . '/.env';
}

$env = @parse_ini_file($envPath);
$token = $env['TELEGRAM_BOT_TOKEN'] ?? '';
$chat_id = $env['TELEGRAM_CHAT_ID'] ?? '';

if (!$token || !$chat_id) {
    echo json_encode(['success' => false, 'error' => 'Server configuration error (Token/ChatID missing)']);
    exit;
}

$name    = htmlspecialchars($data['name'] ?? 'Аноним');
$phone   = htmlspecialchars($data['phone'] ?? 'Не указан');
$email   = htmlspecialchars($data['email'] ?? 'Не указан');
$message = htmlspecialchars($data['message'] ?? 'Без сообщения');

$text = "<b>🍰 Новый заказ: Candor</b>\n\n";
$text .= "👤 <b>Имя:</b> $name\n";
$text .= "📞 <b>Телефон:</b> <code>$phone</code>\n";
$text .= "📧 <b>Email:</b> $email\n";
$text .= "📝 <b>Текст:</b> <i>$message</i>";

$url = "https://api.telegram.org/bot{$token}/sendMessage";

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => http_build_query([
            'chat_id' => $chat_id,
            'text' => $text,
            'parse_mode' => 'HTML'
        ]),
        'ignore_errors' => true
    ]
];

$context  = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === false) {
    echo json_encode(['success' => false, 'error' => 'Failed to connect to Telegram']);
} else {
    $resData = json_decode($response, true);
    if (isset($resData['ok']) && $resData['ok'] === true) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode([
            'success' => false, 
            'error' => 'Telegram API Error', 
            'details' => $resData['description'] ?? 'Unknown'
        ]);
    }
}
?>
