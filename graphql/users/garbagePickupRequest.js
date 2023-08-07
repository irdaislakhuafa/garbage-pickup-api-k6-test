import http from 'k6/http';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'
const trashTypeId = 'ad2f2515-597e-404b-bb78-2c143003467b'


export default function () {
	const query = `
		query {
			trashType {
				findAll { id name }
			}
			userVoucher {
				findAllByUserIdAndStatus(request: {
					userId: "${userId}"
					statuses: [ CLAIMED ]
				}) {
					id
					voucher { title, image }
				}
			}
		}
	`
	let body = JSON.stringify({ query: query })
	const headers = {
		'Content-Type': 'application/json'
	}
	let res = http.post(url, body, { headers: headers })
	check(res, {
		"get all data for page is success": (r) => JSON.parse(r.body).errors == null,
	})

	const now = Date.now()
	const mutation = `
		mutation {
			pickup {
				save(request: {
					userId: "${userId}"
					status: IN_QUEUE
					weight: 5 #in KG
					place: "Kec. Montong, Kab. Tuban, Prov. Jawa Timur"
					trashTypeId: "${trashTypeId}"
					description: "This is description ${now}"
					lat: 10.5
					lng: -10.5
				}) {
					id
				}
			}
		}
	`
	body = JSON.stringify({ query: mutation })
	res = http.post(url, body, { headers: headers })
	check(res, {
		"save pickup request is sucess": (r) => JSON.parse(r.body).errors == null,
	})
};