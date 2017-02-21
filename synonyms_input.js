var fs = require("fs");
var articoli_out = './output_data/articoli_out.txt';
var outputFile = './input_data/input_tags.txt';

gracefulFs.gracefulify(fs);

fs.readFile(id_title_seeds, function(err_id_title_seeds, data_id_title_seeds){
	if(err_id_title_seeds){
		console.log(err_id_title_seeds);
	}
	var obj_id_title_seeds = JSON.parse(data_id_title_seeds.toString());

	fs.readFile(mapping, function(err_mapping, data_mapping){
		if(err_mapping){
			console.log(err_mapping);
		}

		var array_mapping = data_mapping.toString().split('\n');
		var map_mapping = new Object();
		for(var i = 0; i<array_mapping.length; i++){
			array_mapping[i] = array_mapping[i].split('\t');
			map_mapping[array_mapping[i][0]] = array_mapping[i][1];
		}

		fs.readFile(articoli_out, function(err_articoli_out, data_articoli_out){
			if(err_articoli_out){
				console.log(err_articoli_out);
			}

			var obj_artioli_out = JSON.parse(data_articoli_out.toString());

			for(var i = 0; i<obj_artioli_out.length; i++){
				obj_id_title_seeds[i].pe = obj_artioli_out[i].pe;
				obj_id_title_seeds[i].se = obj_artioli_out[i].se;
				obj_id_title_seeds[i].notable = map_mapping[obj_id_title_seeds[i].title];
			}
			fs.writeFile(outputFile, JSON.stringify(obj_id_title_seeds));
		})
	})

})
