# Publicando o backend do admin (Cloudflare Worker + KV)

Tudo isso é feito **pelo próprio site da Cloudflare**, sem precisar instalar nada no computador.

## 1. Criar a "gaveta" de dados (KV Namespace)

1. Entre em https://dash.cloudflare.com
2. No menu lateral, procure **Workers & Pages** → aba **KV**
3. Clique em **Create a namespace**
4. Dê o nome `V8_CONFIG_KV` e clique em **Add**

## 2. Criar o Worker

1. Ainda em **Workers & Pages**, clique em **Create application** → **Create Worker**
2. Dê um nome, por exemplo `v8digital-api` (a URL final vai ser algo como `v8digital-api.SEU-USUARIO.workers.dev`)
3. Clique em **Deploy** (ele vai subir um Worker padrão, vazio — tudo bem, já ajustamos)
4. Clique em **Edit code** (ou "Quick edit")
5. Apague todo o conteúdo do editor e cole o conteúdo do arquivo `worker/index.js` deste projeto
6. Clique em **Save and deploy**

## 3. Conectar o Worker à gaveta (KV)

1. No Worker que você criou, vá em **Settings** → **Variables**
2. Procure a seção **KV Namespace Bindings**
3. Clique em **Add binding**
4. Em **Variable name**, digite exatamente: `CONFIG_KV`
5. Em **KV namespace**, selecione o `V8_CONFIG_KV` que você criou no passo 1
6. Salve

## 4. Configurar login e segredo (Secrets)

Ainda em **Settings** → **Variables**, seção **Environment Variables**:

1. Clique em **Add variable**, marque como **Encrypt** (secreta), e crie:
   - `ADMIN_EMAIL` → o e-mail que você vai usar pra logar no admin
   - `ADMIN_PASSWORD_HASH` → veja abaixo como gerar
   - `AUTH_SECRET` → qualquer texto longo e aleatório (ex: gere em https://passwordsgenerator.net/ com uns 40 caracteres)
2. Adicione também, **sem marcar como secreta**:
   - `ALLOWED_ORIGIN` → o endereço do seu site, ex: `https://v8digital.pages.dev`

### Como gerar o `ADMIN_PASSWORD_HASH`

O Worker nunca deve receber sua senha "pura" guardada — ele guarda o hash (uma versão embaralhada, sem volta) dela. Pra gerar o hash da senha que você quer usar:

1. Abra o Console do navegador (F12 → aba "Console") em qualquer site
2. Cole e rode (trocando `SUA_SENHA_AQUI` pela senha escolhida):

```js
crypto.subtle.digest("SHA-256", new TextEncoder().encode("SUA_SENHA_AQUI"))
  .then(buf => console.log([...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join("")));
```

3. Copie o texto longo que aparecer (isso é o hash) e cole como valor de `ADMIN_PASSWORD_HASH`

## 5. Apontar o site pro Worker

1. Copie a URL do seu Worker (aparece no topo da página dele, algo como `https://v8digital-api.SEU-USUARIO.workers.dev`)
2. Abra o arquivo `js/config.js` do site e troque `baseUrl` por essa URL
3. Publique o site normalmente no Cloudflare Pages, como você já faz

## Pronto

- O site vai buscar WhatsApp/e-mail/Pixel/Analytics do Worker automaticamente
- O `/admin` vai logar de verdade e salvar as configurações no Worker
- Pra trocar a senha depois, é só gerar um novo hash (passo 4) e atualizar o secret `ADMIN_PASSWORD_HASH`
