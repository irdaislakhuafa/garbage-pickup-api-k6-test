import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const host = 'http://localhost:8080'
const pickupId = '23b26b34-31a7-452a-8600-1663bdabdf8b';

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	let url = `${host}/api/rest/pickupActivity/pickup/${pickupId}`
	let res = http.get(url)
	check(res, {
		"get detail pickup success": (r) => true,
	})
	sleep(1)
};