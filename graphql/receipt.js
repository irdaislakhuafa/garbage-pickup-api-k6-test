import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'
const pickupId = '23b26b34-31a7-452a-8600-1663bdabdf8b'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	const query = `
		query {
			receipt {
				findByPickupId(pickupId: "${pickupId}") {
					pickup { price, weight }
					status
					createdAt
					point
				}
			}
		}
	`
	const body = JSON.stringify({ query: query })
	const headers = {
		'Content-Type': 'application/json'
	}
	const res = http.post(url, body, { headers: headers })
	check(res, {
		"get all data for page is success": (r) => JSON.parse(r.body).errors == null
	})
	sleep(1)
};