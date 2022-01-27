if (location.hostname !== "localhost" && location.protocol !== "https:") {
	location.replace(
		"https://" + location.hostname + location.pathname + location.search
	)
}
if (
	window.location.pathname.includes("/") &&
	localStorage.getItem("auth") === null &&
	!window.location.pathname.includes("login.html")
) location.href = "./login.html"
let auth = JSON.parse(localStorage.getItem("auth"))
