import * as Notifications from 'expo-notifications';


let notificationId: string | null = null;

export const showPersistentNotification = async (timeText: string, type: string) => {
    if (notificationId === null) {
        // Schedule the notification only once
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Pomodoro Timer",
                body: `Time remaining: ${timeText}`,
                sticky: true, // Make the notification persistent (Android only)
            },
            trigger: null, // Show immediately
        });
        notificationId = id;
    } else {
        // Update the existing notification content
        await Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });

        await Notifications.scheduleNotificationAsync({
            identifier: notificationId, // Use the same ID to update
            content: {
                title: "Pomodoro App",
                body: `${type} \nTiempo restante: ${timeText}`,
                sticky: true,
            },
            trigger: null,
        });
    }
};

let currentNotificationId: string | null = null;


// Show or update a local notification
export const showNotification = async (timeText: string) => {
    if (currentNotificationId) {
        // Cancel the previous notification
        await Notifications.dismissNotificationAsync(currentNotificationId);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Pomodoro Timer",
            body: `Time remaining: ${timeText}`,
        },
        trigger: null, // Show immediately
    });

    currentNotificationId = notificationId; // Save the current notification ID
};


// import * as Permissions from 'expo-permissions';

// export const configureNotifications = async () => {
//     const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//     if (status !== 'granted') {
//         const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//         if (newStatus !== 'granted') {
//             alert('Se necesitan permisos para mostrar notificaciones.');
//             return;
//         }
//     }
//     console.log("Permisos de notificaciones configurados.");
// };

