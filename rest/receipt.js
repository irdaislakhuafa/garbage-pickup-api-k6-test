import http from 'k6/http';
import { check, group, sleep } from 'k6';

const pickupId = `81bf0ee1-85a4-4883-9f4f-5c7923b390b8`
const host = 'http://localhost:8080';

export default function () {
	let url = `${host}/api/rest/receipts/pickups/${pickupId}`
	let res = http.get(url)
	check(res, {
		"get receipt success": (r) => r.status === 200,
	})
};