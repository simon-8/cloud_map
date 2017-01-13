<?php
header('Content-type:text/html;Charset=UTF-8');
require __DIR__ . '/vendor/autoload.php';
use QL\QueryList;

$query = new QueryList();
$params = [
    'title' => [ '.des h2 a' , 'html'],
    'linkurl' => [ '.des h2 a' , 'href'],
];
$lists = $query::Query('http://hz.58.com/hezu/?PGTID=0d100000-0004-f85d-db6c-c28770370e01&ClickID=4' , $params ,'' , 'UTF-8');
$data = $lists->getData();

print_r($data);