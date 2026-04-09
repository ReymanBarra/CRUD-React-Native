import { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Local = {
  id: string;
  descripcion: string;
  recomendacion: string;
};

export default function Index() {
  const [id, setId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const limpiar = () => {
    setId("");
    setDescripcion("");
    setRecomendacion("");
    setSelectedId(null);
  };

  const agregar = () => {
    if (!id || !descripcion || !recomendacion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (locales.find((l) => l.id === id)) {
      Alert.alert("Error", "Ya existe un local con ese ID");
      return;
    }
    setLocales([...locales, { id, descripcion, recomendacion }]);
    limpiar();
  };

  const seleccionar = (local: Local) => {
    setId(local.id);
    setDescripcion(local.descripcion);
    setRecomendacion(local.recomendacion);
    setSelectedId(local.id);
  };

  const editar = () => {
    if (!descripcion || !recomendacion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    setLocales(
      locales.map((l) =>
        l.id === selectedId ? { ...l, descripcion, recomendacion } : l
      )
    );
    limpiar();
  };

  const eliminar = () => {
    Alert.alert("Confirmar", "¿Eliminar este local?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: () => {
          setLocales(locales.filter((l) => l.id !== selectedId));
          limpiar();
        },
      },
    ]);
  };

  const buscar = () => {
    const idBuscado = id.trim();
    const encontrado = locales.find((l) => l.id === idBuscado);
    if (!encontrado) {
      Alert.alert("No encontrado", "No existe un local con ese ID");
      return;
    }
    seleccionar(encontrado);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Gestión de Locales</Text>

      <TextInput
        style={styles.input}
        placeholder="ID del local"
        value={id}
        onChangeText={setId}
        editable={!selectedId}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Recomendación"
        value={recomendacion}
        onChangeText={setRecomendacion}
      />

      <View style={styles.botonesRow}>
        <TouchableOpacity style={[styles.btn, styles.btnAzul]} onPress={agregar}>
          <Text style={styles.btnTexto}>Agregar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnAmarillo]} onPress={buscar}>
          <Text style={styles.btnTexto}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.botonesRow}>
        <TouchableOpacity
          style={[styles.btn, selectedId ? styles.btnVerde : styles.btnGris]}
          onPress={editar}
          disabled={!selectedId}
        >
          <Text style={styles.btnTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, selectedId ? styles.btnRojo : styles.btnGris]}
          onPress={eliminar}
          disabled={!selectedId}
        >
          <Text style={styles.btnTexto}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnGrisOscuro]} onPress={limpiar}>
          <Text style={styles.btnTexto}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={locales}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedId === item.id && styles.cardSeleccionada,
            ]}
            onPress={() => seleccionar(item)}
          >
            <Text style={styles.cardId}>ID: {item.id}</Text>
            <Text style={styles.cardTexto}>📋 {item.descripcion}</Text>
            <Text style={styles.cardTexto}>⭐ {item.recomendacion}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16, paddingTop: 48 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#1d4ed8", marginBottom: 16 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  botonesRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  btnAzul: { backgroundColor: "#2563eb" },
  btnAmarillo: { backgroundColor: "#d97706" },
  btnVerde: { backgroundColor: "#16a34a" },
  btnRojo: { backgroundColor: "#dc2626" },
  btnGris: { backgroundColor: "#9ca3af" },
  btnGrisOscuro: { backgroundColor: "#6b7280" },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  cardSeleccionada: { borderColor: "#2563eb", borderWidth: 2 },
  cardId: { fontWeight: "bold", color: "#1f2937", marginBottom: 4 },
  cardTexto: { color: "#6b7280", marginBottom: 2 },
});