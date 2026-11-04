import { Component, Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Feedback from './src/components/Feedback.js';
import TasksScreen from './src/screens/TasksScreen.js';
import { initializeDatabase } from './src/database/tasks.js';

class DatabaseBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('Falha na inicializacao do SQLite:', error); }
  render() {
    if (this.state.failed) return <Feedback title="Não consegui abrir o armazenamento" message="Feche e abra o aplicativo novamente. No navegador, use o servidor configurado no README." />;
    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <DatabaseBoundary>
        <Suspense fallback={<Feedback loading title="Preparando sua lista" message="Abrindo o armazenamento local." />}>
          <SQLiteProvider databaseName="inf204-pratica08.db" onInit={initializeDatabase} useSuspense>
            <TasksScreen />
          </SQLiteProvider>
        </Suspense>
      </DatabaseBoundary>
    </SafeAreaProvider>
  );
}
