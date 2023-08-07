import http from 'k6/http';
import { check, group, sleep } from 'k6';


const host = 'http://localhost:8080';
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
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
};