// Listen for changes on each input checkbox tag

$(document).ready(function() {
	let active_am = {};
	$(document).on('change', ".amenities input[type='checkbox']", function () {
		if (this.checked){
			active_am[$(this).data('id')] = $(this).data('name');
		} else {
			delete active_am[$(this).data('id')];
		}
		$('div.amenities > h4').text(Object.values(active_am) || "&nbsp;")
	})
	$.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
		if (textStatus === 'success' && data.status === "OK") {
			$('#api_status').addClass('available');
		} else {
			$('#api_status').removeClass('available');
		}
	}
	$.ajax({
		type:'POST',
		url:'http://0.0.0.0:5001/api/v1/places_search/',
		data:'{}',
		dataType: 'json',
		contentType:'application/json',
		success: function (data) {
			data.length && data.forEach((ele) => {
				$('.places').append(
`	<article>
	  <div class="title_box">
	    <h2>${ place.name }</h2>
	    <div class="price_by_night">$${ place.price_by_night }</div>
	  </div>
	  <div class="information">
	    <div class="max_guest">${ place.max_guest } Guest${ place.max_guest !=1 ? "s" : ""}</div>
            <div class="number_rooms">${ place.number_rooms } Bedroom${ place.number_rooms !=1 ? "s" : ""}</div>
            <div class="number_bathrooms">${ place.number_bathrooms } Bathroom${ place.number_bathrooms !=1 ? "s" : ""}</div>
	  </div>
	  <div class="user">
            <b>Owner:</b> ${ place.user.first_name } ${ place.user.last_name }
          </div>
          <div class="description">
	    ${ place.description}
          </div>
	</article>`

				)
			}
	})
})

