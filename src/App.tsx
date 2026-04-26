import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";


function App() {
  console.log(
    "%c🚨 EI, GENIO 🚨\n\nSe você não sabe o que está fazendo aqui,\n\nFECHA isso agora.\n\nColar código aqui pode dar ruim.\n\n💀 Você foi avisado.",
    "color: red; font-size: 22px; font-weight: bold; background: black; padding: 10px;"
  );

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
