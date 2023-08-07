import http from "k6/http";
import { check, sleep } from "k6";

const url = "http://localhost:8080/api/rest/users/login"

export const options = {
	stages: [
		{ duration: '1m', vus: 1000, target: 1000 }
	]
}

export default function () {
	const headers = {
		'Content-Type': 'application/json'
	}
	const body = JSON.stringify({
		email: "user1691447106320@gmail.com",
		password: "user1691447106320",
		lat: 10.5,
		lng: -10.5,
	})

	const res = http.post(url, body, { headers: headers })
	check(res, {
		"login success": (r) => r.status === 200
	})
	sleep(1)
}