<?php
header('Charset = UTF-8');
require 'vendor/autoload.php';
use QL\QueryList;

$hj = QueryList::Query('http://hz.58.com/binjiang/zufang/0/j1/?minprice=1000_2000&sourcetype=5',array("title"=>array('.des h2','text')));
$data = $hj->getData(function($x){
    return $x['title'];
});
print_r($data);