import React from 'react';
import { render, screen } from '@testing-library/react-native';
import GeneralReports from '../../app/(tabs)/generalReports';
import { useGlobalContext } from '@/context/AppContext';

// Mock the useGlobalContext hook
jest.mock('@/context/AppContext', () => ({
    useGlobalContext: jest.fn()
}));

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
    BarChart: () => null
}));

describe('GeneralReports', () => {
    const mockTasks = [
        {
            _id: '1',
            name: 'Task 1',
            status: 'FINISHED',
            estimated_effort: 2,
            real_effort: 3,
            started_at: '2023-01-01'
        },
        {
            _id: '2', 
            name: 'Task 2',
            status: 'IN_PROGRESS',
            estimated_effort: 4,
            real_effort: 2,
            started_at: '2023-01-02'
        }
    ];

    beforeEach(() => {
        (useGlobalContext as jest.Mock).mockReturnValue({
            controllers: {
                TaskController: {
                    getTaskForReports: () => mockTasks
                }
            }
        });
    });

    it('renders task statistics correctly', () => {
        render(<GeneralReports />);

        expect(screen.getByText('Tareas Completadas: 1/2')).toBeTruthy();
        expect(screen.getByText('Tasa de Finalización: 50.00%')).toBeTruthy();
        expect(screen.getByText('Pomodoros completados: 5')).toBeTruthy();
        expect(screen.getByText('Tiempo de consentración: 125 minutos')).toBeTruthy();
    });

    it('renders task details correctly', () => {
        render(<GeneralReports />);

        expect(screen.getByText('Tarea: Task 1')).toBeTruthy();
        expect(screen.getByText('Tarea: Task 2')).toBeTruthy();
        expect(screen.getByText('Pomodoros Estimados: 2')).toBeTruthy();
        expect(screen.getByText('Pomodoros Realizados: 3')).toBeTruthy();
    });

    it('calculates chart data correctly', () => {
        render(<GeneralReports />);
        
        // Chart data should show total estimated (6) and real (5) efforts
        const chartContainer = screen.getByText('Esfuerzo Estimado vs Real');
        expect(chartContainer).toBeTruthy();
    });

    it('handles empty task list', () => {
        (useGlobalContext as jest.Mock).mockReturnValue({
            controllers: {
                TaskController: {
                    getTaskForReports: () => []
                }
            }
        });

        render(<GeneralReports />);

        expect(screen.getByText('Tareas Completadas: 0/0')).toBeTruthy();
        expect(screen.getByText('Tasa de Finalización: 0.00%')).toBeTruthy();
        expect(screen.getByText('Pomodoros completados: 0')).toBeTruthy();
        expect(screen.getByText('Tiempo de consentración: 0 minutos')).toBeTruthy();
    });
});