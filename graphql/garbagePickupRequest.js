import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const env = JSON.parse(__ENV.OPTS)
const url = `${env.api.host + env.api.basePath.graphql}`
const userId = env.variables.user.id
const trashTypeId = env.variables.trashType.id

export const options = function () { return env.options }()

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
		"get all data for page is success": (r) => {
			const body = JSON.parse(r.body)
			const isOk = (body.errors == null)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		}
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
		"save pickup request is sucess": (r) => {
			const body = JSON.parse(r.body)
			const isOk = (body.errors == null)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		},
	})
	sleep(1)
};