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
        name="pomoMenu" //tad de projescts
        options={{
          title: "Menu",
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
        name="reports" //settings
        options={{
          title: "reports",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={color}
            />
          ),

          // href: null,
          // headerShown: false,
        }}
      />

      <Tabs.Screen
        name="settings" //settings
        options={{         
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="SummaryScreen" //pomodoro
        options={{         
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="tareas" //nombre unico
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="projectDetails" //lista de tareas de un proyecto
        options={{

          href: null,
          headerShown: false,
          //tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="taskDetails" //detalles de una tarea o edicion de tarea
        options={{
          href: null,
          headerShown: false,
          //tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="generalReports"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="dailyReports"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="monthlyReports"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          href: null,
          headerShown: false,
        }}/>
  
      <Tabs.Screen
       name="activityInventory"
       options={{
         href: null,
         headerShown: false,  
       }}
      />
      <Tabs.Screen
       name="time"
       options={{
         href: null,
         headerShown: false,
       }}
      />
    </Tabs>
  );
}
