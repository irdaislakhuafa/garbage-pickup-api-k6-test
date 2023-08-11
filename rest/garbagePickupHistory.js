import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';


const host = 'http://localhost:8080';
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
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
	sleep(Number(env.runner.sleep))
};