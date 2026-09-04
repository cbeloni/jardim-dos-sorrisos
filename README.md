# Jardim dos Sorrisos

Jogo web infantil, mobile-first, para crianças a partir de 3 anos. Nesta primeira versão, a criança ajuda a Dra. Luma a lavar o rostinho sujo do coelhinho Pipo, ensaboando com o sabonete e enxaguando com a mangueirinha.

## Requisitos

- Node.js 20 ou superior;
- npm 10 ou superior.
- Redis 6 ou superior para persistir os cliques.

Confira as versões instaladas:

```bash
node --version
npm --version
```

## Instalação

Dentro desta pasta, instale as dependências:

```bash
npm install
```

## Iniciar o servidor web de desenvolvimento

```bash
npm run dev
```

O Vite exibirá o endereço local no terminal, normalmente:

```text
http://localhost:5174/
```

Para testar no celular ou tablet conectado à mesma rede, use:

```bash
npm run dev -- --host 0.0.0.0
```

Depois, abra no dispositivo o endereço de rede informado pelo Vite.

Para encerrar qualquer versão anterior deste projeto, atualizar as dependências e iniciar novamente com um único comando:

```bash
./start.sh
```

O `start.sh` fixa a porta `5174` e aceita conexões pela rede local. Para interromper o servidor iniciado por ele, use `Ctrl+C`.

## Validar uma versão de produção

Gerar os arquivos otimizados:

```bash
npm run build
```

Servir a versão gerada localmente:

```bash
npm run preview
```

O resultado do build fica na pasta `dist/`.

## Contadores dos bichinhos

Cada clique em um card do jardim é registrado pela API e persistido no Redis. Em desenvolvimento, execute a API e o Vite em terminais separados:

```bash
npm run api
npm run dev
```

O endereço do Redis pode ser configurado por ambiente:

```bash
REDIS_HOST=redis.exemplo.local REDIS_PORT=6379 npm run api
```

Se `REDIS_HOST` não estiver preenchida, a API usa `redis.default.svc.cluster.local`. Também é possível informar uma URL completa com `REDIS_URL`, que tem prioridade sobre `REDIS_HOST` e `REDIS_PORT`.

## Estrutura atual

- `index.html`: telas e marcação principal do jogo;
- `styles.css`: identidade visual e layout responsivo;
- `app.js`: navegação e lógica da atividade dental;
- `server.js`: API dos contadores e conexão com Redis;
- `manifest.webmanifest`: configuração inicial de PWA;
- `sw.js`: cache inicial para uso offline;
- `package.json`: scripts para desenvolvimento e build com Vite.
- `vite.config.js`: build com caminhos relativos para o WebView;
- `capacitor.config.ts`: configuração base para o aplicativo Android.

## Observações

- O service worker só funciona quando a aplicação é servida por HTTP; abrir `index.html` diretamente como arquivo não ativa o modo offline.
- O jogo não possui login nem coleta de dados pessoais; os contadores dos bichinhos são persistidos no Redis.
- A estrutura usa tecnologias web comuns para facilitar um futuro empacotamento Android com Capacitor.
- Ainda estão pendentes as atividades de banho, troca de fralda e a criação de ícones finais do PWA.

## Portar para Android com Capacitor

O projeto já contém configuração para gerar o aplicativo Android usando os mesmos arquivos web. Para preparar o ambiente, são necessários Node.js, o Android Studio e um Android SDK configurado.

Na primeira vez, dentro desta pasta:

```bash
npm install
npm run cap:add:android
```

Para atualizar o conteúdo web dentro do projeto Android:

```bash
npm run cap:sync
```

Para abrir no Android Studio:

```bash
npm run cap:open:android
```

Ou executar em um dispositivo/emulador conectado:

```bash
npm run cap:run:android
```

O `appId` inicial é `com.jardimdosorrisos.app` e pode ser alterado antes da publicação. Plugins nativos devem ser adicionados somente quando houver uma necessidade que não possa ser atendida pela camada web.
