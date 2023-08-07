import { check, sleep } from "k6";
import http from "k6/http";

const host = 'http://localhost:8080';
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
	]
}

export default function () {
	const user = http.get(`${host}/api/rest/users/${userId}`)
	check(user, {
		"get user success": (r) => r.status == 200,
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
		"get list pickup user success": (r) => r.status === 200,
	})
	sleep(1)
}