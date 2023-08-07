import http from 'k6/http';
import { check, group, sleep } from 'k6';


const url = "http://localhost:8080/api/gql/graphql"
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
	]
}

export default function () {
	const query = `
		query {
			user {
				findById(id: "${userId}") {
					name, address, phone, email
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
		"get user is success": (r) => JSON.parse(r.body).errors == null
	})
	sleep(1)
};