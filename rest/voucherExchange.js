import http from 'k6/http';
import { check, group, sleep } from 'k6';

const host = 'http://localhost:8080'
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '3m', vus: 1000, target: 1000 }
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