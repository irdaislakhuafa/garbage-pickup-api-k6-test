import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const host = 'http://localhost:8080'
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	let url = `${host}/api/rest/users/${userId}`
	let headers = {
		'Content-Type': 'application/json'
	}

	// get data user
	let res = http.get(url)
	check(res, {
		"get user success": (r) => r.status === 200,
	})

	// get available voucher
	url = `${host}/api/rest/userVouchers/vouchers`
	let body = JSON.stringify({
		userId: `${userId}`,
		statuses: []
	})

	res = http.post(url, body, { headers: headers })
	check(res, {
		"get available user voucher success": (r) => r.status === 200,
	})
	sleep(1)
};
