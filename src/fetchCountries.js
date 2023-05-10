// fetchCountries.js
const url = 'https://restcountries.com/v3.1/name/';

const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages,',
});


export const fetchCountries = (name) => {
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
    
};