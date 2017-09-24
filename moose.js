#!/usr/bin/env node

const reladate = require('relative-date'),
         https = require('https');

const mooseShade = {
    0: '\x1b[47m░',
    1: '\x1b[47m▒',
    2: '\x1b[47m▓',
    3: '█',
    4: '\x1b[40m▓',
    5: '\x1b[40m▒',
    6: '\x1b[40m░',
};

const mooseColor = {
	0: ['white',  '37'], 
	1: ['black',  '30'], 
	2: ['navy',   '34'], 
	3: ['green',  '32'],
	4: ['red',    '91'],
	5: ['brown',  '31'],
	6: ['purple', '35'],
	7: ['olive',  '33'],
	8: ['yellow', '93'],
	9: ['lime',   '92'],
	a: ['teal',   '36'],
	b: ['cyan',   '96'],
	c: ['blue',   '94'],
	d: ['pink',   '95'],
	e: ['gray',   '90'],
	f: ['silver', '37'],
};

var moose,
    path = process.argv.slice(2).join(' ') || 'random';

https.get(`https://moose.ghetty.space/moose/${path}`, (res) => {
	let data = '';

	res.on('data', (chunk) => {
		data += chunk;
	});

	res.on('end', () => {
		moose = JSON.parse(data);
		if (moose.status) {
			console.log(`${moose.status + ': ' + moose.msg}`)
			process.exit(0);
		}
		parseMoose(moose);
		console.log(moose.name);
		console.log('Created ' + reladate(new Date(moose.created)));
	});

}).on('error', (err) => {
	console.log(err.message);
});

var parseMoose = (moose) => {
	var shade = moose.shade.split('\n'),
	    image = moose.image.split('\n'),
	     date = moose.date,
	     name = moose.name;

	image.map((e, i) => {
		var lineShade = shade[i],
			line = e,
			thisLine = '';

		line.split('').map((charColor, ind) => {
			var thisChar = '',
			    charShade = lineShade ? lineShade[ind] : 3;
			if (charColor == 't') thisChar += ' ';
			else thisChar += `\x1b[${mooseColor[charColor][1]}m` + mooseShade[charShade];
			thisLine += thisChar;
		});

		if (thisLine != false)
			console.log(thisLine + '\x1b[0m');
	});

}

