const sidebar = document.querySelector("#sidebar");
const addNewContainer = document.querySelector("#addNewContainer");
const addNewButton = document.querySelector("#addNewButton");
const closeAddNew = document.querySelector("#close-add-new");
addNewButton.addEventListener("click", () => {
    addNewContainer.classList.add("open");
})
closeAddNew.addEventListener("click", () => {
    addNewContainer.classList.remove("open");
})