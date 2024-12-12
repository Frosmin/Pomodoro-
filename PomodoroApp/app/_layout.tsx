import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RealmProvider, UserProvider,AppProvider,Realm} from '@realm/react';
import { Task } from '@/db/models/Task';
import {User} from '@/db/models/User';
import { Pomodoro } from '@/db/models/Pomodoro';
import { List } from '@/db/models/List';
import { Project } from '@/db/models/Project';
import { AppContext, AppContextProvider } from '@/context/AppContext';
import 'react-native-get-random-values';
import { schemaVersion } from 'realm';
import 'react-native-get-random-values'
import Setting from '@/db/models/Setting';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });



  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RealmProvider schema={[User,List,Project,Pomodoro,Task,Setting]} schemaVersion={8}
                            // sync={{
                            //   flexible: true,
                            //   initialSubscriptions: {
                            //     update(subs: any, realm: Realm) {
                            //       subs.add(realm.objects(User));
                            //       subs.add(realm.objects(List));
                            //       subs.add(realm.objects(Project));
                            //       subs.add(realm.objects(Pomodoro));
                            //       subs.add(realm.objects(Task));
                            //     },
                            //   },
                            // }}
                            >
    <AppContextProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>  
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
      </ThemeProvider>
    </AppContextProvider>
    </RealmProvider>


    
  );
}
