import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const host = 'http://localhost:8080'
const pickupId = '81bf0ee1-85a4-4883-9f4f-5c7923b390b8';

export const options = {
	stages: [
		{ duration: '1m', vus: 1000, target: 1000 }
	]
}

export default function () {
	let url = `${host}/api/rest/pickupActivity/pickup/${pickupId}`
	let res = http.get(url)
	check(res, {
		"get detail pickup success": (r) => r.status == 200,
	})
	sleep(1)
};