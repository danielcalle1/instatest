document
  .getElementById("startConsultation")
  .addEventListener("click", startConsultation);

let selectedSlot = null; // Variable para almacenar el slot seleccionado

function startConsultation() {
  const apiUrl = "https://api.xandar.instaleap.io/jobs/availability/v2";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": "yoJYongi4V4m0S4LClubdyiu5nq6VIpxazcFaghi",
  };
  const requestBody = {
    currency_code: "COP",
    start: "2024-04-04T20:54:04.921Z",
    end: "2024-04-05T21:54:04.921Z",
    slot_size: 30,
    minimum_slot_size: 15,
    operational_models_priority: ["FULL_SERVICE"],
    fallback: true,
    store_reference: "101_FS",
    origin: {
      name: "My Store",
      address: "Calle 119A",
      address_two: "57-40",
      description: "Casa",
      country: "Colombia",
      city: "Bogota",
      state: "Bogota",
      zip_code: "111111",
      latitude: 4.70524298,
      longitude: -74.0684698,
    },
    destination: {
      name: "Daniel",
      address: "Calle 119A",
      address_two: "57-40",
      description: "Casa",
      country: "Colombia",
      city: "Bogota",
      state: "Bogota",
      zip_code: "111111",
      latitude: 4.70524298,
      longitude: -74.0684698,
    },
    job_items: [
      {
        id: "1234",
        name: "Coke",
        photo_url: "",
        unit: "Un",
        sub_unit: "Un",
        quantity: 1,
        sub_quantity: 1,
        quantity_found_limits: {
          max: 1,
          min: 1,
        },
        weight: 1,
        volume: 1,
        price: 1000,
        comment: "Coke",
        attributes: {
          category: "Coke",
          plu: "182837",
          ean: "90008447",
          location: "there",
          picking_index: "there",
        },
      },
    ],
  };

  fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        renderSlots(data);
      } else {
        console.error("La respuesta de la API no es un arreglo.");
      }
    })
    .catch((error) => console.error("Error al obtener disponibilidad:", error));
}

function renderSlots(slots) {
  const slotsList = document.getElementById("slotsList");
  slotsList.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

  slots.forEach((slot) => {
    const slotCard = document.createElement("div");
    slotCard.classList.add("slot-card");
    slotCard.addEventListener("click", () => {
      handleSlotCardClick(slot, slotCard);
    });

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.style.cursor = "pointer"; // Cambiar el cursor al pasar sobre el checkbox
    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
      handleCheckboxClick(checkbox, slot, slotCard); // Pasa la tarjeta también
    });
    slotCard.appendChild(checkbox);

    const slotTime = document.createElement("span");
    const startTime = new Date(slot.from).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(slot.to).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    slotTime.textContent = startTime + " - " + endTime;
    slotTime.classList.add("slot-time");
    slotCard.appendChild(slotTime);

    slotsList.appendChild(slotCard);
  });
}

function handleSlotCardClick(slot, slotCard) {
  const checkbox = slotCard.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    handleCheckboxClick(checkbox, slot, slotCard);
  }
}

function handleCheckboxClick(clickedCheckbox, slot, slotCard) {
  if (clickedCheckbox.checked) {
    if (selectedSlot !== null && selectedSlot !== slot) {
      selectedSlot.checkbox.checked = false;
      selectedSlot.card.classList.remove("selected");
    }
    selectedSlot = { checkbox: clickedCheckbox, card: slotCard };
    selectedSlot.card.classList.add("selected");
  } else {
    selectedSlot = null;
    slotCard.classList.remove("selected");
  }
}
