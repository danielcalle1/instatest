document
  .getElementById("startConsultation")
  .addEventListener("click", startConsultation);
document.getElementById("createOrder").addEventListener("click", createOrder);

let selectedSlot = null; // Variable para almacenar el slot seleccionado
let jobIdGlobal = ""; // Variable global para almacenar el job_id

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
    showCreateOrderButton(); // Muestra el botón Crear Orden
  }
}

function handleCheckboxClick(clickedCheckbox, slot, slotCard) {
  if (clickedCheckbox.checked) {
    if (selectedSlot !== null && selectedSlot !== slot) {
      selectedSlot.checkbox.checked = false;
      selectedSlot.card.classList.remove("selected");
    }
    selectedSlot = { checkbox: clickedCheckbox, card: slotCard, id: slot.id };
    selectedSlot.card.classList.add("selected");
    showCreateOrderButton(); // Muestra el botón Crear Orden
  } else {
    selectedSlot = null;
    slotCard.classList.remove("selected");
    hideCreateOrderButton(); // Oculta el botón Crear Orden
  }
}

function createOrder() {
  if (selectedSlot) {
    const orderId = selectedSlot.id;
    const clientReference = generateRandomClientReference(); // Genera un cliente de referencia aleatorio
    const apiUrl = "https://api.xandar.instaleap.io/jobs";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": "yoJYongi4V4m0S4LClubdyiu5nq6VIpxazcFaghi",
    };
    const requestBody = {
      slot_id: orderId,
      client_reference: clientReference, // Usa el cliente de referencia aleatorio
      recipient: {
        name: "Daniel",
        email: "daniel@gmail.com",
        phone_number: "13454",
        identification: {
          number: "234324",
          type: "cc",
        },
      },
      payment_info: {
        currency_code: "COP",
        prices: {
          subtotal: 1000,
          shipping_fee: 10,
          discounts: 0,
          taxes: 10,
          order_value: 900,
          attributes: [],
          additional_info: [],
        },
        payment: {
          id: "9876",
          payment_status: "FAILED",
          method: "CASH",
          reference: "IP",
          value: 1000,
          payment_status_details: "FAL",
          method_details: "FAL",
          blocking_policy: "CHECKOUT",
        },
      },
      add_delivery_code: true,
      job_comment: "Comment",
      contact_less: {
        comment: "LeaveAtTheDoor",
        cash_receiver: "MR",
        phone_number: "23454",
      },
    };

    fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Orden creada exitosamente:", data);
        // Ocultar lista de slots
        document.getElementById("slotsList").style.display = "none";
        // Renderizar los detalles de la orden
        getOrderDetails(data.job_id);
      })
      .catch((error) => console.error("Error al crear la orden:", error));
  } else {
    console.error("No se ha seleccionado ningún slot.");
  }
}

function showCreateOrderButton() {
  const createOrderButton = document.getElementById("createOrder");
  createOrderButton.style.display = "inline-block"; // Hace visible el botón Crear Orden
}

function hideCreateOrderButton() {
  const createOrderButton = document.getElementById("createOrder");
  createOrderButton.style.display = "none"; // Oculta el botón Crear Orden
}

function generateRandomClientReference() {
  // Genera un número aleatorio entre 0 y 99999 y lo convierte en un string de 5 dígitos
  const randomNum = Math.floor(Math.random() * 100000);
  return randomNum.toString().padStart(5, "0"); // Rellena con ceros a la izquierda si es necesario
}

function getOrderDetails(jobId) {
  const apiUrl = `https://api.xandar.instaleap.io/jobs/${jobId}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": "yoJYongi4V4m0S4LClubdyiu5nq6VIpxazcFaghi",
  };

  fetch(apiUrl, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      jobIdGlobal = jobId;
      renderOrderReceipt(data);
    })
    .catch((error) =>
      console.error("Error al obtener los detalles de la orden:", error),
    );
}

function renderOrderReceipt(orderDetails) {
  const receiptContainer = document.getElementById("orderReceipt");
  receiptContainer.innerHTML = ""; // Limpiamos el contenedor antes de renderizar
  // Renderizar cada campo del detalle de la orden en forma de recibo
  const fieldsToRender = [
    { label: "Client ID", value: orderDetails.client_id },
    {
      label: "Start Time",
      value: new Date(orderDetails.start_time).toLocaleString(),
    },
    {
      label: "End Time",
      value: new Date(orderDetails.end_time).toLocaleString(),
    },
    { label: "State", value: orderDetails.state },
    { label: "Operational Model", value: orderDetails.operational_model },
    {
      label: "Destination",
      value: `${orderDetails.destination.name}, ${orderDetails.destination.address}, ${orderDetails.destination.city}, ${orderDetails.destination.country}, ${orderDetails.destination.description}`,
    },
    { label: "Total Items", value: orderDetails.total_items },
    { label: "Items Replaced", value: orderDetails.items_replaced },
    { label: "Items", value: renderItems(orderDetails.items) },
    { label: "Collect With", value: JSON.stringify(orderDetails.collect_with) },
    { label: "Recipient", value: JSON.stringify(orderDetails.recipient) },
    { label: "Store", value: JSON.stringify(orderDetails.store) },
    { label: "Payment Info", value: JSON.stringify(orderDetails.payment_info) },
  ];

  fieldsToRender.forEach((field) => {
    const fieldElement = document.createElement("div");
    fieldElement.innerHTML = `<strong>${field.label}:</strong> ${field.value}`;
    receiptContainer.appendChild(fieldElement);
  });

  document.getElementById("invoice").style.display = "block";
}

function renderItems(items) {
  return items
    .map(
      (item) =>
        `${item.name} - Quantity: ${item.quantity}, Unit: ${item.unit}, Amount: ${item.presentation.price.amount}, Currency: ${item.presentation.price.currency}, Weight: ${item.weight}, EAN: ${item.attributes.ean}, PLU: ${item.attributes.plu}`,
    )
    .join("<br>");
}

function updatePaymentInfo() {
  const value = document.getElementById("valueInput").value;

  const apiUrl = `https://api.xandar.instaleap.io/jobs/${jobIdGlobal}/payment_info`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": "yoJYongi4V4m0S4LClubdyiu5nq6VIpxazcFaghi",
  };
  const requestBody = {
    payment: {
      id: "string",
      payment_status: "FAILED",
      method: "CASH",
      reference: "string",
      value: parseInt(value), // Convertir a entero
      payment_status_details: "string",
      method_details: "string",
      blocking_policy: "CHECKOUT",
    },
  };

  fetch(apiUrl, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (response.ok) {
        alert("Su pedido ha sido facturado");
      } else {
        throw new Error("No se pudo facturar pedido");
      }
    })
    .catch((error) => {
      console.error("Error al facturar pedido:", error);
      alert("No se pudo facturar pedido");
    });
}
