import http from 'k6/http';
import { check, group, sleep } from 'k6';


const pickupId = `81bf0ee1-85a4-4883-9f4f-5c7923b390b8`
const host = 'http://localhost:8080';

export const options = {
	stages: [
		{ duration: '3m', vus: 1000, target: 1000 }
	]
}

export default function () {
	let url = `${host}/api/rest/contactUs`
	let res = http.get(url)
	check(res, {
		"get contact us success": (r) => r.status === 200,
	})
	sleep(1)
};