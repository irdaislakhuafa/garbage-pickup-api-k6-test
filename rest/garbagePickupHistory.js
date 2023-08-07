import http from 'k6/http';
import { check, group, sleep } from 'k6';


const host = 'http://localhost:8080';
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '1m', vus: 1000, target: 1000 }
	]
}

export default function () {
	const url = `${host}/api/rest/pickups/users`
	let headers = {
		'Content-Type': 'application/json'
	}

	let body = JSON.stringify({
		userId: `${userId}`,
		start: "04/08/2023 00:00:00",
		end: "04/09/2023 00:00:00",
		statuses: []
	})

	let res = http.post(url, body, { headers: headers })
	check(res, {
		"get list activity history success": (r) => r.status === 200,
	})
	sleep(1)
};