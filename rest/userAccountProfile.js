import http from 'k6/http';
import { check, group, sleep } from 'k6';


const host = 'http://localhost:8080';
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
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