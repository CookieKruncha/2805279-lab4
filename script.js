const input = document.getElementById("country-input");
const button = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

spinner.classList.add("hidden");

async function searchCountry(countryName) {
    try {
        errorMessage.textContent = "";
        document.getElementById('country-info').innerHTML = "";
        document.getElementById('bordering-countries').innerHTML = "";

        spinner.classList.remove("hidden");

        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0]; 

        document.getElementById('country-info').innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" width="150">
        `;

        //Fetch bordering countries properly
        if (country.borders) {
            const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(",")}`);

        if (!borderResponse.ok) {
            throw new Error("Failed to fetch bordering countries");
        }

        const borderData = await borderResponse.json();

        document.getElementById('bordering-countries').innerHTML =
            "<h3>Bordering Countries:</h3>" +
            borderData.map(c => `
                <div class="border-country">
                    <img src="${c.flags.svg}" 
                        alt="${c.name.common} flag" 
                        width="50">
                    <p>${c.name.common}</p>
                </div>
            `).join("");
        } else {
            document.getElementById('bordering-countries').innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = "Unable to find country.";
    } finally {
        spinner.classList.add("hidden");
    }
}

button.addEventListener("click", () => {
    const country = input.value.trim();
    if (country) {
        searchCountry(country);
    }

input.addEventListener("keydown", function(event) {
    const country = input.value.trim();
    if (event.key === "Enter") {
        searchCountry(country);
    }
});

});