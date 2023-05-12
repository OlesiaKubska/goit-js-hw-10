// fetchCountries.js
const URL = `https://restcountries.com/v3.1/name/`;

const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages,',
});


export function fetchCountries(name) {    

    return fetch(`${URL}${name}?${searchParams.toString()}`)
        .then(response => {
            if (response.status === 404) {
                throw new Error(response.status);
            }
            return response.json();
        });
    
};