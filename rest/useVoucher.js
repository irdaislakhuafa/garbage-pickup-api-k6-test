import http from 'k6/http';
import { check, group, sleep } from 'k6';


const host = 'http://localhost:8080'
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '1m', vus: 1000, target: 1000 }
	]
}

export default function () {
	let headers = {
		'Content-Type': 'application/json'
	}

	// get available voucher
	let url = `${host}/api/rest/userVouchers/vouchers`
	let body = JSON.stringify({
		userId: `${userId}`,
		statuses: ["CLAIMED"]
	})

	let res = http.post(url, body, { headers: headers })
	check(res, {
		"get available user voucher success": (r) => r.status === 200,
	})

	let resObject = JSON.parse(res.body)
	let listId = [];

	resObject.data.forEach(v => listId.push(v.id));

	// use voucher if exists
	if (listId.length != 0) {
		url = `${host}/api/rest/userVouchers/exchange`
		body = JSON.stringify({
			userId: `${userId}`,
			listId: []
		})

		res = http.post(url, body, { headers: headers })
		check(res, {
			"exchange voucher success": (r) => r.status === 200,
		})
	}
	sleep(1)
};