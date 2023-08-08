import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const url = "http://localhost:8080/api/gql/graphql"
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'
const trashTypeId = '3b0b0118-5ed8-4823-bceb-caab5f1f8f9c'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

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
	sleep(1)
};