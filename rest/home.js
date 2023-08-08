import { check, sleep } from "k6";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import http from "k6/http";

const host = 'http://localhost:8080';
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	const user = http.get(`${host}/api/rest/users/${userId}`)
	check(user, {
		"get user success": (r) => {
			const isOk = (r.status == 200)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		},
	})

	let headers = {
		'Content-Type': 'application/json'
	}
	let body = JSON.stringify({
		userId: `${userId}`,
		start: "04/08/2023 00:00:00",
		end: "04/09/2023 00:00:00",
		statuses: []
	})

	const listPickupUser = http.post(`${host}/api/rest/pickups/users`, body, { headers: headers })
	check(listPickupUser, {
		"get list pickup user success": (r) => {
			const isOk = (r.status == 200)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		},
	})
	sleep(1)
}