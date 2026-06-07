import { createTheme, MantineProvider } from '@mantine/core';
import './App.css';
import '@mantine/core/styles.css';
import HomePage from './Pages/HomePage';
import FindJobsPage from './Pages/FindJobsPage';
import UploadJobPage from './Pages/UploadJobPage';
import AboutUsPage from './Pages/AboutUsPage';
import FindTalentPage from './Pages/FindTalentPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  const theme = createTheme({
    colors: {
      'bright-sun': [
        '#fffbeb',
        '#fff3c6',
        '#ffe588',
        '#ffd149',
        '#ffbd20',
        '#f99b07',
        '#dd7302',
        '#b75006',
        '#943c0c',
        '#7a330d',
      ],

      'mine-shaft': [
        '#f6f6f6',
        '#e7e7e7',
        '#d1d1d1',
        '#b0b0b0',
        '#888888',
        '#6d6d6d',
        '#5d5d5d',
        '#4f4f4f',
        '#454545',
        '#3d3d3d',
      ],
    },
  });

  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/find-jobs" element={<FindJobsPage />} />
            <Route path="/find-talent" element={<FindTalentPage />} />
            <Route path="/upload-job" element={<UploadJobPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
