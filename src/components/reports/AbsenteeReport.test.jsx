import { render, screen, fireEvent } from '@testing-library/react';
import { AbsenteeReport } from './AbsenteeReport';

describe('AbsenteeReport', () => {
  it('should display the correct signature designations in the print view', () => {
    render(<AbsenteeReport />);
    
    // Mock the window.open function
    const mockPrintWindow = {
      document: {
        write: jest.fn(),
        close: jest.fn(),
      },
      focus: jest.fn(),
      print: jest.fn(),
    };
    global.open = jest.fn(() => mockPrintWindow);

    // Click the print button
    fireEvent.click(screen.getByText('Print'));

    // Check if the document.write function was called with the correct HTML
    const writtenHtml = mockPrintWindow.document.write.mock.calls[0][0];
    expect(writtenHtml).toContain('Prepared by');
    expect(writtenHtml).toContain('AGM');
    expect(writtenHtml).toContain('DGM');
    expect(writtenHtml).toContain('GM');
    expect(writtenHtml).toContain('MD');
  });
});
