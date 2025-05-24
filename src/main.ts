import { hello } from "./example-module";

export function main() {
	console.log(hello());
}

export function doGet() {
	return HtmlService.createHtmlOutputFromFile("index")
		.addMetaTag("viewport", "width=device-width, initial-scale=1")
		.setTitle("Vite + React + Google Apps Script");
}

export function pingPong() {
	console.log("pingPong");
	return "pong!";
}
