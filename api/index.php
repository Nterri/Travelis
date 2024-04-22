<?php
require_once 'dbservice.php';

header("Access-Control-Allow-Origin: http://localhost:3006");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

echo json_encode(function_exists($_POST['action']) ? $_POST['action']($_POST) : ['result' => [], 'message' => 'Ошибка на стороне сервера! Попробуйте позже!', 'status' => false], JSON_UNESCAPED_UNICODE);
