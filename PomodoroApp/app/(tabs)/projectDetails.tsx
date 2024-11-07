import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProjectDetails() {
  const { projectName } = useLocalSearchParams<{ projectName: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas del proyecto</Text>
      <Text style={styles.projectName}>{projectName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fee8c8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  projectName: {
    fontSize: 18,
    marginBottom: 10,
  }
});