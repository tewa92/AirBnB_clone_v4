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

    // Fetch places based on filters
    function searchPlace() {
        $.post({
            url: `${HOST}/api/v1/places_search`,
            data: JSON.stringify({
                amenities: Object.values(amenities),
                states: Object.values(states),
                cities: Object.values(cities),
            }),
            headers: {
                "Content-Type": "application/json",
            },
            success: (data) => {
                $("section.places").empty();
                data.forEach((place) => {
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
                            <div class="reviews" data-place="${place.id}">
                                <h2></h2>
                                <ul></ul>
                            </div>
                        </article>`
                    );
                    fetchReviews(place.id);
                });
            },
            dataType: "json",
        });
    }

    // Fetch reviews for a specific place
    function fetchReviews(placeId) {
        $.getJSON(`${HOST}/api/v1/places/${placeId}/reviews`, (data) => {
            $(`.reviews[data-place="${placeId}"] h2`)
                .html(`${data.length} Reviews <span id="toggle_review">show</span>`);
            $(`.reviews[data-place="${placeId}"] h2 #toggle_review`).bind("click", { placeId }, function (e) {
                const rev = $(`.reviews[data-place="${e.data.placeId}"] ul`);
                if (rev.css("display") === "none") {
                    rev.css("display", "block");
                    data.forEach((review) => {
                        $.getJSON(`${HOST}/api/v1/users/${review.user_id}`, (user) => {
                            $(".reviews ul").append(`
                                <li>
                                    <h3>From ${user.first_name} ${user.last_name} the ${review.created_at}</h3>
                                    <p>${review.text}</p>
                                </li>
                            `);
                        }, "json");
                    });
                } else {
                    rev.css("display", "none");
                }
            });
        }, "json");
    }
});
