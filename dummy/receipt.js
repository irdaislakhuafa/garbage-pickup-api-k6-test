import http from 'k6/http';
import { check, group, sleep } from 'k6';

const pickupId = '86c1b9eb-2727-49f9-a459-f468102284d4'
const url = 'http://localhost:8080/api/gql/graphql'


export default function () {
	const mutation = `
		mutation {
			receipt {
				save(request: {
					pickupId: "${pickupId}"
					status: "SUCCESS"
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
		"is ok": r => r.status == 200,
	})
};