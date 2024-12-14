import React from 'react';
import { render } from '@testing-library/react-native';
import MonthlyReport from '../../app/(tabs)/monthlyReports';
import { useGlobalContext } from '@/context/AppContext';

// Mock the context
jest.mock('@/context/AppContext', () => ({
    useGlobalContext: jest.fn()
}));

// Mock the chart components
jest.mock('react-native-chart-kit', () => ({
    PieChart: 'PieChart',
    BarChart: 'BarChart'
}));

describe('MonthlyReport', () => {
    const mockTasks = [
        {
            _id: '1',
            project_id: '1',
            started_at: new Date().toISOString(),
            estimated_effort: 2,
            real_effort: 3
        },
        {
            _id: '2', 
            project_id: '2',
            started_at: new Date().toISOString(),
            estimated_effort: 1,
            real_effort: 2
        }
    ];

    const mockProjects = [
        { _id: '1', name: 'Project 1' },
        { _id: '2', name: 'Project 2' }
    ];

    beforeEach(() => {
        (useGlobalContext as jest.Mock).mockReturnValue({
            controllers: {
                TaskController: {
                    getTaskForReports: () => mockTasks
                },
                ProjectController: {
                    getProjectList: () => mockProjects
                }
            }
        });
    });

    it('renders correctly with tasks', () => {
        const { getByText } = render(<MonthlyReport />);
        
        expect(getByText('Reporte Diario por Proyecto')).toBeTruthy();
        expect(getByText('Tareas por Proyecto')).toBeTruthy();
        expect(getByText('Project 1')).toBeTruthy();
        expect(getByText('Project 2')).toBeTruthy();
    });

    it('shows no data message when there are no tasks', () => {
        (useGlobalContext as jest.Mock).mockReturnValue({
            controllers: {
                TaskController: {
                    getTaskForReports: () => []
                },
                ProjectController: {
                    getProjectList: () => []
                }
            }
        });

        const { getByText } = render(<MonthlyReport />);
        expect(getByText('No hay tareas registradas para hoy')).toBeTruthy();
    });

    it('correctly formats time display', () => {
        const { getByText } = render(<MonthlyReport />);
        // 5 total real efforts * 25 minutes = 125 minutes = 2h 5min
        expect(getByText('2h 5min')).toBeTruthy();
    });
});