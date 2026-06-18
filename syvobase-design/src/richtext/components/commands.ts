import { IconName } from '@/icon'
import { $t } from '@/utils/i18n'

// 工具栏按钮 key 类型
export type ToolbarKey =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'heading'
  | 'fontSize'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'color'
  | 'backgroundColor'
  | 'blockquote'
  | 'codeBlock'
  | 'hr'
  | 'table'
  | 'link'
  | 'image'
  | 'imageUrl'
  | 'video'
  | 'videoUrl'
  | 'audio'
  | 'audioUrl'
  | 'file'
  | 'fileUrl'
  | 'align'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'orderedList'
  | 'unorderedList'
  | 'todoList'
  | 'undo'
  | 'redo'

// 命令项配置（供 SlashMenu 和 Toolbar 共享）
export interface CommandItem {
  key: ToolbarKey
  icon: IconName
  title: string
  description?: string
  keywords?: string[]
  action: (editor: any, handleBlock?: (type: string) => void) => void
}

// 创建命令列表的工厂函数
export const createCommands = (): CommandItem[] => [
  // 段落和标题
  {
    key: 'paragraph',
    icon: 'Pilcrow',
    title: $t('richtext.paragraph'),
    description: $t('richtext.paragraph.desc'),
    keywords: ['p', 'paragraph', '段落', '正文', 'text'],
    action: (editor) => editor.tf.toggleBlock('p'),
  },
  {
    key: 'h1',
    icon: 'Heading1',
    title: $t('richtext.h1'),
    description: $t('richtext.h1.desc'),
    keywords: ['h1', 'heading1', '标题', 'title'],
    action: (editor) => editor.tf.toggleBlock('h1'),
  },
  {
    key: 'h2',
    icon: 'Heading2',
    title: $t('richtext.h2'),
    description: $t('richtext.h2.desc'),
    keywords: ['h2', 'heading2', '标题'],
    action: (editor) => editor.tf.toggleBlock('h2'),
  },
  {
    key: 'h3',
    icon: 'Heading3',
    title: $t('richtext.h3'),
    description: $t('richtext.h3.desc'),
    keywords: ['h3', 'heading3', '标题'],
    action: (editor) => editor.tf.toggleBlock('h3'),
  },
  {
    key: 'h4',
    icon: 'Heading4',
    title: $t('richtext.h4'),
    description: $t('richtext.h4.desc'),
    keywords: ['h4', 'heading4', '标题'],
    action: (editor) => editor.tf.toggleBlock('h4'),
  },
  {
    key: 'h5',
    icon: 'Heading5',
    title: $t('richtext.h5'),
    description: $t('richtext.h5.desc'),
    keywords: ['h5', 'heading5', '标题'],
    action: (editor) => editor.tf.toggleBlock('h5'),
  },
  {
    key: 'h6',
    icon: 'Heading6',
    title: $t('richtext.h6'),
    description: $t('richtext.h6.desc'),
    keywords: ['h6', 'heading6', '标题'],
    action: (editor) => editor.tf.toggleBlock('h6'),
  },
  // 文本格式
  {
    key: 'bold',
    icon: 'Bold',
    title: $t('richtext.bold'),
    description: $t('richtext.bold.desc'),
    keywords: ['bold', '加粗', 'b', 'strong'],
    action: (editor) => editor.tf.toggleMark('bold'),
  },
  {
    key: 'italic',
    icon: 'Italic',
    title: $t('richtext.italic'),
    description: $t('richtext.italic.desc'),
    keywords: ['italic', '斜体', 'i', 'em'],
    action: (editor) => editor.tf.toggleMark('italic'),
  },
  {
    key: 'underline',
    icon: 'Underline',
    title: $t('richtext.underline'),
    description: $t('richtext.underline.desc'),
    keywords: ['underline', '下划线', 'u'],
    action: (editor) => editor.tf.toggleMark('underline'),
  },
  {
    key: 'strikethrough',
    icon: 'Strikethrough',
    title: $t('richtext.strikethrough'),
    description: $t('richtext.strikethrough.desc'),
    keywords: ['strikethrough', '删除线', 's', 'del'],
    action: (editor) => editor.tf.toggleMark('strikethrough'),
  },
  {
    key: 'code',
    icon: 'Code',
    title: $t('richtext.code'),
    description: $t('richtext.code.desc'),
    keywords: ['code', '代码', 'inline'],
    action: (editor) => editor.tf.toggleMark('code'),
  },
  // 块元素
  {
    key: 'blockquote',
    icon: 'Quote',
    title: $t('richtext.blockquote'),
    description: $t('richtext.blockquote.desc'),
    keywords: ['quote', 'blockquote', '引用', '引述'],
    action: (_editor, handleBlock) => handleBlock?.('blockquote'),
  },
  {
    key: 'codeBlock',
    icon: 'CodeXml',
    title: $t('richtext.codeBlock'),
    description: $t('richtext.codeBlock.desc'),
    keywords: ['code', 'codeblock', '代码', 'pre'],
    action: (_editor, handleBlock) => handleBlock?.('code_block'),
  },
  {
    key: 'hr',
    icon: 'Minus',
    title: $t('richtext.hr'),
    description: $t('richtext.hr.desc'),
    keywords: ['hr', 'divider', '分割', '分隔', 'line'],
    action: (_editor, handleBlock) => handleBlock?.('hr'),
  },
  {
    key: 'table',
    icon: 'Table',
    title: $t('richtext.table'),
    description: $t('richtext.table.desc'),
    keywords: ['table', '表格'],
    action: (_editor, handleBlock) => handleBlock?.('table'),
  },
  {
    key: 'link',
    icon: 'Link',
    title: $t('richtext.link'),
    description: $t('richtext.link.desc'),
    keywords: ['link', '链接', 'url', 'a'],
    action: (_editor, handleBlock) => handleBlock?.('link'),
  },
  {
    key: 'image',
    icon: 'Image',
    title: $t('richtext.image'),
    description: $t('richtext.image.desc'),
    keywords: ['image', 'img', '图片', '图像', 'photo', '上传'],
    action: (_editor, handleBlock) => handleBlock?.('img'),
  },
  {
    key: 'imageUrl',
    icon: 'Link',
    title: $t('richtext.imageUrl'),
    description: $t('richtext.imageUrl.desc'),
    keywords: ['image', 'img', '图片', 'url', '链接'],
    action: (_editor, handleBlock) => handleBlock?.('img_url'),
  },
  {
    key: 'video',
    icon: 'Film',
    title: $t('richtext.video'),
    description: $t('richtext.video.desc'),
    keywords: ['video', '视频', 'mp4', 'mov', '上传'],
    action: (_editor, handleBlock) => handleBlock?.('video'),
  },
  {
    key: 'videoUrl',
    icon: 'Link',
    title: $t('richtext.videoUrl'),
    description: $t('richtext.videoUrl.desc'),
    keywords: ['video', '视频', 'url', '链接'],
    action: (_editor, handleBlock) => handleBlock?.('video_url'),
  },
  {
    key: 'audio',
    icon: 'AudioLines',
    title: $t('richtext.audio'),
    description: $t('richtext.audio.desc'),
    keywords: ['audio', '音频', 'mp3', 'music', '音乐', '上传'],
    action: (_editor, handleBlock) => handleBlock?.('audio'),
  },
  {
    key: 'audioUrl',
    icon: 'Link',
    title: $t('richtext.audioUrl'),
    description: $t('richtext.audioUrl.desc'),
    keywords: ['audio', '音频', 'url', '链接'],
    action: (_editor, handleBlock) => handleBlock?.('audio_url'),
  },
  {
    key: 'file',
    icon: 'FileUp',
    title: $t('richtext.file'),
    description: $t('richtext.file.desc'),
    keywords: ['file', '文件', '附件', 'attachment', '上传'],
    action: (_editor, handleBlock) => handleBlock?.('file'),
  },
  {
    key: 'fileUrl',
    icon: 'Link',
    title: $t('richtext.fileUrl'),
    description: $t('richtext.fileUrl.desc'),
    keywords: ['file', '文件', 'url', '链接', 'download'],
    action: (_editor, handleBlock) => handleBlock?.('file_url'),
  },
  // 对齐
  {
    key: 'alignLeft',
    icon: 'AlignLeft',
    title: $t('richtext.alignLeft'),
    description: $t('richtext.alignLeft.desc'),
    keywords: ['align', 'left', '左对齐'],
    action: (editor) => editor.tf.setNodes({ align: 'left' } as any),
  },
  {
    key: 'alignCenter',
    icon: 'AlignCenter',
    title: $t('richtext.alignCenter'),
    description: $t('richtext.alignCenter.desc'),
    keywords: ['align', 'center', '居中'],
    action: (editor) => editor.tf.setNodes({ align: 'center' } as any),
  },
  {
    key: 'alignRight',
    icon: 'AlignRight',
    title: $t('richtext.alignRight'),
    description: $t('richtext.alignRight.desc'),
    keywords: ['align', 'right', '右对齐'],
    action: (editor) => editor.tf.setNodes({ align: 'right' } as any),
  },
  {
    key: 'alignJustify',
    icon: 'AlignJustify',
    title: $t('richtext.alignJustify'),
    description: $t('richtext.alignJustify.desc'),
    keywords: ['align', 'justify', '两端对齐'],
    action: (editor) => editor.tf.setNodes({ align: 'justify' } as any),
  },
  // 列表
  {
    key: 'orderedList',
    icon: 'ListOrdered',
    title: $t('richtext.orderedList'),
    description: $t('richtext.orderedList.desc'),
    keywords: ['ol', 'numbered', 'list', '列表', '有序', '编号'],
    action: (editor) => editor.tf.toggleBlock('ol'),
  },
  {
    key: 'unorderedList',
    icon: 'List',
    title: $t('richtext.unorderedList'),
    description: $t('richtext.unorderedList.desc'),
    keywords: ['ul', 'bullet', 'list', '列表', '无序'],
    action: (editor) => editor.tf.toggleBlock('ul'),
  },
  {
    key: 'todoList',
    icon: 'ListTodo',
    title: $t('richtext.todoList'),
    description: $t('richtext.todoList.desc'),
    keywords: ['todo', 'task', 'list', '待办', '任务'],
    action: (editor) => editor.tf.toggleBlock('listTodoClassic'),
  },
  // 操作
  {
    key: 'undo',
    icon: 'Undo',
    title: $t('richtext.undo'),
    description: $t('richtext.undo.desc'),
    keywords: ['undo', '撤销'],
    action: (editor) => editor.undo(),
  },
  {
    key: 'redo',
    icon: 'Redo',
    title: $t('richtext.redo'),
    description: $t('richtext.redo.desc'),
    keywords: ['redo', '重做'],
    action: (editor) => editor.redo(),
  },
]
