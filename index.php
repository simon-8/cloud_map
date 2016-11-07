<?php
/*
	1.批量采集列表，获取指定范围内可以获取的链接
	2.根据链接获取指定的 租金 房屋类型 朝向 所在区域和小区
	3.组成相应数组  保存至csv文件
*/
error_reporting(E_ERROR | E_WARNING);
set_time_limit(0);
$start = explode(' ',microtime());
header('Chartset:utf-8');

echo '当前内存使用量'.(memory_get_usage()/1024).'kb <br/>';
if(1 == 1 || !is_file('data.txt')){
	include dirname(__FILE__).'/simple_html_dom.php';
	$csv = fopen('./data.csv','a');
	for($i=1;$i<20;$i++){
		// $url = 'http://hz.58.com/binjiang/zufang/0/j1'.( ($i>1) ? '/pn'.($i) : '' ).'/?minprice=1000_2000&sourcetype=5';//滨江个人整组
		$url = 'http://hz.58.com/binjiang/chuzu/0/'.( ($i>1) ? '/pn'.($i) : '' ).'/?minprice=1000_2000&PGTID=0d3090a7-0005-5d3f-434b-a9572dd54eff&ClickID='.mt_rand(1,9);//不限单间
		echo $url."<br/>";
		// $html = null;
		$html = file_get_html($url);
		$html = $html->find('table.tbimg tr');
		foreach($html as $k => $tr){
			$v['linkurl'] = $tr->find('td.qj-rentd a.t',0)->attr['href'];
			$v['thumb'] = $tr->find('div.img_list img',0)->attr['lazy_src'];
			$v['title'] = $tr->find('a.t',0)->innertext;
			$v['price'] = $tr->find('b.pri',0)->innertext;
			$v['size'] = $tr->find('span.showroom',0)->innertext;
			$v['truename'] = $tr->find('a.qj-lijjrname',0)->innertext;
			$v['area'] = $tr->find('a.a_xq1',0)->innertext;
			$v['xiaoqu'] = $tr->find('a.a_xq1',1)->innertext ? $tr->find('a.a_xq1',1)->innertext : $tr->find('a.f12',0)->innertext;
/*			$v['linkurl'] = $tr->find('td.qj-rentd a.t',0)->attr['href'];
			$content = file_get_html($v['linkurl']);
			$v['title'] = trim($content->find('h1.main-title',0)->plaintext);
			$v['thumb'] = $content->find('li#xtu_1 img',0)->attr['lazy_src'];
			$v['price'] = $content->find('em.house-price',0)->plaintext;
			$v['pay_method'] = preg_replace('/\s+/','',$content->find('span.pay-method',0)->plaintext);
			$v['xiaoqu'] = preg_replace('/\s+/','',$content->find('div.xiaoqu',0)->plaintext);
			$v['peizhi'] = preg_replace('/\s+/','',$content->find('li.person-config',0)->plaintext);
			$content->clear();*/

			fputcsv($csv, $v);
			$data[] = $v;
		}
		// $html->clear();
	}
	fclose($csv);
	echo '当前内存使用量'.(memory_get_usage()/1024).'kb <br/>';
	// unset($dom);
	// unset($content);
	echo '<pre>';
	// print_r($data);
	file_put_contents('./data.txt', '<?php return '.var_export($data,true).';\n?>');
	
	$data = null;
}else{
	echo '当前内存使用量'.(memory_get_usage()/1024).'kb <br/>';
	// unset($dom);
	// unset($content);
	echo '<pre>';
	print_r($data);
	$data = file_get_contents('data.txt');

}




// $dom->clear();
// echo '<pre>';
// print_r($data);
// foreach

$end = explode(' ',microtime());
echo ($end[0]+$end[1])-($start[0]+$start[1]).'\n';
echo '当前内存使用量'.(memory_get_usage()/1024).'kb <br/>';
exit();


?>