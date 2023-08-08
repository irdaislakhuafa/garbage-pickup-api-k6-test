import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'
const pickupId = '4445adc4-7082-4b75-af99-62789d8f7df1'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	const query = `
		query {
			pickupActivity {
				findAllByPickupId(pickupId: "${pickupId}") {
					createdAt
					description
					pickup { resi }
				}
			}
		}
	`
	const headers = {
		'Content-Type': 'application/json'
	}

	const body = JSON.stringify({ query: query })
	const res = http.post(url, body, { headers: headers })
	check(res, {
		"get all data for page is success": (r) => JSON.parse(r.body).errors == null,
	})
	sleep(1)
};