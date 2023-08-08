import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'
const pickupId = '86c1b9eb-2727-49f9-a459-f468102284d4'

export const options = {
	stages: [
		{ duration: '30s', target: 100 }
	]
}

export default function () {
	const now = Date.now()
	const mutation = `
		mutation {
			pickupActivity {
				save(request: {
					pickupId: "${pickupId}"
					description: "${now}"
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