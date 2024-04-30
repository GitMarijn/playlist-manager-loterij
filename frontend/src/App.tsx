import { httpBatchLink } from "@trpc/client";
import type { TRPCRouter } from "../../backend/src/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { SongsByArtistPage } from "./pages/SongsByArtistPage";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

const BACKEND_URL = "http://localhost:8080/trpc";
export const trpc = createTRPCReact<TRPCRouter>();

function App() {
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: BACKEND_URL,
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/songs/:artist' element={<SongsByArtistPage />} />
            </Routes>
          </QueryParamProvider>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
