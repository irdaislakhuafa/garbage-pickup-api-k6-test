import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

const image = open(`${__ENV.PWD}/profile.jpg`, 'b')
const url = "http://localhost:8080/api/gql/graphql"

export const options = {
	stages: [
		{ duration: '30s', target: 100 }
	]
}

export default function () {
	const now = Date.now()
	const mutation = `
		mutation ($image: Upload!){
			voucher {
				save(request: {
					title: "voucher ${now}"
					description: "description ${now}"
					image: $image
					pointsNeeded: 1
					type: PERCENT
					value: 1
				}) {
					id
				}
			}
		}
	`


	const variables = { image: null }

	const form = new FormData()
	form.append("operations", JSON.stringify({ query: mutation, variables: variables }))
	form.append("map", JSON.stringify({ "0": ["variables.image"] }))
	form.append("0", http.file(image, "image.jpg"))


	const res = http.post(url, form.body(), {
		headers: {
			'Content-Type': `multipart/form-data; boundary=${form.boundary}`,
		}
	})

	check(res, {
		"ok": r => JSON.parse(r.body).errors == null
	})
};