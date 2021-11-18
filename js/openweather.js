//En este script, se obtienen los datos de la API de OpenWeather.

var nombreCiudad = document.getElementById('city-name');
var buscador = document.getElementById('search-bar');
var formBuscador = document.getElementById('search-form');
var contenedorTarjetas = document.getElementById('cards-container');
const diaSemana = ['Sabado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

//Se muestran los datos en el HTML
const mostrarDatos = (fecha, ciudad, temperaturas) => {


    var fechaActual = new Date(fecha).getDate();

    //Se setea el titulo con el nombre de la ciudad
    nombreCiudad.innerHTML = ciudad;

    contenedorTarjetas.innerHTML = "";

    console.log(temperaturas)

    for (var i = fechaActual; i <= fechaActual + 5; i++) {
        contenedorTarjetas.innerHTML += `
        <div class="col-sm-12 col-md-5 col-lg-2">
                            <div class="card mt-3 bg-dark">
                                <div class="day align-items-center p-2 text-center">
                                    <h3>${temperaturas[i][0]}</h3> 
									<img src="/img/icons/${temperaturas[i][3]}.png" alt="">
									<h4>Máx:${temperaturas[i][2]}</h4>
									<h4>Min:${temperaturas[i][1]}</h4>
								</div>
                            </div>
                        </div>
       `;
    }
}


const obtenerDias = (datos) => {

    //Variables
    var i = 0;
    var j = 0;
    var dias = datos.list;
    var dict = {};
    var maxDia = 0;
    var minDia = 100;

    while (dias[i]) {

        //Se obtiene la fecha de hoy 
        var fechaAux = new Date(dias[j].dt_txt);
        var fechaIndice = new Date(dias[i].dt_txt);

        var nroAuxDia = fechaAux.getDate();
        var nroIndice = fechaIndice.getDate();

        //Se obtiene el icono
        var codIcono = dias[j].weather[0].icon;

        if (nroAuxDia == nroIndice) {

            //Verificar temperaturas minimas y máximas
            var maxJson = dias[i].main.temp_max;
            if (maxJson > maxDia) {
                maxDia = maxJson;
            }
            var minJson = dias[i].main.temp_min;
            if (minJson < minDia) {
                minDia = minJson;
            }

        } else {

            j = i;

            var dia = diaSemana[fechaIndice.getDay()];

            //Se crea entrada con la máxima y mínima 
            dict[nroAuxDia] = [dia, minDia, maxDia, codIcono];

            minDia = 100;
            maxDia = 0;
        }
        i++;
    }

    return dict;

}


//Función con la que se obtendrá el clima, con la latitud y longitud de la ciudad
const getClima = async (ciudad) => {
    //Request de la API
    const res = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?q=${ciudad}&units=metric&lang=sp`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "8c2baee70fmshd1a1b23c7bc7b0dp1008a3jsn256f6f9b7a14"
        }
    });

    if (res.status === 404) {
        contenedorTarjetas.innerHTML = "";
        nombreCiudad.innerHTML = '<h3 class= "error">No se encontró la ciudad ingresada</h3>';

    } else {

        //Se obtiene JSON
        var datos = await res.json();

        //Se obtiene temperatura minima y máxima para los próximos 5 días
        var temperaturas = obtenerDias(datos);

        //Mostrar en HTML
        mostrarDatos(datos.list[0].dt_txt, datos.city.name, temperaturas);

    }
}

formBuscador.addEventListener("submit", e => {
    e.preventDefault();
    getClima(buscador.value);
});

//Al cargarse la ventana, por defecto se seleccionará Neuquén
window.onload = () => {
    getClima("Neuquén");
}

