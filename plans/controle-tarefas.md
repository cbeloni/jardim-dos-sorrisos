# Controle de tarefas — Jardim dos Sorrisos

Legenda: `[x]` concluído · `[/]` em andamento · `[ ]` pendente

## Fundação do MVP

- [x] Criar estrutura inicial do projeto web em `jardim-dos-sorrisos/`.
- [x] Definir identidade visual, nome e personagem principal.
- [x] Criar tela inicial com acesso ao jardim de pacientes.
- [x] Criar fluxo jogável da atividade de lavar o rostinho (Pipo).
- [x] Implementar interação por toque e arrastar com Pointer Events.
- [x] Adicionar feedback visual, instruções curtas e celebração final.
- [x] Mostrar o rosto do Pipo com manchinhas de sujeira no início da atividade.
- [x] Animar o sabonete gerando espuma no rosto e o enxágue com a mangueirinha.
- [x] Tornar o layout responsivo para celular e tablet.
- [x] Adicionar suporte inicial a instalação/offline como PWA.
- [x] Criar estrutura de inicialização como servidor web com Vite.
- [x] Preparar configuração e scripts compatíveis com Capacitor para futura versão Android.
- [x] Criar `README.md` com instruções de instalação, desenvolvimento e build.
- [x] Corrigir carregamento do JavaScript como módulo e validar inicialização/build do Vite.
- [x] Corrigir conflito do service worker de desenvolvimento com o CSS do Vite.
- [x] Criar `start.sh` para encerrar versões anteriores, atualizar dependências e iniciar o servidor.
- [x] Fixar a porta `5174` no `start.sh` e atualizar as instruções de acesso.
- [x] Criar corpos em pé e roupas para os bichinhos, mantendo suas características animais.
- [x] Remover corpos e roupas dos bichinhos, restaurando a apresentação original.
- [x] Usar o rosto de referência como base interativa da atividade de limpeza.
- [x] Remover estetoscópio do rosto e reposicionar a sujeira somente dentro da face.
- [x] Validar sintaxe do JavaScript e conferir os arquivos gerados.

## Próximas tarefas

- [ ] Implementar atividade de banho.
- [ ] Implementar atividade de troca de fralda.
- [ ] Adicionar narração e efeitos sonoros licenciados.
- [ ] Adicionar persistência das preferências de áudio.
- [ ] Testar a experiência em navegadores móveis reais.
- [ ] Empacotar e testar a primeira versão Android com Capacitor.
- [ ] Fazer teste de usabilidade com responsáveis e crianças, com autorização.
- [x] Corrigir contexto do Docker e caminho dos manifests no workflow do GitHub Actions.

## Deploy (GitHub Actions)

- [x] Workflow inspirado no projeto `rateio`: build Docker → Docker Hub → kubectl → manifests K8s.
- [x] `Dockerfile` multi-estágio (build Vite + nginx) e `nginx.conf` para SPA/PWA.
- [x] Manifests K8s em `k8s/` (Deployment, Service e Ingress para `jardim-dos-sorrisos.beloni.dev.br`).
- [x] Mover `sw.js` e `manifest.webmanifest` para `public/` e corrigir o service worker (cache dinâmico) — PWA funcional no `dist/`.
- [x] Criar `.dockerignore` para manter o contexto de build enxuto.
- [ ] Configurar secrets no repositório GitHub (`DOCKERHUB_TOKEN` e `KUBECONFIG_MGC`).
- [ ] Configurar o DNS de `jardim-dos-sorrisos.beloni.dev.br`.
- [ ] Fazer o primeiro push para o GitHub e validar o pipeline.

## Registro de implementação

### 2026-08-31 — Primeira versão jogável

- Criada a experiência inicial com a Dra. Luma, o coelhinho Pipo e a atividade dental.
- O jogador escolhe a escova, arrasta sobre as áreas dos dentes, enxágua e recebe uma recompensa.
- As atividades de banho e fralda aparecem como próximas aventuras, sem prometer funcionalidades ainda não implementadas.

### 2026-08-31 — Interação direta com a escova e a mangueirinha

- Removido o botão "Escolher escova": a escova fica livre para arrastar assim que a atividade abre.
- A escova segue o dedo da criança e limpa os dentinhos ao passar sobre eles.
- Removido o botão "Enxaguar com a mangueirinha": a criança arrasta a mangueirinha sobre a boca para enxaguar.
- Enquanto a mangueirinha é arrastada sobre a boca, os respingos de água animam e o enxágue avança até concluir.
- Os dentes agora aparecem dentro da boca do Pipo (posição ajustada), com o sorriso abrindo ao iniciar a atividade.
- Teclado (acessibilidade): Enter/Espaço na escova limpa os dentes; na mangueirinha, enxagua.

### 2026-08-31 — Mudança de estratégia: lavar o rostinho do Pipo

- A atividade deixa de ser sobre dentes e passa a ser uma lavagem do rostinho.
- O rosto do Pipo aparece com 4 manchinhas de sujeira.
- Um sabonete substitui a escova: ao arrastar o sabonete sobre uma manchinha, ela some e aparece espuma de sabão no rosto.
- Depois de ensaboar tudo, a criança arrasta a mangueirinha sobre a espuma para enxaguar até o rosto ficar limpo.
- Atualizados os textos da atividade e o card do Pipo no jardim ("Rostinho sujo").
- Validado no navegador: ensaboar remove as manchinhas e mostra a espuma; enxaguar remove a espuma; recomeçar reseta a atividade.
- Acessibilidade por teclado: Enter/Espaço ensaboa tudo (sabonete) e enxagua (mangueirinha).

### 2026-08-31 — Sujeira no formato do rosto e utensílios com progresso gradual

- Sujeira com formato irregular, posicionada sobre as feições do rosto do coelho (bochechas, testa e queixo).
- Sabão e mangueira ficam sempre visíveis embaixo do quadro; apenas o utensílio da fase atual fica selecionável (o outro aparece esmaecido/desabilitado).
- Com sujeira no rosto, só o sabonete pode ser usado; com tudo ensaboado, só a mangueirinha.
- O sabão aparece gradativamente conforme o tempo que a criança segura o sabonete sobre a manchinha.
- A água também remove o sabão gradativamente conforme o tempo de contato da mangueirinha.
- Validado no navegador: progresso gradual (parcial → completo), troca de ferramenta por fase e recomeço limpo.

### 2026-08-31 — Rosto do coelho desenhado, maior e sem corpo

- Removidos o corpo/vestido e o emoji; o rosto do Pipo agora é desenhado em CSS (orelhas, cabeça, olhos, nariz e bochechas).
- O rosto preenche praticamente todo o quadro da atividade, em qualquer tamanho de tela.
- Corrigida a sobreposição: sujeira e sabão agora aparecem por cima do rosto (z-index acima das feições).
- Sujeira/sabão posicionados em porcentagem sobre as feições (bochechas, testa e queixo) para acompanhar o tamanho do rosto.

### 2026-08-31 — Identidade do rosto alinhada ao card do Pipo

- O rosto desenhado passou a usar as mesmas cores do card do Pipo: cabeça branca/cinza-claro e orelhas com parte interna rosa.
- Mantido apenas o rosto (sem corpo), grande e preenchendo o quadro.

### 2026-08-31 — Deploy com GitHub Actions (jardim-dos-sorrisos.beloni.dev.br)

- Criado workflow em `.github/workflows/main.yml` (push em `main`): build Docker → Docker Hub → kubectl → aplica manifests.
- Criado `Dockerfile` multi-estágio (Node + nginx) e `nginx.conf` com cache de assets e tratamento de PWA.
- Criados manifests em `k8s/`: Deployment, Service e Ingress para `jardim-dos-sorrisos.beloni.dev.br` (padrão Traefik, igual ao `rateio`).
- Corrigido o build do PWA: `sw.js` e `manifest.webmanifest` movidos para `public/` e service worker com cache dinâmico.
- Validado localmente: `npm run build` gera `dist/` com `sw.js` e `manifest.webmanifest` na raiz.

### 2026-08-31 — Bichinhos maiores no jardim

- Os cards do jardim passaram a usar `patient-emoji` (emojis); adicionada regra de tamanho: 110px no desktop e 80px no mobile.
- Altura mínima dos cards aumentada (240px desktop / 205px mobile) para acomodar os emojis maiores.
- Validado no navegador: emojis maiores sem estourar os cards (desktop e mobile).
