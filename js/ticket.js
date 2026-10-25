// Configuración de la sala
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const vipRows = ['F', 'G', 'H'];
  
  // Asientos previamente ocupados (Ejemplo: Fila B asientos 3 y 4)
  const occupiedSeats = ['B3', 'B4', 'C5', 'C6', 'D9', 'D10', 'G5', 'G6'];

  // Almacenar asientos seleccionados por el usuario
  const selectedSeats = new Set();

  const seatsGrid = document.getElementById('seatsGrid');

  // Generar la matriz de asientos dinámicamente
  rows.forEach(rowLetter => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('seat-row');

    // Etiqueta Izquierda
    rowElement.innerHTML += `<div class="row-label">${rowLetter}</div>`;

    // Bloque 1: Asientos 1 a 4
    rowElement.appendChild(createBlock(rowLetter, 1, 4));
    
    // Pasillo 1
    rowElement.innerHTML += `<div class="block-divider"></div>`;

    // Bloque 2: Asientos 5 a 8
    rowElement.appendChild(createBlock(rowLetter, 5, 8));

    // Pasillo 2
    rowElement.innerHTML += `<div class="block-divider"></div>`;

    // Bloque 3: Asientos 9 a 12
    rowElement.appendChild(createBlock(rowLetter, 9, 12));

    // Etiqueta Derecha
    rowElement.innerHTML += `<div class="row-label">${rowLetter}</div>`;

    seatsGrid.appendChild(rowElement);
  });

  // Función para crear un bloque de asientos
  function createBlock(rowLetter, startNum, endNum) {
    const block = document.createElement('div');
    block.classList.add('seat-block');

    for (let i = startNum; i <= endNum; i++) {
      const seatId = `${rowLetter}${i}`;
      const seatBtn = document.createElement('button');
      seatBtn.classList.add('seat');
      seatBtn.dataset.seatId = seatId;

      const isVIP = vipRows.includes(rowLetter);
      const isOccupied = occupiedSeats.includes(seatId);

      if (isVIP) seatBtn.classList.add('vip');

      if (isOccupied) {
        seatBtn.classList.add('occupied');
        seatBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
      } else {
        seatBtn.innerText = i;
        // Evento de selección múltiple
        seatBtn.addEventListener('click', () => toggleSeatSelection(seatBtn, seatId));
      }

      block.appendChild(seatBtn);
    }

    return block;
  }

  // Lógica para seleccionar/deseleccionar asientos
  function toggleSeatSelection(seatBtn, seatId) {
    if (selectedSeats.has(seatId)) {
      selectedSeats.delete(seatId);
      seatBtn.classList.remove('selected');
    } else {
      selectedSeats.add(seatId);
      seatBtn.classList.add('selected');
    }

    // Aquí puedes emitir los asientos elegidos a tu backend o formulario:
    console.log('Asientos seleccionados:', Array.from(selectedSeats));
  }