
$('#perlin_noise_color1').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:15, b:90},
	hue:200,
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#e6d7c3');


$('#perlin_noise_color2').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:20, b:40},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#665e52');

function updatePerlinNoise(){
	var color1 = rgb2hex($("#perlin_noise_color1").css("background-color"));
	var color2 = rgb2hex($("#perlin_noise_color2").css("background-color"));

	var scale = parseFloat($("#perlin_noise_scale").val());
	//var scale_y = parseFloat($("#perlin_noise_scale_y").val());
	
	var persistence = parseFloat($("#perlin_noise_detail").val());
	var percentage = 1;
	
	var seed = parseInt($("#perlin_noise_seed").val());
	var octaves = parseInt($("#perlin_noise_octaves").val());

	setPerlinNoise(color1, color2, octaves, persistence, scale, seed, percentage);
}

function setPerlinNoise(color1, color2, octaves, persistence, scale, seed, percentage)
{
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	var S = new SimplexNoise(seed);
	
	var imgData = ctx.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
	
	var col1_rgb = hexToRgb(color1);
	var col2_rgb = hexToRgb(color2);
	
	for (var i=0; i<d.length; i += 4) {
		// octaves, persistence, scale, loBound, hiBound, x, y 
		var v = S.scaled_octave_noise_2d(octaves, 1.0-persistence, 1.0 / (scale * 2), 0, 1, i/4 % max_w, i/4 / max_w);
		v = (v + 1) / 2; //interval [0,1]. 
		v = Math.min(v+(1-percentage), 1);
		d[i] = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
		d[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
		d[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
		d[i+3] = 255;
	}
	ctx.putImageData(imgData, 0, 0);
	
	
	/* one solution
	
	var imageObject=new Image();
    imageObject.onload=function(){
        
        ctx.clearRect(0,0, max_w, max_h);
        ctx.scale(scale_x, scale_y);
        ctx.drawImage(imageObject, 0, 0);
		ctx.scale(1/scale_x, 1/scale_y);
		
		var new_img_data = ctx.getImageData(0,0, max_w, max_h);
		gaussianblur(new_img_data, max_w, max_h, (scale_x-1 + scale_y-1));
		
		ctx.putImageData(new_img_data, 0, 0);
        
    }
    imageObject.src=c.toDataURL();
	*/
}