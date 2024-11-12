import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState , useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import util_styles from "@/styles/utils";
import { useGlobalContext } from "@/context/AppContext";

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const [projects, setProjects] = useState<string[]>([]);
  const [newProject, setNewProject] = useState("");
  const { user, controllers: { ProjectController: { addProject, getDefaultProjectId, getProjects } } } = useGlobalContext();

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjects();
      setProjects(projects.map(project => project.name));
    };
    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    if (newProject.trim() !== "") {
      console.log("Añadiendo Proyecto");
      const result = await addProject(newProject.trim());
      if (result.status === "success") {
        setProjects([...projects, newProject.trim()]);
        setNewProject("");
      } else {
        console.error(result.message);
      }
    }
  };

  const handleProjectPress = (projectName: string) => {
    router.push({
      pathname: "../projectDetails",
      params: { projectName },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={util_styles.title}>Proyectos</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newProject}
          onChangeText={setNewProject}
          placeholder="Nombre del proyecto"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddProject}>
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

      {/* <TouchableOpacity style={styles.button} onPress={Save}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fee8c8",
    //marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    //marginTop: 10,
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
