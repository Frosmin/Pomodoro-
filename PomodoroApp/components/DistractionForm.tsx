import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Platform } from 'react-native';

// Define la interfaz directamente en este archivo
interface Distraction {
  description: string;
  duration: number;
  type: 'externa' | 'interna';
}

interface DistractionFormProps {
  onSave: (distraction: Distraction) => void;
  onClose: () => void;
}

const DistractionForm: React.FC<DistractionFormProps> = ({ onSave, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [duration, setDuration] = useState<number | undefined>();
  const [type, setType] = useState<'externa' | 'interna'>('externa');

  const handleSave = () => {
    if (description && duration !== undefined) {
      onSave({ description, duration, type });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Distracción</Text>
      <TextInput
        placeholder="Descripción de la distracción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Duración (minutos)"
        value={duration?.toString()}
        onChangeText={(text) => setDuration(Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={handleSave} />
        <Button title="Cancelar" onPress={onClose} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    maxWidth: 400, // Limita el ancho máximo para pantallas grandes
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
});

export default DistractionForm;
