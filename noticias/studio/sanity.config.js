import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {post} from './schemaTypes/post.js';

export default defineConfig({
 name:'40iguais',title:'40iguais · Redação',projectId:'cxk75bbp',dataset:'production',
 plugins:[structureTool()],schema:{types:[post]},
});
