import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const pickupId = `86c1b9eb-2727-49f9-a459-f468102284d4`
const host = 'http://localhost:8080';

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	let url = `${host}/api/rest/receipts/pickups/${pickupId}`
	let res = http.get(url)
	check(res, {
		"get receipt success": (r) => r.status === 200,
	})
	sleep(1)
};