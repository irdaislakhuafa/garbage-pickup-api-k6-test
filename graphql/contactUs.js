import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"

export const options = {
	stages: [
		{ duration: '1m', vus: 1000, target: 1000 }
	]
}


export default function () {
	const query = `
		query {
			contactUs {
				findAll { image, title, value }
			}
		}
	`
	const body = JSON.stringify({ query: query })
	let headers = {
		'Content-Type': 'application/json'
	}
	const res = http.post(url, body, { headers: headers })
	check(res, {
		"get all data for page is success": (r) => JSON.parse(r.body).errors == null
	})
	sleep(1)
};