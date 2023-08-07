import http from 'k6/http';
import { check, group, sleep } from 'k6';


const host = 'http://localhost:8080';
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '3m', vus: 1000, target: 1000 }
	]
}

export default function () {
	let url = `${host}/api/rest/users/${userId}`
	let resUser = http.get(url)
	check(resUser, {
		"get user success": (r) => r.status === 200,
	})
	sleep(1)
};