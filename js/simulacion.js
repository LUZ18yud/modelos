let numerosUi=[];
let formulario = document.getElementById("form");
let tabla = document.getElementById("tabla");
let tablaSimulacion = document.getElementById("tablaSimulacion");
let divContenedor = document.getElementById("simu");
let boton = document.getElementById("boton");

function mod(calculo2, m){
    if(m > calculo2)
        return calculo2;

    do{
        calculo2 = calculo2 - m;
    }while(calculo2 > m)
    return calculo2;
}

function cargarTabla(semilla, a, m, c, maxRegistro, numeroVeces){
    if(numeroVeces == (maxRegistro+1)){
        return;
    }

    let calculo1 = semilla * a;
    let calculo2 = calculo1 + c;
    let calculo3 = mod(calculo2, m);
    var ui = (calculo3/m);
    numerosUi.push(ui);

    let nuevaFila = tabla.insertRow(-1);
    let columOrden = nuevaFila.insertCell(0);
    let columSemilla = nuevaFila.insertCell(1);
    let columCal1 = nuevaFila.insertCell(2);
    let columCal2 = nuevaFila.insertCell(3);
    let columCal3 = nuevaFila.insertCell(4);
    let columUi = nuevaFila.insertCell(5);

    columOrden.innerHTML = numeroVeces++;
    columSemilla.innerHTML= semilla;
    columCal1.innerHTML = calculo1;
    columCal2.innerHTML = calculo2;
    columCal3.innerHTML = calculo3;
    columUi.innerHTML = ui;

    cargarTabla(calculo3, a, m, c, maxRegistro, numeroVeces);
}

formulario.addEventListener("submit", function(e){
    e.preventDefault();
    let inputs = e.target.children;
    let semilla = parseInt(inputs[2].value);
    let a = parseInt(inputs[5].value);
    let m = parseInt(inputs[8].value);
    let c = parseInt(inputs[11].value);
    let maxRegistro = parseInt(inputs[14].value);
    cargarTabla(semilla, a, m, c, maxRegistro, 1);
    boton.style.display="block";
})

/* SIMULACION */
/*
    - Cantidad de cada tipo de pan que se vende en un día.
    - La probabilidad de que se agoten todos los panes antes del cierre.
*/
let cantidad_panes_producidos = 650;
let cantidad_panes_vendidos = 0;
let cantidad_panes_vendidos_total = 0;
let cant_integral_v = 0;
let cant_integral_v_total = 0;
let cant_centeno_v = 0;
let cant_centeno_v_total = 0;
let cant_maiz_v = 0;
let cant_maiz_v_total = 0;
let vecesSinStock = 0;


function simulacion(){
    for(let i = 1; i<=31; i++){

        /*CANTIDAD DE CADA TIPO DE PAN QUE SE VENDE EN UN DIA */
        cant_centeno_v = normal(50, 300, i);
        cant_centeno_v_total = cant_centeno_v_total + cant_centeno_v;
        cant_integral_v= normal(30, 200, i);
        cant_integral_v_total = cant_integral_v_total + cant_integral_v;
        cant_maiz_v = normal(20, 150, i);
        cant_maiz_v_total = cant_maiz_v_total + cant_maiz_v;

        /*Probabilidad de que se agoten todos los panes antes del cierre*/
        cantidad_panes_vendidos = cant_centeno_v + cant_integral_v + cant_maiz_v;
        cantidad_panes_vendidos_total = cantidad_panes_vendidos + cantidad_panes_vendidos_total;
        mostrarResultados(i);
    }
    divContenedor.style.display="block";
    analisisResultados();
}

var ui = 0;
function normal(desviacion, media){
    let sum = 0;
    for(let i = 0; i < 12; i++){
        sum = sum + numerosUi[ui];
        ui++;
    }
    return Math.trunc(desviacion* (sum - 6) + media);
}

function mostrarResultados(dia){
    let nuevaFilaSimulacion = tablaSimulacion.insertRow(-1);
    let columDia = nuevaFilaSimulacion.insertCell(0);
    let columIntegral = nuevaFilaSimulacion.insertCell(1);
    let columCenteno = nuevaFilaSimulacion.insertCell(2);
    let columMaiz = nuevaFilaSimulacion.insertCell(3);
    let columStock = nuevaFilaSimulacion.insertCell(4);

    columDia.innerHTML = dia;
    columIntegral.innerHTML= cant_integral_v;
    columCenteno.innerHTML = cant_centeno_v;
    columMaiz.innerHTML = cant_maiz_v;
    if(cantidad_panes_vendidos < cantidad_panes_producidos){
        columStock.innerHTML = "SI";
    }else{
        columStock.innerHTML = "NO";
        vecesSinStock = vecesSinStock + 1;
    }

    cantidad_panes_vendidos = 0;
    cant_integral_v = 0;
    cant_centeno_v = 0;
    cant_maiz_v = 0;
}

function analisisResultados(){
    porcentajeStok = (vecesSinStock*100)/31;
    let parrafo = document.createElement("p");
    porcentajeEnPalabras = "En este caso, después de realizar las simulaciones, se determinó que de los 31 días de diciembre,se agotaron todos los panes antes del cierre en aproximadamente el " + porcentajeStok + "% de los dias.";
    let contenido = document.createTextNode(porcentajeEnPalabras);
    parrafo.appendChild(contenido);
    divContenedor.appendChild(parrafo);
}

boton.addEventListener("click", simulacion);