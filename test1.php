<?php
require 'vendor/autoload.php';
use QL\QueryList;
$rules = array(

    'title' => array('article .entry-title>a','text'),

    'linkurl' => array('article .entry-title>a','href'),

    'image' => array('article .img-rounded.wp-post-image','src'),

    'addtime' => array('article .entry-date','text')
);
$data = QueryList::Query('http://laravelacademy.org/modern-php/feature-modern-php',$rules)->data;
print_r($data);