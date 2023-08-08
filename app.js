const menuBtn = document.getElementById("menu-icon");
const navMenu = document.getElementById("nav-menu");
const shortenForm = document.getElementById("shorten-form");
const urlInput = document.getElementById("url-input");
const errMsg = document.getElementById("err-msg");

const endpoint = "https://api.shrtco.de/v2/shorten?url=";

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("navbar-collapse");
    navMenu.classList.toggle("nav-links");
});

const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

const submit = async (e) => {
    e.preventDefault();
    const url = urlInput.value;
    urlInput.classList.remove("err");
    if (isValid(url)) {
      errMsg.textContent = "";
      const response = await fetch(endpoint + url);
      const data = await response.json();
      console.log(data);
    }
      else {
        urlInput.classList.add("err");
        if (url == "") {
          errMsg.textContent = "Please add a link";
        } else{
            errMsg.textContent = "Please enter a valid url";
        }
    }
}

shortenForm.addEventListener('submit', submit);

const isValid = (url) => {
    return URL_REGEX.test(url);
}