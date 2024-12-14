import { ExternalLink } from '@/components/ExternalLink';
import React from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';

const SummaryScreen: React.FC = () => {
    const Wikipedia = () => {
        Linking.openURL('https://es.wikipedia.org/wiki/T%C3%A9cnica_Pomodoro');
    };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¿Qué es la Técnica Pomodoro?</Text>
      <Text style={styles.text}>
        PomoApp es un temporizador pomodoro personalizable que funciona en
        dispositivos móviles. El objetivo de esta aplicación es ayudarte a 
        concentrarte en cualquier tarea en la que estés trabajando, como estudiar, 
        escribir o programar. Está aplicación esta inspirada en la Técnica Pomodoro, 
        un método de gestión del tiempo desarrollado por Francesco Cirillo.
      </Text>


      <Text style={styles.title}>¿Qué es la Técnica Pomodoro?</Text>
      <Text style={styles.text}>
      La Técnica Pomodoro fue creada por Francesco Cirillo para trabajar y estudiar de forma más productiva.
      La técnica utiliza un temporizador para dividir el trabajo en intervalos, 
      tradicionalmente de 25 minutos, separados por breves descansos.
      Cada intervalo se conoce como pomodoro, de la palabra italiana «tomate», 
      por el temporizador de cocina con forma de tomate que Cirillo utilizaba cuando era estudiante universitario.
      </Text>
      <Text style={styles.text}>
        <TouchableOpacity onPress={Wikipedia}>
          <Text style={styles.link}>Wikipedia</Text>
        </TouchableOpacity>.
      </Text>

      <Text style={styles.subtitle}>Etapas del proceso</Text>
      <Text style={styles.text}>
        Las etapas de proceso para realizar las actividades son{' '}
        <Text style={styles.bold}>planificación, procesamiento, registro, seguimiento y visualización</Text>. 
        En la fase de <Text style={styles.bold}>planificación</Text>, las tareas se priorizan registrándolas 
        en una lista de “Para hacer hoy”, lo que permite a los usuarios estimar el esfuerzo que requerirán. 
        A medida que se completan o <Text style={styles.bold}>procesan</Text> los pomodoros, se{' '} 
        <Text style={styles.bold}>registran</Text> en la lista "para hacer hoy". 
        Cuando completa la tarea, le <Text style={styles.bold}>registra</Text> un check mark 
        en la lista de "para hacer hoy". El usuario puede hacer un <Text style={styles.bold}>seguimiento</Text>
        {' '}de su progreso al observar cuántos pomodoros le llevó completar cada tarea (con el contador de pomodoros al frente de cada tarea) 
        y también puede hacer seguimiento a las tareas terminadas al revisar los check marks en la lista. 
        Este <Text style={styles.bold}>seguimiento</Text> que el usuario puede hacer de su avance se <Text style={styles.bold}>visualiza</Text>
        {' '} en la seccion de reportes de la aplicacion en forma de <Text style={styles.bold}>reportes generales, diarios y mensuales</Text>
      </Text>




      <Text style={styles.text}>
        Las tareas que se van a pomodorizar pueden venir de una lista «para hacer hoy». Los pasos que se siguien es:
      </Text>
      <Text style={styles.text}>            1. Elegir la tarea o actividad a realizar.</Text>
      <Text style={styles.text}>            2. Poner el temporizador 25 minutos</Text>
      <Text style={styles.text}>            3. Trabajar en la tarea de manera intensiva </Text>
      <Text style={styles.text}>            hasta que el temporizador suene (esto es un </Text>
      <Text style={styles.text}>            pomodoro)</Text>
      <Text style={styles.text}>            4. Hacer una marca para anotar qué pomodoro se ha completado.</Text>
      <Text style={styles.text}>            5. Tomar una pausa de 5 minutos</Text>
      <Text style={styles.text}>            6. Repetir intervalos de 25 minutos, o menos, hasta completar 4 promodoros</Text>
      <Text style={styles.text}>            7. Cada cuatro pomodoros o serie, tomar una pausa más larga de 15 a 20 minutos</Text>
      <Text style={styles.text}>            Etapas del proceso</Text>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fee8c8',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  link: {
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default SummaryScreen;
