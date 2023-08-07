import { check, sleep } from "k6";
import http from "k6/http";

const host = 'http://localhost:8080';
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'

export default function () {
	const user = http.get(`${host}/api/rest/users/${userId}`)
	check(user, {
		"get user success": (r) => r.status == 200,
	})

	let headers = {
		'Content-Type': 'application/json'
	}
	let body = JSON.stringify({
		userId: `${userId}`,
		start: "04/08/2023 00:00:00",
		end: "04/09/2023 00:00:00",
		statuses: []
	})

	const listPickupUser = http.post(`${host}/api/rest/pickups/users`, body, { headers: headers })
	check(listPickupUser, {
		"get list pickup user success": (r) => r.status === 200,
	})
}