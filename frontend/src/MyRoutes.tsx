import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MintPage } from "./pages/MintPage";
import { DataPage } from "./pages/DataPage";

export default function MyRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/mint/:pieceId"
        element={
          <MainLayout>
            <MintPage />
          </MainLayout>
        }
      />
      <Route
        path="/data"
        element={
          <MainLayout>
            <DataPage />
          </MainLayout>
        }
      />
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}
