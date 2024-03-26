const input = document.querySelector("input");
const ul = document.querySelector("ul");
const nameUrl = "https://restcountries.com/v3.1/name/";

function createCountry(countries) {
  if (countries.length === 1) {
    countries.forEach((country) => {
      const currencies = Object.values(country.currencies).map(
        (currency) => currency.name
      );
      const li = document.createElement("li");
      li.innerHTML = `
      <div class="country-container">
        <h1>${country.name.common}</h1>
        <p>Capital: ${country.capital}</p>
        <p>Currency: ${currencies}</p>
        <p>Languages: ${Object.values(country.languages)}</p>
       </div>
        <img src="${country.flags.png}" alt="">
      `;
      ul.appendChild(li);
    });
  } else if (countries.length > 1) {
    countries.forEach((country) => {
      const li = document.createElement("li");
      li.textContent = `${country.name.common}`;
      ul.appendChild(li);
    });
  }
}

function clearResults() {
  ul.innerHTML = "";
}

input.addEventListener("input", _.debounce(handleInput, 500));

function handleInput() {
  const inpValue = input.value;

  if (inpValue === "") {
    clearResults();
    return;
  }
  fetchCountries(nameUrl, inpValue)
    .then((data) => {
      if (data.length > 10) {
        PNotify.error({
          text: "ту мач країн,сорі",
        });
        return;
      }
      clearResults();
      createCountry(data);
    })
    .catch((error) => {
      PNotify.error({
        text: "помилка,спробуйте потім",
      });
    });
}

fetchCountries(nameUrl)
  .then((data) => createCountry(data))
  .catch((error) => console.error("Error fetching countries:", error));

function fetchCountries(url, inpValue) {
  return fetch(url + inpValue).then((response) => {
    return response.json();
  });
}
