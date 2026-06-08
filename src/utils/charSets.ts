import type { CharSetOption } from '@/types';

export const CHAR_SETS: CharSetOption[] = [
  {
    id: 'standard',
    name: '标准密度',
    chars: '@%#*+=-:. ',
    description: '经典 10 级灰度字符',
  },
  {
    id: 'minimal',
    name: '极简',
    chars: '@#. ',
    description: '仅 4 个字符，高对比度',
  },
  {
    id: 'programming',
    name: '编程符号',
    chars: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
    description: '丰富的编程字符集',
  },
  {
    id: 'blocks',
    name: '方块字符',
    chars: '█▓▒░ ',
    description: '半色调方块字符',
  },
  {
    id: 'simple',
    name: '简洁',
    chars: '@#*+=-:. ',
    description: '8 级灰度平衡',
  },
  {
    id: 'dots',
    name: '点阵',
    chars: '●○◐◑◒◓ ',
    description: '圆形点阵字符',
  },
  {
    id: 'custom',
    name: '自定义',
    chars: '',
    description: '输入你自己的字符序列',
  },
];

export const getCharSetById = (id: string): string => {
  const set = CHAR_SETS.find(s => s.id === id);
  return set?.chars || '';
};

export const getActiveChars = (charSetId: string, customChars: string): string => {
  if (charSetId === 'custom') {
    return customChars.trim() || getCharSetById('standard');
  }
  return getCharSetById(charSetId);
};
