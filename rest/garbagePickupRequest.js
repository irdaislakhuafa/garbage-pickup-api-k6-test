import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const host = 'http://localhost:8080'
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'
const trashTypeId = '3b0b0118-5ed8-4823-bceb-caab5f1f8f9c'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	// get list trash types
	let url = `${host}/api/rest/trashTypes`
	let listTrashTypes = http.get(url)
	check(listTrashTypes, {
		"get list trast type succes": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		},
	})

	// get claimed vouchers
	url = `${host}/api/rest/userVouchers/vouchers`
	let body = JSON.stringify({
		userId: `${userId}`,
		statuses: ["CLAIMED"]
	})

	const headers = {
		'Content-Type': 'application/json'
	}

	let listUserVouchers = http.post(url, body, { headers: headers })
	check(listTrashTypes, {
		"get list user voucher success": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		},
	})

	listUserVouchers = JSON.parse(listTrashTypes.body)
	url = `${host}/api/rest/userVouchers/exchange`
	body = JSON.stringify({
		userId: `${userId}`,
		listId: listUserVouchers.data.map(v => v.id)
	})

	let responseExchange = http.post(url, body, { headers: headers })
	check(responseExchange, {
		"exchange voucher success": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		},
	})
	sleep(1)
};