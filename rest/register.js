import http from "k6/http";
import { check, sleep } from "k6";
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
	stages: [
		{ duration: '1m', vus: 500, target: 500 }
	]
}

const url = "http://localhost:8080/api/rest/users/register"
const image = open(`${__ENV.PWD}/profile.jpg`, 'b')

export default function () {
	const now = `${Date.now()}${uuidv4()}`
	const form = new FormData()
	form.append(`name`, `user${now}`)
	form.append(`email`, `useremail${now}@gmail.com`)
	form.append(`password`, `user${now}`)
	form.append(`image`, http.file(image, "image.jpg"))
	form.append(`address`, "Kec. Montong, Kab. Tuban, Prov. Jawa Timur")
	form.append(`phone`, `08${now}`)
	form.append(`point`, "1000000000")
	form.append(`roles`, "USER, COURIER")


	let res = http.post(url, form.body(), {
		headers: {
			'Content-Type': `multipart/form-data; boundary=${form.boundary}`
		}
	})

	check(res, {
		"register success": (res) => {
			const isOk = (res.status === 200)
			if (!isOk) {
				console.log(res.body)
			}
			return isOk
		}
	})
	sleep(Number(env.runner.sleep))
}
