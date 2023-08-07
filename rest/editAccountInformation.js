import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';


const host = 'http://localhost:8080';
const image = open(`${__ENV.PWD}/profile.jpg`, 'b')
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

	url = `${host}/api/rest/users`
	let resUserData = JSON.parse(resUser.body)

	const form = new FormData();
	form.append("id", `${userId}`)
	form.append("name", `${resUserData.data.name}`)
	form.append("phone", `${resUserData.data.phone}`)
	form.append("isDeleted", `${Boolean(resUserData.data.isDeleted)}`)
	form.append("point", `${resUserData.data.point}`)
	form.append("address", `${resUserData.data.address}`)
	form.append("email", `${resUserData.data.email}`)
	form.append("roles", `${resUserData.data.roles.map(v => v.name).join(",")}`)


	let resEditUser = http.put(url, form.body(), {
		headers: {
			'Content-Type': "multipart/form-data; boundary=" + form.boundary
		}
	})
	check(resEditUser, {
		"edit user success": (r) => r.status == 200,
	})
	sleep(1)
};