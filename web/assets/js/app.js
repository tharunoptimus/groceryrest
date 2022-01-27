let heading = document.querySelector(".heading")
let profilePicImage = document.querySelector(".header .profilePic img")
let createIcon = document.querySelector(".plusIcon")
let profileIcon = document.querySelector(".profilePic")
let listContainer = document.querySelector(".listContainer")

function render() {
	let titleName = auth.name.endsWith("s")
		? `${auth.name}' Grocery`
		: `${auth.name}'s Grocery`
	heading.textContent = titleName
	heading.title = titleName
	profilePicImage.src = auth.profilePic
	profilePicImage.alt = auth.name

	let list = getList("auth")
	let html = generateEntity(list)
	listContainer.innerHTML = html
}

profileIcon.addEventListener("click", () => {
    localStorage.removeItem("auth")
    window.location.replace("./login.html")
})

createIcon.addEventListener("click", async () => {
	let product = prompt("Enter a Product Name: ")
	if (product == null || product == "") {
		return
	}

    await createItem(product)
    render()
})

render()
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delIcon")) {
        let id = e.target.parentElement.getAttribute("data-id")
        deleteItem(id)
        render()
    }
})

async function createItem(product) {
    addNewProduct("auth", product)
	let list = getList("auth")
	list = list.toLocaleString()
	let response = await addItem(auth.token, list)
	localStorage.setItem(
        "auth",
		JSON.stringify({ ...auth, list: response.list.toLocaleString() })
    )
}

async function deleteItem(id) {
    let list = getList("auth")
    list = deleteEntryFromArray(list, id)
    list = list.toLocaleString()
    updateList("auth", list)

    let response = await addItem(auth.token, list)
    localStorage.setItem(
        "auth",
        JSON.stringify({ ...auth, list: response.list.toLocaleString() })
    )
}
