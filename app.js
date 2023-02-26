import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';

const app = express();
const messages = JSON.parse(
	fs.readFileSync('messages.json', { encoding: 'utf-8' })
);
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
		const data = fs.readFileSync('messages.json', { encoding: 'utf-8' });

		res.json(JSON.parse(data));
	})
	.post((req, res) => {
		const { author, txt } = req.body;
		let moment = new Date().toLocaleDateString('en-US', dateFormatOptions);
		const lastComma = moment.lastIndexOf(',');
		moment =
			moment.substring(0, lastComma) +
			moment.substring(lastComma + 1, moment.length);
		moment.replace('\u202f', ' ');

		messages.data.push({
			id: crypto.randomUUID(),
			author,
			txt,
			moment
		});
		fs.writeFileSync('messages.json', JSON.stringify(messages));

		res.sendStatus(200);
	});

app.listen(PORT);
