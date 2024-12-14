import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DailyReports from '../../app/(tabs)/dailyReports';
import { useGlobalContext } from '@/context/AppContext';

jest.mock('realm', () => ({
    Object: class {}, 
    BSON: {
      ObjectId: jest.fn()
    }
  }));

jest.mock('@realm/react', () => ({
    useObject: jest.fn(),
    useQuery: jest.fn(),
    useRealm: jest.fn()
  }));
  
 

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }));


jest.mock('@/context/AppContext');
jest.mock('react-native-chart-kit', () => ({
    PieChart: 'PieChart',
    BarChart: 'BarChart'
}));


describe('DailyReports', () => {
    const mockTasks = [
        {
            name: 'Task 1',
            project: 'Project 1',
            minutes: 25,
            di: 2,
            de: 1,
            status: 'FINISHED',
            estimated_effort: 2,
            real_effort: 1
        },
        {
            name: 'Task 2', 
            project: 'Project 2',
            minutes: 50,
            di: 1,
            de: 3,
            status: 'IN_PROGRESS',
            estimated_effort: 3,
            real_effort: 2
        }
    ];

    beforeEach(() => {
        (useGlobalContext as jest.Mock).mockReturnValue({
            controllers: {
                TaskController: {
                    getTaskForReports: jest.fn()
                },
                ProjectController: {
                    getProjectList: jest.fn()
                },
                PomodoroController: {
                    getDailyPomodoros: jest.fn(() => ({
                        data: mockTasks
                    }))
                }
            }
        });
    });

    it('renders daily report title', () => {
        render(<DailyReports />);
        expect(screen.getByText('Reporte Diario por Proyecto')).toBeTruthy();
    });

    it('displays tasks when there is data', () => {
        render(<DailyReports />);
        expect(screen.getByText('Task 1')).toBeTruthy();
        expect(screen.getByText('Task 2')).toBeTruthy();
    });

    // it('shows no data message when there are no tasks', () => {
    //     (useGlobalContext as jest.Mock).mockReturnValue({
    //         controllers: {
    //             TaskController: {
    //                 getTaskForReports: jest.fn()
    //             },
    //             ProjectController: {
    //                 getProjectList: jest.fn()
    //             },
    //             PomodoroController: {
    //                 getDailyPomodoros: jest.fn(() => ({
    //                     data: []
    //                 }))
    //             }
    //         }
    //     });

    //     render(<DailyReports />);
    //     expect(screen.getByText('No hay tareas registradas para hoy')).toBeTruthy();
    // });

    

    it('correctly formats time display', () => {
        render(<DailyReports />);
        // 75 total minutes * 25 = 1875 minutes = 31h 15min
        expect(screen.getByText('31h 15min')).toBeTruthy();
    });
});