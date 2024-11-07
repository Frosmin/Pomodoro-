import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const [projects, setProjects] = useState<string[]>([]);
  const [newProject, setNewProject] = useState("");

  const addProject = () => {
    if (newProject.trim()) {
      setProjects([...projects, newProject.trim()]);
      setNewProject("");
    }
  };

  const handleProjectPress = (projectName: string) => {
    router.push({
      pathname: "/(tabs)/projectDetails",
      params: { projectName }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newProject}
          onChangeText={setNewProject}
          placeholder="Nombre del proyecto"
        />
        <TouchableOpacity style={styles.button} onPress={addProject}>
          <Text style={styles.buttonText}>Añadir Proyecto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectItem}
            onPress={() => handleProjectPress(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fee8c8",
    //marginTop: 50,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 25,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
