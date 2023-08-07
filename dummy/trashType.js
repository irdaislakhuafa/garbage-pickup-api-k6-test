import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
export const options = {
	stages: [
		{ duration: '30s', target: 100 }
	]
}
export default function () {
	const now = `${Date.now()}${uuidv4()}`
	const mutation = `
		mutation {
			trashType {
				save(request: {
					name: "trash${now}"
					description: "description${now}"
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
	check(res, {
		"ok": r => JSON.parse(r.body).errors == null
	})
};