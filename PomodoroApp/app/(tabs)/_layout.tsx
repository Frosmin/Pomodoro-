import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * TabLayout component renders a tab navigator with three screens: Explore, Home, and Settings.
 * Each screen has a unique name, title, and icon.
 *
 * @returns {JSX.Element} The rendered tab navigator component.
 *
 * @example
 * <TabLayout />
 *
 * @remarks
 * - The `useColorScheme` hook is used to determine the current color scheme (light or dark).
 * - The `Tabs.Screen` component is used to define each tab screen.
 * - The `tabBarIcon` prop is used to render the icon for each tab, which changes based on whether the tab is focused.
 * - The `tabBarActiveTintColor` prop is set based on the current color scheme.
 * - The `headerShown` prop is set to false to hide the header for all screens.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="projects" //tad de projescts
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),

          // href: null,
          // headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore" 
        options={{
          // title: "Projects",
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon
          //     name={focused ? "code-slash" : "code-slash-outline"}
          //     color={color}
          //   />
          // ),

          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings" //settings
        options={{
          title: "settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),

          // href: null,
          // headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tareas" //nombre unico
        options={{
          // title: "Tareas",
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon
          //    name={focused ? "settings" : "person-outline"} // icono tiene que ser unico
          //    color={color}
          //   />
          // ),

          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        
        name="projectDetails"  //lista de tareas de un proyecto
        options={{
          // title: "Task",
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon
          //     name={focused ? "code-slash" : "code-slash-outline"}
          //     color={color}
          //   />
          // ),

          href: null,
          headerShown: false,
          //tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="taskDetails"
        options={{
          href: null,
          headerShown: false,
          //tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
