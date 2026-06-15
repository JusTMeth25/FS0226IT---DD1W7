class Libro {
  static contatore = 0;

  constructor(_titolo, _autore, _anno) {
    this.titolo = _titolo;
    this.autore = _autore;
    this.anno = _anno;
    this.letto = false;
    this.id = Libro.contatore++;
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
  const listaLibri = document.getElementById("lista-libri");
  const contatore = document.getElementById("contatore");

  listaLibri.replaceChildren();

  libri.map((l) => {
    const li = document.createElement("li");

    li.className = l.letto ? "letto" : "";
    li.dataset.id = l.id;

    const info = document.createElement("div");
    info.classList.add("info");

    info.append(document.createTextNode(l.titolo));
    info.append(document.createTextNode(" "));

    const badgeFormato = document.createElement("span");
    badgeFormato.classList.add("badge-formato");
    badgeFormato.append(document.createTextNode(l.formato()));

    const meta = document.createElement("div");
    meta.classList.add("meta");
    meta.append(document.createTextNode(`${l.autore} - ${l.anno}`));

    info.append(badgeFormato, meta);

    const azioni = document.createElement("div");
    azioni.classList.add("azioni");

    if (l.letto === false) {
      const btnLetto = document.createElement("button");
      btnLetto.dataset.azione = "leggi";
      btnLetto.append(document.createTextNode("Segna come letto"));
      azioni.append(btnLetto);
    } else {
      azioni.append(document.createTextNode("✅ letto"));
    }

    const btnRimuovi = document.createElement("button");
    btnRimuovi.dataset.azione = "Rimuovi";
    btnRimuovi.append(document.createTextNode("Rimuovi"));
    azioni.append(btnRimuovi);

    li.append(info, azioni);
    listaLibri.append(li);
  });

  if (contatore) {
    contatore.replaceChildren(document.createTextNode(`${libri.length}`));
  }
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
  const dimensioneMb = parseFloat(e.target.dimensione.value);
  const durataMinuti = parseInt(e.target.durata.value);

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
