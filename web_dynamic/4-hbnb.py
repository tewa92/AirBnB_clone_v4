#!/usr/bin/python3
"""
Flask web application setup and routes.
"""
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from flask import Flask, render_template
import uuid

app = Flask(__name__)

@app.teardown_appcontext
def close_db_session(exception):
    """
    Closes the current SQLAlchemy session.
    """
    storage.close()

@app.route('/4-hbnb/', strict_slashes=False)
def display_hbnb():
    """
    Displays the HBNB page with sorted states, amenities, and places.
    """
    states = storage.all(State).values()
    sorted_states = sorted(states, key=lambda state: state.name)
    state_city_list = [
        (state, sorted(state.cities, key=lambda city: city.name)) for state in sorted_states
    ]

    amenities = storage.all(Amenity).values()
    sorted_amenities = sorted(amenities, key=lambda amenity: amenity.name)

    places = storage.all(Place).values()
    sorted_places = sorted(places, key=lambda place: place.name)

    return render_template('0-hbnb.html',
                           states=state_city_list,
                           amenities=sorted_amenities,
                           places=sorted_places,
                           cache_id=uuid.uuid4())

if __name__ == "__main__":
    """
    Starts the Flask web server.
    """
    app.run(host='0.0.0.0', port=5000)
