# 📸 Nosso Mural de Memórias

Um mural fotográfico interativo e elegante, desenvolvido para imortalizar momentos especiais. O projeto consome dados em tempo real do **Firebase Realtime Database**, com foco em performance mobile e design minimalista.

Veja o site [aqui](https://pinkmath.github.io/mural/)

## ✨ Funcionalidades

- **Dashboard Administrativo:** Interface para upload de fotos em lote (suporte a pastas e arquivos .ZIP).
- **Processamento de Imagem:** Conversão automática para **WebP** e compressão inteligente via Canvas para garantir carregamento instantâneo no celular.
- **Visualização Imersiva:** Galeria organizada por meses com sistema de Lightbox para navegação detalhada.
- **Zero Scroll Delay:** Renderização estática otimizada para evitar atrasos de carregamento em dispositivos iOS (Safari).
- **Design Minimalista:** Estética baseada em tipografia (Bebas Neue) e tons escuros com detalhes em "Crimson" (#C2003E).

---

## 🛠️ Tecnologias Utilizadas

- **React.js** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Firebase** (Realtime Database para persistência de dados)
- **JSZip** (Para processamento de arquivos compactados)

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/PinkMath/mural.git](https://github.com/PinkMath/mural.git)
   cd mural

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o Firebase:**
- Crie um projeto no Firebase Console.
- Ative o Realtime Database.
- Crie um arquivo src/lib/firebase.ts e adicione suas credenciais:

```
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

4. **Inicie o servidor de desinvyvimento:**
```bash
npm run dev
```

---

## 📂 Estrutura de Pastas
- src/components: Componentes visuais (Mural, Seções de Mês, Lightbox).
- src/hooks: Lógica customizada (Conexão Firebase, Processamento de Imagens).
- src/pages/dev: Dashboard de administração e upload.
- src/mocks: Estrutura de dados inicial.

---

## 📄 Licença
Este projeto é de uso pessoal e educacional. Desenvolvido com ❤️ por 3A.
