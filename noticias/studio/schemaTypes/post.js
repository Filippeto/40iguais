import {defineType,defineField} from 'sanity';
const imageFields=[
 defineField({name:'alt',title:'Descrição da imagem (acessibilidade)',type:'string',validation:r=>r.required()}),
 defineField({name:'credit',title:'Crédito / fotógrafo',type:'string',validation:r=>r.required()}),
 defineField({name:'caption',title:'Legenda',type:'string'}),
];
export const post=defineType({
 name:'post',title:'Notícia',type:'document',
 groups:[{name:'content',title:'Conteúdo',default:true},{name:'organization',title:'Organização'},{name:'source',title:'Autoria e fontes'}],
 initialValue:()=>({kind:'curadoria',category:'ATP',author:'40iguais',publishedAt:new Date().toISOString(),featured:false}),
 fields:[
  defineField({name:'title',title:'Título',type:'string',group:'content',validation:r=>r.required().max(140)}),
  defineField({name:'slug',title:'Endereço da matéria',type:'slug',group:'content',options:{source:'title',maxLength:96},validation:r=>r.required().custom(v=>!v?.current||(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.current)&&!['index','404','admin','projeto','sobre-o-40iguais','entenda-o-circuito'].includes(v.current))||'Use letras minúsculas, números e hífens. Este endereço pode estar reservado.')}),
  defineField({name:'summary',title:'Resumo / subtítulo',type:'text',rows:3,group:'content',validation:r=>r.required().max(300)}),
  defineField({name:'kicker',title:'Chamada curta',type:'string',group:'content'}),
  defineField({name:'cover',title:'Imagem de capa',type:'image',options:{hotspot:true},fields:imageFields,group:'content',validation:r=>r.required().assetRequired()}),
    defineField({
    name: 'body',
    title: 'Texto da matéria',
    type: 'array',
    group: 'content',
    of: [
      {
        type: 'block',
        styles: [
          {title: 'Parágrafo', value: 'normal'},
          {title: 'Subtítulo', value: 'h2'},
          {title: 'Intertítulo', value: 'h3'},
          {title: 'Citação', value: 'blockquote'}
        ]
      },
      {
        type: 'image',
        options: {hotspot: true},
        fields: imageFields
      }
    ],
    validation: r => r.required().min(1)
  }),
  defineField({name:'take',title:'Leitura do 40iguais',description:'Seu contexto ou comentário editorial. Opcional.',type:'text',rows:4,group:'content'}),
  defineField({name:'category',title:'Categoria',type:'string',group:'organization',options:{list:[{title:'ATP',value:'ATP'},{title:'WTA',value:'WTA'},{title:'Duplas',value:'Duplas'},{title:'Além da quadra',value:'Cultura'}]},validation:r=>r.required()}),
  defineField({name:'players',title:'Tenistas',type:'array',of:[{type:'string'}],options:{layout:'tags'},group:'organization'}),
  defineField({name:'tournament',title:'Torneio',type:'string',group:'organization'}),
  defineField({name:'featured',title:'Destaque na página inicial',description:'Se houver mais de um destaque, aparece primeiro o mais recente.',type:'boolean',group:'organization'}),
  defineField({name:'publishedAt',title:'Data da publicação',description:'Informe uma data atual ou passada. Agendamento ainda não configurado.',type:'datetime',group:'organization',validation:r=>r.required().custom(v=>!v||Date.parse(v)<=Date.now()||'Use uma data atual ou passada.')}),
  defineField({name:'kind',title:'Tipo de publicação',type:'string',group:'source',options:{list:[{title:'Curadoria de notícia',value:'curadoria'},{title:'Matéria própria',value:'propria'}]},validation:r=>r.required()}),
  defineField({name:'author',title:'Autor / responsável pela curadoria',type:'string',group:'source',validation:r=>r.required()}),
  defineField({name:'sourceName',title:'Nome da fonte original',type:'string',group:'source',validation:r=>r.custom((v,ctx)=>ctx.document?.kind==='curadoria'&&!v?'Informe a fonte original.':true)}),
  defineField({name:'sourceUrl',title:'Link da reportagem original',type:'url',group:'source',validation:r=>r.uri({scheme:['http','https']}).custom((v,ctx)=>ctx.document?.kind==='curadoria'&&!v?'Informe o link original.':true)}),
 ],
 orderings:[{title:'Mais recentes',name:'newest',by:[{field:'publishedAt',direction:'desc'}]}],
 preview:{select:{title:'title',subtitle:'category',media:'cover'}},
});
