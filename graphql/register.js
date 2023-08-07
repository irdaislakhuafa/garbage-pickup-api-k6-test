import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';


const url = "http://localhost:8080/api/gql/graphql"
const image = open(`${__ENV.PWD}/profile.jpg`, 'b')

export const options = {
	stages: [
		{ duration: '1m', vus: 4000, target: 4000 }
	]
}

export default function () {
	const now = Date.now()
	const mutation = `
		mutation ($image: Upload!) {
			user {
				register(request: {
					name: "user${now}"
					email: "user${now}@gmail.com"
					password: "user${now}"
					image: $image
					phone: "08${now}"
					address: "Kec. Montong, Kab. Tuban, Prov. Jawa Timur"
					point: 1000000
					roles: [ USER ]
				}) {
					id
				}
			}
		}
	`
	const variables = {
		image: null
	}

	const form = new FormData()
	form.append("operations", JSON.stringify({ query: mutation, variables }))
	form.append("map", JSON.stringify({ "0": ["variables.image"] }))
	form.append("0", http.file(image, "image.jpg"))

	const res = http.post(url, form.body(), {
		headers: {
			'Content-Type': `multipart/form-data; boundary=${form.boundary}`,
		}
	})
	check(res, {
		"register success": (r) => {
			const body = JSON.parse(r.body)
			return body.errors == null
		},
	})
};