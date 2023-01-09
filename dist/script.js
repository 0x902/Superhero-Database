// Initialize Form
const searchForm = document.getElementById("search-form");
const searchSuggestions = document.getElementById("search-suggestions");
const searchSuggestionsCount = document.getElementById(
  "search-suggestions-count"
);
const searchInput = document.getElementById("search-input");
const heroPopup = document.getElementById("hero-info-popup");
const closeBtn = document.getElementById("btn-close");
const heroName = document.getElementById("hero-name");
const heroImageContainer = document.getElementById("hero-image-container");
const heroImage = document.getElementById("hero-image");
const externalLinkBtn = document.getElementById("external-link-btn");
const realName = document.getElementById("real-name");
const description = document.getElementById("description");
const aliases = document.getElementById("aliases");
const occupation = document.getElementById("occupation");
const publisher = document.getElementById("publisher");
const race = document.getElementById("race");
const alignment = document.getElementById("alignment");
const maritalStatus = document.getElementById("marital-status");
const statIntelligence = document.getElementById("intelligence");
const statStrength = document.getElementById("strength");
const statSpeed = document.getElementById("speed");
const statCombat = document.getElementById("combat");
const footer = document.getElementById("footer");

// Event listeners
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getResponse();
});

closeBtn.addEventListener("click", function () {
  document.body.style.overflowY = "hidden";
  heroPopup.style.transform = "translateX(100vw)";
});

searchInput.addEventListener("click", function () {
  footer.classList.add("hide-footer");
});

// API
const accessToken = "859144678673734";
const baseUrl = `https://superheroapi.com/api.php/${accessToken}`;

searchInput.addEventListener("input", () => {
  if (searchInput.value.length != "") {
    getResponse();
  } else if (searchInput.value == "") {
    clearSearchSuggestions();
  }
});

const getResponse = () => {
  fetch(`${baseUrl}/search/${searchInput.value}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.response === "success") {
        clearSearchSuggestions();
        showSearchResults(json.results);
      }
    })
    .catch((error) => console.log(error));
};

const showSearchResults = (results) => {
  const default_avatar = "https://secure.gravatar.com/avatar?d=wavatar";
  if (results.length > 0) {
    searchSuggestionsCount.innerHTML = `<b>Search results:</b> ${results.length}`;
    results.forEach((hero) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      const p = document.createElement("p");

      img.src = hero.image.url;
      img.classList.add("suggestion-hero-image");
      img.alt = "no image";
      li.appendChild(img);

      p.textContent = `${hero.name} ${
        hero.biography["full-name"] !== ""
          ? "(" + hero.biography["full-name"] + ")"
          : ""
      }`;
      li.appendChild(p);

      li.classList.add("suggestion");
      li.classList.add("cur-p");
      li.addEventListener("click", function (e) {
        showHeroInfo(hero);
      });
      searchSuggestions.appendChild(li);
      searchSuggestions.style.maxHeight = "32rem";
    });
  }
};

const clearSearchSuggestions = () => {
  searchSuggestions.innerHTML = "";
  searchSuggestionsCount.innerHTML = `<b>Search results:</b> 0`;
};

const showHeroInfo = (results) => {
  setTimeout(() => {
    clearSearchSuggestions();
    searchInput.value = "";
  }, 1000);

  heroImage.style.backgroundImage = `url(${results.image.url})`;
  heroImageContainer.style.background = `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,1)),url(${results.image.url})`;

  document.body.style.overflowY = "unset";
  heroPopup.style.transform = "translateX(0px)";

  console.log(results);
  heroName.textContent = results.name;

  let descriptionStr = `${results.name} is a ${
    results.biography.alignment.toLowerCase() === "good" ? "Hero" : "Villain"
  }`;
  descriptionStr += `${
    results.biography["place-of-birth"] !== "-"
      ? ", born in " + results.biography["place-of-birth"] + "."
      : "."
  }`;
  descriptionStr += `${results.name} is a character published by ${results.biography.publisher}. `;
  descriptionStr += `${
    results.appearance.gender.toLowerCase() === "male" ? "He" : "She"
  } first appeared in ${results.biography["first-appearance"]}.`;
  description.textContent = descriptionStr;

  realName.innerHTML = `<span>Real name:</span> ${results.biography["full-name"]}`;
  aliases.innerHTML = `<span>Aliases:</span> ${results.biography.aliases.join(
    ", "
  )}`;
  occupation.innerHTML = `<span>Occupation:</span> ${
    results.work.occupation.split(",")[0]
  }`;
  publisher.innerHTML = `<span>Publisher:</span> ${results.biography.publisher}`;
  race.innerHTML = `<span>Race:</span> ${results.appearance.race}`;
  alignment.innerHTML = `<span>Alignment:</span> ${results.biography.alignment
    .charAt(0)
    .toUpperCase()}${results.biography.alignment.slice(1)}`;
  maritalStatus.innerHTML = `<span>Alter-egos:</span> ${results.biography["alter-egos"]}`;

  statIntelligence.textContent = `${results.powerstats.intelligence}/100`;
  statStrength.textContent = `${results.powerstats.speed}/100`;
  statSpeed.textContent = `${results.powerstats.speed}/100`;
  statCombat.textContent = `${results.powerstats.combat}/100`;
};
