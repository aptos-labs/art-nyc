import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/office/HomePage";
import { MainLayout } from "./layouts/MainLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MintPage } from "./pages/office/MintPage";
import { EditorPage } from "./pages/office/EditorPage";
import { LandingPage } from "./pages/LandingPage";
import { Office, OfficeStateProvider } from "./context/OfficeState";

export default function MyRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout headerText="Aptos Art Gallery">
            <LandingPage />
          </MainLayout>
        }
      />
      {OfficeRoutes({ office: Office.NYC })}
      {OfficeRoutes({ office: Office.BAYAREA })}
      <Route
        path="*"
        element={
          <MainLayout headerText="Aptos Art Gallery">
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

const OfficeRoutes = ({ office }: { office: Office }) => {
  const pretty = office === Office.NYC ? "NYC" : "Bay Area";
  const path = `/${office}`;

  const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <OfficeStateProvider office={office}>
        <MainLayout headerText={`Aptos Art Gallery ${pretty}`}>
          {children}
        </MainLayout>
      </OfficeStateProvider>
    );
  };

  return (
    <>
      <Route
        path={path}
        element={
          <RouteWrapper>
            <HomePage />
          </RouteWrapper>
        }
      />
      <Route
        path={`${path}/mint/:pieceId`}
        element={
          <RouteWrapper>
            <MintPage />
          </RouteWrapper>
        }
      />
      <Route
        path={`${path}/edit`}
        element={
          <RouteWrapper>
            <EditorPage />
          </RouteWrapper>
        }
      />
    </>
  );
};
