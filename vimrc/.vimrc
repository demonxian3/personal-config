execute pathogen#infect()
filetype plugin indent on

"color setting
syntax on


"** defaultConf **
set nonu
set tabstop=4       "tab键长度
set softtabstop=4   "删除时长度
set shiftwidth=4    "自动tab长度
set expandtab       "禁用tab 用空格代替
set cindent         "C语言专用tab

nnoremap mm )
nnoremap mn (
nnoremap mh 0
nnoremap mk %
nnoremap me $

inoremap <C-d> <del>
nnoremap <C-c> <ESC>:w
inoremap <C-b> <Left>
inoremap <C-j> <Down>
inoremap <C-k> <Up>
inoremap <C-l> <Right>
inoremap <C-o> <ESC>o


"** NERDTree ** 
function! NERDTree_Start()  
    exec 'NERDTree'  
endfunction  
  
function! NERDTree_IsValid()  
    return 1  
endfunction  

nnoremap ,, :NERDTreeToggle<CR>

  

"** MiniBufExp **

let g:miniBufExplMapWindowNavVim = 1
let g:miniBufExplMapWindowNavArrows = 1
let g:miniBufExplMapCTabSwitchBufs = 1
let g:miniBufExplModSelTarget = 1
let g:miniBufExplMoreThanOne=0  


"** HtmlEmmet **
let g:user_emmet_leader_key='<C-Z>'



"** PreLoadPHPKey **
"set dictionary+=~/.vim/phpkeylist.txt
"set complete-=k complete+=k

" Vim 在与屏幕/键盘交互时使用的编码(取决于实际的终端的设定)        
set encoding=utf-8
set langmenu=zh_CN.UTF-8
" 设置打开文件的编码格式  
set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5,euc-jp,euc-kr,latin1 
set fileencoding=utf-8
" 解决菜单乱码
source $VIMRUNTIME/delmenu.vim
source $VIMRUNTIME/menu.vim
" 解决consle输出乱码
"set termencoding = cp936  
" 设置中文提示
language messages zh_CN.utf-8 
" 设置中文帮助
set helplang=cn
" 设置为双字宽显示，否则无法完整显示如:☆
"set ambiwidth=double
" 总是显示状态栏 
let laststatus = 2
let g:airline_powerline_fonts = 1   " 使用powerline打过补丁的字体
let g:airline_theme="dark"      " 设置主题
" 开启tabline
let g:airline#extensions#tabline#enabled = 1      "tabline中当前buffer两端的分隔字符
let g:airline#extensions#tabline#left_sep = ' '   "tabline中未激活buffer两端的分隔字符
let g:airline#extensions#tabline#left_alt_sep = '|'      "tabline中buffer显示编号
let g:airline#extensions#tabline#buffer_nr_show = 1      
" 映射切换buffer的键位
nnoremap [ :bp<CR>
nnoremap ] :bn<CR>
" 设置字体 
set guifont=Powerline_Consolas:h14:cANSI


set laststatus=2
colorscheme darkblue
set t_Co=256
set laststatus=2
set lazyredraw
let g:airline_theme='powerlineish'
" 使用powerline打过补丁的字体
let g:airline_powerline_fonts=1
if !exists('g:airline_symbols')
    let g:airline_symbols={}
endif

let g:airline_theme="luna" 

"这个是安装字体后 必须设置此项" 
let g:airline_powerline_fonts = 1   
 
"打开tabline功能,方便查看Buffer和切换，这个功能比较不错"
"我还省去了minibufexpl插件，因为我习惯在1个Tab下用多个buffer"
let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#buffer_nr_show = 1


" 关闭状态显示空白符号计数,这个对我用处不大"
let g:airline#extensions#whitespace#enabled = 0
let g:airline#extensions#whitespace#symbol = '!'

" 在Gvim中我设置了英文用Hermit， 中文使用 YaHei Mono "
set guifont=Hermit:h12
set guifontwide=Microsoft_YaHei_Mono:h12


" 关闭空白符检测
let g:airline#extensions#whitespace#enabled=0

set mouse=a
nnoremap <F9> :set mouse=a<cr>
nnoremap <F10> :set mouse=<cr>


nnoremap <F7> :set paste<cr>
nnoremap <F8> :set nopaste<cr>
