'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var url = require('url');
var app = require('@architect/shared/app.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var url__default = /*#__PURE__*/_interopDefaultLegacy(url);
var app__default = /*#__PURE__*/_interopDefaultLegacy(app);

async function handler(event) {
	const { host, rawPath: path, httpMethod, headers, queryStringParameters, body } = event;

	const query = new url__default['default'].URLSearchParams();
	for (const k in queryStringParameters) {
		const value = queryStringParameters[k];
		value.split(', ').forEach((v) => {
			query.append(k, v);
		});
	}

	const rendered = await app__default['default'].render({
		host,
		method: httpMethod,
		headers,
		path,
		body,
		query
	});

	if (rendered) {
		return {
			isBase64Encoded: false,
			statusCode: rendered.status,
			headers: rendered.headers,
			body: rendered.body
		};
	}

	return {
		statusCode: 404,
		body: 'Not Found'
	};
}

exports.handler = handler;
//# sourceMappingURL=index.js.map
