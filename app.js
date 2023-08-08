window.addEventListener("load", () => {
  loadLinksFromLocalStorage();
  displayLinks();
});

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

let links = [];
const submit = async (e) => {
    e.preventDefault();
    const url = urlInput.value;
    urlInput.classList.remove("err");
    if (isValid(url)) {
      errMsg.textContent = "";
      const response = await fetch(endpoint + url);
      const data = await response.json();
      console.log(data.result);
      const { original_link, short_link } = data.result;
      storeLink(original_link, short_link);
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

const storeLink = (link, shortLink) => {
  links.push({ link, shortLink });
  localStorage.setItem("links", JSON.stringify(links));
  window.location.reload(true);
}

const loadLinksFromLocalStorage = () => {
  const storedLinks = localStorage.getItem("links");
  if (storedLinks) {
    links = JSON.parse(storedLinks);
  }
};



console.log(links);

const displayLinks = () => {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  links.forEach((item, index) => {
    const linkItem = document.createElement("div");
    linkItem.classList.add("item");

    const originalLink = document.createElement("span");
    originalLink.classList.add("link");
    originalLink.textContent = `${item.link.slice(0, 50) + "..."}`;

    const shortLink = document.createElement("span");
    shortLink.classList.add("result");
    shortLink.textContent = `${item.shortLink}`;

    const deleteBtn = document.createElement("p");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("close");

    deleteBtn.addEventListener("click", () => {
      deleteLink(index);
    });

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "copy";
    copyBtn.classList.add("copy-btn");

    copyBtn.addEventListener("click", () => {
      copyShortLink(index, copyBtn);
    });

    shortLink.appendChild(copyBtn);
    linkItem.appendChild(originalLink);
    linkItem.appendChild(shortLink);
    
    linkItem.appendChild(deleteBtn);
    resultsContainer.appendChild(linkItem);
  });
  
}

const deleteLink = (index) => {
  links.splice(index, 1);
  localStorage.setItem("links", JSON.stringify(links));
  window.location.reload(true);
};

const copyShortLink = (index, copyBtn) => {
  const link = links[index].shortLink;
  const textarea = document.createElement("textarea");
  textarea.value = link;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  copyBtn.textContent = "copied!";
  copyBtn.classList.add("copied");
  setTimeout(() => {
    copyBtn.textContent = "copy";
    copyBtn.classList.remove("copied");
  }, 2000);
};