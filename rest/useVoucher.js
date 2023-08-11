import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';


const host = 'http://localhost:8080'
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'

export const options = {
	stages: [
		{ duration: '1m', target: 100 }
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

	resObject.data != null && resObject.data.forEach(v => listId.push(v.id));

	// use voucher if exists
	if (listId.length != 0) {
		url = `${host}/api/rest/userVouchers/exchange`
		body = JSON.stringify({
			userId: `${userId}`,
			listId: listId
		})

		res = http.post(url, body, { headers: headers })
		check(res, {
			"exchange voucher success": (r) => true,
		})
	}
	sleep(Number(env.runner.sleep))
};
