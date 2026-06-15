class Libro {
  static contatore = 0;

  constructor(_titolo, _autore, _anno) {
    this.id = ++Libro.contatore;
    this.titolo = _titolo;
    this.autore = _autore;
    this.anno = _anno;
    this.letto = false;
  }

  segnaComeLetto() {
    this.letto = true;
  }

  formato() {
    return "cartaceo";
  }
}

class LibroDigitale extends Libro {
  constructor(_titolo, _autore, _anno, _dimensioneMb) {
    super(_titolo, _autore, _anno);
    this.dimensioneMb = _dimensioneMb;
  }

  formato() {
    return `digitale (${this.dimensioneMb}MB)`;
  }
}

// === Stato ===
let libri = [];

// === Render ===
function renderLibri() {
  const html = libri
    .map(
      (l) =>
        `
        <li class="${l.letto ? "letto" : ""}" data-id="${l.id}">
            <div class="info">
                <span class="titolo">${l.titolo}</span>
                <span class="badge-formato">${l.formato()}</span>
            <div class="meta">${l.autore} - ${l.anno}</div>
            </div>
            <div class="azioni">
                ${l.letto ? "✓ letto" : '<button data-azione="leggi">Segna come letto</button>'}
                <button data-azione="Rimuovi">Rimuovi</button>
            </div>
            </li>
            `,
    )
    .join("");

  document.getElementById("lista-libri").innerHTML = html;
  document.getElementById("contatore").textContent = libri.length;
}

// === Mostra / nasconde campo dimensione ===
document.getElementById("formato").addEventListener("change", (e) => {
  if (e.target.value === "digitale") {
    document.getElementById("campo-dimensione").removeAttribute("hidden");
  } else {
    document.getElementById("campo-dimensione").setAttribute("hidden", "");
  }

  if (e.target.value === "audio") {
    document.getElementById("campo-durata").removeAttribute("hidden");
  } else {
    document.getElementById("campo-durata").setAttribute("hidden", "");
  }
});

// === Submit form ===
document.getElementById("aggiungi-libro").addEventListener("submit", (e) => {
  e.preventDefault();

  const titolo = e.target.titolo.value;
  const autore = e.target.autore.value;
  const anno = parseInt(e.target.anno.value);
  const formato = e.target.formato.value;
  const dimensioneMb = parseFloat(e.target.dimensione.value) || 0;
  const durataMinuti = parseInt(e.target.durata.value) || 0;

  let nuovoLibro;

  if (formato === "digitale") {
    nuovoLibro = new LibroDigitale(titolo, autore, anno, dimensioneMb);
  } else if (formato === "audio") {
    nuovoLibro = new LibroAudio(titolo, autore, anno, durataMinuti);
  } else {
    nuovoLibro = new Libro(titolo, autore, anno);
  }

  libri.push(nuovoLibro);
  renderLibri();

  e.target.reset();
  document.getElementById("campo-dimensione").setAttribute("hidden", "");
});

// === Event delegation lista libri ===
document.getElementById("lista-libri").addEventListener("click", (e) => {
  const azione = e.target.dataset.azione;

  if (!azione) return;

  const li = e.target.closest("li");
  const idLibro = parseInt(li.dataset.id);

  if (azione === "leggi") {
    const libro = libri.find((l) => l.id === idLibro);

    if (libro) {
      libro.segnaComeLetto();
      renderLibri();
    }
  }

  if (azione === "Rimuovi") {
    libri = libri.filter((l) => l.id !== idLibro);
    renderLibri();
  }
});

class LibroAudio extends Libro {
  constructor(_titolo, _autore, _anno, _durataMinuti) {
    super(_titolo, _autore, _anno);
    this.durataMinuti = _durataMinuti;
  }

  formato() {
    return `audio (${this.durataMinuti} minuti)`;
  }
}
