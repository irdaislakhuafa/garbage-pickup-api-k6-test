import http from 'k6/http';
import { check, group, sleep } from 'k6';

const host = 'http://localhost:8080'
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
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

};