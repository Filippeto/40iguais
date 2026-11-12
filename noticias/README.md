# 40iguais · Portal de notícias

Site estático com painel Sanity Studio. Projeto `cxk75bbp`, dataset público `production`. O portal busca documentos publicados durante a geração das páginas; rascunhos não entram no site.

Leia [ATIVAR-CMS.md](ATIVAR-CMS.md) para ativar o painel, o GitHub Pages e o webhook de publicação. As configurações de conta ainda precisam ser concluídas pelo titular.

Na pasta noticias, execute `node --test cms.test.mjs` e `node build.mjs`. O build usa `public/` para os assets e gera `dist/`. Para o painel, entre em `studio/`, execute `npm ci` e `npm run build`. Depois, na pasta noticias, execute `node assemble.mjs` e `node check.mjs`.

O workflow inclui a apresentação atual do repositório em `/projeto/`. O conteúdo de arquivo permanece visível enquanto não houver notícias no CMS. A newsletter ainda não coleta inscrições. Fontes e imagens do acervo foram fornecidas pelo projeto.
