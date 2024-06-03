$(document).ready(function () {
    const HOST = "http://127.0.0.1:5000"; // Set the host URL with port 5000
    const amenities = {};
    const cities = {};
    const states = {};

    // Handle changes on the checkbox inputs for filters
    $('ul li input[type="checkbox"]').bind("change", (e) => {
        const el = e.target;
        let filterCategory;
        switch (el.id) {
            case "state_filter":
                filterCategory = states;
                break;
            case "city_filter":
                filterCategory = cities;
                break;
            case "amenity_filter":
                filterCategory = amenities;
                break;
        }
        if (el.checked) {
            filterCategory[el.dataset.name] = el.dataset.id;
        } else {
            delete filterCategory[el.dataset.name];
        }
        if (el.id === "amenity_filter") {
            $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
        } else {
            $(".locations h4").text(
                Object.keys(Object.assign({}, states, cities)).sort().join(", ")
            );
        }
    });

    // Get the status of the API
    $.getJSON("http://0.0.0.0:5000/api/v1/status/", (data) => {
        if (data.status === "OK") {
            $("div#api_status").addClass("available");
        } else {
            $("div#api_status").removeClass("available");
        }
    });

    // Fetch data about places
    $.post({
        url: `${HOST}/api/v1/places_search`,
        data: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json",
        },
        success: (data) => {
            data.forEach((place) =>
                $("section.places").append(
                    `<article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? "s" : ""}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
                        </div>
                        <div class="description">
                            ${place.description}
                        </div>
                    </article>`
                )
            );
        },
        dataType: "json",
    });

    // Search places when the search button is clicked
    $(".filters button").bind("click", searchPlace);
    searchPlace(); // Initial search when the page is loaded
});
