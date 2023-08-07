import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
	]
}

export default function () {
	const mutation = `
		mutation {
			user {
				login(
					request: {
						email: "exampleuser@gmail.com"
						password: "exampleuser"
						lat: 150
						lng: 150
					}
					) {
						token
					}
				}
		}
	`

	const headers = {
		'Content-Type': 'application/json'
	}

	const body = JSON.stringify({ query: mutation })
	let res = http.post(url, body, { headers: headers })
	check(res, {
		"login success": (r) => JSON.parse(r.body).errors == null,
	})
	sleep(1)
};