import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SurahReader from "./pages/SurahReader";
import Hifz from "./pages/Hifz";
import QuizHub from "./pages/QuizHub";
import QuizRun from "./pages/QuizRun";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sourate/:number" element={<SurahReader />} />
        <Route path="/hifz" element={<Hifz />} />
        <Route path="/quiz" element={<QuizHub />} />
        <Route path="/quiz/:scope" element={<QuizRun />} />
        <Route path="/reglages" element={<Settings />} />
      </Route>
    </Routes>
  );
}
