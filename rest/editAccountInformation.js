import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';


const host = 'http://localhost:8080';
const image = open(`${__ENV.PWD}/profile.jpg`, 'b')
const userId = '3439fa4d-847b-42c5-aaec-82beb452578c'

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
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