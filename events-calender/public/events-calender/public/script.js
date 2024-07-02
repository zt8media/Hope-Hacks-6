document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: '/events', // Fetch events from server
        editable: true,
        droppable: true,
        eventDrop: async function(info) {
            // Update event in the backend if the event is dragged and dropped
            const updatedEvent = {
                title: info.event.title,
                start: info.event.start.toISOString(),
                end: info.event.end ? info.event.end.toISOString() : null,
                description: info.event.extendedProps.description,
            };

            const response = await fetch(`/events/${info.event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });

            if (!response.ok) {
                alert('Failed to update event. Please try again.');
                info.revert();
            }
        },
        eventResize: async function(info) {
            // Update event in the backend if the event is resized
            const updatedEvent = {
                title: info.event.title,
                start: info.event.start.toISOString(),
                end: info.event.end.toISOString(),
                description: info.event.extendedProps.description,
            };

            const response = await fetch(`/events/${info.event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });

            if (!response.ok) {
                alert('Failed to update event. Please try again.');
                info.revert();
            }
        },
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
});
