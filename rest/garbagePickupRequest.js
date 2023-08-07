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
	// get list trash types
	let url = `${host}/api/rest/trashTypes`
	let listTrashTypes = http.get(url)
	check(listTrashTypes, {
		"get list trast type succes": (r) => r.status === 200,
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
		"get list user voucher success": (r) => r.status === 200,
	})

	listUserVouchers = JSON.parse(listTrashTypes.body)
	url = `${host}/api/rest/userVouchers/exchange`
	body = JSON.stringify({
		userId: `${userId}`,
		listId: listUserVouchers.data.map(v => v.id)
	})

	let responseExchange = http.post(url, body, { headers: headers })
	check(responseExchange, {
		"exchange voucher success": (r) => r.status === 200,
	})
};