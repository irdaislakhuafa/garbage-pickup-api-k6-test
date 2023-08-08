import http from "k6/http";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, sleep } from "k6";

const url = "http://localhost:8080/api/rest/users/login"

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

export default function () {
	const headers = {
		'Content-Type': 'application/json'
	}
	const body = JSON.stringify({
		email: "user1691519773129d5ea6007-c12c-4bbc-abb0-124b514e97a1@gmail.com",
		password: "user1691519773129d5ea6007-c12c-4bbc-abb0-124b514e97a1",
		lat: 10.5,
		lng: -10.5,
	})

	const res = http.post(url, body, { headers: headers })
	check(res, {
		"login success": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		}
	})
	sleep(1)
}