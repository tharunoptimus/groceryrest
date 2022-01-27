let signup = false
let nameHolder = document.querySelector("#name")
let username = document.querySelector("#username")
let password = document.querySelector("#password")
let button = document.querySelector("#button")
let title = document.querySelector("#title")
let changeStuff = document.querySelector("#changeStuff")
let errorMessage = document.querySelector(".errorMessage")

button.addEventListener("click", handleButtonEvent)
changeStuff.addEventListener("click", handleSpanClickEvent)

let users = JSON.parse(localStorage.getItem("users"))
users == null ? (users = {}) : (users = users)

function printErrorMessage(paragraph, message) {
	paragraph.innerText = message
}

function successAction() {
	window.location.href = "./"
}

async function handleButtonEvent() {
	if (username.value === "" || password.value === "") return

	if (title.dataset.id === "login") {
		let currentUsername = username.value
		let currentPassword = password.value

		let auth = await login(currentUsername, currentPassword)

		if (auth.token === "")
			return printErrorMessage(
				errorMessage,
				"Invalid username or password"
			)
		localStorage.setItem("auth", JSON.stringify(auth))
		successAction()
	} else if (title.dataset.id === "signup") {
		if (nameHolder.value === "") return
		let currentUsername = username.value
		let currentPassword = password.value
		let currentName = nameHolder.value

		let auth = await register(currentName, currentUsername, currentPassword)

		if (auth.token === "")
			return printErrorMessage(errorMessage, "Username already exists")
		localStorage.setItem("auth", JSON.stringify(auth))
		successAction()
	}
}

function handleSpanClickEvent() {
	if (title.dataset.id === "login") {
		title.dataset.id = "signup"
		title.innerText = "Sign Up"
		changeStuff.innerText = "Already have an account? Login"
		button.innerText = "Sign Up"
		nameHolder.type = "text"
	} else if (title.dataset.id === "signup") {
		title.dataset.id = "login"
		title.innerText = "Login"
		changeStuff.innerText = "Don't have an account? Sign Up"
		button.innerText = "Login"
		nameHolder.type = "hidden"
	}
	printErrorMessage(errorMessage, "")
}
