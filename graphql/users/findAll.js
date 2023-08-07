import http from 'k6/http'
import { sleep } from 'k6'

export default function () {
	// const url = `${__ENV.GRAPHQL_URL || 'http://localhost:8080/api/gql'}/graphql`
	const url = `http://localhost:8080/api/gql/graphql`

	const headers = {
		'Content-Type': 'application/json'
	}

	const body = JSON.stringify({
		query: `query {
			user {
				findAll {
					id
					name
				}
			}
		}`
	})

	const res = http.post(url, body, { headers: headers });
	sleep(1)
}