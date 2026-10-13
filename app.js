

const APP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwYLW4FlhRWhc58tuZu-s1cgpMbvtyjmcuCQd5DMTrDsmRdAa45wb6w44UUFMyeiuE/exec";


document.getElementById("currentYear").textContent = new Date().getFullYear();

const loginForm =
  document.getElementById("loginForm");


function updateCurrentDate() {
  const parts =
    new Intl.DateTimeFormat(
      "es-MX",
      {
        timeZone: "America/Mazatlan",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }
    ).formatToParts(new Date());

  const getPart = function(type) {
    return parts.find(function(part) {
      return part.type === type;
    }).value;
  };

  const weekday = getPart("weekday");

  document
    .getElementById("todayWeekday")
    .textContent =
      weekday.charAt(0).toLocaleUpperCase("es-MX") +
      weekday.slice(1);

  document
    .getElementById("todayDate")
    .textContent =
      getPart("day") +
      " de " +
      getPart("month") +
      ", " +
      getPart("year") +
      " · " +
      getPart("hour") +
      ":" +
      getPart("minute");
}


updateCurrentDate();
setInterval(updateCurrentDate, 60 * 1000);


loginForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const correo =
      document
        .getElementById("usuario")
        .value
        .trim();


    const contrasena =
      document
        .getElementById("password")
        .value;


    const boton =
      loginForm.querySelector("button");


    if (!correo || !contrasena) {

      alert(
        "Ingresa tu usuario y contraseña."
      );

      return;
    }


    boton.disabled = true;

    boton.textContent =
      "Validando...";


    try {


      const respuesta =
        await fetch(
          APP_SCRIPT_URL,
          {
            method: "POST",

            body:
              new URLSearchParams({
                correo: correo,
                contrasena: contrasena
              })
          }
        );


      const resultado =
        await respuesta.json();


      if (resultado.ok) {


        /* DATOS DEL USUARIO */

        const usuario =
          resultado.usuario;

        document
          .getElementById(
            "welcomeName"
          )
          .textContent =
            usuario.nombre
              .split(" ")[0];


        document
          .getElementById(
            "dashboardUserName"
          )
          .textContent =
            usuario.nombre;


        document
          .getElementById(
            "dashboardUserRole"
          )
          .textContent =
            usuario.rol;


        /* INICIALES */

        const nombres =
          usuario.nombre
            .trim()
            .split(" ");


        let iniciales = "";


        if (nombres.length >= 2) {

          iniciales =
            nombres[0].charAt(0) +
            nombres[1].charAt(0);

        } else {

          iniciales =
            nombres[0].charAt(0);

        }


        document
          .getElementById(
            "dashboardAvatar"
          )
          .textContent =
            iniciales.toUpperCase();


        /* CAMBIAR DE LOGIN A DASHBOARD */

        document
          .getElementById(
            "loginPage"
          )
          .style.display =
            "none";


        document
          .getElementById(
            "dashboardPage"
          )
          .style.display =
            "block";


        /* LIMPIAR FORMULARIO */

        loginForm.reset();


      } else {


        alert(
          resultado.mensaje ||
          "Correo o contraseña incorrectos."
        );

      }


    } catch (error) {


      console.error(error);


      alert(
        "No fue posible conectar con el servidor."
      );


    } finally {


      boton.disabled = false;

      boton.textContent =
        "Ingresar al Portal →";

    }

  }
);



/* =====================================================
   CERRAR SESIÓN
===================================================== */

document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    function() {

      document
        .getElementById(
          "dashboardPage"
        )
        .style.display =
          "none";


      document
        .getElementById(
          "loginPage"
        )
        .style.display =
          "grid";

    }
  );


/* =====================================================
   CASOS WEBFLEET - DATOS DE DEMOSTRACIÓN
===================================================== */

const caseDemoCapture = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520"><rect width="900" height="520" fill="#eef4f1"/><rect x="28" y="28" width="844" height="464" rx="20" fill="#fff" stroke="#dce7e1" stroke-width="3"/><rect x="28" y="28" width="844" height="58" rx="20" fill="#063d31"/><circle cx="62" cy="57" r="8" fill="#a8f23d"/><text x="88" y="64" fill="#fff" font-family="Arial,sans-serif" font-size="22" font-weight="700">WEBFLEET · Evidencia de envío</text><rect x="66" y="120" width="768" height="310" rx="14" fill="#f7faf8" stroke="#e3ebe7"/><path d="M128 346h610M190 296h485M247 246h373M311 196h246" stroke="#d3dfd9" stroke-width="18" stroke-linecap="round"/><circle cx="690" cy="184" r="36" fill="#eaf8ef"/><path d="m673 184 12 12 23-27" fill="none" stroke="#22c55e" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><text x="68" y="465" fill="#65756d" font-family="Arial,sans-serif" font-size="17">Captura ilustrativa de la confirmación del caso</text></svg>'
);

function demoCaseDateInCurrentMonth(index, hour) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), 1 + (index % now.getDate()));
  if (date.getDate() === now.getDate()) date.setTime(now.getTime() - 5 * 60 * 1000);
  else date.setHours(hour || 9, (index * 7) % 60, 0, 0);
  return date.toISOString();
}

function demoCaseDateInPreviousMonth(index, hour) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() - 1, 1 + index);
  date.setHours(hour || 9, index * 11 % 60, 0, 0);
  return date.toISOString();
}

const demoClientCatalog = [
  "DISTRIBUIDORA INTERNACIONAL PENINSULAR",
  "FLETAMENTO INTEGRAL",
  "ENLACE FRONTERIZO TERRESTRE",
  "ENLACES TERRESTRES MAF",
  "ENLACES TERRESTRES RGC",
  "TRITURADOS GARVAL"
];
const demoDeviceCatalog = ["LINK 740", "LINK 340", "LINK 530", "LBOX", "Teltonika"];
const whatsappRequestTypes = ["Seguimiento", "Posición -10m", "Corte activar", "Corte Desactivar", "Servicio S_T", "Desvinculado lbox", "Sin conexión"];
const whatsappResponsibleCatalog = ["Oscar A. Hernández", "Said Lugo", "Alex Cedillo", "Milton Pérez"];
const whatsappStatusOrder = ["Pendiente", "Resuelto", "Escalado a Freshservice"];

function demoWhatsAppDate(daysAgo, hour) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, hour || 9, (daysAgo * 7) % 60, 0, 0);
  return date.toISOString();
}

const demoCases = [
  { id: "WF-2026-1048", days: 0, hour: 10, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", unit: "TR-204", reason: "Alerta de motor, diagnóstico", device: "LINK 740", status: "Pendiente", brief: "El operador reporta alerta intermitente al encender.", description: "El operador reportó que el testigo de motor aparece de forma intermitente al encender la unidad. Se solicitó revisar códigos de falla y enviar evidencia del tablero.", capture: caseDemoCapture },
  { id: "WF-2026-1047", days: 1, hour: 16, client: "FLETAMENTO INTEGRAL", unit: "LS-118", reason: "Sin transmisión de posición", device: "LINK 340", status: "Segunda Línea", brief: "La unidad dejó de reportar posiciones desde la tarde.", description: "La unidad dejó de transmitir posiciones después de una parada programada. SAC verificó alimentación y reinicio remoto; se escala para diagnóstico de dispositivo." },
  { id: "WF-2026-1046", days: 2, hour: 12, client: "ENLACE FRONTERIZO TERRESTRE", unit: "CE-032", reason: "Instalación de dispositivo", device: "LINK 530", status: "Resuelto", brief: "Solicitud de alta de una unidad nueva.", description: "Se completó el alta del dispositivo y la asignación al vehículo. El cliente confirmó que la unidad aparece correctamente en su plataforma." },
  { id: "WF-2026-1045", days: 3, hour: 8, client: "ENLACES TERRESTRES MAF", unit: "DP-221", reason: "Geocerca no detectada", device: "LBOX", status: "Pendiente", brief: "El aviso de llegada no se generó en destino.", description: "El cliente solicita revisar una geocerca que no generó el aviso de llegada. Se está validando el radio configurado y el historial de posiciones." },
  { id: "WF-2026-1044", days: 4, hour: 14, client: "ENLACES TERRESTRES RGC", unit: "TR-219", reason: "Lectura de odómetro", device: "Teltonika", status: "Resuelto", brief: "Consulta sobre diferencia en kilometraje.", description: "Se explicó al cliente el origen de la diferencia entre lectura GPS y tablero. El caso se cerró después de su confirmación." },
  { id: "WF-2026-1043", days: 5, hour: 11, client: "TRITURADOS GARVAL", unit: "AV-057", reason: "Alerta de batería", device: "LINK 740", status: "Segunda Línea", brief: "La alerta permanece activa pese a la revisión inicial.", description: "Se verificó el voltaje reportado y la configuración de alertas. Se envían registros al equipo técnico para revisar el umbral del dispositivo." },
  { id: "WF-2026-1042", days: 6, hour: 9, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", unit: "LS-126", reason: "Usuario y permisos", device: "LINK 340", status: "Resuelto", brief: "Alta de acceso para un supervisor de flota.", description: "Se habilitó el acceso solicitado con permisos de consulta para las unidades asignadas al supervisor." },
  { id: "WF-2026-1041", days: 7, hour: 17, client: "FLETAMENTO INTEGRAL", unit: "CE-041", reason: "Identificación de conductor", device: "LINK 530", status: "Pendiente", brief: "El identificador no aparece asociado al viaje.", description: "El cliente indica que el conductor realizó el registro, pero el nombre no aparece en el viaje. Se solicitaron fecha y hora para validar los eventos." },
  { id: "WF-2026-1040", days: 8, hour: 13, client: "ENLACE FRONTERIZO TERRESTRE", unit: "DP-238", reason: "Reporte de recorrido", device: "LBOX", status: "Resuelto", brief: "Apoyo para descargar recorrido semanal.", description: "Se compartieron los pasos para generar y descargar el reporte de recorrido semanal desde Webfleet." },
  { id: "WF-2026-1039", days: 9, hour: 10, client: "ENLACES TERRESTRES MAF", unit: "AV-063", reason: "Dispositivo desconectado", device: "Teltonika", status: "Segunda Línea", brief: "La unidad no recuperó conexión después de reinicio.", description: "Se confirmó pérdida de comunicación persistente. El caso pasa a Segunda Línea para validar instalación y estado del módem." },
  { id: "WF-2026-1038", days: 10, hour: 15, client: "ENLACES TERRESTRES RGC", unit: "TR-228", reason: "Configuración de alertas", device: "LINK 740", status: "Resuelto", brief: "Ajuste de avisos para exceso de velocidad.", description: "Se actualizó el destinatario de la alerta y se comprobó el envío de una notificación de prueba." },
  { id: "WF-2026-1037", days: 11, hour: 8, client: "TRITURADOS GARVAL", unit: "LS-132", reason: "Posición incorrecta", device: "LINK 340", status: "Pendiente", brief: "La ubicación aparece desplazada respecto a la carretera.", description: "Se revisará la calidad de señal GPS y el comportamiento del equipo durante el siguiente recorrido." },
  { id: "WF-2026-1036", days: 12, hour: 12, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", unit: "CE-052", reason: "Consulta de combustible", device: "LINK 530", status: "Resuelto", brief: "Duda sobre la gráfica de nivel de combustible.", description: "Se aclaró el periodo de actualización de la gráfica y se compartió la guía de lectura del sensor." },
  { id: "WF-2026-1035", days: 13, hour: 16, client: "FLETAMENTO INTEGRAL", unit: "DP-249", reason: "Mantenimiento de unidad", device: "LBOX", status: "Resuelto", brief: "Recordatorio de mantenimiento no actualizado.", description: "Se corrigió el intervalo de mantenimiento y se confirmó la próxima fecha de servicio con el cliente." },
  { id: "WF-2026-1034", days: 14, hour: 9, client: "ENLACE FRONTERIZO TERRESTRE", unit: "AV-071", reason: "Sin transmisión de posición", device: "Teltonika", status: "Pendiente", brief: "Se perdió comunicación durante la ruta nocturna.", description: "La última posición recibida corresponde al inicio de la ruta. Se mantiene seguimiento hasta que la unidad vuelva a reportar." },
  { id: "WF-2026-1033", days: 16, hour: 11, client: "ENLACES TERRESTRES MAF", unit: "TR-241", reason: "Acceso a plataforma", device: "LINK 740", status: "Resuelto", brief: "Restablecimiento de acceso de usuario.", description: "Se guio al usuario durante el restablecimiento de contraseña y se validó su acceso a Webfleet." },
  { id: "WF-2026-1032", days: 18, hour: 14, client: "ENLACES TERRESTRES RGC", unit: "LS-144", reason: "Geocerca no detectada", device: "LINK 340", status: "Segunda Línea", brief: "No se generó evento en la salida de planta.", description: "Se confirmó que la posición cruzó el perímetro configurado. Se escala para revisar tiempos de permanencia y zona." },
  { id: "WF-2026-1031", days: 21, hour: 10, client: "TRITURADOS GARVAL", unit: "CE-064", reason: "Lectura de odómetro", device: "LINK 530", status: "Resuelto", brief: "Actualización de lectura tras cambio de tablero.", description: "Se actualizó la lectura de referencia con la evidencia enviada por el cliente." },
  { id: "WF-2026-1030", days: 24, hour: 13, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", unit: "DP-257", reason: "Alerta de motor", device: "LBOX", status: "Pendiente", brief: "Se solicita identificar el código de alerta mostrado.", description: "Se pidió una captura del código y datos del vehículo para continuar con la revisión del evento." },
  { id: "WF-2026-1029", days: 27, hour: 16, client: "FLETAMENTO INTEGRAL", unit: "AV-083", reason: "Identificación de conductor", device: "Teltonika", status: "Resuelto", brief: "El conductor quedó asignado al vehículo equivocado.", description: "Se corrigió la asociación del conductor y se validó con el administrador de flota." },
  { id: "WF-2026-1028", days: 34, hour: 9, client: "ENLACE FRONTERIZO TERRESTRE", unit: "TR-193", reason: "Dispositivo desconectado", device: "LINK 740", status: "Pendiente", brief: "Reporte de desconexión recibido al inicio del mes anterior.", description: "Se mantiene el caso abierto mientras el cliente coordina acceso a la unidad para revisar la instalación." },
  { id: "WF-2026-1027", days: 38, hour: 12, client: "ENLACES TERRESTRES MAF", unit: "LS-109", reason: "Configuración de alertas", device: "LINK 340", status: "Resuelto", brief: "Se solicitó cambiar el contacto de notificaciones.", description: "Se actualizaron los contactos de notificación y el cliente confirmó que recibió el aviso de prueba." },
  { id: "WF-2026-1026", days: 42, hour: 15, client: "ENLACES TERRESTRES RGC", unit: "CE-025", reason: "Consulta de combustible", device: "LINK 530", status: "Segunda Línea", brief: "Variación inusual en el nivel detectada durante una parada.", description: "Se requiere revisar la calibración del sensor y la curva de lectura asociada al tanque." },
  { id: "WF-2026-1025", days: 47, hour: 10, client: "TRITURADOS GARVAL", unit: "DP-211", reason: "Reporte de recorrido", device: "LBOX", status: "Resuelto", brief: "Solicitud de reporte mensual de actividad.", description: "Se generó el reporte del periodo solicitado y se compartió con el contacto registrado." },
  { id: "WF-2026-1024", days: 55, hour: 8, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", unit: "AV-048", reason: "Posición incorrecta", device: "Teltonika", status: "Resuelto", brief: "Se revisó un salto de posición reportado en carretera.", description: "El salto se relacionó con una interrupción temporal de señal. El cliente confirmó el seguimiento correcto posterior." },
  { id: "WF-2026-1023", days: 65, hour: 11, client: "FLETAMENTO INTEGRAL", unit: "TR-177", reason: "Instalación de dispositivo", device: "LINK 740", status: "Pendiente", brief: "Coordinación para instalar equipo en una nueva unidad.", description: "Pendiente confirmar fecha de instalación y disponibilidad de la unidad." },
  { id: "WF-2026-1022", days: 75, hour: 14, client: "ENLACE FRONTERIZO TERRESTRE", unit: "LS-098", reason: "Mantenimiento de unidad", device: "LINK 340", status: "Resuelto", brief: "Consulta sobre el historial de servicios registrados.", description: "Se orientó al cliente sobre el historial y el calendario de mantenimiento." },
  { id: "WF-2026-1021", days: 91, hour: 9, client: "ENLACES TERRESTRES MAF", unit: "CE-018", reason: "Acceso a plataforma", device: "LINK 530", status: "Resuelto", brief: "Alta de acceso para personal de monitoreo.", description: "Se creó el usuario de monitoreo y se confirmaron los permisos requeridos." },
  { id: "WF-2026-130", days: 5, hour: 10, client: "ENLACES TERRESTRES RGC", unit: "CE-130", reason: "Alerta de motor", device: "LBOX", status: "Pendiente", brief: "Revisar alerta reportada por el cliente.", description: "El cliente solicita validar la alerta de motor y confirmar el diagnóstico.", createdBy: "José Flores" }
].map(function(item, index) {
  return {
    id: item.id,
    registeredAt: (index < 26 || item.id === "WF-2026-130")
      ? demoCaseDateInCurrentMonth(index, item.hour)
      : demoCaseDateInPreviousMonth(index - 26, item.hour),
    client: item.client,
    unit: item.unit,
    reason: item.reason,
    device: item.device,
    status: item.status,
    brief: item.brief || "",
    description: item.description,
    capture: item.capture || "",
    createdBy: item.createdBy || (index % 2 ? "José Flores" : "Oscar A. Hernández")
  };
});

const demoWhatsAppRequests = [
  { id: "WA-001", daysAgo: 0, hour: 9, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", requestType: "Seguimiento", unit: "DIP-204", device: "LINK 740", description: "Solicita seguimiento a la ruta que salió de Mérida esta mañana.", responsible: "Oscar A. Hernández", status: "Pendiente" },
  { id: "WA-002", daysAgo: 1, hour: 11, client: "FLETAMENTO INTEGRAL", requestType: "Posición -10m", unit: "FI-118", device: "LINK 340", description: "La posición de la unidad presenta un retraso de diez minutos.", responsible: "Said Lugo", status: "Escalado a Freshservice" },
  { id: "WA-003", daysAgo: 2, hour: 13, client: "ENLACE FRONTERIZO TERRESTRE", requestType: "Corte activar", unit: "EFT-032", device: "LINK 530", description: "Solicita activar el corte de combustible de la unidad.", responsible: "Alex Cedillo", status: "Resuelto" },
  { id: "WA-004", daysAgo: 3, hour: 8, client: "ENLACES TERRESTRES MAF", requestType: "Corte Desactivar", unit: "MAF-221", device: "LBOX", description: "El cliente solicita desactivar el corte para continuar el viaje.", responsible: "Milton Pérez", status: "Pendiente" },
  { id: "WA-005", daysAgo: 4, hour: 14, client: "ENLACES TERRESTRES RGC", requestType: "Servicio S_T", unit: "RGC-219", device: "Teltonika", description: "Requiere apoyo para programar el servicio solicitado.", responsible: "Oscar A. Hernández", status: "Escalado a Freshservice" },
  { id: "WA-006", daysAgo: 5, hour: 10, client: "TRITURADOS GARVAL", requestType: "Desvinculado lbox", unit: "TG-057", device: "LBOX", description: "El equipo LBOX aparece desvinculado de la unidad.", responsible: "Said Lugo", status: "Pendiente" },
  { id: "WA-007", daysAgo: 6, hour: 16, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", requestType: "Sin conexión", unit: "DIP-126", device: "LINK 740", description: "La unidad no muestra conexión desde el último recorrido.", responsible: "Alex Cedillo", status: "Resuelto" },
  { id: "WA-008", daysAgo: 7, hour: 9, client: "FLETAMENTO INTEGRAL", requestType: "Seguimiento", unit: "FI-041", device: "LINK 340", description: "Solicita confirmar el avance de la entrega en destino.", responsible: "Milton Pérez", status: "Pendiente" },
  { id: "WA-009", daysAgo: 8, hour: 12, client: "ENLACE FRONTERIZO TERRESTRE", requestType: "Posición -10m", unit: "EFT-238", device: "LINK 530", description: "La plataforma refleja una posición con diez minutos de demora.", responsible: "Oscar A. Hernández", status: "Escalado a Freshservice" },
  { id: "WA-010", daysAgo: 9, hour: 15, client: "ENLACES TERRESTRES MAF", requestType: "Corte activar", unit: "MAF-063", device: "Teltonika", description: "Confirma el folio de autorización para activar el corte.", responsible: "Said Lugo", status: "Resuelto" },
  { id: "WA-011", daysAgo: 10, hour: 10, client: "ENLACES TERRESTRES RGC", requestType: "Corte Desactivar", unit: "RGC-228", device: "LINK 740", description: "Solicita reactivar la unidad después de concluir la maniobra.", responsible: "Alex Cedillo", status: "Pendiente" },
  { id: "WA-012", daysAgo: 18, hour: 11, client: "TRITURADOS GARVAL", requestType: "Servicio S_T", unit: "TG-132", device: "LINK 340", description: "Consulta el estado del servicio técnico solicitado.", responsible: "Milton Pérez", status: "Resuelto" },
  { id: "WA-013", daysAgo: 35, hour: 9, client: "DISTRIBUIDORA INTERNACIONAL PENINSULAR", requestType: "Desvinculado lbox", unit: "DIP-144", device: "LBOX", description: "Reporta que la asociación del LBOX dejó de aparecer.", responsible: "Oscar A. Hernández", status: "Pendiente" },
  { id: "WA-014", daysAgo: 42, hour: 14, client: "FLETAMENTO INTEGRAL", requestType: "Sin conexión", unit: "FI-064", device: "LINK 530", description: "Sin conexión con la unidad desde el inicio del turno.", responsible: "Said Lugo", status: "Escalado a Freshservice" },
  { id: "WA-015", daysAgo: 51, hour: 10, client: "ENLACE FRONTERIZO TERRESTRE", requestType: "Seguimiento", unit: "EFT-249", device: "LINK 740", description: "Solicita una actualización sobre la solicitud abierta.", responsible: "Alex Cedillo", status: "Resuelto" },
  { id: "WA-016", daysAgo: 64, hour: 13, client: "ENLACES TERRESTRES MAF", requestType: "Posición -10m", unit: "MAF-071", device: "", description: "La unidad continúa reportando posiciones con demora.", responsible: "Milton Pérez", status: "Pendiente" },
  { id: "WA-017", daysAgo: 78, hour: 8, client: "ENLACES TERRESTRES RGC", requestType: "Corte activar", unit: "RGC-083", device: "LINK 340", description: "Solicita revisar el corte remoto reportado en la unidad.", responsible: "Oscar A. Hernández", status: "Escalado a Freshservice" },
  { id: "WA-018", daysAgo: 92, hour: 12, client: "TRITURADOS GARVAL", requestType: "Sin conexión", unit: "TG-193", device: "", description: "No se recibe comunicación de la unidad desde ayer.", responsible: "Said Lugo", status: "Resuelto" }
].map(function(item) {
  return {
    id: item.id,
    registeredAt: demoWhatsAppDate(item.daysAgo, item.hour),
    client: item.client,
    requestType: item.requestType,
    unit: item.unit,
    device: item.device,
    description: item.description,
    responsible: item.responsible,
    status: item.status,
    createdBy: item.id === "WA-006" ? "Said Lugo" : "Oscar A. Hernández"
  };
});

const caseState = { page: 1, pageSize: 10, results: [], view: "all" };
const caseStatusOrder = ["Pendiente", "Segunda Línea", "Resuelto"];
const caseFilterElements = ["casePeriod", "caseSpecificMonth", "caseClient", "caseDevice", "caseStatus", "caseRegisteredBy"];

function getCurrentCaseUser() {
  return document.getElementById("dashboardUserName").textContent.trim();
}

function isCaseAdministrator() {
  return /admin/i.test(document.getElementById("dashboardUserRole").textContent.trim());
}

function isCaseOwnedByCurrentUser(item) {
  const owner = item && item.createdBy;
  return Boolean(owner && owner.toLocaleLowerCase("es-MX") === getCurrentCaseUser().toLocaleLowerCase("es-MX"));
}

function escapeCaseHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function(character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
  });
}

function fillCaseOptions(elementId, values) {
  const select = document.getElementById(elementId);
  values.forEach(function(value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

fillCaseOptions("caseClient", demoClientCatalog);
fillCaseOptions("caseDevice", demoDeviceCatalog);
fillCaseOptions("caseStatus", caseStatusOrder);
fillCaseOptions("caseRegisteredBy", Array.from(new Set(demoCases.map(function(item) { return item.createdBy; }).filter(Boolean))).sort());
fillCaseOptions("whatsappClient", demoClientCatalog);
fillCaseOptions("whatsappType", whatsappRequestTypes);
fillCaseOptions("whatsappDevice", demoDeviceCatalog);
fillCaseOptions("whatsappStatus", whatsappStatusOrder);
fillCaseOptions("whatsappResponsible", whatsappResponsibleCatalog);
fillCaseOptions("newWhatsAppClient", demoClientCatalog);
fillCaseOptions("newWhatsAppType", whatsappRequestTypes);
fillCaseOptions("newWhatsAppDevice", demoDeviceCatalog);

/* Componente común para menús select, con valor nativo sincronizado. */
let activeInrouteSelect = null;
let inrouteSelectSequence = 0;

function initializeInrouteSelects(root) {
  const scope = root || document;
  Array.from(scope.querySelectorAll("select:not([data-inroute-select])")).forEach(function(select) {
    inrouteSelectSequence += 1;
    const wrapper = select.closest(".case-select") || document.createElement("div");
    if (!select.closest(".case-select")) {
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);
    }
    wrapper.classList.add("inroute-select");

    const idBase = select.id || "inroute-select-" + inrouteSelectSequence;
    const searchableSelectIds = ["caseClient", "caseRegisteredBy", "whatsappClient", "whatsappType", "whatsappDevice", "whatsappStatus", "whatsappResponsible", "newWhatsAppClient", "newWhatsAppType", "newWhatsAppDevice"];
    const isSearchable = searchableSelectIds.includes(select.id);
    const field = select.closest(".case-filter-control, .new-case-field") || select.closest("label");
    const visibleLabel = field && field.querySelector(".case-filter-label, label");
    const accessibleName = (visibleLabel && visibleLabel.textContent.trim()) ||
      (field && field.classList.contains("case-page-size-label") && field.firstChild && field.firstChild.textContent.trim()) ||
      select.getAttribute("aria-label") || "Selecciona una opción";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.id = idBase + "-trigger";
    trigger.className = "inroute-select-trigger";
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-label", accessibleName);
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", idBase + "-listbox");

    const isNewCaseStatus = select.id === "newCaseStatus";
    const isNewWhatsAppStatus = select.id === "newWhatsAppStatus";
    const isCaseStatusSelect = select.id === "caseStatus";
    const isWhatsAppStatusSelect = select.id === "whatsappStatus";
    const hasStatusIndicator = isNewCaseStatus || isNewWhatsAppStatus || isCaseStatusSelect || isWhatsAppStatusSelect;
    const statusDot = hasStatusIndicator ? document.createElement("span") : null;
    if (isCaseStatusSelect) wrapper.classList.add("case-status-filter");
    if (isWhatsAppStatusSelect) wrapper.classList.add("whatsapp-status-filter");
    if (statusDot) {
      statusDot.className = "case-status-selected-dot";
      statusDot.setAttribute("aria-hidden", "true");
      trigger.appendChild(statusDot);
    }

    const valueText = document.createElement("span");
    valueText.className = "inroute-select-value";
    const chevron = document.createElement("span");
    chevron.className = "inroute-select-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = "<svg viewBox='0 0 20 20'><path d='m5 7.5 5 5 5-5'/></svg>";
    trigger.appendChild(valueText);
    trigger.appendChild(chevron);

    const listbox = document.createElement("div");
    listbox.id = idBase + "-listbox";
    listbox.className = "inroute-select-listbox";
    listbox.setAttribute("role", "listbox");
    listbox.setAttribute("aria-label", accessibleName);
    listbox.hidden = true;

    let searchPanel = null;
    let searchInput = null;
    let searchClear = null;
    let searchEmpty = null;
    if (isSearchable) {
      wrapper.classList.add("inroute-select--searchable");
      searchPanel = document.createElement("div");
      searchPanel.id = idBase + "-panel";
      searchPanel.className = "inroute-select-panel";
      searchPanel.hidden = true;
      const searchField = document.createElement("div");
      searchField.className = "inroute-select-search";
      searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.className = "inroute-select-search-input";
      searchInput.setAttribute("role", "searchbox");
      const searchNouns = { caseRegisteredBy: "usuario", whatsappResponsible: "responsable", whatsappType: "tipo de solicitud", newWhatsAppType: "tipo de solicitud", whatsappDevice: "dispositivo", newWhatsAppDevice: "dispositivo", whatsappStatus: "estado" };
      const searchType = searchNouns[select.id] || "cliente";
      searchInput.setAttribute("aria-label", "Buscar " + searchType);
      searchInput.setAttribute("autocomplete", "off");
      searchInput.setAttribute("placeholder", "Buscar " + searchType + "...");
      searchClear = document.createElement("button");
      searchClear.type = "button";
      searchClear.className = "inroute-select-search-clear";
      searchClear.setAttribute("aria-label", "Borrar búsqueda de " + searchType + "s");
      searchClear.textContent = "×";
      searchClear.hidden = true;
      searchField.appendChild(searchInput);
      searchField.appendChild(searchClear);
      searchEmpty = document.createElement("div");
      searchEmpty.className = "inroute-select-empty";
      searchEmpty.setAttribute("role", "status");
      const searchEmptyLabels = { caseRegisteredBy: "usuarios", whatsappResponsible: "responsables", whatsappType: "tipos de solicitud", newWhatsAppType: "tipos de solicitud", whatsappDevice: "dispositivos", newWhatsAppDevice: "dispositivos", whatsappStatus: "estados" };
      searchEmpty.textContent = "No se encontraron " + (searchEmptyLabels[select.id] || "clientes");
      searchEmpty.hidden = true;
      searchPanel.appendChild(searchField);
      searchPanel.appendChild(listbox);
      searchPanel.appendChild(searchEmpty);
    }

    wrapper.insertBefore(trigger, select);
    wrapper.appendChild(searchPanel || listbox);
    select.classList.add("inroute-native-select");
    select.setAttribute("aria-hidden", "true");
    select.tabIndex = -1;
    select.dataset.inrouteSelect = "true";

    const state = { select: select, wrapper: wrapper, trigger: trigger, valueText: valueText, listbox: listbox,
      searchPanel: searchPanel, searchInput: searchInput, searchClear: searchClear, searchEmpty: searchEmpty,
      optionElements: [], activeIndex: -1, typeahead: "", typeaheadTimer: null };

    state.refreshOptions = function() {
      listbox.replaceChildren();
      state.optionElements = Array.from(select.options).map(function(nativeOption, index) {
        const option = document.createElement("div");
        option.id = idBase + "-option-" + index;
        option.className = "inroute-select-option";
        option.setAttribute("role", "option");
        const optionLabel = nativeOption.label || nativeOption.textContent.trim();
        if (hasStatusIndicator) {
          option.classList.add("case-status-option");
          if (isCaseStatusSelect) option.classList.add("case-status-option--filter");
          if (isWhatsAppStatusSelect) option.classList.add("case-status-option--filter", "whatsapp-status-option--filter");
          option.dataset.status = nativeOption.value;
          const optionDot = document.createElement("span");
          optionDot.className = "case-status-option-dot";
          optionDot.hidden = !nativeOption.value;
          optionDot.setAttribute("aria-hidden", "true");
          const optionText = document.createElement("span");
          optionText.textContent = optionLabel;
          option.appendChild(optionDot);
          option.appendChild(optionText);
        } else {
          option.textContent = optionLabel;
        }
        option.setAttribute("aria-selected", String(index === select.selectedIndex));
        option.setAttribute("aria-disabled", String(nativeOption.disabled));
        if (nativeOption.disabled) option.classList.add("is-disabled");
        option.addEventListener("pointerdown", function(event) { event.preventDefault(); });
        option.addEventListener("pointermove", function() {
          if (!listbox.hidden && !nativeOption.disabled) state.setActive(index);
        });
        option.addEventListener("click", function() { state.choose(index); });
        listbox.appendChild(option);
        return option;
      });
      state.syncValue();
      state.filterOptions();
    };

    state.filterOptions = function() {
      if (!isSearchable) return;
      const query = searchInput.value.trim().toLocaleLowerCase("es-MX");
      let firstMatch = -1;
      let matches = 0;
      state.optionElements.forEach(function(option, index) {
        const optionLabel = (select.options[index].label || select.options[index].textContent.trim()).toLocaleLowerCase("es-MX");
        const visible = optionLabel.includes(query);
        option.hidden = !visible;
        option.setAttribute("aria-hidden", String(!visible));
        if (visible && !select.options[index].disabled) {
          if (firstMatch < 0) firstMatch = index;
          matches += 1;
        }
      });
      searchClear.hidden = !searchInput.value;
      searchEmpty.hidden = matches > 0;
      if (firstMatch < 0) {
        state.activeIndex = -1;
        state.optionElements.forEach(function(option) { option.classList.remove("is-active"); });
        trigger.removeAttribute("aria-activedescendant");
      } else {
        state.setActive(firstMatch);
      }
    };

    state.syncValue = function() {
      const selected = select.options[select.selectedIndex];
      valueText.textContent = selected ? (selected.label || selected.textContent.trim()) : "";
      if (hasStatusIndicator) {
        const statusWrap = select.closest(".new-case-status-wrap, .whatsapp-status-wrap") || (isCaseStatusSelect || isWhatsAppStatusSelect ? wrapper : null);
        if (statusWrap) statusWrap.dataset.status = selected ? selected.value : "";
        if (statusDot) statusDot.hidden = !selected || !selected.value;
      }
      trigger.disabled = select.disabled;
      state.optionElements.forEach(function(option, index) {
        option.setAttribute("aria-selected", String(index === select.selectedIndex));
        option.classList.toggle("is-selected", index === select.selectedIndex);
        option.setAttribute("aria-disabled", String(select.options[index].disabled));
      });
    };

    state.setActive = function(index) {
      if (!state.optionElements.length) return;
      let candidate = index;
      const direction = index >= state.activeIndex ? 1 : -1;
      for (let checked = 0; checked < state.optionElements.length; checked += 1) {
        candidate = (candidate + state.optionElements.length) % state.optionElements.length;
        if (!select.options[candidate].disabled && (!isSearchable || !state.optionElements[candidate].hidden)) break;
        candidate += direction;
      }
      if (select.options[candidate].disabled || (isSearchable && state.optionElements[candidate].hidden)) return;
      state.activeIndex = candidate;
      state.optionElements.forEach(function(option, optionIndex) {
        option.classList.toggle("is-active", optionIndex === candidate);
      });
      trigger.setAttribute("aria-activedescendant", state.optionElements[candidate].id);
      if (state.optionElements[candidate].scrollIntoView) {
        state.optionElements[candidate].scrollIntoView({ block: "nearest" });
      }
    };

    state.open = function() {
      if (trigger.disabled) return;
      if (activeInrouteSelect && activeInrouteSelect !== state) activeInrouteSelect.close(false);
      if (isSearchable) {
        searchInput.value = "";
        searchPanel.hidden = false;
      }
      listbox.hidden = false;
      wrapper.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      activeInrouteSelect = state;
      state.filterOptions();
      const selectedIndex = select.selectedIndex;
      state.setActive(selectedIndex >= 0 && !select.options[selectedIndex].disabled ? selectedIndex : 0);
      const bounds = wrapper.getBoundingClientRect();
      const menuHeight = isSearchable ? Math.min(listbox.scrollHeight, 240) + 58 : Math.min(listbox.scrollHeight, 280);
      wrapper.classList.toggle("opens-up", bounds.bottom + menuHeight > window.innerHeight && bounds.top > window.innerHeight / 2);
      if (isSearchable) searchInput.focus();
    };

    state.close = function(returnFocus) {
      listbox.hidden = true;
      if (isSearchable) {
        searchPanel.hidden = true;
        searchInput.value = "";
        state.filterOptions();
      }
      wrapper.classList.remove("is-open", "opens-up");
      trigger.setAttribute("aria-expanded", "false");
      trigger.removeAttribute("aria-activedescendant");
      state.optionElements.forEach(function(option) { option.classList.remove("is-active"); });
      if (activeInrouteSelect === state) activeInrouteSelect = null;
      if (returnFocus) trigger.focus();
    };

    state.choose = function(index) {
      if (index < 0 || index >= select.options.length || select.options[index].disabled || (isSearchable && state.optionElements[index].hidden)) return;
      select.selectedIndex = index;
      state.syncValue();
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      state.close(true);
    };

    trigger.addEventListener("click", function() {
      if (listbox.hidden) state.open(); else state.close(false);
    });
    if (isSearchable) {
      searchInput.addEventListener("input", state.filterOptions);
      searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
          event.preventDefault();
          state.close(true);
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (state.activeIndex >= 0) state.setActive(state.activeIndex + (event.key === "ArrowDown" ? 1 : -1));
        } else if (event.key === "Enter" && state.activeIndex >= 0) {
          event.preventDefault();
          state.choose(state.activeIndex);
        }
      });
      searchClear.addEventListener("click", function() {
        searchInput.value = "";
        state.filterOptions();
        searchInput.focus();
      });
    }
    trigger.addEventListener("keydown", function(event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        if (listbox.hidden) {
          state.open();
          if (event.key === "ArrowUp") state.setActive(select.options.length - 1);
        } else state.setActive(state.activeIndex + direction);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        if (listbox.hidden) state.open();
        state.setActive(event.key === "Home" ? 0 : select.options.length - 1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (listbox.hidden) state.open(); else state.choose(state.activeIndex);
      } else if (event.key === "Escape" && !listbox.hidden) {
        event.preventDefault();
        state.close(true);
      } else if (event.key === "Tab") {
        state.close(false);
      } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
        state.typeahead += event.key.toLocaleLowerCase("es-MX");
        clearTimeout(state.typeaheadTimer);
        state.typeaheadTimer = setTimeout(function() { state.typeahead = ""; }, 700);
        const matchIndex = select.options.findIndex(function(option) {
          return !option.disabled && (option.label || option.textContent.trim()).toLocaleLowerCase("es-MX").startsWith(state.typeahead);
        });
        if (matchIndex >= 0) {
          if (listbox.hidden) state.open();
          state.setActive(matchIndex);
        }
      }
    });

    select.addEventListener("change", state.syncValue);
    select.addEventListener("input", state.syncValue);
    select._syncInrouteSelect = state.syncValue;
    if (select.form) select.form.addEventListener("reset", function() { setTimeout(state.syncValue, 0); });
    state.refreshOptions();
    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(state.refreshOptions);
      observer.observe(select, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "label", "selected"] });
    }
  });
}

initializeInrouteSelects();
document.addEventListener("pointerdown", function(event) {
  if (activeInrouteSelect && !activeInrouteSelect.wrapper.contains(event.target)) activeInrouteSelect.close(false);
});

function caseDateBounds() {
  const period = document.getElementById("casePeriod").value;
  const now = new Date();
  let start = null;
  let end = null;
  if (period === "thisMonth") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (period === "lastMonth") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "specificMonth") {
    const value = document.getElementById("caseSpecificMonth").value;
    if (value) {
      const parts = value.split("-").map(Number);
      start = new Date(parts[0], parts[1] - 1, 1);
      end = new Date(parts[0], parts[1], 1);
    }
  }
  return { start: start, end: end };
}

function getFilteredCases() {
  const period = document.getElementById("casePeriod").value;
  if (period === "specificMonth" && !document.getElementById("caseSpecificMonth").value) return [];
  const bounds = caseDateBounds();
  const client = document.getElementById("caseClient").value;
  const device = document.getElementById("caseDevice").value;
  const status = document.getElementById("caseStatus").value;
  const creator = isCaseAdministrator() ? document.getElementById("caseRegisteredBy").value : "";
  const query = normalizeCaseSearch(document.getElementById("caseQuickSearch").value);
  return demoCases.filter(function(item) {
    const date = new Date(item.registeredAt);
    const searchableFields = [item.id, item.unit, item.client, item.device, item.reason, item.brief, item.description];
    if (isCaseAdministrator()) searchableFields.push(item.createdBy);
    const matchesQuickSearch = !query || searchableFields.some(function(value) {
      return normalizeCaseSearch(value).includes(query);
    });
    return (caseState.view !== "mine" || isCaseOwnedByCurrentUser(item)) &&
      (!bounds.start || date >= bounds.start) && (!bounds.end || date < bounds.end) &&
      (!client || item.client === client) && (!device || item.device === device) && (!status || item.status === status) &&
      (!creator || item.createdBy === creator) && matchesQuickSearch;
  }).sort(function(a, b) { return new Date(b.registeredAt) - new Date(a.registeredAt); });
}

function normalizeCaseSearch(value) {
  return String(value == null ? "" : value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX").trim();
}

function formatCaseDate(value, includeTime) {
  const options = includeTime
    ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }
    : { day: "2-digit", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("es-MX", options).format(new Date(value));
}

function statusClass(status) {
  return "status-" + status.toLocaleLowerCase("es-MX").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function renderHomeDashboard() {
  const recentCases = demoCases.slice().sort(function(a, b) {
    return new Date(b.registeredAt) - new Date(a.registeredAt);
  });
  const recentWhatsApp = demoWhatsAppRequests.slice().sort(function(a, b) {
    return new Date(b.registeredAt) - new Date(a.registeredAt);
  });
  document.getElementById("homeCasesTotal").textContent = demoCases.length;
  document.getElementById("homeWhatsAppTotal").textContent = demoWhatsAppRequests.length;
  document.getElementById("homeCasesBody").innerHTML = recentCases.slice(0, 5).map(function(item) {
    return "<tr><td>" + escapeCaseHtml(formatCaseDate(item.registeredAt, false)) + "</td>" +
      "<td>" + escapeCaseHtml(item.id) + "</td>" +
      "<td>" + escapeCaseHtml(item.reason || item.description || "") + "</td>" +
      "<td>" + escapeCaseHtml(item.client || "") + "</td>" +
      "<td><span class='status-pill " + statusClass(item.status) + "'>" + escapeCaseHtml(item.status) + "</span></td></tr>";
  }).join("");
  document.getElementById("homeWhatsAppBody").innerHTML = recentWhatsApp.slice(0, 5).map(function(item) {
    return "<tr><td>" + escapeCaseHtml(formatCaseDate(item.registeredAt, false)) + "</td>" +
      "<td>" + escapeCaseHtml(item.requestType || "") + "</td>" +
      "<td>" + escapeCaseHtml(item.description || "") + "</td>" +
      "<td>" + escapeCaseHtml(item.client || "") + "</td>" +
      "<td><span class='status-pill " + statusClass(item.status) + "'>" + escapeCaseHtml(item.status) + "</span></td></tr>";
  }).join("");

  const combined = recentCases.map(function(item) {
    return { registeredAt: item.registeredAt, module: "Webfleet", description: item.reason || item.description || "", client: item.client, status: item.status };
  }).concat(recentWhatsApp.map(function(item) {
    return { registeredAt: item.registeredAt, module: "WhatsApp", description: item.description || item.requestType || "", client: item.client, status: item.status };
  })).sort(function(a, b) {
    return new Date(b.registeredAt) - new Date(a.registeredAt);
  });
  document.getElementById("homeRecentBody").innerHTML = combined.slice(0, 5).map(function(item) {
    return "<tr><td>" + escapeCaseHtml(formatCaseDate(item.registeredAt, false)) + "</td>" +
      "<td>" + escapeCaseHtml(item.module) + "</td>" +
      "<td>" + escapeCaseHtml(item.description) + "</td>" +
      "<td>" + escapeCaseHtml(item.client || "") + "</td>" +
      "<td><span class='status-pill " + statusClass(item.status) + "'>" + escapeCaseHtml(item.status) + "</span></td></tr>";
  }).join("");
}

function renderCaseTable() {
  const period = document.getElementById("casePeriod").value;
  document.getElementById("specificMonthField").hidden = period !== "specificMonth";

  caseState.results = getFilteredCases();
  const total = caseState.results.length;
  const pageCount = Math.max(1, Math.ceil(total / caseState.pageSize));
  caseState.page = Math.min(caseState.page, pageCount);
  const start = (caseState.page - 1) * caseState.pageSize;
  const visible = caseState.results.slice(start, start + caseState.pageSize);
  const tbody = document.getElementById("casesTableBody");
  tbody.innerHTML = visible.map(function(item) {
    const canEdit = caseState.view === "mine" && isCaseOwnedByCurrentUser(item);
    const canDelete = isCaseAdministrator() && caseState.view === "all";
    const actions = "<span class='case-row-actions'><button type='button' class='case-eye-button' data-case-action='view' data-case-id='" + escapeCaseHtml(item.id) + "' aria-label='Ver detalle de " + escapeCaseHtml(item.id) + "'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z'/><circle cx='12' cy='12' r='2.7'/></svg></button>" +
      (canEdit ? "<button type='button' class='case-edit-button' data-case-action='edit' data-case-id='" + escapeCaseHtml(item.id) + "' aria-label='Editar caso " + escapeCaseHtml(item.id) + "'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 20h9'/><path d='M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z'/></svg></button>" : "") +
      (canDelete ? "<button type='button' class='case-delete-button' data-case-action='delete' data-case-id='" + escapeCaseHtml(item.id) + "' aria-label='Eliminar caso " + escapeCaseHtml(item.id) + "'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5'/></svg></button>" : "") + "</span>";
    return "<tr>" +
      "<td class='case-number'>" + escapeCaseHtml(item.id) + "</td>" +
      "<td class='case-date-cell'>" + escapeCaseHtml(formatCaseDate(item.registeredAt, false)) + "</td>" +
      "<td>" + escapeCaseHtml(item.client) + "</td>" +
      "<td>" + escapeCaseHtml(item.unit) + "</td>" +
      "<td class='case-reason-cell'>" + escapeCaseHtml(item.reason) + "</td>" +
      "<td>" + escapeCaseHtml(item.device) + "</td>" +
      "<td><span class='status-pill " + statusClass(item.status) + "'>" + escapeCaseHtml(item.status) + "</span></td>" +
      "<td>" + actions + "</td></tr>";
  }).join("");

  document.getElementById("caseEmptyState").hidden = total !== 0;
  document.querySelector(".case-table").hidden = total === 0;
  document.getElementById("caseResultSummary").textContent = total === 1 ? "1 resultado" : total + " resultados";
  document.getElementById("casePageSummary").textContent = "Página " + caseState.page + " de " + pageCount;
  document.querySelectorAll("[data-case-view]").forEach(function(button) {
    const active = button.dataset.caseView === caseState.view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.getElementById("casePreviousPage").disabled = caseState.page <= 1;
  document.getElementById("caseNextPage").disabled = caseState.page >= pageCount;
  document.getElementById("caseCreatorFilter").hidden = !isCaseAdministrator();

  document.getElementById("totalCasesKpi").textContent = total;
  const pendingCount = caseState.results.filter(function(item) { return item.status === "Pendiente"; }).length;
  const secondLineCount = caseState.results.filter(function(item) { return item.status === "Segunda Línea"; }).length;
  document.getElementById("pendingCasesKpi").textContent = pendingCount;
  document.getElementById("secondLineCasesKpi").textContent = secondLineCount;
  document.getElementById("pendingCasesNote").textContent = (total ? (pendingCount / total * 100).toFixed(1) : "0.0") + "% del total";
  document.getElementById("secondLineCasesNote").textContent = (total ? (secondLineCount / total * 100).toFixed(1) : "0.0") + "% del total";
  if (total) {
    const latestRegistration = new Date(caseState.results[0].registeredAt);
    document.getElementById("latestCaseKpi").textContent = new Intl.DateTimeFormat("es-MX", {
      day: "2-digit", month: "short", year: "numeric"
    }).format(latestRegistration);
    document.getElementById("latestCaseTimeKpi").textContent = new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).format(latestRegistration);
  } else {
    document.getElementById("latestCaseKpi").textContent = "—";
    document.getElementById("latestCaseTimeKpi").textContent = "";
  }

  const rangeStart = total ? Math.min(start + 1, total) : 0;
  const rangeEnd = Math.min(start + visible.length, total);
  document.getElementById("caseResultSummary").textContent = total
    ? "Mostrando " + rangeStart + " a " + rangeEnd + " de " + total + " casos"
    : "0 resultados";
  renderHomeDashboard();
}

function resetCasePageAndRender() { caseState.page = 1; renderCaseTable(); }
document.querySelectorAll("[data-case-view]").forEach(function(button) {
  button.addEventListener("click", function() {
    if (caseState.view === button.dataset.caseView) return;
    caseState.view = button.dataset.caseView;
    caseState.page = 1;
    renderCaseTable();
  });
});
document.getElementById("caseQuickSearch").addEventListener("input", function() {
  document.getElementById("clearCaseQuickSearch").hidden = !this.value;
  resetCasePageAndRender();
});
document.getElementById("clearCaseQuickSearch").addEventListener("click", function() {
  const input = document.getElementById("caseQuickSearch");
  input.value = "";
  this.hidden = true;
  resetCasePageAndRender();
  input.focus();
});
caseFilterElements.forEach(function(id) {
  document.getElementById(id).addEventListener("change", resetCasePageAndRender);
});

const caseSpecificMonthInput = document.getElementById("caseSpecificMonth");
const caseMonthPicker = document.getElementById("caseMonthPicker");
const caseMonthTrigger = document.getElementById("caseMonthTrigger");
const caseMonthValue = document.getElementById("caseMonthValue");
const caseMonthPopover = document.getElementById("caseMonthPopover");
const caseMonthPickerTitle = document.getElementById("caseMonthPickerTitle");
const caseMonthGrid = document.getElementById("caseMonthGrid");
const caseMonthNames = Array.from({ length: 12 }, function(_, index) {
  const name = new Intl.DateTimeFormat("es-MX", { month: "long" }).format(new Date(2026, index, 1));
  return name.charAt(0).toLocaleUpperCase("es-MX") + name.slice(1);
});
let caseMonthPickerYear = new Date().getFullYear();

function syncCaseMonthTrigger() {
  const value = caseSpecificMonthInput.value;
  if (!value) {
    caseMonthValue.textContent = "Selecciona un mes y año";
    return;
  }
  const parts = value.split("-").map(Number);
  caseMonthValue.textContent = caseMonthNames[parts[1] - 1] + " " + parts[0];
}

function renderCaseMonthOptions() {
  const selectedParts = caseSpecificMonthInput.value.split("-").map(Number);
  caseMonthPickerTitle.textContent = caseMonthPickerYear;
  caseMonthGrid.innerHTML = caseMonthNames.map(function(name, index) {
    const selected = selectedParts[0] === caseMonthPickerYear && selectedParts[1] === index + 1;
    return "<button type='button' class='case-month-option' data-case-month='" + String(index + 1).padStart(2, "0") + "' aria-pressed='" + selected + "'>" + name + "</button>";
  }).join("");
}

function openCaseMonthPicker() {
  const selectedYear = Number(caseSpecificMonthInput.value.slice(0, 4));
  caseMonthPickerYear = selectedYear || new Date().getFullYear();
  renderCaseMonthOptions();
  caseMonthPopover.hidden = false;
  caseMonthPicker.classList.add("is-open");
  caseMonthTrigger.setAttribute("aria-expanded", "true");
}

function closeCaseMonthPicker() {
  caseMonthPopover.hidden = true;
  caseMonthPicker.classList.remove("is-open");
  caseMonthTrigger.setAttribute("aria-expanded", "false");
}

caseMonthTrigger.addEventListener("click", function() {
  if (caseMonthPopover.hidden) openCaseMonthPicker();
  else closeCaseMonthPicker();
});
document.getElementById("caseMonthPreviousYear").addEventListener("click", function() {
  caseMonthPickerYear -= 1;
  renderCaseMonthOptions();
});
document.getElementById("caseMonthNextYear").addEventListener("click", function() {
  caseMonthPickerYear += 1;
  renderCaseMonthOptions();
});
caseMonthGrid.addEventListener("click", function(event) {
  const option = event.target.closest("[data-case-month]");
  if (!option) return;
  caseSpecificMonthInput.value = caseMonthPickerYear + "-" + option.dataset.caseMonth;
  syncCaseMonthTrigger();
  closeCaseMonthPicker();
  caseSpecificMonthInput.dispatchEvent(new Event("change", { bubbles: true }));
  caseMonthTrigger.focus();
});
document.getElementById("casePeriod").addEventListener("change", function(event) {
  if (event.target.value === "specificMonth") openCaseMonthPicker();
  else closeCaseMonthPicker();
});
caseSpecificMonthInput.addEventListener("change", syncCaseMonthTrigger);
document.addEventListener("pointerdown", function(event) {
  if (!caseMonthPicker.contains(event.target)) closeCaseMonthPicker();
});
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && !caseMonthPopover.hidden) closeCaseMonthPicker();
});

const whatsappSpecificMonthInput = document.getElementById("whatsappSpecificMonth");
const whatsappMonthPicker = document.getElementById("whatsappMonthPicker");
const whatsappMonthTrigger = document.getElementById("whatsappMonthTrigger");
const whatsappMonthValue = document.getElementById("whatsappMonthValue");
const whatsappMonthPopover = document.getElementById("whatsappMonthPopover");
const whatsappMonthPickerTitle = document.getElementById("whatsappMonthPickerTitle");
const whatsappMonthGrid = document.getElementById("whatsappMonthGrid");
let whatsappMonthPickerYear = new Date().getFullYear();

function syncWhatsAppMonthTrigger() {
  const value = whatsappSpecificMonthInput.value;
  if (!value) {
    whatsappMonthValue.textContent = "Selecciona un mes y año";
    return;
  }
  const parts = value.split("-").map(Number);
  whatsappMonthValue.textContent = caseMonthNames[parts[1] - 1] + " " + parts[0];
}

function renderWhatsAppMonthOptions() {
  const selectedParts = whatsappSpecificMonthInput.value.split("-").map(Number);
  whatsappMonthPickerTitle.textContent = whatsappMonthPickerYear;
  whatsappMonthGrid.innerHTML = caseMonthNames.map(function(name, index) {
    const selected = selectedParts[0] === whatsappMonthPickerYear && selectedParts[1] === index + 1;
    return "<button type='button' class='case-month-option' data-whatsapp-month='" + String(index + 1).padStart(2, "0") + "' aria-pressed='" + selected + "'>" + name + "</button>";
  }).join("");
}

function openWhatsAppMonthPicker() {
  const selectedYear = Number(whatsappSpecificMonthInput.value.slice(0, 4));
  whatsappMonthPickerYear = selectedYear || new Date().getFullYear();
  renderWhatsAppMonthOptions();
  whatsappMonthPopover.hidden = false;
  whatsappMonthPicker.classList.add("is-open");
  whatsappMonthTrigger.setAttribute("aria-expanded", "true");
}

function closeWhatsAppMonthPicker() {
  whatsappMonthPopover.hidden = true;
  whatsappMonthPicker.classList.remove("is-open");
  whatsappMonthTrigger.setAttribute("aria-expanded", "false");
}

whatsappMonthTrigger.addEventListener("click", function() {
  if (whatsappMonthPopover.hidden) openWhatsAppMonthPicker();
  else closeWhatsAppMonthPicker();
});
document.getElementById("whatsappMonthPreviousYear").addEventListener("click", function() {
  whatsappMonthPickerYear -= 1;
  renderWhatsAppMonthOptions();
});
document.getElementById("whatsappMonthNextYear").addEventListener("click", function() {
  whatsappMonthPickerYear += 1;
  renderWhatsAppMonthOptions();
});
whatsappMonthGrid.addEventListener("click", function(event) {
  const option = event.target.closest("[data-whatsapp-month]");
  if (!option) return;
  whatsappSpecificMonthInput.value = whatsappMonthPickerYear + "-" + option.dataset.whatsappMonth;
  syncWhatsAppMonthTrigger();
  closeWhatsAppMonthPicker();
  whatsappSpecificMonthInput.dispatchEvent(new Event("change", { bubbles: true }));
  whatsappMonthTrigger.focus();
});
document.getElementById("whatsappPeriod").addEventListener("change", function(event) {
  if (event.target.value === "specificMonth") openWhatsAppMonthPicker();
  else closeWhatsAppMonthPicker();
});
whatsappSpecificMonthInput.addEventListener("change", syncWhatsAppMonthTrigger);
document.addEventListener("pointerdown", function(event) {
  if (!whatsappMonthPicker.contains(event.target)) closeWhatsAppMonthPicker();
});
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && !whatsappMonthPopover.hidden) closeWhatsAppMonthPicker();
});

function setupWhatsAppDatePicker(fieldId) {
  const picker = document.getElementById(fieldId + "Picker");
  const input = document.getElementById(fieldId);
  const trigger = document.getElementById(fieldId + "Trigger");
  const value = document.getElementById(fieldId + "Value");
  const popover = document.getElementById(fieldId + "Popover");
  const title = document.getElementById(fieldId + "Title");
  const grid = document.getElementById(fieldId + "Grid");
  let visibleYear = new Date().getFullYear();
  let visibleMonth = new Date().getMonth();

  function dateFromValue(dateValue) {
    if (!dateValue) return null;
    const parts = dateValue.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  }

  function syncValue() {
    const date = dateFromValue(input.value);
    value.textContent = date ? formatDate(date) : "Selecciona una fecha";
  }

  function renderCalendar() {
    const monthName = new Intl.DateTimeFormat("es-MX", { month: "long" }).format(new Date(visibleYear, visibleMonth, 1));
    title.textContent = monthName.charAt(0).toLocaleUpperCase("es-MX") + monthName.slice(1) + " de " + visibleYear;
    const firstWeekday = (new Date(visibleYear, visibleMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
    const selectedDate = input.value;
    const blanks = Array.from({ length: firstWeekday }, function() { return "<span class='case-date-empty' aria-hidden='true'></span>"; });
    const days = Array.from({ length: daysInMonth }, function(_, index) {
      const day = index + 1;
      const dateValue = visibleYear + "-" + String(visibleMonth + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
      const selected = dateValue === selectedDate;
      const fullDate = formatDate(new Date(visibleYear, visibleMonth, day));
      return "<button type='button' class='case-date-day" + (selected ? " is-selected" : "") + "' data-whatsapp-date='" + dateValue + "' aria-label='" + fullDate + "' aria-pressed='" + selected + "'>" + day + "</button>";
    });
    grid.innerHTML = blanks.concat(days).join("");
  }

  function open() {
    const selected = dateFromValue(input.value) || new Date();
    visibleYear = selected.getFullYear();
    visibleMonth = selected.getMonth();
    renderCalendar();
    popover.hidden = false;
    picker.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function close() {
    popover.hidden = true;
    picker.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", function() {
    if (popover.hidden) open();
    else close();
  });
  document.getElementById(fieldId + "Previous").addEventListener("click", function() {
    visibleMonth -= 1;
    if (visibleMonth < 0) { visibleMonth = 11; visibleYear -= 1; }
    renderCalendar();
  });
  document.getElementById(fieldId + "Next").addEventListener("click", function() {
    visibleMonth += 1;
    if (visibleMonth > 11) { visibleMonth = 0; visibleYear += 1; }
    renderCalendar();
  });
  grid.addEventListener("click", function(event) {
    const day = event.target.closest("[data-whatsapp-date]");
    if (!day) return;
    input.value = day.dataset.whatsappDate;
    syncValue();
    close();
    input.dispatchEvent(new Event("change", { bubbles: true }));
    trigger.focus();
  });
  document.addEventListener("pointerdown", function(event) {
    if (!picker.contains(event.target)) close();
  });
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !popover.hidden) close();
  });
  syncValue();
}

setupWhatsAppDatePicker("whatsappDateStart");
setupWhatsAppDatePicker("whatsappDateEnd");

document.getElementById("casePageSize").addEventListener("change", function(event) {
  caseState.pageSize = Number(event.target.value);
  caseState.page = 1;
  renderCaseTable();
});
document.getElementById("casePreviousPage").addEventListener("click", function() {
  if (caseState.page > 1) { caseState.page -= 1; renderCaseTable(); }
});
document.getElementById("caseNextPage").addEventListener("click", function() {
  const pages = Math.max(1, Math.ceil(caseState.results.length / caseState.pageSize));
  if (caseState.page < pages) { caseState.page += 1; renderCaseTable(); }
});
document.getElementById("clearCaseFilters").addEventListener("click", function() {
  document.getElementById("casePeriod").value = "thisMonth";
  ["caseSpecificMonth", "caseClient", "caseDevice", "caseStatus", "caseRegisteredBy"].forEach(function(id) {
    const select = document.getElementById(id);
    select.value = "";
    if (select._syncInrouteSelect) select._syncInrouteSelect();
  });
  const periodSelect = document.getElementById("casePeriod");
  if (periodSelect._syncInrouteSelect) periodSelect._syncInrouteSelect();
  document.getElementById("caseQuickSearch").value = "";
  document.getElementById("clearCaseQuickSearch").hidden = true;
  syncCaseMonthTrigger();
  closeCaseMonthPicker();
  caseState.view = "all";
  caseState.page = 1;
  renderCaseTable();
});

function csvCell(value) { return '"' + String(value == null ? "" : value).replace(/"/g, '""') + '"'; }
document.getElementById("exportCases").addEventListener("click", function() {
  const results = getFilteredCases();
  if (!results.length) { alert("No hay resultados para exportar con los filtros seleccionados."); return; }
  const rows = [["# Caso", "Fecha de registro", "Cliente", "Unidad", "Motivo", "Dispositivo", "Estado"]];
  results.forEach(function(item) {
    rows.push([item.id, formatCaseDate(item.registeredAt, true), item.client, item.unit, item.reason, item.device, item.status]);
  });
  const csv = "\uFEFF" + rows.map(function(row) { return row.map(csvCell).join(","); }).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "casos-webfleet-" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

function openCaseDetail(caseId) {
  const item = demoCases.find(function(entry) { return entry.id === caseId; });
  if (!item) return;
  document.getElementById("detailCaseId").textContent = item.id;
  document.getElementById("caseDetailContent").innerHTML =
    "<div class='detail-status-row'><span class='status-pill " + statusClass(item.status) + "'>" + escapeCaseHtml(item.status) + "</span></div>" +
    "<section class='detail-card'><h3>Información general</h3><div class='detail-fields'>" +
      "<div class='detail-field'><span>Fecha de registro</span><strong>" + escapeCaseHtml(formatCaseDate(item.registeredAt, false)) + "</strong></div>" +
      "<div class='detail-field'><span>Cliente</span><strong>" + escapeCaseHtml(item.client) + "</strong></div>" +
      "<div class='detail-field'><span>Unidad</span><strong>" + escapeCaseHtml(item.unit) + "</strong></div>" +
      "<div class='detail-field'><span>Dispositivo</span><strong>" + escapeCaseHtml(item.device) + "</strong></div>" +
      "<div class='detail-field'><span>Estado</span><strong>" + escapeCaseHtml(item.status) + "</strong></div>" +
      "<div class='detail-field'><span>Registrado por</span><strong>" + escapeCaseHtml(item.createdBy || "No disponible") + "</strong></div>" +
    "</div></section>" +
    "<section class='detail-card'><h3>Motivo del caso</h3><div class='detail-field'><strong>" + escapeCaseHtml(item.reason) + "</strong></div>" + (item.brief ? "<p class='detail-description' style='margin-top:8px'>" + escapeCaseHtml(item.brief) + "</p>" : "") + "</section>" +
    "<section class='detail-card'><h3>Descripción</h3><p class='detail-description'>" + escapeCaseHtml(item.description) + "</p></section>" +
    "<section class='detail-card'><h3>Capturas</h3>" + (item.capture ? "<img class='detail-capture' src='" + item.capture + "' alt='Captura de envío del caso " + escapeCaseHtml(item.id) + "'>" : "<div class='capture-empty'>Sin captura disponible</div>") + "</section>";
  document.getElementById("caseDetailBackdrop").hidden = false;
  document.getElementById("caseDetailPanel").hidden = false;
  document.body.classList.add("case-detail-open");
  document.getElementById("closeCaseDetail").focus();
}

function closeCaseDetail() {
  document.getElementById("caseDetailBackdrop").hidden = true;
  document.getElementById("caseDetailPanel").hidden = true;
  document.body.classList.remove("case-detail-open");
}

document.getElementById("casesTableBody").addEventListener("click", function(event) {
  const button = event.target.closest("[data-case-action][data-case-id]");
  if (!button) return;
  const item = demoCases.find(function(entry) { return entry.id === button.dataset.caseId; });
  if (button.dataset.caseAction === "view") openCaseDetail(button.dataset.caseId);
  if (button.dataset.caseAction === "edit" && caseState.view === "mine" && isCaseOwnedByCurrentUser(item)) openEditCaseModal(item);
  if (button.dataset.caseAction === "delete" && isCaseAdministrator() && caseState.view === "all" && item) openDeleteCaseConfirmation(item);
});

const caseDeleteBackdrop = document.getElementById("caseDeleteBackdrop");
const caseDeleteDialog = document.getElementById("caseDeleteDialog");
let casePendingDeleteId = "";
let caseDeleteReturnFocus = null;

function openDeleteCaseConfirmation(item) {
  if (!item || !isCaseAdministrator() || caseState.view !== "all") return;
  casePendingDeleteId = item.id;
  caseDeleteReturnFocus = document.activeElement;
  document.getElementById("caseDeleteNumber").textContent = item.id;
  caseDeleteBackdrop.hidden = false;
  caseDeleteDialog.hidden = false;
  document.getElementById("cancelDeleteCase").focus();
}

function closeDeleteCaseConfirmation(restoreFocus) {
  caseDeleteBackdrop.hidden = true;
  caseDeleteDialog.hidden = true;
  casePendingDeleteId = "";
  if (restoreFocus && caseDeleteReturnFocus && caseDeleteReturnFocus.focus) caseDeleteReturnFocus.focus();
  caseDeleteReturnFocus = null;
}

document.getElementById("cancelDeleteCase").addEventListener("click", function() { closeDeleteCaseConfirmation(true); });
caseDeleteBackdrop.addEventListener("click", function() { closeDeleteCaseConfirmation(true); });
document.getElementById("confirmDeleteCase").addEventListener("click", function() {
  if (!isCaseAdministrator() || caseState.view !== "all" || !casePendingDeleteId) return;
  const index = demoCases.findIndex(function(item) { return item.id === casePendingDeleteId; });
  if (index < 0) { closeDeleteCaseConfirmation(true); return; }
  demoCases.splice(index, 1);
  caseState.page = 1;
  closeDeleteCaseConfirmation(false);
  renderCaseTable();
});
caseDeleteDialog.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDeleteCaseConfirmation(true);
  } else if (event.key === "Tab") {
    const focusable = Array.from(caseDeleteDialog.querySelectorAll("button:not(:disabled)"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
document.getElementById("closeCaseDetail").addEventListener("click", closeCaseDetail);
document.getElementById("caseDetailBackdrop").addEventListener("click", closeCaseDetail);
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && !document.getElementById("caseDetailPanel").hidden) closeCaseDetail();
});

function showDashboardView(view) {
  const isCases = view === "cases";
  const isWhatsApp = view === "whatsapp";
  document.getElementById("homeView").hidden = isCases || isWhatsApp;
  document.getElementById("casesView").hidden = !isCases;
  document.getElementById("whatsappView").hidden = !isWhatsApp;
  document.getElementById("homeMenuItem").classList.toggle("active", !isCases && !isWhatsApp);
  document.getElementById("casesMenuItem").classList.toggle("active", isCases);
  document.getElementById("whatsappMenuItem").classList.toggle("active", isWhatsApp);
  if (isCases) renderCaseTable();
  if (isWhatsApp) renderWhatsAppTable();
}

[["homeMenuItem", "home"], ["casesMenuItem", "cases"], ["whatsappMenuItem", "whatsapp"]].forEach(function(entry) {
  const element = document.getElementById(entry[0]);
  element.addEventListener("click", function() { showDashboardView(entry[1]); });
  element.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); showDashboardView(entry[1]); }
  });
});

renderCaseTable();

/* Formulario local de demostración para nuevos casos Webfleet. */
const newCaseModal = document.getElementById("newCaseModal");
const newCaseBackdrop = document.getElementById("newCaseBackdrop");
const newCaseForm = document.getElementById("newCaseForm");
const newCaseFileInput = document.getElementById("newCaseEvidenceInput");
const newCaseDropzone = document.getElementById("newCaseDropzone");
const newCaseDiscardBackdrop = document.getElementById("newCaseDiscardBackdrop");
const newCaseDiscardDialog = document.getElementById("newCaseDiscardDialog");
const newCaseValidationSummary = document.getElementById("newCaseValidationSummary");
let newCaseDiscardReturnFocus = null;
let editingCaseId = "";
let newCaseEditOriginalValues = null;
let newCaseEvidenceRemoved = false;
const newCaseSearchOptions = {
  clients: demoClientCatalog,
  devices: demoDeviceCatalog,
  reasons: Array.from(new Set(demoCases.map(function(item) { return item.reason; }))).sort()
};
let newCaseDirty = false;
let newCaseEvidenceFile = null;
let newCaseEvidenceUrl = "";

function updateNewCaseSystemInfo(date) {
  const currentDate = date || new Date();
  const user = document.getElementById("dashboardUserName").textContent.trim() || "Usuario de la sesión";
  document.getElementById("newCaseSessionUser").textContent = user;
  document.getElementById("newCaseSystemDate").textContent = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).format(currentDate);
}

const newCaseValidationFields = ["newCaseNumber", "newCaseClient", "newCaseUnit", "newCaseDevice", "newCaseReason", "newCaseStatus", "newCaseDescription"];

function clearNewCaseFieldValidation(fieldId) {
  const control = document.getElementById(fieldId);
  const field = control && control.closest(".new-case-field");
  const error = document.getElementById(fieldId + "Error");
  if (field) field.classList.remove("has-error");
  if (error) {
    error.hidden = true;
    error.textContent = "";
  }
  if (control) {
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-errormessage");
    control.setCustomValidity("");
  }
  if (!newCaseForm.querySelector(".new-case-field.has-error")) newCaseValidationSummary.hidden = true;
}

function clearNewCaseValidation() {
  newCaseValidationFields.forEach(clearNewCaseFieldValidation);
  newCaseValidationSummary.hidden = true;
  newCaseValidationSummary.textContent = "";
}

function showNewCaseValidation(errors) {
  clearNewCaseValidation();
  if (!errors.length) return true;
  newCaseValidationSummary.textContent = "Revisa los campos marcados antes de registrar el caso.";
  newCaseValidationSummary.hidden = false;
  errors.forEach(function(error, index) {
    const control = document.getElementById(error.fieldId);
    const field = control.closest(".new-case-field");
    const message = document.getElementById(error.fieldId + "Error");
    field.classList.add("has-error");
    message.textContent = error.message;
    message.hidden = false;
    control.setAttribute("aria-invalid", "true");
    control.setAttribute("aria-errormessage", message.id);
    control.setCustomValidity(error.message);
    if (index === 0) control.focus();
  });
  return false;
}

function hasNewCaseChanges() {
  const textFieldIds = ["newCaseNumber", "newCaseClient", "newCaseUnit", "newCaseDevice", "newCaseReason", "newCaseDescription"];
  if (editingCaseId && newCaseEditOriginalValues) {
    const currentValues = textFieldIds.map(function(id) { return document.getElementById(id).value; })
      .concat([document.getElementById("newCaseStatus").value]);
    return JSON.stringify(currentValues) !== JSON.stringify(newCaseEditOriginalValues) || Boolean(newCaseEvidenceFile) || newCaseEvidenceRemoved;
  }
  return textFieldIds.some(function(id) { return document.getElementById(id).value.length > 0; }) ||
    document.getElementById("newCaseStatus").value !== "Pendiente" || Boolean(newCaseEvidenceFile);
}

function closeNewCaseSearch(search) {
  search.classList.remove("is-open", "opens-up");
  search.querySelector(".case-create-listbox").hidden = true;
  search.querySelector("input").setAttribute("aria-expanded", "false");
  search.removeAttribute("data-active-index");
}

function initializeNewCaseSearch(search) {
  const input = search.querySelector("input");
  const listbox = search.querySelector(".case-create-listbox");
  const options = newCaseSearchOptions[search.dataset.options] || [];
  let visibleOptions = [];
  let activeIndex = -1;

  function setActive(index) {
    if (!visibleOptions.length) return;
    activeIndex = (index + visibleOptions.length) % visibleOptions.length;
    Array.from(listbox.querySelectorAll("[role='option']")).forEach(function(option, optionIndex) {
      option.classList.toggle("is-active", optionIndex === activeIndex);
      option.setAttribute("aria-selected", String(optionIndex === activeIndex));
    });
    input.setAttribute("aria-activedescendant", listbox.id + "-option-" + activeIndex);
    const activeOption = listbox.querySelector("#" + CSS.escape(listbox.id + "-option-" + activeIndex));
    if (activeOption && activeOption.scrollIntoView) activeOption.scrollIntoView({ block: "nearest" });
  }

  function choose(option) {
    input.value = option;
    input.dataset.value = option;
    input.setCustomValidity("");
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.removeAttribute("aria-activedescendant");
    closeNewCaseSearch(search);
  }

  function showOptions(query) {
    const normalizedQuery = String(query || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX");
    visibleOptions = options.filter(function(option) {
      return option.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX").includes(normalizedQuery);
    });
    listbox.replaceChildren();
    if (!visibleOptions.length) {
      const empty = document.createElement("div");
      empty.className = "case-create-empty";
      empty.textContent = "No se encontraron opciones.";
      listbox.appendChild(empty);
    } else {
      visibleOptions.forEach(function(option, index) {
        const row = document.createElement("button");
        row.type = "button";
        row.id = listbox.id + "-option-" + index;
        row.className = "case-create-option";
        row.setAttribute("role", "option");
        row.setAttribute("aria-selected", String(input.dataset.value === option));
        row.textContent = option;
        row.addEventListener("pointerdown", function(event) { event.preventDefault(); });
        row.addEventListener("click", function() { choose(option); });
        listbox.appendChild(row);
      });
    }
    activeIndex = visibleOptions.length ? 0 : -1;
    listbox.hidden = false;
    search.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
    const bounds = search.getBoundingClientRect();
    const expectedHeight = Math.min(listbox.scrollHeight, Math.min(230, window.innerHeight * .34));
    search.classList.toggle("opens-up", bounds.bottom + expectedHeight + 5 > window.innerHeight && bounds.top > window.innerHeight / 2);
    input.removeAttribute("aria-activedescendant");
    if (activeIndex >= 0) setActive(activeIndex);
  }

  input.addEventListener("focus", function() { showOptions(input.value); });
  input.addEventListener("click", function() { if (listbox.hidden) showOptions(input.value); });
  input.addEventListener("input", function() {
    input.dataset.value = "";
    input.setCustomValidity("");
    showOptions(input.value);
  });
  input.addEventListener("keydown", function(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (listbox.hidden) showOptions(input.value);
      else setActive(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter" && !listbox.hidden && activeIndex >= 0) {
      event.preventDefault();
      choose(visibleOptions[activeIndex]);
    } else if (event.key === "Escape" && !listbox.hidden) {
      event.preventDefault();
      closeNewCaseSearch(search);
    }
  });
  input.addEventListener("blur", function(event) {
    if (!search.contains(event.relatedTarget)) closeNewCaseSearch(search);
  });
}

Array.from(newCaseModal.querySelectorAll(".case-create-search")).forEach(initializeNewCaseSearch);

function clearNewCaseEvidence() {
  if (newCaseEvidenceUrl) URL.revokeObjectURL(newCaseEvidenceUrl);
  newCaseEvidenceFile = null;
  newCaseEvidenceUrl = "";
  newCaseFileInput.value = "";
  document.getElementById("newCaseEvidenceImage").removeAttribute("src");
  document.getElementById("newCaseEvidenceName").textContent = "";
  document.getElementById("newCaseEvidencePreview").hidden = true;
  newCaseDropzone.hidden = false;
  document.getElementById("newCaseEvidenceError").hidden = true;
  document.getElementById("newCaseEvidenceError").textContent = "";
}

function acceptNewCaseEvidence(file) {
  if (!file) return;
  const error = document.getElementById("newCaseEvidenceError");
  error.hidden = true;
  error.textContent = "";
  const acceptedTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!acceptedTypes.includes(file.type)) {
    error.textContent = "Elige una imagen PNG, JPG o WEBP.";
    error.hidden = false;
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    error.textContent = "La imagen debe pesar 5 MB o menos.";
    error.hidden = false;
    return;
  }
  if (newCaseEvidenceUrl) URL.revokeObjectURL(newCaseEvidenceUrl);
  newCaseEvidenceFile = file;
  newCaseEvidenceUrl = URL.createObjectURL(file);
  newCaseEvidenceRemoved = false;
  document.getElementById("newCaseEvidenceImage").src = newCaseEvidenceUrl;
  document.getElementById("newCaseEvidenceName").textContent = file.name || "Captura pegada";
  document.getElementById("newCaseEvidencePreview").hidden = false;
  newCaseDropzone.hidden = true;
  newCaseDirty = true;
}

function resetNewCaseDraft() {
  editingCaseId = "";
  newCaseEditOriginalValues = null;
  newCaseEvidenceRemoved = false;
  newCaseForm.reset();
  newCaseDirty = false;
  document.getElementById("newCaseTitle").textContent = "Nuevo caso";
  document.getElementById("newCaseSubtitle").textContent = "Revisa toda la información antes de guardar.";
  document.getElementById("submitNewCase").textContent = "Registrar caso";
  document.getElementById("newCaseNumber").readOnly = false;
  document.getElementById("newCaseDescriptionCount").textContent = "0";
  clearNewCaseValidation();
  document.querySelectorAll(".case-create-search").forEach(function(search) {
    const input = search.querySelector("input");
    input.value = "";
    input.dataset.value = "";
    input.setCustomValidity("");
    closeNewCaseSearch(search);
  });
  clearNewCaseEvidence();
  const status = document.getElementById("newCaseStatus");
  status.value = "Pendiente";
  status.closest(".new-case-status-wrap").dataset.status = status.value;
  if (status._syncInrouteSelect) status._syncInrouteSelect();
  updateNewCaseSystemInfo();
}

function openNewCaseModal() {
  resetNewCaseDraft();
  newCaseBackdrop.hidden = false;
  newCaseModal.hidden = false;
  document.body.classList.add("new-case-open");
  document.getElementById("newCaseNumber").focus();
}

function openEditCaseModal(item) {
  if (!item || !isCaseOwnedByCurrentUser(item)) return;
  resetNewCaseDraft();
  editingCaseId = item.id;
  document.getElementById("newCaseNumber").value = item.id;
  document.getElementById("newCaseNumber").readOnly = true;
  ["newCaseClient", "newCaseDevice", "newCaseReason"].forEach(function(id) {
    const input = document.getElementById(id);
    const key = id === "newCaseClient" ? "client" : id === "newCaseDevice" ? "device" : "reason";
    input.value = item[key];
    input.dataset.value = item[key];
  });
  document.getElementById("newCaseUnit").value = item.unit;
  document.getElementById("newCaseDescription").value = item.description;
  document.getElementById("newCaseDescriptionCount").textContent = item.description.length;
  const status = document.getElementById("newCaseStatus");
  status.value = item.status;
  status.closest(".new-case-status-wrap").dataset.status = status.value;
  if (status._syncInrouteSelect) status._syncInrouteSelect();
  if (item.capture) {
    document.getElementById("newCaseEvidenceImage").src = item.capture;
    document.getElementById("newCaseEvidenceName").textContent = "Evidencia actual";
    document.getElementById("newCaseEvidencePreview").hidden = false;
    newCaseDropzone.hidden = true;
  }
  updateNewCaseSystemInfo(new Date(item.registeredAt));
  newCaseEditOriginalValues = ["newCaseNumber", "newCaseClient", "newCaseUnit", "newCaseDevice", "newCaseReason", "newCaseDescription"]
    .map(function(id) { return document.getElementById(id).value; })
    .concat([status.value]);
  document.getElementById("newCaseTitle").textContent = "Editar caso";
  document.getElementById("newCaseSubtitle").textContent = "Actualiza la información del caso.";
  document.getElementById("submitNewCase").textContent = "Guardar cambios";
  newCaseBackdrop.hidden = false;
  newCaseModal.hidden = false;
  document.body.classList.add("new-case-open");
  document.getElementById("newCaseUnit").focus();
}

function closeNewCaseDiscardConfirmation(restoreFocus) {
  newCaseDiscardDialog.hidden = true;
  newCaseDiscardBackdrop.hidden = true;
  if (restoreFocus && newCaseDiscardReturnFocus && newCaseDiscardReturnFocus.focus) newCaseDiscardReturnFocus.focus();
  newCaseDiscardReturnFocus = null;
}

function closeNewCaseForm() {
  newCaseModal.hidden = true;
  newCaseBackdrop.hidden = true;
  document.body.classList.remove("new-case-open");
  resetNewCaseDraft();
  document.getElementById("openNewCase").focus();
}

function showNewCaseDiscardConfirmation() {
  newCaseDiscardReturnFocus = document.activeElement;
  newCaseDiscardBackdrop.hidden = false;
  newCaseDiscardDialog.hidden = false;
  document.getElementById("keepEditingNewCase").focus();
}

function finishCloseNewCase() {
  if (hasNewCaseChanges()) {
    showNewCaseDiscardConfirmation();
    return;
  }
  closeNewCaseForm();
}

document.getElementById("openNewCase").addEventListener("click", openNewCaseModal);
document.getElementById("closeNewCase").addEventListener("click", finishCloseNewCase);
document.getElementById("cancelNewCase").addEventListener("click", finishCloseNewCase);
newCaseBackdrop.addEventListener("click", finishCloseNewCase);
document.getElementById("keepEditingNewCase").addEventListener("click", function() { closeNewCaseDiscardConfirmation(true); });
document.getElementById("discardNewCaseChanges").addEventListener("click", function() {
  closeNewCaseDiscardConfirmation(false);
  closeNewCaseForm();
});
newCaseDiscardBackdrop.addEventListener("click", function() { closeNewCaseDiscardConfirmation(true); });
newCaseDiscardDialog.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeNewCaseDiscardConfirmation(true);
  } else if (event.key === "Tab") {
    const focusable = Array.from(newCaseDiscardDialog.querySelectorAll("button:not(:disabled)"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
newCaseForm.addEventListener("input", function(event) {
  newCaseDirty = true;
  clearNewCaseFieldValidation(event.target.id);
  if (event.target.id === "newCaseDescription") {
    if (event.target.value.length > 500) event.target.value = event.target.value.slice(0, 500);
    document.getElementById("newCaseDescriptionCount").textContent = event.target.value.length;
  }
  if (event.target.id === "newCaseNumber") event.target.setCustomValidity("");
});
newCaseForm.addEventListener("change", function(event) {
  newCaseDirty = true;
  clearNewCaseFieldValidation(event.target.id);
  if (event.target.id === "newCaseStatus") {
    event.target.closest(".new-case-status-wrap").dataset.status = event.target.value;
  }
});
document.addEventListener("pointerdown", function(event) {
  document.querySelectorAll(".case-create-search.is-open").forEach(function(search) {
    if (!search.contains(event.target)) closeNewCaseSearch(search);
  });
});

function openNewCaseFilePicker() {
  newCaseFileInput.value = "";
  newCaseFileInput.click();
}
document.getElementById("selectNewCaseEvidence").addEventListener("click", openNewCaseFilePicker);
document.getElementById("replaceNewCaseEvidence").addEventListener("click", openNewCaseFilePicker);
document.getElementById("removeNewCaseEvidence").addEventListener("click", function() {
  clearNewCaseEvidence();
  newCaseEvidenceRemoved = true;
  newCaseDirty = true;
});
newCaseFileInput.addEventListener("change", function() {
  if (newCaseFileInput.files && newCaseFileInput.files[0]) acceptNewCaseEvidence(newCaseFileInput.files[0]);
});
newCaseDropzone.addEventListener("click", function(event) {
  if (!event.target.closest("button")) openNewCaseFilePicker();
});
newCaseDropzone.addEventListener("dragover", function(event) {
  event.preventDefault();
  newCaseDropzone.classList.add("is-dragging");
});
newCaseDropzone.addEventListener("dragleave", function(event) {
  if (!newCaseDropzone.contains(event.relatedTarget)) newCaseDropzone.classList.remove("is-dragging");
});
newCaseDropzone.addEventListener("drop", function(event) {
  event.preventDefault();
  newCaseDropzone.classList.remove("is-dragging");
  if (event.dataTransfer.files && event.dataTransfer.files[0]) acceptNewCaseEvidence(event.dataTransfer.files[0]);
});
newCaseModal.addEventListener("paste", function(event) {
  if (newCaseModal.hidden) return;
  const items = Array.from(event.clipboardData && event.clipboardData.items || []);
  const imageItem = items.find(function(item) { return item.type.indexOf("image/") === 0; });
  if (!imageItem) return;
  event.preventDefault();
  const file = imageItem.getAsFile();
  if (file) acceptNewCaseEvidence(file);
});

function fileToDataUrl(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = function() { reject(reader.error || new Error("No se pudo leer la imagen.")); };
    reader.readAsDataURL(file);
  });
}

newCaseForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  const validationErrors = [];
  const searchInputs = Array.from(newCaseModal.querySelectorAll(".case-create-search > input"));
  searchInputs.forEach(function(input) {
    const matches = newCaseSearchOptions[input.closest(".case-create-search").dataset.options];
    const isSelectedOption = Boolean(input.dataset.value && input.dataset.value === input.value && matches.includes(input.dataset.value));
    const message = input.value ? "Selecciona una opción disponible de la lista." : "Selecciona una opción de la lista.";
    input.setCustomValidity(isSelectedOption ? "" : message);
    if (!isSelectedOption) validationErrors.push({ fieldId: input.id, message: message });
  });
  const idField = document.getElementById("newCaseNumber");
  const caseId = idField.value.trim();
  const duplicateCaseId = Boolean(caseId && demoCases.some(function(item) {
    return item.id !== editingCaseId && item.id.toLocaleLowerCase("es-MX") === caseId.toLocaleLowerCase("es-MX");
  }));
  const numberMessage = !caseId ? "Escribe el número de caso." : duplicateCaseId ? "Ya existe un caso con ese número." : "";
  idField.setCustomValidity(numberMessage);
  if (numberMessage) validationErrors.push({ fieldId: "newCaseNumber", message: numberMessage });

  const unitField = document.getElementById("newCaseUnit");
  const unitMessage = unitField.value.trim() ? "" : "Escribe la unidad o económico.";
  unitField.setCustomValidity(unitMessage);
  if (unitMessage) validationErrors.push({ fieldId: "newCaseUnit", message: unitMessage });

  const statusField = document.getElementById("newCaseStatus");
  const statusMessage = statusField.value ? "" : "Selecciona un estado.";
  statusField.setCustomValidity(statusMessage);
  if (statusMessage) validationErrors.push({ fieldId: "newCaseStatus", message: statusMessage });

  const descriptionField = document.getElementById("newCaseDescription");
  const descriptionMessage = descriptionField.value.trim() ? "" : "Escribe la descripción del caso.";
  descriptionField.setCustomValidity(descriptionMessage);
  if (descriptionMessage) validationErrors.push({ fieldId: "newCaseDescription", message: descriptionMessage });

  validationErrors.sort(function(left, right) {
    return newCaseValidationFields.indexOf(left.fieldId) - newCaseValidationFields.indexOf(right.fieldId);
  });
  if (!showNewCaseValidation(validationErrors)) return;

  const submitButton = document.getElementById("submitNewCase");
  submitButton.disabled = true;
  submitButton.textContent = editingCaseId ? "Guardando..." : "Registrando...";
  try {
    const registeredAt = new Date();
    const capture = newCaseEvidenceFile ? await fileToDataUrl(newCaseEvidenceFile) : "";
    const editTarget = editingCaseId ? demoCases.find(function(item) { return item.id === editingCaseId; }) : null;
    const updatedCase = {
      id: editingCaseId || caseId,
      registeredAt: editTarget ? editTarget.registeredAt : registeredAt.toISOString(),
      client: document.getElementById("newCaseClient").dataset.value,
      unit: document.getElementById("newCaseUnit").value.trim(),
      reason: document.getElementById("newCaseReason").dataset.value,
      device: document.getElementById("newCaseDevice").dataset.value,
      status: document.getElementById("newCaseStatus").value,
      brief: document.getElementById("newCaseDescription").value.trim().slice(0, 120),
      description: document.getElementById("newCaseDescription").value.trim(),
      capture: newCaseEvidenceFile ? capture : editTarget && !newCaseEvidenceRemoved ? editTarget.capture : "",
      createdBy: editTarget ? editTarget.createdBy : getCurrentCaseUser()
    };
    if (editTarget) Object.assign(editTarget, updatedCase);
    else demoCases.unshift(updatedCase);
    updateNewCaseSystemInfo(registeredAt);
    newCaseDirty = false;
    newCaseModal.hidden = true;
    newCaseBackdrop.hidden = true;
    document.body.classList.remove("new-case-open");
    resetNewCaseDraft();
    renderCaseTable();
    document.getElementById("openNewCase").focus();
  } catch (error) {
    const errorElement = document.getElementById("newCaseEvidenceError");
    errorElement.textContent = "No se pudo leer la imagen. Inténtalo de nuevo.";
    errorElement.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Registrar caso";
  }
});

newCaseModal.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    const openSearch = newCaseModal.querySelector(".case-create-search.is-open");
    if (openSearch) {
      event.preventDefault();
      closeNewCaseSearch(openSearch);
    } else {
      event.preventDefault();
      finishCloseNewCase();
    }
  } else if (event.key === "Tab") {
    const focusable = Array.from(newCaseModal.querySelectorAll("button:not(:disabled), input:not([type='file']):not(:disabled), textarea:not(:disabled), select:not(:disabled)"))
      .filter(function(element) { return !element.closest("[hidden]"); });
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

/* =====================================================
   SOLICITUDES WHATSAPP - DATOS Y FLUJO DE DEMOSTRACIÓN
===================================================== */

const whatsappState = { page: 1, pageSize: 10, results: [], view: "all" };
let nextWhatsAppRequestNumber = demoWhatsAppRequests.length + 1;

function whatsappDateKey(value) {
  const date = new Date(value);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function whatsappDateBounds() {
  const period = document.getElementById("whatsappPeriod").value;
  const now = new Date();
  if (period === "specificMonth") {
    const month = document.getElementById("whatsappSpecificMonth").value;
    return { start: month ? month + "-01" : "", end: month ? month + "-31" : "" };
  }
  if (period === "customRange") {
    return {
      start: document.getElementById("whatsappDateStart").value,
      end: document.getElementById("whatsappDateEnd").value
    };
  }
  const monthStart = new Date(now.getFullYear(), now.getMonth() + (period === "lastMonth" ? -1 : 0), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + (period === "lastMonth" ? 0 : 1), 0);
  return { start: whatsappDateKey(monthStart), end: whatsappDateKey(monthEnd) };
}

function getFilteredWhatsAppRequests() {
  const period = document.getElementById("whatsappPeriod").value;
  const bounds = whatsappDateBounds();
  if (period === "specificMonth" && !document.getElementById("whatsappSpecificMonth").value) return [];
  if (bounds.start && bounds.end && bounds.start > bounds.end) return [];
  const client = document.getElementById("whatsappClient").value;
  const requestType = document.getElementById("whatsappType").value;
  const device = document.getElementById("whatsappDevice").value;
  const status = document.getElementById("whatsappStatus").value;
  const responsible = document.getElementById("whatsappResponsible").value;
  const query = normalizeCaseSearch(document.getElementById("whatsappQuickSearch").value);
  return demoWhatsAppRequests.filter(function(item) {
    const dateKey = whatsappDateKey(item.registeredAt);
    const searchableFields = [item.client, item.unit, item.requestType, item.device, item.description, item.responsible];
    const matchesQuery = !query || searchableFields.some(function(value) { return normalizeCaseSearch(value).includes(query); });
    return (whatsappState.view !== "mine" || item.responsible.toLocaleLowerCase("es-MX") === getCurrentCaseUser().toLocaleLowerCase("es-MX")) &&
      (!bounds.start || dateKey >= bounds.start) && (!bounds.end || dateKey <= bounds.end) &&
      (!client || item.client === client) && (!requestType || item.requestType === requestType) &&
      (!device || item.device === device) && (!status || item.status === status) &&
      (!responsible || item.responsible === responsible) && matchesQuery;
  }).sort(function(a, b) { return new Date(b.registeredAt) - new Date(a.registeredAt); });
}

function renderWhatsAppTable() {
  const period = document.getElementById("whatsappPeriod").value;
  document.getElementById("whatsappMonthField").hidden = period !== "specificMonth";
  document.getElementById("whatsappRangeFields").hidden = period !== "customRange";
  whatsappState.results = getFilteredWhatsAppRequests();
  const total = whatsappState.results.length;
  document.getElementById("whatsappShowAllRequests").classList.toggle("is-active", whatsappState.view === "all");
  document.getElementById("whatsappShowAllRequests").setAttribute("aria-pressed", whatsappState.view === "all" ? "true" : "false");
  document.getElementById("whatsappShowMyRequests").classList.toggle("is-active", whatsappState.view === "mine");
  document.getElementById("whatsappShowMyRequests").setAttribute("aria-pressed", whatsappState.view === "mine" ? "true" : "false");
  const pageCount = Math.max(1, Math.ceil(total / whatsappState.pageSize));
  whatsappState.page = Math.min(whatsappState.page, pageCount);
  const start = (whatsappState.page - 1) * whatsappState.pageSize;
  const visible = whatsappState.results.slice(start, start + whatsappState.pageSize);
  const tbody = document.getElementById("whatsappTableBody");
  tbody.innerHTML = visible.map(function(item) {
    const action = "<button type='button' class='case-eye-button' data-whatsapp-action='view' data-whatsapp-id='" + escapeCaseHtml(item.id) + "' aria-label='Ver detalle de solicitud " + escapeCaseHtml(item.unit) + "'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z'/><circle cx='12' cy='12' r='2.7'/></svg></button>";
    return "<tr>" +
      "<td class='case-date-cell'>" + escapeCaseHtml(formatCaseDate(item.registeredAt, false)) + "</td>" +
      "<td class='whatsapp-client-cell'>" + escapeCaseHtml(item.client) + "</td>" +
      "<td>" + escapeCaseHtml(item.requestType) + "</td>" +
      "<td>" + escapeCaseHtml(item.device || "—") + "</td>" +
      "<td>" + escapeCaseHtml(item.unit) + "</td>" +
      "<td>" + escapeCaseHtml(item.responsible) + "</td>" +
      "<td><span class='status-pill " + statusClass(item.status) + "'>" + escapeCaseHtml(item.status) + "</span></td>" +
      "<td><span class='case-row-actions'>" + action + "</span></td></tr>";
  }).join("");
  document.getElementById("whatsappEmptyState").hidden = total !== 0;
  document.querySelector(".whatsapp-table").hidden = total === 0;
  const rangeStart = total ? Math.min(start + 1, total) : 0;
  const rangeEnd = Math.min(start + visible.length, total);
  document.getElementById("whatsappResultSummary").textContent = total
    ? "Mostrando " + rangeStart + " a " + rangeEnd + " de " + total + " solicitudes"
    : "0 resultados";
  document.getElementById("whatsappPageSummary").textContent = "Página " + whatsappState.page + " de " + pageCount;
  document.getElementById("whatsappPreviousPage").disabled = whatsappState.page <= 1;
  document.getElementById("whatsappNextPage").disabled = whatsappState.page >= pageCount;
  renderHomeDashboard();

  const pending = whatsappState.results.filter(function(item) { return item.status === "Pendiente"; }).length;
  const escalated = whatsappState.results.filter(function(item) { return item.status === "Escalado a Freshservice"; }).length;
  document.getElementById("totalWhatsAppKpi").textContent = total;
  document.getElementById("pendingWhatsAppKpi").textContent = pending;
  document.getElementById("escalatedWhatsAppKpi").textContent = escalated;
  document.getElementById("pendingWhatsAppNote").textContent = (total ? (pending / total * 100).toFixed(1) : "0.0") + "% del total";
  document.getElementById("escalatedWhatsAppNote").textContent = (total ? (escalated / total * 100).toFixed(1) : "0.0") + "% del total";
  if (total) {
    document.getElementById("latestWhatsAppKpi").textContent = formatCaseDate(whatsappState.results[0].registeredAt, false);
    document.getElementById("latestWhatsAppTimeKpi").textContent = new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(whatsappState.results[0].registeredAt));
  } else {
    document.getElementById("latestWhatsAppKpi").textContent = "—";
    document.getElementById("latestWhatsAppTimeKpi").textContent = "";
  }
}

function resetWhatsAppPageAndRender() { whatsappState.page = 1; renderWhatsAppTable(); }
document.getElementById("whatsappShowAllRequests").addEventListener("click", function() {
  whatsappState.view = "all";
  resetWhatsAppPageAndRender();
});
document.getElementById("whatsappShowMyRequests").addEventListener("click", function() {
  whatsappState.view = "mine";
  resetWhatsAppPageAndRender();
});
document.getElementById("whatsappQuickSearch").addEventListener("input", function() {
  document.getElementById("clearWhatsAppQuickSearch").hidden = !this.value;
  resetWhatsAppPageAndRender();
});
document.getElementById("clearWhatsAppQuickSearch").addEventListener("click", function() {
  const input = document.getElementById("whatsappQuickSearch");
  input.value = "";
  this.hidden = true;
  resetWhatsAppPageAndRender();
  input.focus();
});
["whatsappPeriod", "whatsappSpecificMonth", "whatsappDateStart", "whatsappDateEnd", "whatsappClient", "whatsappType", "whatsappDevice", "whatsappStatus", "whatsappResponsible"].forEach(function(id) {
  document.getElementById(id).addEventListener("change", resetWhatsAppPageAndRender);
});
document.getElementById("whatsappPageSize").addEventListener("change", function() {
  whatsappState.pageSize = Number(this.value);
  resetWhatsAppPageAndRender();
});
document.getElementById("whatsappPreviousPage").addEventListener("click", function() {
  if (whatsappState.page > 1) { whatsappState.page -= 1; renderWhatsAppTable(); }
});
document.getElementById("whatsappNextPage").addEventListener("click", function() {
  const pageCount = Math.max(1, Math.ceil(whatsappState.results.length / whatsappState.pageSize));
  if (whatsappState.page < pageCount) { whatsappState.page += 1; renderWhatsAppTable(); }
});
document.getElementById("clearWhatsAppFilters").addEventListener("click", function() {
  ["whatsappClient", "whatsappType", "whatsappDevice", "whatsappStatus", "whatsappResponsible"].forEach(function(id) {
    const select = document.getElementById(id);
    select.value = "";
    if (select._syncInrouteSelect) select._syncInrouteSelect();
  });
  document.getElementById("whatsappPeriod").value = "thisMonth";
  document.getElementById("whatsappSpecificMonth").value = "";
  document.getElementById("whatsappDateStart").value = "";
  document.getElementById("whatsappDateEnd").value = "";
  syncWhatsAppMonthTrigger();
  document.getElementById("whatsappDateStartValue").textContent = "Selecciona una fecha";
  document.getElementById("whatsappDateEndValue").textContent = "Selecciona una fecha";
  const period = document.getElementById("whatsappPeriod");
  if (period._syncInrouteSelect) period._syncInrouteSelect();
  document.getElementById("whatsappQuickSearch").value = "";
  document.getElementById("clearWhatsAppQuickSearch").hidden = true;
  resetWhatsAppPageAndRender();
});

document.getElementById("exportWhatsApp").addEventListener("click", function() {
  const results = getFilteredWhatsAppRequests();
  if (!results.length) { alert("No hay resultados para exportar con los filtros seleccionados."); return; }
  const rows = [["Fecha", "Cliente", "Tipo de solicitud", "Dispositivo", "Unidad / Económico", "Responsable", "Estado", "Descripción"]];
  results.forEach(function(item) {
    rows.push([formatCaseDate(item.registeredAt, true), item.client, item.requestType, item.device, item.unit, item.responsible, item.status, item.description]);
  });
  const blob = new Blob(["\uFEFF" + rows.map(function(row) { return row.map(csvCell).join(","); }).join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "solicitudes-whatsapp-" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

function openWhatsAppDetail(requestId) {
  const item = demoWhatsAppRequests.find(function(entry) { return entry.id === requestId; });
  if (!item) return;
  document.getElementById("whatsappDetailContent").innerHTML =
    "<div class='detail-status-row'><span class='status-pill " + statusClass(item.status) + "'>" + escapeCaseHtml(item.status) + "</span></div>" +
    "<section class='detail-card'><h3>Información general</h3><div class='detail-fields'>" +
    "<div class='detail-field'><span>Fecha y hora</span><strong>" + escapeCaseHtml(formatCaseDate(item.registeredAt, true)) + "</strong></div>" +
    "<div class='detail-field'><span>Cliente</span><strong>" + escapeCaseHtml(item.client) + "</strong></div>" +
    "<div class='detail-field'><span>Tipo de solicitud</span><strong>" + escapeCaseHtml(item.requestType) + "</strong></div>" +
    "<div class='detail-field'><span>Unidad / Económico</span><strong>" + escapeCaseHtml(item.unit) + "</strong></div>" +
    "<div class='detail-field'><span>Dispositivo</span><strong>" + escapeCaseHtml(item.device || "No aplica") + "</strong></div>" +
    "<div class='detail-field'><span>Responsable</span><strong>" + escapeCaseHtml(item.responsible) + "</strong></div>" +
    "<div class='detail-field'><span>Registrado por</span><strong>" + escapeCaseHtml(item.createdBy || "No disponible") + "</strong></div>" +
    "</div></section><section class='detail-card'><h3>Descripción</h3><p class='detail-description'>" + escapeCaseHtml(item.description) + "</p></section>";
  document.getElementById("whatsappDetailBackdrop").hidden = false;
  document.getElementById("whatsappDetailPanel").hidden = false;
  document.body.classList.add("whatsapp-detail-open");
  document.getElementById("closeWhatsAppDetail").focus();
}

function closeWhatsAppDetail() {
  document.getElementById("whatsappDetailBackdrop").hidden = true;
  document.getElementById("whatsappDetailPanel").hidden = true;
  document.body.classList.remove("whatsapp-detail-open");
}
document.getElementById("whatsappTableBody").addEventListener("click", function(event) {
  const button = event.target.closest("[data-whatsapp-action='view'][data-whatsapp-id]");
  if (button) openWhatsAppDetail(button.dataset.whatsappId);
});
document.getElementById("closeWhatsAppDetail").addEventListener("click", closeWhatsAppDetail);
document.getElementById("whatsappDetailBackdrop").addEventListener("click", closeWhatsAppDetail);
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && !document.getElementById("whatsappDetailPanel").hidden) closeWhatsAppDetail();
});

const newWhatsAppModal = document.getElementById("newWhatsAppModal");
const newWhatsAppForm = document.getElementById("newWhatsAppForm");
const whatsappDiscardBackdrop = document.getElementById("whatsappDiscardBackdrop");
const whatsappDiscardDialog = document.getElementById("whatsappDiscardDialog");
let whatsappDiscardReturnFocus = null;

function updateWhatsAppSystemInfo(date) {
  document.getElementById("whatsappCreatorName").textContent = getCurrentCaseUser() || "—";
  document.getElementById("whatsappSystemDate").textContent = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date || new Date());
}

function hasWhatsAppUnsavedChanges() {
  return ["newWhatsAppClient", "newWhatsAppType", "newWhatsAppUnit", "newWhatsAppDevice", "newWhatsAppDescription"]
    .some(function(id) { return document.getElementById(id).value.length > 0; }) ||
    document.getElementById("newWhatsAppStatus").value !== "Pendiente";
}

function clearWhatsAppValidation() {
  document.getElementById("whatsappValidationSummary").hidden = true;
  document.getElementById("whatsappValidationSummary").textContent = "";
  newWhatsAppForm.querySelectorAll(".new-case-field.has-error").forEach(function(field) { field.classList.remove("has-error"); });
  newWhatsAppForm.querySelectorAll(".new-case-field-error").forEach(function(error) { error.hidden = true; error.textContent = ""; });
}

function openNewWhatsAppModal() {
  newWhatsAppForm.reset();
  ["newWhatsAppClient", "newWhatsAppType", "newWhatsAppDevice", "newWhatsAppStatus"].forEach(function(id) {
    const select = document.getElementById(id);
    if (select._syncInrouteSelect) select._syncInrouteSelect();
  });
  document.getElementById("newWhatsAppStatus").closest(".whatsapp-status-wrap").dataset.status = "Pendiente";
  document.getElementById("newWhatsAppDescriptionCount").textContent = "0";
  clearWhatsAppValidation();
  updateWhatsAppSystemInfo();
  whatsappDiscardDialog.hidden = true;
  whatsappDiscardBackdrop.hidden = true;
  document.getElementById("newWhatsAppBackdrop").hidden = false;
  newWhatsAppModal.hidden = false;
  document.body.classList.add("new-case-open", "whatsapp-modal-open");
  document.getElementById("newWhatsAppClient-trigger").focus();
}

function closeNewWhatsAppModal() {
  newWhatsAppModal.hidden = true;
  document.getElementById("newWhatsAppBackdrop").hidden = true;
  whatsappDiscardDialog.hidden = true;
  whatsappDiscardBackdrop.hidden = true;
  document.body.classList.remove("new-case-open", "whatsapp-modal-open");
  newWhatsAppForm.reset();
  ["newWhatsAppClient", "newWhatsAppType", "newWhatsAppDevice", "newWhatsAppStatus"].forEach(function(id) {
    const select = document.getElementById(id);
    if (select._syncInrouteSelect) select._syncInrouteSelect();
  });
  document.getElementById("newWhatsAppStatus").closest(".whatsapp-status-wrap").dataset.status = "Pendiente";
  document.getElementById("newWhatsAppDescriptionCount").textContent = "0";
  clearWhatsAppValidation();
  document.getElementById("openNewWhatsApp").focus();
}

function closeWhatsAppDiscardConfirmation(restoreFocus) {
  whatsappDiscardDialog.hidden = true;
  whatsappDiscardBackdrop.hidden = true;
  if (restoreFocus && whatsappDiscardReturnFocus && whatsappDiscardReturnFocus.focus) whatsappDiscardReturnFocus.focus();
  whatsappDiscardReturnFocus = null;
}

function showWhatsAppDiscardConfirmation() {
  if (!whatsappDiscardDialog.hidden) return;
  whatsappDiscardReturnFocus = document.activeElement;
  whatsappDiscardBackdrop.hidden = false;
  whatsappDiscardDialog.hidden = false;
  document.getElementById("keepEditingWhatsApp").focus();
}

function finishCloseWhatsApp() {
  if (hasWhatsAppUnsavedChanges()) {
    showWhatsAppDiscardConfirmation();
    return;
  }
  closeNewWhatsAppModal();
}

document.getElementById("openNewWhatsApp").addEventListener("click", openNewWhatsAppModal);
document.getElementById("closeNewWhatsApp").addEventListener("click", finishCloseWhatsApp);
document.getElementById("cancelNewWhatsApp").addEventListener("click", finishCloseWhatsApp);
document.getElementById("newWhatsAppBackdrop").addEventListener("click", finishCloseWhatsApp);
document.getElementById("keepEditingWhatsApp").addEventListener("click", function() { closeWhatsAppDiscardConfirmation(true); });
document.getElementById("discardWhatsAppChanges").addEventListener("click", function() {
  closeWhatsAppDiscardConfirmation(false);
  closeNewWhatsAppModal();
});
whatsappDiscardBackdrop.addEventListener("click", function() { closeWhatsAppDiscardConfirmation(true); });
whatsappDiscardDialog.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeWhatsAppDiscardConfirmation(true);
  } else if (event.key === "Tab") {
    const focusable = Array.from(whatsappDiscardDialog.querySelectorAll("button:not(:disabled)"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

document.getElementById("newWhatsAppDescription").addEventListener("input", function() {
  document.getElementById("newWhatsAppDescriptionCount").textContent = this.value.length;
});
newWhatsAppForm.addEventListener("input", function(event) {
  const error = document.getElementById(event.target.id + "Error");
  if (error) { error.hidden = true; error.textContent = ""; }
  const field = event.target.closest(".new-case-field");
  if (field) field.classList.remove("has-error");
});
newWhatsAppForm.addEventListener("change", function(event) {
  const error = document.getElementById(event.target.id + "Error");
  if (error) { error.hidden = true; error.textContent = ""; }
  const field = event.target.closest(".new-case-field");
  if (field) field.classList.remove("has-error");
});

newWhatsAppForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const currentUser = getCurrentCaseUser().trim();
  const description = document.getElementById("newWhatsAppDescription");
  const requiredFields = [
    ["newWhatsAppClient", "Selecciona un cliente."],
    ["newWhatsAppType", "Selecciona un tipo de solicitud."],
    ["newWhatsAppUnit", "Escribe la unidad o económico."],
    ["newWhatsAppStatus", "Selecciona un estado."],
    ["newWhatsAppDescription", "Escribe la descripción de la solicitud."]
  ];
  const errors = requiredFields.map(function(entry) {
    const control = document.getElementById(entry[0]);
    const missing = !String(control.value || "").trim();
    return missing ? { id: entry[0], message: entry[1], control: control } : null;
  }).filter(Boolean);
  if (description.value.length > 100) errors.push({ id: "newWhatsAppDescription", message: "La descripción no puede superar los 100 caracteres.", control: description });

  const summary = document.getElementById("whatsappValidationSummary");
  clearWhatsAppValidation();
  if (!currentUser) {
    summary.textContent = "No se pudo identificar al usuario de la sesión. Vuelve a iniciar sesión.";
    summary.hidden = false;
    return;
  }
  if (errors.length) {
    summary.textContent = "Revisa los campos marcados antes de registrar la solicitud.";
    summary.hidden = false;
    errors.forEach(function(error, index) {
      error.control.closest(".new-case-field").classList.add("has-error");
      const message = document.getElementById(error.id + "Error");
      message.textContent = error.message;
      message.hidden = false;
      if (index === 0) error.control.focus();
    });
    return;
  }

  const submit = document.getElementById("submitNewWhatsApp");
  submit.disabled = true;
  submit.textContent = "Registrando...";
  try {
    const registeredAt = new Date();
    const item = {
      id: "WA-" + String(nextWhatsAppRequestNumber++).padStart(3, "0"),
      registeredAt: registeredAt.toISOString(),
      client: document.getElementById("newWhatsAppClient").value,
      requestType: document.getElementById("newWhatsAppType").value,
      unit: document.getElementById("newWhatsAppUnit").value.trim(),
      device: document.getElementById("newWhatsAppDevice").value,
      description: description.value.trim(),
      responsible: currentUser,
      status: document.getElementById("newWhatsAppStatus").value,
      createdBy: currentUser
    };
    demoWhatsAppRequests.unshift(item);
    updateWhatsAppSystemInfo(registeredAt);
    closeNewWhatsAppModal();
    resetWhatsAppPageAndRender();
  } catch (error) {
    summary.textContent = "No se pudo registrar la solicitud. Inténtalo de nuevo.";
    summary.hidden = false;
  } finally {
    submit.disabled = false;
    submit.textContent = "Registrar solicitud";
  }
});

newWhatsAppModal.addEventListener("keydown", function(event) {
  if (event.key === "Escape") { event.preventDefault(); finishCloseWhatsApp(); }
  else if (event.key === "Tab") {
    const focusable = Array.from(newWhatsAppModal.querySelectorAll("button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled)"))
      .filter(function(element) { return !element.closest("[hidden]"); });
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

document.getElementById("whatsappStatus")._syncInrouteSelect();
document.getElementById("newWhatsAppStatus")._syncInrouteSelect();
renderWhatsAppTable();
