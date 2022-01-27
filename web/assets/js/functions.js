/**
 * @typedef {Object} Response
 * @property {string} token - The verified token
 * @property {string} name - The name
 * @property {string} username - The username
 * @property {string} profilePic - The profile pic
 * @property {string} lists - The string containing the localized string of the list array
 * @property {boolean} status - The status of the login request
 */

/**
 * @typedef {Object} Product
 * @property {number} id - The id of the product in the list
 * @property {string} name - The name of the product
 */

/**
 *
 * @param {string} fetchResponse
 * @returns {string} The sanitized response string
 */
function sanitizeResponse(fetchResponse) {
	return fetchResponse.replace(/\n/g, "").replace(/\s+/g, " ")
}

/**
 *
 * @param {response} response - The response from the server
 * @returns {Promise<Response>} The parsed response as JSON
 */
async function parseJSONFromResponse(response) {
	return JSON.parse(sanitizeResponse(response))
}

/**
 *
 * @param {localizedString} localizedString
 * @returns {Array<string>} An array of strings
 */
function getArrayFromString(localizedString) {
	return localizedString.split(",")
}

/**
 *
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Response>} The response from the server
 */
async function login(username, password) {
	let response = await fetch("./api/login.jsp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	})

	let responseText = await response.text()
	return parseJSONFromResponse(responseText)
}

/**
 *
 * @param {string} name - The name of the New User
 * @param {string} username - The username of the New User
 * @param {string} password - The password of the New User
 * @returns {Promise<Response>} The response from the server
 */
async function register(name, username, password) {
	let response = await fetch("./api/register.jsp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name, username, password }),
	})
	let responseText = await response.text()
	return parseJSONFromResponse(responseText)
}

/**
 * @param {string} token - The verified Token
 * @param {string} list - The list to be updated
 * @returns {Promise<Response>} The response from the server
 */
async function addItem(token, list) {
	let response = await fetch("./api/add.jsp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token, list }),
	})

	let responseText = await response.text()
	return parseJSONFromResponse(responseText)
}

/**
 *
 * @param {string} auth - The key to the auth object in localStorage
 * @returns {Array<string>} The array of lists
 */
function getList(auth) {
	let authFromLocalStorage = JSON.parse(localStorage.getItem(auth))
	if (authFromLocalStorage === null) return

	let lists = getArrayFromString(authFromLocalStorage.list)
	return lists
}

/**
 *
 * @param {Array<string>} array - The Array of strings
 * @param {number} index - The index of the list to be removed
 * @returns {Array<string>} The array of strings after the removal of the specified index
 */
function deleteEntryFromArray(array, index) {
	let clonedArray = array.slice()
	clonedArray.splice(index, 1)
	return clonedArray
}

/**
 * 
 * @param {string} auth 
 * @param {string} product 
 * @returns {Product} The product object
 */
function addNewProduct(auth, product) {
    let authFromLocalStorage = JSON.parse(localStorage.getItem(auth))
    if (authFromLocalStorage === null) return

    let lists = getArrayFromString(authFromLocalStorage.list)
    lists.push(product)
    localStorage.setItem(auth, JSON.stringify({ ...authFromLocalStorage, list: lists.toLocaleString() }))

    return {
        id: lists.length - 1,
        name: product
    }
}

/**
 * 
 * @param {string} auth - The key to the auth object in localStorage
 * @param {string} list - The list to be updated
 * @returns {null}
 */
function updateList(auth, list) {
    let authFromLocalStorage = JSON.parse(localStorage.getItem(auth))
    if (authFromLocalStorage === null) return
    localStorage.setItem(auth, JSON.stringify({ ...authFromLocalStorage, list }))
}

/**
 * 
 * @param {Array<string>} list - The list to be displayed
 * @returns {string} The html string
 */
function generateEntity(list) {
    let html = ""
    let i = 0
    list.forEach(element => {
        html += createHtml(i, element)
        i++
    })
    return html
}

/**
 * 
 * @param {number} id - The id of the Element to be included in the data-id attribute
 * @param {string} product - The product name
 * @returns {string} The HTML string of the product
 */
function createHtml(id, product) {

    if (product === "") return ""

    let html = `<div class="listItem" data-id="${id}">
    <span class="listItemContent">${product}</span>
    <span class="iconHolder delIcon" title="Click to Delete Product">
        <svg 
            aria-hidden="true" 
            focusable="false" 
            data-prefix="far" 
            data-icon="trash-alt" 
            class="svg-inline--fa fa-trash-alt fa-w-14" 
            role="img" xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512" 
        >
            <path 
                fill="currentColor" 
                d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z">
            </path>
        </svg>
    </span>
    </div>`

    return html
}
