// fetchCountries.js

const URL = `https://restcountries.com/v3.1/name/`;
//створюємо URL для запиту до API країн за допомогою вказаного імені, 
//а також додаємо параметри пошуку, які включають потрібні властивості країни.

export const fetchCountries = (name) => {
    const searchParams = new URLSearchParams({
        fields: 'name.official,capital,population,flags.svg,languages,',
    });
    
    return fetch(`${URL}${name}?${searchParams}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
}