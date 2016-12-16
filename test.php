<?php
//测试案例
header("Content-type:text/html;charset=utf-8");
require 'vendor/autoload.php';
use QL\QueryList;

$rule = [
    'linkurl'=> array('td.qj-rentd a.t:eq(0)','href'),
    'thumb'=> array('div.img_list img:eq(0)','lazy_src'),
    "title"=>array('.des h2','text'),
    'price'=> array('a.t:eq(0)','text'),
    'size'=> array('span.showroom:eq(0)','text'),
    'truename'=> array('a.qj-lijjrname:eq(0)','text'),
    'area'=> array('a.a_xq1:eq(0)','text'),
    'xiaoqu'=> array('a.a_xq1:eq(1)','text'),
    'xiaoqu1' => array('a.f12:eq(0)','text'),
];
$hj = QueryList::Query('http://hz.58.com/binjiang/zufang/0/j1/?minprice=1000_2000&sourcetype=5',$rule)->data;

print_r($hj);