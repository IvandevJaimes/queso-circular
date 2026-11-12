import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, BackHandler, Image, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";

// CAMBIAR por la IPv4 de tu computadora (ipconfig).
// El celular y la PC deben usar la misma red Wi-Fi.
const API_URL = "http://192.168.101.16:4000";

type Pantalla = "Inicio" | "Alternativas" | "Historial" | "Recetas";
type Produccion = {
  id: number;
  litrosLeche: number;
  quesoEstimado: number;
  sueroEstimado: number;
  fecha: string;
};
type Receta = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
};

const alternativas = [
  {
    titulo: "Elaboración de ricota",
    descripcion: "El suero puede utilizarse como materia prima para elaborar ricota mediante calentamiento y separación de proteínas.",
    precaucion: "Respetar las condiciones de higiene, temperatura y conservación de los alimentos.",
  },
  {
    titulo: "Usos agrícolas",
    descripcion: "El suero puede tener aplicaciones agrícolas controladas, según su composición y el tipo de suelo.",
    precaucion: "Evaluar su aplicación para evitar alteraciones del suelo y contaminación ambiental.",
  },
  {
    titulo: "Alimentación animal",
    descripcion: "En determinadas condiciones, el suero puede utilizarse como complemento en la alimentación animal.",
    precaucion: "Evaluar su uso según la especie, la cantidad y las condiciones sanitarias.",
  },
  {
    titulo: "Intercambio entre productores",
    descripcion: "Los productores pueden coordinar el aprovechamiento del suero con otros establecimientos interesados.",
    precaucion: "Contemplar las condiciones de transporte, conservación y normativa aplicable.",
  },
];

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>("Inicio");
  const [pila, setPila] = useState<Pantalla[]>([]);
  const [litros, setLitros] = useState("");
  const [queso, setQueso] = useState<number | null>(null);
  const [suero, setSuero] = useState<number | null>(null);
  const [historial, setHistorial] = useState<Produccion[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [errorBackend, setErrorBackend] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargandoRecetas, setCargandoRecetas] = useState(false);
  const [errorRecetas, setErrorRecetas] = useState("");

  const cargarHistorial = useCallback(async () => {
    setCargandoHistorial(true);
    setErrorBackend("");
    try {
      const respuesta = await fetch(`${API_URL}/producciones`);
      if (!respuesta.ok) throw new Error("Error del servidor");
      const datos: Produccion[] = await respuesta.json();
      setHistorial(datos);
    } catch {
      setErrorBackend("No se pudo conectar con el backend. Revisá la IP, el Wi-Fi y que NestJS esté iniciado.");
    } finally {
      setCargandoHistorial(false);
    }
  }, []);

  const consultarRecetas = async () => {
    setCargandoRecetas(true);
    setErrorRecetas("");
    try {
      const respuesta = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=ricotta");
      if (!respuesta.ok) throw new Error("Error al consultar recetas");
      const datos = await respuesta.json();
      setRecetas(datos.meals || []);
      if (!datos.meals || datos.meals.length === 0) {
        setErrorRecetas("No se encontraron recetas con ricota en el catálogo.");
      }
    } catch {
      setErrorRecetas("No fue posible consultar las recetas. Revisá tu conexión a internet.");
    } finally {
      setCargandoRecetas(false);
    }
  };

  const navegar = (destino: Pantalla) => {
    if (destino === pantalla) {
      setSeleccionada(null);
      return;
    }
    setPila((anterior) => [...anterior, pantalla]);
    setPantalla(destino);
    setSeleccionada(null);
    if (destino === "Recetas" && recetas.length === 0) consultarRecetas();
  };

  const volverAtras = useCallback(() => {
    if (seleccionada !== null) {
      setSeleccionada(null);
      return true;
    }
    if (pila.length > 0) {
      setPantalla(pila[pila.length - 1]);
      setPila((anterior) => anterior.slice(0, -1));
      return true;
    }
    return false;
  }, [pila, seleccionada]);

  useEffect(() => {
    const evento = BackHandler.addEventListener("hardwareBackPress", volverAtras);
    return () => evento.remove();
  }, [volverAtras]);

  useEffect(() => {
    if (pantalla === "Historial") cargarHistorial();
  }, [pantalla, cargarHistorial]);

  const calcular = async () => {
    const cantidad = Number(litros.replace(",", "."));
    if (!litros.trim() || !Number.isFinite(cantidad) || cantidad <= 0) {
      Alert.alert("Dato incorrecto", "Ingresá una cantidad válida de litros.");
      return;
    }

    // Estimación ilustrativa: 12 % queso y 88 % suero.
    const resultadoQueso = cantidad * 0.12;
    const resultadoSuero = cantidad * 0.88;
    setQueso(resultadoQueso);
    setSuero(resultadoSuero);
    setGuardando(true);

    try {
      const respuesta = await fetch(`${API_URL}/producciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ litrosLeche: cantidad }),
      });
      if (!respuesta.ok) throw new Error("No se pudo guardar");
      await cargarHistorial();
      
    } catch {
      Alert.alert("No se pudo guardar", "El cálculo se realizó, pero no se guardó. Revisá la IP y que NestJS esté iniciado.");
    } finally {
      setGuardando(false);
    }
  };

  const fechaVisible = (fecha: string) => {
    if (!fecha) return "Fecha no disponible";
    const valor = new Date(fecha);
    return Number.isNaN(valor.getTime()) ? fecha : valor.toLocaleDateString("es-AR");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contenido}>
        <View style={styles.header}>
          <View style={styles.headerFila}>
            {(pantalla !== "Inicio" || seleccionada !== null) && (
              <TouchableOpacity style={styles.botonVolver} onPress={volverAtras}>
                <Text style={styles.flecha}>←</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.logo}>🧀</Text>
            <Text style={styles.titulo}>Queso Circular IA</Text>
          </View>
          <Text style={styles.subtitulo}>Aprovechamiento sostenible del suero</Text>
        </View>

        {pantalla === "Inicio" && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Calcular producción</Text>
              <Text style={styles.label}>Litros de leche utilizados</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: 25"
                keyboardType="decimal-pad"
                value={litros}
                onChangeText={setLitros}
              />
              <TouchableOpacity style={styles.boton} onPress={calcular} disabled={guardando}>
                {guardando ? <ActivityIndicator color="#FFFFFF" /> :
                  <Text style={styles.botonTexto}>Calcular producción</Text>}
              </TouchableOpacity>
            </View>

            {queso !== null && suero !== null && (
              <View style={styles.card}>
                <Text style={styles.cardTitulo}>Resultados estimados</Text>
                <Text style={styles.resultado}>🧀 Queso: {queso.toFixed(2)} kg</Text>
                <Text style={styles.resultado}>💧 Suero: {suero.toFixed(2)} litros</Text>
                <Text style={styles.aviso}>Valores orientativos: se utiliza una estimación del 12 % para queso y 88 % para suero. El resultado real depende del proceso y del tipo de queso.</Text>
                <TouchableOpacity style={styles.botonSecundario} onPress={() => navegar("Alternativas")}>
                  <Text style={styles.botonTexto}>Ver aprovechamientos</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Sobre el proyecto</Text>
              <Text style={styles.descripcion}>Queso Circular IA busca promover el aprovechamiento sostenible del suero generado durante la elaboración de queso.</Text>
            </View>
          </>
        )}

        {pantalla === "Alternativas" && (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Alternativas de aprovechamiento</Text>
            {seleccionada === null ? alternativas.map((item, index) => (
              <TouchableOpacity key={index} style={styles.alternativa} onPress={() => setSeleccionada(index)}>
                <Text style={styles.alternativaTexto}>{index + 1}. {item.titulo}</Text>
                <Text style={styles.verMas}>Consultar detalles →</Text>
              </TouchableOpacity>
            )) : (
              <View>
                <TouchableOpacity onPress={() => setSeleccionada(null)}>
                  <Text style={styles.verMas}>← Volver a alternativas</Text>
                </TouchableOpacity>
                <Text style={styles.detalleTitulo}>{alternativas[seleccionada].titulo}</Text>
                <Text style={styles.descripcion}>{alternativas[seleccionada].descripcion}</Text>
                <Text style={styles.label}>Precauciones</Text>
                <Text style={styles.descripcion}>{alternativas[seleccionada].precaucion}</Text>
              </View>
            )}
          </View>
        )}

        {pantalla === "Historial" && (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Historial de producciones</Text>
            <TouchableOpacity style={styles.botonSecundario} onPress={cargarHistorial} disabled={cargandoHistorial}>
              <Text style={styles.botonTexto}>Actualizar historial</Text>
            </TouchableOpacity>
            {cargandoHistorial && <ActivityIndicator size="large" color="#386641" style={styles.cargando} />}
            {!!errorBackend && <Text style={styles.aviso}>{errorBackend}</Text>}
            {!cargandoHistorial && !errorBackend && historial.length === 0 && (
              <Text style={styles.descripcion}>Todavía no hay producciones guardadas.</Text>
            )}
            {historial.map((item) => (
              <View style={styles.registro} key={item.id}>
                <Text style={styles.alternativaTexto}>Producción del {fechaVisible(item.fecha)}</Text>
                <Text>Leche: {item.litrosLeche} litros</Text>
                <Text>Queso: {Number(item.quesoEstimado).toFixed(2)} kg</Text>
                <Text>Suero: {Number(item.sueroEstimado).toFixed(2)} litros</Text>
              </View>
            ))}
          </View>
        )}

        {pantalla === "Recetas" && (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Recetas con ricota</Text>
            <Text style={styles.descripcion}>Consultamos un catálogo público de recetas para explorar preparaciones que utilizan ricota.</Text>
            {cargandoRecetas && <ActivityIndicator size="large" color="#386641" style={styles.cargando} />}
            {!!errorRecetas && <Text style={styles.aviso}>{errorRecetas}</Text>}
            {recetas.map((receta) => (
              <View style={styles.receta} key={receta.idMeal}>
                <Image source={{ uri: receta.strMealThumb }} style={styles.imagen} />
                <Text style={styles.detalleTitulo}>{receta.strMeal}</Text>
                <Text style={styles.descripcion}>
                  {receta.strInstructions ? receta.strInstructions.slice(0, 250) + "..." : "Sin descripción disponible."}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.boton} onPress={consultarRecetas} disabled={cargandoRecetas}>
              <Text style={styles.botonTexto}>Actualizar recetas</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.pie}>Queso Circular IA - Proyecto académico 2026</Text>
      </ScrollView>

            <View style={styles.menu}>
        {(["Inicio", "Alternativas", "Historial", "Recetas"] as Pantalla[]).map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.menuItem,
              pantalla === item && styles.menuItemActivo,
            ]}
            onPress={() => navegar(item)}
          >
            <Text
              style={[
                styles.menuTexto,
                pantalla === item && styles.menuTextoActivo,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F5EF" },
  contenido: { flex: 1 },
  header: { backgroundColor: "#386641", padding: 20, paddingTop: 55, alignItems: "center" },
  headerFila: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center" },
  botonVolver: { position: "absolute", left: 0, zIndex: 1, padding: 8 },
  flecha: { color: "#FFFFFF", fontSize: 30, fontWeight: "bold" },
  logo: { fontSize: 30, marginRight: 7 },
  titulo: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#E5F0E1", marginTop: 8, fontSize: 14 },
  card: { backgroundColor: "#FFFFFF", margin: 15, padding: 20, borderRadius: 12, elevation: 3 },
  cardTitulo: { fontSize: 19, fontWeight: "bold", color: "#386641", marginBottom: 18 },
  label: { fontSize: 15, fontWeight: "bold", marginTop: 15, marginBottom: 8, color: "#386641" },
  input: { borderWidth: 1, borderColor: "#CCCCCC", borderRadius: 8, padding: 13, fontSize: 16 },
  boton: { backgroundColor: "#386641", padding: 15, borderRadius: 8, marginTop: 15, alignItems: "center" },
  botonSecundario: { backgroundColor: "#6A994E", padding: 14, borderRadius: 8, marginTop: 15, marginBottom: 12, alignItems: "center" },
  botonTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  resultado: { fontSize: 18, marginBottom: 15, color: "#333333" },
  aviso: { color: "#777777", fontSize: 13, marginTop: 10, lineHeight: 20 },
  descripcion: { fontSize: 15, color: "#444444", lineHeight: 23, marginTop: 8 },
  alternativa: { backgroundColor: "#F3F5EF", padding: 15, borderRadius: 8, marginBottom: 10 },
  alternativaTexto: { fontSize: 15, color: "#333333", fontWeight: "bold" },
  verMas: { color: "#386641", marginTop: 8, fontWeight: "bold" },
  detalleTitulo: { fontSize: 20, fontWeight: "bold", color: "#386641", marginTop: 18, marginBottom: 12 },
  registro: { padding: 14, backgroundColor: "#F3F5EF", borderRadius: 8, marginTop: 12, gap: 5 },
  receta: { marginTop: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#DDDDDD" },
  imagen: { width: "100%", height: 170, borderRadius: 8, marginBottom: 10 },
  cargando: { marginTop: 20 },
  menu: {
  flexDirection: "row",
  backgroundColor: "#FFFFFF",
  borderTopWidth: 1,
  borderTopColor: "#DDDDDD",
  paddingVertical: 10,
  paddingHorizontal: 4,
},

menuItem: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
  marginHorizontal: 2,
  borderRadius: 8,
},

menuItemActivo: {
  backgroundColor: "#386641",
},

menuTexto: {
  fontSize: 11,
  color: "#444444",
  fontWeight: "bold",
},

menuTextoActivo: {
  color: "#FFFFFF",
},
  pie: { textAlign: "center", color: "#777777", margin: 20, fontSize: 12 },
});
