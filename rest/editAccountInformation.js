import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';


const env = JSON.parse(__ENV.OPTS)
const host = `${env.api.host}${env.api.basePath.rest}`;
const image = open(`${__ENV.PWD}/${env.variables}`, 'b')

export const options = function () { return env.options }()

export default function () {
	let url = `${host}/users/${env.variables.user.id}`
	let resUser = http.get(url)
	check(resUser, {
		"get user success": (r) => true,
	})

	url = `${host}/users`
	let resUserData = JSON.parse(resUser.body)


	const form = new FormData();
	form.append("id", `${env.variables.user.id}`)
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
		"edit user success": (r) => true,
	})
	sleep(1)
};