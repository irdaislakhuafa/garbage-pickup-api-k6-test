import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

export const options = {
	stages: [
		{ duration: '30s', target: 100 }
	]
}

const url = "http://localhost:8080/api/gql/graphql"
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'
const trashTypeId = '3b0b0118-5ed8-4823-bceb-caab5f1f8f9c'

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
	check(res, {
		"is ok": r => {
			const body = JSON.parse(r.body)
			const isOk = (body.errors == null)
			if (!isOk) {
				console.log(body.errors)
			}
			return isOk
		}
	})
};