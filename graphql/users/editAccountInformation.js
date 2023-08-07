import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';


const url = "http://localhost:8080/api/gql/graphql"
const userId = '86ebd8d8-396e-43f8-a84b-7622720554df'

export default function () {
	const query = `
		query {
			user {
				findById(id: "${userId}") {
					name, address, phone, email, roles { name }
				}
			}
		}
	`
	const body = JSON.stringify({ query: query })
	let headers = {
		'Content-Type': 'multipart/form-data'
	}
	let res = http.post(url, body, { headers: headers })
	check(res, {
		"get user is success": (r) => JSON.parse(r.body).errors == null
	})

	const now = Date.now()
	let user = JSON.parse(res.body).data.user.findById
	const form = new FormData()
	form.append("id", `${userId}`)
	form.append("name", `${user.name}`)
	form.append("email", `${user.email}`)
	form.append("address", `${user.address}`)
	form.append("phone", `${user.phone}`)
	form.append("isDeleted", `${false}`)
	form.append("point", `${now}`)
	form.append("roles", `${user.roles.map(v => v.name).join(",")}`)

	headers = {
		'Content-Type': `multipart/form-data; boundary=${form.boundary}`,
	}
	res = http.post(url, form.body(), { headers: headers })
	check(res, {
		"edit user account is success": (r) => JSON.parse(r.body).errors == null
	})
};