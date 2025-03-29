const readline = require('readline-sync')
const inquirer = require('inquirer')
require('colors')

const prompt = inquirer.createPromptModule()

let notas = []

const obtenerOpcionesMenu = async () => {
    const opciones = [`Ingresar notas`, `Reporte de notas`, `Modificar nota`, `Limpiar datos`, `Salir`]
    const configuracionesPromt = [{
        type: 'list',
        name: 'opcion',
        message: 'Seleccione una opción del menú:',
        choices: opciones,
    }]
    const opcionSeleccionada = await prompt(configuracionesPromt)
    return opcionSeleccionada.opcion
}

const ingresarNotas = async () => {
    const nombreAlumno = readline.question('Ingrese el nombre del alumno: '.green)
    const notaAlumno = [[], []]
    const promedios = []
    let controlBucleNotas = true
    let suma = 0

    do {
        const materia = readline.question('Ingrese la materia: '.green)
        if (!materia) {
            console.log('La materia no puede estar vacía'.red)
            continue
        } else {
            for (let nota of notaAlumno[0]) {
                if (nota.toLowerCase() === materia.toLowerCase()) {
                    console.log('La materia ya fue ingresada'.red)
                    controlBucleNotas = false
                    break
                }
            }
            notaAlumno[0].push(materia)
        }
        let notaValida = false
        let nota = 0
        while (!notaValida) {
            notaIngresada = readline.question(`Ingrese la nota para ${materia}:`.green)
            nota = Number(notaIngresada)

            if (isNaN(nota)) {
                console.log('La nota ingresada no es un número'.red)
            } else if (nota < 0 || nota > 10) {
                console.log('La nota debe estar entre 0 y 10'.red)
            }
            else {
                notaValida = true
            }
        }
            notaAlumno[1].push(nota)
            suma += nota
        
            const continuar = await prompt([{
                type: 'list',
                name: 'opcion',
                message: '¿Desea ingresar otra nota?',
                choices: ['Si', 'No']
            }])

            controlBucleNotas = continuar.opcion.toLowerCase() === 'si'       


    } while (controlBucleNotas)

    notas.push([nombreAlumno, notaAlumno])
    console.log('Notas ingresadas correctamente'.green)
}

const reporteDeNotas = () => {
    if (notas.length === 0) {
        console.log('No hay notas ingresadas'.red)
        return
    }

    console.log('-------- Reporte de Notas --------'.cyan)

    for (let alumno of notas) { 
        const nombreAlumno = alumno[0]
        const datosNotas = alumno[1]
        const materias = datosNotas[0]
        const calificaciones = datosNotas[1]

        console.log(`*********************************************************`.yellow)
        console.log(` Alumno: ${nombreAlumno}`.blue)
        console.log(`---------------------------------------------------------`.yellow)

        let sumaNotas = 0

        if (materias.length === 0) {
            console.log('  (Sin materias registradas)'.grey)
        } else {
            for (let i = 0; i < materias.length; i++) {
                const materiaActual = materias[i]
                const notaActual = calificaciones[i]
                const notaString = notaActual.toString()
                const notaColoreada = notaActual >= 7 ? notaString.green : notaString.red
                console.log(`  Materia: ${materiaActual} Nota: ${notaColoreada}`)
                sumaNotas += notaActual
            }
        }

        if (materias.length > 0) {
            const promedio = sumaNotas / materias.length
            const promedioString = promedio.toFixed(2) 
            const resultado = promedio >= 7 ? 'Aprobado'.green : 'Reprobado'.red

            console.log(`---------------------------------------------------------`.yellow)
            console.log(`  Promedio: ${promedioString.blue} (${resultado})`)
        } else {
             console.log(`---------------------------------------------------------`.yellow)
             console.log(`  Promedio: No hay notas registradas`.grey)
        }
        console.log(`*********************************************************`.yellow)
        console.log('')
    }
}

const modificarNota = async () => { 
    if (notas.length === 0) {
        console.log('No hay notas ingresadas para modificar.'.red)
        return
    }

    const nombreAlumnoInput = readline.question('Ingrese el nombre del alumno a modificar: '.cyan)
    const materiaInput = readline.question(`Ingrese la materia de a modificar: `.cyan)

    let alumnoEncontrado = false
    let notaModificada = false

    for (let alumno of notas) { 
        let nombreActual = alumno[0]
        if (nombreActual.toLowerCase() === nombreAlumnoInput.toLowerCase()) {
            alumnoEncontrado = true
            let materias = alumno[1][0]
            let calificaciones = alumno[1][1]
            
            const materiaIndex = materias.findIndex(m => m.toLowerCase() === materiaInput.toLowerCase())

            if (materiaIndex !== -1) {
                console.log(`Materia '${materias[materiaIndex]}' encontrada para ${nombreActual}. Nota actual: ${calificaciones[materiaIndex]}`.blue)        
                let nuevaNotaValida = false
                let nuevaNota
                while (!nuevaNotaValida) {
                    const notaInput = readline.question(`Ingrese la nueva nota para ${materias[materiaIndex]}: `.green)
                    nuevaNota = Number(notaInput)
                    if (isNaN(nuevaNota)) {
                        console.log('La nota ingresada no es un número. Intente de nuevo.'.red)
                    } else if (nuevaNota < 0 || nuevaNota > 10) {
                        console.log('La nota ingresada debe estar entre 0 y 10. Intente de nuevo.'.red)
                    } else {
                        nuevaNotaValida = true 
                    }
                }
                calificaciones[materiaIndex] = nuevaNota
                notaModificada = true
                console.log('Nota modificada correctamente.'.green)
                break
            }
            
        }
    } 

    if (!alumnoEncontrado) {
        console.log(`No se encontró ningún alumno con el nombre '${nombreAlumnoInput}'.`.red)
    } else if (!notaModificada) {
        console.log(`No se encontró la materia '${materiaInput}' para el alumno '${nombreAlumnoInput}'.`.red)
    }
}

const limpiarDatos = () => {
    notas = []
    console.log('Se han restablecido los datos correctamente'.green)
}

async function main() {
    let continuar = true

    do {
        const opcionSeleccionada = await obtenerOpcionesMenu()

        switch (opcionSeleccionada) {
            case 'Ingresar notas':
                await ingresarNotas()
                break
            case 'Reporte de notas':
                reporteDeNotas()
                break
            case 'Modificar nota':
                await modificarNota()
                break
            case 'Limpiar datos':
                limpiarDatos()
                break
            case 'Salir':
                continuar = false
                break
        }
    } while (continuar)
}

main()