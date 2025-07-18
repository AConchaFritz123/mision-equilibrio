// script.js

// Guardar datos del formulario en localStorage y pasar a la siguiente sección
document.getElementById('userForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const datos = {
    nombre: form.nombre.value,
    correo: form.correo.value,
    rut: form.rut.value
  };
  localStorage.setItem('usuarioEQ', JSON.stringify(datos));
  alert('¡Datos guardados! Continúa con la misión.');
  irA('introduccion');
});

// Guardar respuestas reflexivas
document.getElementById('reflexionForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const reflexiones = {
    importante: form.preg1.value,
    profundizar: form.preg2.value,
    aplicacion: form.preg3.value
  };
  localStorage.setItem('reflexionEQ', JSON.stringify(reflexiones));
  alert('Reflexiones guardadas. ¡Buen trabajo!');
});

// Navegar a otra sección por ID
function irA(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Generar certificado PDF
function generarCertificado() {
  const datos = JSON.parse(localStorage.getItem('usuarioEQ'));
  if (!datos || !datos.nombre) return alert('Faltan tus datos');

  const container = document.getElementById('certificadoContainer');
  container.innerHTML = `
    <div id="certificadoPDF" style="padding: 20px; border: 2px solid #333; text-align: center; width: 80%; margin: auto;">
      <h2>Certificado de Participación</h2>
      <p>Otorgado a <strong>${datos.nombre}</strong></p>
      <p>Por completar la cápsula educativa "Misión Equilibrio"</p>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
      <p>Profe Aida</p>
    </div>`;

  html2pdf().from(document.getElementById('certificadoPDF')).save(`${datos.nombre}_certificado.pdf`);
}

// Cargar preguntas en el momento adecuado del video
const preguntasVideo = [
  {
    tiempo: 30,
    pregunta: "¿Qué característica distingue al equilibrio químico dinámico?",
    opciones: [
      { texto: "Las concentraciones de productos e reactivos son iguales", correcta: false },
      { texto: "No ocurren reacciones en el sistema", correcta: false },
      { texto: "La reacción directa e inversa ocurren a igual velocidad", correcta: true },
      { texto: "Solo se produce producto", correcta: false }
    ]
  },
  {
    tiempo: 60,
    pregunta: "¿Qué representa la constante de equilibrio Kc?",
    opciones: [
      { texto: "La suma de las concentraciones en equilibrio", correcta: false },
      { texto: "La relación entre velocidad directa e inversa", correcta: false },
      { texto: "Una proporción entre las concentraciones de productos y reactivos en equilibrio", correcta: true },
      { texto: "El tiempo que tarda en alcanzarse el equilibrio", correcta: false }
    ]
  },
  {
    tiempo: 105,
    pregunta: "Según el Principio de Le Châtelier, ¿qué ocurre si aumentamos la concentración de un reactivo?",
    opciones: [
      { texto: "El sistema se descompone", correcta: false },
      { texto: "Se detiene la reacción", correcta: false },
      { texto: "El equilibrio se desplaza hacia los productos", correcta: true },
      { texto: "No ocurre ningún cambio", correcta: false }
    ]
  },
  {
    tiempo: 150,
    pregunta: "¿Qué ocurre con el valor de Kc si se cambia la concentración de los reactivos?",
    opciones: [
      { texto: "Kc cambia", correcta: false },
      { texto: "Kc se anula", correcta: false },
      { texto: "Kc permanece constante a temperatura constante", correcta: true },
      { texto: "Kc aumenta con más reactivos", correcta: false }
    ]
  },
  {
    tiempo: 200,
    pregunta: "¿Qué unidad tiene la constante de equilibrio Kc?",
    opciones: [
      { texto: "M (mol/L)", correcta: false },
      { texto: "No tiene unidad en algunos casos", correcta: true },
      { texto: "mol", correcta: false },
      { texto: "L", correcta: false }
    ]
  }
];

const player = new YT.Player('video', {
  events: {
    onReady: (event) => {
      setInterval(() => {
        const tiempo = Math.floor(event.target.getCurrentTime());
        const pregunta = preguntasVideo.find(p => p.tiempo === tiempo);
        if (pregunta && !pregunta.mostrada) {
          mostrarPregunta(pregunta);
          pregunta.mostrada = true;
        }
      }, 1000);
    }
  }
});

function mostrarPregunta(pregunta) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = `<div class="pregunta">
    <h3>${pregunta.pregunta}</h3>
    <ul>
      ${pregunta.opciones.map((op, i) => `<li><button onclick="verificarRespuesta(${op.correcta})">${op.texto}</button></li>`).join('')}
    </ul>
  </div>`;
}

function verificarRespuesta(correcta) {
  alert(correcta ? '✅ ¡Correcto!' : '❌ Intenta nuevamente.');
  document.getElementById('quiz-container').innerHTML = '';
}
