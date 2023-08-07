import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';


const url = "http://localhost:8080/api/gql/graphql"
const userId = 'c9170dee-7abb-4fc3-8b50-26bcc8878188'

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
	]
}

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
	sleep(1)
};