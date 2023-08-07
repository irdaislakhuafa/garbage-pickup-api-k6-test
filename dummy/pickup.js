import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

export const options = {
	stages: [
		{ duration: '30s', target: 100 }
	]
}

const url = "http://localhost:8080/api/gql/graphql"
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'
const trashTypeId = 'db62ce8a-d56e-4c75-8410-41f750e5542f'

export default function () {
	const now = `${Date.now()}${uuidv4()}`
	const mutation = `
		mutation {
			pickup {
				save(request: {
					userId: "${userId}"
					status: IN_QUEUE
					weight: 10
					place: "Kec. Montong, Kab. Tuban, Prov. Jawa Timur"
					trashTypeId: "${trashTypeId}"
					description: "description ${now}"
					lat: 100
					lng: 100
				}) {
					id
				}
			}
		}
	`
	let headers = {
		'Content-Type': 'application/json'
	}

	const body = JSON.stringify({ query: mutation })
	const res = http.post(url, body, { headers: headers })
	check(res, { "is ok": r => JSON.parse(r.body).errors == null })
	console.log(res.body)
};