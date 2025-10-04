<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Marcas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            height: 100vh;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            width: 450px;
        }
        h1 {
            color: #333;
            margin-bottom: 25px;
            font-size: 28px;
        }
        select, input {
            padding: 12px;
            font-size: 16px;
            border-radius: 8px;
            border: 2px solid #ddd;
            margin: 10px 0;
            width: 100%;
            transition: border 0.3s;
        }
        select:focus, input:focus {
            border-color: #667eea;
            outline: none;
        }
        .buttons {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        button {
            padding: 12px 20px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            color: white;
            flex: 1;
            transition: all 0.3s;
            font-weight: bold;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        #crear {
            background: #28a745;
        }
        #crear:hover {
            background: #218838;
        }
        #editar {
            background: #007bff;
        }
        #editar:hover {
            background: #0056b3;
        }
        #eliminar {
            background: #dc3545;
        }
        #eliminar:hover {
            background: #c82333;
        }
        #resultado {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            font-weight: bold;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
        }
        .success {
            background: #d4edda !important;
            border-color: #c3e6cb !important;
            color: #155724;
        }
        .error {
            background: #f8d7da !important;
            border-color: #f5c6cb !important;
            color: #721c24;
        }
        .info {
            background: #cce7ff !important;
            border-color: #b3d9ff !important;
            color: #004085;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏷️ Gestión de Marcas</h1>

        <select id="marcaSelect">
            <option value="">-- Selecciona una marca --</option>
        </select>
        
        <input type="text" id="marcaInput" placeholder="Escribe el nombre de la marca...">

        <div class="buttons">
            <button id="crear" onclick="crearMarca()">➕ Crear</button>
            <button id="editar" onclick="actualizarMarca()">✏️ Editar</button>
            <button id="eliminar" onclick="eliminarMarca()">🗑️ Eliminar</button>
        </div>

        <div id="resultado" class="info">
            Esperando acción...
        </div>
    </div>

    <script>
        const API_URL = "http://localhost:3000/api/marcas";

        // Cargar marcas al iniciar
        document.addEventListener('DOMContentLoaded', cargarMarcas);

        async function cargarMarcas() {
            try {
                const resultado = document.getElementById("resultado");
                resultado.className = "info";
                resultado.textContent = "🔄 Cargando marcas...";
                
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error('Error en la respuesta');
                
                const marcas = await res.json();
                const select = document.getElementById("marcaSelect");
                select.innerHTML = "<option value=''>-- Selecciona una marca --</option>";
                
                marcas.forEach(marca => {
                    const option = document.createElement("option");
                    option.value = marca.id;
                    option.textContent = `${marca.nombre} (ID: ${marca.id})`;
                    select.appendChild(option);
                });
                
                resultado.className = "success";
                resultado.textContent = `✅ ${marcas.length} marcas cargadas correctamente`;
            } catch (err) {
                const resultado = document.getElementById("resultado");
                resultado.className = "error";
                resultado.textContent = "❌ Error al cargar marcas";
                console.error("Error:", err);
            }
        }

        async function crearMarca() {
            const nombre = document.getElementById("marcaInput").value.trim();
            const resultado = document.getElementById("resultado");
            
            if (!nombre) {
                resultado.className = "error";
                resultado.textContent = "❌ Escribe un nombre para la marca";
                return;
            }

            try {
                resultado.className = "info";
                resultado.textContent = "🔄 Creando marca...";
                
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre })
                });

                const data = await res.json();
                
                if (res.ok) {
                    resultado.className = "success";
                    resultado.textContent = `✅ Marca creada: "${data.nombre}" (ID: ${data.id})`;
                    document.getElementById("marcaInput").value = "";
                    cargarMarcas();
                } else {
                    resultado.className = "error";
                    resultado.textContent = `❌ Error: ${data.error}`;
                }
            } catch (err) {
                resultado.className = "error";
                resultado.textContent = "❌ Error de conexión con el servidor";
                console.error("Error:", err);
            }
        }

        async function actualizarMarca() {
            const id = document.getElementById("marcaSelect").value;
            const nombre = document.getElementById("marcaInput").value.trim();
            const resultado = document.getElementById("resultado");
            
            if (!id) {
                resultado.className = "error";
                resultado.textContent = "❌ Selecciona una marca para editar";
                return;
            }
            
            if (!nombre) {
                resultado.className = "error";
                resultado.textContent = "❌ Escribe el nuevo nombre";
                return;
            }

            try {
                resultado.className = "info";
                resultado.textContent = "🔄 Actualizando marca...";
                
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre })
                });

                const data = await res.json();
                
                if (res.ok) {
                    resultado.className = "success";
                    resultado.textContent = `✅ Marca actualizada: "${data.nombre}"`;
                    document.getElementById("marcaInput").value = "";
                    cargarMarcas();
                } else {
                    resultado.className = "error";
                    resultado.textContent = `❌ Error: ${data.error}`;
                }
            } catch (err) {
                resultado.className = "error";
                resultado.textContent = "❌ Error de conexión con el servidor";
                console.error("Error:", err);
            }
        }

        async function eliminarMarca() {
            const id = document.getElementById("marcaSelect").value;
            const resultado = document.getElementById("resultado");
            
            if (!id) {
                resultado.className = "error";
                resultado.textContent = "❌ Selecciona una marca para eliminar";
                return;
            }

            const marcaSeleccionada = document.getElementById("marcaSelect").options[document.getElementById("marcaSelect").selectedIndex].text;
            
            if (!confirm(`¿Estás seguro de eliminar la marca:\n"${marcaSeleccionada}"?`)) {
                return;
            }

            try {
                resultado.className = "info";
                resultado.textContent = "🔄 Eliminando marca...";
                
                const res = await fetch(`${API_URL}/${id}`, { 
                    method: "DELETE" 
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    resultado.className = "success";
                    resultado.textContent = `✅ ${data.mensaje}`;
                    document.getElementById("marcaInput").value = "";
                    cargarMarcas();
                } else {
                    resultado.className = "error";
                    resultado.textContent = `❌ Error: ${data.error}`;
                }
            } catch (err) {
                resultado.className = "error";
                resultado.textContent = "❌ Error de conexión con el servidor";
                console.error("Error:", err);
            }
        }
    </script>
</body>
</html>
