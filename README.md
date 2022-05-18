# Denoppets

*Denoppets* is a snippet plugin works on denops.vim

## Install

```viml
call plug#begin()

Plug 'vim-denops/denops.vim'
Plug 'Shougo/ddc.vim'
Plug 'kakubin/denoppets.vim'
Plug 'honza/vim-snippets'

call plug#end()

" ddc
call ddc#custom#patch_global('sources', ['denoppets'])
call ddc#custom#patch_global('sourceOptions', {
      \ 'denoppets': {'mark': 'snip'},
      \ })
call ddc#enable()

call denoppets#enable()

call denoppets#register_key_map({
      \ 'expand': '<C-e>',
      \ 'forward': '<C-b>',
      \ 'backward': '<C-z>')
```
