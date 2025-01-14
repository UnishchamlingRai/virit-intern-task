import TodoComponent from "./components/TodoComponent";
import { TodoContextProvider } from "./context/TodoContext";

export default function App() {
  return (
    <TodoContextProvider>
      <TodoComponent />
    </TodoContextProvider>
  );
}
