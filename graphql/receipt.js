import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const env = JSON.parse(__ENV.OPTS)
const url = `${env.api.host + env.api.basePath.graphql}`
const pickupId = env.variables.pickup.id

export const options = function () { return env.options }()

export default function () {
	const query = `
		query {
			receipt {
				findByPickupId(pickupId: "${pickupId}") {
					pickup { price, weight }
					status
					createdAt
					point
				}
			}
		}
	`
	const body = JSON.stringify({ query: query })
	const headers = {
		'Content-Type': 'application/json'
	}
	const res = http.post(url, body, { headers: headers })
	check(res, {
		"get all data for page is success": (r) => {
			const body = JSON.parse(r.body)
			const isOk = (body.errors == null)
			if (!isOk) {
				console.log(body.errors)
			}
			return isOk
		},
	})
	sleep(Number(env.runner.sleep))
};