import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'
const pickupId = '919a3966-b217-46bd-afd7-4f5e00c2853d'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
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
};