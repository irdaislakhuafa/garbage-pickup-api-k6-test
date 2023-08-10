import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const env = JSON.parse(__ENV.OPTS)
const host = `${env.api.host + env.api.basePath.rest}`
export const options = function () { return env.options }()


export default function () {
	// get list trash types
	let url = `${host}/trashTypes`
	let listTrashTypes = http.get(url)
	check(listTrashTypes, {
		"get list trast type succes": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				console.log(r.body)
			}
			return true
		},
	})

	// get claimed vouchers
	url = `${host}/userVouchers/vouchers`
	let body = JSON.stringify({
		userId: `${env.variables.user.id}`,
		statuses: ["CLAIMED"]
	})

	const headers = {
		'Content-Type': 'application/json'
	}

	let listUserVouchers = http.post(url, body, { headers: headers })
	check(listUserVouchers, {
		"get list user voucher success": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				// console.log(r.body)
			}
			return true
		},
	})

	listUserVouchers = JSON.parse(listUserVouchers.body)
	url = `${host}/userVouchers/exchange`
	body = JSON.stringify({
		userId: `${userId}`,
		// listId: listUserVouchers.data.map(v => v.id)
		listId: []
	})

	let responseExchange = http.post(url, body, { headers: headers })
	check(responseExchange, {
		"exchange voucher success": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				// console.log(r.body)
			}
			return true
		},
	})
	sleep(1)
};