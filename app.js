import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';

const app = express();

if (!fs.existsSync('messages.json')) {
	fs.writeFileSync(JSON.stringify({ status: 'success', data: [] }, null, 4));
}
let messages = JSON.parse(
	fs.readFileSync('messages.json', { encoding: 'utf-8' })
);
let readNeeded = false;

const PORT = process.env.PORT ?? 3000;
const dateFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
	hour12: true
};

app.use(cors());
app.use(express.json());

app
	.route('/')
	.get((req, res) => {
		if (readNeeded) {
			messages = JSON.parse(
				fs.readFileSync('messages.json', { encoding: 'utf-8' })
			);
			readNeeded = false;
		}

		res.json(messages);
	})
	.post((req, res) => {
		const { author, txt } = req.body;
		let moment = new Date().toLocaleDateString('en-US', dateFormatOptions);
		const lastComma = moment.lastIndexOf(',');
		moment =
			moment.substring(0, lastComma) +
			moment.substring(lastComma + 1, moment.length);
		moment = moment.replace('\u202f', ' ');

		messages.data.push({
			id: crypto.randomUUID(),
			author,
			txt,
			moment
		});

		fs.writeFileSync('messages.json', JSON.stringify(messages, null, 4));
		readNeeded = true;

		res.sendStatus(200);
	});

app.listen(PORT);
