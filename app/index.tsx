import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
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
  const [locales, setLocales] = useState<Local[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [id, setId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const limpiar = () => {
    setId("");
    setDescripcion("");
    setRecomendacion("");
    setSelectedId(null);
    setModoEditar(false);
  };

  const cerrarModal = () => {
    limpiar();
    setModalVisible(false);
  };

  const abrirAgregar = () => {
    limpiar();
    setModalVisible(true);
  };

  const abrirEditar = (local: Local) => {
    setModoEditar(true);
    setSelectedId(local.id);
    setId(local.id);
    setDescripcion(local.descripcion);
    setRecomendacion(local.recomendacion);
    setModalVisible(true);
  };

  const guardar = () => {
    if (!id || !descripcion || !recomendacion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (!modoEditar && locales.find((l) => l.id === id)) {
      Alert.alert("Error", "Ya existe un local con ese ID");
      return;
    }
    if (modoEditar) {
      setLocales(
        locales.map((l) =>
          l.id === selectedId ? { ...l, descripcion, recomendacion } : l
        )
      );
    } else {
      setLocales([...locales, { id, descripcion, recomendacion }]);
    }
    cerrarModal();
  };

  const eliminar = (local: Local) => {
    Alert.alert("Confirmar", `¿Eliminar el local "${local.descripcion}"?`, [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setLocales(locales.filter((l) => l.id !== local.id));
        },
      },
    ]);
  };

  const localesFiltrados = locales.filter(
    (l) =>
      l.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de Locales</Text>

      {/* Buscador */}
      <TextInput
        style={styles.buscador}
        placeholder="🔍 Buscar por ID o descripción..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Botón Agregar */}
      <TouchableOpacity style={styles.btnAgregar} onPress={abrirAgregar}>
        <Text style={styles.btnAgregarTexto}>+ Agregar Local</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={localesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTexto}>
                  {item.descripcion.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardDescripcion}>{item.descripcion}</Text>
                <Text style={styles.cardSub}>
                  ID: {item.id} · ⭐ {item.recomendacion}
                </Text>
              </View>
            </View>
            <View style={styles.cardBotones}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => abrirEditar(item)}
              >
                <Text style={styles.btnIcono}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnEliminar}
                onPress={() => eliminar(item)}
              >
                <Text style={styles.btnIcono}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay locales registrados</Text>
        }
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>
              {modoEditar ? "Editar Local" : "Nuevo Local"}
            </Text>

            <TextInput
              style={[styles.input, modoEditar && styles.inputDeshabilitado]}
              placeholder="Ej: 001 — ID único del local"
              value={id}
              onChangeText={setId}
              editable={!modoEditar}
            />
            <TextInput
              style={styles.input}
              placeholder="Ej: Restaurante La Leña — descripción del local"
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <TextInput
              style={styles.input}
              placeholder="Ej: Excelente comida típica — recomendación"
              value={recomendacion}
              onChangeText={setRecomendacion}
            />

            {/* Botones del modal */}
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.btn, styles.btnGrisOscuro]}
                onPress={limpiar}
              >
                <Text style={styles.btnTexto}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnGris]}
                onPress={cerrarModal}
              >
                <Text style={styles.btnTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnAzul]}
                onPress={guardar}
              >
                <Text style={styles.btnTexto}>
                  {modoEditar ? "Guardar" : "Agregar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16, paddingTop: 48 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#1d4ed8", marginBottom: 16 },
  buscador: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 24, padding: 12, paddingHorizontal: 16, marginBottom: 12, fontSize: 15 },
  btnAgregar: { backgroundColor: "#2563eb", borderRadius: 12, padding: 14, alignItems: "center", marginBottom: 16 },
  btnAgregarTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e5e7eb" },
  cardInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarTexto: { color: "#1d4ed8", fontWeight: "bold", fontSize: 18 },
  cardDescripcion: { fontWeight: "bold", color: "#1f2937", fontSize: 15 },
  cardSub: { color: "#6b7280", fontSize: 13, marginTop: 2 },
  cardBotones: { flexDirection: "row", gap: 8 },
  btnEditar: { backgroundColor: "#fef3c7", borderRadius: 8, padding: 8 },
  btnEliminar: { backgroundColor: "#fee2e2", borderRadius: 8, padding: 8 },
  btnIcono: { fontSize: 16 },
  vacio: { textAlign: "center", color: "#9ca3af", marginTop: 40, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContenido: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitulo: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, textAlign: "center" },
  input: { backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15 },
  inputDeshabilitado: { backgroundColor: "#e5e7eb", color: "#9ca3af" },
  modalBotones: { flexDirection: "row", gap: 8, marginTop: 8 },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  btnAzul: { backgroundColor: "#2563eb" },
  btnGris: { backgroundColor: "#9ca3af" },
  btnGrisOscuro: { backgroundColor: "#6b7280" },
});