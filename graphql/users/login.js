import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"

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
};