// =========================
// COUNTDOWN IN GIORNI
// =========================

const giorniElemento =
  document.getElementById("giorni-mancanti");

function aggiornaCountdown() {
  const oggi = new Date();

  // Confronto tramite UTC per evitare errori dovuti
  // all'ora legale o all'orario del dispositivo.
  const oggiUTC = Date.UTC(
    oggi.getFullYear(),
    oggi.getMonth(),
    oggi.getDate()
  );

  const matrimonioUTC = Date.UTC(
    2026,
    8,  // Settembre: i mesi partono da 0
    18
  );

  const millisecondiInUnGiorno =
    1000 * 60 * 60 * 24;

  const differenza =
    matrimonioUTC - oggiUTC;

  const giorni =
    Math.ceil(
      differenza / millisecondiInUnGiorno
    );

  if (!giorniElemento) {
    return;
  }

  if (giorni > 0) {
    giorniElemento.textContent = giorni;
  } else {
    giorniElemento.textContent = "0";
  }
}

// Calcolo immediato
aggiornaCountdown();

// Ricontrollo ogni ora
setInterval(
  aggiornaCountdown,
  60 * 60 * 1000
);


// =========================
// MENU HAMBURGER
// =========================

const menuButton =
  document.getElementById("menu-button");

const menuOverlay =
  document.getElementById("menu-overlay");

const menuClose =
  document.getElementById("menu-close");

const menuLinks =
  document.querySelectorAll(".menu-nav a");

if (menuButton && menuOverlay) {
  menuButton.addEventListener(
    "click",
    function () {
      menuOverlay.classList.add("aperto");
      document.body.classList.add("menu-aperto");
    }
  );
}

if (menuClose && menuOverlay) {
  menuClose.addEventListener(
    "click",
    function () {
      chiudiMenu();
    }
  );
}

menuLinks.forEach(
  function (link) {
    link.addEventListener(
      "click",
      function () {
        chiudiMenu();
      }
    );
  }
);

function chiudiMenu() {
  if (!menuOverlay) {
    return;
  }

  menuOverlay.classList.remove("aperto");
  document.body.classList.remove("menu-aperto");
}

// Chiude il menu premendo Esc
document.addEventListener(
  "keydown",
  function (evento) {
    if (evento.key === "Escape") {
      chiudiMenu();
    }
  }
);


// =========================
// MODULO RSVP + GOOGLE SHEET
// =========================

const form =
  document.getElementById("form-conferma");

const gruppoInvitati =
  document.getElementById(
    "gruppo-invitati"
  );

const numeroAdultiCampo =
  document.getElementById(
    "numero-adulti"
  );

const numeroBambiniCampo =
  document.getElementById(
    "numero-bambini"
  );

const radioPresenza =
  document.querySelectorAll(
    'input[name="presenza"]'
  );

const messaggio =
  document.getElementById("messaggio-form");

const urlGoogleScript =
  "https://script.google.com/macros/s/AKfycbzzd8NGV2kz6YQ6bi5GPPTdTAkwzaQpbs4dCwcnJzzsxaqZ10r8G3H5gjgwLtwT30RbAQ/exec";

radioPresenza.forEach(
  function (radio) {

    radio.addEventListener(
      "change",
      function () {

        if (
          radio.checked &&
          radio.value === "Parteciperò"
        ) {

          gruppoInvitati
            .classList
            .add("visibile");

          numeroAdultiCampo.required = true;

        }


        if (
          radio.checked &&
          radio.value ===
            "Non potrò partecipare"
        ) {

          gruppoInvitati
            .classList
            .remove("visibile");

          numeroAdultiCampo.required = false;

          numeroAdultiCampo.value = "";

          numeroBambiniCampo.value = "0";

        }

      }
    );

  }
);

if (form && messaggio) {
  form.addEventListener(
    "submit",
    async function (evento) {
      evento.preventDefault();

      const nomeCampo =
        document.getElementById("nome");

      const noteCampo =
        document.getElementById("note");

      const presenzaSelezionata =
        document.querySelector(
          'input[name="presenza"]:checked'
        );

      const nome =
        nomeCampo.value.trim();

      const note =
        noteCampo.value.trim();

      if (nome === "") {
        messaggio.textContent =
          "Inserisci il tuo nome e cognome.";

        nomeCampo.focus();
        return;
      }

      if (!presenzaSelezionata) {
        messaggio.textContent =
          "Seleziona se parteciperai oppure no.";

        return;
      }

      let numeroAdulti = "0";
let numeroBambini = "0";


if (
  presenzaSelezionata.value ===
  "Parteciperò"
) {

  numeroAdulti =
    numeroAdultiCampo.value;

  numeroBambini =
    numeroBambiniCampo.value;


  if (!numeroAdulti) {

    messaggio.textContent =
      "Seleziona il numero di adulti.";

    return;

  }

}

      const dati = {
  nome: nome,
  presenza: presenzaSelezionata.value,
  numeroAdulti: numeroAdulti,
  numeroBambini: numeroBambini,
  note: note
};

      const pulsanteInvia =
        form.querySelector(
          'button[type="submit"]'
        );

      messaggio.textContent =
        "Invio in corso...";

      if (pulsanteInvia) {
        pulsanteInvia.disabled = true;
        pulsanteInvia.textContent =
          "Invio...";
      }

      try {
        await fetch(
          urlGoogleScript,
          {
            method: "POST",
            mode: "no-cors",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(dati)
          }
        );

        messaggio.textContent =
          "Grazie " +
          nome +
          "! La tua risposta è stata registrata ❤️";

        form.reset();
      } catch (errore) {
        console.error(
          "Errore durante l'invio:",
          errore
        );

        gruppoInvitati
  .classList
  .remove("visibile");

numeroAdultiCampo.required = false;

numeroAdultiCampo.value = "";

numeroBambiniCampo.value = "0";

        messaggio.textContent =
          "Si è verificato un errore. Riprova.";
      } finally {
        if (pulsanteInvia) {
          pulsanteInvia.disabled = false;
          pulsanteInvia.textContent =
            "Invia";
        }
      }
    }
  );
}


// =========================
// ANIMAZIONI DURANTE LO SCROLL
// =========================

const sezioni =
  document.querySelectorAll(".pagina");

const home =
  document.getElementById("home");

// La Home deve essere visibile immediatamente.
if (home) {
  home.classList.add("visibile");
}

if ("IntersectionObserver" in window) {
  const observer =
    new IntersectionObserver(
      function (entries) {
        entries.forEach(
          function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visibile"
              );
            }
          }
        );
      },
      {
        threshold: 0.25
      }
    );

  sezioni.forEach(
    function (sezione) {
      observer.observe(sezione);
    }
  );
} else {
  // Compatibilità con browser meno recenti.
  sezioni.forEach(
    function (sezione) {
      sezione.classList.add("visibile");
    }
  );
}


// =========================
// TRANSIZIONE HOME → INVITO
// =========================

const invito =
  document.getElementById("invito");

const pulsanteApriInvito =
  document.getElementById("apri-invito");

const transizioneHome =
  document.getElementById("transizione-home");

let aperturaInCorso = false;

if (
  home &&
  invito &&
  pulsanteApriInvito &&
  transizioneHome
) {
  pulsanteApriInvito.addEventListener(
    "click",
    function (evento) {
      evento.preventDefault();

      if (aperturaInCorso) {
        return;
      }

      aperturaInCorso = true;

      // Blocca temporaneamente lo scroll.
      document.body.classList.add(
        "transizione-in-corso"
      );

      // Avvia l'apertura delle due metà.
      home.classList.add(
        "apertura-attiva"
      );

      // Mostra l'invito sotto la Home.
      invito.classList.add(
        "invito-pronto"
      );

      // Quando le ante sono quasi aperte,
      // porta la pagina all'invito senza animazione aggiuntiva.
      setTimeout(
        function () {
          window.scrollTo({
            top: invito.offsetTop,
            behavior: "auto"
          });

          transizioneHome.classList.add(
            "transizione-finita"
          );

          document.body.classList.remove(
            "transizione-in-corso"
          );
        },
        1250
      );
    }
  );
}