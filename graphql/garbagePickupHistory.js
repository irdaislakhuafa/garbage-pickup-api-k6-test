import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
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