# Ativar o painel do 40iguais

Projeto Sanity: `cxk75bbp` · Dataset: `production` (público).

## 1. Autorizar o endereço do painel

Em https://www.sanity.io/manage, abra o projeto 40iguais e vá em Settings → API settings → CORS Origins → Add CORS origin.

- Origin: `https://filippeto.github.io` (sem `/40iguais`).
- Allow credentials: ativado, pois o painel faz login e edita como seu usuário.

Isso permite que seu painel converse com o Sanity. Só membros autorizados do projeto conseguem editar. Nenhum token de escrita vai no site ou no repositório.

## 2. Publicar a integração no GitHub

Extraia o ZIP de integração. No repositório Filippeto/40iguais, use Add file → Upload files e arraste as duas pastas extraídas: `noticias` e `.github`. Faça o commit dos arquivos. Os arquivos da apresentação existentes na raiz permanecem no repositório.

Depois vá em Settings → Pages → Build and deployment → Source e selecione GitHub Actions. Em Actions → Publicar 40iguais, execute Run workflow na branch main se a primeira execução não tiver concluído. A primeira compilação do painel ainda precisa ser validada pelo workflow; se falhar, o site anterior continua no ar.

Depois de uma execução bem-sucedida:

- Portal: https://filippeto.github.io/40iguais/
- Painel: https://filippeto.github.io/40iguais/admin/
- Apresentação anterior: https://filippeto.github.io/40iguais/projeto/

As URLs de destino acima só ficam disponíveis depois da publicação. Entre no painel com a conta GitHub usada no Sanity.

## 3. Publicar sua primeira notícia

No painel, escolha Notícia e crie um documento. Preencha título, endereço (Generate), resumo, imagem e créditos, texto, categoria, autoria e fonte. Clique em Publish. Rascunhos não entram no portal.

Enquanto o CMS estiver vazio, o portal mantém a seleção de arquivo, claramente identificada. Depois da primeira notícia publicada, a lista passa a usar suas notícias, além dos guias fixos. O destaque é a notícia marcada como destaque mais recente; sem marcações, é a mais recente.

Para atualizar o site antes de configurar a automação: GitHub → Actions → Publicar 40iguais → Run workflow. Publicar no Sanity sozinho ainda não dispara o GitHub até concluir o passo 4.

## 4. Automatizar a atualização após Publish

Crie no GitHub um fine-grained personal access token limitado ao repositório `Filippeto/40iguais`, com Contents: Read and write e validade definida. Ele autoriza o webhook a disparar a atualização; essa permissão também permite alterar código. Guarde-o somente no cabeçalho do webhook no Sanity. Nunca envie o token pelo chat nem coloque em arquivos públicos.

No Sanity → API settings → Webhooks, crie:

- Nome: `Publicar 40iguais`.
- Dataset: `production`.
- URL: `https://api.github.com/repos/Filippeto/40iguais/dispatches`.
- Método: `POST`.
- Trigger on: Create, Update e Delete (também atende retirar uma notícia do ar).
- Drafts e Versions: desativados.
- Filter: `_type == "post"`.
- Projection: `{"event_type":"sanity-publish"}`.
- HTTP headers: `Authorization` com valor `Bearer SEU_TOKEN` e `Accept` com valor `application/vnd.github+json`.
- Status: Enabled.

O campo Secret do Sanity não substitui o cabeçalho Authorization do GitHub. Não use um link de compartilhamento do webhook contendo seu token.

Publique uma notícia de teste e confira o registro de entrega do webhook (GitHub aceita o disparo com HTTP 204). Confira a execução de Actions e depois o portal. A atualização acontece após a geração e implantação das páginas, não instantaneamente. Se o token expirar, renove-o no cabeçalho do webhook.

## Uso e limites desta primeira versão

- Datas futuras não são aceitas; agendamento ainda não está configurado.
- Rascunhos, conteúdo publicado e imagens ficam no Sanity. O portal recebe apenas documentos publicados.
- O pipeline não copia o conteúdo de reportagens externas: você escreve seu resumo e informa a fonte.
- Qualquer erro de leitura ou validação impede uma nova publicação; a versão anterior continua no ar.
- Fotos da capa são entregues pelo CDN do Sanity em tamanhos responsivos. Use fotos com composição adequada para recortes de capa.
- Para reconhecer o Studio no Dashboard/Media Library do Sanity, é possível registrar o painel após o primeiro deploy: na pasta `noticias/studio`, com Node 24 e npm, execute `npm ci`, `npx sanity login` e `npm run register`. Esse registro não é necessário para escrever no painel hospedado.

## Desenvolvimento

Na pasta `noticias`: `node --test cms.test.mjs`, `node build.mjs`.
Na pasta `noticias/studio`: `npm ci`, `npm run build`.
De volta à pasta `noticias`: `node assemble.mjs`, `node check.mjs`.

O workflow faz a mesma sequência e conserva a apresentação da raiz do repositório em `/projeto/`. Uma nova geração remove páginas antigas, para que matérias retiradas do ar ou renomeadas não permaneçam acessíveis no pacote publicado.
