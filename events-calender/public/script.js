document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var modal = document.getElementById('eventModal');
    var modalTitle = document.getElementById('modalTitle');
    var modalStart = document.getElementById('modalStart');
    var modalEnd = document.getElementById('modalEnd');
    var modalDescription = document.getElementById('modalDescription');
    var deleteEventButton = document.getElementById('deleteEventButton');
    var closeModal = document.getElementsByClassName('close')[0];
    var selectedEvent = null;

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: '/events', // Fetch events from server
        eventClick: function(info) {
            // Display event details in the modal
            selectedEvent = info.event;
            modalTitle.textContent = selectedEvent.title;
            modalStart.textContent = selectedEvent.start.toISOString();
            modalEnd.textContent = selectedEvent.end ? selectedEvent.end.toISOString() : 'N/A';
            modalDescription.textContent = selectedEvent.extendedProps.description;
            modal.style.display = 'block';
        }
    });

    calendar.render();

    document.getElementById('eventForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            start: document.getElementById('start').value,
            end: document.getElementById('end').value,
            description: document.getElementById('description').value,
        };

        const response = await fetch('/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const newEvent = await response.json();
            calendar.addEvent(newEvent);
            alert('Event added successfully!');
            document.getElementById('eventForm').reset();
        } else {
            alert('Error adding event. Please try again.');
        }
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }, { passive: true });

    deleteEventButton.addEventListener('click', async function() {
        if (selectedEvent) {
            const response = await fetch(`/events/${selectedEvent.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                selectedEvent.remove();
                modal.style.display = 'none';
                alert('Event deleted successfully!');
            } else {
                alert('Error deleting event. Please try again.');
            }
        }
    });
});
