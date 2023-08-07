import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '1m', vus: 1000, target: 1000 }
	]
}

export default function () {
	const query = `
		query {
			pickup {
				findAllByUserIdWithRangeDate(request: {
					userId: "${userId}"
					start: "08/08/2023 00:00:00"
					end: "08/09/2023 00:00:00"
				}) {
					place status createdAt
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
		"get garbage pickup history success": (r) => JSON.parse(r.body).errors == null
	})
	sleep(1)
};