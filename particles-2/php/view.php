<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<?=meta('viewport', 'width=device-width, initial-scale=1.0');?>
<title>Interactive Particle System - Generative Art in the Browser</title>

<?=meta('description', 'Create stunning generative art with an interactive particle system. Play with forces, trails, colors, and real-time renderers in your browser.');?>
<?=meta('keywords', 'particle system, generative art, canvas animation, interactive particles, boids, trails, HTML5 canvas, particle forces, browser art');?>
<?=meta('author', 'Ark Digital');?>
<link rel="canonical" href="<?=url();?>">
<?=meta('robots', 'index, follow');?>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="manifest" href="/site.webmanifest" />
<?=meta('theme-color', '#000000');?>

<!-- Open Graph / social preview -->
<?=meta_prop('og:title', 'Particle System - Interactive Generative Art');?>
<?=meta_prop('og:description', 'Experiment with a high-performance particle system in your browser. Trails, forces, and colorful generative effects in real time.');?>
<?=meta_prop('og:type', 'website');?>
<?=meta_prop('og:image', url('images/social-preview.jpg'));?>
<?=meta_prop('og:url', url());?> 

<?=meta_prop('twitter:card', 'summary_large_image');?>
<?=meta_prop('twitter:title', 'Particle System - Interactive Generative Art');?>
<?=meta_prop('twitter:description', 'Experiment with a high-performance particle system in your browser. Trails, forces, and colorful generative effects in real time.');?>
<?=meta_prop('twitter:image', url('images/social-preview.jpg'));?>

<?=link_tag('css/sys.css');?>
</head>
<body>
<div id="screen-warning" style="display:none;">
    <div class="modal-content">
        <h2>Heads up!</h2>
        <h3>This is a professional tool, not a widget for phones or old PCs / laptops.</h3>
        <p>Best viewed on large screens (1920×1080+). Small screens <u>WILL NOT</u> display correctly.</p>
        <p>If you can see a smooth animation then we're good, else proceed at your own risk.</p>
        <button id="continue-btn">Continue anyway</button>
    </div>
</div>
 <!-- UI panel --> 
<form id="ui-panel">
    <div class="col-2">
        <h4>Position <a class="help" data-help="Where the emitter spawns particles in the canvas.">?</a></h4>
        <?=$spawnXCtrl;?>
        <?=$spawnYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Direction <a class="help" data-help="Angle is direction. Spread is how much particles fan out.">?</a></h4>
        <?=$angleCtrl;?>
        <?=$spreadCtrl;?>
    </div>
    <div class="col-2">
        <h4>Size <a class="help" data-help="Starting and ending particle size.">?</a></h4>
        <?=$sizeStartCtrl;?>
        <?=$sizeEndCtrl;?>
    </div>    
    <div class="col-2">
        <h4>Speed <a class="help" data-help="Sets initial X/Y velocity.">?</a></h4>
        <?=$speedXCtrl;?>
        <?=$speedYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Speed variance <a class="help" data-help="Adds randomness to particle speed in X / Y directions.">?</a></h4>
        <?=$speedVarianceXCtrl;?>
        <?=$speedVarianceYCtrl;?>
    </div>
    <div class="col-2">
        <h4>Lifetime <a class="help" data-help="How long particles live, with some variation.">?</a></h4>
        <?=$lifeCtrl;?>
        <?=$lifeVarianceCtrl;?>
    </div>
    <div class="col-2">
        <h4>Spawn Offset <a class="help" data-help="Expands the X/Y area where particles spawn.">?</a></h4>
        <?=$spawnOffsetXCtrl;?>
        <?=$spawnOffsetYCtrl;?>
    </div>
    <div class="col-4">
        <h4>Colour / Alpha (Opacity)</h4>
        <?=$colorStartCtrl;?>
        <?=$colorEndCtrl;?>
        <?=$alphaStartCtrl;?>
        <?=$alphaEndCtrl;?>
    </div>
    <div class="col-2">
        <h4>Density / Trails <a class="help" data-help="Particle count. Lower background opacity makes longer trails.">?</a></h4>
        <?=$densityCtrl;?>
        <?=$bgOpacityCtrl;?>
    </div>
    <div class="col-3">
        <h4>Perlin ( Wind ) <a class="help" data-help="Adds smooth directional drift. Not so smooth at high settings !">?</a></h4>        
        <?=$perlinAmountCtrl;?>
        <?=$perlinScaleCtrl;?>
        <?=$perlinSpeedCtrl;?>
    </div>
    <div class="col-5">
        <h4>Forces <a class="help" data-help="Experiment with these. Some are strong, Boids is an FPS killer !">?</a></h4>
        <?=$boidsCtrl;?>
        <?=$repulsorCtrl;?>
        <?=$attractorCtrl;?>
        <?=$vortexCtrl;?>
        <?=$gravityCtrl;?>
    </div>
    <?=$rendererCtrl;?>
</form>
<!-- Workspace canvas -->
<div id="workspace">
    <div id="hud" title="Frames per second. / Particles on screen.">
        <div>FPS: <span id="fps-report">60</span></div>
        <div>POS: <span id="pos-report">60</span></div>
    </div>
    <div class="import-export">
        Presets: 
        <?=$importSelect;?> 
        <button id="import" type="button">Load</button>
        <?=$exportCtrls;?>
    </div>
    <div><canvas id="effect" width="820" height="820"></canvas></div>
</div>
<?=$presetItems;?>
<script src="js/main.js" type="module"></script>
</body>
</html>