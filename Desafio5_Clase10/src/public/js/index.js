const socket = io();
const containerCardsProducts = document.querySelector(
  "#containerCards_products"
);

const products = [];
console.log("hola mundo");
socket.emit("getProducts", null);

socket.on("products", (data) => {
  console.log(data);
  renderProducts(data);
});

const renderProducts = (products) => {
  let plantilla = "";
  products.forEach(
    ({ code, description, id, price, status, stock, thumbnail, title }) => {
      plantilla += `
<div class="col">
      <div class="card" style="width: 18rem;">

        <svg
          class="bd-placeholder-img card-img-top"
          role="img"
          aria-label="Marcador de posición: Cap de imagen"
          focusable="false"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Marcador de posición</title>
          <rect width="100%" height="100%" fill="#868e96"></rect><text
            x="50%"
            y="50%"
            fill="#dee2e6"
            dy=".3em"
          >
          ${thumbnail.length > 0 ? thumbnail[0] : "Sin imagen previa"}}
            
          </text>
        </svg>

        <div class="card-body">
          <h5 class="card-title"> ${title}</h5>
          <p>Id:${id}</p>
          <p class="card-text">${description}</p>
          <p class="card-text"><span>Price: $${price}</span>
            <span>Stock: ${stock}</span></p>
          <p class="card-text">${code}</p>

        </div>
      </div>
    </div>`;
    }
  );
  containerCardsProducts.innerHTML = plantilla;
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formAddProducts");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateFormNotEmpty(form)) {
      const formData = new FormData(form);

      // Crear un objeto para almacenar los datos del formulario
      const formDataObject = {};

      // Iterar sobre las entradas del objeto FormData y asignarlas al objeto
      formData.forEach((value, key) => {
        // Verificar si la clave es 'thumbnails' y dividir el valor en un array
        if (key === "thumbnails") {
          formDataObject[key] = value.split(",");
        } else if (key === "status") {
          // Convertir el valor booleano a un valor string ('true' o 'false')
          console.log(value);
          formDataObject[key] = value == "on" ? true : false
          
        } else if (key === "price") {
            // Convertir a valor numerico
            formDataObject[key] = parseFloat(value);
        
        } else if (key === "stock") {
            // Convertir a valor numerico
            formDataObject[key] = parseInt(value);
        }
         else {
          formDataObject[key] = value;
        }
      });

      console.log(formDataObject);
      socket.emit("addNewProduct", formDataObject);
    } else {
      console.log("Todos los campos son obligatorios");
    }
  });
});

function validateFormNotEmpty(form) {
  // Obtener todos los campos del formulario
  const formFields = form.querySelectorAll("input, select, textarea");

  // Verificar que ningún campo esté vacío
  for (const field of formFields) {
    if (!field.value.trim()) {
      return false; // Devuelve falso si encuentra algún campo vacío
    }
  }

  return true;
}

socket.on("error", (data) => console.error(data));
