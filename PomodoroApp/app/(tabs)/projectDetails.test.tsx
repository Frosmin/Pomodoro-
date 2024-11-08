import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectDetails from './projectDetails';
import { useLocalSearchParams } from 'expo-router';

jest.mock('expo-router', () => ({
    useLocalSearchParams: jest.fn(),
    router: {
        push: jest.fn(),
    },
}));

describe('ProjectDetails', () => {
    beforeEach(() => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ projectName: 'Test Project' });
    });

    it('renders project name', () => {
        const { getByText } = render(<ProjectDetails />);
        expect(getByText('Test Project')).toBeTruthy();
    });

    it('adds a new task', () => {
        const { getByPlaceholderText, getByText } = render(<ProjectDetails />);
        const input = getByPlaceholderText('Nombre de la Tarea');
        const button = getByText('Añadir Proyecto');

        fireEvent.changeText(input, 'New Task');
        fireEvent.press(button);

        expect(getByText('New Task')).toBeTruthy();
    });

    it('navigates to task details on task press', () => {
        const { getByPlaceholderText, getByText } = render(<ProjectDetails />);
        const input = getByPlaceholderText('Nombre de la Tarea');
        const button = getByText('Añadir Proyecto');

        fireEvent.changeText(input, 'New Task');
        fireEvent.press(button);

        const task = getByText('New Task');
        fireEvent.press(task);

        expect(require('expo-router').router.push).toHaveBeenCalledWith({
            pathname: '../taskDetails',
            params: { Taskname: 'New Task' },
        });
    });
});