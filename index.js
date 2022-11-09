const cheerio = require('cheerio');
const { default: fetch, Headers } = require("node-fetch-cjs");
const fs = require('fs');
let url = 'https://www.google.com/search?q=fish'
let agent  = 'Crawlerator/1.0 (https://github.com/EnZon3/crawlerator)';
let cycle = 0
let linksFetched = 0;
let errors = 0;

// recursive function fetching links from url
function fetchLinks(url) {
	linksFetched++;
	fetch(url, {UserAgent: agent})
	.then(response => response.text())
	.then(text => {
		let $ = cheerio.load(text);
		let links = $('a');
		// get an array of all of the links
		// write links to file then call function for each link
		for (let i = 0; i < links.length; i++) {
			let link = links[i].attribs.href;
			//if link is undefined skip
			if (link === undefined) {
				console.log("skipping link");
				continue;
			}
			if (!link.match(/^(https?|ftp):\/\//)) {
				continue;
			}
			fs.appendFileSync(`${__dirname}/links.txt`, link + '\n');
			fetchLinks(link);
		}
		cycle++;
		console.log(`${cycle} cycles (T), ${linksFetched} links fetched (T). Errors (T): ${errors}. Links (C): ${links.length}`);
	})
	.catch(err => {
		errors++;
	})
}

fetchLinks(url);