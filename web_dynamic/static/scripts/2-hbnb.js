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
})

