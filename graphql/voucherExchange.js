import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'

export default function () {
	const query = `
		query {
			user {
				findById(id: "${userId}") { point }
			}
			userVoucher {
				findAllByUserIdAndStatus(request: {
					userId: "${userId}"
					statuses: []
				}) {
					voucher { title, image, pointsNeeded }
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
		"get all data for page success": (r) => JSON.parse(r.body).errors == null,
	})
};