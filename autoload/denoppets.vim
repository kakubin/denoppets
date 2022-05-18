function! denoppets#enable() abort
  if denops#plugin#is_loaded('denoppets')
    return
  endif

  if exists('g:loaded_denops') && denops#server#status() ==# 'running'
    silent! call denoppets#_register()
  endif
endfunction

function! denoppets#_register() abort
  call denops#plugin#register('denoppets',
        \ denops#util#join_path(s:root_dir, 'denops', 'denoppets', 'main.ts'),
        \ { 'mode': 'debug' })
endfunction

let g:denoppets#key_map = {
      \ 'expand': '<C-e>',
      \ 'forward': '<C-b>',
      \ 'backward': '<C-z>',
      \ 'edit': '<C-d>'}

function! denoppets#register_key_map(new_key_map) abort
  let g:denoppets#key_map = extend(g:denoppets#key_map, a:new_key_map)
endfunction

function! denoppets#expand_snippet() abort
  if s:denoppets#can_expand_snippet()
    g:denops#notify('denoppets', 'expandSnippet', [])
  endif
endfunction

function! denoppets#jump_forwards() abort
  if s:denoppets#can_jump_forwards()
    g:denops#notify('denoppets', 'jumpForwards', [])
  endif
endfunction

function! denoppets#jump_backwards() abort
  if s:denoppets#can_jump_backwards()
    g:denops#notify('denoppets', 'jumpBackwards', [])
  endif
endfunction

function! denoppets#can_expand_snippet() abort
  g:denops#request('denoppets', 'canExpandSnippet', [])
endfunction

function! denoppets#can_jump_forwards() abort
  g:denops#request('denoppets', 'canJumpForwards', [])
endfunction

function! denoppets#can_jump_backwards() abort
  g:denops#request('denoppets', 'canJumpBackwards', [])
endfunction
