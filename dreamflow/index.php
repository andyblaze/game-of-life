<?php 
require '../utils.php';
$crud = new JsonCrud('../gallery-data/data.json');
$page = $crud->read(pageSlug());
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title><?=$page->data->page_title;?></title>
<meta name="description" content="<?=$page->data->description;?>" />
<meta name="keywords" content="<?=$page->data->keywords;?>" />
<link rel="canonical" href="<?=BASE_URL . pageSlug();?>" />
<?=ogMetaData($page->data->og) . 
twitterMetaData($page->data->og);?>
<style>
html,body {
    height:100%;
    margin:0;
    background:#050507;
    color:#eaf2ff;
    font-family:system-ui,Segoe UI,Roboto,Arial;
}
canvas {
    display:block;
    width:100%;
    height:100vh
}
</style>
</head>
<body>
<input id="dif" type="hidden"value="26" />
<input id="adv" type="hidden" value="40" />
<input id="dmp" type="hidden" value="8" />
<input id="exc" type="hidden" value="12" />
<input id="fde" type="hidden" value="90" />
<input id="gridW" type="hidden" value="480" />
<input id="gridH" type="hidden" value="270" />

<canvas id="onscreen"></canvas>

<script type="module" src="main.js"></script>
</body>
</html>
